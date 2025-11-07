"""Stock-related Pydantic schemas."""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class StockPriceBase(BaseModel):
    """Base stock price schema."""
    ticker: str
    timestamp: datetime
    open: float
    high: float
    low: float
    close: float
    volume: int
    adjusted_close: Optional[float] = None


class StockPriceResponse(StockPriceBase):
    """Stock price response schema."""
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class CompanyFundamentalsBase(BaseModel):
    """Base company fundamentals schema."""
    ticker: str
    company_name: Optional[str] = None
    sector: Optional[str] = None
    industry: Optional[str] = None
    market_cap: Optional[int] = None
    pe_ratio: Optional[float] = None
    eps: Optional[float] = None
    dividend_yield: Optional[float] = None
    beta: Optional[float] = None
    metadata: dict = {}


class CompanyFundamentalsResponse(CompanyFundamentalsBase):
    """Company fundamentals response schema."""
    id: int
    updated_at: datetime
    
    class Config:
        from_attributes = True


class StockSearchResponse(BaseModel):
    """Stock search response schema."""
    ticker: str
    company_name: str
    sector: Optional[str] = None
    market_cap: Optional[int] = None
