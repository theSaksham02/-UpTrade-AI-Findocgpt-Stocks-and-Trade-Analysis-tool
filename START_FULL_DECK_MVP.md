# 🚀 START FULL DECK MVP - Complete Guide

## 🎯 What You Have Now

You have a **production-ready MVP** with:

✅ **13+ API integrations** (Alpha Vantage, Finnhub, Polygon, NewsAPI, NewsData, Marketaux, FMP, FRED, ExchangeRate, CoinGecko, OpenAI, HuggingFace, Twitter/Reddit)  
✅ **Triple failover** for stock data (Finnhub → Alpha Vantage → Polygon)  
✅ **Quad aggregation** for news (NewsAPI + NewsData + Marketaux + Finnhub)  
✅ **Historical data endpoint** with triple failover  
✅ **Sentiment analysis** with FinBERT + multi-source news  
✅ **Comprehensive comparison** with financials, ratings, news  
✅ **Zero mock data** - production-ready error handling  
✅ **23+ API endpoints** - all documented  

---

## 📋 Prerequisites

### Required API Keys (Minimum)

**Stock Data** (Need at least 1):
- Alpha Vantage: https://www.alphavantage.co/support/#api-key (FREE)
- Finnhub: https://finnhub.io/register (FREE)
- Polygon: https://polygon.io/dashboard/signup (FREE tier)

**News** (Need at least 1):
- NewsAPI: https://newsapi.org/register (FREE)
- NewsData: https://newsdata.io/register (FREE)
- Marketaux: https://www.marketaux.com/account/signup (FREE)

**Recommended for Full Features**:
- FMP (Financial Modeling Prep): https://site.financialmodelingprep.com/developer/docs (FREE)
- HuggingFace: https://huggingface.co/settings/tokens (FREE)

### Python Dependencies

```bash
pip install -r requirements.txt
```

---

## ⚙️ Configuration

### 1. Create `.env` File

```bash
cd /Users/sakshammishra/AkashX.ai-FinDocGPT-AI-for-financial-document-analysis-investment-strategy/-UpTrade-AI-Findocgpt-Stocks-and-Trade-Analysis-tool

cat > .env << 'EOF'
# STOCK DATA APIs (Need at least 1)
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key
FINNHUB_API_KEY=your_finnhub_key
POLYGON_API_KEY=your_polygon_key

# NEWS APIs (Need at least 1)
NEWS_API_KEY=your_newsapi_key
NEWSDATA_API_KEY=your_newsdata_key
MARKETAUX_API_KEY=your_marketaux_key

# FINANCIAL APIs (Optional but recommended)
FMP_API_KEY=your_fmp_key

# AI/ML APIs (Optional for sentiment analysis)
HUGGINGFACE_API_KEY=your_huggingface_key
OPENAI_API_KEY=your_openai_key

# ECONOMIC & FOREX (Optional)
FRED_API_KEY=your_fred_key
EXCHANGERATE_API_KEY=your_exchangerate_key

# SOCIAL MEDIA (Optional)
TWITTER_BEARER_TOKEN=your_twitter_token
REDDIT_CLIENT_ID=your_reddit_id
REDDIT_CLIENT_SECRET=your_reddit_secret

# SERVER
PORT=8000
HOST=0.0.0.0
EOF
```

### 2. Verify Configuration

```bash
# Check if .env exists
ls -la .env

# View your configuration (hide sensitive keys)
cat .env | sed 's/=.*/=***HIDDEN***/'
```

---

## 🚀 Start Backend Server

### Option 1: Direct Python

```bash
# Navigate to project directory
cd /Users/sakshammishra/AkashX.ai-FinDocGPT-AI-for-financial-document-analysis-investment-strategy/-UpTrade-AI-Findocgpt-Stocks-and-Trade-Analysis-tool

# Start server
python beast_fastapi_server.py
```

### Option 2: Using start script

```bash
chmod +x start.sh
./start.sh
```

### Expected Output

