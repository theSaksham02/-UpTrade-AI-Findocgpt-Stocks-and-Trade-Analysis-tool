import streamlit as st
from pro_utils import require_pro, inject_premium_style


st.set_page_config(page_title="HFTX (Pro)", page_icon="⚡", layout="wide")
inject_premium_style()

st.markdown("""
<div class="premium-header">
  <h2 style="margin:0;display:flex;align-items:center;gap:.5rem">⚡ HFTX <span class="pro-badge">Pro</span></h2>
  <p class="section-title" style="color:var(--muted)">High-Frequency Trading toolkit</p>
</div>
""", unsafe_allow_html=True)

if not require_pro():
    st.stop()

st.info("Coming soon: HFT simulators, latency dashboards, and market microstructure analytics.")


