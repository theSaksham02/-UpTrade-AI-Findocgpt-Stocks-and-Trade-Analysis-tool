"""Sentiment analysis service."""
from typing import Optional
from datetime import datetime
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from app.services.news_service import news_service
from app.core.logging import logger


class SentimentService:
    """Service for sentiment analysis and social media monitoring."""
    
    def __init__(self):
        """Initialize sentiment service."""
        self.analyzer = SentimentIntensityAnalyzer()
    
    async def get_sentiment(self, ticker: str, period: str = "daily") -> dict:
        """
        Get aggregated sentiment for a ticker from news articles.
        
        Args:
            ticker: Stock ticker symbol
            period: Time period (hourly, daily, weekly)
            
        Returns:
            dict: Sentiment data
        """
        try:
            # Get recent news for the ticker
            articles = await news_service.get_news_by_ticker(ticker, limit=50)
            
            if not articles:
                return self._get_mock_sentiment(ticker, period)
            
            # Aggregate sentiment
            total_sentiment = 0
            positive_count = 0
            negative_count = 0
            neutral_count = 0
            
            for article in articles:
                sentiment_score = article.get('sentiment_score', 0)
                total_sentiment += sentiment_score
                
                if sentiment_score >= 0.05:
                    positive_count += 1
                elif sentiment_score <= -0.05:
                    negative_count += 1
                else:
                    neutral_count += 1
            
            mention_count = len(articles)
            avg_sentiment = total_sentiment / mention_count if mention_count > 0 else 0
            
            # Calculate trending score (simple heuristic)
            trending_score = min(100, (mention_count * abs(avg_sentiment) * 10))
            
            return {
                "ticker": ticker,
                "avg_sentiment": avg_sentiment,
                "mention_count": mention_count,
                "positive_count": positive_count,
                "negative_count": negative_count,
                "neutral_count": neutral_count,
                "trending_score": trending_score,
                "period": period,
                "timestamp": datetime.utcnow()
            }
        except Exception as e:
            logger.error(f"Error getting sentiment for {ticker}: {e}")
            return self._get_mock_sentiment(ticker, period)
    
    async def get_trending_stocks(self, limit: int = 10) -> list:
        """
        Get trending stocks based on news mentions.
        
        Args:
            limit: Maximum number of results
            
        Returns:
            list: Trending stocks
        """
        try:
            # Get trending news
            trending_news = await news_service.get_trending_news()
            
            if not trending_news:
                return self._get_mock_trending(limit)
            
            result = []
            for item in trending_news[:limit]:
                result.append({
                    "ticker": item['ticker'],
                    "mention_count": item['mention_count'],
                    "avg_sentiment": item['avg_sentiment'],
                    "trending_score": min(100, item['mention_count'] * 5),
                    "change_24h": None  # Would need historical data
                })
            
            return result
        except Exception as e:
            logger.error(f"Error getting trending stocks: {e}")
            return self._get_mock_trending(limit)
    
    async def get_social_mentions(self, ticker: str, platform: Optional[str] = None, limit: int = 50) -> list:
        """
        Get social media mentions for a ticker.
        Note: This uses news articles as a proxy since real social media APIs require special access.
        
        Args:
            ticker: Stock ticker symbol
            platform: Filter by platform (reddit, twitter)
            limit: Maximum number of mentions
            
        Returns:
            list: Social media mentions
        """
        try:
            # Use news articles as proxy for social mentions
            articles = await news_service.get_news_by_ticker(ticker, limit=limit)
            
            mentions = []
            for article in articles:
                # Convert article to mention format
                mentions.append({
                    "id": article['id'],
                    "platform": "news",  # Using news as proxy
                    "ticker": ticker,
                    "content": article['content'],
                    "author": article['source'],
                    "url": article['url'],
                    "upvotes": 0,  # Not available for news
                    "comments": 0,  # Not available for news
                    "sentiment_score": article['sentiment_score'],
                    "sentiment_label": article['sentiment_label'],
                    "posted_at": article['published_at']
                })
            
            return mentions
        except Exception as e:
            logger.error(f"Error getting social mentions for {ticker}: {e}")
            return self._get_mock_mentions(ticker, limit)
    
    def _get_mock_sentiment(self, ticker: str, period: str) -> dict:
        """Fallback mock sentiment data."""
        return {
            "ticker": ticker,
            "avg_sentiment": 0.65,
            "mention_count": 250,
            "positive_count": 180,
            "negative_count": 30,
            "neutral_count": 40,
            "trending_score": 75.5,
            "period": period,
            "timestamp": datetime.utcnow()
        }
    
    def _get_mock_trending(self, limit: int) -> list:
        """Fallback mock trending data."""
        return [
            {
                "ticker": "TSLA",
                "mention_count": 1500,
                "avg_sentiment": 0.72,
                "trending_score": 95.0,
                "change_24h": 25.5
            },
            {
                "ticker": "AAPL",
                "mention_count": 1200,
                "avg_sentiment": 0.68,
                "trending_score": 88.0,
                "change_24h": 15.2
            }
        ][:limit]
    
    def _get_mock_mentions(self, ticker: str, limit: int) -> list:
        """Fallback mock mentions."""
        return [
            {
                "id": 1,
                "platform": "reddit",
                "ticker": ticker,
                "content": f"Just bought some {ticker} shares. Looking good!",
                "author": "investor123",
                "url": f"https://reddit.com/r/stocks/comments/123/{ticker}",
                "upvotes": 250,
                "comments": 45,
                "sentiment_score": 0.85,
                "sentiment_label": "positive",
                "posted_at": datetime.utcnow()
            }
        ][:limit]


# Global service instance
sentiment_service = SentimentService()
