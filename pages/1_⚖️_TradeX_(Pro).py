import streamlit as st
import pandas as pd

from pro_utils import require_pro, inject_premium_style


st.set_page_config(page_title="TradeX (Pro)", page_icon="⚖️", layout="wide")
inject_premium_style()

st.markdown("""
<div class="premium-header">
  <h2 style="margin:0;display:flex;align-items:center;gap:.5rem">⚖️ TradeX <span class="pro-badge">Pro</span></h2>
  <p class="section-title" style="color:var(--muted)">Compare 2+ stocks side-by-side with performance and simple metrics</p>
</div>
""", unsafe_allow_html=True)

if not require_pro():
    st.stop()

col = st.columns([2,1,1,1,1])
with col[0]:
    tickers_input = st.text_input("Tickers (comma-separated)", value="AAPL, MSFT, GOOGL").upper()
with col[1]:
    period = st.selectbox("History", ["6mo", "1y", "2y", "5y"], index=1)
with col[2]:
    interval = st.selectbox("Interval", ["1d", "1wk", "1mo"], index=0)
with col[3]:
    bench = st.text_input("Benchmark", value="SPY").upper()
with col[4]:
    run = st.button("Compare")

if run:
    import yfinance as yf
    tickers = [t.strip() for t in tickers_input.split(",") if t.strip()]
    if len(tickers) < 2:
        st.warning("Enter at least 2 tickers.")
        st.stop()

    with st.spinner("Fetching data..."):
        dfs = {}
        for t in tickers + [bench]:
            try:
                hist = yf.Ticker(t).history(period=period, interval=interval)
                if not hist.empty:
                    dfs[t] = hist["Close"].rename(t)
            except Exception:
                pass

    if not dfs:
        st.error("No data fetched.")
        st.stop()

    prices = pd.concat(dfs.values(), axis=1).dropna()
    returns = prices.pct_change().dropna()
    cum_returns = (1 + returns).cumprod() - 1

    st.subheader("📈 Cumulative Returns")
    st.line_chart(cum_returns)

    st.subheader("📊 Summary Metrics")
    metrics = []
    for t in prices.columns:
        total_ret = (prices[t].iloc[-1] / prices[t].iloc[0] - 1) * 100
        vol = returns[t].std() * (252 if interval == "1d" else 52) ** 0.5 * 100
        metrics.append({"Ticker": t, "Total Return %": round(total_ret, 2), "Volatility %": round(vol, 2)})
    st.dataframe(pd.DataFrame(metrics))


