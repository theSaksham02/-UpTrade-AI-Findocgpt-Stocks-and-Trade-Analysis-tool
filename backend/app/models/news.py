"""News article models."""
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text, Float, ARRAY, JSON

from app.database import Base


class NewsArticle(Base):
    """News article model with sentiment analysis."""
    
    __tablename__ = "news_articles"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Article information
    title = Column(String, nullable=False)
    content = Column(Text)
    source = Column(String, index=True)
    url = Column(String, unique=True)
    published_at = Column(DateTime, index=True, nullable=False)
    
    # Sentiment analysis
    sentiment_score = Column(Float)  # -1 to 1
    sentiment_label = Column(String)  # positive, negative, neutral
    
    # Related tickers
    related_tickers = Column(ARRAY(String), default=list)
    
    # Named entities and metadata
    entities = Column(JSON, default=dict)
    extra_data = Column(JSON, default=dict)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    def __repr__(self):
        return f"<NewsArticle(id={self.id}, title={self.title[:50]}, source={self.source})>"
