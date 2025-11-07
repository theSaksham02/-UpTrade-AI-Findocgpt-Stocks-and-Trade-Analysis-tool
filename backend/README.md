# UpTrade AI Backend

FastAPI-based backend for the UpTrade AI financial analysis and trading platform.

## Features

- **RESTful API** with FastAPI
- **Async/Await** throughout for high performance
- **PostgreSQL** database with SQLAlchemy ORM
- **Redis** for caching and session management
- **Auto-generated OpenAPI docs** at `/docs`
- **CORS support** for frontend integration
- **Request logging** and error handling
- **JWT authentication** (stub implementation)

## API Endpoints

### Health & Status
- `GET /health` - Health check
- `GET /` - API information

### Stocks (`/api/v1/stocks`)
- `GET /{ticker}/price` - Get current stock price
- `GET /{ticker}/history` - Get historical prices
- `GET /{ticker}/fundamentals` - Get company fundamentals
- `GET /search` - Search stocks

### News (`/api/v1/news`)
- `GET /latest` - Get latest news
- `GET /ticker/{ticker}` - Get news by ticker
- `GET /trending` - Get trending news
- `POST /search` - Search news

### Sentiment (`/api/v1/sentiment`)
- `GET /{ticker}` - Get sentiment for ticker
- `GET /trending` - Get trending stocks by sentiment
- `GET /social/{ticker}` - Get social media mentions

### Forecast (`/api/v1/forecast`)
- `POST /{ticker}` - Create price forecast
- `GET /{ticker}/latest` - Get latest forecast
- `GET /performance` - Get model performance

### Portfolio (`/api/v1/portfolio`)
- `POST /` - Create portfolio
- `GET /{id}` - Get portfolio details
- `GET /{id}/performance` - Get performance history
- `POST /{id}/optimize` - Optimize portfolio

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
Create `.env` file in backend directory:
```env
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/uptrade
REDIS_URL=redis://localhost:6379
SECRET_KEY=your-secret-key-here
DEBUG=true
```

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

This is **Phase 1** - Backend Foundation:
- ✅ Complete directory structure
- ✅ Database models
- ✅ Pydantic schemas
- ✅ API endpoints (stub implementations)
- ✅ FastAPI application with middleware
- ✅ Docker support
- ✅ Health check endpoint

**Note:** All endpoints currently return mock data. Actual implementation will be in subsequent phases.

## License

MIT
