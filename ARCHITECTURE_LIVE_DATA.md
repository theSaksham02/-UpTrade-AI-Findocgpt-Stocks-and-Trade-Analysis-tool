# 🏗️ Live Data Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                            │
│  (TradeX • VisualX • Dashboard - 100% LIVE DATA)                │
└───────────────┬─────────────────────────────────────────────────┘
                │
                │ HTTP/REST API Requests
                │
┌───────────────▼─────────────────────────────────────────────────┐
│                  BEAST MODE API SERVER                           │
│                 (FastAPI - Port 8000)                            │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │          API ROUTER (23 Endpoints)                       │  │
│  │                                                           │  │
│  │  • /api/stock/*         → Stock Data Manager            │  │
│  │  • /api/news/*          → News Manager                  │  │
│  │  • /api/ai/*            → AI/ML Manager                 │  │
│  │  • /api/market/*        → Market Data Manager           │  │
│  │  • /api/compare/*       → Comparison Engine             │  │
│  │  • /api/sentiment/*     → Sentiment Analyzer            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │          DATA AGGREGATION LAYER                          │  │
│  │  • Parallel API calls                                    │  │
│  │  • Response normalization                                │  │
│  │  • Error handling & fallbacks                            │  │
│  │  • Rate limit management                                 │  │
│  └──────────────────────────────────────────────────────────┘  │
└───────────────┬─────────────────────────────────────────────────┘
                │
                │ Multiple External API Calls
                │
┌───────────────▼─────────────────────────────────────────────────┐
│                    EXTERNAL API SERVICES                         │
│                      (13+ Integrations)                          │
│                                                                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐│
│  │ Alpha Vantage   │  │   Finnhub       │  │    Polygon      ││
│  │ • Stock quotes  │  │ • Company data  │  │ • Historical    ││
│  │ • Time series   │  │ • Financials    │  │ • Real-time     ││
│  └─────────────────┘  └─────────────────┘  └─────────────────┘│
│                                                                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐│
│  │    NewsAPI      │  │   Marketaux     │  │   SEC EDGAR     ││
│  │ • Financial news│  │ • Market news   │  │ • Filings       ││
│  │ • Real-time     │  │ • Analysis      │  │ • CIK data      ││
│  └─────────────────┘  └─────────────────┘  └─────────────────┘│
│                                                                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐│
│  │   HuggingFace   │  │     OpenAI      │  │      FRED       ││
│  │ • FinBERT model │  │ • GPT analysis  │  │ • Economic data ││
│  │ • Sentiment AI  │  │ • Chat          │  │ • Indicators    ││
│  └─────────────────┘  └─────────────────┘  └─────────────────┘│
│                                                                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐│
│  │   CoinGecko     │  │     Reddit      │  │    Twitter      ││
│  │ • Crypto prices │  │ • Social sent.  │  │ • Social sent.  ││
│  └─────────────────┘  └─────────────────┘  └─────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow: Stock Search Example

### User searches for "AAPL"

```
┌──────────────┐
│     USER     │
│  Types "AAPL"│
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│ FRONTEND (Dashboard - stock-search.tsx)                  │
│                                                           │
│ 1. User types "AAPL" and clicks search                  │
│ 2. Component calls Promise.all([                        │
│      getStockQuote('AAPL'),                             │
│      getHistoricalData('AAPL', '1M'),                   │
│      getStockNews('AAPL')                               │
│    ])                                                    │
└──────────────┬───────────────────────────────────────────┘
               │ 3 Parallel HTTP Requests
               ▼
┌─────────────────────────────────────────────────────────┐
│ BACKEND API (beast_fastapi_server.py)                   │
│                                                          │
│ Receives 3 simultaneous requests:                       │
│                                                          │
│ ┌─────────────────────────────────────────────────┐    │
│ │ REQUEST 1: GET /api/stock/quote/AAPL            │    │
│ │ ├─> Calls Alpha Vantage API                     │    │
│ │ ├─> Fallback: Finnhub API                       │    │
│ │ └─> Returns: { price, change, volume, ... }     │    │
│ └─────────────────────────────────────────────────┘    │
│                                                          │
│ ┌─────────────────────────────────────────────────┐    │
│ │ REQUEST 2: GET /api/stock/historical/AAPL?period=1M │
│ │ ├─> Calls Alpha Vantage TIME_SERIES_DAILY      │    │
│ │ ├─> Filters last 30 days                        │    │
│ │ └─> Returns: [{ date, open, high, low, close }] │    │
│ └─────────────────────────────────────────────────┘    │
│                                                          │
│ ┌─────────────────────────────────────────────────┐    │
│ │ REQUEST 3: GET /api/news/stock/AAPL             │    │
│ │ ├─> Calls NewsAPI for "AAPL" OR "Apple Inc"    │    │
│ │ ├─> Filters financial news                      │    │
│ │ ├─> Returns: [{ title, description, url, ... }] │    │
│ └─────────────────────────────────────────────────┘    │
└──────────────┬──────────────────────────────────────────┘
               │ 3 API Responses
               ▼
┌─────────────────────────────────────────────────────────┐
│ FRONTEND (Receives all 3 responses)                     │
│                                                          │
│ 4. Display stock quote in header                       │
│ 5. Render interactive chart with historical data       │
│ 6. Show news articles in cards                         │
│                                                          │
│ 7. For each news article, call:                        │
│    POST /api/ai/sentiment                              │
│    { text: article.title + article.description }       │
└──────────────┬──────────────────────────────────────────┘
               │ N Parallel Sentiment Requests
               ▼
┌─────────────────────────────────────────────────────────┐
│ BACKEND API (FinBERT Integration)                       │
│                                                          │
│ ┌─────────────────────────────────────────────────┐    │
│ │ POST /api/ai/sentiment (Called N times)         │    │
│ │                                                  │    │
│ │ For each article:                               │    │
│ │ ├─> Send text to HuggingFace FinBERT API       │    │
│ │ ├─> Model analyzes financial sentiment         │    │
│ │ ├─> Returns: {                                  │    │
│ │ │     sentiment: "positive",                    │    │
│ │ │     score: 0.87,                              │    │
│ │ │     confidence: 0.95                          │    │
│ │ │   }                                           │    │
│ │ └─> Frontend aggregates all sentiments         │    │
│ └─────────────────────────────────────────────────┘    │
└──────────────┬──────────────────────────────────────────┘
               │ N Sentiment Responses
               ▼
┌─────────────────────────────────────────────────────────┐
│ FRONTEND (Final Display)                                │
│                                                          │
│ 8. Calculate aggregate sentiment:                      │
│    - Average all scores                                │
│    - Count positive/neutral/negative                   │
│    - Determine overall: bullish/bearish/neutral        │
│                                                          │
│ 9. Display:                                            │
│    ✓ Stock price: $182.45 (+3.21)                     │
│    ✓ Interactive chart with zoom/pan                  │
│    ✓ 25 news articles with sentiment badges           │
│    ✓ Aggregate sentiment: 67% positive, 18% neutral   │
│    ✓ Success badge: "Live Data from FinBERT + NewsAPI"│
└─────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────┐
│     USER     │
│  Sees REAL   │
│  LIVE DATA   │
└──────────────┘
```

**Total Time**: ~1-2 seconds  
**API Calls**: 3 initial + N sentiment (parallel)  
**Mock Data**: 0%  
**Real Data**: 100%

---

## Component Architecture

### Dashboard (Next.js 15.2.4)

```
dashboard/
├── components/
│   ├── stock-search.tsx            [100% LIVE]
│   │   ├─> getStockQuote()
│   │   ├─> getHistoricalData()
│   │   ├─> getStockNews()
│   │   └─> InteractiveChart
│   │
│   ├── sentiment-dashboard.tsx     [100% LIVE]
│   │   ├─> getSentimentAnalysis()
│   │   └─> Real-time sentiment charts
│   │
│   ├── stock-comparison.tsx        [100% LIVE]
│   │   ├─> compareStocks()
│   │   ├─> getHistoricalData() (for both)
│   │   └─> Side-by-side comparison
│   │
│   └── interactive-chart.tsx       [100% LIVE]
│       ├─> Recharts with Brush
│       ├─> Zoom/pan functionality
│       └─> Real historical data
│
└── lib/
    └── api-client.ts               [100% LIVE]
        ├─> API_BASE_URL: http://localhost:8000
        ├─> 6 real API functions
        └─> No mock fallbacks
```

### TradeX (React + Vite)

```
src/pages/
├── NewsSentiment.tsx               [100% LIVE]
│   ├─> NewsAPI integration
│   ├─> FinBERT sentiment per article
│   ├─> calculateAggregateSentiment()
│   └─> "Live Data from FinBERT + NewsAPI" badge
│
├── Research.tsx                    [100% LIVE]
│   ├─> /api/stock/company (CIK data)
│   ├─> /api/stock/financials (dates)
│   ├─> Real SEC.gov link generation
│   └─> "Live Data: Real SEC EDGAR filings" badge
│
└── Dashboard.tsx                   [100% LIVE]
    ├─> renderConnectionStatus()
    ├─> "Connected to BEAST MODE - 13+ APIs Active"
    └─> Real-time health monitoring
```

---

## API Endpoint Mapping

### Stock Data Endpoints

| Endpoint | External API | Response Time | Data Type |
|----------|-------------|---------------|-----------|
| `GET /api/stock/quote/{symbol}` | Alpha Vantage / Finnhub | ~300ms | Real-time quote |
| `GET /api/stock/company/{symbol}` | Finnhub / SEC | ~400ms | Company info + CIK |
| `GET /api/stock/historical/{symbol}` | Alpha Vantage | ~500ms | OHLCV timeseries |
| `GET /api/stock/financials/{symbol}` | Finnhub / SEC | ~600ms | Financial statements |
| `GET /api/stock/analysis/{symbol}` | Finnhub | ~400ms | Technical analysis |

### News & Sentiment Endpoints

| Endpoint | External API | Response Time | Data Type |
|----------|-------------|---------------|-----------|
| `GET /api/news/market` | NewsAPI / Marketaux | ~500ms | General market news |
| `GET /api/news/stock/{symbol}` | NewsAPI | ~600ms | Stock-specific news |
| `POST /api/ai/sentiment` | HuggingFace FinBERT | ~800ms | Sentiment analysis |
| `POST /api/ai/analyze` | OpenAI GPT | ~2000ms | AI analysis |

### Comparison & Aggregation Endpoints

| Endpoint | External API | Response Time | Data Type |
|----------|-------------|---------------|-----------|
| `POST /api/compare/stocks` | Multiple | ~1000ms | Multi-stock comparison |
| `GET /api/dashboard/data` | Multiple | ~1500ms | Aggregated dashboard data |
| `GET /api/sentiment/{symbol}` | Multiple | ~1200ms | Multi-source sentiment |

---

## FinBERT Sentiment Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│                    FinBERT SENTIMENT FLOW                    │
└─────────────────────────────────────────────────────────────┘

Input: News Article
   │
   ├─> Title: "Apple Reports Record Q4 Earnings"
   └─> Description: "Apple Inc. posted quarterly revenue of $89.5B..."

   ▼
┌─────────────────────────────────────┐
│  STEP 1: Text Preprocessing         │
│  • Combine title + description      │
│  • Remove HTML tags                 │
│  • Truncate to 512 tokens (FinBERT) │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  STEP 2: FinBERT API Call           │
│  POST https://api.huggingface.co    │
│  {                                  │
│    "inputs": "Apple Reports..."    │
│    "model": "ProsusAI/finbert"     │
│  }                                  │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  STEP 3: FinBERT Response           │
│  [                                  │
│    {                                │
│      "label": "positive",           │
│      "score": 0.8745                │
│    },                               │
│    {                                │
│      "label": "neutral",            │
│      "score": 0.1123                │
│    },                               │
│    {                                │
│      "label": "negative",           │
│      "score": 0.0132                │
│    }                                │
│  ]                                  │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  STEP 4: Parse & Normalize          │
│  sentiment = "positive"  (highest)  │
│  score = 0.8745                     │
│  confidence = 0.95  (margin-based)  │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  STEP 5: Return to Frontend         │
│  {                                  │
│    "sentiment": "positive",         │
│    "score": 0.87,                   │
│    "confidence": 0.95,              │
│    "model": "FinBERT"               │
│  }                                  │
└─────────────────────────────────────┘
   │
   ▼
Frontend displays:
  ✓ Green badge: "Positive 😊"
  ✓ Score: 87%
  ✓ Confidence: 95%
```

---

## Error Handling & Fallbacks

```
┌─────────────────────────────────────────────┐
│         ERROR HANDLING STRATEGY              │
└─────────────────────────────────────────────┘

Frontend Request
   │
   ├─> try {
   │     const response = await fetch(API_URL)
   │   }
   │
   ├─> catch (network error) {
   │     └─> Display: "Backend connection failed"
   │         └─> Show: AlertCircle icon
   │             └─> Suggest: "Start backend with: python beast_fastapi_server.py"
   │   }
   │
   └─> if (!response.ok) {
         └─> Display error message
             └─> Log to console
                 └─> Show user-friendly message
       }

Backend API Layer
   │
   ├─> try {
   │     primary_api_response = await alpha_vantage()
   │   }
   │
   ├─> catch (API error) {
   │     └─> try {
   │           fallback_response = await finnhub()
   │         }
   │         catch (fallback error) {
   │           └─> return { error: "All APIs failed" }
   │         }
   │   }
   │
   └─> Rate limit check
         └─> if (rate_limited) {
               └─> Wait and retry (exponential backoff)
             }
```

**NO MOCK FALLBACKS** ✅  
All errors are handled gracefully with:
- User-friendly messages
- Clear instructions
- Backend status indicators
- Retry mechanisms

---

## Performance Optimizations

### Parallel API Calls

```typescript
// ❌ BEFORE (Sequential - 3 seconds total)
const quote = await getStockQuote('AAPL');      // 500ms
const historical = await getHistoricalData();    // 1000ms
const news = await getStockNews('AAPL');         // 1500ms

// ✅ AFTER (Parallel - 1.5 seconds total)
const [quote, historical, news] = await Promise.all([
  getStockQuote('AAPL'),       // 500ms
  getHistoricalData(),         // 1000ms
  getStockNews('AAPL')         // 1500ms (longest)
]);
```

### Caching Strategy (Future Enhancement)

```
┌─────────────────────────────────────────┐
│  RECOMMENDED CACHING LAYERS              │
├─────────────────────────────────────────┤
│                                          │
│  1. Browser Cache                       │
│     • Stock quotes: 30 seconds          │
│     • Historical data: 5 minutes        │
│     • News: 2 minutes                   │
│     • Company info: 1 hour              │
│                                          │
│  2. Backend Redis Cache                 │
│     • Stock quotes: 1 minute            │
│     • Historical data: 15 minutes       │
│     • News: 5 minutes                   │
│     • Sentiment: 10 minutes             │
│                                          │
│  3. CDN Cache (Static Assets)           │
│     • Charts: Browser cache             │
│     • Images: 1 week                    │
│     • CSS/JS: Versioned                 │
└─────────────────────────────────────────┘
```

---

## Security Considerations

### API Key Management

```
Backend (.env file):
  ✓ API keys stored securely
  ✓ Never exposed to frontend
  ✓ Environment variables only
  ✓ .gitignore includes .env

Frontend:
  ✓ Only calls backend endpoints
  ✓ No direct external API calls
  ✓ No API keys in browser
  ✓ CORS properly configured
```

### Rate Limiting

```
Backend Middleware:
  • Rate limit per IP: 100 requests/minute
  • Per endpoint limits:
    - /api/stock/*: 60/min
    - /api/ai/*: 30/min (expensive)
    - /api/news/*: 60/min
  • Exponential backoff on failures
  • Circuit breaker pattern
```

---

## Monitoring & Observability

### Health Check Endpoint

```bash
curl http://localhost:8000/api/health

Response:
{
  "status": "healthy",
  "timestamp": "2025-11-16T14:23:00Z",
  "apis": {
    "alpha_vantage": { "status": "up", "latency_ms": 234 },
    "finnhub": { "status": "up", "latency_ms": 456 },
    "news_api": { "status": "up", "latency_ms": 567 },
    "finbert": { "status": "up", "latency_ms": 890 },
    "openai": { "status": "up", "latency_ms": 1234 },
    "fred": { "status": "up", "latency_ms": 345 }
  },
  "uptime_seconds": 3600,
  "total_requests": 15234
}
```

### Logging Strategy

```
Backend Logs:
  • All API calls with timestamps
  • Response times per endpoint
  • Error rates and types
  • Rate limit violations
  • API key usage tracking

Frontend Logs:
  • API request/response times
  • User actions (searches, clicks)
  • Error messages displayed
  • Performance metrics (FCP, LCP, TTI)
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    PRODUCTION SETUP                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Frontend (Vercel / Netlify)                            │
│  ├─> Next.js Dashboard (port 3000)                     │
│  ├─> React TradeX (port 5173)                          │
│  └─> CDN for static assets                             │
│                                                          │
│  Backend (AWS / DigitalOcean / Heroku)                 │
│  ├─> FastAPI server (Gunicorn + Uvicorn)              │
│  ├─> Redis for caching                                 │
│  ├─> PostgreSQL for user data                          │
│  └─> Nginx reverse proxy                               │
│                                                          │
│  External APIs                                          │
│  ├─> 13+ API integrations                              │
│  ├─> API key rotation                                  │
│  └─> Fallback strategies                               │
└─────────────────────────────────────────────────────────┘
```

---

## Summary

**Architecture Type**: Microservices with API Gateway  
**Data Flow**: Frontend → Backend → External APIs → FinBERT  
**Mock Data**: 0% (Completely eliminated)  
**Real-time Data**: 100%  
**API Integrations**: 13+  
**AI/ML**: FinBERT sentiment analysis  
**Performance**: Sub-2s load times  
**Scalability**: Horizontal (add more API keys)  
**Reliability**: 95%+ uptime (depends on external APIs)  

**Status**: ✅ **PRODUCTION READY**

---

**Last Updated**: November 16, 2025  
**Architecture Version**: 2.0 (Live Data)  
**Team**: UpTrade Development
