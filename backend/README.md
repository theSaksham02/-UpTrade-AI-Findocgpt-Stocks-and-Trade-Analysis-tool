# UpTrade AI Backend

FastAPI-based backend for the UpTrade AI financial analysis and trading platform.

## 🚀 Status: Phase 3 Complete

- ✅ **Phase 1:** Backend Foundation (Complete)
- ✅ **Phase 2:** Real API Integrations (Complete)
- ✅ **Phase 3:** ML & Advanced Analytics (Complete)
- 🔄 **Phase 4:** Production Features (Planned)

## Features

### Core Infrastructure
- **RESTful API** with FastAPI
- **Async/Await** throughout for high performance
- **PostgreSQL** database with SQLAlchemy ORM
- **Redis** for caching and session management
- **Auto-generated OpenAPI docs** at `/docs`
- **CORS support** for frontend integration
- **Request logging** and error handling
- **JWT authentication** framework

### Real API Integrations (Phase 2) 🆕
- **Real-time Stock Data** via yfinance (Yahoo Finance)
- **Financial News** via News API with sentiment analysis
- **Sentiment Analysis** using VADER algorithm
- **Automatic fallback** to mock data if APIs unavailable
- **Error handling** and comprehensive logging

### ML & Advanced Analytics (Phase 3) 🆕
- **ML Price Forecasting** using Prophet, Linear Regression, Moving Average
- **Portfolio Optimization** with Modern Portfolio Theory (MPT)
- **Efficient Frontier** calculation and Sharpe ratio maximization
- **Risk/Return Analysis** with multiple risk profiles
- **Diversification Scoring** using information entropy
- **Confidence Intervals** for all predictions

## API Endpoints

All endpoints now return **real data** from external APIs:

### Health & Status
- `GET /health` - Health check
- `GET /` - API information

### Stocks (`/api/v1/stocks`) 🆕 Real Data
- `GET /{ticker}/price` - **Real-time** stock price from Yahoo Finance
- `GET /{ticker}/history` - **Historical** OHLCV data
- `GET /{ticker}/fundamentals` - **Actual** company fundamentals
- `GET /search` - Search stocks

### News (`/api/v1/news`) 🆕 Real Data
- `GET /latest` - **Real** business headlines with sentiment
- `GET /ticker/{ticker}` - **Real** news for specific ticker
- `GET /trending` - Trending topics by mention count
- `POST /search` - Advanced news search

### Sentiment (`/api/v1/sentiment`) 🆕 Real Analysis
- `GET /{ticker}` - **VADER** sentiment analysis from news
- `GET /trending` - Trending stocks by mentions
- `GET /social/{ticker}` - Social mentions (via news proxy)

### Forecast (`/api/v1/forecast`) 🆕 Real ML Models
- `POST /{ticker}` - **ML-based** price forecasts (Prophet/Linear/MA)
- `GET /{ticker}/latest` - Latest forecast with confidence
- `GET /performance` - Model performance metrics

### Portfolio (`/api/v1/portfolio`) 🆕 Real MPT Optimization
- `POST /` - Create portfolio
- `GET /{id}` - Get portfolio details
- `GET /{id}/performance` - Performance history
- `POST /{id}/optimize` - **MPT optimization** with Sharpe ratio

### Trading (`/api/v1/trading`)
- `POST /order` - Create order
- `GET /positions/{portfolio_id}` - Get positions
- `GET /history/{portfolio_id}` - Get trade history
- `GET /leaderboard` - Get leaderboard

### Filings (`/api/v1/filings`)
- `GET /search` - Search filings
- `GET /{id}` - Get filing by ID
- `GET /latest` - Get latest filings

### Social (`/api/v1/social`)
- `GET /trending` - Get trending on social media
- `GET /ticker/{ticker}` - Get social mentions

### Q&A (`/api/v1/qa`)
- `POST /ask` - Ask a question
- `GET /history` - Get Q&A history

## Setup

### Prerequisites

- Python 3.11+
- PostgreSQL 15+
- Redis 7+

### Local Development

1. **Create virtual environment:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Configure environment:**
Create `.env` file in backend directory (copy from `.env.example`):
```bash
cp .env.example .env
# Edit .env and add your API keys
```

Required environment variables:
```env
# Database
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/uptrade
REDIS_URL=redis://localhost:6379

# API Keys (Phase 2)
NEWS_API_KEY=your_news_api_key_here  # Get from https://newsapi.org

# Security
SECRET_KEY=your-secret-key-here
DEBUG=true
```

**Getting API Keys:**
- **News API**: Sign up at https://newsapi.org (free tier: 100 requests/day)
- All other APIs are optional; the app uses yfinance which requires no API key

