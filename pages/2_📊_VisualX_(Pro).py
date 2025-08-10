import streamlit as st
import pandas as pd

from pro_utils import require_pro, inject_premium_style


st.set_page_config(page_title="VisualX (Pro)", page_icon="📊", layout="wide")
inject_premium_style()

st.markdown("""
<div class="premium-header">
  <h2 style="margin:0;display:flex;align-items:center;gap:.5rem">📊 VisualX <span class="pro-badge">Pro</span></h2>
  <p class="section-title" style="color:var(--muted)">Estimate influence of social/news sentiment on a stock (demo)</p>
</div>
""", unsafe_allow_html=True)

if not require_pro():
    st.stop()

col = st.columns([2,1,1])
with col[0]:
    ticker = st.text_input("Ticker", value="AAPL").upper()
with col[1]:
    period = st.selectbox("History", ["3mo", "6mo", "1y"], index=2)
with col[2]:
    run = st.button("Analyze")

st.info("This is a lightweight demo using synthetic sentiment from headlines to illustrate influence.")

if run:
    import yfinance as yf
    import numpy as np

    with st.spinner("Fetching data & estimating influence..."):
        hist = yf.Ticker(ticker).history(period=period)
        if hist.empty:
            st.error("No data found.")
            st.stop()

        # Synthetic sentiment score [-1, 1] per day (placeholder for real NLP on news/social)
        rng = np.random.default_rng(42)
        sent = pd.Series(rng.normal(0, 0.3, size=len(hist)), index=hist.index).clip(-1, 1)

        # Simple linear regression: price change ~ sentiment
        ret = hist['Close'].pct_change().fillna(0)
        X = sent.values.reshape(-1, 1)
        y = ret.values
        try:
            from sklearn.linear_model import LinearRegression
            model = LinearRegression().fit(X, y)
            coef = model.coef_[0]
            r2 = model.score(X, y)
        except Exception:
            coef, r2 = 0.0, 0.0

        st.subheader("📈 Price & Synthetic Sentiment")
        st.line_chart(pd.DataFrame({"Close": hist['Close'], "Sentiment": sent}))

        st.subheader("📌 Influence Estimate")
        st.metric("Sentiment -> Return coefficient", f"{coef:.4f}")
        st.metric("R² (fit quality)", f"{r2:.3f}")


