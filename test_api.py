"""
Simple API Test Server - Without AI Models
For testing endpoints before full AI integration
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="UpTrade AI Test API",
    description="Test endpoints without AI model dependencies",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "🚀 UpTrade AI Test API is running",
        "status": "operational",
        "docs": "/docs"
    }

@app.get("/api/health")
async def health():
    return {
        "status": "healthy",
        "message": "API is operational"
    }

class SentimentRequest(BaseModel):
    texts: List[str]

@app.post("/api/sentiment")
async def test_sentiment(request: SentimentRequest):
    """Mock sentiment endpoint"""
    results = []
    for text in request.texts:
        # Simple mock logic
        score = 0.5 if "good" in text.lower() or "profit" in text.lower() else -0.3
        results.append({
            "text": text[:100],
            "sentiment": "positive" if score > 0 else "negative",
            "confidence": abs(score),
            "score": score
        })
    
    avg_score = sum(r["score"] for r in results) / len(results)
    
    return {
        "results": results,
        "average_sentiment": round(avg_score, 4),
        "overall_sentiment": "positive" if avg_score > 0.2 else "negative" if avg_score < -0.2 else "neutral"
    }

@app.post("/api/news")
async def test_news():
    """Mock news endpoint"""
    return {
        "articles": [
            {
                "title": "Tech Stocks Rally on Earnings",
                "description": "Major tech companies report strong Q4 results",
                "source": "Financial Times",
                "published_at": "2025-11-10T10:00:00Z",
                "sentiment": "positive",
                "sentiment_score": 0.85
            },
            {
                "title": "Federal Reserve Holds Rates Steady",
                "description": "Central bank maintains current interest rate policy",
                "source": "Reuters",
                "published_at": "2025-11-10T09:00:00Z",
                "sentiment": "neutral",
                "sentiment_score": 0.05
            }
        ],
        "count": 2
    }

@app.post("/api/stock/quote")
async def test_quote():
    """Mock stock quote endpoint"""
    return {
        "symbol": "AAPL",
        "price": 178.45,
        "change": 2.34,
        "change_percent": "1.33%",
        "volume": 45678900,
        "latest_trading_day": "2025-11-10",
        "open": 176.20,
        "high": 179.50,
        "low": 175.80,
        "previous_close": 176.11
    }

if __name__ == "__main__":
    import uvicorn
    logger.info("🚀 Starting test API server on port 8001...")
    uvicorn.run(app, host="0.0.0.0", port=8001, log_level="info")
