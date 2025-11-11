"""
📊 Market Data Hub - Real-time Market Intelligence
Powered by Finnhub, Alpha Vantage, Polygon, NewsAPI, NewsData, and Marketaux
"""

import streamlit as st
import pandas as pd
from datetime import datetime
import plotly.graph_objects as go
import plotly.express as px
from api_integrations_enhanced import get_enhanced_api_manager

# Page configuration
st.set_page_config(
    page_title="Market Data Hub - UpTrade AI",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS matching the app theme
st.markdown("""
<style>
    .stApp {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
        color: white;
    }
    
    .metric-card {
        background: rgba(255,255,255,0.1);
        padding: 1.5rem;
        border-radius: 15px;
        border: 1px solid rgba(255,255,255,0.2);
        backdrop-filter: blur(10px);
        margin: 0.5rem 0;
    }
    
    .news-card {
        background: rgba(102, 126, 234, 0.1);
        padding: 1rem;
        border-radius: 10px;
        border-left: 4px solid #667eea;
        margin: 0.5rem 0;
    }
    
    .positive { color: #00ff88; }
    .negative { color: #ff4444; }
    .neutral { color: #ffaa00; }
    
    h1, h2, h3 { color: white !important; }
</style>
""", unsafe_allow_html=True)

# Header
st.markdown("""
<div style="background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); padding: 2rem; border-radius: 15px; margin-bottom: 2rem; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
    <h1 style="color: white; margin: 0;">📊 Market Data Hub</h1>
    <p style="color: rgba(255,255,255,0.9); margin-top: 0.5rem;">Real-time Market Intelligence & Multi-Source Data Aggregation</p>
</div>
""", unsafe_allow_html=True)

# Initialize API Manager
@st.cache_resource
def get_api_manager():
    return get_enhanced_api_manager()

manager = get_api_manager()

# Sidebar - Configuration
st.sidebar.header("⚙️ Configuration")

# API Health Status
with st.sidebar.expander("🏥 API Health Status", expanded=True):
    health = manager.get_api_health()
    
    for api_name, status in health['apis'].items():
        icon = "✅" if status['configured'] else "❌"
        st.write(f"{icon} **{api_name.upper()}**: {status['status']}")
    
    st.metric("Cache Items", health['cache_size'])

# Stock Selection
st.sidebar.header("📈 Stock Selection")
default_stocks = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META']
custom_symbol = st.sidebar.text_input("Enter Symbol", value="AAPL").upper()
selected_stocks = st.sidebar.multiselect(
    "Or Select Multiple",
    default_stocks,
    default=['AAPL', 'MSFT', 'GOOGL']
)

# Use custom symbol if provided, otherwise use selected
if custom_symbol:
    symbols_to_analyze = [custom_symbol]
else:
    symbols_to_analyze = selected_stocks if selected_stocks else ['AAPL']

# News Configuration
st.sidebar.header("📰 News Settings")
news_limit = st.sidebar.slider("Articles to Display", 5, 30, 15)
news_query = st.sidebar.text_input("News Search Query", value="stock market")

# Refresh button
if st.sidebar.button("🔄 Refresh All Data", type="primary"):
    st.cache_data.clear()
    st.rerun()

# Main Content Tabs
tab1, tab2, tab3, tab4, tab5 = st.tabs([
    "📊 Live Quotes", 
    "📰 Market News", 
    "🏢 Company Profiles",
    "📈 Multi-Stock Compare",
    "⚡ API Performance"
])

# ============================================================================
# TAB 1: LIVE STOCK QUOTES
# ============================================================================
with tab1:
    st.header("📊 Real-Time Stock Quotes")
    
    # Create columns for stock cards
    cols = st.columns(min(3, len(symbols_to_analyze)))
    
    for idx, symbol in enumerate(symbols_to_analyze):
        with cols[idx % 3]:
            with st.spinner(f"Loading {symbol}..."):
                try:
                    quote = manager.get_stock_quote(symbol)
                    
                    # Determine color based on change
                    change = quote.get('change', 0)
                    change_class = "positive" if change > 0 else "negative" if change < 0 else "neutral"
                    change_icon = "📈" if change > 0 else "📉" if change < 0 else "➡️"
                    
                    st.markdown(f"""
                    <div class="metric-card">
                        <h3>{symbol} {change_icon}</h3>
                        <h2 class="{change_class}">${quote.get('price', 0):.2f}</h2>
                        <p class="{change_class}">
                            {change:+.2f} ({quote.get('change_percent', '0%')})
                        </p>
                        <hr style="border-color: rgba(255,255,255,0.1);">
                        <p style="font-size: 0.9rem;">
                            <b>Open:</b> ${quote.get('open', 0):.2f} | 
                            <b>High:</b> ${quote.get('high', 0):.2f}<br>
                            <b>Low:</b> ${quote.get('low', 0):.2f} | 
                            <b>Prev Close:</b> ${quote.get('previous_close', 0):.2f}
                        </p>
                        <p style="font-size: 0.8rem; color: rgba(255,255,255,0.6);">
                            Source: {quote.get('source', 'N/A')}
                        </p>
                    </div>
                    """, unsafe_allow_html=True)
                    
                except Exception as e:
                    st.error(f"Error loading {symbol}: {e}")
    
    # Detailed Table View
    st.subheader("📋 Detailed View")
    
    with st.spinner("Loading detailed data..."):
        quotes_data = []
        for symbol in symbols_to_analyze:
            try:
                quote = manager.get_stock_quote(symbol)
                quotes_data.append({
                    'Symbol': symbol,
                    'Price': f"${quote.get('price', 0):.2f}",
                    'Change': f"{quote.get('change', 0):+.2f}",
                    'Change %': quote.get('change_percent', '0%'),
                    'Open': f"${quote.get('open', 0):.2f}",
                    'High': f"${quote.get('high', 0):.2f}",
                    'Low': f"${quote.get('low', 0):.2f}",
                    'Volume': f"{quote.get('volume', 0):,}" if 'volume' in quote else 'N/A',
                    'Source': quote.get('source', 'N/A')
                })
            except Exception as e:
                st.warning(f"Could not load {symbol}: {e}")
        
        if quotes_data:
            df = pd.DataFrame(quotes_data)
            st.dataframe(df, use_container_width=True)

# ============================================================================
# TAB 2: MARKET NEWS
# ============================================================================
with tab2:
    st.header("📰 Real-Time Market News")
    
    col1, col2 = st.columns([2, 1])
    
    with col1:
        st.subheader(f"Latest News: {news_query}")
    
    with col2:
        view_mode = st.radio("View Mode", ["Cards", "List"], horizontal=True)
    
    with st.spinner("Fetching news from multiple sources..."):
        try:
            articles = manager.get_financial_news(query=news_query, limit=news_limit)
            
            if articles:
                # News source statistics
                sources = [a.get('api_source', 'Unknown') for a in articles]
                st.info(f"📡 Aggregated {len(articles)} articles from: {', '.join(set(sources))}")
                
                if view_mode == "Cards":
                    # Card view
                    for article in articles:
                        sentiment_indicator = ""
                        if article.get('sentiment') is not None:
                            sent_score = article['sentiment']
                            if sent_score > 0:
                                sentiment_indicator = f"<span class='positive'>😊 Positive ({sent_score:.2f})</span>"
                            elif sent_score < 0:
                                sentiment_indicator = f"<span class='negative'>😟 Negative ({sent_score:.2f})</span>"
                            else:
                                sentiment_indicator = f"<span class='neutral'>😐 Neutral</span>"
                        
                        st.markdown(f"""
                        <div class="news-card">
                            <h4>{article.get('title', 'No Title')}</h4>
                            <p>{article.get('description', 'No description available')[:200]}...</p>
                            <p style="font-size: 0.85rem; color: rgba(255,255,255,0.7);">
                                <b>Source:</b> {article.get('source', 'Unknown')} ({article.get('api_source', 'N/A')}) | 
                                <b>Published:</b> {article.get('published_at', 'N/A')[:19]}
                                {sentiment_indicator}
                            </p>
                            <a href="{article.get('url', '#')}" target="_blank" style="color: #667eea;">Read More →</a>
                        </div>
                        """, unsafe_allow_html=True)
                else:
                    # List view
                    news_df = pd.DataFrame([{
                        'Title': a.get('title', 'N/A')[:80] + '...',
                        'Source': a.get('source', 'N/A'),
                        'API': a.get('api_source', 'N/A'),
                        'Published': a.get('published_at', 'N/A')[:19],
                        'Sentiment': a.get('sentiment', 'N/A'),
                        'URL': a.get('url', '#')
                    } for a in articles])
                    
                    st.dataframe(news_df, use_container_width=True)
            else:
                st.warning("No news articles found. Try a different query.")
                
        except Exception as e:
            st.error(f"Error fetching news: {e}")

# ============================================================================
# TAB 3: COMPANY PROFILES
# ============================================================================
with tab3:
    st.header("🏢 Company Profiles")
    
    symbol_for_profile = st.selectbox("Select Company", symbols_to_analyze)
    
    if symbol_for_profile:
        col1, col2 = st.columns([1, 1])
        
        with col1:
            st.subheader(f"{symbol_for_profile} - Company Overview")
            
            with st.spinner(f"Loading company data for {symbol_for_profile}..."):
                try:
                    overview = manager.get_company_overview(symbol_for_profile)
                    
                    st.markdown(f"""
                    <div class="metric-card">
                        <h3>{overview.get('name', 'N/A')}</h3>
                        <p><b>Industry:</b> {overview.get('industry', 'N/A')}</p>
                        <p><b>Sector:</b> {overview.get('sector', 'N/A')}</p>
                        <p><b>Market Cap:</b> {overview.get('market_cap', 'N/A')}</p>
                        <p><b>Country:</b> {overview.get('country', 'N/A')}</p>
                        <hr>
                        <p style="font-size: 0.9rem;">{overview.get('description', 'No description available')[:300]}...</p>
                        <p style="font-size: 0.8rem; color: rgba(255,255,255,0.6); margin-top: 1rem;">
                            Source: {overview.get('source', 'N/A')}
                        </p>
                    </div>
                    """, unsafe_allow_html=True)
                    
                    # Additional metrics if available
                    if 'pe_ratio' in overview:
                        st.metric("P/E Ratio", overview.get('pe_ratio', 'N/A'))
                    if 'eps' in overview:
                        st.metric("EPS", overview.get('eps', 'N/A'))
                    if 'dividend_yield' in overview:
                        st.metric("Dividend Yield", overview.get('dividend_yield', 'N/A'))
                    
                except Exception as e:
                    st.error(f"Error loading company overview: {e}")
        
        with col2:
            st.subheader(f"{symbol_for_profile} - Recent News")
            
            with st.spinner(f"Loading news for {symbol_for_profile}..."):
                try:
                    stock_news = manager.get_stock_news(symbol_for_profile, limit=10)
                    
                    for article in stock_news[:5]:
                        st.markdown(f"""
                        <div class="news-card">
                            <h4 style="font-size: 1rem;">{article.get('title', 'No Title')[:80]}...</h4>
                            <p style="font-size: 0.85rem; color: rgba(255,255,255,0.7);">
                                <b>Source:</b> {article.get('source', 'Unknown')} | 
                                {article.get('published_at', 'N/A')[:19]}
                            </p>
                            <a href="{article.get('url', '#')}" target="_blank" style="color: #667eea;">Read More →</a>
                        </div>
                        """, unsafe_allow_html=True)
                        
                except Exception as e:
                    st.error(f"Error loading stock news: {e}")

# ============================================================================
# TAB 4: MULTI-STOCK COMPARISON
# ============================================================================
with tab4:
    st.header("📈 Multi-Stock Comparison")
    
    if len(symbols_to_analyze) > 1:
        with st.spinner("Loading comparison data..."):
            try:
                comparison_data = []
                for symbol in symbols_to_analyze:
                    quote = manager.get_stock_quote(symbol)
                    comparison_data.append({
                        'Symbol': symbol,
                        'Price': quote.get('price', 0),
                        'Change': quote.get('change', 0),
                        'Change %': float(quote.get('change_percent', '0%').replace('%', '')),
                        'Volume': quote.get('volume', 0) if 'volume' in quote else 0
                    })
                
                df_comp = pd.DataFrame(comparison_data)
                
                # Price comparison chart
                fig_price = go.Figure()
                fig_price.add_trace(go.Bar(
                    x=df_comp['Symbol'],
                    y=df_comp['Price'],
                    marker_color=['#00ff88' if x > 0 else '#ff4444' for x in df_comp['Change']],
                    text=df_comp['Price'].round(2),
                    textposition='outside'
                ))
                fig_price.update_layout(
                    title="Stock Price Comparison",
                    xaxis_title="Symbol",
                    yaxis_title="Price ($)",
                    template="plotly_dark",
                    height=400
                )
                st.plotly_chart(fig_price, use_container_width=True)
                
                # Change % comparison
                fig_change = go.Figure()
                fig_change.add_trace(go.Bar(
                    x=df_comp['Symbol'],
                    y=df_comp['Change %'],
                    marker_color=['#00ff88' if x > 0 else '#ff4444' for x in df_comp['Change %']],
                    text=[f"{x:+.2f}%" for x in df_comp['Change %']],
                    textposition='outside'
                ))
                fig_change.update_layout(
                    title="Daily Change % Comparison",
                    xaxis_title="Symbol",
                    yaxis_title="Change (%)",
                    template="plotly_dark",
                    height=400
                )
                st.plotly_chart(fig_change, use_container_width=True)
                
            except Exception as e:
                st.error(f"Error creating comparison: {e}")
    else:
        st.info("ℹ️ Select multiple stocks in the sidebar to enable comparison view.")

# ============================================================================
# TAB 5: API PERFORMANCE
# ============================================================================
with tab5:
    st.header("⚡ API Performance & Statistics")
    
    health = manager.get_api_health()
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        configured_count = sum(1 for api in health['apis'].values() if api['configured'])
        st.metric("Configured APIs", f"{configured_count}/{len(health['apis'])}")
    
    with col2:
        st.metric("Cache Items", health['cache_size'])
    
    with col3:
        config_percentage = (configured_count / len(health['apis'])) * 100
        st.metric("Configuration", f"{config_percentage:.0f}%")
    
    # Detailed API status
    st.subheader("📊 API Status Details")
    
    api_status_data = []
    for api_name, status in health['apis'].items():
        api_status_data.append({
            'API': api_name.upper(),
            'Configured': '✅ Yes' if status['configured'] else '❌ No',
            'Status': status['status'].replace('_', ' ').title()
        })
    
    df_api = pd.DataFrame(api_status_data)
    st.dataframe(df_api, use_container_width=True)
    
    # Data source priority
    st.subheader("🔄 Data Source Priority & Failover")
    
    st.markdown("""
    <div class="metric-card">
        <h4>📊 Stock Data Priority</h4>
        <p>1️⃣ <b>Finnhub</b> (Real-time quotes, company profiles)<br>
        2️⃣ <b>Alpha Vantage</b> (Backup quotes, fundamentals)<br>
        3️⃣ <b>Polygon</b> (Historical and backup data)</p>
        
        <h4 style="margin-top: 1rem;">📰 News Data Priority</h4>
        <p>1️⃣ <b>Marketaux</b> (News with sentiment analysis)<br>
        2️⃣ <b>NewsAPI</b> (Comprehensive news coverage)<br>
        3️⃣ <b>NewsData</b> (Additional news sources)</p>
        
        <h4 style="margin-top: 1rem;">⚡ Features</h4>
        <p>✅ Automatic failover between APIs<br>
        ✅ 5-minute intelligent caching<br>
        ✅ Rate limiting to prevent quota exhaustion<br>
        ✅ Real-time data aggregation<br>
        ✅ Multi-source news integration</p>
    </div>
    """, unsafe_allow_html=True)

# Footer
st.markdown("---")
st.markdown("""
<div style="text-align: center; color: rgba(255,255,255,0.6); padding: 1rem;">
    <p>🚀 Powered by UpTrade AI | Data sources: Finnhub, Alpha Vantage, Polygon, NewsAPI, NewsData, Marketaux</p>
    <p>Real-time market data with intelligent caching and automatic failover</p>
</div>
""", unsafe_allow_html=True)
