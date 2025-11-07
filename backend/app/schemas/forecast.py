"""Forecasting Pydantic schemas."""
from datetime import datetime
from typing import Optional, Dict
from pydantic import BaseModel, Field


class ForecastRequest(BaseModel):
    """Forecast request schema."""
    ticker: str
    horizon_days: int = Field(default=30, ge=1, le=365)
    model_name: Optional[str] = "default"
    include_sentiment: bool = True


class ForecastResponse(BaseModel):
    """Forecast response schema."""
    id: int
    ticker: str
    model_name: str
    forecast_date: datetime
    prediction_date: datetime
    predicted_price: float
    predicted_high: Optional[float] = None
    predicted_low: Optional[float] = None
    confidence_interval_upper: Optional[float] = None
    confidence_interval_lower: Optional[float] = None
    confidence_score: Optional[float] = None
    
    class Config:
        from_attributes = True


class ModelPerformanceResponse(BaseModel):
    """Model performance response schema."""
    id: int
    model_name: str
    model_version: Optional[str] = None
    ticker: Optional[str] = None
    mae: Optional[float] = None
    mse: Optional[float] = None
    rmse: Optional[float] = None
    mape: Optional[float] = None
    r2_score: Optional[float] = None
    directional_accuracy: Optional[float] = None
    evaluation_start: Optional[datetime] = None
    evaluation_end: Optional[datetime] = None
    
    class Config:
        from_attributes = True