```
🚀 BEAST MODE API SERVER - FULL DECK MVP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Loaded configuration from .env
✅ Alpha Vantage: Configured
✅ Finnhub: Configured
✅ Polygon: Configured
✅ NewsAPI: Configured
✅ NewsData: Configured
✅ Marketaux: Configured
✅ FMP: Configured
✅ HuggingFace: Configured

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📡 Server running at: http://localhost:8000
📚 API Docs: http://localhost:8000/docs
🔍 Health Check: http://localhost:8000/health
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INFO:     Started server process [12345]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

---

## ✅ Test APIs

### 1. Health Check

```bash
curl http://localhost:8000/health
```

**Expected:**
```json
{
  "status": "healthy",
  "version": "2.0.0",
  "apis_configured": 13,
  "apis": {
    "alpha_vantage": true,
    "finnhub": true,
    "polygon": true,
    "newsapi": true,
    "newsdata": true,
    "marketaux": true,
    "fmp": true,
    "huggingface": true
  }
}
```

### 2. Stock Quote (Triple Failover)

```bash
curl http://localhost:8000/api/stock/quote/AAPL
```

**Expected:**
```json
{
  "symbol": "AAPL",
  "current_price": 182.45,
  "change": 3.21,
  "percent_change": 1.79,
  "high": 183.12,
  "low": 180.34,
  "volume": 54380000,
  "previous_close": 179.24,
  "source": "Finnhub"
}
```

### 3. Historical Data (NEW - Triple Failover)

```bash
curl "http://localhost:8000/api/stock/historical/AAPL?period=1M"
```

**Expected:**
```json
{
  "symbol": "AAPL",
  "period": "1M",
  "data": [
    {
      "date": "2024-01-15",
      "open": 180.12,
      "high": 183.45,
      "low": 179.80,
      "close": 182.45,
      "volume": 54380000
    }
    // ... 29 more days
  ],
  "source": "Alpha Vantage",
  "total_days": 30
}
```

### 4. News Aggregation (Quad Sources)

```bash
curl "http://localhost:8000/api/news/stock/AAPL?limit=10"
```

**Expected:**
```json
{
  "symbol": "AAPL",
  "articles": [
    {
      "title": "Apple Reports Record Q4 Earnings",
      "description": "Tech giant exceeds expectations...",
      "url": "https://reuters.com/...",
      "source": "Reuters",
      "published_at": "2024-01-15T14:30:00Z"
    }
    // ... 9 more articles
  ],
  "total": 10,
  "sources": ["NewsAPI", "NewsData", "Marketaux", "Finnhub"]
}
```

### 5. Sentiment Analysis (NEW - Multi-Source + FinBERT)

```bash
curl http://localhost:8000/api/sentiment/AAPL
```

**Expected:**
```json
{
  "symbol": "AAPL",
  "overall": "bullish",
  "score": 0.42,
  "distribution": {
    "positive": 67.3,
    "neutral": 18.2,
    "negative": 14.5
  },
  "totalArticles": 25,
  "analyzedArticles": 22,
  "source": "FinBERT + Multi-Source News",
  "news_sources": ["NewsAPI", "NewsData", "Marketaux", "Finnhub"]
}
```

### 6. Stock Comparison (Enhanced - Full Data)

```bash
curl -X POST http://localhost:8000/api/compare/stocks \
  -H "Content-Type: application/json" \
  -d '["AAPL", "MSFT"]'
```

**Expected:**
```json
{
  "AAPL": {
    "quote": { "current_price": 182.45, "change": 1.79 },
    "company": { "name": "Apple Inc.", "sector": "Technology" },
    "financials": { "revenue": 89500000000, "netIncome": 23400000000 },
    "rating": { "rating": "Strong Buy", "ratingScore": 4.8 },
    "news_count": 5,
    "recent_news": [
      { "title": "Apple Reports Record Q4", "source": "Reuters" }
    ]
  },
  "MSFT": {
    "quote": { "current_price": 415.32, "change": 2.12 },
    "company": { "name": "Microsoft Corp.", "sector": "Technology" },
    "financials": { "revenue": 56200000000, "netIncome": 18300000000 },
    "rating": { "rating": "Buy", "ratingScore": 4.5 },
    "news_count": 5,
    "recent_news": [
      { "title": "Microsoft Cloud Growth", "source": "Bloomberg" }
    ]
  },
  "sources": ["Finnhub", "Alpha Vantage", "FMP", "NewsAPI", "NewsData", "Marketaux"]
}
```

### 7. Test All Endpoints

```bash
# Run comprehensive test suite
python test_all_apis.py
```

**Expected:**
```
🧪 TESTING FULL DECK MVP - ALL ENDPOINTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Health Check: PASSED
✅ Stock Quote: PASSED (Source: Finnhub)
✅ Historical Data: PASSED (Source: Alpha Vantage)
✅ Company Info: PASSED (Source: Finnhub)
✅ Stock News: PASSED (4 sources)
✅ Sentiment Analysis: PASSED (FinBERT + Multi-Source)
✅ Stock Comparison: PASSED (Full data)
✅ Economic Data: PASSED (FRED)
✅ Forex Rates: PASSED (ExchangeRate-API)
✅ Crypto Prices: PASSED (CoinGecko)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL: 10/10 TESTS PASSED ✅
FULL DECK MVP: OPERATIONAL 🚀
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🎨 Test Frontend

