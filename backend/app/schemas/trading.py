"""Trading Pydantic schemas."""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class OrderCreate(BaseModel):
    """Order creation schema."""
    portfolio_id: int
    ticker: str
    order_type: str = Field(..., pattern="^(market|limit|stop|stop_limit)$")
    side: str = Field(..., pattern="^(buy|sell)$")
    quantity: float = Field(..., gt=0)
    price: Optional[float] = None
    stop_price: Optional[float] = None


class OrderResponse(BaseModel):
    """Order response schema."""
    id: int
    portfolio_id: int
    ticker: str
    order_type: str
    side: str
    quantity: float
    price: Optional[float] = None
    stop_price: Optional[float] = None
    filled_price: Optional[float] = None
    filled_quantity: float
    status: str
    created_at: datetime
    updated_at: datetime
    filled_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class TradeResponse(BaseModel):
    """Trade response schema."""
    id: int
    user_id: int
    portfolio_id: int
    ticker: str
    side: str
    quantity: float
    price: float
    total_value: float
    fees: float
    realized_pnl: Optional[float] = None
    realized_pnl_percent: Optional[float] = None
    executed_at: datetime
    
    class Config:
        from_attributes = True


class LeaderboardEntry(BaseModel):
    """Leaderboard entry schema."""
    rank: int
    user_id: int
    portfolio_name: str
    total_return: float
    sharpe_ratio: Optional[float] = None
    total_trades: int
