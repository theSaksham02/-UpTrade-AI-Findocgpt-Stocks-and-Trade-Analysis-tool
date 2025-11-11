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
        """Analyze financial data using OpenAI GPT"""
        try:
            self._rate_limit('openai')
            url = 'https://api.openai.com/v1/chat/completions'
            headers = {
                'Authorization': f'Bearer {self.openai_key}',
                'Content-Type': 'application/json'
            }
            data = {
                'model': model,
                'messages': [
                    {'role': 'system', 'content': 'You are an expert financial analyst providing insights on market data.'},
                    {'role': 'user', 'content': prompt}
                ],
                'max_tokens': 500,
                'temperature': 0.7
            }
            
            response = requests.post(url, headers=headers, json=data, timeout=30)
            response.raise_for_status()
            result = response.json()
            
            analysis = {
                'prompt': prompt,
                'analysis': result['choices'][0]['message']['content'],
                'model': model,
                'tokens_used': result['usage']['total_tokens'],
                'source': 'OpenAI GPT'
            }
            
            logger.info(f"✅ GPT analysis completed")
            return analysis
            
        except Exception as e:
            logger.error(f"❌ OpenAI error: {e}")
            return {'prompt': prompt, 'analysis': 'Analysis unavailable', 'error': str(e)}
    
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
        """Advanced sentiment analysis using HuggingFace"""
        # Try multiple models in order of preference
        models = [
            'mrm8488/distilroberta-finetuned-financial-news-sentiment-analysis',  # Active financial sentiment model
            'ProsusAI/finbert',  # Original FinBERT (may be deprecated)
            'yiyanghkust/finbert-tone'  # Alternative FinBERT (may be deprecated)
        ]
        
        for model_name in models:
            try:
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
        
        # 1. Stock Quote (from existing manager)
        from api_integrations_enhanced import get_enhanced_api_manager
        basic_manager = get_enhanced_api_manager()
        
        try:
            analysis['quote'] = basic_manager.get_stock_quote(symbol)
        except Exception as e:
            logger.error(f"Quote error: {e}")
            analysis['quote'] = {'error': str(e)}
        
        # 2. Company Overview
        try:
            analysis['company'] = basic_manager.get_company_overview(symbol)
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
            news = basic_manager.get_stock_news(symbol, limit=10)
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
            from api_integrations_enhanced import get_enhanced_api_manager
            manager = get_enhanced_api_manager()
            indices = ['SPY', 'QQQ', 'DIA']
            overview['indices'] = {
                idx: manager.get_stock_quote(idx) 
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
