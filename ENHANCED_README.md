# UpTrade AI - Enhanced Financial Research Platform

**OpenBB-Inspired** | **AI-Powered** | **Real-Time Data** | **Professional Grade**

## 🚀 New Features (OpenBB-Style Architecture)

### 1. **Live Ticker Tape** 🎯
- **Real-time WebSocket updates** every 5 seconds
- Smooth scrolling animation with 8 default tickers (AAPL, MSFT, GOOGL, AMZN, TSLA, NVDA, META, NFLX)
- **Add/Remove tickers** dynamically
- Price change indicators with color coding
- Connection status indicator
- Hover to pause animation

### 2. **AI Assistant** 🤖
- **Natural language queries** - Ask questions in plain English
- **Context-aware responses** - Maintains conversation history
- **Widget suggestions** - Recommends relevant tools
- **Data visualization** - Displays stock data inline
- **Suggested queries** - Quick-start buttons for common tasks
- **Floating interface** - Access from any page

Example queries:
- "What's the price of AAPL?"
- "Generate forecast for TSLA 30 days"
- "Latest news on NVDA"
- "Show my portfolio"
- "Buy 100 shares of MSFT"

### 3. **Advanced Charting** 📊
- **Multiple chart types**: Area, Line, Bar
- **8 timeframes**: 1D, 5D, 1M, 3M, 6M, 1Y, YTD, 5Y
- **Technical indicators**:
  - SMA (20, 50, 200)
  - EMA (12, 26)
  - RSI (14)
  - Bollinger Bands
  - MACD
- **Interactive tooltips** with detailed data
- **Indicator overlays** with toggle controls
- **Real-time price updates**
- **Professional dark theme** compatible

### 4. **Enhanced Backend API** ⚡

#### Widget-Based Architecture
```
GET /api/v1/widgets/available - List all available widgets
GET /api/v1/widgets/{widget_id}/data - Get widget data
```

#### WebSocket API (Live Tickers)
```
ws://localhost:8000/ws/tickers

Subscribe: {"type": "subscribe", "tickers": ["AAPL", "MSFT"]}
Unsubscribe: {"type": "unsubscribe", "ticker": "AAPL"}
```

#### AI Assistant API
```
POST /api/v1/ai/query
{
  "query": "What's the price of AAPL?",
  "context": ["previous query 1", "previous query 2"],
  "widgets": ["quote", "chart"]
}
```

#### Enhanced Stock APIs
- **GET** `/api/v1/stocks/{ticker}/price` - Real-time price
- **GET** `/api/v1/stocks/{ticker}/quote` - Detailed quote
- **GET** `/api/v1/stocks/{ticker}/historical?period=1y&interval=1d` - Historical data
- **GET** `/api/v1/stocks/{ticker}/technical` - Technical indicators

#### New APIs
- **GET** `/api/v1/market/screener` - Stock screening
- **GET** `/api/v1/watchlist` - User watchlist
- **POST** `/api/v1/watchlist/{ticker}` - Add to watchlist
- **DELETE** `/api/v1/watchlist/{ticker}` - Remove from watchlist

### 5. **Modern UI/UX** 🎨
- **Live ticker tape** at the top
- **Floating AI assistant** button (bottom-right)
- **Improved layout** with better spacing
- **Professional color scheme** (Blue/Purple gradients)
- **Smooth animations** and transitions
- **Responsive design** for all screen sizes
- **Dark mode ready** (coming soon)

## 📦 Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **WebSockets** - Real-time bidirectional communication
- **yfinance** - Financial data
- **Python 3.12** - Latest Python features

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Recharts** - Advanced charting
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons

## 🚀 Quick Start

### 1. Start Enhanced Backend
```bash
cd /path/to/UpTrade-AI
python backend/enhanced_server.py
```

Backend will start at: **http://localhost:8000**

### 2. Start Frontend
```bash
cd frontend
npm run dev
```

Frontend will start at: **http://localhost:3000**

### 3. Open in Browser
Navigate to **http://localhost:3000**

## 🎯 Usage Guide

### Live Ticker Tape
1. Scroll automatically shows price updates
2. Click **"ADD TICKER"** to subscribe to new stocks
3. Hover over ticker and click **X** to remove
4. Green dot = Connected to live data

### AI Assistant
1. Click **floating purple button** (bottom-right)
2. Type question or click **suggested query**
3. AI parses your intent and provides relevant data
4. Use for quick lookups without navigating pages

### Market Analysis
1. Enter **stock symbol** (e.g., AAPL, MSFT)
2. Click **Analyze**
3. View **advanced chart** with multiple timeframes
4. Toggle **technical indicators** (SMA, RSI, BB)
5. Switch between **Area, Line, Bar** charts

### Trading
1. Search stock symbol
2. Enter quantity
3. Click **Buy** or **Sell**
4. View positions in real-time

### Forecasting
1. Enter stock symbol
2. Select days (7, 14, 30)
3. View AI predictions with confidence levels

### Portfolio
- Real-time position tracking
- P&L calculations
- Performance metrics
- Starting capital: $100,000

