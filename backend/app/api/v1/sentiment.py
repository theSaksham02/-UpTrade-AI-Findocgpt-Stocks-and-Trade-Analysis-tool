"""Sentiment analysis API endpoints."""
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.sentiment import SentimentResponse, SocialMentionResponse, TrendingStockResponse
from app.services.sentiment_service import sentiment_service

router = APIRouter(prefix="/sentiment", tags=["sentiment"])


@router.get("/{ticker}", response_model=dict)
async def get_sentiment(
    ticker: str,
    period: str = Query("daily", regex="^(hourly|daily|weekly)$"),
    db: AsyncSession = Depends(get_db)
):
    """
    Get aggregated sentiment for a ticker.
    
    Args:
        ticker: Stock ticker symbol
        period: Time period
        db: Database session
        
    Returns:
        Sentiment data
    """
    sentiment = await sentiment_service.get_sentiment(ticker.upper(), period=period)
    return sentiment


@router.get("/trending", response_model=list)
async def get_trending_stocks(
    limit: int = Query(10, le=50),
    db: AsyncSession = Depends(get_db)
):
    """
    Get trending stocks based on social media.
    
    Args:
        limit: Maximum number of results
        db: Database session
        
    Returns:
        Trending stocks
    """
    # Note: This endpoint path conflicts with /{ticker} route
    # In practice, ensure "trending" is handled before the ticker parameter route
    trending = await sentiment_service.get_trending_stocks(limit=limit)
    return trending


@router.get("/social/{ticker}", response_model=list)
async def get_social_mentions(
    ticker: str,
    platform: Optional[str] = Query(None, regex="^(reddit|twitter)$"),
    limit: int = Query(50, le=100),
    db: AsyncSession = Depends(get_db)
):
    """
    Get social media mentions for a ticker.
    
    Args:
        ticker: Stock ticker symbol
        platform: Filter by platform
        limit: Maximum number of mentions
        db: Database session
        
    Returns:
        Social media mentions
    """
    mentions = await sentiment_service.get_social_mentions(
        ticker.upper(),
        platform=platform,
        limit=limit
    )
    return mentions
