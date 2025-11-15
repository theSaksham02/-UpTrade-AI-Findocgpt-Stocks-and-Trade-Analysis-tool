'use client';

import { useState, useEffect } from 'react';
import { Search, ArrowLeft, TrendingUp, TrendingDown, AlertTriangle, Zap, Calendar, Activity, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ComposedChart, Bar } from 'recharts';
import { getStockQuote, getHistoricalData, getStockNews, searchUSStocks } from '@/lib/api/stock-api';
import { generateForecast, detectAnomalies, generateMarketEvents, analyzeSentimentTrend, type ForecastPoint, type AnomalyPoint, type MarketEvent } from '@/lib/api/forecast-api';
import Link from 'next/link';

export default function VisualXPage() {
  const [symbol, setSymbol] = useState('AAPL');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ symbol: string; name: string; type: string }>>([]);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [forecastData, setForecastData] = useState<ForecastPoint[]>([]);
  const [anomalies, setAnomalies] = useState<AnomalyPoint[]>([]);
  const [events, setEvents] = useState<MarketEvent[]>([]);
  const [sentimentTrend, setSentimentTrend] = useState<any[]>([]);
  const [stockInfo, setStockInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [period, setPeriod] = useState<'1M' | '1Y'>('1M');

  // Load initial data
  useEffect(() => {
    loadStockData(symbol);
  }, [symbol, period]);

  // Search stocks
  useEffect(() => {
    const searchStocks = async () => {
      if (searchQuery.length < 1) {
        setSearchResults([]);
        return;
      }
      const results = await searchUSStocks(searchQuery);
      setSearchResults(results);
    };

    const debounce = setTimeout(searchStocks, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const loadStockData = async (ticker: string) => {
    setIsLoading(true);
    
    try {
      // Fetch all data in parallel
      const [quote, historical, news] = await Promise.all([
        getStockQuote(ticker),
        getHistoricalData(ticker, period),
        getStockNews(ticker)
      ]);

      setStockInfo(quote);
      setHistoricalData(historical);

      // Generate forecast
      const forecast = generateForecast(historical, 30);
      setForecastData(forecast);

      // Detect anomalies
      const detectedAnomalies = detectAnomalies(historical);
      setAnomalies(detectedAnomalies);

      // Generate market events
      const marketEvents = generateMarketEvents(historical, news);
      setEvents(marketEvents);

      // Analyze sentiment trend
      const sentiment = analyzeSentimentTrend(news);
      setSentimentTrend(sentiment);

    } catch (error) {
      console.error('Error loading stock data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectStock = (ticker: string) => {
    setSymbol(ticker);
    setSearchQuery('');
    setSearchResults([]);
  };

  // Prepare combined chart data (historical + forecast)
  const combinedData = [
    ...historicalData.map(d => ({
      date: d.date,
      actual: d.close,
      type: 'historical'
    })),
    ...forecastData.map(d => ({
      date: d.date,
      predicted: d.predicted,
      upper: d.upper,
      lower: d.lower,
      type: 'forecast'
    }))
  ];

  // Prepare Gantt-style event data
  const ganttData = events.map((event, idx) => {
    const dateTime = new Date(event.date).getTime();
    const matchingData = historicalData.find(d => d.date === event.date);
    return {
      ...event,
      x: dateTime,
      y: matchingData ? matchingData.close : 0,
      index: idx
    };
  });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-zinc-950 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div className="h-6 w-px bg-white/10" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-600 bg-clip-text text-transparent">
                  VisualX
                </h1>
                <p className="text-xs text-white/40">Deep Market Analysis & Forecasting</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {stockInfo && (
                <Badge variant="outline" className={`${stockInfo.change >= 0 ? 'border-green-500/50 text-green-400' : 'border-red-500/50 text-red-400'}`}>
                  {symbol} ${stockInfo.price.toFixed(2)} ({stockInfo.change >= 0 ? '+' : ''}{stockInfo.changePercent.toFixed(2)}%)
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Search */}
        <Card className="bg-zinc-900 border-white/10">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stocks to analyze..."
                className="pl-10 bg-zinc-800 border-white/10 text-white"
              />
              
              {searchResults.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-zinc-800 border border-white/20 rounded-lg z-50 max-h-64 overflow-y-auto">
                  {searchResults.map((result) => (
                    <button
                      key={result.symbol}
                      onClick={() => selectStock(result.symbol)}
                      className="w-full text-left px-4 py-3 hover:bg-white/5"
                    >
                      <div className="font-semibold">{result.symbol}</div>
                      <div className="text-sm text-white/60 truncate">{result.name}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        {stockInfo && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/50">
              <CardContent className="p-4">
                <div className="text-white/60 text-sm mb-1">Current Price</div>
                <div className="text-2xl font-bold">${stockInfo.price.toFixed(2)}</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 border-blue-500/50">
              <CardContent className="p-4">
                <div className="text-white/60 text-sm mb-1">Anomalies Detected</div>
                <div className="text-2xl font-bold">{anomalies.length}</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-green-500/50">
              <CardContent className="p-4">
                <div className="text-white/60 text-sm mb-1">Market Events</div>
                <div className="text-2xl font-bold">{events.length}</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-orange-500/20 to-red-600/20 border-orange-500/50">
              <CardContent className="p-4">
                <div className="text-white/60 text-sm mb-1">30-Day Forecast</div>
                <div className="text-2xl font-bold">${forecastData[forecastData.length - 1]?.predicted.toFixed(2) || '0.00'}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {isLoading ? (
          <Card className="bg-zinc-900 border-white/10">
            <CardContent className="flex items-center justify-center py-20">
              <div className="text-white/40">Loading deep analysis...</div>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="timeline" className="space-y-6">
            <TabsList className="bg-zinc-900 border border-white/10 p-1">
              <TabsTrigger value="timeline" className="data-[state=active]:bg-blue-600">
                <Calendar className="w-4 h-4 mr-2" />
                Event Timeline
              </TabsTrigger>
              <TabsTrigger value="forecast" className="data-[state=active]:bg-blue-600">
                <TrendingUp className="w-4 h-4 mr-2" />
                Forecast
              </TabsTrigger>
              <TabsTrigger value="anomalies" className="data-[state=active]:bg-blue-600">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Anomalies
              </TabsTrigger>
              <TabsTrigger value="sentiment" className="data-[state=active]:bg-blue-600">
                <Activity className="w-4 h-4 mr-2" />
                Sentiment
              </TabsTrigger>
            </TabsList>

            {/* Gantt-Style Event Timeline */}
            <TabsContent value="timeline" className="space-y-4">
              <Card className="bg-zinc-900 border-white/10">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Market Events Timeline</CardTitle>
                    <div className="flex gap-2">
                      {(['1M', '1Y'] as const).map((p) => (
                        <Button
                          key={p}
                          size="sm"
                          variant={period === p ? "default" : "outline"}
                          onClick={() => setPeriod(p)}
                          className={period === p ? "bg-blue-600" : "border-white/10"}
                        >
                          {p}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <ComposedChart data={historicalData}>
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                      <XAxis dataKey="date" stroke="#ffffff40" tick={{ fill: '#ffffff60', fontSize: 12 }} />
                      <YAxis stroke="#ffffff40" tick={{ fill: '#ffffff60', fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#18181b',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px'
                        }}
                      />
                      <Area type="monotone" dataKey="close" stroke="#3b82f6" fill="url(#colorPrice)" strokeWidth={2} />
                      {anomalies.map((anomaly, idx) => {
                        const dataPoint = historicalData.find(d => d.date === anomaly.date);
                        if (!dataPoint) return null;
                        return (
                          <Scatter
                            key={idx}
                            data={[{ x: dataPoint.date, y: dataPoint.close }]}
                            fill={anomaly.severity === 'high' ? '#ef4444' : anomaly.severity === 'medium' ? '#f59e0b' : '#fbbf24'}
                            shape="star"
                          />
                        );
                      })}
                    </ComposedChart>
                  </ResponsiveContainer>
                  
                  {/* Event List */}
                  <div className="mt-6 space-y-2 max-h-96 overflow-y-auto">
                    {events.slice(0, 20).map((event, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-4 p-3 bg-zinc-800 rounded-lg hover:bg-zinc-750 transition-colors"
                      >
                        <div className="flex-shrink-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            event.impact === 'positive' ? 'bg-green-500/20 text-green-400' :
                            event.impact === 'negative' ? 'bg-red-500/20 text-red-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {event.impact === 'positive' ? <TrendingUp className="w-5 h-5" /> :
                             event.impact === 'negative' ? <TrendingDown className="w-5 h-5" /> :
                             <Activity className="w-5 h-5" />}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm text-white/60">{event.date}</span>
                            <span className="text-xs text-white/40">•</span>
                            <span className="text-xs text-white/40">{event.time}</span>
                            <Badge variant="outline" className="text-xs border-white/20">
                              {event.source}
                            </Badge>
                          </div>
                          <div className="font-medium text-white mb-1">{event.event}</div>
                          {event.relatedNews.length > 0 && (
                            <div className="text-xs text-white/40">
                              {event.relatedNews.length} related news articles
                            </div>
                          )}
                        </div>
                        <Badge
                          variant="outline"
                          className={`flex-shrink-0 ${
                            event.impact === 'positive' ? 'border-green-500/50 text-green-400' :
                            event.impact === 'negative' ? 'border-red-500/50 text-red-400' :
                            'border-yellow-500/50 text-yellow-400'
                          }`}
                        >
                          {event.impact}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Forecast */}
            <TabsContent value="forecast" className="space-y-4">
              <Card className="bg-zinc-900 border-white/10">
                <CardHeader>
                  <CardTitle>30-Day Price Forecast</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={combinedData}>
                      <defs>
                        <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                      <XAxis dataKey="date" stroke="#ffffff40" tick={{ fill: '#ffffff60', fontSize: 12 }} />
                      <YAxis stroke="#ffffff40" tick={{ fill: '#ffffff60', fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#18181b',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px'
                        }}
                      />
                      <Area type="monotone" dataKey="actual" stroke="#3b82f6" fill="url(#colorActual)" strokeWidth={2} name="Historical" />
                      <Area type="monotone" dataKey="predicted" stroke="#10b981" fill="url(#colorForecast)" strokeWidth={2} strokeDasharray="5 5" name="Forecast" />
                      <Area type="monotone" dataKey="upper" stroke="#10b981" fill="none" strokeWidth={1} strokeDasharray="2 2" name="Upper Bound" />
                      <Area type="monotone" dataKey="lower" stroke="#10b981" fill="none" strokeWidth={1} strokeDasharray="2 2" name="Lower Bound" />
                    </AreaChart>
                  </ResponsiveContainer>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-zinc-800 border-white/10">
                      <CardContent className="p-4">
                        <div className="text-white/60 text-sm mb-1">Current Price</div>
                        <div className="text-2xl font-bold text-blue-400">
                          ${historicalData[historicalData.length - 1]?.close.toFixed(2)}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-zinc-800 border-white/10">
                      <CardContent className="p-4">
                        <div className="text-white/60 text-sm mb-1">30-Day Forecast</div>
                        <div className="text-2xl font-bold text-green-400">
                          ${forecastData[forecastData.length - 1]?.predicted.toFixed(2)}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-zinc-800 border-white/10">
                      <CardContent className="p-4">
                        <div className="text-white/60 text-sm mb-1">Predicted Change</div>
                        <div className={`text-2xl font-bold ${
                          forecastData[forecastData.length - 1]?.predicted > historicalData[historicalData.length - 1]?.close 
                            ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {((forecastData[forecastData.length - 1]?.predicted - historicalData[historicalData.length - 1]?.close) / 
                            historicalData[historicalData.length - 1]?.close * 100).toFixed(2)}%
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Anomalies */}
            <TabsContent value="anomalies" className="space-y-4">
              <Card className="bg-zinc-900 border-white/10">
                <CardHeader>
                  <CardTitle>Detected Anomalies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {anomalies.map((anomaly, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-lg border ${
                          anomaly.severity === 'high' ? 'bg-red-500/10 border-red-500/50' :
                          anomaly.severity === 'medium' ? 'bg-orange-500/10 border-orange-500/50' :
                          'bg-yellow-500/10 border-yellow-500/50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className={`w-5 h-5 ${
                                anomaly.severity === 'high' ? 'text-red-400' :
                                anomaly.severity === 'medium' ? 'text-orange-400' :
                                'text-yellow-400'
                              }`} />
                              <span className="font-semibold">{anomaly.type.toUpperCase()} ANOMALY</span>
                              <Badge variant="outline" className={
                                anomaly.severity === 'high' ? 'border-red-500/50 text-red-400' :
                                anomaly.severity === 'medium' ? 'border-orange-500/50 text-orange-400' :
                                'border-yellow-500/50 text-yellow-400'
                              }>
                                {anomaly.severity}
                              </Badge>
                            </div>
                            <p className="text-white/80 mb-2">{anomaly.description}</p>
                            <div className="flex items-center gap-3 text-sm text-white/60">
                              <span>{anomaly.date}</span>
                              <span>•</span>
                              <span>Score: {anomaly.anomalyScore.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sentiment Analysis */}
            <TabsContent value="sentiment" className="space-y-4">
              <Card className="bg-zinc-900 border-white/10">
                <CardHeader>
                  <CardTitle>Sentiment Trend Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={sentimentTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                      <XAxis dataKey="date" stroke="#ffffff40" tick={{ fill: '#ffffff60', fontSize: 12 }} />
                      <YAxis yAxisId="left" stroke="#ffffff40" tick={{ fill: '#ffffff60', fontSize: 12 }} />
                      <YAxis yAxisId="right" orientation="right" stroke="#ffffff40" tick={{ fill: '#ffffff60', fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#18181b',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px'
                        }}
                      />
                      <Line yAxisId="left" type="monotone" dataKey="avgSentiment" stroke="#3b82f6" strokeWidth={2} name="Avg Sentiment" />
                      <Bar yAxisId="right" dataKey="newsCount" fill="#10b981" opacity={0.3} name="News Count" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
