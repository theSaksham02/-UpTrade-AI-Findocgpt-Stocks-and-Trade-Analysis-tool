import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import axios from 'axios';
import { TrendingUp, TrendingDown, BarChart3, Activity } from 'lucide-react';

interface ChartData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface TechnicalIndicators {
  SMA_20?: number;
  SMA_50?: number;
  SMA_200?: number;
  EMA_12?: number;
  EMA_26?: number;
  RSI?: number;
  BB_Upper?: number;
  BB_Middle?: number;
  BB_Lower?: number;
}

interface AdvancedChartProps {
  ticker: string;
  height?: number;
}

const CHART_TYPES = [
  { id: 'area', name: 'Area', icon: Activity },
  { id: 'line', name: 'Line', icon: TrendingUp },
  { id: 'bar', name: 'Bar', icon: BarChart3 },
];

const TIMEFRAMES = [
  { id: '1d', label: '1D', period: '1d' },
  { id: '5d', label: '5D', period: '5d' },
  { id: '1mo', label: '1M', period: '1mo' },
  { id: '3mo', label: '3M', period: '3mo' },
  { id: '6mo', label: '6M', period: '6mo' },
  { id: '1y', label: '1Y', period: '1y' },
  { id: 'ytd', label: 'YTD', period: 'ytd' },
  { id: '5y', label: '5Y', period: '5y' },
];

const INDICATORS = [
  { id: 'sma20', label: 'SMA 20', color: '#3b82f6' },
  { id: 'sma50', label: 'SMA 50', color: '#10b981' },
  { id: 'sma200', label: 'SMA 200', color: '#f59e0b' },
  { id: 'bb', label: 'Bollinger Bands', color: '#8b5cf6' },
  { id: 'rsi', label: 'RSI', color: '#ef4444' },
];

export default function AdvancedChart({ ticker, height = 500 }: AdvancedChartProps) {
  const [chartType, setChartType] = useState<string>('area');
  const [timeframe, setTimeframe] = useState<string>('1y');
  const [data, setData] = useState<ChartData[]>([]);
  const [indicators, setIndicators] = useState<TechnicalIndicators>({});
  const [activeIndicators, setActiveIndicators] = useState<string[]>(['sma20', 'sma50']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchChartData();
    fetchIndicators();
  }, [ticker, timeframe]);

  const fetchChartData = async () => {
    setLoading(true);
    setError(null);
    try {
      const period = TIMEFRAMES.find(tf => tf.id === timeframe)?.period || '1y';
      const response = await axios.get(
        `http://localhost:8000/api/v1/stocks/${ticker}/historical`,
        { params: { period } }
      );
      setData(response.data.data || response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch chart data');
    } finally {
      setLoading(false);
    }
  };

  const fetchIndicators = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/stocks/${ticker}/technical`
      );
      setIndicators(response.data.indicators || {});
    } catch (err) {
      console.error('Failed to fetch indicators:', err);
    }
  };

  const toggleIndicator = (indicatorId: string) => {
    setActiveIndicators(prev =>
      prev.includes(indicatorId)
        ? prev.filter(id => id !== indicatorId)
        : [...prev, indicatorId]
    );
  };

  const renderChart = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-full text-red-600">
          {error}
        </div>
      );
    }

    if (!data.length) {
      return (
        <div className="flex items-center justify-center h-full text-slate-500">
          No data available
        </div>
      );
    }

    const chartData = data.map(d => ({
      ...d,
      value: d.close,
    }));

    const commonProps = {
      data: chartData,
      margin: { top: 10, right: 30, left: 10, bottom: 10 },
    };

    switch (chartType) {
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart {...commonProps}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
              <YAxis domain={['auto', 'auto']} stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#colorValue)"
              />
              {activeIndicators.includes('sma20') && indicators.SMA_20 && (
                <ReferenceLine y={indicators.SMA_20} stroke="#3b82f6" strokeDasharray="3 3" />
              )}
              {activeIndicators.includes('sma50') && indicators.SMA_50 && (
                <ReferenceLine y={indicators.SMA_50} stroke="#10b981" strokeDasharray="3 3" />
              )}
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
              <YAxis domain={['auto', 'auto']} stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
              <YAxis domain={['auto', 'auto']} stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="volume" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  const currentPrice = data.length > 0 ? data[data.length - 1].close : 0;
  const previousPrice = data.length > 1 ? data[data.length - 2].close : currentPrice;
  const priceChange = currentPrice - previousPrice;
  const priceChangePercent = (priceChange / previousPrice) * 100;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{ticker}</h3>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                ${currentPrice.toFixed(2)}
              </span>
              <div className={`flex items-center gap-1 text-sm font-semibold ${
                priceChange >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {priceChange >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>
                  {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)} ({priceChangePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>

          {/* Chart Type */}
          <div className="flex gap-2">
            {CHART_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => setChartType(type.id)}
                className={`p-2 rounded-lg transition-colors ${
                  chartType === type.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
                title={type.name}
              >
                <type.icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>

        {/* Timeframes */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf.id}
              onClick={() => setTimeframe(tf.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                timeframe === tf.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>

        {/* Indicators */}
        <div className="flex gap-2 mt-3 overflow-x-auto">
          {INDICATORS.map((indicator) => (
            <button
              key={indicator.id}
              onClick={() => toggleIndicator(indicator.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap border ${
                activeIndicators.includes(indicator.id)
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-600 text-blue-600'
                  : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-slate-400'
              }`}
            >
              <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: indicator.color }} />
              {indicator.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="p-4">
        {renderChart()}
      </div>

      {/* Technical Indicators Summary */}
      {indicators && Object.keys(indicators).length > 0 && (
        <div className="px-4 pb-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          {indicators.RSI && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <p className="text-xs text-slate-500 dark:text-slate-400">RSI (14)</p>
              <p className={`text-lg font-bold ${
                indicators.RSI > 70 ? 'text-red-600' : indicators.RSI < 30 ? 'text-green-600' : 'text-slate-900 dark:text-white'
              }`}>
                {indicators.RSI.toFixed(2)}
              </p>
            </div>
          )}
          {indicators.SMA_20 && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <p className="text-xs text-slate-500 dark:text-slate-400">SMA 20</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                ${indicators.SMA_20.toFixed(2)}
              </p>
            </div>
          )}
          {indicators.SMA_50 && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <p className="text-xs text-slate-500 dark:text-slate-400">SMA 50</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                ${indicators.SMA_50.toFixed(2)}
              </p>
            </div>
          )}
          {indicators.SMA_200 && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <p className="text-xs text-slate-500 dark:text-slate-400">SMA 200</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                ${indicators.SMA_200.toFixed(2)}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
