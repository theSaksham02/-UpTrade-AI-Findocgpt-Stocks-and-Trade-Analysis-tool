/**
 * Dashboard Page - Corona Template Inspired
 * Enhanced premium dashboard with comprehensive overview
 */
import { useState, useEffect } from 'react';
import { tradingAPI, healthCheck } from '../services/api';
import { 
  TrendingUp, TrendingDown, DollarSign, Activity, 
  ArrowUpRight, ArrowDownRight, ShoppingCart,
  Clock, FileText, AlertCircle 
} from 'lucide-react';

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

  // Mock data for enhanced features
  const recentActivities = [
    { id: 1, type: 'trade', title: 'AAPL Buy Order', desc: 'Bought 10 shares', time: '15 min ago', icon: TrendingUp, color: 'text-status-success' },
    { id: 2, type: 'alert', title: 'Price Alert Triggered', desc: 'TSLA reached $250', time: '1 hour ago', icon: AlertCircle, color: 'text-accent-gold' },
    { id: 3, type: 'trade', title: 'MSFT Sell Order', desc: 'Sold 5 shares', time: '2 hours ago', icon: TrendingDown, color: 'text-status-danger' },
    { id: 4, type: 'report', title: 'Daily Report Generated', desc: 'Portfolio performance summary', time: '3 hours ago', icon: FileText, color: 'text-accent-blue' },
  ];

  const quickStats = [
    { name: 'Revenue Current', value: '$17,234', change: '+11%', isPositive: true, icon: DollarSign },
    { name: 'Daily Trades', value: '12', change: '-2.4%', isPositive: false, icon: Activity },
    { name: 'Active Positions', value: '8', change: '+3.5%', isPositive: true, icon: TrendingUp },
    { name: 'Portfolio Growth', value: '15.2%', change: '+2.1%', isPositive: true, icon: ArrowUpRight },
  ];

  const transactions = [
    { date: '07 Jan 2024, 09:12AM', type: 'Stock Purchase', amount: '$593', status: 'completed' },
    { date: '06 Jan 2024, 14:30PM', type: 'Dividend Received', amount: '$236', status: 'completed' },
    { date: '05 Jan 2024, 11:45AM', type: 'Stock Sale', amount: '$1,450', status: 'completed' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gradient mb-2">Dashboard</h1>
        <p className="text-text-secondary">Welcome to UpTrade AI <span className="text-gradient-gold font-semibold">Premium</span> - Your complete trading command center</p>
      </div>

      {/* Connection Status Banner */}
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
            {status === 'connected' ? '✨ Connected to Backend - All Systems Operational' :
             status === 'error' ? 'Backend Connection Failed - Check Your Server' :
             'Connecting to Backend...'}
          </span>
        </div>
      </div>

      {/* Quick Stats Grid - Corona Inspired */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {quickStats.map((stat, index) => (
          <div key={index} className="card-premium hover:scale-105 transition-transform duration-300">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-text-muted font-medium mb-3">{stat.name}</h3>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-gradient">{stat.value}</p>
                  <span className={`text-sm font-medium ${stat.isPositive ? 'text-status-success' : 'text-status-danger'}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                stat.isPositive ? 'bg-status-success/20' : 'bg-status-danger/20'
              }`}>
                <stat.icon className={`w-6 h-6 ${stat.isPositive ? 'text-status-success' : 'text-status-danger'}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Account Stats - 3 Column */}
      {account && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card-premium group hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-text-muted font-medium">Account Value</h3>
              <div className="w-10 h-10 bg-gradient-blue rounded-lg flex items-center justify-center shadow-glow">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-4xl font-bold text-gradient mb-3">
              ${account.equity?.toLocaleString() || '100,000'}
            </p>
            <p className="text-sm text-text-secondary">Total portfolio value</p>
            <div className="mt-4 h-1.5 bg-gradient-blue rounded-full shadow-glow" />
          </div>

          <div className="card-premium group hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-text-muted font-medium">Buying Power</h3>
              <div className="w-10 h-10 bg-gradient-gold rounded-lg flex items-center justify-center shadow-glow">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-4xl font-bold text-gradient-gold mb-3">
              ${account.buying_power?.toLocaleString() || '100,000'}
            </p>
            <p className="text-sm text-text-secondary">Available for trading</p>
            <div className="mt-4 h-1.5 bg-gradient-gold rounded-full shadow-glow" />
          </div>

          <div className="card-premium group hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-text-muted font-medium">Total P&L</h3>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-glow ${
                (account.equity - 100000) >= 0 ? 'bg-status-success' : 'bg-status-danger'
              }`}>
                {(account.equity - 100000) >= 0 ? 
                  <ArrowUpRight className="w-5 h-5 text-white" /> : 
                  <ArrowDownRight className="w-5 h-5 text-white" />
                }
              </div>
            </div>
            <p className={`text-4xl font-bold mb-3 ${
              (account.equity - 100000) >= 0 ? 'text-status-success' : 'text-status-danger'
            }`}>
              ${((account.equity || 100000) - 100000).toLocaleString()}
            </p>
            <p className="text-sm text-text-secondary">
              {((account.equity - 100000) / 100000 * 100).toFixed(2)}% since inception
            </p>
            <div className={`mt-4 h-1.5 rounded-full shadow-glow ${
              (account.equity - 100000) >= 0 ? 'bg-status-success' : 'bg-status-danger'
            }`} />
          </div>
        </div>
      )}

      {/* Two Column Layout - Corona Style */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Transaction History */}
        <div className="card-premium">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gradient">Transaction History</h2>
            <a href="/portfolio" className="text-sm text-accent-blue hover:text-accent-purple transition-colors">View All →</a>
          </div>
          <div className="space-y-4">
            {transactions.map((tx, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-primary-surface rounded-xl border border-border/30 hover:border-accent-blue/50 transition-all group">
                <div>
                  <p className="font-semibold text-text-primary group-hover:text-gradient transition-colors">{tx.type}</p>
                  <p className="text-sm text-text-muted mt-1">{tx.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-gradient-gold">{tx.amount}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-status-success/20 text-status-success rounded-full">
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card-premium">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gradient">Recent Activity</h2>
            <button className="text-sm text-accent-blue hover:text-accent-purple transition-colors">Clear All</button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-4 bg-primary-surface rounded-xl border border-border/30 hover:border-accent-purple/50 transition-all group">
                <div className={`w-10 h-10 rounded-lg bg-primary-hover flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <activity.icon className={`w-5 h-5 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-text-primary group-hover:text-gradient transition-colors">{activity.title}</p>
                  <p className="text-sm text-text-muted mt-0.5">{activity.desc}</p>
                </div>
                <span className="text-xs text-text-muted whitespace-nowrap">
                  <Clock className="w-3 h-3 inline mr-1" />
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="card-premium">
        <h2 className="text-2xl font-bold text-gradient mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a href="/market" className="group relative p-6 border-2 border-border/50 rounded-xl hover:border-accent-blue/50 transition-all duration-300 hover:shadow-premium hover:scale-105 bg-gradient-to-br from-primary-surface/80 to-accent-blue/5 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-blue opacity-0 group-hover:opacity-10 transition-opacity" />
            <TrendingUp className="w-8 h-8 text-accent-blue mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-text-primary mb-2 group-hover:text-gradient transition-all">Market Analysis</h3>
            <p className="text-sm text-text-secondary">Real-time stock prices</p>
          </a>
          
          <a href="/trading" className="group relative p-6 border-2 border-border/50 rounded-xl hover:border-accent-purple/50 transition-all duration-300 hover:shadow-premium hover:scale-105 bg-gradient-to-br from-primary-surface/80 to-accent-purple/5 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-purple opacity-0 group-hover:opacity-10 transition-opacity" />
            <Activity className="w-8 h-8 text-accent-purple mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-text-primary mb-2 group-hover:text-gradient transition-all">Paper Trading</h3>
            <p className="text-sm text-text-secondary">$100K virtual capital</p>
          </a>
          
          <a href="/forecasting" className="group relative p-6 border-2 border-border/50 rounded-xl hover:border-accent-gold/50 transition-all duration-300 hover:shadow-premium hover:scale-105 bg-gradient-to-br from-primary-surface/80 to-accent-gold/5 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-10 transition-opacity" />
            <ArrowUpRight className="w-8 h-8 text-accent-gold mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-text-primary mb-2 group-hover:text-gradient-gold transition-all">AI Forecasting</h3>
            <p className="text-sm text-text-secondary">Price predictions</p>
          </a>
          
          <a href="/research" className="group relative p-6 border-2 border-border/50 rounded-xl hover:border-accent-blue/50 transition-all duration-300 hover:shadow-premium hover:scale-105 bg-gradient-to-br from-primary-surface/80 to-accent-blue/5 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-blue opacity-0 group-hover:opacity-10 transition-opacity" />
            <FileText className="w-8 h-8 text-accent-blue mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-text-primary mb-2 group-hover:text-gradient transition-all">SEC Filings</h3>
            <p className="text-sm text-text-secondary">10-K, 10-Q reports</p>
          </a>
        </div>
      </div>
    </div>
  );
}
