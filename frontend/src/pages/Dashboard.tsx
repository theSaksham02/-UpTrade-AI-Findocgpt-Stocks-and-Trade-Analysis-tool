/**
 * Dashboard Page
 * Main overview with key metrics
 */
import { useState, useEffect } from 'react';
import { tradingAPI, healthCheck } from '../services/api';

export default function Dashboard() {
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [account, setAccount] = useState<any>(null);

  useEffect(() => {
    checkConnection();
    loadAccountData();
  }, []);

  const checkConnection = async () => {
    try {
      await healthCheck();
      setStatus('connected');
    } catch (error) {
      console.error('Backend connection failed:', error);
      setStatus('error');
    }
  };

  const loadAccountData = async () => {
    try {
      const response = await tradingAPI.getPaperAccount();
      setAccount(response.data);
    } catch (error) {
      console.error('Failed to load account:', error);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome to UpTrade AI</p>
      </div>

      {/* Connection Status */}
      <div className="mb-6">
        <div className={`inline-flex items-center px-4 py-2 rounded-lg ${
          status === 'connected' ? 'bg-green-100 text-green-800' :
          status === 'error' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          <div className={`w-2 h-2 rounded-full mr-2 ${
            status === 'connected' ? 'bg-green-600' :
            status === 'error' ? 'bg-red-600' :
            'bg-yellow-600'
          }`} />
          {status === 'connected' ? 'Connected to Backend' :
           status === 'error' ? 'Backend Connection Failed' :
           'Connecting...'}
        </div>
      </div>

      {/* Account Summary */}
      {account && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Account Value</h3>
            <p className="text-3xl font-bold text-gray-900">
              ${account.equity?.toLocaleString() || '0'}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Buying Power</h3>
            <p className="text-3xl font-bold text-gray-900">
              ${account.buying_power?.toLocaleString() || '0'}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total P&L</h3>
            <p className={`text-3xl font-bold ${
              (account.equity - 100000) >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              ${((account.equity || 100000) - 100000).toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Start</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/market" className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
            <h3 className="font-semibold text-gray-900 mb-2">Analyze Markets</h3>
            <p className="text-sm text-gray-600">View real-time stock prices and technical indicators</p>
          </a>
          <a href="/trading" className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
            <h3 className="font-semibold text-gray-900 mb-2">Paper Trading</h3>
            <p className="text-sm text-gray-600">Practice trading with $100K virtual capital</p>
          </a>
          <a href="/forecasting" className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
            <h3 className="font-semibold text-gray-900 mb-2">Price Forecasting</h3>
            <p className="text-sm text-gray-600">AI-powered price predictions using ARIMA models</p>
          </a>
          <a href="/research" className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
            <h3 className="font-semibold text-gray-900 mb-2">SEC Filings</h3>
            <p className="text-sm text-gray-600">Analyze 10-K, 10-Q, and 8-K reports</p>
          </a>
        </div>
      </div>
    </div>
  );
}
