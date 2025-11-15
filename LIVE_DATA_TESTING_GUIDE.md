# 🧪 Live Data Testing Guide

## Quick Test Checklist

### Before Testing
- [ ] Backend running on http://localhost:8000
- [ ] Dashboard running on http://localhost:3000
- [ ] Old frontend running on http://localhost:5173
- [ ] All API keys in `.env` file

---

## Test 1: Dashboard Stock Search

**URL**: http://localhost:3000

**Steps**:
1. Search for "AAPL"
2. Should see real-time data:
   - Current price from Alpha Vantage/Finnhub
   - Interactive chart with historical data
   - Real news articles from NewsAPI
   - FinBERT sentiment scores on articles

**Expected**: Green "✓ Live Data" indicator, no errors

---

## Test 2: Sentiment Dashboard

**URL**: http://localhost:3000

**Steps**:
1. Click "Sentiment Dashboard" tab
2. Search for "TSLA"
3. Should see:
   - Real sentiment distribution pie chart
   - FinBERT sentiment scores
   - Multiple sources (news/social/analyst)

**Expected**: Real percentages (not 45/30/25 hardcoded)

---

## Test 3: Stock Comparison

**URL**: http://localhost:3000

**Steps**:
1. Click "Compare Stocks" tab
2. Compare AAPL vs MSFT
3. Should see:
   - Real financial metrics
   - Historical price comparison
   - Live score calculations

**Expected**: Different metrics for each stock, real data

---

## Test 4: News Sentiment (TradeX)

**URL**: http://localhost:5173/news-sentiment

**Steps**:
1. Search for "GOOGL"
2. Should see:
   - Real news articles from NewsAPI
   - "Live Data from FinBERT + NewsAPI" badge
   - Sentiment badge on each article
   - Aggregate sentiment with percentages

**Expected**: Different articles than last search, real dates

---

## Test 5: Research (SEC Filings)

**URL**: http://localhost:5173/research

**Steps**:
1. Search for "MSFT"
2. Should see:
   - "✓ Live Data: Showing real SEC EDGAR filings"
   - Real SEC.gov links (click to verify)
   - Actual filing dates

**Expected**: Links should open SEC.gov with real documents

---

## Test 6: Backend Health Check

**Terminal**:
```bash
curl http://localhost:8000/api/health
```

**Expected Response**:
```json
{
  "status": "healthy",
  "apis": {
    "alpha_vantage": true,
    "finnhub": true,
    "news_api": true,
    "finbert": true,
    ...
  }
}
```

---

## Test 7: FinBERT Sentiment API

**Terminal**:
```bash
curl -X POST http://localhost:8000/api/ai/sentiment \
  -H "Content-Type: application/json" \
  -d '{"text":"Apple reports record earnings, stock surges","symbol":"AAPL"}'
```

**Expected Response**:
```json
{
  "sentiment": "positive",
  "score": 0.87,
  "confidence": 0.95,
  "model": "FinBERT"
}
```

---

## Test 8: Error Handling

**Steps**:
1. Stop backend
2. Try searching for stock in dashboard
3. Should see:
   - "Backend connection failed" message
   - AlertCircle icon
   - Instructions to start backend

**Expected**: Clear error message, no crash

---

## Test 9: Multiple Stocks

**Search these in succession**:
- AAPL → Should see Apple data
- MSFT → Should see Microsoft data (NOT same as Apple)
- GOOGL → Should see Google data (different again)
- TSLA → Should see Tesla data

**Expected**: Each search returns DIFFERENT data

---

## Test 10: Console Errors

**Open DevTools → Console**:

**Should NOT see**:
- "Using mock data"
- "Generating fake data"
- "Demo mode active"
- "Placeholder data"

**Should see**:
- "Fetching real data for {symbol}"
- "FinBERT sentiment analysis complete"
- API request logs

---

## 🐛 Common Issues

### Backend Not Starting
```bash
# Check Python environment
python --version  # Should be 3.8+

# Install requirements
pip install -r requirements.txt

# Check API keys
cat .env | grep KEY
```

### API Keys Missing
```bash
# Add to .env
ALPHA_VANTAGE_API_KEY=demo
FINNHUB_API_KEY=your_key
NEWS_API_KEY=your_key
HUGGINGFACE_API_KEY=your_key
```

### CORS Errors
Backend should have:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Rate Limit Errors
- Wait 60 seconds between requests
- Use demo keys for testing
- Implement caching

---

## ✅ All Tests Passing?

**If YES**:
- 🎉 100% Live Data integration confirmed
- ✅ FinBERT working
- ✅ All APIs connected
- ✅ Ready for MVP launch

**If NO**:
- Check backend logs: `tail -f backend.log`
- Verify API keys: `cat .env`
- Check network: `curl http://localhost:8000/api/health`
- Review error messages in DevTools console

---

## 📊 Expected Performance

**API Response Times**:
- Stock quotes: < 500ms
- Historical data: < 1s
- News fetch: < 2s
- FinBERT sentiment: < 1s per article
- SEC filings: < 1s

**If slower**:
- Add caching
- Implement debouncing
- Use Promise.all() for parallel requests
- Consider API rate limits

---

**Testing Completed**: ___/___/2025  
**Tested By**: __________  
**Status**: ⬜ PASS ⬜ FAIL  
**Notes**: _________________
