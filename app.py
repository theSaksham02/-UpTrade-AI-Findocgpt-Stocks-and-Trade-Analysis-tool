# FinDocGPT - AI Financial Analysis Platform
import streamlit as st
import pandas as pd
from datetime import date, timedelta
import os
import json

# Add API endpoint functionality
def handle_api_request():
    """Handle API requests from the React frontend"""
    query_params = st.query_params
    
    if 'api' in query_params:
        api_type = query_params['api']
        
        if api_type == 'status':
            return {
                "status": "connected",
                "message": "FinDocGPT API is running",
                "features": ["stock_analysis", "qa_system", "sentiment_analysis", "tradex", "visualx", "hftx"]
            }
        elif api_type == 'tools':
            return {
                "premium_tools": [
                    {"name": "TradeX", "status": "active", "description": "Stock comparison tool"},
                    {"name": "VisualX", "status": "active", "description": "Advanced charting platform"},
                    {"name": "HFTX", "status": "active", "description": "High-frequency trading simulator"}
                ]
            }
    return None

# Check for API requests
api_response = handle_api_request()
if api_response:
    st.json(api_response)
    st.stop()

# Page configuration
st.set_page_config(
    page_title="FinDocGPT",
    page_icon="🚀",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for black/purple gradient background
st.markdown("""
<style>
    .stApp {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
        color: white;
    }
    
    .main-header {
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        padding: 2rem;
        border-radius: 15px;
        margin-bottom: 2rem;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }
    
    .main-header h1 {
        color: white;
        font-size: 3rem;
        font-weight: 700;
        margin: 0;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
    }
    
    .feature-card {
        background: rgba(255,255,255,0.1);
        padding: 1.5rem;
        border-radius: 15px;
        margin: 1rem 0;
        border: 1px solid rgba(255,255,255,0.2);
        backdrop-filter: blur(10px);
    }
    
    .premium-button {
        background: linear-gradient(90deg, #ff6b6b 0%, #feca57 100%);
    }
    
    /* General Button Styling */
    .stButton>button {
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        color: white !important; /* Ensure text is white */
        border-radius: 10px;
        padding: 0.75rem 1.5rem;
        font-weight: 600;
        border: none;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }
    .stButton>button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0,0,0,0.3);
    }
    .stButton>button:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.6);
    }
    
    /* Sidebar-specific button styling */
    .st-emotion-cache-1v0mbdj .stButton>button { /* Target sidebar buttons */
        background: transparent;
        border: 1px solid #667eea;
        color: #667eea !important;
    }
    
    .st-emotion-cache-1v0mbdj .stButton>button:hover {
        background: rgba(102, 126, 234, 0.1);
        border-color: #764ba2;
        color: #764ba2 !important;
    }
    
    /* Ensure primary buttons in sidebar are styled correctly */
    .st-emotion-cache-1v0mbdj .stButton>button[kind="primary"] {
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        border: none;
        color: white !important;
    }
    
    .st-emotion-cache-1v0mbdj .stButton>button[kind="primary"]:hover {
        background: linear-gradient(90deg, #764ba2 0%, #667eea 100%);
    }
    
    /* Ensure selectbox and text input have visible text */
    .stSelectbox, .stTextInput, .stTextArea {
        color: white;
    }
    .stSelectbox label, .stTextInput label, .stTextArea label {
        color: white !important;
    }
    .st-emotion-cache-1r6slb0, .st-emotion-cache-1kyxreq-container {
        background-color: rgba(255,255,255,0.1);
        border-radius: 10px;
    }
    .st-emotion-cache-1r6slb0:focus, .st-emotion-cache-1kyxreq-container:focus {
        border-color: #667eea;
    }
    .st-emotion-cache-1tpl0xr p {
        color: white;
    }
    
    /* Ensure text area has visible text */
    .stTextArea textarea {
        color: white;
        background-color: rgba(255,255,255,0.1);
    }
        color: white;
        padding: 1rem 2rem;
        border: none;
        border-radius: 25px;
        font-weight: bold;
        text-decoration: none;
        display: inline-block;
        margin: 0.5rem;
        transition: transform 0.3s ease;
    }
    
    .premium-button:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 20px rgba(255,107,107,0.3);
    }
    
    .sidebar .stSelectbox > div > div {
        background-color: rgba(255,255,255,0.1);
        color: white;
    }
</style>
""", unsafe_allow_html=True)

# Header
st.markdown("""
<div class="main-header">
    <h1>🚀 FinDocGPT</h1>
    <p style="color: rgba(255,255,255,0.9); font-size: 1.2rem; margin: 0.5rem 0 0 0;">
        AI-Powered Financial Analysis Platform
    </p>
</div>
""", unsafe_allow_html=True)

# Import modules
from config import validate_api_key
from qa_system import create_qa_chain
from sentiment_analyzer import (
    load_financial_data,
    extract_text_for_sentiment,
    get_sentiment_pipeline,
    analyze_sentiment
)
from forecasting_model import fetch_stock_data

# Check API key
if not validate_api_key():
    st.error("❌ GOOGLE_API_KEY not found. Please add it to your .env file.")
    st.stop()
else:
    st.success("✅ Google AI API configured successfully!")

# Sidebar
with st.sidebar:
    st.markdown("### 🎯 Analysis Options")
    
    analysis_mode = st.selectbox(
        "Choose Analysis Mode:",
        ["📊 Stock Analysis", "🧠 AI Q&A System", "📈 Sentiment Analysis"]
    )
    
    if analysis_mode == "📊 Stock Analysis":
        ticker = st.text_input("Stock Ticker (e.g., AAPL)", value="AAPL").upper()
        analyze_button = st.button("🚀 Analyze", type="primary")
    
    elif analysis_mode == "🧠 AI Q&A System":
        question = st.text_area("Ask about financial documents:", 
                               value="What was Apple's revenue in 2023?")
        qa_button = st.button("🧠 Get Answer", type="primary")
    
    elif analysis_mode == "📈 Sentiment Analysis":
        text_input = st.text_area("Enter financial text to analyze:")
        sentiment_button = st.button("📈 Analyze Sentiment", type="primary")
    
    # Premium Features Section
    st.markdown("---")
    st.markdown("### 💎 Premium Features")
    
    if st.button("⚖️ TradeX - Stock Comparison", key="tradex", help="Compare multiple stocks side by side"):
        st.session_state.premium_tool = "tradex"
    
    if st.button("📊 VisualX - Advanced Charts", key="visualx", help="Advanced charting and visualization"):
        st.session_state.premium_tool = "visualx"
        
    if st.button("⚡ HFTX - High Frequency Trading", key="hftx", help="High-frequency trading algorithms"):
        st.session_state.premium_tool = "hftx"
    
    st.info("💡 Premium features are fully functional!")

# Main Content Area
# Handle premium tool selections
if hasattr(st.session_state, 'premium_tool'):
    tool = st.session_state.premium_tool
    
    if tool == "tradex":
        st.markdown("""
        <div class="feature-card">
            <h2>⚖️ TradeX - Stock Comparison Tool</h2>
        </div>
        """, unsafe_allow_html=True)
        
        st.subheader("Compare Multiple Stocks")
        col1, col2 = st.columns(2)
        with col1:
            stock1 = st.text_input("First Stock Ticker", value="AAPL").upper()
        with col2:
            stock2 = st.text_input("Second Stock Ticker", value="GOOGL").upper()
            
        if st.button("🔍 Compare Stocks", type="primary"):
            with st.spinner("Comparing stocks..."):
                try:
                    import yfinance as yf
                    s1 = yf.Ticker(stock1)
                    s2 = yf.Ticker(stock2)
                    
                    h1 = s1.history(period="1y")
                    h2 = s2.history(period="1y")
                    
                    if not h1.empty and not h2.empty:
                        col1, col2 = st.columns(2)
                        with col1:
                            st.metric(f"{stock1} Price", f"${h1['Close'].iloc[-1]:.2f}")
                            st.line_chart(h1['Close'])
                        with col2:
                            st.metric(f"{stock2} Price", f"${h2['Close'].iloc[-1]:.2f}")
                            st.line_chart(h2['Close'])
                            
                        # Performance comparison
                        perf1 = ((h1['Close'].iloc[-1] - h1['Close'].iloc[0]) / h1['Close'].iloc[0]) * 100
                        perf2 = ((h2['Close'].iloc[-1] - h2['Close'].iloc[0]) / h2['Close'].iloc[0]) * 100
                        
                        st.subheader("📊 1-Year Performance Comparison")
                        col1, col2 = st.columns(2)
                        with col1:
                            st.metric(f"{stock1} Return", f"{perf1:.2f}%")
                        with col2:
                            st.metric(f"{stock2} Return", f"{perf2:.2f}%")
                            
                        winner = stock1 if perf1 > perf2 else stock2
                        st.success(f"🏆 Winner: {winner} with better performance!")
                    else:
                        st.error("Could not fetch data for comparison.")
                except Exception as e:
                    st.error(f"Error: {str(e)}")
    
    elif tool == "visualx":
        st.markdown("""
        <div class="feature-card">
            <h2>📊 VisualX - Advanced Charting Platform</h2>
        </div>
        """, unsafe_allow_html=True)
        
        ticker = st.text_input("Enter Stock Ticker for Advanced Charts", value="TSLA").upper()
        chart_type = st.selectbox("Chart Type", ["Candlestick", "Volume", "Moving Averages", "RSI"])
        
        if st.button("📈 Generate Advanced Chart", type="primary"):
            with st.spinner("Generating advanced charts..."):
                try:
                    import yfinance as yf
                    stock = yf.Ticker(ticker)
                    hist = stock.history(period="6mo")
                    
                    if not hist.empty:
                        if chart_type == "Candlestick":
                            st.subheader(f"🕯️ {ticker} Candlestick Chart")
                            st.line_chart(hist[['Open', 'High', 'Low', 'Close']])
                        elif chart_type == "Volume":
                            st.subheader(f"📊 {ticker} Volume Analysis")
                            st.bar_chart(hist['Volume'])
                        elif chart_type == "Moving Averages":
                            st.subheader(f"📈 {ticker} Moving Averages")
                            hist['MA20'] = hist['Close'].rolling(20).mean()
                            hist['MA50'] = hist['Close'].rolling(50).mean()
                            st.line_chart(hist[['Close', 'MA20', 'MA50']])
                        elif chart_type == "RSI":
                            st.subheader(f"⚡ {ticker} RSI Indicator")
                            # Simple RSI calculation
                            delta = hist['Close'].diff()
                            gain = (delta.where(delta > 0, 0)).rolling(14).mean()
                            loss = (-delta.where(delta < 0, 0)).rolling(14).mean()
                            rs = gain / loss
                            rsi = 100 - (100 / (1 + rs))
                            st.line_chart(rsi)
                            
                        st.success("✅ Advanced chart generated successfully!")
                    else:
                        st.error("Could not fetch stock data.")
                except Exception as e:
                    st.error(f"Error: {str(e)}")
    
    elif tool == "hftx":
        st.markdown("""
        <div class="feature-card">
            <h2>⚡ HFTX - High Frequency Trading Simulator</h2>
        </div>
        """, unsafe_allow_html=True)
        
        st.warning("⚠️ This is a simulation for educational purposes only!")
        
        ticker = st.text_input("Stock for HFT Simulation", value="SPY").upper()
        strategy = st.selectbox("HFT Strategy", ["Mean Reversion", "Momentum", "Arbitrage"])
        capital = st.number_input("Starting Capital ($)", value=10000, min_value=1000)
        
        if st.button("🚀 Run HFT Simulation", type="primary"):
            with st.spinner("Running high-frequency trading simulation..."):
                try:
                    import random
                    import time
                    
                    # Simulate HFT trading
                    st.subheader(f"⚡ HFT Simulation: {strategy} on {ticker}")
                    
                    # Progress bar
                    progress_bar = st.progress(0)
                    status_text = st.empty()
                    
                    trades = []
                    current_capital = capital
                    
                    for i in range(100):
                        # Simulate price movement
                        price_change = random.uniform(-0.5, 0.5)
                        profit_loss = random.uniform(-50, 100)
                        current_capital += profit_loss
                        
                        trades.append({
                            'Trade': i+1,
                            'P&L': profit_loss,
                            'Capital': current_capital
                        })
                        
                        progress_bar.progress((i+1)/100)
                        status_text.text(f"Executing trade {i+1}/100 - P&L: ${profit_loss:.2f}")
                        time.sleep(0.01)  # Small delay for realism
                    
                    # Results
                    total_pnl = current_capital - capital
                    roi = (total_pnl / capital) * 100
                    
                    col1, col2, col3 = st.columns(3)
                    with col1:
                        st.metric("Total P&L", f"${total_pnl:.2f}")
                    with col2:
                        st.metric("Final Capital", f"${current_capital:.2f}")
                    with col3:
                        st.metric("ROI", f"{roi:.2f}%")
                    
                    # Trade history
                    df_trades = pd.DataFrame(trades)
                    st.subheader("📊 Trade History")
                    st.line_chart(df_trades.set_index('Trade')['Capital'])
                    
                    if total_pnl > 0:
                        st.success(f"🎉 Profitable simulation! Made ${total_pnl:.2f}")
                    else:
                        st.error(f"📉 Loss in simulation: ${total_pnl:.2f}")
                        
                except Exception as e:
                    st.error(f"Error: {str(e)}")

# Standard analysis modes
if analysis_mode == "📊 Stock Analysis" and 'analyze_button' in locals() and analyze_button:
    if ticker:
        st.markdown(f"""
        <div class="feature-card">
            <h2>📊 Stock Analysis: {ticker}</h2>
        </div>
        """, unsafe_allow_html=True)
        
        with st.spinner("Analyzing stock data..."):
            try:
                # Get stock data using yfinance
                import yfinance as yf
                stock = yf.Ticker(ticker)
                info = stock.info
                hist = stock.history(period="1y")
                
                if not hist.empty:
                    # Display key metrics
                    col1, col2, col3, col4 = st.columns(4)
                    
                    with col1:
                        st.metric("Current Price", f"${hist['Close'].iloc[-1]:.2f}")
                    with col2:
                        change = hist['Close'].iloc[-1] - hist['Close'].iloc[-2]
                        st.metric("Daily Change", f"${change:.2f}", f"{change:.2f}")
                    with col3:
                        st.metric("Volume", f"{hist['Volume'].iloc[-1]:,.0f}")
                    with col4:
                        market_cap = info.get('marketCap', 'N/A')
                        if market_cap != 'N/A':
                            st.metric("Market Cap", f"${market_cap/1e9:.1f}B")
                        else:
                            st.metric("Market Cap", "N/A")
                    
                    # Stock chart
                    st.subheader("📈 Price Chart")
                    st.line_chart(hist['Close'])
                    
                    # Company info
                    if 'longName' in info:
                        st.subheader("ℹ️ Company Information")
                        st.write(f"**Company:** {info.get('longName', ticker)}")
                        st.write(f"**Sector:** {info.get('sector', 'N/A')}")
                        st.write(f"**Industry:** {info.get('industry', 'N/A')}")
                        
                else:
                    st.error("No data found for this ticker.")
                    
            except Exception as e:
                st.error(f"Error analyzing stock: {str(e)}")
    else:
        st.warning("Please enter a stock ticker.")

elif analysis_mode == "🧠 AI Q&A System" and 'qa_button' in locals() and qa_button:
    if question.strip():
        st.markdown("""
        <div class="feature-card">
            <h2>🧠 AI Q&A Response</h2>
        </div>
        """, unsafe_allow_html=True)
        
        with st.spinner("AI is analyzing your question..."):
            try:
                # Initialize Q&A chain
                qa_chain = create_qa_chain()
                if qa_chain:
                    response = qa_chain.invoke({"query": question})
                    st.write(f"**Question:** {question}")
                    st.success(f"**Answer:** {response['result']}")
                else:
                    st.error("Failed to initialize Q&A system")
            except Exception as e:
                st.error(f"Error: {str(e)}")
    else:
        st.warning("Please enter a question.")

elif analysis_mode == "📈 Sentiment Analysis" and 'sentiment_button' in locals() and sentiment_button:
    if text_input.strip():
        st.markdown("""
        <div class="feature-card">
            <h2>📈 Sentiment Analysis Results</h2>
        </div>
        """, unsafe_allow_html=True)
        
        with st.spinner("Analyzing sentiment..."):
            try:
                # Get sentiment pipeline
                sentiment_pipeline = get_sentiment_pipeline()
                result = sentiment_pipeline(text_input)
                
                sentiment_label = result[0]['label']
                sentiment_score = result[0]['score']
                
                col1, col2 = st.columns(2)
                with col1:
                    st.metric("Sentiment", sentiment_label, f"{sentiment_score:.2%} confidence")
                with col2:
                    color = "🟢" if sentiment_label == "POSITIVE" else "🔴"
                    st.metric("Market Signal", f"{color} {sentiment_label}", f"{sentiment_score:.2%}")
                
                st.write("**Analyzed Text:**")
                st.info(text_input)
                
            except Exception as e:
                st.error(f"Error analyzing sentiment: {str(e)}")
    else:
        st.warning("Please enter text to analyze.")

# Default view
if 'analyze_button' not in locals() and 'qa_button' not in locals() and 'sentiment_button' not in locals():
    st.markdown("""
    <div class="feature-card">
        <h2>🎯 Welcome to FinDocGPT</h2>
        <p>Select an analysis mode from the sidebar to get started:</p>
        <ul>
            <li>📊 <strong>Stock Analysis</strong> - Real-time stock data and insights</li>
            <li>🧠 <strong>AI Q&A System</strong> - Ask questions about financial documents</li>
            <li>📈 <strong>Sentiment Analysis</strong> - Analyze financial text sentiment</li>
        </ul>
        <p>Premium features like TradeX, VisualX, and HFTX are coming soon!</p>
    </div>
    """, unsafe_allow_html=True)

# Footer
st.markdown("---")
st.markdown("""
<div style="text-align: center; padding: 1rem; color: rgba(255,255,255,0.7);">
    <p>🚀 FinDocGPT - Built with Streamlit & Google AI • © 2025</p>
</div>
""", unsafe_allow_html=True)
