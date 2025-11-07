"""Portfolio Pydantic schemas."""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


class PortfolioCreate(BaseModel):
    """Portfolio creation schema."""
    name: str
    description: Optional[str] = None
    initial_value: float = Field(..., gt=0)


class PortfolioResponse(BaseModel):
    """Portfolio response schema."""
    id: int
    user_id: int
    name: str
    description: Optional[str] = None
    initial_value: float
    current_value: float
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class PositionResponse(BaseModel):
    """Position response schema."""
    id: int
    portfolio_id: int
    ticker: str
    quantity: float
    average_price: float
    current_price: Optional[float] = None
    total_value: Optional[float] = None
    unrealized_pnl: Optional[float] = None
    unrealized_pnl_percent: Optional[float] = None
    opened_at: datetime
    
    class Config:
        from_attributes = True


class PortfolioPerformanceResponse(BaseModel):
    """Portfolio performance response schema."""
    date: datetime
    total_value: float
    daily_return: Optional[float] = None
    cumulative_return: Optional[float] = None
    volatility: Optional[float] = None
    sharpe_ratio: Optional[float] = None


class PortfolioOptimizationRequest(BaseModel):
    """Portfolio optimization request schema."""
    target_return: Optional[float] = None
    risk_tolerance: str = Field(default="moderate", pattern="^(conservative|moderate|aggressive)$")
    constraints: dict = {}


class PortfolioOptimizationResponse(BaseModel):
    """Portfolio optimization response schema."""
    recommended_allocations: dict
    expected_return: float
    expected_risk: float
    sharpe_ratio: float
