/**
 * News & Sentiment Analysis Page
 */
import { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function NewsSentiment() {
  const [symbol, setSymbol] = useState('AAPL');
  const [news, setNews] = useState<any[]>([]);
  const [sentiment, setSentiment] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (ticker?: string) => {
    const searchSymbol = ticker || symbol;
    setLoading(true);
    try {
      // For now, we'll create mock news data since the API might not have news service
      const mockNews = generateMockNews(searchSymbol);
      setNews(mockNews);
      
      // Generate sentiment based on mock data
      const mockSentiment = generateMockSentiment(searchSymbol);
      setSentiment(mockSentiment);
    } catch (error) {
      console.error('Failed to load news:', error);
      // Still show mock data on error
      const mockNews = generateMockNews(searchSymbol);
      setNews(mockNews);
      const mockSentiment = generateMockSentiment(searchSymbol);
      setSentiment(mockSentiment);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await loadData(symbol);
  };

  const generateMockNews = (ticker: string) => {
    const companies: any = {
      AAPL: 'Apple',
      MSFT: 'Microsoft',
      GOOGL: 'Google',
      TSLA: 'Tesla',
      AMZN: 'Amazon'
    };
    const companyName = companies[ticker] || ticker;
    
    return [
      {
        title: `${companyName} Reports Strong Q4 Earnings, Beats Expectations`,
        description: `${companyName} announced quarterly earnings that exceeded analyst expectations, driven by strong product sales and service revenue growth.`,
        source: 'Financial Times',
        publishedAt: new Date().toISOString(),
        sentiment: 'positive',
        url: '#'
      },
      {
        title: `Analysts Upgrade ${companyName} Stock Rating to Buy`,
        description: `Multiple Wall Street analysts have upgraded their rating on ${companyName} citing strong fundamentals and market position.`,
        source: 'Bloomberg',
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
        sentiment: 'positive',
        url: '#'
      },
      {
        title: `${companyName} Faces Regulatory Scrutiny in Europe`,
        description: `European regulators are investigating ${companyName}'s business practices, potentially leading to new compliance requirements.`,
        source: 'Reuters',
        publishedAt: new Date(Date.now() - 172800000).toISOString(),
        sentiment: 'negative',
        url: '#'
      },
      {
        title: `${companyName} Announces New Product Launch`,
        description: `The company unveiled its latest innovation, expected to drive significant revenue growth in the coming quarters.`,
        source: 'TechCrunch',
        publishedAt: new Date(Date.now() - 259200000).toISOString(),
        sentiment: 'positive',
        url: '#'
      },
      {
        title: `Market Volatility Affects ${companyName} Stock Price`,
        description: `${ticker} shares experienced fluctuations amid broader market uncertainty and economic concerns.`,
        source: 'CNBC',
        publishedAt: new Date(Date.now() - 345600000).toISOString(),
        sentiment: 'neutral',
        url: '#'
      }
    ];
  };

  const generateMockSentiment = (ticker: string) => {
    return {
      ticker,
      overall_sentiment: 'positive',
      sentiment_score: 0.65,
      positive_percentage: 60,
      neutral_percentage: 25,
      negative_percentage: 15,
      total_articles: 50,
      last_updated: new Date().toISOString()
    };
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

      {/* Sentiment Overview */}
      {sentiment && (
        <div className="card-premium mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Sentiment Overview - {sentiment.ticker}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">Overall Sentiment</p>
              <div className={`inline-flex items-center px-4 py-2 rounded-lg border ${getSentimentColor(sentiment.overall_sentiment)}`}>
                {getSentimentIcon(sentiment.overall_sentiment)}
                <span className="ml-2 font-semibold capitalize">{sentiment.overall_sentiment}</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">Positive</p>
              <p className="text-2xl font-bold text-green-600">{sentiment.positive_percentage}%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">Neutral</p>
              <p className="text-2xl font-bold text-gray-600">{sentiment.neutral_percentage}%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">Negative</p>
              <p className="text-2xl font-bold text-red-600">{sentiment.negative_percentage}%</p>
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
