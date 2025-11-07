"""Forecasting API endpoints."""
from typing import Optional
from fastapi import APIRouter, Depends, Body
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.forecast import ForecastRequest, ForecastResponse, ModelPerformanceResponse
from app.services.forecast_service import forecast_service

router = APIRouter(prefix="/forecast", tags=["forecast"])


@router.post("/{ticker}", response_model=dict)
async def create_forecast(
    ticker: str,
    request: ForecastRequest = Body(...),
    db: AsyncSession = Depends(get_db)
):
    """
    Create a price forecast for a ticker.
    
    Args:
        ticker: Stock ticker symbol
        request: Forecast request parameters
        db: Database session
        
    Returns:
        Forecast data
    """
    forecast = await forecast_service.create_forecast(
        ticker=ticker.upper(),
        horizon_days=request.horizon_days,
        model_name=request.model_name,
        include_sentiment=request.include_sentiment
    )
    return forecast


@router.get("/{ticker}/latest", response_model=dict)
async def get_latest_forecast(
    ticker: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Get the latest forecast for a ticker.
    
    Args:
        ticker: Stock ticker symbol
        db: Database session
        
    Returns:
        Latest forecast
    """
    forecast = await forecast_service.get_latest_forecast(ticker.upper())
    return forecast


@router.get("/performance", response_model=list)
async def get_model_performance(
    model_name: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """
    Get performance metrics for forecasting models.
    
    Args:
        model_name: Optional filter by model name
        db: Database session
        
    Returns:
        Model performance metrics
    """
    performance = await forecast_service.get_model_performance(model_name=model_name)
    return performance
