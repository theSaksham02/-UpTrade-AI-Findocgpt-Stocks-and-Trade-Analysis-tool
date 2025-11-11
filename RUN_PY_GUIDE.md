# 🦁 UpTrade AI - Complete Platform Launcher

## TL;DR - Quick Start

```bash
# Start everything with ONE command:
python run.py

# Wait 10 seconds, then open:
# http://localhost:8501
```

That's it! No connection errors, everything just works! ✅

---

## What Gets Started

Running `python run.py` starts:

- ✅ **FastAPI Backend** (Port 8000) - All APIs + WebSocket endpoints
- ✅ **Streamlit Frontend** (Port 8501) - Trading UI with 5 pages
- ✅ **React Frontend** (Optional) - Modern web interface
- ✅ **13 API Integrations** - Real-time market data
- ✅ **3 WebSocket Endpoints** - Real-time streaming

## Why This Solution?

### Before ❌

```bash
# Had to do this manually:
python beast_fastapi_server.py  # Terminal 1
python -m streamlit run app.py  # Terminal 2
cd frontend && npm run dev       # Terminal 3

# Result: Connection errors everywhere! 😢
```

### After ✅

```bash
# Just one command:
python run.py

# Result: Everything works perfectly! 🎉
```

## Features

### Automatic Service Management

- **Auto-dependency check** - Installs missing packages
- **Sequential startup** - Backend starts before frontend
- **Health monitoring** - Detects and reports failures
- **Clean shutdown** - Ctrl+C stops everything gracefully
- **Color-coded logs** - Easy to see what's happening

### Services Included

#### 1. FastAPI Backend (Port 8000)
```
http://localhost:8000         - API Base
http://localhost:8000/docs    - Interactive API Docs
http://localhost:8000/api/health - Health Check
```

**Features:**
- 20+ REST API endpoints
- Stock quotes (Finnhub, AlphaVantage, Polygon, YFinance)
- News aggregation (Marketaux, NewsAPI, NewsData)
- Economic data (FRED)
- Forex rates (ExchangeRate API)
- Crypto prices (CoinGecko)
- Sentiment analysis (HuggingFace + Enhanced fallback)
- AI analysis (OpenAI GPT-4)
- Social sentiment (Reddit)

#### 2. Streamlit Frontend (Port 8501)
```
http://localhost:8501  - Main UI
```

**Pages:**
- ✨ Welcome (Premium Home)
- ⚖️ TradeX (Pro Trading)
- 📊 VisualX (Pro Visualization)
- ⚡ HFTX (High-Frequency Trading)
- 📊 Market Data Hub

#### 3. WebSocket Endpoints
```
ws://localhost:8000/ws          - General purpose
ws://localhost:8000/ws/live     - Live data stream
ws://localhost:8000/ws/tickers  - Real-time ticker updates
```

## Usage

### Start the Platform

```bash
# Method 1: Python (Recommended)
python run.py

# Method 2: Shell script
./start.sh

# Method 3: Python3 explicitly
python3 run.py
```

### Access the Services

After ~10 seconds, open:
- **Main UI:** http://localhost:8501 ← Start here!
- **API Docs:** http://localhost:8000/docs
- **Health Check:** http://localhost:8000/api/health

### Stop the Platform

Press `Ctrl+C` in the terminal where `run.py` is running. All services will shut down cleanly.

## Configuration

### API Keys (Optional)

Create `config.py` or `.env` with your API keys:

```python
# config.py
OPENAI_API_KEY = "your-openai-key"
FINNHUB_API_KEY = "your-finnhub-key"
ALPHA_VANTAGE_API_KEY = "your-alpha-vantage-key"
POLYGON_API_KEY = "your-polygon-key"
FRED_API_KEY = "your-fred-key"
MARKETAUX_API_KEY = "your-marketaux-key"
# ... etc
```

**Note:** The platform works without API keys using fallback methods!

### Requirements

- Python 3.8+
- Internet connection
- 4GB+ RAM recommended

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     python run.py                           │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ├──> 1. Check Dependencies
                  │    └─> Install if missing
                  │
                  ├──> 2. Start FastAPI Backend (Port 8000)
                  │    ├─> Initialize 13 APIs
                  │    ├─> Setup 3 WebSocket endpoints
                  │    └─> Wait 3 seconds
                  │
                  ├──> 3. Start Streamlit Frontend (Port 8501)
                  │    ├─> Connect to FastAPI backend
                  │    └─> Load 5 pages
                  │
                  └──> 4. Start React Frontend (Optional)
                       └─> Modern web interface

