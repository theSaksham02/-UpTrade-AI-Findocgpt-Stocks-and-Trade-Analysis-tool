"""
FinDocGPT - AI Financial Analysis Platform (Streamlit)

Modes:
- Financial Forecasting
- Stock Analysis
- AI Q&A System (requires GOOGLE_API_KEY)
- Sentiment Analysis
"""

from datetime import date
from typing import Dict, Any

import pandas as pd
import streamlit as st

from config import validate_api_key
from qa_system import create_qa_chain
from sentiment_analyzer import get_sentiment_pipeline
from forecasting_model import fetch_stock_data, train_and_forecast
from investment_strategy import generate_recommendation
from anomaly_detection import detect_volume_anomalies


def _get_query_params() -> Dict[str, Any]:
    try:
        return dict(st.query_params)  # Streamlit >= 1.30
    except Exception:
        try:
            return st.experimental_get_query_params()
        except Exception:
            return {}


def handle_api_request():
    params = _get_query_params()
    api_type = params.get("api")
    if not api_type:
        return None
    if isinstance(api_type, list):
        api_type = api_type[0] if api_type else None

    if api_type == "status":
            return {
                "status": "connected",
                "message": "FinDocGPT API is running",
            "features": ["stock_analysis", "qa_system", "sentiment_analysis", "forecasting"],
            }
    if api_type == "tools":
            return {
                "premium_tools": [
                    {"name": "TradeX", "status": "active", "description": "Stock comparison tool"},
                    {"name": "VisualX", "status": "active", "description": "Advanced charting platform"},
                {"name": "HFTX", "status": "active", "description": "High-frequency trading simulator"},
                ]
            }
    return None


st.set_page_config(page_title="FinDocGPT", page_icon="🚀", layout="wide", initial_sidebar_state="expanded")

st.markdown(
    """
    <style>
    .stApp { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); color: white; }
    .feature-card { background: rgba(255,255,255,0.08); padding: 1rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.15); }
    .stButton>button { background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 10px; }
    .stButton>button:hover { filter: brightness(1.05); }
    </style>
    """,
    unsafe_allow_html=True,
)

st.markdown(
    """
<div class="feature-card" style="text-align:center; margin-bottom: 1rem;">
  <h2 style="margin:0">🚀 FinDocGPT</h2>
  <p style="margin:0.25rem 0 0 0; color: rgba(255,255,255,0.9)">AI-Powered Financial Analysis Platform</p>
</div>
""",
    unsafe_allow_html=True,
)

# Lightweight API response path
api_response = handle_api_request()
if api_response is not None:
    st.json(api_response)
    st.stop()

has_api_key = validate_api_key()
if has_api_key:
    st.success("Google AI API configured")
else:
    st.info("GOOGLE_API_KEY not set. AI Q&A will be disabled; other features work.")


# Sidebar
with st.sidebar:
    st.markdown("### 🎯 Analysis Options")
    analysis_mode = st.selectbox(
        "Choose Analysis Mode:",
        ["Financial Forecasting", "Stock Analysis", "AI Q&A System", "Sentiment Analysis"],
    )
    
    if analysis_mode in ("Financial Forecasting", "Stock Analysis"):
        ticker = st.text_input("Stock Ticker (e.g., AAPL)", value="AAPL").upper()

    if analysis_mode == "Financial Forecasting":
        forecast_days = st.slider("Days to Forecast", 7, 90, 30)
        forecast_button = st.button("Run Forecast")

    if analysis_mode == "Stock Analysis":
        analyze_button = st.button("Analyze Stock")

    if analysis_mode == "AI Q&A System":
        question = st.text_area("Ask about financial documents:", value="What was Apple's revenue in 2022?")
        qa_button = st.button("Get Answer")

    if analysis_mode == "Sentiment Analysis":
        text_input = st.text_area("Enter financial text to analyze:")
        sentiment_button = st.button("Analyze Sentiment")


# Modes
if analysis_mode == "Financial Forecasting" and 'forecast_button' in locals() and forecast_button:
    if not ticker:
        st.warning("Please enter a stock ticker.")
    else:
        st.markdown(
            f"<div class='feature-card'><h3>🔮 Financial Forecast: {ticker}</h3></div>",
            unsafe_allow_html=True,
        )
        with st.spinner(f"Running forecast for {ticker}..."):
            start_date = "2020-01-01"
            end_date = date.today().strftime('%Y-%m-%d')
            series = fetch_stock_data(ticker, start_date, end_date)
            if series is None:
                st.error(f"Could not fetch data for {ticker}.")
            else:
                forecast = train_and_forecast(series, forecast_days)
                if forecast is None:
                    st.error("Failed to generate forecast.")
                else:
                    # Ensure history_df is a DataFrame, converting from Series if necessary
                    history_df = pd.DataFrame(series) if isinstance(series, pd.Series) else series
                    forecast_df = forecast.to_frame(name='forecast') if isinstance(forecast, pd.Series) else forecast
                    
                    combined_df = pd.concat([history_df, forecast_df], axis=1)
                    st.subheader(f"📈 Next {forecast_days} days")
                    st.line_chart(combined_df)
                    st.dataframe(forecast.to_frame(name="Forecasted Price"))

                    rec, reason, metrics = generate_recommendation(series, forecast)
                    st.subheader("🧭 Strategy Suggestion")
                    st.write(f"**Recommendation:** {rec}")
                    st.info(reason)
                    st.json(metrics)

