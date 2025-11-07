"""Filings API endpoints for regulatory documents."""
from typing import Optional
from datetime import datetime
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db

router = APIRouter(prefix="/filings", tags=["filings"])


@router.get("/latest", response_model=list)
async def get_latest_filings(
    limit: int = Query(20, le=100),
    db: AsyncSession = Depends(get_db)
):
    """
    Get latest filings.
    
    Args:
        limit: Maximum number of results
        db: Database session
        
    Returns:
        Latest filings
    """
    # Stub implementation - returns mock data
    return [
        {
            "id": 1,
            "company_name": "Apple Inc.",
            "ticker": "AAPL",
            "filing_type": "10-K",
            "filing_date": datetime.utcnow(),
            "source": "SEC",
            "url": "https://www.sec.gov/example/aapl-10k.html"
        }
    ]


@router.get("/search", response_model=list)
async def search_filings(
    ticker: Optional[str] = Query(None),
    filing_type: Optional[str] = Query(None),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    source: Optional[str] = Query(None, regex="^(SEC|SEDAR|ESMA)$"),
    limit: int = Query(20, le=100),
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
    # Stub implementation - returns mock data
    return [
        {
            "id": 1,
            "company_name": "Apple Inc.",
            "ticker": "AAPL",
            "filing_type": "10-K",
            "filing_date": datetime.utcnow(),
            "source": "SEC",
            "url": "https://www.sec.gov/example/aapl-10k.html"
        }
    ]


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
    # Stub implementation - returns mock data
    return {
        "id": filing_id,
        "company_name": "Apple Inc.",
        "ticker": "AAPL",
        "filing_type": "10-K",
        "filing_date": datetime.utcnow(),
        "source": "SEC",
        "content": "Annual report content...",
        "url": "https://www.sec.gov/example/aapl-10k.html",
        "extra_data": {}
    }
