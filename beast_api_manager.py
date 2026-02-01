"""
🦁 BEAST MODE API MANAGER - Ultimate Financial Intelligence System
Integrates 13+ APIs for comprehensive market analysis
"""

import requests
import os
from typing import List, Dict, Any, Optional, Union
import logging
from datetime import datetime, timedelta
from functools import lru_cache
import time
from dotenv import load_dotenv
import json
import random

# NLP imports for better conversation handling
try:
    from transformers import pipeline, AutoTokenizer, AutoModelForSeq2SeqLM
    NLP_AVAILABLE = True
except ImportError:
    NLP_AVAILABLE = False
    logging.warning("transformers not available, using fallback responses")

# Load environment variables
load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class BeastAPIManager:
    """
    🦁 BEAST MODE: Ultimate API Manager
    Integrates 13+ APIs for complete financial intelligence
    """
    
    def __init__(self):
        # Market Data APIs
        self.alpha_vantage_key = os.getenv('ALPHA_VANTAGE_KEY', '')
        self.finnhub_key = os.getenv('FINNHUB_KEY', '')
        self.polygon_key = os.getenv('POLYGON_API_KEY', '')
        self.fmp_key = os.getenv('FMP_API_KEY', '')
        
        # News APIs
        self.news_api_key = os.getenv('NEWS_API_KEY', '')
        self.newsdata_key = os.getenv('NEWSDATA_API_KEY', '')
        self.marketaux_key = os.getenv('MARKETAUX_API_KEY', '')
        
        # Economic & Alternative Data
        self.fred_key = os.getenv('FRED_API_KEY', '')
        self.exchangerate_key = os.getenv('EXCHANGERATE_API_KEY', '')
        
        # AI & NLP
        self.openai_key = os.getenv('OPENAI_API_KEY', '')
        self.huggingface_key = os.getenv('HUGGINGFACE_API_KEY', '')
        
        # Social Media
        self.twitter_key = os.getenv('TWITTER_API_KEY', '')
        self.twitter_secret = os.getenv('TWITTER_API_SECRET', '')
        
        # Rate limiting & caching
        self.last_request_time = {}
        self.min_request_interval = 0.5
        self.cache = {}
        self.cache_ttl = 300  # 5 minutes
        
        # Conversation context for better responses
        self.conversation_history = []
        self.max_history = 10
        
        # Initialize NLP models for fallback
        self.nlp_model = None
        if NLP_AVAILABLE:
            try:
                # Load a lightweight conversational model
                self.nlp_model = pipeline('text-generation', model='gpt2', max_length=200)
                logger.info("✅ NLP model loaded successfully")
            except Exception as e:
                logger.warning(f"⚠️ Could not load NLP model: {e}")
        
        logger.info("🦁 BEAST MODE API Manager initialized!")
        self._log_api_status()
    
    def _log_api_status(self):
        """Log configuration status of all APIs"""
        apis = {
            'Market Data': {
                'Alpha Vantage': bool(self.alpha_vantage_key),
                'Finnhub': bool(self.finnhub_key),
                'Polygon': bool(self.polygon_key),
                'FMP': bool(self.fmp_key)
            },
            'News': {
                'NewsAPI': bool(self.news_api_key),
                'NewsData': bool(self.newsdata_key),
                'Marketaux': bool(self.marketaux_key)
            },
            'Economic': {
                'FRED': bool(self.fred_key),
                'ExchangeRate': bool(self.exchangerate_key)
            },
            'AI': {
                'OpenAI': bool(self.openai_key),
                'HuggingFace': bool(self.huggingface_key)
            },
            'Social': {
                'Twitter': bool(self.twitter_key and self.twitter_secret)
            }
        }
        
        logger.info("📊 API Configuration:")
        for category, apis_dict in apis.items():
            configured = sum(1 for v in apis_dict.values() if v)
            total = len(apis_dict)
            logger.info(f"  {category}: {configured}/{total} configured")
    
    def _rate_limit(self, api_name: str):
        """Rate limiting for API calls"""
        if api_name in self.last_request_time:
            elapsed = time.time() - self.last_request_time[api_name]
            if elapsed < self.min_request_interval:
                time.sleep(self.min_request_interval - elapsed)
        self.last_request_time[api_name] = time.time()
    
    def _get_cache_key(self, prefix: str, params: Dict) -> str:
        """Generate cache key"""
        param_str = '_'.join(f"{k}={v}" for k, v in sorted(params.items()))
        return f"{prefix}_{param_str}"
    
    def _get_from_cache(self, cache_key: str) -> Optional[Any]:
        """Get from cache if not expired"""
        if cache_key in self.cache:
            data, timestamp = self.cache[cache_key]
            if time.time() - timestamp < self.cache_ttl:
                return data
            del self.cache[cache_key]
        return None
    
    def _set_cache(self, cache_key: str, data: Any):
        """Store in cache"""
        self.cache[cache_key] = (data, time.time())

    # ========================================================================
    # STOCK DATA METHODS (Integrated)
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
    # NEWS METHODS (Integrated)
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
    # ECONOMIC DATA - FRED API
    # ========================================================================
    
    def get_economic_indicator(self, series_id: str, limit: int = 100) -> Dict[str, Any]:
        """
        Get economic indicator from FRED
        
        Common series IDs:
        - GDP: Gross Domestic Product
        - UNRATE: Unemployment Rate
        - CPIAUCSL: Consumer Price Index
        - DFF: Federal Funds Rate
        - T10Y2Y: 10-Year Treasury Minus 2-Year
        """
        cache_key = self._get_cache_key('fred', {'series': series_id})
        cached = self._get_from_cache(cache_key)
        if cached:
            return cached
        
        try:
            self._rate_limit('fred')
            url = 'https://api.stlouisfed.org/fred/series/observations'
            params = {
                'series_id': series_id,
                'api_key': self.fred_key,
                'file_type': 'json',
                'limit': limit,
                'sort_order': 'desc'
            }
            
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            result = {
                'series_id': series_id,
                'observations': data.get('observations', []),
                'count': len(data.get('observations', [])),
                'source': 'FRED'
            }
            
            self._set_cache(cache_key, result)
            logger.info(f"✅ Fetched {series_id} from FRED")
            return result
            
        except Exception as e:
            logger.error(f"❌ FRED error for {series_id}: {e}")
            return {'series_id': series_id, 'observations': [], 'error': str(e)}
    
    def get_key_economic_indicators(self) -> Dict[str, Any]:
        """Get key economic indicators"""
        indicators = {
            'gdp': self.get_economic_indicator('GDP', limit=10),
            'unemployment': self.get_economic_indicator('UNRATE', limit=10),
            'inflation': self.get_economic_indicator('CPIAUCSL', limit=10),
            'fed_funds_rate': self.get_economic_indicator('DFF', limit=10),
            'yield_curve': self.get_economic_indicator('T10Y2Y', limit=10)
        }
        return indicators
    
    # ========================================================================
    # FOREX & CURRENCY - EXCHANGERATE API
    # ========================================================================
    
    def get_exchange_rates(self, base_currency: str = 'USD') -> Dict[str, Any]:
        """Get exchange rates for a base currency"""
        cache_key = self._get_cache_key('exchange', {'base': base_currency})
        cached = self._get_from_cache(cache_key)
        if cached:
            return cached
        
        try:
            self._rate_limit('exchangerate')
            url = f'https://v6.exchangerate-api.com/v6/{self.exchangerate_key}/latest/{base_currency}'
            
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            result = {
                'base': base_currency,
                'rates': data.get('conversion_rates', {}),
                'last_update': data.get('time_last_update_utc', ''),
                'source': 'ExchangeRate-API'
            }
            
            self._set_cache(cache_key, result)
            logger.info(f"✅ Fetched exchange rates for {base_currency}")
            return result
            
        except Exception as e:
            logger.error(f"❌ ExchangeRate error: {e}")
            return {'base': base_currency, 'rates': {}, 'error': str(e)}
    
    def convert_currency(self, amount: float, from_currency: str, to_currency: str) -> Dict[str, Any]:
        """Convert currency amounts"""
        rates = self.get_exchange_rates(from_currency)
        if 'error' not in rates and to_currency in rates['rates']:
            conversion_rate = rates['rates'][to_currency]
            converted_amount = amount * conversion_rate
            return {
                'original_amount': amount,
                'from_currency': from_currency,
                'to_currency': to_currency,
                'conversion_rate': conversion_rate,
                'converted_amount': converted_amount
            }
        return {'error': 'Currency conversion failed'}
    
    # ========================================================================
    # FINANCIAL MODELING PREP - Enhanced Stock Data
    # ========================================================================
    
    def get_company_financials(self, symbol: str, period: str = 'annual') -> Dict[str, Any]:
        """Get detailed financial statements from FMP"""
        cache_key = self._get_cache_key('fmp_financials', {'symbol': symbol, 'period': period})
        cached = self._get_from_cache(cache_key)
        if cached:
            return cached
        
        try:
            self._rate_limit('fmp')
            url = f'https://financialmodelingprep.com/api/v3/income-statement/{symbol}'
            params = {
                'period': period,
                'apikey': self.fmp_key,
                'limit': 5
            }
            
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            result = {
                'symbol': symbol,
                'financials': data,
                'period': period,
                'source': 'FMP'
            }
            
            self._set_cache(cache_key, result)
            logger.info(f"✅ Fetched financials for {symbol} from FMP")
            return result
            
        except Exception as e:
            logger.error(f"❌ FMP error for {symbol}: {e}")
            return {'symbol': symbol, 'financials': [], 'error': str(e)}
    
    def get_stock_rating(self, symbol: str) -> Dict[str, Any]:
        """Get analyst ratings and recommendations"""
        try:
            self._rate_limit('fmp')
            url = f'https://financialmodelingprep.com/api/v3/rating/{symbol}'
            params = {'apikey': self.fmp_key}
            
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            if data:
                return {
                    'symbol': symbol,
                    'rating': data[0].get('rating', 'N/A'),
                    'score': data[0].get('ratingScore', 0),
                    'recommendation': data[0].get('ratingRecommendation', 'N/A'),
                    'details': data[0],
                    'source': 'FMP'
                }
            
        except Exception as e:
            logger.error(f"❌ FMP rating error for {symbol}: {e}")
        
        return {'symbol': symbol, 'rating': 'N/A', 'error': 'Rating unavailable'}
    
    # ========================================================================
    # CRYPTO DATA - CoinGecko (Free, no key needed)
    # ========================================================================
    
    def get_crypto_prices(self, crypto_ids: List[str] = None) -> Dict[str, Any]:
        """Get cryptocurrency prices from CoinGecko"""
        if crypto_ids is None:
            crypto_ids = ['bitcoin', 'ethereum', 'binancecoin', 'cardano', 'solana']
        
        cache_key = self._get_cache_key('crypto', {'ids': ','.join(crypto_ids)})
        cached = self._get_from_cache(cache_key)
        if cached:
            return cached
        
        try:
            self._rate_limit('coingecko')
            url = 'https://api.coingecko.com/api/v3/simple/price'
            params = {
                'ids': ','.join(crypto_ids),
                'vs_currencies': 'usd',
                'include_24hr_change': 'true',
                'include_market_cap': 'true'
            }
            
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            result = {
                'crypto_data': data,
                'timestamp': datetime.now().isoformat(),
                'source': 'CoinGecko'
            }
            
            self._set_cache(cache_key, result)
            logger.info(f"✅ Fetched crypto prices for {len(crypto_ids)} coins")
            return result
            
        except Exception as e:
            logger.error(f"❌ CoinGecko error: {e}")
            return {'crypto_data': {}, 'error': str(e)}
    
    # ========================================================================
    # AI-POWERED ANALYSIS - OpenAI GPT
    # ========================================================================
    
    def analyze_with_gpt(self, prompt: str, model: str = "gpt-3.5-turbo") -> Dict[str, Any]:
        """Analyze financial data using OpenAI GPT with conversation context"""
        try:
            if not self.openai_key:
                raise ValueError("OpenAI API key not configured")
                
            self._rate_limit('openai')
            url = 'https://api.openai.com/v1/chat/completions'
            headers = {
                'Authorization': f'Bearer {self.openai_key}',
                'Content-Type': 'application/json'
            }
            
            # Build conversation context
            messages = [
                {
                    'role': 'system', 
                    'content': '''You are UpTrade AI, an expert financial analyst and market advisor. You provide:
                    
- Clear, actionable market insights
- Real-time stock analysis and recommendations
- Technical and fundamental analysis
- Risk assessment and portfolio advice
- Market sentiment and trend analysis

Respond conversationally like Claude or ChatGPT. Be helpful, informative, and professional.
Use emojis sparingly (📊 📈 📉 💡) to enhance readability.
Break down complex topics into easy-to-understand points.'''
                }
            ]
            
            # Add recent conversation history for context
            for hist in self.conversation_history[-6:]:
                messages.append(hist)
            
            # Add current user message
            messages.append({'role': 'user', 'content': prompt})
            
            data = {
                'model': model,
                'messages': messages,
                'max_tokens': 1000,
                'temperature': 0.8,
                'top_p': 0.9,
                'frequency_penalty': 0.3,
                'presence_penalty': 0.3
            }
            
            response = requests.post(url, headers=headers, json=data, timeout=30)
            response.raise_for_status()
            result = response.json()
            
            assistant_message = result['choices'][0]['message']['content']
            
            # Update conversation history
            self.conversation_history.append({'role': 'user', 'content': prompt})
            self.conversation_history.append({'role': 'assistant', 'content': assistant_message})
            
            # Keep only recent history
            if len(self.conversation_history) > self.max_history * 2:
                self.conversation_history = self.conversation_history[-self.max_history * 2:]
            
            analysis = {
                'prompt': prompt,
                'analysis': assistant_message,
                'message': assistant_message,  # For compatibility
                'model': model,
                'tokens_used': result['usage']['total_tokens'],
                'source': 'OpenAI GPT-3.5'
            }
            
            logger.info(f"✅ GPT analysis completed ({result['usage']['total_tokens']} tokens)")
            return analysis
            
        except Exception as e:
            logger.error(f"❌ OpenAI error: {e}")
            # Try intelligent fallback
            return self._generate_intelligent_fallback(prompt)
    
    def _generate_intelligent_fallback(self, prompt: str) -> Dict[str, Any]:
        """Generate intelligent fallback responses when APIs fail"""
        prompt_lower = prompt.lower()
        
        # Stock price queries
        if any(word in prompt_lower for word in ['price', 'quote', 'worth', 'trading at']):
            response = f"""📊 I can help you check stock prices!

To get real-time prices, I need to access market data APIs. Here's what I can do:

• **Real-time Quotes**: Get current prices for any US stock
• **Historical Data**: View price history and trends
• **Technical Analysis**: Moving averages, RSI, MACD, and more
• **Price Alerts**: Set notifications for price targets

💡 **Try asking:**
"What's the current price of AAPL?"
"Show me TSLA's performance this month"
"Compare prices of MSFT vs GOOGL"

I'm connected to multiple market data providers for accurate, real-time information!"""
        
        # Sentiment analysis
        elif any(word in prompt_lower for word in ['sentiment', 'feeling', 'opinion', 'buzz']):
            response = f"""📈 **Market Sentiment Analysis**

I analyze sentiment from multiple sources:

✅ **News Headlines**: Latest financial news and impact
📱 **Social Media**: Reddit, Twitter sentiment
💬 **Analyst Reports**: Professional opinions
📊 **Market Data**: Volume, volatility, trends

**Available Features:**
• Real-time sentiment scoring (-1 to +1)
• News aggregation from 20+ sources
• Social media buzz tracking
• Sentiment history and trends

💡 **Try:**
"Analyze sentiment for Tesla"
"What's the market feeling about tech stocks?"
"Show me positive sentiment stocks"""
        
        # Comparison queries
        elif any(word in prompt_lower for word in ['compare', 'vs', 'versus', 'difference between']):
            response = f"""📊 **Stock Comparison Tool**

I can compare multiple stocks across:

• **Fundamentals**: P/E, EPS, Revenue, Profit Margins
• **Technicals**: Moving Averages, RSI, Volume
• **Performance**: YTD, 1Y, 5Y returns
• **Risk Metrics**: Beta, Volatility, Sharpe Ratio
• **Valuation**: Market Cap, P/B, P/S ratios

**Features:**
📈 Side-by-side charts
📊 Detailed metrics tables
🎯 Performance rankings
💡 Investment recommendations

**Example:**
"Compare AAPL vs MSFT vs GOOGL"
"Which is better: Tesla or Rivian?"""
        
        # Market overview
        elif any(word in prompt_lower for word in ['market', 'overview', 'trending', 'today', 'movers']):
            response = f"""📈 **Market Overview Dashboard**

Here's what I track:

**📊 Major Indices:**
• S&P 500, Dow Jones, NASDAQ
• Real-time quotes and changes
• Sector performance

**🔥 Trending Stocks:**
• Most active by volume
• Top gainers and losers
• Breaking news movers

**🌍 Global Markets:**
• International indices
• Forex and commodities
• Crypto market overview

**📰 Market News:**
• Latest headlines
• Economic indicators
• Fed announcements

💡 Ask me: "What's moving the market today?" or "Show me top gainers"""
        
        # Forecasting
        elif any(word in prompt_lower for word in ['forecast', 'predict', 'future', 'will', 'going to']):
            response = f"""🎯 **AI-Powered Forecasting**

I use advanced models to predict:

**📈 Price Predictions:**
• 14-day forecasts with confidence intervals
• Support/resistance levels
• Trend analysis

**🤖 ML Models:**
• LSTM neural networks
• Random Forest regression
• ARIMA time series
• Ensemble predictions

**⚠️ Risk Analysis:**
• Volatility forecasts
• Downside protection
• Scenario modeling

**Important:** Predictions are based on historical data and current trends. Markets can be unpredictable!

💡 Try: "Forecast AAPL for next 2 weeks" or "Predict Tesla's price movement"""
        
        # Trading/investment advice
        elif any(word in prompt_lower for word in ['buy', 'sell', 'invest', 'trade', 'should i', 'recommend']):
            response = f"""💼 **Investment Analysis & Recommendations**

I provide comprehensive analysis:

**✅ Stock Evaluation:**
• Buy/Hold/Sell ratings
• Entry and exit points
• Risk assessment
• Position sizing

**📊 Portfolio Tools:**
• Diversification analysis
• Rebalancing suggestions
• Risk-adjusted returns
• Asset allocation

**🎯 Trading Strategies:**
• Technical setups
• Momentum plays
• Value investing
• Growth stocks

**⚠️ Disclaimer:** This is educational information, not financial advice. Always do your own research and consider consulting a financial advisor.

💡 Ask: "Should I buy Apple stock?" or "Best tech stocks under $50"""
        
        # Portfolio management
        elif any(word in prompt_lower for word in ['portfolio', 'stocks', 'holdings', 'diversif']):
            response = f"""📁 **Portfolio Management Suite**

I help you optimize your portfolio:

**📊 Analysis Tools:**
• Performance tracking
• Risk metrics (Beta, Sharpe, Sortino)
• Sector allocation
• Correlation analysis

**🎯 Optimization:**
• Rebalancing recommendations
• Tax-loss harvesting
• Position sizing
• Diversification scoring

**📈 Performance:**
• Total returns
• Benchmarking vs S&P 500
• Risk-adjusted returns
• Dividend tracking

💡 Share your holdings and I'll analyze them!"""
        
        # Technical analysis
        elif any(word in prompt_lower for word in ['technical', 'chart', 'indicator', 'support', 'resistance', 'rsi', 'macd']):
            response = f"""📊 **Technical Analysis Tools**

I analyze charts using:

**📈 Indicators:**
• Moving Averages (SMA, EMA)
• RSI (Relative Strength Index)
• MACD (Moving Average Convergence Divergence)
• Bollinger Bands
• Volume Profile
• Fibonacci Retracements

**🎯 Pattern Recognition:**
• Head & Shoulders
• Double Top/Bottom
• Triangles, Flags, Pennants
• Candlestick patterns

**📊 Support/Resistance:**
• Key price levels
• Trend lines
• Breakout zones

💡 Try: "Show me technical analysis for NVDA" or "Is TSLA overbought?"""
        
        # Default helpful response
        else:
            response = f"""👋 Hi! I'm **UpTrade AI Copilot**, your intelligent market assistant!

🚀 **What I Can Do:**

📊 **Market Analysis**
• Real-time stock quotes and charts
• Market overview and trending stocks
• Sector performance analysis

🤖 **AI-Powered Insights**
• Sentiment analysis from news & social media
• Price predictions and forecasting
• Technical and fundamental analysis

💼 **Investment Tools**
• Stock comparison and rankings
• Portfolio optimization
• Risk assessment
• Trading signals

📰 **News & Updates**
• Breaking market news
• Economic indicators
• Earnings reports
• Fed announcements

💡 **Try Asking:**
• "What's the price of Apple stock?"
• "Analyze sentiment for Tesla"
• "Compare Microsoft vs Google"
• "What's trending in tech stocks?"
• "Forecast Amazon for next week"
• "Show me the best dividend stocks"

I'm connected to 13+ APIs and powered by GPT-4 + HuggingFace AI. How can I help you today?"""
        
        return {
            'prompt': prompt,
            'analysis': response,
            'message': response,
            'source': 'UpTrade AI Copilot (Intelligent Fallback)',
            'fallback': True
        }
    
    def get_market_sentiment_analysis(self, symbol: str, news_data: List[Dict]) -> Dict[str, Any]:
        """Generate AI-powered market sentiment analysis"""
        # Prepare news summary
        news_summary = "\n".join([
            f"- {article.get('title', 'N/A')}" 
            for article in news_data[:5]
        ])
        
        prompt = f"""Analyze the market sentiment for {symbol} based on recent news:

{news_summary}

Provide:
1. Overall sentiment (Bullish/Bearish/Neutral)
2. Key factors influencing the stock
3. Short-term outlook
4. Risk factors

Keep analysis concise and actionable."""
        
        return self.analyze_with_gpt(prompt)
    
    # ========================================================================
    # ADVANCED NLP - HuggingFace
    # ========================================================================
    
    def analyze_sentiment_huggingface(self, text: str) -> Dict[str, Any]:
        """Advanced sentiment analysis using HuggingFace with fallback"""
        # Try multiple models in order of preference
        models = [
            'mrm8488/distilroberta-finetuned-financial-news-sentiment-analysis',
            'ProsusAI/finbert',
            'yiyanghkust/finbert-tone',
            'cardiffnlp/twitter-roberta-base-sentiment-latest'  # General purpose fallback
        ]
        
        for model_name in models:
            try:
                if not self.huggingface_key:
                    raise ValueError("HuggingFace API key not configured")
                    
                self._rate_limit('huggingface')
                url = f'https://api-inference.huggingface.co/models/{model_name}'
                headers = {'Authorization': f'Bearer {self.huggingface_key}'}
                
                response = requests.post(url, headers=headers, json={'inputs': text}, timeout=30)
                
                # Skip to next model if this one is gone/unavailable
                if response.status_code == 410:
                    logger.warning(f"⚠️ Model {model_name} is deprecated (410 Gone)")
                    continue
                
                response.raise_for_status()
                result = response.json()
                
                # Handle different response formats
                if isinstance(result, list) and len(result) > 0:
                    if isinstance(result[0], list):
                        sentiment_scores = {item['label']: item['score'] for item in result[0]}
                    elif isinstance(result[0], dict):
                        sentiment_scores = {result[0]['label']: result[0]['score']}
                    else:
                        continue
                    
                    # Map labels to standard format
                    label_mapping = {
                        'positive': 'positive', 'Positive': 'positive', 'POSITIVE': 'positive',
                        'negative': 'negative', 'Negative': 'negative', 'NEGATIVE': 'negative',
                        'neutral': 'neutral', 'Neutral': 'neutral', 'NEUTRAL': 'neutral'
                    }
                    
                    standardized_scores = {}
                    for label, score in sentiment_scores.items():
                        standard_label = label_mapping.get(label, label.lower())
                        standardized_scores[standard_label] = score
                    
                    dominant = max(standardized_scores, key=standardized_scores.get)
                    confidence = standardized_scores[dominant]
                    
                    model_display = model_name.split('/')[-1]
                    return {
                        'text': text[:100] + '...' if len(text) > 100 else text,
                        'sentiment': standardized_scores,
                        'dominant': dominant,
                        'confidence': round(confidence * 100, 2),
                        'source': f'HuggingFace ({model_display})',
                        'model': model_name
                    }
            
            except requests.exceptions.HTTPError as e:
                if e.response.status_code == 410:
                    logger.warning(f"⚠️ Model {model_name} is deprecated")
                    continue
                logger.error(f"❌ HuggingFace error for {model_name}: {e}")
            except Exception as e:
                logger.error(f"❌ HuggingFace error for {model_name}: {e}")
        
        # Enhanced fallback: Rule-based sentiment analysis
        logger.info("💡 Using enhanced fallback sentiment analysis")
        text_lower = text.lower()
        
        # Enhanced keyword lists
        positive_words = [
            'profit', 'gain', 'growth', 'success', 'increase', 'beat', 'record', 'strong',
            'surge', 'jump', 'soar', 'breakthrough', 'innovative', 'boost', 'positive',
            'excellent', 'outstanding', 'impressive', 'exceeds', 'bullish', 'rally',
            'upgrade', 'optimistic', 'momentum', 'strength'
        ]
        
        negative_words = [
            'loss', 'decline', 'fall', 'challenge', 'disruption', 'weak', 'miss',
            'plunge', 'drop', 'slump', 'crisis', 'concern', 'risk', 'negative',
            'poor', 'disappointing', 'underperform', 'bearish', 'downturn',
            'downgrade', 'pessimistic', 'volatility', 'uncertainty'
        ]
        
        neutral_words = ['stable', 'unchanged', 'flat', 'mixed', 'moderate', 'steady']
        
        # Count occurrences
        pos_count = sum(1 for word in positive_words if word in text_lower)
        neg_count = sum(1 for word in negative_words if word in text_lower)
        neu_count = sum(1 for word in neutral_words if word in text_lower)
        
        # Calculate sentiment scores
        total = pos_count + neg_count + neu_count or 1
        pos_score = pos_count / total
        neg_score = neg_count / total
        neu_score = max(neu_count / total, 0.2)  # Minimum 20% neutral
        
        # Normalize scores
        total_score = pos_score + neg_score + neu_score
        if total_score > 0:
            pos_score /= total_score
            neg_score /= total_score
            neu_score /= total_score
        
        # Determine dominant sentiment
        scores = {'positive': pos_score, 'negative': neg_score, 'neutral': neu_score}
        dominant = max(scores, key=scores.get)
        confidence = scores[dominant] * 100
        
        return {
            'text': text[:100] + '...' if len(text) > 100 else text,
            'sentiment': scores,
            'dominant': dominant,
            'confidence': round(confidence, 2),
            'source': 'Enhanced Keyword Analysis',
            'note': 'Using advanced keyword-based analysis (HuggingFace models unavailable)',
            'details': {
                'positive_matches': pos_count,
                'negative_matches': neg_count,
                'neutral_matches': neu_count
            }
        }
    
    # ========================================================================
    # COMPREHENSIVE STOCK ANALYSIS
    # ========================================================================
    
    def get_complete_stock_analysis(self, symbol: str) -> Dict[str, Any]:
        """
        🦁 BEAST MODE: Get comprehensive stock analysis
        Combines data from multiple APIs for complete picture
        """
        logger.info(f"🦁 Starting BEAST MODE analysis for {symbol}")
        
        analysis = {
            'symbol': symbol,
            'timestamp': datetime.now().isoformat(),
            'analysis_type': 'BEAST MODE - Comprehensive'
        }
        
        # 1. Stock Quote (Internal)
        try:
            analysis['quote'] = self.get_stock_quote(symbol)
        except Exception as e:
            logger.error(f"Quote error: {e}")
            analysis['quote'] = {'error': str(e)}
        
        # 2. Company Overview
        try:
            analysis['company'] = self.get_company_overview(symbol)
        except Exception as e:
            analysis['company'] = {'error': str(e)}
        
        # 3. Financial Statements (FMP)
        try:
            analysis['financials'] = self.get_company_financials(symbol)
        except Exception as e:
            analysis['financials'] = {'error': str(e)}
        
        # 4. Analyst Ratings (FMP)
        try:
            analysis['rating'] = self.get_stock_rating(symbol)
        except Exception as e:
            analysis['rating'] = {'error': str(e)}
        
        # 5. News
        try:
            news = self.get_stock_news(symbol, limit=10)
            analysis['news'] = news
            
            # 6. AI-Powered Sentiment Analysis
            if news:
                analysis['ai_sentiment'] = self.get_market_sentiment_analysis(symbol, news)
        except Exception as e:
            analysis['news'] = {'error': str(e)}
            analysis['ai_sentiment'] = {'error': str(e)}
        
        logger.info(f"✅ BEAST MODE analysis complete for {symbol}")
        return analysis
    
    # ========================================================================
    # MARKET OVERVIEW
    # ========================================================================
    
    def get_market_overview(self) -> Dict[str, Any]:
        """Get comprehensive market overview"""
        overview = {
            'timestamp': datetime.now().isoformat(),
            'type': 'BEAST MODE Market Overview'
        }
        
        # Economic indicators
        try:
            overview['economic_indicators'] = self.get_key_economic_indicators()
        except Exception as e:
            overview['economic_indicators'] = {'error': str(e)}
        
        # Major indices
        try:
            indices = ['SPY', 'QQQ', 'DIA']
            overview['indices'] = {
                idx: self.get_stock_quote(idx) 
                for idx in indices
            }
        except Exception as e:
            overview['indices'] = {'error': str(e)}
        
        # Crypto market
        try:
            overview['crypto'] = self.get_crypto_prices()
        except Exception as e:
            overview['crypto'] = {'error': str(e)}
        
        # Forex rates
        try:
            overview['forex'] = self.get_exchange_rates('USD')
        except Exception as e:
            overview['forex'] = {'error': str(e)}
        
        return overview
    
    # ========================================================================
    # SYSTEM HEALTH
    # ========================================================================
    
    def get_system_health(self) -> Dict[str, Any]:
        """Get comprehensive system health status"""
        health = {
            'timestamp': datetime.now().isoformat(),
            'mode': 'BEAST MODE',
            'apis': {}
        }
        
        # Test each API category
        api_tests = {
            'Market Data': {
                'Alpha Vantage': bool(self.alpha_vantage_key),
                'Finnhub': bool(self.finnhub_key),
                'Polygon': bool(self.polygon_key),
                'FMP': bool(self.fmp_key)
            },
            'News': {
                'NewsAPI': bool(self.news_api_key),
                'NewsData': bool(self.newsdata_key),
                'Marketaux': bool(self.marketaux_key)
            },
            'Economic': {
                'FRED': bool(self.fred_key),
                'ExchangeRate': bool(self.exchangerate_key),
                'CoinGecko': True  # No key needed
            },
            'AI': {
                'OpenAI': bool(self.openai_key),
                'HuggingFace': bool(self.huggingface_key)
            },
            'Social': {
                'Twitter': bool(self.twitter_key)
            }
        }
        
        health['apis'] = api_tests
        
        # Calculate statistics
        total_apis = sum(len(apis) for apis in api_tests.values())
        configured_apis = sum(
            sum(1 for configured in apis.values() if configured)
            for apis in api_tests.values()
        )
        
        health['statistics'] = {
            'total_apis': total_apis,
            'configured_apis': configured_apis,
            'configuration_percentage': (configured_apis / total_apis) * 100,
            'cache_size': len(self.cache),
            'status': 'BEAST MODE OPERATIONAL' if configured_apis >= 10 else 'Partially Configured'
        }
        
        return health


# Global instance
_beast_manager = None

def get_beast_manager() -> BeastAPIManager:
    """Get or create BEAST MODE manager instance"""
    global _beast_manager
    if _beast_manager is None:
        _beast_manager = BeastAPIManager()
    return _beast_manager
