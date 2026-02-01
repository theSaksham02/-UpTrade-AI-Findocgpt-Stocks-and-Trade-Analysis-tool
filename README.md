# 🚀 UpTrade AI - React + FastAPI Platform

Modern AI-powered financial analysis platform with **React frontend** and **FastAPI backend**.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│                                                 │
│         React Frontend (Port 5173)              │
│    Modern UI with TypeScript + Vite            │
│                                                 │
└────────────────┬────────────────────────────────┘
                 │
                 │ HTTP/REST + WebSocket
                 │
┌────────────────▼────────────────────────────────┐
│                                                 │
│      FastAPI Backend (Port 8000)                │
│   • 13 External API Integrations                │
│   • 3 WebSocket Endpoints                       │
│   • Real-time Stock Data                        │
│   • News Aggregation                            │
│   • Sentiment Analysis                          │
│   • AI-Powered Q&A                              │
│                                                 │
└─────────────────────────────────────────────────┘
```

## ✨ Features

### 🎯 Frontend (React)
- **Modern UI** - Built with React, TypeScript, and Tailwind CSS
- **Real-time Updates** - WebSocket integration for live data
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Type-Safe** - Full TypeScript support
- **Fast Development** - Vite for instant hot reload

### ⚡ Backend (FastAPI)
- **13 API Integrations** - Finnhub, Alpha Vantage, Polygon, NewsAPI, and more
- **WebSocket Support** - Real-time stock tickers and market data
- **AI Models** - Sentiment analysis and forecasting
- **Auto Documentation** - Swagger UI at `/docs`
- **High Performance** - Async/await throughout

## 🚀 Quick Start

### Prerequisites
- **Python 3.8+** - [Download](https://www.python.org/downloads/)
- **Node.js 16+** - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/theSaksham02/-UpTrade-AI-Findocgpt-Stocks-and-Trade-Analysis-tool.git
cd -UpTrade-AI-Findocgpt-Stocks-and-Trade-Analysis-tool
```

2. **Configure API Keys**

Create or edit `config.py`:
```python
# API Keys
FINNHUB_API_KEY = "your_finnhub_key"
ALPHA_VANTAGE_API_KEY = "your_alpha_vantage_key"
POLYGON_API_KEY = "your_polygon_key"
NEWS_API_KEY = "your_newsapi_key"
# ... add other keys
```

3. **Start Everything**
```bash
./start.sh
# or
python3 run.py
```

That's it! The script will:
- Install Python dependencies
- Install npm dependencies
- Start FastAPI backend (port 8000)
- Start React frontend (port 5173)

## 🌐 Access the Platform

Once started, open these URLs:

| Service | URL | Description |
|---------|-----|-------------|
| **React Frontend** | http://localhost:5173 | Main user interface |
| **API Docs** | http://localhost:8000/docs | Interactive API documentation |
| **API ReDoc** | http://localhost:8000/redoc | Alternative API docs |
| **API Health** | http://localhost:8000/api/health | Backend health check |

## 📡 WebSocket Endpoints

Connect to real-time data streams:

```javascript
// General WebSocket
ws://localhost:8000/ws

// Live market data
ws://localhost:8000/ws/live

// Stock tickers (subscribe/unsubscribe)
ws://localhost:8000/ws/tickers
```

### Example: Connect to Tickers

```javascript
const ws = new WebSocket('ws://localhost:8000/ws/tickers');

ws.onopen = () => {
  // Subscribe to stocks
  ws.send(JSON.stringify({
    action: 'subscribe',
    symbols: ['AAPL', 'GOOGL', 'MSFT']
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Stock update:', data);
};
```

## 🔧 Development

### Backend Development

```bash
# Run backend only
python3 beast_fastapi_server.py

# With auto-reload
uvicorn beast_fastapi_server:app --reload --port 8000
```

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service layer
│   │   ├── utils/           # Utilities
│   │   └── App.tsx          # Main app component
│   ├── package.json
│   └── vite.config.ts
│
├── beast_fastapi_server.py   # Main FastAPI server
├── beast_api_manager.py      # API integration manager

├── config.py                 # API keys configuration
├── run.py                    # Unified launcher
├── start.sh                  # Quick start script
└── requirements.txt          # Python dependencies
```

## 🔌 API Integrations

The backend integrates with 13+ external APIs:

| API | Purpose | Docs |
|-----|---------|------|
| **Finnhub** | Real-time stock data | [Link](https://finnhub.io/) |
| **Alpha Vantage** | Market data & fundamentals | [Link](https://www.alphavantage.co/) |
| **Polygon** | Stocks, options, forex | [Link](https://polygon.io/) |
| **NewsAPI** | Financial news | [Link](https://newsapi.org/) |
| **NewsData** | Alternative news source | [Link](https://newsdata.io/) |
| **Marketaux** | Market news & analysis | [Link](https://www.marketaux.com/) |
| **FRED** | Economic data | [Link](https://fred.stlouisfed.org/) |
| **ExchangeRate** | Currency data | [Link](https://exchangerate-api.com/) |
| **OpenAI** | AI analysis | [Link](https://openai.com/) |
| **HuggingFace** | ML models | [Link](https://huggingface.co/) |
| **Twitter** | Social sentiment | [Link](https://developer.twitter.com/) |
| **CoinGecko** | Crypto data | [Link](https://www.coingecko.com/) |

## 🛠️ Troubleshooting

### Backend won't start
```bash
# Check Python version
python3 --version  # Should be 3.8+

# Reinstall dependencies
pip install -r requirements.txt

# Check if port 8000 is free
lsof -i :8000
```

### Frontend won't start
```bash
# Check Node.js version
node --version  # Should be 16+

# Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### CORS errors
The backend has CORS enabled for all origins. If you see CORS errors:
1. Make sure backend is running on port 8000
2. Check frontend `.env` file has correct `VITE_API_BASE_URL`
3. Clear browser cache

### WebSocket connection failed
1. Ensure backend is running
2. Check browser console for errors
3. Test WebSocket endpoint: `wscat -c ws://localhost:8000/ws`

## 📝 API Examples

### Get Stock Quote
```bash
curl http://localhost:8000/api/stocks/AAPL/quote
```

### Get Market News
```bash
curl http://localhost:8000/api/news/market?limit=10
```

### Health Check
```bash
curl http://localhost:8000/api/health
```

## 🔐 Environment Variables

### Frontend (.env in frontend/)
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_API_VERSION=v1
VITE_WS_URL=ws://localhost:8000
```

### Backend (config.py in root)
```python
# See config.py for all API keys
```

## 🚦 Port Configuration

| Service | Port | Can Change? |
|---------|------|-------------|
| FastAPI | 8000 | Yes - edit `beast_fastapi_server.py` |
| React | 5173 | Yes - Vite auto-assigns |

## 📚 Documentation

- **API Documentation**: http://localhost:8000/docs (when running)
- **FastAPI Docs**: https://fastapi.tiangolo.com/
- **React Docs**: https://react.dev/
- **Vite Docs**: https://vitejs.dev/

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary and confidential.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section above
2. Review API documentation at http://localhost:8000/docs
3. Open an issue on GitHub

## 🎉 What Changed?

**Removed:**
- ❌ Streamlit frontend (pages/ folder)
- ❌ app.py
- ❌ pro_utils.py

**Keeping:**
- ✅ FastAPI backend (beast_fastapi_server.py)
- ✅ React frontend (frontend/ folder)
- ✅ All API integrations
- ✅ WebSocket endpoints
- ✅ AI models and analysis tools

**The platform is now cleaner, faster, and more modern! 🚀**
