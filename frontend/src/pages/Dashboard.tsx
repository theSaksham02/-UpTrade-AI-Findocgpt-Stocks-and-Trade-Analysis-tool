/**
 * Dashboard Page - Corona Template Inspired
 * Enhanced premium dashboard with comprehensive overview
 */
import { useState, useEffect } from 'react';
import { tradingAPI, healthCheck } from '../services/api';
import { 
  TrendingUp, TrendingDown, DollarSign, Activity, 
  ArrowUpRight, ArrowDownRight, ShoppingCart,
  FileText, AlertCircle, CheckCircle 
} from 'lucide-react';
import { Card, StatCard, QuickActionCard } from '../components/ui/Card';
import { PreviewItem } from '../components/ui/PreviewItem';
import { DashboardAreaChart, DashboardPieChart } from '../components/ui/Chart';
import { StatusTable } from '../components/ui/StatusTable';

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

  const portfolioDistribution = [
    { name: 'Stocks', value: 400 },
    { name: 'ETFs', value: 300 },
    { name: 'Crypto', value: 300 },
    { name: 'Cash', value: 200 },
  ];

  const portfolioHistory = [
    { name: 'Jan', value: 100000 },
    { name: 'Feb', value: 102000 },
    { name: 'Mar', value: 101500 },
    { name: 'Apr', value: 105000 },
    { name: 'May', value: 108000 },
    { name: 'Jun', value: 112000 },
  ];

  const marketMovers = {
    headers: ['Symbol', 'Price', 'Change', 'Volume', 'Progress'],
    data: [
      { id: 1, values: ['AAPL', '$175.23', '+1.2%', '1.2M'], progress: 75, progressColor: 'bg-status-success' },
      { id: 2, values: ['TSLA', '$245.01', '-2.5%', '2.1M'], progress: 40, progressColor: 'bg-status-danger' },
      { id: 3, values: ['AMZN', '$134.50', '+0.8%', '980K'], progress: 60, progressColor: 'bg-accent-blue' },
      { id: 4, values: ['GOOGL', '$140.10', '+1.5%', '1.5M'], progress: 85, progressColor: 'bg-accent-purple' },
    ],
  };

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
          <StatCard 
            key={index}
            title={stat.name}
            value={stat.value}
            change={stat.change}
            isPositive={stat.isPositive}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Main Account Stats - 3 Column */}
      {account && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card hoverEffect="glow">
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
          </Card>

          <Card hoverEffect="glow">
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
          </Card>

          <Card hoverEffect="glow">
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
          </Card>
        </div>
      )}

      {/* Charting Section - Full Width */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        <div className="lg:col-span-3">
          <Card>
            <h2 className="text-xl font-bold text-gradient mb-6">Portfolio Value Over Time</h2>
            <DashboardAreaChart data={portfolioHistory} dataKey="value" xAxisKey="name" />
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card>
            <h2 className="text-xl font-bold text-gradient mb-6">Portfolio Distribution</h2>
            <DashboardPieChart data={portfolioDistribution} />
          </Card>
        </div>
      </div>

      {/* Two Column Layout - Corona Style */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Transaction History */}
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gradient">Transaction History</h2>
            <a href="/portfolio" className="text-sm text-accent-blue hover:text-accent-purple transition-colors">View All →</a>
          </div>
          <div className="space-y-4">
            {transactions.map((tx, index) => (
              <PreviewItem
                key={index}
                icon={CheckCircle}
                iconColor="text-status-success"
                title={tx.type}
                description={tx.date}
              >
                <div className="text-right">
                  <p className="font-bold text-lg text-gradient-gold">{tx.amount}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-status-success/20 text-status-success rounded-full">
                    {tx.status}
                  </span>
                </div>
              </PreviewItem>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gradient">Recent Activity</h2>
            <button className="text-sm text-accent-blue hover:text-accent-purple transition-colors">Clear All</button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <PreviewItem
                key={activity.id}
                icon={activity.icon}
                iconColor={activity.color}
                title={activity.title}
                description={activity.desc}
                meta={activity.time}
              />
            ))}
          </div>
        </Card>
      </div>

      {/* Market Movers Table */}
      <div className="mb-8">
        <StatusTable 
          title="Top Market Movers"
          headers={marketMovers.headers}
          data={marketMovers.data}
        />
      </div>

      {/* Quick Actions Grid */}
      <Card>
        <h2 className="text-2xl font-bold text-gradient mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard 
            href="/market"
            title="Market Analysis"
            description="Real-time stock prices"
            icon={TrendingUp}
            color="blue"
          />
          <QuickActionCard 
            href="/trading"
            title="Paper Trading"
            description="$100K virtual capital"
            icon={Activity}
            color="purple"
          />
          <QuickActionCard 
            href="/forecasting"
            title="AI Forecasting"
            description="Price predictions"
            icon={ArrowUpRight}
            color="gold"
          />
          <QuickActionCard 
            href="/research"
            title="SEC Filings"
            description="10-K, 10-Q reports"
            icon={FileText}
            color="blue"
          />
        </div>
      </Card>
    </div>
  );
}