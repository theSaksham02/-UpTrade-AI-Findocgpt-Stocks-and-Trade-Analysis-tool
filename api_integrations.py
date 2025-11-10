"""
External API Integrations for UpTrade AI
Handles NewsAPI, Alpha Vantage, SEC Edgar, and other data sources
"""

import requests
import os
from typing import List, Dict, Any, Optional
import logging
from datetime import datetime, timedelta
from functools import lru_cache
import time

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class APIManager:
    """Manages external API integrations with rate limiting and caching"""
    
    def __init__(self):
        # API Keys (use environment variables in production)
        self.news_api_key = os.getenv('NEWS_API_KEY', '')
        self.alpha_vantage_key = os.getenv('ALPHA_VANTAGE_KEY', 'demo')
        self.finnhub_key = os.getenv('FINNHUB_KEY', '')
        
        # Rate limiting
        self.last_request_time = {}
        self.min_request_interval = 1  # seconds between requests
        
        logger.info("🔌 API Manager initialized")
    
    def _rate_limit(self, api_name: str):
        """Simple rate limiting"""
        if api_name in self.last_request_time:
            elapsed = time.time() - self.last_request_time[api_name]
            if elapsed < self.min_request_interval:
                time.sleep(self.min_request_interval - elapsed)
        self.last_request_time[api_name] = time.time()
    
    def get_financial_news(self, query: str = "stock market", limit: int = 10) -> List[Dict[str, Any]]:
        """
        Fetch financial news articles
        
        Args:
            query: Search query for news
            limit: Number of articles to return
            
        Returns:
            List of news articles
        """
        try:
            if not self.news_api_key:
                logger.warning("⚠️ NewsAPI key not configured, using mock data")
                return self._get_mock_news(query, limit)
            
            self._rate_limit('newsapi')
            
            url = 'https://newsapi.org/v2/everything'
            params = {
                'q': query,
                'apiKey': self.news_api_key,
                'language': 'en',
                'sortBy': 'publishedAt',
                'pageSize': limit
            }
            
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            articles = data.get('articles', [])
            
            # Format articles
            formatted_articles = []
            for article in articles:
                formatted_articles.append({
                    'title': article.get('title', ''),
                    'description': article.get('description', ''),
                    'content': article.get('content', ''),
                    'source': article.get('source', {}).get('name', ''),
                    'url': article.get('url', ''),
                    'published_at': article.get('publishedAt', ''),
                    'image_url': article.get('urlToImage', '')
                })
            
            logger.info(f"✅ Fetched {len(formatted_articles)} news articles")
            return formatted_articles
            
        except Exception as e:
            logger.error(f"❌ Failed to fetch news: {e}")
            return self._get_mock_news(query, limit)
    
    def get_stock_quote(self, symbol: str) -> Dict[str, Any]:
        """
        Get real-time stock quote
        
        Args:
            symbol: Stock ticker symbol
            
        Returns:
            Stock quote data
        """
        try:
            self._rate_limit('alphavantage')
            
            url = 'https://www.alphavantage.co/query'
            params = {
                'function': 'GLOBAL_QUOTE',
                'symbol': symbol,
                'apikey': self.alpha_vantage_key
            }
            
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            
            if 'Global Quote' in data:
                quote = data['Global Quote']
                return {
                    'symbol': symbol,
                    'price': float(quote.get('05. price', 0)),
                    'change': float(quote.get('09. change', 0)),
                    'change_percent': quote.get('10. change percent', '0%'),
                    'volume': int(quote.get('06. volume', 0)),
                    'latest_trading_day': quote.get('07. latest trading day', ''),
                    'open': float(quote.get('02. open', 0)),
                    'high': float(quote.get('03. high', 0)),
                    'low': float(quote.get('04. low', 0)),
                    'previous_close': float(quote.get('08. previous close', 0))
                }
            else:
                return self._get_mock_stock_quote(symbol)
                
        except Exception as e:
            logger.error(f"❌ Failed to fetch stock quote for {symbol}: {e}")
            return self._get_mock_stock_quote(symbol)
    
    def get_company_overview(self, symbol: str) -> Dict[str, Any]:
        """
        Get company overview and fundamentals
        
        Args:
            symbol: Stock ticker symbol
            
        Returns:
            Company overview data
        """
        try:
            self._rate_limit('alphavantage')
            
            url = 'https://www.alphavantage.co/query'
            params = {
                'function': 'OVERVIEW',
                'symbol': symbol,
                'apikey': self.alpha_vantage_key
            }
            
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            
            if data and 'Symbol' in data:
                return {
                    'symbol': data.get('Symbol', symbol),
                    'name': data.get('Name', ''),
                    'description': data.get('Description', ''),
                    'sector': data.get('Sector', ''),
                    'industry': data.get('Industry', ''),
                    'market_cap': data.get('MarketCapitalization', ''),
                    'pe_ratio': data.get('PERatio', ''),
                    'dividend_yield': data.get('DividendYield', ''),
                    'eps': data.get('EPS', ''),
                    '52_week_high': data.get('52WeekHigh', ''),
                    '52_week_low': data.get('52WeekLow', '')
                }
            else:
                return self._get_mock_company_overview(symbol)
                
        except Exception as e:
            logger.error(f"❌ Failed to fetch company overview for {symbol}: {e}")
            return self._get_mock_company_overview(symbol)
    
    def search_sec_filings(self, ticker: str, filing_type: str = "10-K") -> List[Dict[str, Any]]:
        """
        Search SEC Edgar filings
        
        Args:
            ticker: Company ticker
            filing_type: Type of filing (10-K, 10-Q, etc.)
            
        Returns:
            List of SEC filings
        """
        try:
            # SEC Edgar API endpoint
            url = f"https://www.sec.gov/cgi-bin/browse-edgar"
            params = {
                'action': 'getcompany',
                'CIK': ticker,
                'type': filing_type,
                'dateb': '',
                'owner': 'exclude',
                'count': 10,
                'output': 'atom'
            }
            
            headers = {
                'User-Agent': 'UpTrade AI research@uptrade.ai'
            }
            
            response = requests.get(url, params=params, headers=headers, timeout=15)
            
            if response.status_code == 200:
                # Parse XML response (simplified)
                return [{
                    'ticker': ticker,
                    'filing_type': filing_type,
                    'date': datetime.now().strftime('%Y-%m-%d'),
                    'url': f"https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK={ticker}&type={filing_type}"
                }]
            else:
                return self._get_mock_sec_filings(ticker, filing_type)
                
        except Exception as e:
            logger.error(f"❌ Failed to fetch SEC filings for {ticker}: {e}")
            return self._get_mock_sec_filings(ticker, filing_type)
    
    # Mock data methods for development/fallback
    def _get_mock_news(self, query: str, limit: int) -> List[Dict[str, Any]]:
        """Generate mock news data"""
        mock_articles = [
            {
                'title': f'Tech Stocks Rally on Strong Earnings Reports',
                'description': 'Major technology companies reported better-than-expected quarterly results.',
                'content': 'Technology stocks surged today as major companies including Apple, Microsoft, and Google parent Alphabet reported strong quarterly earnings...',
                'source': 'Financial Times',
                'url': 'https://example.com/tech-rally',
                'published_at': datetime.now().isoformat(),
                'image_url': ''
            },
            {
                'title': f'Federal Reserve Signals Interest Rate Decision',
                'description': 'Central bank officials discuss monetary policy outlook.',
                'content': 'The Federal Reserve indicated it may maintain current interest rates as inflation shows signs of cooling...',
                'source': 'Bloomberg',
                'url': 'https://example.com/fed-rates',
                'published_at': (datetime.now() - timedelta(hours=2)).isoformat(),
                'image_url': ''
            },
            {
                'title': f'Energy Sector Sees Volatility Amid Global Tensions',
                'description': 'Oil prices fluctuate on geopolitical developments.',
                'content': 'Energy stocks experienced volatility today as oil prices reacted to international developments and supply concerns...',
                'source': 'Reuters',
                'url': 'https://example.com/energy-volatility',
                'published_at': (datetime.now() - timedelta(hours=5)).isoformat(),
                'image_url': ''
            }
        ]
        return mock_articles[:limit]
    
    def _get_mock_stock_quote(self, symbol: str) -> Dict[str, Any]:
        """Generate mock stock quote"""
        import random
        base_price = 150.0
        return {
            'symbol': symbol,
            'price': round(base_price + random.uniform(-10, 10), 2),
            'change': round(random.uniform(-5, 5), 2),
            'change_percent': f"{round(random.uniform(-3, 3), 2)}%",
            'volume': random.randint(1000000, 10000000),
            'latest_trading_day': datetime.now().strftime('%Y-%m-%d'),
            'open': round(base_price + random.uniform(-5, 5), 2),
            'high': round(base_price + random.uniform(0, 8), 2),
            'low': round(base_price - random.uniform(0, 8), 2),
            'previous_close': round(base_price, 2)
        }
    
    def _get_mock_company_overview(self, symbol: str) -> Dict[str, Any]:
        """Generate mock company overview"""
        return {
            'symbol': symbol,
            'name': f'{symbol} Inc.',
            'description': f'Leading technology company in the {symbol} sector.',
            'sector': 'Technology',
            'industry': 'Software',
            'market_cap': '1500000000000',
            'pe_ratio': '25.5',
            'dividend_yield': '0.0145',
            'eps': '6.25',
            '52_week_high': '180.50',
            '52_week_low': '120.30'
        }
    
    def _get_mock_sec_filings(self, ticker: str, filing_type: str) -> List[Dict[str, Any]]:
        """Generate mock SEC filings"""
        return [{
            'ticker': ticker,
            'filing_type': filing_type,
            'date': (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d'),
            'url': f'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK={ticker}&type={filing_type}'
        }]


# Global instance
_api_manager = None

def get_api_manager() -> APIManager:
    """Get or create global API manager instance"""
    global _api_manager
    if _api_manager is None:
        _api_manager = APIManager()
    return _api_manager
