"""News-related Pydantic schemas."""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


class NewsArticleBase(BaseModel):
    """Base news article schema."""
    title: str
    content: Optional[str] = None
    source: str
    url: Optional[str] = None
    published_at: datetime
    sentiment_score: Optional[float] = Field(None, ge=-1, le=1)
    sentiment_label: Optional[str] = None
    related_tickers: List[str] = []
    entities: dict = {}
    metadata: dict = {}


class NewsArticleResponse(NewsArticleBase):
    """News article response schema."""
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class NewsSearchRequest(BaseModel):
    """News search request schema."""
    query: str
    tickers: Optional[List[str]] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    sources: Optional[List[str]] = None
    sentiment: Optional[str] = None
    limit: int = Field(default=20, le=100)


class NewsTrendingResponse(BaseModel):
    """Trending news response schema."""
    ticker: str
    mention_count: int
    avg_sentiment: float
    articles: List[NewsArticleResponse]
