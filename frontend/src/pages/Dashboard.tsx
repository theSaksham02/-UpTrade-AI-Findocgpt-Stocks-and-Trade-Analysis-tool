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
        <h1 className="text-4xl font-bold text-gradient">Dashboard</h1>
        <p className="mt-2 text-text-secondary">Welcome to UpTrade AI <span className="text-gradient-gold font-semibold">Premium</span></p>
      </div>

      {/* Connection Status */}
      <div className="mb-6">
        <div className={`inline-flex items-center px-6 py-3 rounded-xl shadow-premium transition-all duration-300 ${
          status === 'connected' ? 'bg-status-success/20 text-status-success border border-status-success/30' :
          status === 'error' ? 'bg-status-danger/20 text-status-danger border border-status-danger/30' :
          'bg-status-warning/20 text-status-warning border border-status-warning/30'
        }`}>
          <div className={`w-2.5 h-2.5 rounded-full mr-3 animate-pulse ${
            status === 'connected' ? 'bg-status-success glow-blue' :
            status === 'error' ? 'bg-status-danger' :
            'bg-status-warning'
          }`} />
          <span className="font-semibold">
            {status === 'connected' ? 'Connected to Backend' :
             status === 'error' ? 'Backend Connection Failed' :
             'Connecting...'}
          </span>
        </div>
      </div>

      {/* Account Summary */}
      {account && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card-premium hover:scale-105 transition-transform duration-300">
            <h3 className="text-sm font-medium text-text-muted mb-2">Account Value</h3>
            <p className="text-3xl font-bold text-gradient">
              ${account.equity?.toLocaleString() || '0'}
            </p>
            <div className="mt-3 h-1 bg-gradient-blue rounded-full" />
          </div>
          <div className="card-premium hover:scale-105 transition-transform duration-300">
            <h3 className="text-sm font-medium text-text-muted mb-2">Buying Power</h3>
            <p className="text-3xl font-bold text-gradient-gold">
              ${account.buying_power?.toLocaleString() || '0'}
            </p>
            <div className="mt-3 h-1 bg-gradient-gold rounded-full" />
          </div>
          <div className="card-premium hover:scale-105 transition-transform duration-300">
            <h3 className="text-sm font-medium text-text-muted mb-2">Total P&L</h3>
            <p className={`text-3xl font-bold ${
              (account.equity - 100000) >= 0 ? 'text-status-success' : 'text-status-danger'
            }`}>
              ${((account.equity || 100000) - 100000).toLocaleString()}
            </p>
            <div className={`mt-3 h-1 rounded-full ${
              (account.equity - 100000) >= 0 ? 'bg-status-success' : 'bg-status-danger'
            }`} />
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="card-premium">
        <h2 className="text-2xl font-bold text-gradient mb-6">Quick Start</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/market" className="group p-6 border-2 border-border/50 rounded-xl hover:border-accent-blue/50 transition-all duration-300 hover:shadow-premium hover:scale-105 bg-primary-surface/50">
            <h3 className="font-semibold text-text-primary mb-2 group-hover:text-gradient transition-all">Analyze Markets</h3>
            <p className="text-sm text-text-secondary">View real-time stock prices and technical indicators</p>
          </a>
          <a href="/trading" className="group p-6 border-2 border-border/50 rounded-xl hover:border-accent-purple/50 transition-all duration-300 hover:shadow-premium hover:scale-105 bg-primary-surface/50">
            <h3 className="font-semibold text-text-primary mb-2 group-hover:text-gradient transition-all">Paper Trading</h3>
            <p className="text-sm text-text-secondary">Practice trading with $100K virtual capital</p>
          </a>
          <a href="/forecasting" className="group p-6 border-2 border-border/50 rounded-xl hover:border-accent-gold/50 transition-all duration-300 hover:shadow-premium hover:scale-105 bg-primary-surface/50">
            <h3 className="font-semibold text-text-primary mb-2 group-hover:text-gradient-gold transition-all">Price Forecasting</h3>
            <p className="text-sm text-text-secondary">AI-powered price predictions using ARIMA models</p>
          </a>
          <a href="/research" className="group p-6 border-2 border-border/50 rounded-xl hover:border-accent-blue/50 transition-all duration-300 hover:shadow-premium hover:scale-105 bg-primary-surface/50">
            <h3 className="font-semibold text-text-primary mb-2 group-hover:text-gradient transition-all">SEC Filings</h3>
            <p className="text-sm text-text-secondary">Analyze 10-K, 10-Q, and 8-K reports</p>
          </a>
        </div>
      </div>
    </div>
  );
}
