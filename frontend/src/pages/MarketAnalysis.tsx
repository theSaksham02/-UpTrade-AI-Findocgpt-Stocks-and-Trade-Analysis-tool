/**
 * Market Analysis Page
 * Stock search and technical analysis
 */
import { useState } from 'react';
import { stocksAPI } from '../services/api';
import { Search } from 'lucide-react';
import AdvancedChart from '../components/AdvancedChart';

export default function MarketAnalysis() {
  const [symbol, setSymbol] = useState('AAPL');
  const [searchSymbol, setSearchSymbol] = useState('AAPL');
  const [quote, setQuote] = useState<any>(null);
  const [technical, setTechnical] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol) return;

    setLoading(true);
    setSearchSymbol(symbol.toUpperCase());
    try {
      const [quoteRes, techRes] = await Promise.all([
        stocksAPI.getQuote(symbol.toUpperCase()),
        stocksAPI.getTechnicalIndicators(symbol.toUpperCase())
      ]);
      setQuote(quoteRes.data);
      setTechnical(techRes.data);
    } catch (error) {
      console.error('Failed to load data:', error);
      alert('Failed to load stock data. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gradient">Market Analysis</h1>
        <p className="mt-2 text-text-secondary">Real-time stock data and technical indicators</p>
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
            {loading ? 'Loading...' : 'Analyze'}
          </button>
        </div>
      </form>

      {/* Advanced Chart */}
      {searchSymbol && (
        <div className="mb-8">
          <AdvancedChart ticker={searchSymbol} height={500} />
        </div>
      )}

      {/* Quote Data */}
      {quote && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{quote.symbol}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Price</p>
              <p className="text-2xl font-bold text-gray-900">${quote.price?.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Change</p>
              <p className={`text-2xl font-bold ${quote.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {quote.change >= 0 ? '+' : ''}{quote.change?.toFixed(2)} ({quote.change_percent?.toFixed(2)}%)
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Volume</p>
              <p className="text-2xl font-bold text-gray-900">{quote.volume?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Market Cap</p>
              <p className="text-2xl font-bold text-gray-900">{quote.market_cap}</p>
            </div>
          </div>
        </div>
      )}

      {/* Technical Indicators */}
      {technical && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Technical Indicators</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(technical).map(([key, value]: [string, any]) => (
              <div key={key} className="p-4 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">{key.replace(/_/g, ' ').toUpperCase()}</p>
                <p className="text-lg font-semibold text-gray-900">
                  {typeof value === 'number' ? value.toFixed(2) : String(value)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
