"""News-related API endpoints."""
from typing import Optional
from datetime import datetime
from fastapi import APIRouter, Depends, Query, Body
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.news import NewsArticleResponse, NewsSearchRequest, NewsTrendingResponse
from app.services.news_service import news_service

router = APIRouter(prefix="/news", tags=["news"])


@router.get("/latest", response_model=list)
async def get_latest_news(
    limit: int = Query(20, le=100),
    db: AsyncSession = Depends(get_db)
):
    """
    Get latest financial news.
    
    Args:
        limit: Maximum number of articles
        db: Database session
        
    Returns:
        Latest news articles
    """
    articles = await news_service.get_latest_news(limit=limit)
    return articles


@router.get("/ticker/{ticker}", response_model=list)
async def get_news_by_ticker(
    ticker: str,
    limit: int = Query(20, le=100),
    db: AsyncSession = Depends(get_db)
):
    """
    Get news articles for a specific ticker.
    
    Args:
        ticker: Stock ticker symbol
        limit: Maximum number of articles
        db: Database session
        
    Returns:
        News articles for ticker
    """
    articles = await news_service.get_news_by_ticker(ticker.upper(), limit=limit)
    return articles


@router.get("/trending", response_model=list)
async def get_trending_news(
    db: AsyncSession = Depends(get_db)
):
    """
    Get trending news topics.
    
    Args:
        db: Database session
        
    Returns:
        Trending news
    """
    trending = await news_service.get_trending_news()
    return trending


@router.post("/search", response_model=list)
async def search_news(
    request: NewsSearchRequest = Body(...),
    db: AsyncSession = Depends(get_db)
):
    """
    Search news articles.
    
    Args:
        request: Search request parameters
        db: Database session
        
    Returns:
        Search results
    """
    results = await news_service.search_news(
        query=request.query,
        tickers=request.tickers,
        start_date=request.start_date,
        end_date=request.end_date,
        limit=request.limit
    )
    return results
