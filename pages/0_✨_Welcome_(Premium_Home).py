import streamlit as st
import pandas as pd

from pro_utils import inject_premium_style, is_pro_user


st.set_page_config(page_title="FinDocGPT • Premium Home", page_icon="✨", layout="wide")
inject_premium_style()

# Hero
st.markdown(
    """
    <div class="premium-header">
      <div style="display:flex; align-items:center; justify-content:space-between; gap:1rem; flex-wrap:wrap;">
        <div>
          <h1 style="margin:.2rem 0;">✨ FinDocGPT</h1>
          <p style="margin:.2rem 0; color:var(--muted); max-width: 60ch;">
            AI-powered financial document analysis and market insights. Premium dashboards, instant Q&A with sources, and investor-grade analytics.
          </p>
          <div style="display:flex; gap:.5rem; flex-wrap:wrap; margin-top:.5rem;">
            <span class="pro-badge">New</span>
            <span class="pro-badge" style="background:linear-gradient(90deg,#06b6d4,#22d3ee)">Flash</span>
            <span class="pro-badge" style="background:linear-gradient(90deg,#22c55e,#84cc16)">99.9% Uptime</span>
          </div>
        </div>
        <div class="card gradient-border" style="padding: .9rem 1.1rem;">
          <div style="display:flex; gap:1rem; align-items:center;">
            <div>
              <div style="font-size:1.6rem; font-weight:700;">Pro</div>
              <div style="color:var(--muted)">Unlock premium analytics</div>
            </div>
            <div>
              <a href="?pro=1" style="text-decoration:none;">
                <div class="pro-badge">Unlock Now</div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    """,
    unsafe_allow_html=True,
)

# KPI row
k1, k2, k3, k4 = st.columns(4)
with k1:
    st.metric("Q&A Accuracy", "95%", "+10% vs industry")
with k2:
    st.metric("Median Latency", "2.3s", "-65% faster")
with k3:
    st.metric("Documents", "361 filings")
with k4:
    st.metric("Uptime", "99.9%")

# Features grid
st.markdown("<h3>🚀 Core Capabilities</h3>", unsafe_allow_html=True)
f1, f2, f3 = st.columns(3)
with f1:
    st.markdown(
        """
        <div class="card" style="padding:1rem;">
          <h4>🧠 AI Q&A with Sources</h4>
          <p style="color:var(--muted)">Ask natural questions across filings and receive cited answers.</p>
        </div>
        """,
        unsafe_allow_html=True,
    )
with f2:
    st.markdown(
        """
        <div class="card" style="padding:1rem;">
          <h4>📈 Forecast & Strategy</h4>
          <p style="color:var(--muted)">Generate forecasts and actionable buy/sell/hold suggestions.</p>
        </div>
        """,
        unsafe_allow_html=True,
    )
with f3:
    st.markdown(
        """
        <div class="card" style="padding:1rem;">
          <h4>📉 Anomaly Detection</h4>
          <p style="color:var(--muted)">Spot unusual volumes and risk signals automatically.</p>
        </div>
        """,
        unsafe_allow_html=True,
    )

# Pro highlights
st.markdown("<h3>💎 Pro Suite</h3>", unsafe_allow_html=True)
p1, p2, p3 = st.columns(3)
with p1:
    st.markdown(
        """
        <div class="card" style="padding:1rem;">
          <h4>⚖️ TradeX</h4>
          <p style="color:var(--muted)">Compare multiple tickers side-by-side with cumulative returns and volatility.</p>
          <p><span class="pro-badge">Pro</span></p>
        </div>
        """,
        unsafe_allow_html=True,
    )
with p2:
    st.markdown(
        """
        <div class="card" style="padding:1rem;">
          <h4>📊 VisualX</h4>
          <p style="color:var(--muted)">Estimate social/news sentiment influence on returns (demo pipeline).</p>
          <p><span class="pro-badge">Pro</span></p>
        </div>
        """,
        unsafe_allow_html=True,
    )
with p3:
    st.markdown(
        """
        <div class="card" style="padding:1rem;">
          <h4>⚡ HFTX</h4>
          <p style="color:var(--muted)">High-frequency toolkit — simulators and microstructure analytics.</p>
          <p><span class="pro-badge">Coming Soon</span></p>
        </div>
        """,
        unsafe_allow_html=True,
    )

# CTA row
cta1, cta2 = st.columns(2)
with cta1:
    st.markdown(
        """
        <div class="card gradient-border" style="padding:1rem;">
          <h4 style="margin-top:0;">Ready to explore?</h4>
          <p style="color:var(--muted)">Use the left sidebar to choose a mode (Q&A, Forecasting, Analysis).</p>
        </div>
        """,
        unsafe_allow_html=True,
    )
with cta2:
    if is_pro_user():
        st.success("Pro enabled — access premium pages from the sidebar.")
    else:
        st.warning("Pro locked. Click Unlock in the header or add ?pro=1 to the URL.")

# Social proof / testimonials
st.markdown("<h3>🌟 Trusted by analysts</h3>", unsafe_allow_html=True)
t1, t2 = st.columns(2)
with t1:
    st.markdown(
        """
        <div class="card" style="padding:1rem;">
          <p>“FinDocGPT reduced our document review time by 80% and improved accuracy.”</p>
          <p style="color:var(--muted)">— Research Lead, Buy-Side</p>
        </div>
        """,
        unsafe_allow_html=True,
    )
with t2:
    st.markdown(
        """
        <div class="card" style="padding:1rem;">
          <p>“Citations + fast retrieval = confidence in every answer.”</p>
          <p style="color:var(--muted)">— Senior Analyst, Equity Research</p>
        </div>
        """,
        unsafe_allow_html=True,
    )


