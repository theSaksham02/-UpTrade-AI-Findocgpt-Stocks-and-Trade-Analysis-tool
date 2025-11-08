/**
 * Paper Trading Page
 */
import { useState, useEffect } from 'react';
import { tradingAPI } from '../services/api';

export default function Trading() {
  const [account, setAccount] = useState<any>(null);
  const [positions, setPositions] = useState<any[]>([]);
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTradingData();
  }, []);

  const loadTradingData = async () => {
    try {
      const [accountRes, positionsRes] = await Promise.all([
        tradingAPI.getPaperAccount(),
        tradingAPI.getPositions()
      ]);
      setAccount(accountRes.data);
      setPositions(positionsRes.data || []);
    } catch (error) {
      console.error('Failed to load trading data:', error);
    }
  };

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol || !quantity) return;

    setLoading(true);
    try {
      await tradingAPI.placeOrder({
        symbol: symbol.toUpperCase(),
        qty: parseInt(quantity),
        side,
        type: 'market'
      });
      alert(`${side.toUpperCase()} order placed successfully!`);
      loadTradingData();
      setSymbol('');
      setQuantity('1');
    } catch (error: any) {
      alert(`Order failed: ${error.response?.data?.detail || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Paper Trading</h1>
      <p className="text-gray-600 mb-8">Practice trading with virtual money</p>

      {/* Account Info */}
      {account && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500">Account Value</p>
            <p className="text-2xl font-bold">${account.equity?.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500">Buying Power</p>
            <p className="text-2xl font-bold">${account.buying_power?.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500">Total P&L</p>
            <p className={`text-2xl font-bold ${(account.equity - 100000) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${((account.equity || 100000) - 100000).toFixed(2)}
            </p>
          </div>
        </div>
      )}

      {/* Order Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Place Order</h2>
        <form onSubmit={handleOrder} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              placeholder="Symbol (e.g., AAPL)"
              className="px-4 py-2 border rounded-lg"
              required
            />
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Quantity"
              min="1"
              className="px-4 py-2 border rounded-lg"
              required
            />
            <select
              value={side}
              onChange={(e) => setSide(e.target.value as 'buy' | 'sell')}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-medium ${
              side === 'buy'
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white'
            } disabled:opacity-50`}
          >
            {loading ? 'Placing Order...' : `${side.toUpperCase()} ${quantity} ${symbol}`}
          </button>
        </form>
      </div>

      {/* Positions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Positions</h2>
        {positions.length === 0 ? (
          <p className="text-gray-500">No open positions</p>
        ) : (
          <div className="space-y-2">
            {positions.map((pos: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <p className="font-bold">{pos.symbol}</p>
                  <p className="text-sm text-gray-500">{pos.qty} shares @ ${pos.avg_entry_price?.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${pos.unrealized_pl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${pos.unrealized_pl?.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">{pos.unrealized_plpc?.toFixed(2)}%</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
