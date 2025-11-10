"""
FastAPI Backend for UpTrade AI
Provides REST API endpoints for AI models, market data, and financial analysis
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import logging
from datetime import datetime

# Import our AI modules
from ai_models import get_ai_manager
from api_integrations import get_api_manager

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="UpTrade AI API",
    description="AI-powered financial analysis and trading platform",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5050",
        "http://localhost:5173",
        "https://*.vercel.app",
        "*"  # For development only
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================================
# Pydantic Models
# ============================================================================

class SentimentRequest(BaseModel):
    texts: List[str] = Field(..., description="List of texts to analyze", max_items=50)
    
class SentimentResponse(BaseModel):
    results: List[Dict[str, Any]]
    average_sentiment: float
    overall_sentiment: str

class QuestionAnswerRequest(BaseModel):
    question: str = Field(..., description="Question to answer")
    context: str = Field(..., description="Document context (max 4000 chars)")
    
class EntityExtractionRequest(BaseModel):
    text: str = Field(..., description="Text to extract entities from")

class NewsRequest(BaseModel):
    query: str = Field(default="stock market", description="News search query")
    limit: int = Field(default=10, ge=1, le=50, description="Number of articles")

class StockQuoteRequest(BaseModel):
    symbol: str = Field(..., description="Stock ticker symbol", min_length=1, max_length=10)


# ============================================================================
# Health Check & Info Endpoints
# ============================================================================

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "🚀 UpTrade AI API is running",
        "version": "1.0.0",
        "docs": "/api/docs",
        "status": "operational"
    }

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    try:
        ai_manager = get_ai_manager()
        model_info = ai_manager.get_model_info()
        
        return {
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "ai_models": model_info,
            "api_version": "1.0.0"
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/models/info")
async def get_models_info():
    """Get information about loaded AI models"""
    try:
        ai_manager = get_ai_manager()
        return ai_manager.get_model_info()
    except Exception as e:
        logger.error(f"Failed to get model info: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# AI Model Endpoints
# ============================================================================

@app.post("/api/sentiment", response_model=SentimentResponse)
async def analyze_sentiment(request: SentimentRequest):
    """
    Analyze sentiment of financial texts using FinBERT
    
    - **texts**: List of texts to analyze (max 50)
    
    Returns sentiment analysis results with confidence scores
    """
    try:
        logger.info(f"Sentiment analysis request for {len(request.texts)} texts")
        
        ai_manager = get_ai_manager()
        results = ai_manager.analyze_sentiment(request.texts)
        
        # Calculate average sentiment
        sentiment_scores = [r['score'] for r in results if 'score' in r]
        avg_sentiment = sum(sentiment_scores) / len(sentiment_scores) if sentiment_scores else 0.0
        
        # Determine overall sentiment
        if avg_sentiment > 0.2:
            overall = "positive"
        elif avg_sentiment < -0.2:
            overall = "negative"
        else:
            overall = "neutral"
        
        return {
            "results": results,
            "average_sentiment": round(avg_sentiment, 4),
            "overall_sentiment": overall
        }
        
    except Exception as e:
        logger.error(f"Sentiment analysis failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/document-qa")
async def answer_question(request: QuestionAnswerRequest):
    """
    Answer questions based on document context using RoBERTa Q&A
    
    - **question**: Question to answer
    - **context**: Document context (max 4000 characters)
    
    Returns answer with confidence score and source location
    """
    try:
        logger.info(f"Q&A request: {request.question}")
        
        ai_manager = get_ai_manager()
        result = ai_manager.answer_question(request.question, request.context)
        
        return result
        
    except Exception as e:
        logger.error(f"Q&A failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/extract-entities")
async def extract_entities(request: EntityExtractionRequest):
    """
    Extract named entities (companies, metrics, etc.) from text using NER
    
    - **text**: Text to analyze
    
    Returns list of extracted entities with types and confidence scores
    """
    try:
        logger.info(f"Entity extraction request (text length: {len(request.text)})")
        
        ai_manager = get_ai_manager()
        entities = ai_manager.extract_entities(request.text)
        
        # Group entities by type
        entities_by_type = {}
        for entity in entities:
            entity_type = entity.get('type', 'UNKNOWN')
            if entity_type not in entities_by_type:
                entities_by_type[entity_type] = []
            entities_by_type[entity_type].append(entity)
        
        return {
            "entities": entities,
            "entities_by_type": entities_by_type,
            "total_count": len(entities)
        }
        
    except Exception as e:
        logger.error(f"Entity extraction failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# Market Data Endpoints
# ============================================================================

@app.post("/api/news")
async def get_financial_news(request: NewsRequest):
    """
    Fetch financial news articles
    
    - **query**: Search query (default: "stock market")
    - **limit**: Number of articles (1-50)
    
    Returns list of news articles with metadata
    """
    try:
        logger.info(f"News request: query='{request.query}', limit={request.limit}")
        
        api_manager = get_api_manager()
        articles = api_manager.get_financial_news(request.query, request.limit)
        
        return {
            "articles": articles,
            "count": len(articles),
            "query": request.query
        }
        
    except Exception as e:
        logger.error(f"Failed to fetch news: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/stock/quote")
async def get_stock_quote(request: StockQuoteRequest):
    """
    Get real-time stock quote
    
    - **symbol**: Stock ticker symbol
    
    Returns current stock price and trading data
    """
    try:
        logger.info(f"Stock quote request: {request.symbol}")
        
        api_manager = get_api_manager()
        quote = api_manager.get_stock_quote(request.symbol.upper())
        
        return quote
        
    except Exception as e:
        logger.error(f"Failed to fetch stock quote: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/stock/overview/{symbol}")
async def get_company_overview(symbol: str):
    """
    Get company overview and fundamentals
    
    - **symbol**: Stock ticker symbol
    
    Returns company information, sector, financials, etc.
    """
    try:
        logger.info(f"Company overview request: {symbol}")
        
        api_manager = get_api_manager()
        overview = api_manager.get_company_overview(symbol.upper())
        
        return overview
        
    except Exception as e:
        logger.error(f"Failed to fetch company overview: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/sec-filings/{ticker}")
async def get_sec_filings(ticker: str, filing_type: str = "10-K"):
    """
    Search SEC Edgar filings
    
    - **ticker**: Company ticker
    - **filing_type**: Type of filing (10-K, 10-Q, 8-K, etc.)
    
    Returns list of SEC filings with links
    """
    try:
        logger.info(f"SEC filings request: {ticker}, type={filing_type}")
        
        api_manager = get_api_manager()
        filings = api_manager.search_sec_filings(ticker.upper(), filing_type)
        
        return {
            "filings": filings,
            "ticker": ticker.upper(),
            "filing_type": filing_type
        }
        
    except Exception as e:
        logger.error(f"Failed to fetch SEC filings: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# Combined Analysis Endpoints (Multi-Model)
# ============================================================================

@app.post("/api/analyze-news-sentiment")
async def analyze_news_sentiment(request: NewsRequest):
    """
    Fetch news articles and analyze their sentiment
    
    Combines news fetching + FinBERT sentiment analysis
    """
    try:
        logger.info(f"Combined news sentiment analysis: query='{request.query}'")
        
        # Fetch news
        api_manager = get_api_manager()
        articles = api_manager.get_financial_news(request.query, request.limit)
        
        if not articles:
            return {
                "articles": [],
                "sentiment_analysis": None,
                "message": "No articles found"
            }
        
        # Extract texts for sentiment analysis
        texts_to_analyze = []
        for article in articles:
            title = article.get('title', '')
            description = article.get('description', '')
            text = f"{title}. {description}"
            texts_to_analyze.append(text)
        
        # Analyze sentiment
        ai_manager = get_ai_manager()
        sentiment_results = ai_manager.analyze_sentiment(texts_to_analyze)
        
        # Combine results
        for article, sentiment in zip(articles, sentiment_results):
            article['sentiment'] = sentiment['sentiment']
            article['sentiment_score'] = sentiment['score']
            article['sentiment_confidence'] = sentiment['confidence']
        
        # Calculate overall sentiment
        sentiment_scores = [r['score'] for r in sentiment_results]
        avg_sentiment = sum(sentiment_scores) / len(sentiment_scores) if sentiment_scores else 0.0
        
        return {
            "articles": articles,
            "sentiment_analysis": {
                "average_score": round(avg_sentiment, 4),
                "overall_sentiment": "positive" if avg_sentiment > 0.2 else "negative" if avg_sentiment < -0.2 else "neutral",
                "positive_count": sum(1 for s in sentiment_scores if s > 0.2),
                "negative_count": sum(1 for s in sentiment_scores if s < -0.2),
                "neutral_count": sum(1 for s in sentiment_scores if -0.2 <= s <= 0.2)
            },
            "count": len(articles)
        }
        
    except Exception as e:
        logger.error(f"Combined news sentiment analysis failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze-company")
async def analyze_company(symbol: str):
    """
    Comprehensive company analysis combining multiple data sources
    
    - Stock quote
    - Company overview
    - Recent news with sentiment
    - SEC filings
    """
    try:
        logger.info(f"Comprehensive company analysis: {symbol}")
        
        api_manager = get_api_manager()
        symbol_upper = symbol.upper()
        
        # Fetch all data
        quote = api_manager.get_stock_quote(symbol_upper)
        overview = api_manager.get_company_overview(symbol_upper)
        news_articles = api_manager.get_financial_news(f"{symbol_upper} stock", 5)
        sec_filings = api_manager.search_sec_filings(symbol_upper, "10-K")
        
        # Analyze news sentiment
        if news_articles:
            texts = [f"{a.get('title', '')}. {a.get('description', '')}" for a in news_articles]
            ai_manager = get_ai_manager()
            sentiment_results = ai_manager.analyze_sentiment(texts)
            
            for article, sentiment in zip(news_articles, sentiment_results):
                article['sentiment'] = sentiment['sentiment']
                article['sentiment_score'] = sentiment['score']
        
        return {
            "symbol": symbol_upper,
            "quote": quote,
            "overview": overview,
            "recent_news": news_articles,
            "sec_filings": sec_filings,
            "analysis_timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Company analysis failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# Startup Event
# ============================================================================

@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    logger.info("🚀 UpTrade AI API starting up...")
    logger.info("✅ Ready to serve requests")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "api_server:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