### 1. Navigate to Frontend

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Update API Base URL (if needed)

```bash
# Edit .env.local
cat > .env.local << 'EOF'
VITE_API_BASE_URL=http://localhost:8000
EOF
```

### 4. Start Frontend

```bash
npm run dev
```

### 5. Open Browser

```
http://localhost:5173
```

### 6. Test Features

**Dashboard:**
- Search for "AAPL"
- Verify quote displays (should show source: "Finnhub" or "Alpha Vantage")
- Check historical chart (1M period, 30 data points)
- Verify news articles (should have 4 source badges)
- Check sentiment badges (should show FinBERT analysis)

**TradeX:**
- Compare "AAPL vs MSFT"
- Verify side-by-side comparison
- Check financials section (NEW)
- Check ratings section (NEW)
- Verify news count and recent articles (NEW)

**NewsSentiment:**
- Search for "AAPL"
- Verify 20 articles from multiple sources
- Check sentiment badges (green/yellow/red)
- Verify "Live Data" badge shows all sources

---

## 🐛 Troubleshooting

### Error: "No stock data available"

**Cause:** No stock API keys configured  
**Solution:**
```bash
# Add at least 1 stock API key to .env
ALPHA_VANTAGE_API_KEY=your_key
# OR
FINNHUB_API_KEY=your_key
# OR
POLYGON_API_KEY=your_key

# Restart server
python beast_fastapi_server.py
```

### Error: "No news articles found"

**Cause:** No news API keys configured  
**Solution:**
```bash
# Add at least 1 news API key to .env
NEWS_API_KEY=your_key
# OR
NEWSDATA_API_KEY=your_key
# OR
MARKETAUX_API_KEY=your_key

# Restart server
```

### Error: "Rate limit exceeded"

**Cause:** API rate limit hit  
**Solution:**
- Wait 1 minute for rate limit to reset
- System has built-in 1-second delays between requests
- Consider upgrading to paid API plan for higher limits

### Error: "Connection refused"

**Cause:** Backend not running  
**Solution:**
```bash
# Start backend
python beast_fastapi_server.py

# Verify it's running
curl http://localhost:8000/health
```

### Frontend can't connect to backend

**Cause:** CORS or wrong API URL  
**Solution:**
```bash
# Check backend logs for CORS errors
# Frontend should use http://localhost:8000

# Update frontend/.env.local
VITE_API_BASE_URL=http://localhost:8000

# Restart frontend
npm run dev
```

### Historical data returns empty array

**Cause:** API doesn't support historical data for symbol  
**Solution:**
- Try major symbols: AAPL, MSFT, GOOGL, TSLA
- Check backend logs for specific error
- Verify API keys are valid

---

## 📊 Performance Tips

### 1. Enable Caching

Caching is enabled by default with these TTLs:
- Stock quotes: 30 seconds
- Historical data: 5 minutes
- News: 2 minutes
- Company info: 1 hour

### 2. Use Parallel Requests

```javascript
// Good: Parallel requests
const [quote, news, sentiment] = await Promise.all([
  getStockQuote('AAPL'),
  getStockNews('AAPL'),
  getSentiment('AAPL')
]);

// Bad: Sequential requests (slower)
const quote = await getStockQuote('AAPL');
const news = await getStockNews('AAPL');
const sentiment = await getSentiment('AAPL');
```

### 3. Batch Symbol Requests

```bash
# Good: Single request for multiple symbols
curl -X POST /api/stock/batch \
  -d '["AAPL", "MSFT", "GOOGL"]'

# Bad: Multiple separate requests
curl /api/stock/quote/AAPL
curl /api/stock/quote/MSFT
curl /api/stock/quote/GOOGL
```

### 4. Monitor API Usage

```bash
# Check logs for API call patterns
tail -f logs/api_calls.log

# Look for:
# - Cache hit rate
# - API failover events
# - Rate limit warnings
```

---

## 📚 Documentation

### Quick References

- **API Quick Reference**: `API_QUICK_REFERENCE.md`
- **Full Documentation**: `FULL_DECK_MVP_COMPLETE.md`
- **System Diagram**: `SYSTEM_DIAGRAM.md`
- **Testing Guide**: `LIVE_DATA_TESTING_GUIDE.md`

### API Documentation (Interactive)

```
http://localhost:8000/docs
```

