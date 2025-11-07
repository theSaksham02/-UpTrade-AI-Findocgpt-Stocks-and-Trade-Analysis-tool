"""Sentiment analysis Pydantic schemas."""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class SentimentResponse(BaseModel):
    """Sentiment analysis response schema."""
    ticker: str
    avg_sentiment: float = Field(..., ge=-1, le=1)
    mention_count: int
    positive_count: int
    negative_count: int
    neutral_count: int
    trending_score: Optional[float] = None
    period: str
    timestamp: datetime


class SocialMentionResponse(BaseModel):
    """Social media mention response schema."""
    id: int
    platform: str
    ticker: str
    content: str
    author: Optional[str] = None
    url: Optional[str] = None
    upvotes: int
    comments: int
    sentiment_score: Optional[float] = None
    sentiment_label: Optional[str] = None
    posted_at: datetime
    
    class Config:
        from_attributes = True


class TrendingStockResponse(BaseModel):
    """Trending stock response schema."""
    ticker: str
    mention_count: int
    avg_sentiment: float
    trending_score: float
    change_24h: Optional[float] = None
