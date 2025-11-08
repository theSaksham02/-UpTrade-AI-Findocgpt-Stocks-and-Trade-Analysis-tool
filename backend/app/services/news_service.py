"""News service for fetching and analyzing news articles."""
from typing import Optional, List
from datetime import datetime, timedelta
from app.config import settings
from app.core.logging import logger

# Optional imports
try:
    from newsapi import NewsApiClient
    NEWSAPI_AVAILABLE = True
except ImportError:
    logger.warning("NewsAPI not available - install with: pip install newsapi-python")
    NEWSAPI_AVAILABLE = False
    NewsApiClient = None

try:
    from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
    VADER_AVAILABLE = True
except ImportError:
    logger.warning("VADER Sentiment not available - install with: pip install vaderSentiment")
    VADER_AVAILABLE = False
    SentimentIntensityAnalyzer = None


class NewsService:
    """Service for fetching and analyzing news articles."""
    
    def __init__(self):
        """Initialize news service."""
        self.news_api = None
        if NEWSAPI_AVAILABLE and settings.news_api_key:
            try:
                self.news_api = NewsApiClient(api_key=settings.news_api_key)
            except Exception as e:
                logger.error(f"Failed to initialize News API: {e}")
        
        # Initialize sentiment analyzer
        self.sentiment_analyzer = SentimentIntensityAnalyzer() if VADER_AVAILABLE else None
    
    def _analyze_sentiment(self, text: str) -> tuple:
        """
        Analyze sentiment of text using VADER.
        
        Args:
            text: Text to analyze
            
        Returns:
            tuple: (sentiment_score, sentiment_label)
        """
        if not text:
            return 0.0, "neutral"
        
        scores = self.sentiment_analyzer.polarity_scores(text)
        compound = scores['compound']
        
        # Classify sentiment
        if compound >= 0.05:
            label = "positive"
        elif compound <= -0.05:
            label = "negative"
        else:
            label = "neutral"
        
        return compound, label
    
    async def get_latest_news(self, limit: int = 20) -> List[dict]:
        """
        Get latest financial news using News API.
        
        Args:
            limit: Maximum number of articles
            
        Returns:
            List[dict]: News articles
        """
        if not self.news_api:
            logger.warning("News API not configured, returning mock data")
            return self._get_mock_news(limit)
        
        try:
            # Get top business headlines
            response = self.news_api.get_top_headlines(
                category='business',
                language='en',
                page_size=min(limit, 100)
            )
            
            articles = []
            for article in response.get('articles', [])[:limit]:
                # Analyze sentiment
                text = f"{article.get('title', '')} {article.get('description', '')}"
                sentiment_score, sentiment_label = self._analyze_sentiment(text)
                
                articles.append({
                    "id": hash(article.get('url', '')),
                    "title": article.get('title', ''),
                    "content": article.get('description', ''),
                    "source": article.get('source', {}).get('name', 'Unknown'),
                    "url": article.get('url', ''),
                    "published_at": article.get('publishedAt', datetime.utcnow().isoformat()),
                    "sentiment_score": sentiment_score,
                    "sentiment_label": sentiment_label,
                    "related_tickers": self._extract_tickers(text),
                    "image_url": article.get('urlToImage')
                })
            
            return articles
        except Exception as e:
            logger.error(f"Error fetching latest news: {e}")
            return self._get_mock_news(limit)
    
    async def get_news_by_ticker(self, ticker: str, limit: int = 20) -> List[dict]:
        """
        Get news articles for a specific ticker using News API.
        
        Args:
            ticker: Stock ticker symbol
            limit: Maximum number of articles
            
        Returns:
            List[dict]: News articles
        """
        if not self.news_api:
            logger.warning("News API not configured, returning mock data")
            return self._get_mock_news_ticker(ticker, limit)
        
        try:
            # Search for articles mentioning the ticker
            response = self.news_api.get_everything(
                q=ticker,
                language='en',
                sort_by='publishedAt',
                page_size=min(limit, 100)
            )
            
            articles = []
            for article in response.get('articles', [])[:limit]:
                # Analyze sentiment
                text = f"{article.get('title', '')} {article.get('description', '')}"
                sentiment_score, sentiment_label = self._analyze_sentiment(text)
                
                articles.append({
                    "id": hash(article.get('url', '')),
                    "title": article.get('title', ''),
                    "content": article.get('description', ''),
                    "source": article.get('source', {}).get('name', 'Unknown'),
                    "url": article.get('url', ''),
                    "published_at": article.get('publishedAt', datetime.utcnow().isoformat()),
                    "sentiment_score": sentiment_score,
                    "sentiment_label": sentiment_label,
                    "related_tickers": [ticker],
                    "image_url": article.get('urlToImage')
                })
            
            return articles
        except Exception as e:
            logger.error(f"Error fetching news for {ticker}: {e}")
            return self._get_mock_news_ticker(ticker, limit)
    
    async def get_trending_news(self) -> List[dict]:
        """
        Get trending news topics.
        
        Returns:
            List[dict]: Trending news
        """
        # This is a simplified version - in production, you'd track mentions over time
        latest_news = await self.get_latest_news(50)
        
        # Count ticker mentions
        ticker_counts = {}
        for article in latest_news:
            for ticker in article.get('related_tickers', []):
                if ticker not in ticker_counts:
                    ticker_counts[ticker] = {
                        'count': 0,
                        'avg_sentiment': 0,
                        'articles': []
                    }
                ticker_counts[ticker]['count'] += 1
                ticker_counts[ticker]['avg_sentiment'] += article.get('sentiment_score', 0)
                ticker_counts[ticker]['articles'].append(article)
        
        # Calculate averages and sort
        trending = []
        for ticker, data in ticker_counts.items():
            if data['count'] > 0:
                trending.append({
                    'ticker': ticker,
                    'mention_count': data['count'],
                    'avg_sentiment': data['avg_sentiment'] / data['count'],
                    'articles': data['articles'][:5]  # Top 5 articles
                })
        
        # Sort by mention count
        trending.sort(key=lambda x: x['mention_count'], reverse=True)
        return trending[:10]  # Top 10
    
    async def search_news(
        self,
        query: str,
        tickers: Optional[List[str]] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        limit: int = 20
    ) -> List[dict]:
        """
        Search news articles using News API.
        
        Args:
            query: Search query
            tickers: Filter by tickers
            start_date: Start date filter
            end_date: End date filter
            limit: Maximum number of results
            
        Returns:
            List[dict]: Search results
        """
        if not self.news_api:
            logger.warning("News API not configured, returning mock data")
            return await self.get_latest_news(limit)
        
        try:
            # Build search query
            search_query = query
            if tickers:
                search_query += " " + " OR ".join(tickers)
            
            # Set date range
            from_date = (start_date or datetime.utcnow() - timedelta(days=30)).strftime('%Y-%m-%d')
            to_date = (end_date or datetime.utcnow()).strftime('%Y-%m-%d')
            
            response = self.news_api.get_everything(
                q=search_query,
                from_param=from_date,
                to=to_date,
                language='en',
                sort_by='publishedAt',
                page_size=min(limit, 100)
            )
            
            articles = []
            for article in response.get('articles', [])[:limit]:
                # Analyze sentiment
                text = f"{article.get('title', '')} {article.get('description', '')}"
                sentiment_score, sentiment_label = self._analyze_sentiment(text)
                
                articles.append({
                    "id": hash(article.get('url', '')),
                    "title": article.get('title', ''),
                    "content": article.get('description', ''),
                    "source": article.get('source', {}).get('name', 'Unknown'),
                    "url": article.get('url', ''),
                    "published_at": article.get('publishedAt', datetime.utcnow().isoformat()),
                    "sentiment_score": sentiment_score,
                    "sentiment_label": sentiment_label,
                    "related_tickers": self._extract_tickers(text),
                    "image_url": article.get('urlToImage')
                })
            
            return articles
        except Exception as e:
            logger.error(f"Error searching news: {e}")
            return await self.get_latest_news(limit)
    
    def _extract_tickers(self, text: str) -> List[str]:
        """
        Extract potential ticker symbols from text.
        Simple implementation - in production, use NER.
        
        Args:
            text: Text to analyze
            
        Returns:
            List[str]: Potential tickers
        """
        # This is a very simple implementation
        # In production, you'd use NER or a ticker database
        common_tickers = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NVDA', 'SPY', 'QQQ']
        found = []
        text_upper = text.upper()
        for ticker in common_tickers:
            if ticker in text_upper:
                found.append(ticker)
        return found
    
    def _get_mock_news(self, limit: int) -> List[dict]:
        """Fallback mock news data."""
        return [
            {
                "id": 1,
                "title": "Market reaches new highs amid strong earnings",
                "content": "The stock market continued its rally today...",
                "source": "Financial Times",
                "url": "https://example.com/article/1",
                "published_at": datetime.utcnow().isoformat(),
                "sentiment_score": 0.75,
                "sentiment_label": "positive",
                "related_tickers": ["SPY", "QQQ"]
            }
        ][:limit]
    
    def _get_mock_news_ticker(self, ticker: str, limit: int) -> List[dict]:
        """Fallback mock news for ticker."""
        return [
            {
                "id": 1,
                "title": f"{ticker} announces strong quarterly results",
                "content": f"{ticker} reported better than expected earnings...",
                "source": "Bloomberg",
                "url": f"https://example.com/article/{ticker}",
                "published_at": datetime.utcnow().isoformat(),
                "sentiment_score": 0.85,
                "sentiment_label": "positive",
                "related_tickers": [ticker]
            }
        ][:limit]


# Global service instance
news_service = NewsService()