FastAPI automatically generates:
- Interactive API documentation
- Try-it-out feature for each endpoint
- Request/response schemas
- Example payloads

---

## 🎯 What's Working Now

### Stock Data (Triple Failover)
✅ Real-time quotes (Finnhub → Alpha Vantage → Polygon)  
✅ Historical OHLCV (Alpha Vantage → Polygon → Finnhub)  
✅ Company overview (Finnhub → Alpha Vantage)  
✅ Batch quotes (all 3 APIs)  

### News (Quad Aggregation)
✅ Financial news (NewsAPI + NewsData + Marketaux + Finnhub)  
✅ Stock-specific news (4 sources)  
✅ Query search (4 sources)  
✅ Multi-source aggregation (no duplicates)  

### Sentiment (Multi-Source + AI)
✅ FinBERT analysis (HuggingFace)  
✅ Multi-article aggregation (20+ articles)  
✅ Distribution calculation (positive/neutral/negative %)  
✅ Overall sentiment determination (bullish/bearish/neutral)  

### Comparison (Comprehensive)
✅ Side-by-side quotes  
✅ Company information  
✅ Financial metrics (revenue, net income, P/E)  
✅ Analyst ratings (rating, score)  
✅ Recent news (3 articles per symbol)  
✅ News count  

### Additional Features
✅ Economic indicators (FRED)  
✅ Forex rates (ExchangeRate-API)  
✅ Crypto prices (CoinGecko)  
✅ AI text analysis (OpenAI GPT)  
✅ Financial sentiment (FinBERT)  

---

## 🚀 Production Deployment

### Docker Deployment

```bash
# Build image
docker build -t uptrade-mvp .

# Run container
docker run -d \
  -p 8000:8000 \
  --env-file .env \
  --name uptrade-backend \
  uptrade-mvp
```

### Docker Compose

```bash
docker-compose up -d
```

### Environment Variables (Production)

```bash
# Use environment-specific keys
ALPHA_VANTAGE_API_KEY=${PROD_ALPHA_VANTAGE_KEY}
FINNHUB_API_KEY=${PROD_FINNHUB_KEY}
# ... other keys

# Enable production mode
ENVIRONMENT=production
DEBUG=false

# Configure caching
CACHE_TTL_QUOTES=60
CACHE_TTL_HISTORICAL=600
```

---

## 🎉 Success Checklist

Before going live, verify:

- [ ] All API keys configured in `.env`
- [ ] Backend starts without errors
- [ ] Health check returns all APIs as configured
- [ ] Stock quote returns real data (not 404)
- [ ] Historical data returns 30 data points
- [ ] News returns articles from multiple sources
- [ ] Sentiment analysis returns FinBERT scores
- [ ] Comparison returns full data (financials, ratings, news)
- [ ] Frontend connects to backend
- [ ] All badges show "Live Data from [API names]"
- [ ] No "Loading mock data" messages
- [ ] Test script passes all 10 tests

---

## 🏁 You're Ready!

Your **FULL DECK MVP** is now operational with:

🎯 **13+ APIs** integrated  
🎯 **Triple failover** for critical data  
🎯 **Quad aggregation** for news  
🎯 **Zero mock data** - 100% production-ready  
🎯 **23+ endpoints** - all documented  
🎯 **FinBERT AI** - sentiment analysis  
🎯 **Comprehensive comparison** - full financial data  

**Status**: 🟢 **PRODUCTION READY**

**Next Steps**:
1. Run `python beast_fastapi_server.py`
2. Test with `curl http://localhost:8000/health`
3. Open frontend: `npm run dev`
4. Deploy to production when ready

**Support Documentation**:
- `FULL_DECK_MVP_COMPLETE.md` - Complete technical guide
- `API_QUICK_REFERENCE.md` - Quick API reference
- `SYSTEM_DIAGRAM.md` - Visual system architecture
- `http://localhost:8000/docs` - Interactive API docs

---

## 🆘 Need Help?

**Check these files first**:
1. `FULL_DECK_MVP_COMPLETE.md` - Comprehensive documentation
2. `API_QUICK_REFERENCE.md` - Quick reference card
3. Backend logs: Check terminal output
4. API docs: `http://localhost:8000/docs`

**Common issues**:
- No data? → Check API keys in `.env`
- Rate limit? → Wait 1 minute, consider paid plans
- CORS error? → Verify backend URL in frontend
- 404 error? → Verify endpoint path and method

---

**Last Updated**: January 2024  
**Version**: 2.0.0 - Full Deck MVP  
**Status**: ✅ Production Ready
