# 🎯 API QUICK REFERENCE CARD

## Stock Data - TRIPLE REDUNDANCY ✅

### `/api/stock/quote/{symbol}`
**Sources**: Finnhub → Alpha Vantage → Polygon  
**Returns**: Real-time price, change, volume, OHLC  
**Example**: `GET /api/stock/quote/AAPL`  
```json
{
  "symbol": "AAPL",
  "price": 182.45,
  "change": 3.21,
  "change_percent": "1.79%",
  "volume": 54382910,
  "source": "Finnhub"
}
```

### `/api/stock/historical/{symbol}?period=1M`
**Sources**: Alpha Vantage → Polygon → Finnhub  
**Periods**: 1D, 1W, 1M, 3M, 6M, 1Y, 5Y, 10Y, YTD  
**Returns**: OHLCV data array  
**Example**: `GET /api/stock/historical/AAPL?period=1M`  
```json
{
  "symbol": "AAPL",
  "period": "1M",
  "data": [
    {"date": "2025-11-15", "open": 180.0, "high": 183.5, "low": 179.2, "close": 182.45, "volume": 54382910}
  ],
  "source": "Alpha Vantage"
}
```

### `/api/stock/company/{symbol}`
**Sources**: Finnhub → Alpha Vantage  
**Returns**: Company profile, fundamentals  
**Example**: `GET /api/stock/company/AAPL`

---

## News - QUAD AGGREGATION ✅

### `/api/news/stock/{symbol}?limit=20`
**Sources**: Finnhub + NewsAPI + NewsData + Marketaux  
**Returns**: Aggregated articles from all sources  
**Example**: `GET /api/news/stock/TSLA?limit=10`  
```json
{
  "symbol": "TSLA",
  "count": 10,
  "articles": [
    {
      "title": "Tesla Reports Q4 Earnings",
      "description": "...",
      "source": "Bloomberg",
      "url": "https://...",
      "published_at": "2025-11-16T10:00:00Z",
      "api_source": "NewsAPI"
    }
  ]
}
```

---

## Sentiment - FINBERT AI ✅

### `POST /api/ai/sentiment`
**Source**: HuggingFace FinBERT  
**Body**: `{"text": "...", "symbol": "AAPL"}`  
**Returns**: Sentiment label + score  
**Example**:
```bash
curl -X POST http://localhost:8000/api/ai/sentiment \
  -H "Content-Type: application/json" \
  -d '{"text":"Apple reports record earnings","symbol":"AAPL"}'
```
```json
{
  "sentiment": "positive",
  "score": 0.87,
  "confidence": 0.95,
  "model": "FinBERT"
}
```

### `GET /api/sentiment/{symbol}`
**Source**: FinBERT + All News APIs  
**Returns**: Aggregated sentiment from 20+ articles  
**Example**: `GET /api/sentiment/AAPL`  
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
  "source": "FinBERT + Multi-Source News"
}
```

---

## Comparison - FULL DATA ✅

### `POST /api/compare/stocks`
**Sources**: ALL APIs (quotes, financials, ratings, news)  
**Body**: `["AAPL", "MSFT"]`  
**Returns**: Side-by-side comprehensive comparison  
**Example**:
```bash
curl -X POST http://localhost:8000/api/compare/stocks \
  -H "Content-Type: application/json" \
  -d '["AAPL","MSFT"]'
