/**
 * Dashboard Page - Full Corona Template Integration
 * Complete premium dashboard with all Corona UI elements
 */
import { useState, useEffect } from 'react';
import { tradingAPI, healthCheck } from '../services/api';
import { 
  TrendingUp, TrendingDown, DollarSign, Activity, 
  ArrowUpRight, ArrowDownRight, ShoppingCart,
  FileText, AlertCircle
} from 'lucide-react';
import { StatCard, PreviewItem, TransactionCard, DataTable, PremiumBanner, TableColumn, TableRow } from '../components/corona';

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

  // Mock data for Corona components
  const recentActivities = [
    { id: 1, icon: TrendingUp, iconColor: 'text-status-success', title: 'AAPL Buy Order', description: 'Bought 10 shares at $175.50', time: '15 min ago' },
    { id: 2, icon: AlertCircle, iconColor: 'text-accent-gold', title: 'Price Alert', description: 'TSLA reached target price $250', time: '1 hour ago' },
    { id: 3, icon: TrendingDown, iconColor: 'text-status-danger', title: 'MSFT Sell Order', description: 'Sold 5 shares at $380.25', time: '2 hours ago' },
    { id: 4, icon: FileText, iconColor: 'text-accent-blue', title: 'Report Generated', description: 'Daily portfolio performance summary', time: '3 hours ago' },
  ];

  const transactions = [
    { date: '07 Jan 2024, 09:12AM', type: 'Stock Purchase - AAPL', amount: '$1,755.00', status: 'completed' as const },
    { date: '06 Jan 2024, 14:30PM', type: 'Dividend Received - MSFT', amount: '$236.50', status: 'completed' as const },
    { date: '05 Jan 2024, 11:45AM', type: 'Stock Sale - TSLA', amount: '$2,450.00', status: 'completed' as const },
    { date: '04 Jan 2024, 16:20PM', type: 'Stock Purchase - GOOGL', amount: '$850.75', status: 'pending' as const },
  ];

  // Order Status Table Data (Corona style)
  const orderColumns: TableColumn[] = [
    { key: 'client', label: 'Client Name', width: '20%' },
    { key: 'orderNo', label: 'Order No', width: '12%' },
    { key: 'productCost', label: 'Product Cost', width: '15%' },
    { key: 'project', label: 'Project', width: '15%' },
    { key: 'payment', label: 'Payment Mode', width: '15%' },
    { key: 'date', label: 'Start Date', width: '13%' },
    { key: 'status', label: 'Status', width: '10%' },
  ];

  const orderData: TableRow[] = [
    {
      id: 1,
      client: { type: 'image', src: '/api/placeholder/32/32', label: 'Henry Klein', alt: 'client' },
      orderNo: '02312',
      productCost: '$14,500',
      project: 'Dashboard',
      payment: 'Credit card',
      date: '04 Dec 2024',
      status: { type: 'badge', label: 'Approved', variant: 'success' }
    },
    {
      id: 2,
      client: { type: 'image', src: '/api/placeholder/32/32', label: 'Estella Bryan', alt: 'client' },
      orderNo: '02313',
      productCost: '$9,200',
      project: 'Website',
      payment: 'Cash on delivery',
      date: '04 Dec 2024',
      status: { type: 'badge', label: 'Pending', variant: 'warning' }
    },
    {
      id: 3,
      client: { type: 'image', src: '/api/placeholder/32/32', label: 'Lucy Abbott', alt: 'client' },
      orderNo: '02314',
      productCost: '$12,800',
      project: 'App design',
      payment: 'Credit card',
      date: '04 Dec 2024',
      status: { type: 'badge', label: 'Rejected', variant: 'danger' }
    },
    {
      id: 4,
      client: { type: 'image', src: '/api/placeholder/32/32', label: 'Peter Gill', alt: 'client' },
      orderNo: '02315',
      productCost: '$18,500',
      project: 'Development',
      payment: 'Online Payment',
      date: '05 Dec 2024',
      status: { type: 'badge', label: 'Approved', variant: 'success' }
    },
  ];

  return (
    <div>
      {/* Premium Banner - Corona Style */}
      <div className="mb-6">
        <PremiumBanner 
          title="🎉 New Refreshing Look for UpTrade AI Premium!"
          description="Enhanced UI with Corona admin template patterns, featuring modern cards, tables, and comprehensive dashboard views."
          buttonText="Explore Features"
          buttonHref="/market"
        />
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
            {status === 'connected' ? '✨ Connected to Backend - All Systems Operational' :
             status === 'error' ? '❌ Backend Connection Failed - Check Server' :
             '⏳ Connecting to Backend...'}
          </span>
        </div>
      </div>

      {/* Quick Stats Grid - Corona Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Revenue Current"
          value="$17,234"
          change="+11%"
          isPositive={true}
          icon={DollarSign}
          gradient="purple"
        />
        <StatCard 
          title="Daily Trades"
          value="12"
          change="-2.4%"
          isPositive={false}
          icon={Activity}
          gradient="danger"
        />
        <StatCard 
          title="Active Positions"
          value="8"
          change="+3.5%"
          isPositive={true}
          icon={TrendingUp}
          gradient="success"
        />
        <StatCard 
          title="Portfolio Growth"
          value="15.2%"
          change="+2.1%"
          isPositive={true}
          icon={ArrowUpRight}
          gradient="purple"
        />
      </div>

      {/* Main Account Stats - Enhanced with Icons */}
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

      {/* Two Column Layout - Corona Transaction & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Transaction History - Using TransactionCard */}
        <div className="card-premium">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gradient">Transaction History</h2>
            <a href="/portfolio" className="text-sm text-accent-blue hover:text-accent-purple transition-colors">View All →</a>
          </div>
          <div className="space-y-4">
            {transactions.map((tx, index) => (
              <TransactionCard 
                key={index}
                date={tx.date}
                type={tx.type}
                amount={tx.amount}
                status={tx.status}
              />
            ))}
          </div>
        </div>

        {/* Recent Activity - Using PreviewItem */}
        <div className="card-premium">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gradient">Recent Activity</h2>
            <button className="text-sm text-accent-blue hover:text-accent-purple transition-colors">Clear All</button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <PreviewItem 
                key={activity.id}
                icon={activity.icon}
                iconColor={activity.iconColor}
                title={activity.title}
                description={activity.description}
                time={activity.time}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Order Status Table - Corona Style DataTable */}
      <div className="card-premium mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gradient">Order Status</h2>
          <button className="text-sm text-accent-blue hover:text-accent-purple transition-colors">Export Data →</button>
        </div>
        <DataTable 
          columns={orderColumns}
          data={orderData}
          selectable={true}
          onRowClick={(row) => console.log('Row clicked:', row)}
        />
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
