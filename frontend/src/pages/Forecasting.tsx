/**
 * Forecasting Page - AI Price Predictions
 */
import { useState } from 'react';
import { forecastAPI } from '../services/api';
import { Search, TrendingUp } from 'lucide-react';

export default function Forecasting() {
  const [symbol, setSymbol] = useState('AAPL');
  const [forecast, setForecast] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState(7);

  const handleForecast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol) return;

    setLoading(true);
    try {
      const response = await forecastAPI.getForecast(symbol.toUpperCase(), days);
      setForecast(response.data);
    } catch (error) {
      console.error('Failed to load forecast:', error);
      alert('Failed to generate forecast. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Price Forecasting</h1>
        <p className="mt-2 text-gray-600">AI-powered price predictions using trend analysis</p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleForecast} className="mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                placeholder="Stock Symbol (e.g., AAPL)"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value))}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={7}>7 Days</option>
              <option value={14}>14 Days</option>
              <option value={30}>30 Days</option>
            </select>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              {loading ? 'Generating...' : 'Generate Forecast'}
            </button>
          </div>
        </div>
      </form>

      {/* Forecast Results */}
      {forecast && (
        <div className="space-y-6">
          {/* Current Price */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{forecast.ticker} - Current Price</h2>
            <div className="text-4xl font-bold text-blue-600">
              ${forecast.current_price?.toFixed(2)}
            </div>
            <p className="text-sm text-gray-500 mt-2">Model: {forecast.model}</p>
          </div>

          {/* Forecast Table */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Price Forecast</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Predicted Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Change
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Confidence
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {forecast.forecast?.map((day: any, idx: number) => {
                    const change = day.predicted_price - forecast.current_price;
                    const changePercent = (change / forecast.current_price) * 100;
                    return (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {day.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${day.predicted_price?.toFixed(2)}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                          change >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {change >= 0 ? '+' : ''}{change.toFixed(2)} ({changePercent.toFixed(2)}%)
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {(day.confidence * 100).toFixed(0)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">📊 Forecast Summary</h3>
            <p className="text-blue-800">
              Based on trend analysis, {forecast.ticker} is projected to{' '}
              {forecast.forecast?.[forecast.forecast.length - 1]?.predicted_price > forecast.current_price
                ? 'increase'
                : 'decrease'}{' '}
              over the next {days} days. Final predicted price: $
              {forecast.forecast?.[forecast.forecast.length - 1]?.predicted_price?.toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
