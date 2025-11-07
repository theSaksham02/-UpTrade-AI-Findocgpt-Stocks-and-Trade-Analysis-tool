"""Portfolio and position models."""
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, JSON, BigInteger
from sqlalchemy.orm import relationship

from app.database import Base


class Portfolio(Base):
    """Portfolio model for managing investment portfolios."""
    
    __tablename__ = "portfolios"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Portfolio information
    name = Column(String, nullable=False)
    description = Column(String)
    initial_value = Column(Float, nullable=False)
    current_value = Column(Float, nullable=False)
    
    # Metadata
    metadata = Column(JSON, default=dict)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="portfolios")
    positions = relationship("Position", back_populates="portfolio", cascade="all, delete-orphan")
    performance = relationship("PortfolioPerformance", back_populates="portfolio", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Portfolio(id={self.id}, name={self.name}, value={self.current_value})>"


class Position(Base):
    """Position model for individual stock holdings."""
    
    __tablename__ = "positions"
    
    id = Column(Integer, primary_key=True, index=True)
    portfolio_id = Column(Integer, ForeignKey("portfolios.id"), nullable=False)
    
    # Position information
    ticker = Column(String, index=True, nullable=False)
    quantity = Column(Float, nullable=False)
    average_price = Column(Float, nullable=False)
    current_price = Column(Float)
    
    # Calculated fields
    total_value = Column(Float)
    unrealized_pnl = Column(Float)
    unrealized_pnl_percent = Column(Float)
    
    # Timestamps
    opened_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    portfolio = relationship("Portfolio", back_populates="positions")
    
    def __repr__(self):
        return f"<Position(ticker={self.ticker}, quantity={self.quantity}, avg_price={self.average_price})>"


class PortfolioPerformance(Base):
    """Daily portfolio performance tracking."""
    
    __tablename__ = "portfolio_performance"
    
    id = Column(BigInteger, primary_key=True, index=True)
    portfolio_id = Column(Integer, ForeignKey("portfolios.id"), nullable=False)
    
    # Performance metrics
    date = Column(DateTime, index=True, nullable=False)
    total_value = Column(Float, nullable=False)
    daily_return = Column(Float)
    cumulative_return = Column(Float)
    
    # Risk metrics
    volatility = Column(Float)
    sharpe_ratio = Column(Float)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    portfolio = relationship("Portfolio", back_populates="performance")
    
    def __repr__(self):
        return f"<PortfolioPerformance(portfolio_id={self.portfolio_id}, date={self.date}, value={self.total_value})>"