All services monitored and logged in real-time
Press Ctrl+C to stop everything cleanly
```

## Troubleshooting

### Port Already in Use

```bash
# Check what's using the port
lsof -i :8000  # FastAPI
lsof -i :8501  # Streamlit

# Kill the process
kill -9 <PID>
```

### Connection Refused

Make sure the backend started successfully:
```bash
curl http://localhost:8000/api/health
```

Should return:
```json
{
  "status": "operational",
  "statistics": {
    "configured_apis": 13,
    "total_apis": 13
  }
}
```

### Missing Dependencies

```bash
# Install manually
pip install -r requirements.txt
```

### WebSocket 403 Errors

These are now fixed! All 3 WebSocket endpoints are implemented:
- `/ws` - General purpose
- `/ws/live` - Live data
- `/ws/tickers` - Real-time ticker updates

## Testing

### Test Backend Health
```bash
curl http://localhost:8000/api/health
```

### Test Stock API
```bash
curl http://localhost:8000/api/stock/quote/AAPL
```

### Test WebSocket
```javascript
// In browser console at http://localhost:8000/docs
const ws = new WebSocket('ws://localhost:8000/ws/tickers');
ws.onopen = () => {
    ws.send(JSON.stringify({
        type: 'subscribe',
        symbols: ['AAPL', 'MSFT']
    }));
};
ws.onmessage = (e) => console.log(JSON.parse(e.data));
```

## Documentation

- **QUICK_START.md** - Complete quick start guide
- **WEBSOCKET_FIX.md** - WebSocket endpoints documentation
- **WEBSOCKET_TICKERS_USAGE.md** - Real-time ticker streaming
- **UPTRADE_WORKFLOW.md** - Complete system workflow
- **ARCHITECTURE.md** - System architecture diagrams

## Project Structure

```
.
├── run.py                      # ← Main launcher (start here!)
├── start.sh                    # Shell script wrapper
├── beast_fastapi_server.py     # FastAPI backend
├── app.py                      # Streamlit frontend
├── beast_api_manager.py        # API integration manager
├── config.py                   # Configuration
├── requirements.txt            # Python dependencies
├── pages/                      # Streamlit pages
│   ├── 0_✨_Welcome_(Premium_Home).py
│   ├── 1_⚖️_TradeX_(Pro).py
│   ├── 2_📊_VisualX_(Pro).py
│   ├── 3_⚡_HFTX_(Pro).py
│   └── 4_📊_Market_Data_Hub.py
├── frontend/                   # React frontend (optional)
└── docs/                       # Documentation
```

## FAQ

**Q: Do I need API keys?**  
A: No! The platform works without API keys using fallback methods.

**Q: Which ports are used?**  
A: 8000 (FastAPI), 8501 (Streamlit), 5173/3000 (React if available)

**Q: Can I run this in the background?**  
A: Yes! `nohup python run.py > uptrade.log 2>&1 &`

**Q: How do I update?**  
A: `git pull` then `pip install -r requirements.txt`

**Q: Is this production-ready?**  
A: Yes! All services include error handling, logging, and health checks.

## Performance

- **First launch:** 1-2 minutes (dependency installation)
- **Subsequent launches:** ~10 seconds
- **Memory usage:** 2-4GB (all services)
- **API rate limits:** Respects all provider limits with caching

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

See LICENSE file for details.

## Support

For issues:
1. Check the logs in the terminal
2. Review troubleshooting section
3. Check documentation files
4. Open a GitHub issue

---

## Quick Command Reference

```bash
# Start everything
python run.py

# Test backend
curl http://localhost:8000/api/health

# Test stock quote
curl http://localhost:8000/api/stock/quote/AAPL

# Access UI
open http://localhost:8501

# View API docs
open http://localhost:8000/docs

# Stop everything
# Press Ctrl+C in the run.py terminal
```

---

**🦁 Happy Trading with UpTrade AI BEAST MODE! 🚀📈**

No more connection errors. Everything just works. One command to rule them all! ✅
