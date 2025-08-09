# app.py

import warnings
# Suppress specific warnings for cleaner output
warnings.filterwarnings('ignore', category=UserWarning, module='sklearn')
warnings.filterwarnings('ignore', category=FutureWarning, module='pandas')
warnings.filterwarnings('ignore', category=DeprecationWarning, module='numpy')

import streamlit as st
import pandas as pd
from datetime import date, timedelta
import os

# Import your existing functions and modules
from config import validate_api_key
from qa_system import create_qa_chain
from sentiment_analyzer import (
    load_financial_data,
    extract_text_for_sentiment,
    get_sentiment_pipeline,
    analyze_sentiment
)
from forecasting_model import fetch_stock_data
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split

# Global variables and caching for performance
@st.cache_data
def get_sentiment_data():
    """Loads and analyzes sentiment data once."""
    raw_df = load_financial_data()
    if raw_df is None: return None
    processed_df = extract_text_for_sentiment(raw_df)
    sentiment_pipeline = get_sentiment_pipeline()
    sentiment_df = analyze_sentiment(processed_df, sentiment_pipeline)
    
    # Calculate average sentiment for forecasting model
    sentiment_df['sentiment_numeric'] = sentiment_df['sentiment_label'].apply(
        lambda x: 1 if x == 'POSITIVE' else (-1 if x == 'NEGATIVE' else 0)
    )
    average_sentiment = sentiment_df['sentiment_numeric'].mean()
    return average_sentiment, sentiment_df

@st.cache_resource
def get_qa_chain():
    """Initializes and caches the Q&A chain."""
    if not validate_api_key():
        st.error("GOOGLE_API_KEY not configured. Please check your .env file.")
        return None
    
    try:
        with st.spinner("⏳ Loading Q&A model..."):
            # Set environment variable before creating the chain
            import os
            from config import get_google_api_key
            os.environ['GOOGLE_API_KEY'] = get_google_api_key()
            
            # Import here to avoid initialization issues
            import asyncio
            
            # Create new event loop if needed
            try:
                asyncio.get_event_loop()
            except RuntimeError:
                asyncio.set_event_loop(asyncio.new_event_loop())
            
            return create_qa_chain()
    except Exception as e:
        st.error(f"❌ Error initializing Q&A system: {e}")
        return None

# TradeX: Stock Comparison Tool ⚖️
@st.cache_data
def compare_stocks(symbol1, symbol2, period="1y"):
    """Compare two stocks based on performance and sentiment analysis."""
    try:
        import yfinance as yf
        import plotly.graph_objects as go
        from plotly.subplots import make_subplots
        
        # Fetch stock data for both symbols
        stock1 = yf.Ticker(symbol1)
        stock2 = yf.Ticker(symbol2)
        
        # Get historical data
        hist1 = stock1.history(period=period)
        hist2 = stock2.history(period=period)
        
        if hist1.empty or hist2.empty:
            return None, "Error: Could not fetch data for one or both stocks"
        
        # Calculate performance metrics
        stock1_return = ((hist1['Close'].iloc[-1] - hist1['Close'].iloc[0]) / hist1['Close'].iloc[0]) * 100
        stock2_return = ((hist2['Close'].iloc[-1] - hist2['Close'].iloc[0]) / hist2['Close'].iloc[0]) * 100
        
        # Calculate volatility (standard deviation of returns)
        stock1_volatility = hist1['Close'].pct_change().std() * 100
        stock2_volatility = hist2['Close'].pct_change().std() * 100
        
        # Get company info
        info1 = stock1.info
        info2 = stock2.info
        
        comparison_data = {
            'symbols': [symbol1, symbol2],
            'names': [info1.get('longName', symbol1), info2.get('longName', symbol2)],
            'returns': [stock1_return, stock2_return],
            'volatility': [stock1_volatility, stock2_volatility],
            'current_price': [hist1['Close'].iloc[-1], hist2['Close'].iloc[-1]],
            'market_cap': [info1.get('marketCap', 'N/A'), info2.get('marketCap', 'N/A')],
            'pe_ratio': [info1.get('trailingPE', 'N/A'), info2.get('trailingPE', 'N/A')],
            'hist_data': [hist1, hist2]
        }
        
        return comparison_data, None
        
    except Exception as e:
        return None, f"Error comparing stocks: {str(e)}"

