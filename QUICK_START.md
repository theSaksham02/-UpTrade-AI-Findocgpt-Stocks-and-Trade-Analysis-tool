# UpTrade AI - Quick Start Guide

## 🚀 One-Command Launch

Start the entire UpTrade AI platform with all servers and APIs:

```bash
python run.py
```

That's it! This single command will:
- ✅ Check and install all dependencies
- ✅ Start FastAPI Backend (BEAST MODE) on port 8000
- ✅ Start Streamlit Frontend on port 8501
- ✅ Start React Frontend (if available)
- ✅ Initialize all 13 API integrations
- ✅ Enable all 3 WebSocket endpoints

## 📡 Services Started

After running `python run.py`, you'll have access to:

### 1. **Streamlit Frontend** (Main UI)
- **URL:** http://localhost:8501
- **Features:**
  - ✨ Welcome (Premium Home)
  - ⚖️ TradeX (Pro Trading)
  - 📊 VisualX (Pro Visualization)
  - ⚡ HFTX (High-Frequency Trading)
  - 📊 Market Data Hub

### 2. **FastAPI Backend** (BEAST MODE)
- **URL:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs
- **Health Check:** http://localhost:8000/api/health
- **Features:**
  - 13+ API integrations
  - Real-time data
  - AI-powered analysis
  - Stock quotes, news, economic data
  - Forex, crypto, sentiment analysis

### 3. **WebSocket Endpoints**
- **Main:** ws://localhost:8000/ws
- **Live Data:** ws://localhost:8000/ws/live
- **Tickers:** ws://localhost:8000/ws/tickers

### 4. **React Frontend** (Optional)
- Automatically starts if `frontend/` directory exists
- Check console for port (usually 5173 or 3000)

## 🎯 Quick Access URLs

Open these in your browser after starting:

| Service | URL | Purpose |
|---------|-----|---------|
| **Streamlit UI** | http://localhost:8501 | Main Trading Interface |
| **API Documentation** | http://localhost:8000/docs | Interactive API Explorer |
| **API Health** | http://localhost:8000/api/health | System Status |
| **Stock Quote API** | http://localhost:8000/api/stock/quote/AAPL | Get Stock Data |
| **Market Overview** | http://localhost:8000/api/market/overview | Market Dashboard |

## 📦 First Time Setup

### 1. Install Python Dependencies

The `run.py` script will automatically install dependencies, but you can also run:

```bash
pip install -r requirements.txt
```

### 2. Configure API Keys (Optional)

Create a `config.py` file or `.env` file with your API keys:

```python
# config.py
OPENAI_API_KEY = "your-openai-key"
FINNHUB_API_KEY = "your-finnhub-key"
ALPHA_VANTAGE_API_KEY = "your-alpha-vantage-key"
# ... other API keys
```

Don't worry! The system works without API keys using fallback methods.

### 3. Start the Platform

```bash
python run.py
```

Wait ~10 seconds for all servers to initialize, then open http://localhost:8501

## 🛑 Stopping the Platform

Press `Ctrl+C` in the terminal where `run.py` is running. All servers will shut down cleanly.

## 🔍 Troubleshooting

### Port Already in Use

If you see "port already in use" errors:

```bash
# Check what's using port 8000
lsof -i :8000

# Check what's using port 8501
lsof -i :8501

# Kill the process
kill -9 <PID>
```

### Missing Dependencies

If dependencies fail to install automatically:

```bash
# Install manually
pip install fastapi uvicorn streamlit websockets yfinance pandas numpy requests

# Or from requirements
pip install -r requirements.txt
```

### API Connection Errors

1. **Check Backend is Running:**
   ```bash
   curl http://localhost:8000/api/health
   ```

2. **Check Logs:**
   The terminal running `run.py` shows all server logs

3. **Restart:**
   ```bash
   # Stop with Ctrl+C
   # Start again
   python run.py
   ```

### WebSocket 403 Errors

These are now fixed! If you still see them:

1. Make sure you're running the latest `beast_fastapi_server.py`
2. Check that all 3 WebSocket endpoints are implemented:
   ```bash
   grep -n "@app.websocket" beast_fastapi_server.py
   ```
   Should show lines for `/ws`, `/ws/live`, and `/ws/tickers`

