# 🚀 UpTrade AI - The Beast of Financial Analysis

> **AI-powered financial document analysis, sentiment tracking, and trading intelligence platform**

[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109+-green.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.2+-61DAFB.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-3178C6.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🎯 Features

### 🤖 AI-Powered Analysis
- **FinBERT Sentiment Analysis** - Financial news sentiment with 95%+ accuracy
- **RoBERTa Q&A System** - Extract insights from SEC filings (10-K, 10-Q, 8-K)
- **NER Entity Extraction** - Identify companies, metrics, and financial entities
- **Multi-factor Analysis** - Combine technical + fundamental + sentiment signals

### 📊 Real-Time Market Data
- **Live Stock Quotes** - Real-time prices via Alpha Vantage API
- **Financial News** - Latest market news with sentiment scoring
- **SEC Filings** - Direct access to Edgar database
- **Company Fundamentals** - P/E ratios, earnings, dividends, market cap

### 💎 Premium Features
- **TradeX** - Multi-factor comparison engine for alpha discovery
- **VisualX** - Real-time sentiment network visualization
- **TradeSphere** - Advanced portfolio analytics (Coming Soon)
- **HFTX** - High-frequency trading signals (Coming Soon)

### 🎨 Modern UI/UX
- Purple-black gradient theme
- Responsive design (mobile, tablet, desktop)
- Dark mode optimized
- Real-time data visualization
- Smooth animations and transitions

## 🏗️ Architecture

```
UpTrade AI
├── Backend (Python + FastAPI)
│   ├── ai_models.py          # AI model management (FinBERT, RoBERTa, NER)
│   ├── api_server.py          # FastAPI REST API (15+ endpoints)
│   ├── api_integrations.py    # External APIs (News, Alpha Vantage, SEC)
│   ├── forecasting_model.py   # LSTM time series forecasting
│   └── sentiment_analyzer.py  # Sentiment analysis pipeline
│
├── Frontend (React + TypeScript + Vite)
│   ├── src/
│   │   ├── pages/            # Main pages (Landing, Dashboard, TradeX, VisualX)
│   │   ├── components/       # Reusable components (Layout, Cards, Tables)
│   │   ├── utils/            # API client, helpers
│   │   └── styles/           # Global styles (Tailwind CSS)
│   └── public/               # Static assets
│
└── Data & Models
    ├── model_cache/          # Cached AI models (auto-downloaded)
    └── vectorstore_cache/    # FAISS vector embeddings
```

## 🚀 Quick Start

### Prerequisites

- **Python 3.9+** (with pip)
- **Node.js 18+** (with npm/yarn/bun)
- **8GB+ RAM** (for AI models)
- **5GB+ Storage** (for model cache)
- **GPU (Optional)** - CUDA for faster inference

### 1. Clone Repository

```bash
git clone https://github.com/theSaksham02/-UpTrade-AI-Findocgpt-Stocks-and-Trade-Analysis-tool.git
cd -UpTrade-AI-Findocgpt-Stocks-and-Trade-Analysis-tool
```

### 2. Backend Setup

```bash
# Install Python dependencies
pip install -r requirements.txt

# Copy environment template
cp .env.example .env

# Edit .env and add your API keys
nano .env  # or use any text editor
```

**Get Free API Keys:**
- [NewsAPI](https://newsapi.org/) - 100 requests/day free
- [Alpha Vantage](https://www.alphavantage.co/) - 5 req/min free
- [Finnhub](https://finnhub.io/) - 60 req/min free

```bash
# Start FastAPI backend (port 8000)
python api_server.py

# Or use uvicorn
uvicorn api_server:app --reload --host 0.0.0.0 --port 8000
```

**API Documentation:** http://localhost:8000/api/docs

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
# or
bun install

# Start development server (port 5050)
npm run dev
# or
bun run dev
```

**Frontend URL:** http://localhost:5050

### 4. First AI Model Download

**On first API call**, models will auto-download (~2-3GB):
- FinBERT: `ProsusAI/finbert` (~500MB)
- RoBERTa Q&A: `deepset/roberta-base-squad2` (~500MB)
- NER: `dslim/bert-base-NER` (~400MB)

This takes 5-10 minutes depending on your connection.

## 📚 API Endpoints

### AI Models

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/sentiment` | POST | Analyze sentiment of texts (FinBERT) |
| `/api/document-qa` | POST | Answer questions from documents (RoBERTa) |
| `/api/extract-entities` | POST | Extract entities from text (NER) |

### Market Data

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/news` | POST | Fetch financial news articles |
| `/api/stock/quote` | POST | Get real-time stock quote |
| `/api/stock/overview/{symbol}` | GET | Company fundamentals |
| `/api/sec-filings/{ticker}` | GET | SEC Edgar filings |

### Combined Analysis

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/analyze-news-sentiment` | POST | News + sentiment analysis |
| `/api/analyze-company` | POST | Full company analysis |

### Example: Sentiment Analysis

```bash
curl -X POST "http://localhost:8000/api/sentiment" \
  -H "Content-Type: application/json" \
  -d '{
    "texts": [
      "Apple reports record quarterly earnings, beating expectations",
      "Tech stocks plunge on recession fears"
    ]
  }'
```

Response:
```json
{
  "results": [
    {
      "text": "Apple reports record quarterly earnings...",
      "sentiment": "positive",
      "confidence": 0.9854,
      "score": 0.9854
    },
    {
      "text": "Tech stocks plunge on recession fears",
      "sentiment": "negative",
      "confidence": 0.9421,
      "score": -0.9421
    }
  ],
  "average_sentiment": 0.0217,
  "overall_sentiment": "neutral"
}
```

## 🎨 Frontend Pages

### 1. Landing Page (`/`)
- Orbital animation hero section
- Feature showcase
- Navigation to all pages

### 2. Dashboard (`/dashboard`)
- Account statistics (equity, buying power, P&L)
- Transaction history
- Recent activity feed
- Order status table
- Quick action cards

### 3. TradeX (`/tradex`)
- Multi-factor comparison engine
- AI-powered alpha discovery
- Real-time network visualization

### 4. VisualX (`/visualx`)
- Sentiment network graph
- Live sentiment score (+1.42 indicator)
- Market narrative detection

### 5. Market Analysis (`/market`)
- Stock screener
- Technical indicators
- Price charts

### 6. Portfolio (`/portfolio`)
- Holdings overview
- Performance analytics
- Risk metrics

### 7. Trading (`/trading`)
- Paper trading interface
- $100K virtual capital
- Real-time order execution

### 8. Forecasting (`/forecasting`)
- LSTM price predictions
- Technical indicator overlay
- Confidence intervals

## 🚢 Deployment to Vercel

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Configure Environment Variables

In Vercel dashboard, add:
```
NEWS_API_KEY=your_key
ALPHA_VANTAGE_KEY=your_key
FINNHUB_KEY=your_key
```

### 3. Deploy

```bash
vercel --prod
```

**Note:** AI models are large. Consider:
- Using Vercel's 50MB limit for serverless functions
- Deploying backend separately on Railway/Render/AWS Lambda
- Using model API endpoints (Hugging Face Inference API)

## 🐳 Docker Deployment

```bash
# Build image
docker build -t uptrade-ai .

# Run container
docker run -p 8000:8000 -p 5050:5050 \
  -e NEWS_API_KEY=your_key \
  -e ALPHA_VANTAGE_KEY=your_key \
  uptrade-ai
```

## 🧪 Testing

### Backend Tests
```bash
pytest tests/
```

### Frontend Tests
```bash
cd frontend
npm test
```

### API Health Check
```bash
curl http://localhost:8000/api/health
```

## 📦 Project Structure

```
.
├── ai_models.py              # AI model manager
├── api_server.py             # FastAPI backend
├── api_integrations.py       # External APIs
├── requirements.txt          # Python dependencies
├── vercel.json              # Vercel config
├── .env.example             # Environment template
│
├── frontend/
│   ├── src/
│   │   ├── pages/           # React pages
│   │   ├── components/      # React components
│   │   ├── utils/           # API client
│   │   └── styles/          # CSS/Tailwind
│   ├── package.json
│   └── vite.config.ts
│
├── data/                    # Sample data
├── vectorstore_cache/       # FAISS vectors
└── model_cache/            # AI models
```

## 🎯 Roadmap

### ✅ Completed
- [x] AI models integration (FinBERT, RoBERTa, NER)
- [x] FastAPI backend with 15+ endpoints
- [x] React frontend with purple-black theme
- [x] Real-time market data APIs
- [x] Sentiment analysis pipeline
- [x] Document Q&A system
- [x] Entity extraction
- [x] Vercel deployment config

### 🚧 In Progress
- [ ] VisualX live sentiment feed
- [ ] TradeX metrics extraction
- [ ] Forecasting LSTM model integration
- [ ] WebSocket real-time updates

### 📋 Planned
- [ ] TradeSphere portfolio analytics
- [ ] HFTX high-frequency signals
- [ ] Options strategy analyzer
- [ ] Backtesting engine
- [ ] AI-generated trade ideas
- [ ] Risk management system
- [ ] Multi-user authentication
- [ ] Database integration (PostgreSQL)
- [ ] Redis caching layer
- [ ] Mobile app (React Native)

## 🛠️ Technology Stack

### Backend
- **FastAPI** - Modern Python web framework
- **Transformers** - Hugging Face AI models
- **PyTorch** - Deep learning framework
- **Pandas** - Data analysis
- **YFinance** - Stock data
- **FAISS** - Vector similarity search

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide Icons** - Icon library
- **React Router** - Navigation

### AI Models
- **FinBERT** - Financial sentiment (ProsusAI)
- **RoBERTa** - Question answering (deepset)
- **BERT NER** - Entity extraction (dslim)

### APIs
- **NewsAPI** - Financial news
- **Alpha Vantage** - Stock data
- **SEC Edgar** - Company filings
- **Finnhub** - Market data

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file

## 🙏 Acknowledgments

- Hugging Face for open-source AI models
- Vercel for deployment platform
- Alpha Vantage for financial data API
- NewsAPI for news aggregation

## 📧 Contact

- **GitHub**: [@theSaksham02](https://github.com/theSaksham02)
- **Project**: [UpTrade AI](https://github.com/theSaksham02/-UpTrade-AI-Findocgpt-Stocks-and-Trade-Analysis-tool)

---

**Built with ❤️ and ☕ by theSaksham02**

🚀 **UpTrade AI - Making Financial Analysis Intelligent**