@st.cache_data
def get_sentiment_for_company(company_name):
    """Get sentiment analysis for a specific company from financial documents."""
    try:
        # Load sentiment data
        sentiment_result = get_sentiment_data()
        if sentiment_result is None:
            return None
        
        _, sentiment_df = sentiment_result
        
        # Filter for the specific company (case-insensitive)
        company_data = sentiment_df[
            sentiment_df['text'].str.contains(company_name, case=False, na=False)
        ]
        
        if company_data.empty:
            return None
        
        # Calculate average sentiment for the company
        avg_sentiment = company_data['sentiment_numeric'].mean()
        sentiment_counts = company_data['sentiment_label'].value_counts()
        
        return {
            'avg_sentiment': avg_sentiment,
            'sentiment_distribution': sentiment_counts.to_dict(),
            'total_documents': len(company_data)
        }
        
    except Exception as e:
        st.error(f"Error analyzing company sentiment: {e}")
        return None

# --- Main App Logic ---

st.set_page_config(
    page_title="FinDocGPT",
    page_icon="🤖",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Sidebar for inputs
with st.sidebar:
    st.image("https://assets-global.website-files.com/62496a7516d00438a25c3451/653063f915758c0678d227f5_fintech.webp", width=250)
    st.header("Project Inputs")
    
    # Analysis Mode Selection
    analysis_mode = st.radio(
        "Choose Analysis Mode:",
        ["📊 Single Stock Analysis", "⚖️ TradeX: Stock Comparison"],
        help="Select between analyzing one stock or comparing two stocks"
    )
    
    if analysis_mode == "📊 Single Stock Analysis":
        ticker = st.text_input("Enter a Stock Ticker (e.g., MMM)", value="MMM").upper()
        
        st.subheader("Q&A System (Optional)")
        qa_question = st.text_input(
            "Ask a question about the financial documents", 
            value="What is the FY2018 capital expenditure amount for 3M?"
        )
        enable_qa = st.checkbox("Enable Q&A System", value=False, help="⚠️ May have compatibility issues with some environments")
        
        analyze_button = st.button("🚀 Run Analysis", type="primary")
    
    else:  # TradeX Stock Comparison
        st.subheader("⚖️ TradeX: Compare Two Stocks")
        col1, col2 = st.columns(2)
        
        with col1:
            stock1 = st.text_input("Stock 1 (e.g., AAPL)", value="AAPL").upper()
        with col2:
            stock2 = st.text_input("Stock 2 (e.g., MSFT)", value="MSFT").upper()
        
        comparison_period = st.selectbox(
            "Comparison Period:",
            ["1mo", "3mo", "6mo", "1y", "2y", "5y"],
            index=3,
            help="Select the time period for comparison"
        )
        
        compare_button = st.button("⚖️ Compare Stocks", type="primary")

# --- Page Content ---

st.title("FinDocGPT: AI for Financial Document Analysis & Strategy")
st.markdown("---")

if not validate_api_key():
    st.error("❌ GOOGLE_API_KEY not found. Please add it to your .env file.")
else:
    st.success("✅ GOOGLE_API_KEY configured successfully!")
    
    # Handle different analysis modes
    if analysis_mode == "⚖️ TradeX: Stock Comparison" and compare_button:
        if not stock1 or not stock2:
            st.warning("Please enter both stock symbols for comparison.")
        elif stock1 == stock2:
            st.warning("Please enter different stock symbols for comparison.")
        else:
            st.header("⚖️ TradeX: Stock Comparison Analysis")
            
            with st.spinner("Analyzing and comparing stocks..."):
                # Get comparison data
                comparison_data, error = compare_stocks(stock1, stock2, comparison_period)
                
                if error:
                    st.error(error)
                else:
                    # Display comparison results
                    col1, col2, col3 = st.columns(3)
                    
                    with col1:
                        st.metric(
                            f"{stock1} Return ({comparison_period})",
                            f"{comparison_data['returns'][0]:.2f}%",
                            delta=f"{comparison_data['returns'][0]:.2f}%"
                        )
                    
                    with col2:
                        st.metric(
                            f"{stock2} Return ({comparison_period})",
                            f"{comparison_data['returns'][1]:.2f}%",
                            delta=f"{comparison_data['returns'][1]:.2f}%"
                        )
                    
                    with col3:
                        winner = stock1 if comparison_data['returns'][0] > comparison_data['returns'][1] else stock2
                        performance_diff = abs(comparison_data['returns'][0] - comparison_data['returns'][1])
                        st.metric(
                            "Performance Leader",
                            winner,
                            delta=f"+{performance_diff:.2f}% advantage"
                        )
                    
                    # Detailed comparison table
                    st.subheader("📊 Detailed Comparison")
                    comparison_df = pd.DataFrame({
                        'Metric': ['Company Name', 'Current Price', 'Return (%)', 'Volatility (%)', 'Market Cap', 'P/E Ratio'],
                        stock1: [
                            comparison_data['names'][0],
                            f"${comparison_data['current_price'][0]:.2f}",
                            f"{comparison_data['returns'][0]:.2f}%",
                            f"{comparison_data['volatility'][0]:.2f}%",
                            comparison_data['market_cap'][0],
                            comparison_data['pe_ratio'][0]
                        ],
                        stock2: [
                            comparison_data['names'][1],
                            f"${comparison_data['current_price'][1]:.2f}",
                            f"{comparison_data['returns'][1]:.2f}%",
                            f"{comparison_data['volatility'][1]:.2f}%",
                            comparison_data['market_cap'][1],
                            comparison_data['pe_ratio'][1]
                        ]
                    })
                    st.dataframe(comparison_df, use_container_width=True)
                    
                    # Price comparison chart
                    st.subheader("📈 Price Performance Comparison")
                    import plotly.graph_objects as go
                    
                    fig = go.Figure()
                    
                    # Normalize prices to show percentage change
                    hist1_norm = (comparison_data['hist_data'][0]['Close'] / comparison_data['hist_data'][0]['Close'].iloc[0] - 1) * 100
                    hist2_norm = (comparison_data['hist_data'][1]['Close'] / comparison_data['hist_data'][1]['Close'].iloc[0] - 1) * 100
                    
                    fig.add_trace(go.Scatter(
                        x=hist1_norm.index,
                        y=hist1_norm,
                        mode='lines',
                        name=f"{stock1} ({comparison_data['names'][0]})",
                        line=dict(color='#1f77b4', width=2)
                    ))
                    
                    fig.add_trace(go.Scatter(
                        x=hist2_norm.index,
                        y=hist2_norm,
                        mode='lines',
                        name=f"{stock2} ({comparison_data['names'][1]})",
                        line=dict(color='#ff7f0e', width=2)
                    ))
                    
                    fig.update_layout(
                        title=f"Normalized Price Performance: {stock1} vs {stock2}",
                        xaxis_title="Date",
                        yaxis_title="Return (%)",
                        hovermode='x unified',
                        template="plotly_white"
                    )
                    
                    st.plotly_chart(fig, use_container_width=True)
                    
                    # Sentiment analysis comparison
                    st.subheader("😊 Sentiment Analysis Comparison")
                    col1, col2 = st.columns(2)
                    
                    with col1:
                        sentiment1 = get_sentiment_for_company(comparison_data['names'][0])
                        if sentiment1:
                            st.write(f"**{stock1} Sentiment Analysis:**")
                            sentiment_color = "green" if sentiment1['avg_sentiment'] > 0 else "red" if sentiment1['avg_sentiment'] < 0 else "gray"
                            st.markdown(f"Average Sentiment: <span style='color:{sentiment_color}'>{sentiment1['avg_sentiment']:.3f}</span>", unsafe_allow_html=True)
                            st.write(f"Documents Analyzed: {sentiment1['total_documents']}")
                            st.write("Sentiment Distribution:", sentiment1['sentiment_distribution'])
                        else:
                            st.write(f"No sentiment data available for {stock1}")
                    
                    with col2:
                        sentiment2 = get_sentiment_for_company(comparison_data['names'][1])
                        if sentiment2:
                            st.write(f"**{stock2} Sentiment Analysis:**")
                            sentiment_color = "green" if sentiment2['avg_sentiment'] > 0 else "red" if sentiment2['avg_sentiment'] < 0 else "gray"
                            st.markdown(f"Average Sentiment: <span style='color:{sentiment_color}'>{sentiment2['avg_sentiment']:.3f}</span>", unsafe_allow_html=True)
                            st.write(f"Documents Analyzed: {sentiment2['total_documents']}")
                            st.write("Sentiment Distribution:", sentiment2['sentiment_distribution'])
                        else:
                            st.write(f"No sentiment data available for {stock2}")
                    
                    # Investment recommendation
                    st.subheader("💡 TradeX Recommendation")
                    
                    # Simple scoring system
                    score1 = 0
                    score2 = 0
                    
                    # Performance score
                    if comparison_data['returns'][0] > comparison_data['returns'][1]:
                        score1 += 2
                    else:
                        score2 += 2
                    
                    # Volatility score (lower is better)
                    if comparison_data['volatility'][0] < comparison_data['volatility'][1]:
                        score1 += 1
                    else:
                        score2 += 1
                    
                    # Sentiment score
                    if sentiment1 and sentiment2:
                        if sentiment1['avg_sentiment'] > sentiment2['avg_sentiment']:
                            score1 += 1
                        else:
                            score2 += 1
                    
                    if score1 > score2:
                        st.success(f"🏆 **Recommendation: {stock1}** (Score: {score1}/4)")
                        st.write(f"{stock1} shows better overall performance considering returns, volatility, and sentiment.")
                    elif score2 > score1:
                        st.success(f"🏆 **Recommendation: {stock2}** (Score: {score2}/4)")
                        st.write(f"{stock2} shows better overall performance considering returns, volatility, and sentiment.")
                    else:
                        st.info("📊 **Both stocks show similar performance metrics.** Consider additional fundamental analysis.")
    
    elif analysis_mode == "📊 Single Stock Analysis" and analyze_button:
        if not ticker:
            st.warning("Please enter a stock ticker.")
        else:
            # --- Part 1: Q&A System ---
            if enable_qa:
                st.header("1. Document Q&A 📄")
                if qa_question:
                    with st.spinner("🔍 Initializing Q&A system and searching for answer..."):
                        try:
                            qa_chain = get_qa_chain()
                            if qa_chain:
                                response = qa_chain.invoke({"query": qa_question})
                                st.info(f"**Question:** {qa_question}")
                                st.success(f"**Answer:** {response['result']}")
                            else:
                                st.error("❌ Failed to initialize Q&A system")
                        except Exception as e:
                            st.error(f"❌ Error getting answer: {e}")
                            st.info("💡 **Alternative:** You can still use the sentiment analysis and forecasting features below.")
                st.markdown("---")
            else:
                st.info("💡 Q&A System disabled. Enable it in the sidebar to ask questions about financial documents.")

            st.markdown("---")
            
            # --- Part 2: Sentiment Analysis ---
            st.header("2. Sentiment Analysis 📈")
            with st.spinner("🧐 Analyzing document sentiment..."):
                average_sentiment, sentiment_df = get_sentiment_data()
                
                if average_sentiment is not None:
                    sentiment_label = "POSITIVE" if average_sentiment > 0.1 else ("NEGATIVE" if average_sentiment < -0.1 else "NEUTRAL")
                    
                    st.metric(label="Overall Document Sentiment", value=sentiment_label, delta=f"{average_sentiment:.3f}")
                    st.dataframe(sentiment_df[['doc_name', 'sentiment_label', 'sentiment_score']].head())
            
            st.markdown("---")

            # --- Part 3: Financial Forecasting ---
            st.header("3. Financial Forecasting & Strategy 🔮")
            
            # Fetch stock data within a spinner
            with st.spinner(f"📥 Fetching stock data for {ticker}..."):
                start_date = '2015-01-01'
                end_date = date.today().strftime('%Y-%m-%d')
                stock_df = fetch_stock_data(ticker, start_date, end_date)
            
            if stock_df is not None and average_sentiment is not None:
                # Prepare data for forecasting
                stock_df['sentiment_score'] = average_sentiment
                stock_df['day_of_week'] = stock_df.index.dayofweek
                stock_df['day_of_year'] = stock_df.index.dayofyear
                stock_df['month'] = stock_df.index.month
                stock_df['week_of_year'] = stock_df.index.isocalendar().week.astype(int)

                features = ['Open', 'sentiment_score', 'day_of_week', 'day_of_year', 'month', 'week_of_year']
                target = 'Close'
                stock_df.dropna(inplace=True)

                X = stock_df[features]
                y = stock_df[target]
                
                if not X.empty:
                    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

                    model = LinearRegression()
                    # Convert to numpy arrays to avoid feature name warnings
                    model.fit(X_train.values, y_train.values)

                    # Prediction for the next day
                    last_day = stock_df.index[-1]
                    next_day_date = last_day + timedelta(days=1)
                    
                    last_open = stock_df['Open'].iloc[-1]
                    next_day_features = pd.DataFrame([{
                        'Open': last_open,
                        'sentiment_score': average_sentiment,
                        'day_of_week': next_day_date.dayofweek,
                        'day_of_year': next_day_date.timetuple().tm_yday,
                        'month': next_day_date.month,
                        'week_of_year': next_day_date.isocalendar().week
                    }])
                    
                    prediction_input = next_day_features[features]
                    # Use .values to get numpy array and avoid warnings
                    predicted_close_array = model.predict(prediction_input.values)
                    predicted_close = predicted_close_array.item()  # Use .item() to extract scalar safely
                    
                    # Use .iloc[0] to avoid Series float conversion warning
                    last_close = stock_df['Close'].iloc[-1]
                    if hasattr(last_close, 'item'):
                        last_close = last_close.item()
                    else:
                        last_close = float(last_close)

                    col1, col2, col3 = st.columns(3)
                    col1.metric("Last Closing Price", f"${last_close:.2f}")
                    col2.metric("Predicted Next Close", f"${predicted_close:.2f}", f"{((predicted_close - last_close) / last_close) * 100:+.2f}%")
                    col3.metric("Prediction Direction", "UP" if predicted_close > last_close else "DOWN")

                    st.subheader("Model Insights")
                    # Display feature importance
                    feature_importance = pd.DataFrame({
                        'feature': features,
                        'coefficient': model.coef_.flatten()
                    }).sort_values('coefficient', key=abs, ascending=False)
                    st.table(feature_importance)
                    
                    # Display stock chart
                    st.subheader(f"Historical Price & Prediction for {ticker}")
                    
                    # Create chart data - handle MultiIndex columns if present
                    try:
                        if isinstance(stock_df.columns, pd.MultiIndex):
                            # If MultiIndex, select the Close column properly
                            close_col = ('Close', ticker) if ('Close', ticker) in stock_df.columns else 'Close'
                            chart_df = stock_df[close_col].tail(100).to_frame('Close')
                        else:
                            # If regular columns
                            chart_df = stock_df[['Close']].tail(100).copy()
                        
                        # Add prediction point
                        chart_df.loc[next_day_date] = predicted_close
                        
                        # Create the chart
                        st.line_chart(chart_df)
                        
                        # Show recent performance
                        st.caption(f"📊 Showing last 100 days + prediction for {next_day_date.strftime('%Y-%m-%d')}")
                        
                    except Exception as e:
                        st.error(f"❌ Error creating chart: {e}")
                        st.info("📊 Chart data columns available:")
                        st.write(stock_df.columns.tolist())
                else:
                    st.warning("Not enough data to train the model.")



