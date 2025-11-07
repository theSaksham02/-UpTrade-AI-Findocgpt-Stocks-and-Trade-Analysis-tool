"""Filings API endpoints for regulatory documents."""
from typing import Optional
from datetime import datetime
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.services.filing_service import filing_service

router = APIRouter(prefix="/filings", tags=["filings"])


@router.get("/latest", response_model=list)
async def get_latest_filings(
    ticker: str = Query("AAPL", description="Stock ticker"),
    filing_type: str = Query("10-K", description="Filing type"),
    limit: int = Query(5, le=20),
    db: AsyncSession = Depends(get_db)
):
    """
    Get latest filings for a company.
    
    Args:
        ticker: Stock ticker
        filing_type: Type of filing (10-K, 10-Q, 8-K)
        limit: Maximum number of results
        db: Database session
        
    Returns:
        Latest filings
    """
    filings = await filing_service.get_latest_filings(ticker, filing_type, limit)
    return filings


@router.get("/search", response_model=list)
async def search_filings(
    ticker: Optional[str] = Query(None),
    filing_type: Optional[str] = Query(None),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    source: Optional[str] = Query(None, regex="^(SEC|SEDAR|ESMA)$"),
    limit: int = Query(10, le=50),
    db: AsyncSession = Depends(get_db)
):
    """
    Search regulatory filings.
    
    Args:
        ticker: Filter by ticker
        filing_type: Filter by filing type (10-K, 10-Q, etc.)
        start_date: Start date filter
        end_date: End date filter
        source: Filter by source (SEC, SEDAR, ESMA)
        limit: Maximum number of results
        db: Database session
        
    Returns:
        Filing search results
    """
    filings = await filing_service.search_filings(
        ticker=ticker,
        filing_type=filing_type,
        date_from=start_date,
        date_to=end_date,
        limit=limit
    )
    return filings


@router.get("/{filing_id}", response_model=dict)
async def get_filing(
    filing_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    Get a specific filing by ID.
    
    Args:
        filing_id: Filing ID
        db: Database session
        
    Returns:
        Filing details
    """
    filing = await filing_service.get_filing_by_id(filing_id)
    
    if filing is None:
        return {
            "error": "Filing not found",
            "filing_id": filing_id
        }
    
    return filing


@router.get("/{filing_id}/sentiment", response_model=dict)
async def get_filing_sentiment(
    filing_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    Analyze sentiment of a filing document.
    
    Args:
        filing_id: Filing ID
        db: Database session
        
    Returns:
        Sentiment analysis results
    """
    sentiment = await filing_service.analyze_filing_sentiment(filing_id)
    return sentiment
