"""Trade and order models."""
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, JSON, Enum as SQLEnum
import enum

from app.database import Base
from sqlalchemy.orm import relationship


class OrderType(str, enum.Enum):
    """Order type enumeration."""
    MARKET = "market"
    LIMIT = "limit"
    STOP = "stop"
    STOP_LIMIT = "stop_limit"


class OrderSide(str, enum.Enum):
    """Order side enumeration."""
    BUY = "buy"
    SELL = "sell"


class OrderStatus(str, enum.Enum):
    """Order status enumeration."""
    PENDING = "pending"
    FILLED = "filled"
    PARTIALLY_FILLED = "partially_filled"
    CANCELLED = "cancelled"
    REJECTED = "rejected"


class Order(Base):
    """Order model for tracking trade orders."""
    
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    portfolio_id = Column(Integer, ForeignKey("portfolios.id"), nullable=False)
    
    # Order information
    ticker = Column(String, index=True, nullable=False)
    order_type = Column(SQLEnum(OrderType), nullable=False)
    side = Column(SQLEnum(OrderSide), nullable=False)
    quantity = Column(Float, nullable=False)
    
    # Pricing
    price = Column(Float)  # For limit orders
    stop_price = Column(Float)  # For stop orders
    filled_price = Column(Float)
    filled_quantity = Column(Float, default=0)
    
    # Status
    status = Column(SQLEnum(OrderStatus), default=OrderStatus.PENDING, nullable=False)
    
    # Metadata
    extra_data = Column(JSON, default=dict)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    filled_at = Column(DateTime)
    
    def __repr__(self):
        return f"<Order(id={self.id}, ticker={self.ticker}, side={self.side}, status={self.status})>"


class Trade(Base):
    """Trade model for recording executed trades."""
    
    __tablename__ = "trades"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    portfolio_id = Column(Integer, ForeignKey("portfolios.id"), nullable=False)
    order_id = Column(Integer, ForeignKey("orders.id"))
    
    # Trade information
    ticker = Column(String, index=True, nullable=False)
    side = Column(SQLEnum(OrderSide), nullable=False)
    quantity = Column(Float, nullable=False)
    price = Column(Float, nullable=False)
    
    # Costs and fees
    total_value = Column(Float, nullable=False)
    fees = Column(Float, default=0)
    
    # P&L (for closing trades)
    realized_pnl = Column(Float)
    realized_pnl_percent = Column(Float)
    
    # Metadata
    extra_data = Column(JSON, default=dict)
    
    # Timestamps
    executed_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="trades")
    
    def __repr__(self):
        return f"<Trade(id={self.id}, ticker={self.ticker}, side={self.side}, price={self.price})>"
