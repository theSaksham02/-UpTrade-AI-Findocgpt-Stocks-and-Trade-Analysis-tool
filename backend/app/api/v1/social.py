"""Social media API endpoints."""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.services.sentiment_service import sentiment_service

router = APIRouter(prefix="/social", tags=["social"])


@router.get("/trending", response_model=list)
async def get_trending_social(
    limit: int = Query(10, le=50),
    db: AsyncSession = Depends(get_db)
):
    """
    Get trending stocks on social media.
    
    Args:
        limit: Maximum number of results
        db: Database session
        
    Returns:
        Trending stocks
    """
    trending = await sentiment_service.get_trending_stocks(limit=limit)
    return trending


@router.get("/ticker/{ticker}", response_model=list)
async def get_social_by_ticker(
    ticker: str,
    platform: str = Query(None, regex="^(reddit|twitter)$"),
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