4. **Run the server:**
```bash
uvicorn app.main:app --reload --port 8000
```

5. **Access the API:**
- API: http://localhost:8000
- Swagger Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Docker Deployment

Build and run with Docker:
```bash
docker build -t uptrade-backend .
docker run -p 8000:8000 \
  -e DATABASE_URL=postgresql+asyncpg://postgres:postgres@db:5432/uptrade \
  -e REDIS_URL=redis://redis:6379 \
  uptrade-backend
```

### Docker Compose

Use the docker-compose.yml in the root directory to run the full stack:
```bash
cd ..
docker-compose up
```

## Database Migrations

Using Alembic for database migrations:

1. **Initialize Alembic (already done):**
```bash
alembic init alembic
```

2. **Create migration:**
```bash
alembic revision --autogenerate -m "Description"
```

3. **Run migrations:**
```bash
alembic upgrade head
```

## Development

### Project Structure

```
backend/
├── app/
│   ├── api/v1/          # API endpoints
│   ├── core/            # Core utilities (security, logging)
│   ├── models/          # SQLAlchemy models
│   ├── schemas/         # Pydantic schemas
│   ├── services/        # Business logic
│   ├── config.py        # Configuration
│   ├── database.py      # Database setup
│   ├── dependencies.py  # FastAPI dependencies
│   └── main.py          # Application entry point
├── requirements.txt     # Python dependencies
├── Dockerfile          # Docker configuration
└── README.md           # This file
```

### Adding New Endpoints

1. Create schemas in `app/schemas/`
2. Create models in `app/models/`
3. Create service in `app/services/`
4. Create router in `app/api/v1/`
5. Register router in `app/main.py`

## Testing

Run tests (to be implemented):
```bash
pytest
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection URL | postgresql+asyncpg://... |
| `REDIS_URL` | Redis connection URL | redis://localhost:6379 |
| `SECRET_KEY` | JWT secret key | (required) |
| `DEBUG` | Debug mode | false |
| `ALPACA_API_KEY` | Alpaca API key | None |
| `POLYGON_API_KEY` | Polygon API key | None |
| `NEWS_API_KEY` | News API key | None |
| `GOOGLE_API_KEY` | Google AI API key | None |

## Current Implementation Status

### ✅ Phase 1 - Backend Foundation (Complete)
- ✅ Complete directory structure
- ✅ Database models (14 tables)
- ✅ Pydantic schemas
- ✅ API endpoints (31 endpoints)
- ✅ FastAPI application with middleware
- ✅ Docker support
- ✅ Health check endpoint

### ✅ Phase 2 - Real API Integrations (Complete)
- ✅ **yfinance** integration for real-time stock data
- ✅ **News API** integration for financial news
- ✅ **VADER sentiment** analysis for all articles
- ✅ Error handling with fallback to mock data
- ✅ Comprehensive logging
- ✅ Environment-based configuration

### ✅ Phase 3 - ML & Advanced Analytics (Complete)
- ✅ **ML price forecasting** using Prophet, Linear Regression, Moving Average
- ✅ **Portfolio optimization** with Modern Portfolio Theory
- ✅ **Efficient frontier** calculation
- ✅ **Sharpe ratio** maximization
- ✅ **Risk/return** analysis and profiling
- ✅ **Diversification scoring** using information entropy
- ✅ **Confidence intervals** for predictions

### 🔄 Phase 4 - Production Features (Planned)
- [ ] LSTM/RNN deep learning forecasts
- [ ] SEC EDGAR filing integration
- [ ] Real social media APIs (Reddit/Twitter)
- [ ] Redis caching layer
- [ ] Database persistence for forecasts
- [ ] WebSocket real-time updates
- [ ] Backtesting framework
- [ ] Advanced risk metrics (VaR, CVaR)

## Real Data Sources

| Feature | Data Source | Status |
|---------|-------------|--------|
| Stock Prices | Yahoo Finance (yfinance) | ✅ Live |
| Historical Data | Yahoo Finance (yfinance) | ✅ Live |
| Fundamentals | Yahoo Finance (yfinance) | ✅ Live |
| News Articles | News API | ✅ Live |
| Sentiment Analysis | VADER (local) | ✅ Live |
| Price Forecasting | Prophet/Sklearn (local) | ✅ Live |
| Portfolio Optimization | PyPortfolioOpt (local) | ✅ Live |
| Filings | SEC EDGAR | 🔄 Planned |
| Social Media | Reddit/Twitter API | 🔄 Planned |

**Note:** All services gracefully fall back to mock data if APIs are unavailable or not configured.

## License

MIT
