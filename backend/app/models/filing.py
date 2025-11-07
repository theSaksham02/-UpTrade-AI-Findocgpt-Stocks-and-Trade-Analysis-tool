"""Filing models for regulatory documents."""
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text, JSON

from app.database import Base


class Filing(Base):
    """Regulatory filing model (SEC/SEDAR/ESMA)."""
    
    __tablename__ = "filings"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Company information
    company_name = Column(String, nullable=False)
    ticker = Column(String, index=True)
    
    # Filing information
    filing_type = Column(String, index=True, nullable=False)  # 10-K, 10-Q, 8-K, etc.
    filing_date = Column(DateTime, index=True, nullable=False)
    source = Column(String, nullable=False)  # SEC, SEDAR, ESMA
    
    # Content
    content = Column(Text)
    url = Column(String)
    
    # Metadata
    metadata = Column(JSON, default=dict)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    def __repr__(self):
        return f"<Filing(id={self.id}, ticker={self.ticker}, type={self.filing_type}, date={self.filing_date})>"
