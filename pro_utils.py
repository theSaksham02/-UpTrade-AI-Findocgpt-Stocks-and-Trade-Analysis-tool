"""
Utilities for Pro gating and premium styling across Streamlit pages.
"""

from __future__ import annotations

import os
from typing import Dict, Any

import streamlit as st


def get_query_params() -> Dict[str, Any]:
    try:
        return dict(st.query_params)
    except Exception:
        try:
            return st.experimental_get_query_params()
        except Exception:
            return {}


def is_pro_user() -> bool:
    """Return True if user has Pro access via env var or query parameter."""
    env_flag = os.getenv("PRO_USER", "false").lower() in {"1", "true", "yes"}
    params = get_query_params()
    pro_param = False
    if params:
        value = params.get("pro")
        if isinstance(value, list):
            value = value[0] if value else None
        pro_param = str(value).lower() in {"1", "true", "yes"}
    return env_flag or pro_param


def require_pro() -> bool:
    """Gate the page content to Pro users only.

    Returns True if allowed to render content, False if gated (and renders lock UI).
    """
    if is_pro_user():
        return True

    _render_locked_ui()
    return False


def _render_locked_ui() -> None:
    inject_premium_style()
    st.markdown(
        """
        <div class="card gradient-border" style="padding: 1.25rem;">
          <h2 style="margin-top:0;">🔒 Pro Feature</h2>
          <p>This feature is available to Pro users only.</p>
          <ul>
            <li>Set <code>PRO_USER=true</code> in your environment and reload</li>
            <li>Or open with <code>?pro=1</code> query parameter</li>
          </ul>
        </div>
        """,
        unsafe_allow_html=True,
    )


def inject_premium_style() -> None:
    """Global premium look-and-feel: glassmorphism, gradients, subtle animations."""
    st.markdown(
        """
        <style>
          :root {
            --bg0: #0f1420;
            --bg1: #141a2a;
            --grad1: linear-gradient(135deg, #141a2a 0%, #0f3460 50%, #4b3ca7 100%);
            --card-bg: rgba(255,255,255,0.04);
            --card-border: rgba(255,255,255,0.08);
            --text: rgba(255,255,255,0.95);
            --muted: rgba(255,255,255,0.7);
            --accent: #8b5cf6;
          }
          .stApp { background: var(--grad1) !important; color: var(--text); }
          .block-container { padding-top: 1.2rem; }
          .premium-header {
            background: radial-gradient(1200px 400px at top left, rgba(255,255,255,0.08), transparent), var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 16px; padding: 1rem 1.2rem; margin-bottom: 1rem;
            backdrop-filter: blur(10px);
          }
          .card { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 14px; }
          .kpi { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 12px; padding: .8rem; }
          .gradient-border { border: 1px solid transparent; border-radius: 14px; background: linear-gradient(var(--bg1), var(--bg1)) padding-box, linear-gradient(90deg, #8b5cf6, #06b6d4) border-box; }
          .pro-badge { display:inline-block; padding: .25rem .6rem; border-radius: 999px; background: linear-gradient(90deg, #8b5cf6, #06b6d4); color:#fff; font-weight:600; font-size:.8rem; }
          .stButton>button { background: linear-gradient(90deg, #8b5cf6 0%, #06b6d4 100%); color: white; border: none; border-radius: 10px; }
          .stButton>button:hover { filter: brightness(1.06); transform: translateY(-1px); }
          .section-title { margin: 0.25rem 0 0.5rem 0; }
        </style>
        """,
        unsafe_allow_html=True,
    )


