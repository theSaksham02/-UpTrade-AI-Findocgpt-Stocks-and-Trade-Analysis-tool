"""Stock and market data models."""
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Float, Index, JSON, BigInteger

from app.database import Base


class StockPrice(Base):
    """Stock price OHLCV data model."""
    
    __tablename__ = "stock_prices"
    
    id = Column(BigInteger, primary_key=True, index=True)
    ticker = Column(String, index=True, nullable=False)
    timestamp = Column(DateTime, index=True, nullable=False)
    
    # OHLCV data
    open = Column(Float, nullable=False)
    high = Column(Float, nullable=False)
    low = Column(Float, nullable=False)
    close = Column(Float, nullable=False)
    volume = Column(BigInteger, nullable=False)
    
    # Additional fields
    adjusted_close = Column(Float)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    __table_args__ = (
        Index('idx_ticker_timestamp', 'ticker', 'timestamp'),
    )
    
    def __repr__(self):
        return f"<StockPrice(ticker={self.ticker}, timestamp={self.timestamp}, close={self.close})>"


class CompanyFundamentals(Base):
    """Company fundamental data model."""
    
    __tablename__ = "company_fundamentals"
    
    id = Column(Integer, primary_key=True, index=True)
    ticker = Column(String, unique=True, index=True, nullable=False)
    
    # Company information
    company_name = Column(String)
    sector = Column(String)
    industry = Column(String)
    market_cap = Column(BigInteger)
    
    # Financial metrics
    pe_ratio = Column(Float)
    eps = Column(Float)
    dividend_yield = Column(Float)
    beta = Column(Float)
    
    # Additional data as JSON
    extra_data = Column(JSON, default=dict)
    
    # Timestamps
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    def __repr__(self):
        return f"<CompanyFundamentals(ticker={self.ticker}, company_name={self.company_name})>"
