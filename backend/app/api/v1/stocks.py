"""Stock-related API endpoints."""
from typing import Optional
from datetime import datetime
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.stock import StockPriceResponse, CompanyFundamentalsResponse, StockSearchResponse
from app.services.market_data import market_data_service
from app.services.technical_indicators import technical_indicators_service

router = APIRouter(prefix="/stocks", tags=["stocks"])


@router.get("/{ticker}/price", response_model=dict)
async def get_stock_price(
    ticker: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Get current stock price.
    
    Args:
        ticker: Stock ticker symbol
        db: Database session
        
    Returns:
        Current price data
    """
    price_data = await market_data_service.get_current_price(ticker.upper())
    return price_data


@router.get("/{ticker}/history", response_model=list)
async def get_stock_history(
    ticker: str,
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    interval: str = Query("1d", regex="^(1d|1h|5m|15m|30m)$"),
    db: AsyncSession = Depends(get_db)
):
    """
    Get historical stock prices.
    
    Args:
        ticker: Stock ticker symbol
        start_date: Start date for history
        end_date: End date for history
        interval: Data interval
        db: Database session
        
    Returns:
        Historical price data
    """
    history = await market_data_service.get_historical_prices(
        ticker.upper(),
        start_date=start_date,
        end_date=end_date,
        interval=interval
    )
    return history


@router.get("/{ticker}/fundamentals", response_model=dict)
async def get_stock_fundamentals(
    ticker: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Get company fundamental data.
    
    Args:
        ticker: Stock ticker symbol
        db: Database session
        
    Returns:
        Company fundamentals
    """
    fundamentals = await market_data_service.get_fundamentals(ticker.upper())
    return fundamentals


@router.get("/search", response_model=list)
async def search_stocks(
    query: str = Query(..., min_length=1),
    db: AsyncSession = Depends(get_db)
):
    """
    Search for stocks by name or ticker.
    
    Args:
        query: Search query
        db: Database session
        
    Returns:
        Search results
    """
    results = await market_data_service.search_stocks(query)
    return results


@router.get("/{ticker}/indicators", response_model=dict)
async def get_technical_indicators(
    ticker: str,
    period: str = Query("6mo", regex="^(1mo|3mo|6mo|1y|2y)$"),
    db: AsyncSession = Depends(get_db)
):
    """
    Get all technical indicators for a stock.
    
    Args:
        ticker: Stock ticker symbol
        period: Historical period for calculations
        db: Database session
        
    Returns:
        Technical indicators (RSI, MACD, Bollinger Bands, etc.)
    """
    indicators = await technical_indicators_service.get_all_indicators(ticker.upper(), period)
    return indicators