## 📚 What Gets Started

When you run `python run.py`, here's what happens:

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  1. Dependency Check                                        │
│     ✓ Python packages (fastapi, streamlit, etc.)          │
│     ✓ Requirements.txt                                      │
│     ✓ API configuration                                     │
│                                                             │
│  2. FastAPI Backend (Port 8000)                            │
│     ✓ 13 API integrations initialized                      │
│     ✓ 3 WebSocket endpoints ready                          │
│     ✓ 20+ REST endpoints available                         │
│     ✓ AI models loaded                                      │
│                                                             │
│  3. Streamlit Frontend (Port 8501)                         │
│     ✓ Trading interface                                     │
│     ✓ Visualization tools                                   │
│     ✓ HFT dashboard                                         │
│     ✓ Market data hub                                       │
│                                                             │
│  4. React Frontend (Optional)                              │
│     ✓ Modern web interface                                  │
│     ✓ Real-time updates                                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Common Tasks

### View API Documentation
```bash
# Start platform
python run.py

# Open in browser
open http://localhost:8000/docs
```

### Test API Endpoint
```bash
# Get stock quote
curl http://localhost:8000/api/stock/quote/AAPL

# Get market overview
curl http://localhost:8000/api/market/overview

# Get health status
curl http://localhost:8000/api/health
```

### Test WebSocket Connection
```javascript
// Open browser console at http://localhost:8000/docs
const ws = new WebSocket('ws://localhost:8000/ws/tickers');
ws.onopen = () => {
    ws.send(JSON.stringify({
        type: 'subscribe',
        symbols: ['AAPL', 'MSFT']
    }));
};
ws.onmessage = (e) => console.log(JSON.parse(e.data));
```

### Access Streamlit Pages
- Main: http://localhost:8501
- TradeX: http://localhost:8501/TradeX_(Pro)
- VisualX: http://localhost:8501/VisualX_(Pro)
- HFTX: http://localhost:8501/HFTX_(Pro)

## 📊 System Requirements

- **Python:** 3.8 or higher
- **RAM:** 4GB minimum, 8GB recommended
- **Disk Space:** 2GB for dependencies
- **OS:** macOS, Linux, or Windows
- **Internet:** Required for API data

## 🚀 Performance Tips

1. **First Launch:** May take 30-60 seconds to install dependencies
2. **Subsequent Launches:** ~10 seconds to start all servers
3. **API Rate Limits:** Some APIs have rate limits, use caching
4. **Memory:** Close unused browser tabs to free up RAM
5. **Network:** Faster internet = faster data updates

## 🎉 Success Indicators

You'll know everything is working when you see:

```
✨ All servers started successfully!
================================================================================

🌐 Open these URLs:
  • Streamlit UI:  http://localhost:8501
  • API Docs:      http://localhost:8000/docs
  • API Health:    http://localhost:8000/api/health

📊 Monitoring server logs...
```

Then open http://localhost:8501 and start trading! 🦁

## 📖 Next Steps

1. **Explore Streamlit UI:** http://localhost:8501
2. **Read API Docs:** http://localhost:8000/docs
3. **Check WEBSOCKET_TICKERS_USAGE.md** for real-time features
4. **Read UPTRADE_WORKFLOW.md** for complete system overview

## 💡 Pro Tips

- **Background Running:** Use `nohup python run.py &` to run in background
- **Auto-Restart:** Use `pm2` or `supervisor` for production deployments
- **Multiple Terminals:** Keep one terminal for logs, use another for testing
- **Bookmarks:** Bookmark http://localhost:8501 and http://localhost:8000/docs

## 🆘 Getting Help

If you encounter issues:

1. Check the terminal logs for error messages
2. Verify all ports are available (8000, 8501)
3. Ensure API keys are configured (if needed)
4. Check internet connectivity
5. Review WEBSOCKET_FIX.md for WebSocket issues
6. Check ISSUES_FIXED.md for known problems and solutions

---

**Happy Trading! 🚀📈🦁**