elif analysis_mode == "Stock Analysis" and 'analyze_button' in locals() and analyze_button:
    if not ticker:
        st.warning("Please enter a stock ticker.")
    else:
        st.markdown(
            f"<div class='feature-card'><h3>📊 Stock Analysis: {ticker}</h3></div>",
            unsafe_allow_html=True,
        )
        with st.spinner("Analyzing stock data..."):
            import yfinance as yf
            stock = yf.Ticker(ticker)
            info = stock.info
            hist = stock.history(period="1y")

            if hist.empty:
                st.error("No data found for this ticker.")
            else:
                col1, col2, col3, col4 = st.columns(4)
                with col1:
                    st.metric("Current Price", f"${hist['Close'].iloc[-1]:.2f}")
                with col2:
                    change = hist['Close'].iloc[-1] - hist['Close'].iloc[-2]
                    st.metric("Daily Change", f"${change:.2f}")
                with col3:
                    st.metric("Volume", f"{hist['Volume'].iloc[-1]:,.0f}")
                with col4:
                    market_cap = info.get("marketCap")
                    st.metric("Market Cap", f"${market_cap/1e9:.1f}B" if market_cap else "N/A")

                st.subheader("📈 Price Chart")
                st.line_chart(hist["Close"])

                st.subheader("🚨 Volume Anomaly Detection")
                hist_with_anomalies = detect_volume_anomalies(hist.copy())
                anomalies = hist_with_anomalies[hist_with_anomalies["volume_anomaly"]]
                if not anomalies.empty:
                    st.warning(
                        f"Found {len(anomalies)} potential volume anomalies in the last year."
                    )
                    st.dataframe(anomalies[["Volume", "anomaly_reason"]].tail(10))
                else:
                    st.success("No significant volume anomalies detected in the last year.")

elif analysis_mode == "AI Q&A System" and 'qa_button' in locals() and qa_button:
    if not has_api_key:
        st.error("GOOGLE_API_KEY is required for Q&A. Please add it to your .env.")
    elif not question or not question.strip():
        st.warning("Please enter a question.")
    else:
        st.markdown("<div class='feature-card'><h3>🧠 AI Q&A Response</h3></div>", unsafe_allow_html=True)
        with st.spinner("AI is analyzing your question..."):
            try:
                qa_chain = create_qa_chain()
                if not qa_chain:
                    st.error("Failed to initialize Q&A system.")
                else:
                    response = qa_chain.invoke({"query": question})
                    st.write(f"**Question:** {question}")
                    st.success(f"**Answer:** {response['result']}")
            except Exception as e:
                st.error(f"Error: {str(e)}")

elif analysis_mode == "Sentiment Analysis" and 'sentiment_button' in locals() and sentiment_button:
    if not text_input or not text_input.strip():
        st.warning("Please enter text to analyze.")
    else:
        st.markdown("<div class='feature-card'><h3>📈 Sentiment Analysis Results</h3></div>", unsafe_allow_html=True)
        with st.spinner("Analyzing sentiment..."):
            pipeline = get_sentiment_pipeline()
            if not pipeline:
                st.error("Failed to load sentiment model.")
            else:
                result = pipeline(text_input)
                label = result[0]['label']
                score = result[0]['score']
                col1, col2 = st.columns(2)
                with col1:
                    st.metric("Sentiment", label)
                with col2:
                    st.metric("Confidence", f"{score:.2%}")
                st.info(text_input)


# Default view
if (
    ('forecast_button' not in locals() or not forecast_button)
    and ('analyze_button' not in locals() or not analyze_button)
    and ('qa_button' not in locals() or not qa_button)
    and ('sentiment_button' not in locals() or not sentiment_button)
):
    st.markdown(
        """
    <div class="feature-card">
          <h3>🎯 Welcome to FinDocGPT</h3>
          <p>Select an analysis mode from the sidebar to get started.</p>
    </div>
        """,
        unsafe_allow_html=True,
    )

st.markdown("---")
st.markdown(
    """
    <div style="text-align: center; padding: 0.5rem; color: rgba(255,255,255,0.75)">
      <p>FinDocGPT • Streamlit & Google AI • © 2025</p>
</div>
    """,
    unsafe_allow_html=True,
)


