/**
 * News & Sentiment Analysis Page - 100% LIVE DATA with FinBERT
 * Uses: NewsAPI, FinBERT Sentiment Analysis, Real-time Market Data
 */
import { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function NewsSentiment() {
  const [symbol, setSymbol] = useState('AAPL');
  const [news, setNews] = useState<any[]>([]);
  const [sentiment, setSentiment] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (ticker?: string) => {
    const searchSymbol = ticker || symbol;
    setLoading(true);
    setError(null);
    
    try {
      // Fetch REAL news from backend (NewsAPI integration)
      const newsResponse = await fetch(`${API_BASE_URL}/api/news/stock/${searchSymbol}`);
      if (!newsResponse.ok) throw new Error('Failed to fetch news');
      const newsData = await newsResponse.json();
      
      // Process news with FinBERT sentiment analysis
      const newsWithSentiment = await Promise.all(
        (newsData.news || newsData.articles || []).map(async (article: any) => {
          try {
            // Use FinBERT for sentiment analysis on each article
            const sentimentResponse = await fetch(`${API_BASE_URL}/api/ai/sentiment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                text: article.title + ' ' + (article.description || ''),
                symbol: searchSymbol 
              })
            });
            
            if (sentimentResponse.ok) {
              const sentimentData = await sentimentResponse.json();
              return { ...article, sentiment: sentimentData.sentiment, score: sentimentData.score };
            }
          } catch (err) {
            console.error('Sentiment analysis error:', err);
          }
          return article;
        })
      );
      
      setNews(newsWithSentiment);
      
      // Aggregate sentiment from all news articles
      const aggregateSentiment = calculateAggregateSentiment(newsWithSentiment);
      setSentiment(aggregateSentiment);
      
    } catch (error) {
      console.error('Failed to load news:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch real-time data');
    } finally {
      setLoading(false);
    }
  };

  const calculateAggregateSentiment = (newsArticles: any[]) => {
    const sentiments = newsArticles.filter(n => n.sentiment);
    if (sentiments.length === 0) return null;
    
    const positive = sentiments.filter(n => n.sentiment === 'positive').length;
    const negative = sentiments.filter(n => n.sentiment === 'negative').length;
    const neutral = sentiments.length - positive - negative;
    
    const avgScore = sentiments.reduce((acc, n) => acc + (n.score || 0), 0) / sentiments.length;
    
    return {
      ticker: symbol,
      overall: avgScore > 0.15 ? 'bullish' : avgScore < -0.15 ? 'bearish' : 'neutral',
      score: avgScore,
      distribution: {
        positive: (positive / sentiments.length) * 100,
        neutral: (neutral / sentiments.length) * 100,
        negative: (negative / sentiments.length) * 100
      },
      totalArticles: newsArticles.length,
      analyzedArticles: sentiments.length,
      source: 'FinBERT + NewsAPI (Live)'
    };
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await loadData(symbol);
  };

  const getSentimentIcon = (sentiment: string) => {
    if (sentiment === 'positive') return <TrendingUp className="w-5 h-5 text-green-600" />;
    if (sentiment === 'negative') return <TrendingDown className="w-5 h-5 text-red-600" />;
    return <Minus className="w-5 h-5 text-gray-600" />;
  };

  const getSentimentColor = (sentiment: string) => {
    if (sentiment === 'positive') return 'text-green-600 bg-green-50 border-green-200';
    if (sentiment === 'negative') return 'text-red-600 bg-red-50 border-red-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gradient">News & Sentiment Analysis</h1>
        <p className="mt-2 text-text-secondary">Real-time news and market sentiment tracking</p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-4">
          <div className="flex-1 search-premium">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-accent-blue w-5 h-5 z-10" />
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              placeholder="Enter stock symbol (e.g., AAPL)"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-premium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Search'}
          </button>
        </div>
      </form>

      {/* Error Display */}
      {error && (
        <div className="mb-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-700 dark:text-red-400">Failed to fetch live data</p>
            <p className="text-sm text-red-600 dark:text-red-300 mt-1">{error}</p>
            <p className="text-xs text-red-500 dark:text-red-400 mt-2">Ensure backend is running at {API_BASE_URL}</p>
          </div>
        </div>
      )}

      {/* Success Indicator */}
      {!error && sentiment && (
        <div className="mb-8 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-green-500" />
          <span className="text-sm text-green-700 dark:text-green-300">\u2713 Live Data from {sentiment.source} - {sentiment.analyzedArticles} articles analyzed with FinBERT</span>
        </div>
      )}

      {/* Sentiment Overview */}
      {sentiment && (
        <div className="card-premium mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Sentiment Overview - {sentiment.ticker}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">Overall Sentiment</p>
              <div className={`inline-flex items-center px-4 py-2 rounded-lg border ${getSentimentColor(sentiment.overall)}`}>
                {getSentimentIcon(sentiment.overall)}
                <span className="ml-2 font-semibold capitalize">{sentiment.overall}</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">Positive</p>
              <p className="text-2xl font-bold text-green-600">{sentiment.distribution.positive.toFixed(1)}%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">Neutral</p>
              <p className="text-2xl font-bold text-gray-600">{sentiment.distribution.neutral.toFixed(1)}%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">Negative</p>
              <p className="text-2xl font-bold text-red-600">{sentiment.distribution.negative.toFixed(1)}%</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4 text-center">
            Based on {sentiment.total_articles} recent articles
          </p>
        </div>
      )}

      {/* News Articles */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Latest News</h2>
        {loading ? (
          <p className="text-gray-500">Loading news...</p>
        ) : (
          <div className="space-y-4">
            {news.map((article, idx) => (
              <div key={idx} className="border-b border-gray-200 pb-4 last:border-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{article.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{article.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{article.source}</span>
                      <span>•</span>
                      <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    {getSentimentIcon(article.sentiment)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> This is demo data for illustration. In production, connect to NewsAPI or similar service for real-time news feeds.
        </p>
      </div>
    </div>
  );
}