```
```json
{
  "symbols": ["AAPL", "MSFT"],
  "comparison": {
    "AAPL": {
      "quote": {...},
      "company": {...},
      "financials": {...},
      "rating": {...},
      "news_count": 5,
      "recent_news": [...]
    },
    "MSFT": {...}
  },
  "sources": {
    "quotes": "Finnhub + Alpha Vantage + Polygon",
    "financials": "FMP",
    "news": "NewsAPI + NewsData + Marketaux + Finnhub"
  }
}
```

---

## Economic - FRED ✅

### `GET /api/economic/indicators`
**Source**: FRED (Federal Reserve)  
**Returns**: Key indicators (GDP, unemployment, CPI, Fed funds, yield curve)  
**Example**: `GET /api/economic/indicators`

### `GET /api/economic/indicator/{series_id}?limit=10`
**Source**: FRED  
**Common Series**: GDP, UNRATE, CPIAUCSL, DFF, T10Y2Y  
**Example**: `GET /api/economic/indicator/UNRATE?limit=10`

---

## Financials - FMP ✅

### `GET /api/stock/financials/{symbol}?period=annual`
**Source**: Financial Modeling Prep  
**Periods**: annual, quarter  
**Returns**: Income statements, balance sheets  
**Example**: `GET /api/stock/financials/AAPL?period=annual`

### `GET /api/stock/rating/{symbol}`
**Source**: FMP  
**Returns**: Analyst rating + recommendation  
**Example**: `GET /api/stock/rating/AAPL`

---

## Crypto - COINGECKO ✅

### `GET /api/crypto/prices?ids=bitcoin,ethereum`
**Source**: CoinGecko (FREE - no key needed)  
**Returns**: Prices + 24h change + market cap  
**Example**: `GET /api/crypto/prices?ids=bitcoin,ethereum,cardano`

---

## AI Analysis - GPT ✅

### `POST /api/ai/analyze`
**Source**: OpenAI GPT-3.5/4  
**Body**: `{"prompt": "Analyze AAPL stock", "context": [...]}`  
**Returns**: Conversational AI analysis  
**Example**:
```bash
curl -X POST http://localhost:8000/api/ai/analyze \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Should I invest in AAPL?"}'
```

---

## System Health ✅

### `GET /api/health`
**Returns**: Status of ALL 13+ APIs with latency  
**Example**: `GET /api/health`  
```json
{
  "status": "healthy",
  "apis": {
    "alpha_vantage": {"status": "up", "latency_ms": 234},
    "finnhub": {"status": "up", "latency_ms": 456},
    "news_api": {"status": "up", "latency_ms": 567},
    ...
  },
  "uptime_seconds": 3600
}
```

### `GET /api/status`
**Returns**: Quick system status  
**Example**: `GET /api/status`  
```json
{
  "status": "operational",
  "mode": "BEAST MODE",
  "apis_configured": "13/14",
  "configuration_percentage": 93
}
```

---

## Quick Test Commands

```bash
# 1. Stock Quote (Triple Failover)
curl http://localhost:8000/api/stock/quote/AAPL

# 2. Historical Data (Triple Failover)
curl "http://localhost:8000/api/stock/historical/AAPL?period=1M"

# 3. News (Quad Aggregation)
curl "http://localhost:8000/api/news/stock/TSLA?limit=10"

# 4. Sentiment Analysis (FinBERT)
curl -X POST http://localhost:8000/api/ai/sentiment \
  -H "Content-Type: application/json" \
  -d '{"text":"Tesla stock soars on strong earnings"}'

# 5. Aggregated Sentiment (Multi-Source)
curl http://localhost:8000/api/sentiment/AAPL

# 6. Stock Comparison (Full Data)
curl -X POST http://localhost:8000/api/compare/stocks \
  -H "Content-Type: application/json" \
  -d '["AAPL","MSFT","GOOGL"]'

# 7. Health Check
curl http://localhost:8000/api/health
```

---

## API Key Requirements

**Minimum** (to start):
```env
FINNHUB_KEY=your_key          # OR
ALPHA_VANTAGE_KEY=your_key    # OR
POLYGON_API_KEY=your_key      # (choose at least 1)

NEWS_API_KEY=your_key         # OR
NEWSDATA_API_KEY=your_key     # OR
MARKETAUX_API_KEY=your_key    # (choose at least 1)
```

**Recommended** (full features):
```env
# All 3 stock APIs (triple failover)
ALPHA_VANTAGE_KEY=your_key
FINNHUB_KEY=your_key
POLYGON_API_KEY=your_key

# All 3 news APIs (quad aggregation with Finnhub)
NEWS_API_KEY=your_key
NEWSDATA_API_KEY=your_key
MARKETAUX_API_KEY=your_key

# Additional features
FMP_API_KEY=your_key              # Financials
FRED_API_KEY=your_key             # Economic data
HUGGINGFACE_API_KEY=your_key      # FinBERT
OPENAI_API_KEY=your_key           # GPT analysis
```

---

## Response Times

| Endpoint | Avg Time | Caching |
|----------|----------|---------|
| Stock quote | 300-500ms | 30s |
| Historical | 500-1000ms | 5min |
| News | 1000-1500ms | 2min |
| Sentiment | 800ms | 10min |
| Company | 400ms | 1hr |
| Comparison | 2000-3000ms | None |

---

## Error Handling

**If all APIs fail**:
```json
{
  "error": "No stock data available for AAPL",
  "message": "Please configure Alpha Vantage, Finnhub, or Polygon API keys in .env file",
  "status": 500
}
```

**If no API keys configured**:
```json
{
  "error": "API keys not configured",
  "message": "Please add API keys to .env file",
  "status": 503
}
```

---

**Full Documentation**: See `FULL_DECK_MVP_COMPLETE.md`  
**Architecture**: See `ARCHITECTURE_LIVE_DATA.md`  
**Testing Guide**: See `LIVE_DATA_TESTING_GUIDE.md`
