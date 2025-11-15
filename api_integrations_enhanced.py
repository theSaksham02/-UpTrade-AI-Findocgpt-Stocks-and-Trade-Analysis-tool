"""
Enhanced External API Integrations for UpTrade AI
Comprehensive integration with multiple data sources
"""

import requests
import os
from typing import List, Dict, Any, Optional
import logging
from datetime import datetime, timedelta
from functools import lru_cache
import time
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class EnhancedAPIManager:
    """Manages external API integrations with rate limiting, caching, and failover"""
    
    def __init__(self):
        # Market Data API Keys
        self.alpha_vantage_key = os.getenv('ALPHA_VANTAGE_KEY', 'demo')
        self.finnhub_key = os.getenv('FINNHUB_KEY', '')
        self.polygon_key = os.getenv('POLYGON_API_KEY', '')
        
        # News API Keys
        self.news_api_key = os.getenv('NEWS_API_KEY', '')
        self.newsdata_key = os.getenv('NEWSDATA_API_KEY', '')
        self.marketaux_key = os.getenv('MARKETAUX_API_KEY', '')
        
        # Rate limiting
        self.last_request_time = {}
        self.min_request_interval = 1  # seconds between requests
        
        # Cache for API responses
        self.cache = {}
        self.cache_ttl = 300  # 5 minutes cache
        
        logger.info("🔌 Enhanced API Manager initialized with multiple data sources")
        self._log_api_status()
    
    def _log_api_status(self):
        """Log which APIs are configured"""
        logger.info("📊 API Configuration Status:")
        logger.info(f"  Alpha Vantage: {'✅ Configured' if self.alpha_vantage_key and self.alpha_vantage_key != 'demo' else '❌ Missing'}")
        logger.info(f"  Finnhub: {'✅ Configured' if self.finnhub_key else '❌ Missing'}")
        logger.info(f"  Polygon: {'✅ Configured' if self.polygon_key else '❌ Missing'}")
        logger.info(f"  NewsAPI: {'✅ Configured' if self.news_api_key else '❌ Missing'}")
        logger.info(f"  NewsData: {'✅ Configured' if self.newsdata_key else '❌ Missing'}")
        logger.info(f"  Marketaux: {'✅ Configured' if self.marketaux_key else '❌ Missing'}")
    
    def _get_cache_key(self, prefix: str, params: Dict) -> str:
        """Generate cache key from prefix and parameters"""
        param_str = '_'.join(f"{k}={v}" for k, v in sorted(params.items()))
        return f"{prefix}_{param_str}"
    
    def _get_from_cache(self, cache_key: str) -> Optional[Any]:
        """Get data from cache if not expired"""
        if cache_key in self.cache:
            data, timestamp = self.cache[cache_key]
            if time.time() - timestamp < self.cache_ttl:
                logger.info(f"📦 Cache hit: {cache_key}")
                return data
            else:
                del self.cache[cache_key]
        return None
    
    def _set_cache(self, cache_key: str, data: Any):
        """Store data in cache with timestamp"""
        self.cache[cache_key] = (data, time.time())
    
    def _rate_limit(self, api_name: str):
        """Simple rate limiting"""
        if api_name in self.last_request_time:
            elapsed = time.time() - self.last_request_time[api_name]
            if elapsed < self.min_request_interval:
                time.sleep(self.min_request_interval - elapsed)
        self.last_request_time[api_name] = time.time()
    
    # ========================================================================
    # STOCK DATA METHODS
    # ========================================================================
    
    def get_stock_quote(self, symbol: str) -> Dict[str, Any]:
        """
        Get real-time stock quote with failover across multiple APIs
        Priority: Finnhub -> Alpha Vantage -> Polygon
        """
        cache_key = self._get_cache_key('stock_quote', {'symbol': symbol})
        cached = self._get_from_cache(cache_key)
        if cached:
            return cached
        
        # Try Finnhub first (best for real-time data)
        if self.finnhub_key:
            quote = self._get_finnhub_quote(symbol)
            if quote:
                self._set_cache(cache_key, quote)
                return quote
        
        # Fallback to Alpha Vantage
        if self.alpha_vantage_key:
            quote = self._get_alphavantage_quote(symbol)
            if quote:
                self._set_cache(cache_key, quote)
                return quote
        
        # Fallback to Polygon
        if self.polygon_key:
            quote = self._get_polygon_quote(symbol)
            if quote:
                self._set_cache(cache_key, quote)
                return quote
        
        # NO MOCK DATA - Return error if all APIs fail
        raise Exception(f"No stock data available for {symbol}. Please configure Alpha Vantage, Finnhub, or Polygon API keys.")
    
    def _get_finnhub_quote(self, symbol: str) -> Optional[Dict[str, Any]]:
        """Get stock quote from Finnhub"""
        try:
            self._rate_limit('finnhub')
            url = 'https://finnhub.io/api/v1/quote'
            params = {'symbol': symbol, 'token': self.finnhub_key}
            
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            if data.get('c'):  # current price exists
                return {
                    'symbol': symbol,
                    'price': float(data.get('c', 0)),
                    'change': float(data.get('d', 0)),
                    'change_percent': f"{data.get('dp', 0):.2f}%",
                    'high': float(data.get('h', 0)),
                    'low': float(data.get('l', 0)),
                    'open': float(data.get('o', 0)),
                    'previous_close': float(data.get('pc', 0)),
                    'timestamp': datetime.fromtimestamp(data.get('t', time.time())).strftime('%Y-%m-%d %H:%M:%S'),
                    'source': 'Finnhub'
                }
        except Exception as e:
            logger.error(f"❌ Finnhub error for {symbol}: {e}")
        return None
    
    def _get_alphavantage_quote(self, symbol: str) -> Optional[Dict[str, Any]]:
        """Get stock quote from Alpha Vantage"""
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
            
            if 'Global Quote' in data and data['Global Quote']:
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
                    'previous_close': float(quote.get('08. previous close', 0)),
                    'source': 'Alpha Vantage'
                }
        except Exception as e:
            logger.error(f"❌ Alpha Vantage error for {symbol}: {e}")
        return None
    
    def _get_polygon_quote(self, symbol: str) -> Optional[Dict[str, Any]]:
        """Get stock quote from Polygon"""
        try:
            self._rate_limit('polygon')
            url = f'https://api.polygon.io/v2/aggs/ticker/{symbol}/prev'
            params = {'apiKey': self.polygon_key}
            
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            if data.get('results') and len(data['results']) > 0:
                result = data['results'][0]
                return {
                    'symbol': symbol,
                    'price': float(result.get('c', 0)),
                    'change': float(result.get('c', 0)) - float(result.get('o', 0)),
                    'change_percent': f"{((result.get('c', 0) - result.get('o', 0)) / result.get('o', 1)) * 100:.2f}%",
                    'open': float(result.get('o', 0)),
                    'high': float(result.get('h', 0)),
                    'low': float(result.get('l', 0)),
                    'volume': int(result.get('v', 0)),
                    'source': 'Polygon'
                }
        except Exception as e:
            logger.error(f"❌ Polygon error for {symbol}: {e}")
        return None
    
    def get_company_overview(self, symbol: str) -> Dict[str, Any]:
        """Get company overview and fundamentals"""
        cache_key = self._get_cache_key('company_overview', {'symbol': symbol})
        cached = self._get_from_cache(cache_key)
        if cached:
            return cached
        
        # Try Finnhub first
        if self.finnhub_key:
            overview = self._get_finnhub_company(symbol)
            if overview:
                self._set_cache(cache_key, overview)
                return overview
        
        # Fallback to Alpha Vantage
        if self.alpha_vantage_key and self.alpha_vantage_key != 'demo':
            overview = self._get_alphavantage_company(symbol)
            if overview:
                self._set_cache(cache_key, overview)
                return overview
        
        # NO MOCK DATA - Raise error if all APIs fail
        raise Exception(f"No company data available for {symbol}. Please configure Finnhub or Alpha Vantage API keys.")
    
    def _get_finnhub_company(self, symbol: str) -> Optional[Dict[str, Any]]:
        """Get company info from Finnhub"""
        try:
            self._rate_limit('finnhub')
            url = 'https://finnhub.io/api/v1/stock/profile2'
            params = {'symbol': symbol, 'token': self.finnhub_key}
            
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            if data and 'name' in data:
                return {
                    'symbol': symbol,
                    'name': data.get('name', ''),
                    'description': data.get('description', ''),
                    'country': data.get('country', ''),
                    'currency': data.get('currency', ''),
                    'exchange': data.get('exchange', ''),
                    'industry': data.get('finnhubIndustry', ''),
                    'market_cap': data.get('marketCapitalization', 0),
                    'ipo': data.get('ipo', ''),
                    'logo': data.get('logo', ''),
                    'weburl': data.get('weburl', ''),
                    'source': 'Finnhub'
                }
        except Exception as e:
            logger.error(f"❌ Finnhub company error for {symbol}: {e}")
        return None
    
    def _get_alphavantage_company(self, symbol: str) -> Optional[Dict[str, Any]]:
        """Get company overview from Alpha Vantage"""
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
                    '52_week_low': data.get('52WeekLow', ''),
                    'source': 'Alpha Vantage'
                }
        except Exception as e:
            logger.error(f"❌ Alpha Vantage company error for {symbol}: {e}")
        return None
    
    # ========================================================================
    # NEWS METHODS
    # ========================================================================
    
    def get_financial_news(self, query: str = "stock market", limit: int = 20) -> List[Dict[str, Any]]:
        """
        Fetch financial news from multiple sources with aggregation
        """
        cache_key = self._get_cache_key('news', {'query': query, 'limit': str(limit)})
        cached = self._get_from_cache(cache_key)
        if cached:
            return cached
        
        all_articles = []
        
        # Get news from all available sources
        if self.marketaux_key:
            articles = self._get_marketaux_news(query, limit // 3)
            all_articles.extend(articles)
        
        if self.news_api_key:
            articles = self._get_newsapi_news(query, limit // 3)
            all_articles.extend(articles)
        
        if self.newsdata_key:
            articles = self._get_newsdata_news(query, limit // 3)
            all_articles.extend(articles)
        
        # NO MOCK DATA - Return empty if all news APIs fail
        if not all_articles:
            logger.warning(f"⚠️ No news articles found for '{query}' - all news APIs returned empty")
            return []
        
        # Sort by date and limit
        all_articles.sort(key=lambda x: x.get('published_at', ''), reverse=True)
        result = all_articles[:limit]
        
        self._set_cache(cache_key, result)
        return result
    
    def _get_marketaux_news(self, query: str, limit: int) -> List[Dict[str, Any]]:
        """Get news from Marketaux"""
        try:
            self._rate_limit('marketaux')
            url = 'https://api.marketaux.com/v1/news/all'
            params = {
                'api_token': self.marketaux_key,
                'symbols': query if len(query) <= 10 else '',
                'filter_entities': 'true',
                'language': 'en',
                'limit': limit
            }
            
            response = requests.get(url, params=params, timeout=15)
            response.raise_for_status()
            data = response.json()
            
            articles = []
            for article in data.get('data', []):
                articles.append({
                    'title': article.get('title', ''),
                    'description': article.get('description', ''),
                    'content': article.get('snippet', ''),
                    'source': article.get('source', ''),
                    'url': article.get('url', ''),
                    'published_at': article.get('published_at', ''),
                    'image_url': article.get('image_url', ''),
                    'sentiment': article.get('entities', [{}])[0].get('sentiment_score', 0) if article.get('entities') else None,
                    'api_source': 'Marketaux'
                })
            
            logger.info(f"✅ Fetched {len(articles)} articles from Marketaux")
            return articles
            
        except Exception as e:
            logger.error(f"❌ Marketaux error: {e}")
            return []
    
    def _get_newsapi_news(self, query: str, limit: int) -> List[Dict[str, Any]]:
        """Get news from NewsAPI"""
        try:
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
            
            articles = []
            for article in data.get('articles', []):
                articles.append({
                    'title': article.get('title', ''),
                    'description': article.get('description', ''),
                    'content': article.get('content', ''),
                    'source': article.get('source', {}).get('name', ''),
                    'url': article.get('url', ''),
                    'published_at': article.get('publishedAt', ''),
                    'image_url': article.get('urlToImage', ''),
                    'api_source': 'NewsAPI'
                })
            
            logger.info(f"✅ Fetched {len(articles)} articles from NewsAPI")
            return articles
            
        except Exception as e:
            logger.error(f"❌ NewsAPI error: {e}")
            return []
    
    def _get_newsdata_news(self, query: str, limit: int) -> List[Dict[str, Any]]:
        """Get news from NewsData.io"""
        try:
            self._rate_limit('newsdata')
            url = 'https://newsdata.io/api/1/news'
            params = {
                'apikey': self.newsdata_key,
                'q': query,
                'language': 'en',
                'category': 'business'
            }
            
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            articles = []
            for article in data.get('results', [])[:limit]:
                articles.append({
                    'title': article.get('title', ''),
                    'description': article.get('description', ''),
                    'content': article.get('content', ''),
                    'source': article.get('source_id', ''),
                    'url': article.get('link', ''),
                    'published_at': article.get('pubDate', ''),
                    'image_url': article.get('image_url', ''),
                    'api_source': 'NewsData'
                })
            
            logger.info(f"✅ Fetched {len(articles)} articles from NewsData")
            return articles
            
        except Exception as e:
            logger.error(f"❌ NewsData error: {e}")
            return []
    
    def get_stock_news(self, symbol: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Get news specific to a stock symbol"""
        if self.finnhub_key:
            return self._get_finnhub_news(symbol, limit)
        return self.get_financial_news(query=symbol, limit=limit)
    
    def _get_finnhub_news(self, symbol: str, limit: int) -> List[Dict[str, Any]]:
        """Get company news from Finnhub"""
        try:
            self._rate_limit('finnhub')
            # Get news from last 7 days
            end_date = datetime.now()
            start_date = end_date - timedelta(days=7)
            
            url = 'https://finnhub.io/api/v1/company-news'
            params = {
                'symbol': symbol,
                'from': start_date.strftime('%Y-%m-%d'),
                'to': end_date.strftime('%Y-%m-%d'),
                'token': self.finnhub_key
            }
            
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            articles = []
            for article in data[:limit]:
                articles.append({
                    'title': article.get('headline', ''),
                    'description': article.get('summary', ''),
                    'content': article.get('summary', ''),
                    'source': article.get('source', ''),
                    'url': article.get('url', ''),
                    'published_at': datetime.fromtimestamp(article.get('datetime', 0)).isoformat(),
                    'image_url': article.get('image', ''),
                    'api_source': 'Finnhub'
                })
            
            logger.info(f"✅ Fetched {len(articles)} articles for {symbol} from Finnhub")
            return articles
            
        except Exception as e:
            logger.error(f"❌ Finnhub news error for {symbol}: {e}")
            return []
    
    # ========================================================================
    # MOCK DATA METHODS (Fallback)
    # ========================================================================
    
    # ========================================================================
    # HISTORICAL DATA METHODS (Multi-API Support)
    # ========================================================================
    
    def get_historical_data(self, symbol: str, period: str = '1M') -> Dict[str, Any]:
        """
        Get historical OHLCV data with multi-API failover
        Priority: Alpha Vantage -> Polygon -> Finnhub
        
        Periods: 1D, 1W, 1M, 3M, 6M, 1Y, 5Y, 10Y, YTD
        """
        cache_key = self._get_cache_key('historical', {'symbol': symbol, 'period': period})
        cached = self._get_from_cache(cache_key)
        if cached:
            return cached
        
        # Try Alpha Vantage first (best for historical data)
        if self.alpha_vantage_key and self.alpha_vantage_key != 'demo':
            data = self._get_alphavantage_historical(symbol, period)
            if data:
                self._set_cache(cache_key, data)
                return data
        
        # Fallback to Polygon
        if self.polygon_key:
            data = self._get_polygon_historical(symbol, period)
            if data:
                self._set_cache(cache_key, data)
                return data
        
        # Fallback to Finnhub
        if self.finnhub_key:
            data = self._get_finnhub_historical(symbol, period)
            if data:
                self._set_cache(cache_key, data)
                return data
        
        raise Exception(f"No historical data available for {symbol}. Please configure Alpha Vantage, Polygon, or Finnhub API keys.")
    
    def _get_alphavantage_historical(self, symbol: str, period: str) -> Optional[Dict[str, Any]]:
        """Get historical data from Alpha Vantage"""
        try:
            self._rate_limit('alphavantage')
            
            # Determine function based on period
            if period in ['1D', '1W']:
                function = 'TIME_SERIES_INTRADAY'
                interval = '5min'
            else:
                function = 'TIME_SERIES_DAILY'
                interval = None
            
            url = 'https://www.alphavantage.co/query'
            params = {
                'function': function,
                'symbol': symbol,
                'apikey': self.alpha_vantage_key,
                'outputsize': 'full' if period in ['5Y', '10Y'] else 'compact'
            }
            
            if interval:
                params['interval'] = interval
            
            response = requests.get(url, params=params, timeout=15)
            response.raise_for_status()
            data = response.json()
            
            # Parse the time series data
            time_series_key = next((k for k in data.keys() if 'Time Series' in k), None)
            if not time_series_key:
                return None
            
            time_series = data[time_series_key]
            historical_data = []
            
            for date_str, values in time_series.items():
                historical_data.append({
                    'date': date_str,
                    'open': float(values.get('1. open', 0)),
                    'high': float(values.get('2. high', 0)),
                    'low': float(values.get('3. low', 0)),
                    'close': float(values.get('4. close', 0)),
                    'volume': int(values.get('5. volume', 0))
                })
            
            # Filter by period
            historical_data = self._filter_by_period(historical_data, period)
            
            logger.info(f"✅ Fetched {len(historical_data)} historical data points for {symbol} from Alpha Vantage")
            return {
                'symbol': symbol,
                'period': period,
                'data': historical_data,
                'source': 'Alpha Vantage'
            }
            
        except Exception as e:
            logger.error(f"❌ Alpha Vantage historical error for {symbol}: {e}")
            return None
    
    def _get_polygon_historical(self, symbol: str, period: str) -> Optional[Dict[str, Any]]:
        """Get historical data from Polygon"""
        try:
            self._rate_limit('polygon')
            
            # Calculate date range based on period
            end_date = datetime.now()
            period_map = {
                '1D': 1, '1W': 7, '1M': 30, '3M': 90,
                '6M': 180, '1Y': 365, '5Y': 1825, '10Y': 3650
            }
            days = period_map.get(period, 30)
            start_date = end_date - timedelta(days=days)
            
            url = f'https://api.polygon.io/v2/aggs/ticker/{symbol}/range/1/day/{start_date.strftime("%Y-%m-%d")}/{end_date.strftime("%Y-%m-%d")}'
            params = {
                'apiKey': self.polygon_key,
                'adjusted': 'true',
                'sort': 'asc'
            }
            
            response = requests.get(url, params=params, timeout=15)
            response.raise_for_status()
            data = response.json()
            
            if data.get('results'):
                historical_data = []
                for result in data['results']:
                    historical_data.append({
                        'date': datetime.fromtimestamp(result['t'] / 1000).strftime('%Y-%m-%d'),
                        'open': float(result.get('o', 0)),
                        'high': float(result.get('h', 0)),
                        'low': float(result.get('l', 0)),
                        'close': float(result.get('c', 0)),
                        'volume': int(result.get('v', 0))
                    })
                
                logger.info(f"✅ Fetched {len(historical_data)} historical data points for {symbol} from Polygon")
                return {
                    'symbol': symbol,
                    'period': period,
                    'data': historical_data,
                    'source': 'Polygon'
                }
        
        except Exception as e:
            logger.error(f"❌ Polygon historical error for {symbol}: {e}")
            return None
    
    def _get_finnhub_historical(self, symbol: str, period: str) -> Optional[Dict[str, Any]]:
        """Get historical data from Finnhub"""
        try:
            self._rate_limit('finnhub')
            
            # Calculate timestamps
            end_date = datetime.now()
            period_map = {
                '1D': 1, '1W': 7, '1M': 30, '3M': 90,
                '6M': 180, '1Y': 365, '5Y': 1825, '10Y': 3650
            }
            days = period_map.get(period, 30)
            start_date = end_date - timedelta(days=days)
            
            url = 'https://finnhub.io/api/v1/stock/candle'
            params = {
                'symbol': symbol,
                'resolution': 'D',
                'from': int(start_date.timestamp()),
                'to': int(end_date.timestamp()),
                'token': self.finnhub_key
            }
            
            response = requests.get(url, params=params, timeout=15)
            response.raise_for_status()
            data = response.json()
            
            if data.get('s') == 'ok' and data.get('t'):
                historical_data = []
                for i in range(len(data['t'])):
                    historical_data.append({
                        'date': datetime.fromtimestamp(data['t'][i]).strftime('%Y-%m-%d'),
                        'open': float(data['o'][i]),
                        'high': float(data['h'][i]),
                        'low': float(data['l'][i]),
                        'close': float(data['c'][i]),
                        'volume': int(data['v'][i])
                    })
                
                logger.info(f"✅ Fetched {len(historical_data)} historical data points for {symbol} from Finnhub")
                return {
                    'symbol': symbol,
                    'period': period,
                    'data': historical_data,
                    'source': 'Finnhub'
                }
        
        except Exception as e:
            logger.error(f"❌ Finnhub historical error for {symbol}: {e}")
            return None
    
    def _filter_by_period(self, data: List[Dict], period: str) -> List[Dict]:
        """Filter historical data by period"""
        if not data:
            return []
        
        period_map = {
            '1D': 1, '1W': 7, '1M': 30, '3M': 90,
            '6M': 180, '1Y': 365, 'YTD': None, '5Y': 1825, '10Y': 3650
        }
        
        days = period_map.get(period)
        if days is None:  # YTD
            current_year = datetime.now().year
            return [d for d in data if datetime.strptime(d['date'].split()[0], '%Y-%m-%d').year == current_year]
        
        cutoff_date = datetime.now() - timedelta(days=days)
        return [d for d in data if datetime.strptime(d['date'].split()[0] if ' ' in d['date'] else d['date'], '%Y-%m-%d') >= cutoff_date]
    
    # ========================================================================
    # UTILITY METHODS
    # ========================================================================
    
    def get_api_health(self) -> Dict[str, Any]:
        """Get health status of all configured APIs"""
        return {
            'timestamp': datetime.now().isoformat(),
            'apis': {
                'alpha_vantage': {
                    'configured': bool(self.alpha_vantage_key and self.alpha_vantage_key != 'demo'),
                    'status': 'healthy' if self.alpha_vantage_key else 'not_configured'
                },
                'finnhub': {
                    'configured': bool(self.finnhub_key),
                    'status': 'healthy' if self.finnhub_key else 'not_configured'
                },
                'polygon': {
                    'configured': bool(self.polygon_key),
                    'status': 'healthy' if self.polygon_key else 'not_configured'
                },
                'newsapi': {
                    'configured': bool(self.news_api_key),
                    'status': 'healthy' if self.news_api_key else 'not_configured'
                },
                'newsdata': {
                    'configured': bool(self.newsdata_key),
                    'status': 'healthy' if self.newsdata_key else 'not_configured'
                },
                'marketaux': {
                    'configured': bool(self.marketaux_key),
                    'status': 'healthy' if self.marketaux_key else 'not_configured'
                }
            },
            'cache_size': len(self.cache)
        }


# Global instance
_enhanced_api_manager = None

def get_enhanced_api_manager() -> EnhancedAPIManager:
    """Get or create global enhanced API manager instance"""
    global _enhanced_api_manager
    if _enhanced_api_manager is None:
        _enhanced_api_manager = EnhancedAPIManager()
    return _enhanced_api_manager


# For backward compatibility
def get_api_manager() -> EnhancedAPIManager:
    """Alias for get_enhanced_api_manager"""
    return get_enhanced_api_manager()
