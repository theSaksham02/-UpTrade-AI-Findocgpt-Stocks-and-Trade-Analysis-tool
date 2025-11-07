"""SEC EDGAR filing service for regulatory document retrieval."""
from typing import List, Dict, Optional
from datetime import datetime, timedelta
from sec_edgar_downloader import Downloader
import os
import logging
import tempfile
import shutil

logger = logging.getLogger(__name__)


class FilingService:
    """Service for fetching SEC EDGAR filings."""
    
    def __init__(self):
        """Initialize filing service."""
        self.temp_dir = tempfile.mkdtemp(prefix="sec_filings_")
        # SEC downloader will be initialized on first use (lazy loading)
        self._downloader = None
    
    @property
    def downloader(self):
        """Lazy-load the SEC downloader."""
        if self._downloader is None:
            try:
                # SEC requires company name and email for downloads
                self._downloader = Downloader("UpTrade AI", "contact@uptrade.ai", self.temp_dir)
            except Exception as e:
                logger.error(f"Error initializing SEC downloader: {e}")
                # Return a mock downloader if initialization fails
                self._downloader = None
        return self._downloader
    
    def __del__(self):
        """Cleanup temporary directory."""
        try:
            if os.path.exists(self.temp_dir):
                shutil.rmtree(self.temp_dir)
        except Exception as e:
            logger.error(f"Error cleaning up temp directory: {e}")
    
    async def get_latest_filings(
        self, 
        ticker: str, 
        filing_type: str = "10-K", 
        limit: int = 5
    ) -> List[Dict]:
        """
        Get latest SEC filings for a company.
        
        Args:
            ticker: Stock ticker symbol
            filing_type: Type of filing (10-K, 10-Q, 8-K, etc.)
            limit: Maximum number of filings to retrieve
            
        Returns:
            List[Dict]: Filing information
        """
        try:
            # Download filings
            if self.downloader is None:
                logger.warning("SEC downloader not available, using mock data")
                return self._get_mock_filings(ticker, filing_type, limit)
            
            num_downloaded = self.downloader.get(filing_type, ticker.upper(), limit=limit)
            
            if num_downloaded == 0:
                logger.warning(f"No {filing_type} filings found for {ticker}")
                return self._get_mock_filings(ticker, filing_type, limit)
            
            # Parse downloaded filings
            filings = []
            filing_dir = os.path.join(
                self.temp_dir, 
                "sec-edgar-filings", 
                ticker.upper(), 
                filing_type
            )
            
            if not os.path.exists(filing_dir):
                return self._get_mock_filings(ticker, filing_type, limit)
            
            # List all filing subdirectories
            filing_subdirs = [
                d for d in os.listdir(filing_dir) 
                if os.path.isdir(os.path.join(filing_dir, d))
            ]
            
            for subdir in filing_subdirs[:limit]:
                filing_path = os.path.join(filing_dir, subdir)
                
                # Find the filing document
                filing_files = [
                    f for f in os.listdir(filing_path) 
                    if f.endswith('.txt') or f.endswith('.html')
                ]
                
                if not filing_files:
                    continue
                
                filing_file = os.path.join(filing_path, filing_files[0])
                
                # Read first 1000 characters as preview
                try:
                    with open(filing_file, 'r', encoding='utf-8', errors='ignore') as f:
                        content_preview = f.read(1000)
                except Exception as e:
                    logger.error(f"Error reading filing file: {e}")
                    content_preview = ""
                
                # Parse date from directory name (format: accession-number-date)
                try:
                    date_str = subdir.split('-')[-3:]  # Last 3 parts are date
                    filing_date = datetime.strptime(''.join(date_str), '%Y%m%d')
                except Exception:
                    filing_date = datetime.utcnow()
                
                filings.append({
                    "id": len(filings) + 1,
                    "company_name": ticker.upper(),
                    "ticker": ticker.upper(),
                    "filing_type": filing_type,
                    "filing_date": filing_date,
                    "accession_number": subdir,
                    "source": "SEC EDGAR",
                    "url": f"https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK={ticker}&type={filing_type}",
                    "content_preview": content_preview,
                    "file_path": filing_file
                })
            
            return filings if filings else self._get_mock_filings(ticker, filing_type, limit)
        
        except Exception as e:
            logger.error(f"Error fetching filings for {ticker}: {e}")
            return self._get_mock_filings(ticker, filing_type, limit)
    
    async def search_filings(
        self,
        ticker: Optional[str] = None,
        filing_type: Optional[str] = None,
        date_from: Optional[datetime] = None,
        date_to: Optional[datetime] = None,
        limit: int = 10
    ) -> List[Dict]:
        """
        Search SEC filings with filters.
        
        Args:
            ticker: Stock ticker (optional)
            filing_type: Type of filing (optional)
            date_from: Start date (optional)
            date_to: End date (optional)
            limit: Maximum results
            
        Returns:
            List[Dict]: Matching filings
        """
        if ticker and filing_type:
            filings = await self.get_latest_filings(ticker, filing_type, limit)
        elif ticker:
            # Get multiple filing types for the ticker
            all_filings = []
            for ftype in ["10-K", "10-Q", "8-K"]:
                filings = await self.get_latest_filings(ticker, ftype, limit=3)
                all_filings.extend(filings)
            filings = all_filings[:limit]
        else:
            # Return mock data for broad searches
            filings = self._get_mock_filings("SPY", "10-K", limit)
        
        # Apply date filters
        if date_from:
            filings = [f for f in filings if f["filing_date"] >= date_from]
        if date_to:
            filings = [f for f in filings if f["filing_date"] <= date_to]
        
        return filings[:limit]
    
    async def get_filing_by_id(self, filing_id: int) -> Optional[Dict]:
        """
        Get a specific filing by ID.
        
        Args:
            filing_id: Filing ID
            
        Returns:
            dict: Filing details or None
        """
        # This is a simplified implementation
        # In a real system, you'd store filings in a database
        mock_filings = self._get_mock_filings("AAPL", "10-K", 10)
        
        for filing in mock_filings:
            if filing["id"] == filing_id:
                return filing
        
        return None
    
    async def analyze_filing_sentiment(self, filing_id: int) -> Dict:
        """
        Analyze sentiment of a filing document.
        
        Args:
            filing_id: Filing ID
            
        Returns:
            dict: Sentiment analysis results
        """
        filing = await self.get_filing_by_id(filing_id)
        
        if not filing:
            return {"error": "Filing not found"}
        
        # Simplified sentiment analysis
        # In a real implementation, use NLP on the full document
        content = filing.get("content_preview", "")
        
        positive_words = ["growth", "increase", "profit", "success", "strong", "improve"]
        negative_words = ["loss", "decline", "decrease", "risk", "weak", "concern"]
        
        positive_count = sum(content.lower().count(word) for word in positive_words)
        negative_count = sum(content.lower().count(word) for word in negative_words)
        
        total = positive_count + negative_count
        if total == 0:
            sentiment_score = 0.0
        else:
            sentiment_score = (positive_count - negative_count) / total
        
        return {
            "filing_id": filing_id,
            "ticker": filing["ticker"],
            "filing_type": filing["filing_type"],
            "sentiment_score": sentiment_score,
            "sentiment": "positive" if sentiment_score > 0.2 else "negative" if sentiment_score < -0.2 else "neutral",
            "positive_mentions": positive_count,
            "negative_mentions": negative_count,
            "analyzed_at": datetime.utcnow()
        }
    
    def _get_mock_filings(self, ticker: str, filing_type: str, limit: int) -> List[Dict]:
        """Generate mock filings as fallback."""
        filings = []
        base_date = datetime.utcnow()
        
        for i in range(limit):
            filing_date = base_date - timedelta(days=90 * i)
            
            filings.append({
                "id": i + 1,
                "company_name": f"{ticker.upper()} Inc.",
                "ticker": ticker.upper(),
                "filing_type": filing_type,
                "filing_date": filing_date,
                "accession_number": f"0001234567-{filing_date.year}-{i+1:06d}",
                "source": "SEC EDGAR (Mock)",
                "url": f"https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK={ticker}&type={filing_type}",
                "content_preview": f"Mock {filing_type} filing for {ticker}. This is sample content for demonstration purposes.",
                "file_path": None
            })
        
        return filings


# Global service instance
filing_service = FilingService()
