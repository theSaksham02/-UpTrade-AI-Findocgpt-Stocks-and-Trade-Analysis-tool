"""Market data service for fetching stock prices and fundamentals."""
from typing import Optional, List
from datetime import datetime, timedelta
import yfinance as yf
from app.config import settings
from app.core.logging import logger


class MarketDataService:
    """Service for fetching market data from external APIs."""
    
    def __init__(self):
        """Initialize market data service."""
        self.cache = {}  # Simple in-memory cache
        self.cache_duration = 60  # Cache duration in seconds
    
    async def get_current_price(self, ticker: str) -> dict:
        """
        Get current stock price using yfinance.
        
        Args:
            ticker: Stock ticker symbol
            
        Returns:
            dict: Current price data
        """
        try:
            stock = yf.Ticker(ticker)
            info = stock.info
            history = stock.history(period="1d")
            
            if history.empty:
                logger.warning(f"No data found for ticker {ticker}")
                return self._get_mock_price(ticker)
            
            current_price = history['Close'].iloc[-1]
            previous_close = info.get('previousClose', current_price)
            change = current_price - previous_close
            change_percent = (change / previous_close * 100) if previous_close else 0
            
            return {
                "ticker": ticker,
                "price": float(current_price),
                "change": float(change),
                "change_percent": float(change_percent),
                "volume": int(history['Volume'].iloc[-1]) if not history.empty else 0,
                "timestamp": datetime.utcnow(),
                "open": float(history['Open'].iloc[-1]) if not history.empty else None,
                "high": float(history['High'].iloc[-1]) if not history.empty else None,
                "low": float(history['Low'].iloc[-1]) if not history.empty else None
            }
        except Exception as e:
            logger.error(f"Error fetching price for {ticker}: {e}")
            return self._get_mock_price(ticker)
    
    async def get_historical_prices(
        self,
        ticker: str,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        interval: str = "1d"
    ) -> List[dict]:
        """
        Get historical stock prices using yfinance.
        
        Args:
            ticker: Stock ticker symbol
            start_date: Start date for historical data
            end_date: End date for historical data
            interval: Data interval (1d, 1h, etc.)
            
        Returns:
            List[dict]: Historical price data
        """
        try:
            # Set default dates if not provided
            if not end_date:
                end_date = datetime.utcnow()
            if not start_date:
                start_date = end_date - timedelta(days=365)  # Default to 1 year
            
            stock = yf.Ticker(ticker)
            history = stock.history(start=start_date, end=end_date, interval=interval)
            
            if history.empty:
                logger.warning(f"No historical data found for ticker {ticker}")
                return [self._get_mock_price(ticker)]
            
            result = []
            for index, row in history.iterrows():
                result.append({
                    "ticker": ticker,
                    "timestamp": index.to_pydatetime(),
                    "open": float(row['Open']),
                    "high": float(row['High']),
                    "low": float(row['Low']),
                    "close": float(row['Close']),
                    "volume": int(row['Volume'])
                })
            
            return result
        except Exception as e:
            logger.error(f"Error fetching historical prices for {ticker}: {e}")
            return [self._get_mock_price(ticker)]
    
    async def get_fundamentals(self, ticker: str) -> dict:
        """
        Get company fundamental data using yfinance.
        
        Args:
            ticker: Stock ticker symbol
            
        Returns:
            dict: Company fundamentals
        """
        try:
            stock = yf.Ticker(ticker)
            info = stock.info
            
            return {
                "ticker": ticker,
                "company_name": info.get('longName', info.get('shortName', f"{ticker} Inc.")),
                "sector": info.get('sector', 'Unknown'),
                "industry": info.get('industry', 'Unknown'),
                "market_cap": info.get('marketCap', 0),
                "pe_ratio": info.get('trailingPE', None),
                "forward_pe": info.get('forwardPE', None),
                "eps": info.get('trailingEps', None),
                "dividend_yield": info.get('dividendYield', None),
                "beta": info.get('beta', None),
                "fifty_two_week_high": info.get('fiftyTwoWeekHigh', None),
                "fifty_two_week_low": info.get('fiftyTwoWeekLow', None),
                "average_volume": info.get('averageVolume', None),
                "description": info.get('longBusinessSummary', None)
            }
        except Exception as e:
            logger.error(f"Error fetching fundamentals for {ticker}: {e}")
            return self._get_mock_fundamentals(ticker)
    
    async def search_stocks(self, query: str) -> List[dict]:
        """
        Search for stocks by name or ticker.
        Note: yfinance doesn't have a search API, so this is a simple implementation
        
        Args:
            query: Search query
            
        Returns:
            List[dict]: Search results
        """
        # For a real implementation, you'd use a proper search API
        # This is a simplified version that just checks if the query is a valid ticker
        try:
            query_upper = query.upper()
            stock = yf.Ticker(query_upper)
            info = stock.info
            
            if info and info.get('longName'):
                return [{
                    "ticker": query_upper,
                    "company_name": info.get('longName', query_upper),
                    "sector": info.get('sector', 'Unknown'),
                    "market_cap": info.get('marketCap', 0)
                }]
            else:
                return []
        except Exception as e:
            logger.error(f"Error searching for {query}: {e}")
            return []
    
    def _get_mock_price(self, ticker: str) -> dict:
        """Fallback mock data when API fails."""
        return {
            "ticker": ticker,
            "price": 150.00,
            "change": 2.50,
            "change_percent": 1.69,
            "volume": 1000000,
            "timestamp": datetime.utcnow()
        }
    
    def _get_mock_fundamentals(self, ticker: str) -> dict:
        """Fallback mock fundamentals when API fails."""
        return {
            "ticker": ticker,
            "company_name": f"{ticker} Inc.",
            "sector": "Technology",
            "industry": "Software",
            "market_cap": 1000000000,
            "pe_ratio": 25.5,
            "eps": 5.88,
            "dividend_yield": 0.015,
            "beta": 1.2
        }


# Global service instance
market_data_service = MarketDataService()
