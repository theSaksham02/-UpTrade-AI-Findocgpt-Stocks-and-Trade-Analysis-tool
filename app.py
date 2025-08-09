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
    ticker = st.text_input("Enter a Stock Ticker (e.g., MMM)", value="MMM").upper()
    
    st.subheader("Q&A System (Optional)")
    qa_question = st.text_input(
        "Ask a question about the financial documents", 
        value="What is the FY2018 capital expenditure amount for 3M?"
    )
    enable_qa = st.checkbox("Enable Q&A System", value=False, help="⚠️ May have compatibility issues with some environments")
    
    analyze_button = st.button("🚀 Run Analysis", type="primary")

# --- Page Content ---

st.title("FinDocGPT: AI for Financial Document Analysis & Strategy")
st.markdown("---")

if not validate_api_key():
    st.error("❌ GOOGLE_API_KEY not found. Please add it to your .env file.")
else:
    st.success("✅ GOOGLE_API_KEY configured successfully!")
    
    if analyze_button:
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