## 🔧 API Endpoints

### Health Check
```bash
curl http://localhost:8000/health
```

### Get Stock Quote
```bash
curl http://localhost:8000/api/v1/stocks/AAPL/quote
```

### AI Query
```bash
curl -X POST http://localhost:8000/api/v1/ai/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What is the price of AAPL?"}'
```

### WebSocket Test (Browser Console)
```javascript
const ws = new WebSocket('ws://localhost:8000/ws/tickers');
ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'subscribe',
    tickers: ['AAPL', 'MSFT', 'GOOGL']
  }));
};
ws.onmessage = (event) => {
  console.log(JSON.parse(event.data));
};
```

## 🎨 Widgets System

### Available Widgets
1. **Quote Widget** - Real-time stock prices
2. **Chart Widget** - Interactive price charts
3. **News Feed** - Latest financial news
4. **Sentiment Gauge** - Market sentiment
5. **Forecast Chart** - AI predictions
6. **Portfolio Summary** - Account overview
7. **Trading Panel** - Buy/sell interface
8. **Watchlist** - Tracked stocks
9. **Heatmap** - Market visualization
10. **Screener** - Stock filtering

## 📊 Technical Indicators Explained

### Moving Averages
- **SMA 20**: Short-term trend (20-day average)
- **SMA 50**: Medium-term trend (50-day average)
- **SMA 200**: Long-term trend (200-day average)

### Momentum Indicators
- **RSI (14)**: Relative Strength Index
  - > 70: Overbought
  - < 30: Oversold
- **MACD**: Moving Average Convergence Divergence

### Volatility Indicators
- **Bollinger Bands**: Price volatility bands
  - Upper: 2 std dev above SMA
  - Lower: 2 std dev below SMA

## 🔮 AI Assistant Capabilities

### Intent Recognition
The AI can understand:
- **Stock data** queries (price, quote, volume)
- **Forecast** requests (predictions, future prices)
- **News** requests (latest news, sentiment)
- **Portfolio** queries (holdings, P&L)
- **Trading** intents (buy, sell orders)

### Ticker Extraction
Automatically identifies stock symbols:
- AAPL, MSFT, GOOGL, AMZN, TSLA, NVDA, META, NFLX

### Widget Recommendations
Suggests relevant tools based on query:
- Price query → Quote widget
- Forecast query → Forecast chart
- News query → News feed

## 🚧 Roadmap

### Phase 1 (Completed) ✅
- [x] Live ticker tape with WebSocket
- [x] AI assistant with NLP
- [x] Advanced charting
- [x] Widget-based API
- [x] Enhanced backend

### Phase 2 (In Progress) 🚧
- [ ] Dark theme toggle
- [ ] Widget drag-and-drop dashboard
- [ ] More technical indicators
- [ ] Real news integration (NewsAPI)
- [ ] SEC filings integration

### Phase 3 (Planned) 📋
- [ ] Portfolio optimization
- [ ] Backtesting engine
- [ ] Options trading
- [ ] Crypto support
- [ ] Social sentiment analysis

## 🔐 Environment Variables

Create `.env` file in root:
```env
# Optional: For enhanced features
OPENAI_API_KEY=your_key_here
ALPHA_VANTAGE_KEY=your_key_here
FINNHUB_API_KEY=your_key_here
NEWS_API_KEY=your_key_here
```

## 🐛 Troubleshooting

### WebSocket Not Connecting
1. Check backend is running: `curl http://localhost:8000/health`
2. Verify no firewall blocking port 8000
3. Check browser console for errors

### Ticker Tape Not Updating
1. Ensure backend WebSocket task is running
2. Check subscribed tickers list
3. Verify yfinance package installed

### AI Assistant Not Responding
1. Backend should show POST requests to `/api/v1/ai/query`
2. Check network tab for failed requests
3. Verify query parsing logic in backend

### Charts Not Loading
1. Check browser console for errors
2. Verify recharts package installed
3. Test API endpoint directly: `/api/v1/stocks/AAPL/historical`

## 📝 Notes

### Data Sources
- **yfinance**: Free real-time stock data (15-min delay for some exchanges)
- **WebSocket**: Updates every 5 seconds
- **AI**: Simple NLP parsing (can integrate OpenAI for advanced NLU)

### Performance
- WebSocket: Minimal latency (~5s updates)
- Chart rendering: Optimized with Recharts
- API calls: Concurrent with Promise.all
- Frontend: Hot module reloading with Vite

### Limitations
- Paper trading only (no real money)
- Historical data limited by yfinance
- News/sentiment uses mock data (can integrate real APIs)
- No authentication (add JWT for production)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- **OpenBB** - Inspiration for architecture
- **yfinance** - Financial data
- **FastAPI** - Backend framework
- **React** - Frontend library
- **Recharts** - Charting library

## 📧 Support

For questions or issues:
- Open a GitHub issue
- Email: support@uptrade-ai.com

---

**Built with ❤️ for traders and investors**

*Version 2.0.0 - OpenBB-Style Enhanced Edition*
