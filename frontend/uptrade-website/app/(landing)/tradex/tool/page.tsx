'use client';

import { useState, useEffect } from 'react';
import { Search, X, TrendingUp, TrendingDown, BarChart3, Newspaper, MessageSquare, Activity, DollarSign, Calendar, Home } from 'lucide-react';
import Aurora from '@/components/Aurora';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { getStockQuote, getHistoricalData, getStockNews, getSocialSentiment, searchUSStocks, type StockQuote, type HistoricalData, type NewsItem, type SocialSentiment } from '@/lib/api/stock-api';
import Link from 'next/link';

export default function TradeXPage() {
  const [selectedStocks, setSelectedStocks] = useState<string[]>(['AAPL', 'GOOGL', 'MSFT']);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ symbol: string; name: string; type: string }>>([]);
  const [stockData, setStockData] = useState<Map<string, StockQuote>>(new Map());
  const [historicalData, setHistoricalData] = useState<Map<string, HistoricalData[]>>(new Map());
  const [newsData, setNewsData] = useState<Map<string, NewsItem[]>>(new Map());
  const [sentimentData, setSentimentData] = useState<Map<string, SocialSentiment[]>>(new Map());
  const [period, setPeriod] = useState<'1D' | '1M' | '1Y' | '10Y'>('1M');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize with default stocks
  useEffect(() => {
    loadInitialStocks();
  }, []);

  const loadInitialStocks = async () => {
    setIsLoading(true);
    for (const symbol of ['AAPL', 'GOOGL', 'MSFT']) {
      await loadStockData(symbol);
    }
    setIsLoading(false);
  };

  const loadStockData = async (symbol: string) => {
    const [quote, historical, news, sentiment] = await Promise.all([
      getStockQuote(symbol),
      getHistoricalData(symbol, period),
      getStockNews(symbol),
      getSocialSentiment(symbol)
    ]);
    
    setStockData(prev => new Map(prev).set(symbol, quote));
    setHistoricalData(prev => new Map(prev).set(symbol, historical));
    setNewsData(prev => new Map(prev).set(symbol, news));
    setSentimentData(prev => new Map(prev).set(symbol, sentiment));
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

  // Update historical data when period changes
  useEffect(() => {
    selectedStocks.forEach(async (symbol) => {
      const historical = await getHistoricalData(symbol, period);
      setHistoricalData(prev => new Map(prev).set(symbol, historical));
    });
  }, [period]);

  const addStock = async (symbol: string) => {
    if (selectedStocks.length >= 5) {
      alert('Maximum 5 stocks can be compared at once');
      return;
    }
    
    if (!selectedStocks.includes(symbol)) {
      setSelectedStocks([...selectedStocks, symbol]);
      await loadStockData(symbol);
    }
    
    setSearchQuery('');
    setSearchResults([]);
  };

  const removeStock = (symbol: string) => {
    setSelectedStocks(selectedStocks.filter(s => s !== symbol));
    const newStockData = new Map(stockData);
    newStockData.delete(symbol);
    setStockData(newStockData);
  };

  // Prepare chart data
  const chartData = selectedStocks.length > 0 && historicalData.get(selectedStocks[0]) ? 
    historicalData.get(selectedStocks[0])!.map((point, idx) => {
      const dataPoint: any = { date: point.date.substring(5) };
      selectedStocks.forEach(symbol => {
        const data = historicalData.get(symbol);
        if (data && data[idx]) {
          dataPoint[symbol] = data[idx].close;
        }
      });
      return dataPoint;
    }).slice(-30) : [];

  const colors = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

  // Calculate comparison metrics
  const getPerformanceRank = () => {
    return selectedStocks
      .map(symbol => {
        const quote = stockData.get(symbol);
        return { symbol, change: quote?.changePercent || 0, quote };
      })
      .sort((a, b) => b.change - a.change);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Aurora Background */}
      <div className="fixed inset-0 w-full h-full">
        <Aurora colorStops={["#6b21a8", "#8b5cf6", "#7c3aed"]} amplitude={1.2} blend={0.6} speed={0.5} />
      </div>
      
      <div className="relative z-10 p-4 md:p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-2 transition-all duration-500 hover:scale-105">
              TradeX - Stock Comparison
            </h1>
            <p className="text-white/60 text-sm md:text-base transition-colors hover:text-white/80">Compare up to 5 stocks with real-time data and sentiment analysis</p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline" className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10 transform hover:scale-105 transition-all duration-300">
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search US stocks, ETFs, options... (e.g., AAPL, TSLA, SPY)"
            className="pl-10 bg-zinc-900 border-white/10 text-white placeholder:text-white/40 h-12"
          />
          {searchResults.length > 0 && (
            <Card className="absolute top-full mt-2 w-full bg-zinc-900/90 backdrop-blur-xl border-white/10 z-50 max-h-64 overflow-y-auto shadow-2xl">
              <CardContent className="p-2">
                {searchResults.map((result) => (
                  <button
                    key={result.symbol}
                    onClick={() => addStock(result.symbol)}
                    className="w-full text-left px-4 py-3 hover:bg-white/5 rounded-lg transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-white">{result.symbol}</div>
                      <div className="text-sm text-white/60">{result.name}</div>
                    </div>
                    <Badge variant="outline" className="border-purple-500/50 text-purple-400 text-xs">
                      {result.type}
                    </Badge>
                  </button>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Selected Stocks */}
        <div className="flex flex-wrap gap-2">
          {selectedStocks.map((symbol, idx) => {
            const quote = stockData.get(symbol);
            return (
              <div
                key={symbol}
                className="flex items-center gap-2 bg-zinc-900/80 backdrop-blur-xl border border-purple-500/30 rounded-full px-4 py-2 transform hover:scale-105 transition-all duration-300 cursor-pointer hover:shadow-lg"
                style={{ borderColor: colors[idx] + '50', boxShadow: `0 0 20px ${colors[idx]}20` }}
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[idx] }} />
                <span className="font-semibold text-sm">{symbol}</span>
                {quote && (
                  <>
                    <span className="text-xs">${quote.price.toFixed(2)}</span>
                    <span className={`text-xs font-semibold ${quote.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {quote.change >= 0 ? '+' : ''}{quote.changePercent.toFixed(2)}%
                    </span>
                  </>
                )}
                <button onClick={() => removeStock(symbol)} className="ml-1 hover:bg-white/10 rounded-full p-1">
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-zinc-900 border border-white/10 flex-wrap h-auto">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="chart" className="data-[state=active]:bg-purple-600">
              <Activity className="w-4 h-4 mr-2" />
              Charts
            </TabsTrigger>
            <TabsTrigger value="metrics" className="data-[state=active]:bg-purple-600">
              <DollarSign className="w-4 h-4 mr-2" />
              Metrics
            </TabsTrigger>
            <TabsTrigger value="news" className="data-[state=active]:bg-purple-600">
              <Newspaper className="w-4 h-4 mr-2" />
              News
            </TabsTrigger>
            <TabsTrigger value="sentiment" className="data-[state=active]:bg-purple-600">
              <MessageSquare className="w-4 h-4 mr-2" />
              Sentiment
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getPerformanceRank().map(({ symbol, change, quote }, idx) => (
                <Card key={symbol} className="bg-zinc-900/80 backdrop-blur-xl border-white/10 transform hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 cursor-pointer">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[selectedStocks.indexOf(symbol)] }} />
                        <span>{symbol}</span>
                      </div>
                      <Badge variant={idx === 0 ? "default" : "outline"} className={idx === 0 ? "bg-purple-600" : ""}>
                        #{idx + 1}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {quote && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold">${quote.price.toFixed(2)}</span>
                          <div className={`flex items-center gap-1 ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {change >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                            <span className="font-semibold">{change >= 0 ? '+' : ''}{change.toFixed(2)}%</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <div className="text-white/60">Volume</div>
                            <div className="font-semibold">{(quote.volume / 1000000).toFixed(1)}M</div>
                          </div>
                          <div>
                            <div className="text-white/60">Mkt Cap</div>
                            <div className="font-semibold">${(quote.marketCap / 1000000000).toFixed(1)}B</div>
                          </div>
                          <div>
                            <div className="text-white/60">P/E</div>
                            <div className="font-semibold">{quote.pe.toFixed(1)}</div>
                          </div>
                          <div>
                            <div className="text-white/60">52W Range</div>
                            <div className="font-semibold text-xs">${quote.low52Week.toFixed(0)}-${quote.high52Week.toFixed(0)}</div>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Price Chart Tab */}
          <TabsContent value="chart" className="space-y-4">
            <Card className="bg-zinc-900/80 backdrop-blur-xl border-white/10 hover:border-purple-500/30 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <CardTitle>Price Comparison</CardTitle>
                  <div className="flex gap-2">
                    {(['1D', '1M', '1Y', '10Y'] as const).map((p) => (
                      <Button
                        key={p}
                        size="sm"
                        variant={period === p ? "default" : "outline"}
                        onClick={() => setPeriod(p)}
                        className={period === p ? "bg-purple-600" : "border-white/10 text-xs"}
                      >
                        {p}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="date" stroke="#ffffff40" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#ffffff40" style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#18181b',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Legend />
                    {selectedStocks.map((symbol, idx) => (
                      <Line
                        key={symbol}
                        type="monotone"
                        dataKey={symbol}
                        stroke={colors[idx]}
                        strokeWidth={2}
                        dot={false}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Volume Comparison */}
            <Card className="bg-zinc-900/80 backdrop-blur-xl border-white/10 hover:border-purple-500/30 transition-all duration-300">
              <CardHeader>
                <CardTitle>Volume Comparison (30D)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData.slice(-10)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="date" stroke="#ffffff40" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#ffffff40" style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#18181b',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    {selectedStocks.map((symbol, idx) => (
                      <Bar key={symbol} dataKey={symbol} fill={colors[idx]} opacity={0.8} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Metrics Tab */}
          <TabsContent value="metrics">
            <Card className="bg-zinc-900/80 backdrop-blur-xl border-white/10 hover:border-purple-500/30 transition-all duration-300">
              <CardHeader>
                <CardTitle>Detailed Metrics Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-2">Metric</th>
                        {selectedStocks.map((symbol, idx) => (
                          <th key={symbol} className="text-center py-3 px-2">
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[idx] }} />
                              {symbol}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white/10">
                        <td className="py-3 px-2 text-white/60">Price</td>
                        {selectedStocks.map(symbol => {
                          const quote = stockData.get(symbol);
                          return <td key={symbol} className="text-center py-3 px-2 font-semibold">${quote?.price.toFixed(2)}</td>;
                        })}
                      </tr>
                      <tr className="border-b border-white/10">
                        <td className="py-3 px-2 text-white/60">Change %</td>
                        {selectedStocks.map(symbol => {
                          const quote = stockData.get(symbol);
                          const change = quote?.changePercent || 0;
                          return (
                            <td key={symbol} className={`text-center py-3 px-2 font-semibold ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {change >= 0 ? '+' : ''}{change.toFixed(2)}%
                            </td>
                          );
                        })}
                      </tr>
                      <tr className="border-b border-white/10">
                        <td className="py-3 px-2 text-white/60">Volume</td>
                        {selectedStocks.map(symbol => {
                          const quote = stockData.get(symbol);
                          return <td key={symbol} className="text-center py-3 px-2">{((quote?.volume || 0) / 1000000).toFixed(1)}M</td>;
                        })}
                      </tr>
                      <tr className="border-b border-white/10">
                        <td className="py-3 px-2 text-white/60">Market Cap</td>
                        {selectedStocks.map(symbol => {
                          const quote = stockData.get(symbol);
                          return <td key={symbol} className="text-center py-3 px-2">${((quote?.marketCap || 0) / 1000000000).toFixed(1)}B</td>;
                        })}
                      </tr>
                      <tr className="border-b border-white/10">
                        <td className="py-3 px-2 text-white/60">P/E Ratio</td>
                        {selectedStocks.map(symbol => {
                          const quote = stockData.get(symbol);
                          return <td key={symbol} className="text-center py-3 px-2">{quote?.pe.toFixed(2)}</td>;
                        })}
                      </tr>
                      <tr className="border-b border-white/10">
                        <td className="py-3 px-2 text-white/60">52W High</td>
                        {selectedStocks.map(symbol => {
                          const quote = stockData.get(symbol);
                          return <td key={symbol} className="text-center py-3 px-2">${quote?.high52Week.toFixed(2)}</td>;
                        })}
                      </tr>
                      <tr>
                        <td className="py-3 px-2 text-white/60">52W Low</td>
                        {selectedStocks.map(symbol => {
                          const quote = stockData.get(symbol);
                          return <td key={symbol} className="text-center py-3 px-2">${quote?.low52Week.toFixed(2)}</td>;
                        })}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* News Tab */}
          <TabsContent value="news">
            <div className="grid grid-cols-1 gap-4">
              {selectedStocks.map((symbol, idx) => {
                const news = newsData.get(symbol);
                if (!news) return null;
                return (
                  <Card key={symbol} className="bg-zinc-900 border-white/10">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[idx] }} />
                        {symbol} News
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {news.slice(0, 5).map((item, newsIdx) => (
                        <div key={newsIdx} className="border-b border-white/10 pb-4 last:border-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h4 className="font-semibold mb-1 text-sm">{item.title}</h4>
                              <p className="text-xs text-white/60 mb-2">{item.summary}</p>
                              <div className="flex items-center gap-3 text-xs text-white/40">
                                <span>{item.source}</span>
                                <span>•</span>
                                <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                item.sentiment === 'positive'
                                  ? 'border-green-500 text-green-400'
                                  : item.sentiment === 'negative'
                                  ? 'border-red-500 text-red-400'
                                  : 'border-yellow-500 text-yellow-400'
                              }`}
                            >
                              {item.sentiment}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Sentiment Tab */}
          <TabsContent value="sentiment">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedStocks.map((symbol, idx) => {
                const sentiment = sentimentData.get(symbol);
                if (!sentiment) return null;
                return (
                  <Card key={symbol} className="bg-zinc-900 border-white/10">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[idx] }} />
                        {symbol} Social
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {sentiment.map((item, sentIdx) => (
                        <div key={sentIdx} className="space-y-2 pb-3 border-b border-white/10 last:border-0">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-sm">{item.platform}</span>
                            {item.trending && (
                              <Badge variant="outline" className="border-purple-500 text-purple-400 text-xs">
                                🔥 Trending
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-white/60">Sentiment</span>
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                item.sentiment === 'bullish'
                                  ? 'border-green-500 text-green-400'
                                  : item.sentiment === 'bearish'
                                  ? 'border-red-500 text-red-400'
                                  : 'border-yellow-500 text-yellow-400'
                              }`}
                            >
                              {item.sentiment}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-white/60">Score</span>
                            <span className={`font-semibold ${item.score > 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {item.score.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-white/60">Mentions</span>
                            <span className="font-semibold">{item.mentions.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      </div>
    </div>
  );
}
