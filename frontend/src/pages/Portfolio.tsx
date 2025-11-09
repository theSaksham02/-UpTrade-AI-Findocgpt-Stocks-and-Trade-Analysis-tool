/**
 * Portfolio Page - View and manage your positions
 */
import { useState, useEffect } from 'react';
import { tradingAPI } from '../services/api';
import { TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';

export default function Portfolio() {
  const [account, setAccount] = useState<any>(null);
  const [positions, setPositions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    try {
      const [accountRes, positionsRes] = await Promise.all([
        tradingAPI.getPaperAccount(),
        tradingAPI.getPositions()
      ]);
      setAccount(accountRes.data);
      setPositions(positionsRes.data || []);
    } catch (error) {
      console.error('Failed to load portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalPL = positions.reduce((sum, pos) => sum + (pos.unrealized_pl || 0), 0);
  const totalValue = account?.equity || 0;
  const totalCash = account?.cash || 0;
  const totalPositionValue = totalValue - totalCash;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Portfolio</h1>
        <p className="mt-2 text-gray-600">Track your investments and performance</p>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading portfolio...</p>
      ) : (
        <div className="space-y-6">
          {/* Account Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500">Total Value</p>
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500">Cash</p>
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                ${totalCash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500">Positions Value</p>
                <PieChart className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                ${totalPositionValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500">Total P&L</p>
                {totalPL >= 0 ? (
                  <TrendingUp className="w-5 h-5 text-green-600" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-600" />
                )}
              </div>
              <p className={`text-2xl font-bold ${totalPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalPL >= 0 ? '+' : ''}${totalPL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Positions Table */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Current Positions</h2>
            </div>
            <div className="p-6">
              {positions.length === 0 ? (
                <div className="text-center py-12">
                  <PieChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">No positions yet</p>
                  <p className="text-sm text-gray-400">Start trading to build your portfolio</p>
                  <a
                    href="/trading"
                    className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Go to Trading
                  </a>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Symbol
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Avg Cost
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Current Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Market Value
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          P&L
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          P&L %
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {positions.map((position, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{position.symbol}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {position.qty}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${position.avg_entry_price?.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${position.current_price?.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${position.market_value?.toFixed(2)}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                            position.unrealized_pl >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {position.unrealized_pl >= 0 ? '+' : ''}${position.unrealized_pl?.toFixed(2)}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                            position.unrealized_plpc >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {position.unrealized_plpc >= 0 ? '+' : ''}{position.unrealized_plpc?.toFixed(2)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Performance Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-4">📊 Performance Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Starting Capital</p>
                <p className="text-lg font-semibold text-gray-900">$100,000.00</p>
              </div>
              <div>
                <p className="text-gray-600">Current Value</p>
                <p className="text-lg font-semibold text-gray-900">
                  ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Total Return</p>
                <p className={`text-lg font-semibold ${totalValue >= 100000 ? 'text-green-600' : 'text-red-600'}`}>
                  {totalValue >= 100000 ? '+' : ''}${(totalValue - 100000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  {' '}({((totalValue - 100000) / 100000 * 100).toFixed(2)}%)
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
