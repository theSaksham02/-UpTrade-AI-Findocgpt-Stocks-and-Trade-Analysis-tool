'use client';

import { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, AlertTriangle, Zap, Calendar, Newspaper, BarChart3, Activity, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, ReferenceArea } from 'recharts';
import { getStockQuote, getHistoricalData, getStockNews, searchUSStocks, type HistoricalData, type NewsItem } from '@/lib/api/stock-api';

interface MarketEvent {
  date: string;
  type: 'news' | 'anomaly' | 'forecast';
  sentiment: 'positive' | 'negative' | 'neutral';
  title: string;
  impact: number; // -100 to 100
  description: string;
}

interface AnomalyPoint {
  date: string;
  price: number;
  expectedPrice: number;
  deviation: number;
  severity: 'low' | 'medium' | 'high';
}

interface ForecastPoint {
  date: string;
  predicted: number;
  upperBound: number;
  lowerBound: number;
  confidence: number;
}

export default function VisualXPage() {
  const [symbol, setSymbol] = useState('AAPL');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ symbol: string; name: string; type: string }>>([]);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [events, setEvents] = useState<MarketEvent[]>([]);
  const [anomalies, setAnomalies] = useState<AnomalyPoint[]>([]);
  const [forecast, setForecast] = useState<ForecastPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'1M' | '3M' | '1Y' | 'ALL'>('3M');

  useEffect(() => {
    loadData(symbol);
  }, [symbol]);

  const loadData = async (ticker: string) => {
    setIsLoading(true);
    
    // Load historical data and news
    const [historical, news] = await Promise.all([
      getHistoricalData(ticker, '1Y'),
      getStockNews(ticker)
    ]);
    
    setHistoricalData(historical);
    setNewsData(news);
    
    // Generate market events from news
    const marketEvents: MarketEvent[] = news.map((item, idx) => ({
      date: item.publishedAt.split('T')[0],
      type: 'news' as const,
      sentiment: item.sentiment,
      title: item.title,
      impact: item.sentimentScore * 50, // Scale to -50 to 50
      description: item.summary
    }));
    
    // Detect anomalies using statistical analysis
    const detectedAnomalies = detectAnomalies(historical);
    setAnomalies(detectedAnomalies);
    
    // Add anomalies to events
    detectedAnomalies.forEach(anomaly => {
      marketEvents.push({
        date: anomaly.date,
        type: 'anomaly',
        sentiment: anomaly.deviation > 0 ? 'positive' : 'negative',
        title: `Anomaly Detected: ${anomaly.severity.toUpperCase()}`,
        impact: anomaly.deviation,
        description: `Price deviated ${Math.abs(anomaly.deviation).toFixed(2)}% from expected trend`
      });
    });
    
    // Generate forecast
    const forecastData = generateForecast(historical);
    setForecast(forecastData);
    
    // Add forecast points to events
    forecastData.forEach(point => {
      marketEvents.push({
        date: point.date,
        type: 'forecast',
        sentiment: 'neutral',
        title: `Forecast: $${point.predicted.toFixed(2)}`,
        impact: ((point.predicted - historical[historical.length - 1].close) / historical[historical.length - 1].close) * 100,
        description: `Predicted price with ${(point.confidence * 100).toFixed(0)}% confidence`
      });
    });
    
    setEvents(marketEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    setIsLoading(false);
  };

  // Search stocks
  useEffect(() => {
    if (searchQuery.length < 1) {
      setSearchResults([]);
      return;
    }
    
    const searchStocks = async () => {
      const results = await searchUSStocks(searchQuery);
      setSearchResults(results);
    };

    const debounce = setTimeout(searchStocks, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const selectStock = (ticker: string) => {
    setSymbol(ticker);
    setSearchQuery('');
    setSearchResults([]);
  };

  // Anomaly detection using moving average and standard deviation
  const detectAnomalies = (data: HistoricalData[]): AnomalyPoint[] => {
    const windowSize = 20;
    const anomalies: AnomalyPoint[] = [];
    
    for (let i = windowSize; i < data.length; i++) {
      const window = data.slice(i - windowSize, i);
      const mean = window.reduce((sum, d) => sum + d.close, 0) / windowSize;
      const variance = window.reduce((sum, d) => sum + Math.pow(d.close - mean, 2), 0) / windowSize;
      const stdDev = Math.sqrt(variance);
      
      const deviation = ((data[i].close - mean) / mean) * 100;
      const zScore = (data[i].close - mean) / stdDev;
      
      // Detect anomalies (z-score > 2 or < -2)
      if (Math.abs(zScore) > 2) {
        anomalies.push({
          date: data[i].date,
          price: data[i].close,
          expectedPrice: mean,
          deviation,
          severity: Math.abs(zScore) > 3 ? 'high' : Math.abs(zScore) > 2.5 ? 'medium' : 'low'
        });
      }
    }
    
    return anomalies;
  };

  // Simple linear regression forecast
  const generateForecast = (data: HistoricalData[]): ForecastPoint[] => {
    const recentData = data.slice(-30); // Use last 30 days
    const n = recentData.length;
    
    // Calculate linear regression
    const xValues = recentData.map((_, idx) => idx);
    const yValues = recentData.map(d => d.close);
    
    const sumX = xValues.reduce((a, b) => a + b, 0);
    const sumY = yValues.reduce((a, b) => a + b, 0);
    const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
    const sumXX = xValues.reduce((sum, x) => sum + x * x, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    // Calculate standard error
    const predictions = xValues.map(x => slope * x + intercept);
    const residuals = yValues.map((y, i) => y - predictions[i]);
    const mse = residuals.reduce((sum, r) => sum + r * r, 0) / n;
    const standardError = Math.sqrt(mse);
    
    // Generate forecast for next 14 days
    const forecastData: ForecastPoint[] = [];
    for (let i = 1; i <= 14; i++) {
      const x = n + i;
      const predicted = slope * x + intercept;
      const confidence = Math.max(0.5, 0.95 - (i * 0.03)); // Decrease confidence over time
      
      forecastData.push({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        predicted,
        upperBound: predicted + standardError * 2,
        lowerBound: predicted - standardError * 2,
        confidence
      });
    }
    
    return forecastData;
  };

  // Prepare timeline data for Gantt visualization
  const timelineData = historicalData.map((point, idx) => {
    const event = events.find(e => e.date === point.date);
    const anomaly = anomalies.find(a => a.date === point.date);
    
    return {
      date: point.date.substring(5), // MM-DD
      price: point.close,
      volume: point.volume / 1000000, // In millions
      hasEvent: !!event,
      eventType: event?.type,
      eventImpact: event?.impact || 0,
      hasAnomaly: !!anomaly,
      anomalySeverity: anomaly?.severity,
      sentiment: event?.sentiment
    };
  });

  // Combine historical and forecast data
  const combinedData = [
    ...historicalData.slice(-90).map(d => ({ date: d.date.substring(5), actual: d.close, forecast: null, upper: null, lower: null })),
    ...forecast.map(f => ({ date: f.date.substring(5), actual: null, forecast: f.predicted, upper: f.upperBound, lower: f.lowerBound }))
  ];

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-600 bg-clip-text text-transparent mb-2">
              VisualX - Deep Market Analysis
            </h1>
            <p className="text-white/60 text-sm md:text-base">Timeline analysis with news correlation, anomaly detection, and forecasting</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stocks to analyze... (e.g., AAPL, TSLA, NVDA)"
            className="pl-10 bg-zinc-900 border-white/10 text-white placeholder:text-white/40 h-12"
          />
          {searchResults.length > 0 && (
            <Card className="absolute top-full mt-2 w-full bg-zinc-900 border-white/10 z-50 max-h-64 overflow-y-auto">
              <CardContent className="p-2">
                {searchResults.map((result) => (
                  <button
                    key={result.symbol}
                    onClick={() => selectStock(result.symbol)}
                    className="w-full text-left px-4 py-3 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <div className="font-semibold text-white">{result.symbol}</div>
                    <div className="text-sm text-white/60">{result.name}</div>
                  </button>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Current Stock Badge */}
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-600 text-white px-4 py-2 text-base">
            Analyzing: {symbol}
          </Badge>
          <Badge variant="outline" className="border-white/20 text-white/60">
            {historicalData.length} days of data
          </Badge>
          <Badge variant="outline" className="border-yellow-500/50 text-yellow-400">
            {anomalies.length} anomalies detected
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <Tabs defaultValue="timeline" className="space-y-4">
          <TabsList className="bg-zinc-900 border border-white/10 flex-wrap h-auto">
            <TabsTrigger value="timeline" className="data-[state=active]:bg-blue-600">
              <Calendar className="w-4 h-4 mr-2" />
              Timeline View
            </TabsTrigger>
            <TabsTrigger value="anomalies" className="data-[state=active]:bg-blue-600">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Anomalies
            </TabsTrigger>
            <TabsTrigger value="forecast" className="data-[state=active]:bg-blue-600">
              <Target className="w-4 h-4 mr-2" />
              Forecast
            </TabsTrigger>
            <TabsTrigger value="sentiment" className="data-[state=active]:bg-blue-600">
              <Activity className="w-4 h-4 mr-2" />
              Sentiment Analysis
            </TabsTrigger>
          </TabsList>

          {/* Timeline Tab - Gantt-style visualization */}
          <TabsContent value="timeline" className="space-y-4">
            {/* Price Movement with Events */}
            <Card className="bg-zinc-900 border-white/10">
              <CardHeader>
                <CardTitle>Market Timeline - Price Movements & Events</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={timelineData.slice(-90)}>
                    <defs>
                      <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="date" stroke="#ffffff40" style={{ fontSize: '11px' }} />
                    <YAxis stroke="#ffffff40" style={{ fontSize: '11px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#18181b',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                      content={({ active, payload }) => {
                        if (active && payload && payload[0]) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-zinc-900 border border-white/10 rounded-lg p-3">
                              <p className="text-white font-semibold">{data.date}</p>
                              <p className="text-cyan-400">${data.price.toFixed(2)}</p>
                              {data.hasEvent && (
                                <div className="mt-2 pt-2 border-t border-white/10">
                                  <p className={`text-xs ${
                                    data.sentiment === 'positive' ? 'text-green-400' :
                                    data.sentiment === 'negative' ? 'text-red-400' : 'text-yellow-400'
                                  }`}>
                                    {data.eventType.toUpperCase()} Event
                                  </p>
                                  <p className="text-white/60 text-xs">Impact: {data.eventImpact.toFixed(1)}%</p>
                                </div>
                              )}
                              {data.hasAnomaly && (
                                <p className="text-yellow-400 text-xs mt-1">⚠️ Anomaly Detected</p>
                              )}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#06b6d4" 
                      fillOpacity={1} 
                      fill="url(#priceGradient)" 
                    />
                    {/* Mark anomalies */}
                    {timelineData.slice(-90).map((point, idx) => 
                      point.hasAnomaly ? (
                        <ReferenceLine
                          key={idx}
                          x={point.date}
                          stroke="#eab308"
                          strokeDasharray="3 3"
                          strokeWidth={2}
                        />
                      ) : null
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Event Impact Visualization */}
            <Card className="bg-zinc-900 border-white/10">
              <CardHeader>
                <CardTitle>Event Impact Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={timelineData.filter(d => d.hasEvent).slice(-30)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="date" stroke="#ffffff40" style={{ fontSize: '11px' }} />
                    <YAxis stroke="#ffffff40" style={{ fontSize: '11px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#18181b',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar 
                      dataKey="eventImpact" 
                      fill="#06b6d4"
                      radius={[4, 4, 0, 0]}
                    >
                      {timelineData.filter(d => d.hasEvent).slice(-30).map((entry, index) => (
                        <Bar 
                          key={index} 
                          fill={entry.sentiment === 'positive' ? '#10b981' : entry.sentiment === 'negative' ? '#ef4444' : '#f59e0b'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Recent Events Timeline */}
            <Card className="bg-zinc-900 border-white/10">
              <CardHeader>
                <CardTitle>Recent Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {events.slice(-20).reverse().map((event, idx) => (
                    <div key={idx} className="flex gap-3 pb-3 border-b border-white/10 last:border-0">
                      <div className="flex-shrink-0 mt-1">
                        {event.type === 'news' ? (
                          <Newspaper className="w-5 h-5 text-blue-400" />
                        ) : event.type === 'anomaly' ? (
                          <AlertTriangle className="w-5 h-5 text-yellow-400" />
                        ) : (
                          <Target className="w-5 h-5 text-purple-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold">{event.title}</span>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              event.sentiment === 'positive' ? 'border-green-500 text-green-400' :
                              event.sentiment === 'negative' ? 'border-red-500 text-red-400' :
                              'border-yellow-500 text-yellow-400'
                            }`}
                          >
                            {event.impact > 0 ? '+' : ''}{event.impact.toFixed(1)}%
                          </Badge>
                        </div>
                        <p className="text-xs text-white/60">{event.description}</p>
                        <p className="text-xs text-white/40 mt-1">{new Date(event.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Anomalies Tab */}
          <TabsContent value="anomalies" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Card className="bg-gradient-to-br from-red-500/20 to-red-500/5 border-red-500/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm">High Severity</p>
                      <p className="text-3xl font-bold text-white">{anomalies.filter(a => a.severity === 'high').length}</p>
                    </div>
                    <AlertTriangle className="w-12 h-12 text-red-400" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 border-yellow-500/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm">Medium Severity</p>
                      <p className="text-3xl font-bold text-white">{anomalies.filter(a => a.severity === 'medium').length}</p>
                    </div>
                    <Zap className="w-12 h-12 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 border-blue-500/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm">Low Severity</p>
                      <p className="text-3xl font-bold text-white">{anomalies.filter(a => a.severity === 'low').length}</p>
                    </div>
                    <Activity className="w-12 h-12 text-blue-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Anomaly Scatter Plot */}
            <Card className="bg-zinc-900 border-white/10">
              <CardHeader>
                <CardTitle>Anomaly Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis 
                      type="number" 
                      dataKey="price" 
                      name="Price" 
                      stroke="#ffffff40"
                      label={{ value: 'Price', position: 'insideBottom', offset: -5, fill: '#ffffff60' }}
                    />
                    <YAxis 
                      type="number" 
                      dataKey="deviation" 
                      name="Deviation %" 
                      stroke="#ffffff40"
                      label={{ value: 'Deviation %', angle: -90, position: 'insideLeft', fill: '#ffffff60' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#18181b',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px'
                      }}
                      cursor={{ strokeDasharray: '3 3' }}
                    />
                    <Scatter 
                      name="High Severity" 
                      data={anomalies.filter(a => a.severity === 'high')} 
                      fill="#ef4444" 
                    />
                    <Scatter 
                      name="Medium Severity" 
                      data={anomalies.filter(a => a.severity === 'medium')} 
                      fill="#f59e0b" 
                    />
                    <Scatter 
                      name="Low Severity" 
                      data={anomalies.filter(a => a.severity === 'low')} 
                      fill="#06b6d4" 
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Anomaly List */}
            <Card className="bg-zinc-900 border-white/10">
              <CardHeader>
                <CardTitle>Detected Anomalies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {anomalies.slice().reverse().map((anomaly, idx) => (
                    <div 
                      key={idx} 
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        anomaly.severity === 'high' ? 'bg-red-500/10 border border-red-500/30' :
                        anomaly.severity === 'medium' ? 'bg-yellow-500/10 border border-yellow-500/30' :
                        'bg-blue-500/10 border border-blue-500/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <AlertTriangle className={`w-5 h-5 ${
                          anomaly.severity === 'high' ? 'text-red-400' :
                          anomaly.severity === 'medium' ? 'text-yellow-400' :
                          'text-blue-400'
                        }`} />
                        <div>
                          <p className="text-sm font-semibold">{new Date(anomaly.date).toLocaleDateString()}</p>
                          <p className="text-xs text-white/60">
                            Price: ${anomaly.price.toFixed(2)} (Expected: ${anomaly.expectedPrice.toFixed(2)})
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className={`${
                          anomaly.severity === 'high' ? 'border-red-500 text-red-400' :
                          anomaly.severity === 'medium' ? 'border-yellow-500 text-yellow-400' :
                          'border-blue-500 text-blue-400'
                        }`}>
                          {anomaly.severity.toUpperCase()}
                        </Badge>
                        <p className={`text-sm font-semibold mt-1 ${anomaly.deviation > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {anomaly.deviation > 0 ? '+' : ''}{anomaly.deviation.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Forecast Tab */}
          <TabsContent value="forecast" className="space-y-4">
            <Card className="bg-zinc-900 border-white/10">
              <CardHeader>
                <CardTitle>14-Day Price Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={combinedData}>
                    <defs>
                      <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.5}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="date" stroke="#ffffff40" style={{ fontSize: '11px' }} />
                    <YAxis stroke="#ffffff40" style={{ fontSize: '11px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#18181b',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="actual" 
                      stroke="#8b5cf6" 
                      fill="url(#actualGradient)"
                      name="Historical Price"
                      strokeWidth={2}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="forecast" 
                      stroke="#06b6d4" 
                      fill="url(#forecastGradient)"
                      strokeDasharray="5 5"
                      name="Predicted Price"
                      strokeWidth={2}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="upper" 
                      stroke="#10b981" 
                      fill="none"
                      strokeDasharray="3 3"
                      name="Upper Bound"
                      strokeWidth={1}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="lower" 
                      stroke="#ef4444" 
                      fill="none"
                      strokeDasharray="3 3"
                      name="Lower Bound"
                      strokeWidth={1}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Forecast Details */}
            <Card className="bg-zinc-900 border-white/10">
              <CardHeader>
                <CardTitle>Forecast Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {forecast.slice(0, 4).map((point, idx) => (
                    <Card key={idx} className="bg-zinc-800 border-white/10">
                      <CardContent className="pt-4">
                        <p className="text-xs text-white/60 mb-1">Day {idx + 1}</p>
                        <p className="text-xl font-bold text-cyan-400">${point.predicted.toFixed(2)}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex-1">
                            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-cyan-500" 
                                style={{ width: `${point.confidence * 100}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-xs text-white/60">{(point.confidence * 100).toFixed(0)}%</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-2">Date</th>
                        <th className="text-right py-2">Predicted</th>
                        <th className="text-right py-2">Range</th>
                        <th className="text-right py-2">Confidence</th>
                      </tr>
                    </thead>
                    <tbody>
                      {forecast.map((point, idx) => (
                        <tr key={idx} className="border-b border-white/10">
                          <td className="py-2">{new Date(point.date).toLocaleDateString()}</td>
                          <td className="text-right font-semibold text-cyan-400">${point.predicted.toFixed(2)}</td>
                          <td className="text-right text-xs">
                            <span className="text-green-400">${point.upperBound.toFixed(2)}</span>
                            {' - '}
                            <span className="text-red-400">${point.lowerBound.toFixed(2)}</span>
                          </td>
                          <td className="text-right">
                            <Badge variant="outline" className="border-cyan-500/50 text-cyan-400">
                              {(point.confidence * 100).toFixed(0)}%
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sentiment Analysis Tab */}
          <TabsContent value="sentiment" className="space-y-4">
            <Card className="bg-zinc-900 border-white/10">
              <CardHeader>
                <CardTitle>Sentiment Trend Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timelineData.filter(d => d.hasEvent).slice(-30)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="date" stroke="#ffffff40" style={{ fontSize: '11px' }} />
                    <YAxis stroke="#ffffff40" style={{ fontSize: '11px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#18181b',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="eventImpact" 
                      stroke="#06b6d4" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      name="Sentiment Impact"
                    />
                    <ReferenceLine y={0} stroke="#ffffff20" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Sentiment Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-green-500/20 to-green-500/5 border-green-500/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-white/60 text-sm">Positive Events</p>
                      <p className="text-3xl font-bold text-white">
                        {events.filter(e => e.sentiment === 'positive').length}
                      </p>
                    </div>
                    <TrendingUp className="w-12 h-12 text-green-400" />
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500" 
                      style={{ 
                        width: `${(events.filter(e => e.sentiment === 'positive').length / events.length) * 100}%` 
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 border-yellow-500/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-white/60 text-sm">Neutral Events</p>
                      <p className="text-3xl font-bold text-white">
                        {events.filter(e => e.sentiment === 'neutral').length}
                      </p>
                    </div>
                    <Activity className="w-12 h-12 text-yellow-400" />
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-500" 
                      style={{ 
                        width: `${(events.filter(e => e.sentiment === 'neutral').length / events.length) * 100}%` 
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-500/20 to-red-500/5 border-red-500/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-white/60 text-sm">Negative Events</p>
                      <p className="text-3xl font-bold text-white">
                        {events.filter(e => e.sentiment === 'negative').length}
                      </p>
                    </div>
                    <TrendingDown className="w-12 h-12 text-red-400" />
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500" 
                      style={{ 
                        width: `${(events.filter(e => e.sentiment === 'negative').length / events.length) * 100}%` 
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent News with Sentiment */}
            <Card className="bg-zinc-900 border-white/10">
              <CardHeader>
                <CardTitle>Latest News & Sentiment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {newsData.slice(0, 10).map((news, idx) => (
                    <div key={idx} className="flex gap-3 pb-3 border-b border-white/10 last:border-0">
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1 text-sm">{news.title}</h4>
                        <p className="text-xs text-white/60 mb-2">{news.summary}</p>
                        <div className="flex items-center gap-3 text-xs text-white/40">
                          <span>{news.source}</span>
                          <span>•</span>
                          <span>{new Date(news.publishedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            news.sentiment === 'positive' ? 'border-green-500 text-green-400' :
                            news.sentiment === 'negative' ? 'border-red-500 text-red-400' :
                            'border-yellow-500 text-yellow-400'
                          }`}
                        >
                          {news.sentiment}
                        </Badge>
                        <span className={`text-sm font-semibold ${
                          news.sentimentScore > 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {news.sentimentScore > 0 ? '+' : ''}{news.sentimentScore.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
