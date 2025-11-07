"""Sentiment analysis models."""
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Float, Text, JSON, BigInteger

from app.database import Base


class SocialMention(Base):
    """Social media mention model (Reddit/Twitter)."""
    
    __tablename__ = "social_mentions"
    
    id = Column(BigInteger, primary_key=True, index=True)
    
    # Source information
    platform = Column(String, index=True, nullable=False)  # reddit, twitter
    ticker = Column(String, index=True, nullable=False)
    
    # Content
    content = Column(Text)
    author = Column(String)
    url = Column(String)
    
    # Metrics
    upvotes = Column(Integer, default=0)
    comments = Column(Integer, default=0)
    sentiment_score = Column(Float)  # -1 to 1
    sentiment_label = Column(String)  # positive, negative, neutral
    
    # Metadata
    extra_data = Column(JSON, default=dict)
    
    # Timestamps
    posted_at = Column(DateTime, index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    def __repr__(self):
        return f"<SocialMention(ticker={self.ticker}, platform={self.platform}, sentiment={self.sentiment_score})>"


class SentimentAggregate(Base):
    """Aggregated sentiment data model."""
    
    __tablename__ = "sentiment_aggregates"
    
    id = Column(BigInteger, primary_key=True, index=True)
    ticker = Column(String, index=True, nullable=False)
    
    # Time period
    period = Column(String, nullable=False)  # hourly, daily, weekly
    timestamp = Column(DateTime, index=True, nullable=False)
    
    # Aggregated metrics
    avg_sentiment = Column(Float)
    mention_count = Column(Integer, default=0)
    positive_count = Column(Integer, default=0)
    negative_count = Column(Integer, default=0)
    neutral_count = Column(Integer, default=0)
    
    # Trending metrics
    trending_score = Column(Float)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    def __repr__(self):
        return f"<SentimentAggregate(ticker={self.ticker}, period={self.period}, avg={self.avg_sentiment})>"
