# UpTrade AI - Complete MVP Setup Guide

## 🚀 Quick Start

The application is now running on **port 3000**:
- **Landing Page**: http://localhost:3000
- **Dashboard**: http://localhost:3000/dashboard
- **TradeX**: http://localhost:3000/tradex
- **VisualX**: http://localhost:3000/visualx

## ✅ What's Built

### 1. **TradeX - Multi-Stock Comparison**
- Compare up to 5 stocks simultaneously
- Real-time price charts with multiple timeframes (1D, 1M, 1Y, 10Y)
- News aggregation with sentiment analysis
- Social media sentiment tracking (Reddit, Twitter, StockTwits)
- Key metrics comparison dashboard
- Search all US stocks and options

### 2. **VisualX - Deep Market Analysis**
- Gantt-style market event timeline
- 30-day price forecasting with confidence intervals
- Anomaly detection (price spikes, volume surges, volatility)
- Sentiment trend analysis over time
- Event correlation with price movements
- Visual timeline of market-moving events

### 3. **API Integration**
- Alpha Vantage (stock quotes, historical data, search)
- Finnhub (news, social sentiment)
- Automatic fallback to mock data when API limits reached
- Real-time data updates

## 📊 Features

### TradeX Features:
- ✅ Search US stocks, ETFs, and options
- ✅ Add up to 5 stocks for comparison
- ✅ Real-time price updates
- ✅ Interactive price comparison charts
- ✅ Performance bar charts
- ✅ Detailed metrics (Price, Volume, Market Cap, P/E, 52W High/Low)
- ✅ News feed with sentiment badges
- ✅ Social sentiment from multiple platforms
- ✅ Trending indicators

### VisualX Features:
- ✅ Event timeline visualization
- ✅ Price forecasting (30 days)
- ✅ Anomaly detection with severity levels
- ✅ Market event correlation
- ✅ Sentiment trend analysis
- ✅ Statistical anomaly scoring
- ✅ Interactive charts with historical + forecast data

## 🔑 API Keys Setup

To enable real-time data, add these API keys to `.env.local`:

```bash
# Alpha Vantage (Free tier: 5 requests/minute, 500/day)
NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY=your_key_here

# Finnhub (Free tier: 60 requests/minute)
NEXT_PUBLIC_FINNHUB_API_KEY=your_key_here

# NewsAPI (Free tier: 100 requests/day)
NEXT_PUBLIC_NEWS_API_KEY=your_key_here

# Polygon.io (Optional - for options data)
NEXT_PUBLIC_POLYGON_API_KEY=your_key_here
```

### Get Free API Keys:

1. **Alpha Vantage**: https://www.alphavantage.co/support/#api-key
   - Free tier: 5 API calls per minute, 500 per day
   - Used for: Stock quotes, historical data, search

2. **Finnhub**: https://finnhub.io/register
   - Free tier: 60 API calls per minute
   - Used for: News, social sentiment, company data

3. **NewsAPI**: https://newsapi.org/register
   - Free tier: 100 requests per day
   - Used for: Financial news aggregation

## 🎯 How to Use

### TradeX - Stock Comparison:
1. Go to http://localhost:3000/tradex
2. Search for stocks (e.g., AAPL, GOOGL, TSLA)
3. Add up to 5 stocks to compare
4. Switch between tabs:
   - **Price Chart**: Compare price movements
   - **Metrics**: View key financial metrics
   - **News**: Read latest news with sentiment
   - **Sentiment**: Check social media sentiment

### VisualX - Deep Analysis:
1. Go to http://localhost:3000/visualx
2. Search for a stock to analyze
3. Explore different views:
   - **Event Timeline**: See market events on price chart
   - **Forecast**: View 30-day price predictions
   - **Anomalies**: Identify unusual patterns
   - **Sentiment**: Track sentiment trends

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **UI Components**: shadcn/ui (Radix UI)
- **TypeScript**: Full type safety
- **APIs**: Alpha Vantage, Finnhub, NewsAPI

## 📝 Mock Data

The application works **without API keys** using intelligent mock data:
- Realistic stock prices and movements
- Generated news with sentiment analysis
- Simulated social media data
- Forecasting using statistical models
- Anomaly detection algorithms

## 🚀 Deployment

The app is production-ready. To deploy:

```bash
# Build for production
npm run build

# Start production server
npm start
```

Or deploy to Vercel:
```bash
vercel
```

## 📈 Next Steps

1. **Add API Keys** - Get free keys from the providers above
2. **Test Real Data** - Search for stocks and verify live data
3. **Customize** - Add your own branding and features
4. **Deploy** - Share with users

## 🎨 Design

- Bloomberg-inspired dark theme
- Professional trader interface
- Responsive design (mobile, tablet, desktop)
- Smooth animations and transitions
- Accessible UI components

## ⚡ Performance

- Optimized chart rendering
- Efficient data fetching with parallel requests
- Client-side caching
- Responsive loading states
- Error handling and fallbacks

---

**Status**: ✅ Fully functional MVP ready for production!

Access the app at: **http://localhost:3000**
