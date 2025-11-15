'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, X, TrendingUp, TrendingDown, BarChart3, LineChart, Newspaper, MessageSquare, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart as RechartsBarChart, Bar } from 'recharts';
import { getStockQuote, getHistoricalData, getStockNews, getSocialSentiment, searchUSStocks, type StockQuote, type HistoricalData, type NewsItem, type SocialSentiment } from '@/lib/api/stock-api';
import Link from 'next/link';

export default function TradeXPage() {
  const [selectedStocks, setSelectedStocks] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ symbol: string; name: string; type: string }>>([]);
  const [stockData, setStockData] = useState<Map<string, StockQuote>>(new Map());
  const [historicalData, setHistoricalData] = useState<Map<string, HistoricalData[]>>(new Map());
  const [newsData, setNewsData] = useState<Map<string, NewsItem[]>>(new Map());
  const [sentimentData, setSentimentData] = useState<Map<string, SocialSentiment[]>>(new Map());
  const [period, setPeriod] = useState<'1D' | '1M' | '1Y' | '10Y'>('1M');
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Search stocks
  useEffect(() => {
    const searchStocks = async () => {
      if (searchQuery.length < 1) {
        setSearchResults([]);
        return;
      }
      
      setIsSearching(true);
      const results = await searchUSStocks(searchQuery);
      setSearchResults(results);
      setIsSearching(false);
    };

    const debounce = setTimeout(searchStocks, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  // Add stock to comparison
  const addStock = async (symbol: string) => {
    if (selectedStocks.length >= 5) {
      alert('Maximum 5 stocks can be compared at once');
      return;
    }
    
    if (!selectedStocks.includes(symbol)) {
      setIsLoading(true);
      setSelectedStocks([...selectedStocks, symbol]);
      
      // Fetch all data for this stock
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
      setIsLoading(false);
    }
    
    setSearchQuery('');
    setSearchResults([]);
  };

  // Remove stock from comparison
  const removeStock = (symbol: string) => {
    setSelectedStocks(selectedStocks.filter(s => s !== symbol));
    
    const newStockData = new Map(stockData);
    newStockData.delete(symbol);
    setStockData(newStockData);
    
    const newHistoricalData = new Map(historicalData);
    newHistoricalData.delete(symbol);
    setHistoricalData(newHistoricalData);
    
    const newNewsData = new Map(newsData);
    newNewsData.delete(symbol);
    setNewsData(newNewsData);
    
    const newSentimentData = new Map(sentimentData);
    newSentimentData.delete(symbol);
    setSentimentData(newSentimentData);
  };

  // Update historical data when period changes
  useEffect(() => {
    const updateHistoricalData = async () => {
      if (selectedStocks.length === 0) return;
      
      setIsLoading(true);
      const updates = await Promise.all(
        selectedStocks.map(symbol => getHistoricalData(symbol, period))
      );
      
      const newHistoricalData = new Map(historicalData);
      selectedStocks.forEach((symbol, idx) => {
        newHistoricalData.set(symbol, updates[idx]);
      });
      setHistoricalData(newHistoricalData);
      setIsLoading(false);
    };

    updateHistoricalData();
  }, [period]);

  // Prepare chart data
  const chartData = selectedStocks.length > 0 && historicalData.get(selectedStocks[0]) ? 
    historicalData.get(selectedStocks[0])!.map((point, idx) => {
      const dataPoint: any = { date: point.date };
      selectedStocks.forEach(symbol => {
        const data = historicalData.get(symbol);
        if (data && data[idx]) {
          dataPoint[symbol] = data[idx].close;
        }
      });
      return dataPoint;
    }).slice(-100) : [];

  const colors = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

  // Comparison metrics data
  const comparisonData = selectedStocks.map((symbol, idx) => {
    const quote = stockData.get(symbol);
    return {
      symbol,
      changePercent: quote?.changePercent || 0,
      volume: quote?.volume || 0,
      marketCap: quote?.marketCap || 0,
      pe: quote?.pe || 0,
      color: colors[idx]
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
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                  TradeX
                </h1>
                <p className="text-xs text-white/40">Multi-Stock Comparison</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-green-500/50 text-green-400">
                ● Live Data
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Search Bar */}
        <Card className="bg-zinc-900 border-white/10">
          <CardContent className="p-4">
            <div className="relative">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search US stocks, ETFs, options... (AAPL, GOOGL, TSLA, SPY, QQQ)"
                    className="pl-10 bg-zinc-800 border-white/10 text-white placeholder:text-white/40 h-12 focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-zinc-800 border border-white/20 rounded-lg z-50 max-h-64 overflow-y-auto shadow-2xl">
                  {searchResults.map((result) => (
                    <button
                      key={result.symbol}
                      onClick={() => addStock(result.symbol)}
                      disabled={selectedStocks.includes(result.symbol)}
                      className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div>
                        <div className="font-semibold text-white">{result.symbol}</div>
                        <div className="text-sm text-white/60 truncate max-w-md">{result.name}</div>
                      </div>
                      <Badge variant="outline" className="border-purple-500/50 text-purple-400 text-xs">
                        {result.type}
                      </Badge>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Stocks Pills */}
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedStocks.map((symbol, idx) => {
                const quote = stockData.get(symbol);
                return (
                  <div
                    key={symbol}
                    className="flex items-center gap-2 bg-zinc-800 border border-white/20 rounded-full px-4 py-2"
                    style={{ borderColor: `${colors[idx]}40` }}
                  >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[idx] }} />
                    <span className="font-semibold text-sm">{symbol}</span>
                    {quote && (
                      <>
                        <span className="text-xs text-white/60">${quote.price.toFixed(2)}</span>
                        <span className={`text-xs font-medium ${quote.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {quote.change >= 0 ? '+' : ''}{quote.changePercent.toFixed(2)}%
                        </span>
                      </>
                    )}
                    <button
                      onClick={() => removeStock(symbol)}
                      className="ml-1 hover:bg-white/10 rounded-full p-1 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
              {selectedStocks.length === 0 && (
                <div className="text-white/40 text-sm py-2">Add stocks to compare (max 5)</div>
              )}
              {selectedStocks.length > 0 && selectedStocks.length < 5 && (
                <div className="text-white/30 text-xs py-2">
                  {5 - selectedStocks.length} more slot{5 - selectedStocks.length !== 1 ? 's' : ''} available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        {selectedStocks.length > 0 ? (
          <Tabs defaultValue="chart" className="space-y-6">
            <TabsList className="bg-zinc-900 border border-white/10 p-1">
              <TabsTrigger value="chart" className="data-[state=active]:bg-purple-600">
                <LineChart className="w-4 h-4 mr-2" />
                Price Chart
              </TabsTrigger>
              <TabsTrigger value="metrics" className="data-[state=active]:bg-purple-600">
                <BarChart3 className="w-4 h-4 mr-2" />
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

            {/* Price Chart */}
            <TabsContent value="chart" className="space-y-4">
              <Card className="bg-zinc-900 border-white/10">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Price Comparison</CardTitle>
                    <div className="flex gap-2">
                      {(['1D', '1M', '1Y', '10Y'] as const).map((p) => (
                        <Button
                          key={p}
                          size="sm"
                          variant={period === p ? "default" : "outline"}
                          onClick={() => setPeriod(p)}
                          className={period === p ? "bg-purple-600 hover:bg-purple-700" : "border-white/10 hover:bg-white/5"}
                        >
                          {p}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="h-[400px] flex items-center justify-center">
                      <div className="text-white/40">Loading chart data...</div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={400}>
                      <AreaChart data={chartData}>
                        <defs>
                          {selectedStocks.map((symbol, idx) => (
                            <linearGradient key={symbol} id={`color${symbol}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={colors[idx]} stopOpacity={0.3}/>
                              <stop offset="95%" stopColor={colors[idx]} stopOpacity={0}/>
                            </linearGradient>
                          ))}
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                        <XAxis 
                          dataKey="date" 
                          stroke="#ffffff40"
                          tick={{ fill: '#ffffff60', fontSize: 12 }}
                        />
                        <YAxis 
                          stroke="#ffffff40"
                          tick={{ fill: '#ffffff60', fontSize: 12 }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#18181b',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            color: '#fff'
                          }}
                        />
                        <Legend wrapperStyle={{ color: '#fff' }} />
                        {selectedStocks.map((symbol, idx) => (
                          <Area
                            key={symbol}
                            type="monotone"
                            dataKey={symbol}
                            stroke={colors[idx]}
                            fill={`url(#color${symbol})`}
                            strokeWidth={2}
                          />
                        ))}
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              {/* Performance Comparison Bar Chart */}
              <Card className="bg-zinc-900 border-white/10">
                <CardHeader>
                  <CardTitle>Performance Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsBarChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                      <XAxis 
                        dataKey="symbol" 
                        stroke="#ffffff40"
                        tick={{ fill: '#ffffff60', fontSize: 12 }}
                      />
                      <YAxis 
                        stroke="#ffffff40"
                        tick={{ fill: '#ffffff60', fontSize: 12 }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#18181b',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                      />
                      <Bar dataKey="changePercent" name="Change %" fill="#8b5cf6" radius={[8, 8, 0, 0]}>
                        {comparisonData.map((entry, index) => (
                          <Bar key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Key Metrics */}
            <TabsContent value="metrics">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {selectedStocks.map((symbol, idx) => {
                  const quote = stockData.get(symbol);
                  if (!quote) return null;

                  return (
                    <Card key={symbol} className="bg-zinc-900 border-white/10 hover:border-purple-500/50 transition-colors">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center justify-between text-lg">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[idx] }} />
                            <span>{symbol}</span>
                          </div>
                          <div className={`flex items-center ${quote.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {quote.change >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-white/60 text-sm">Price</span>
                          <span className="font-bold text-lg">${quote.price.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/60 text-sm">Change</span>
                          <span className={`font-semibold ${quote.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {quote.change >= 0 ? '+' : ''}{quote.changePercent.toFixed(2)}%
                          </span>
                        </div>
                        <div className="h-px bg-white/10 my-2" />
                        <div className="flex justify-between items-center">
                          <span className="text-white/60 text-sm">Volume</span>
                          <span className="font-medium text-sm">{(quote.volume / 1000000).toFixed(2)}M</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/60 text-sm">Market Cap</span>
                          <span className="font-medium text-sm">${(quote.marketCap / 1000000000).toFixed(2)}B</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/60 text-sm">P/E Ratio</span>
                          <span className="font-medium text-sm">{quote.pe.toFixed(2)}</span>
                        </div>
                        <div className="h-px bg-white/10 my-2" />
                        <div className="flex justify-between items-center">
                          <span className="text-white/60 text-sm">52W High</span>
                          <span className="font-medium text-sm">${quote.high52Week.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/60 text-sm">52W Low</span>
                          <span className="font-medium text-sm">${quote.low52Week.toFixed(2)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* News Feed */}
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
                          {symbol} News Feed
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {news.map((item, newsIdx) => (
                          <a
                            key={newsIdx}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block border-b border-white/10 pb-4 last:border-0 hover:bg-white/5 -mx-6 px-6 py-4 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <h4 className="font-semibold mb-2 text-white hover:text-purple-400 transition-colors">{item.title}</h4>
                                <p className="text-sm text-white/60 mb-2 line-clamp-2">{item.summary}</p>
                                <div className="flex items-center gap-3 text-xs text-white/40">
                                  <span className="font-medium">{item.source}</span>
                                  <span>•</span>
                                  <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                                  <span>•</span>
                                  <span>{new Date(item.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                              </div>
                              <Badge
                                variant="outline"
                                className={
                                  item.sentiment === 'positive'
                                    ? 'border-green-500/50 text-green-400 bg-green-500/10'
                                    : item.sentiment === 'negative'
                                    ? 'border-red-500/50 text-red-400 bg-red-500/10'
                                    : 'border-yellow-500/50 text-yellow-400 bg-yellow-500/10'
                                }
                              >
                                {item.sentiment}
                              </Badge>
                            </div>
                          </a>
                        ))}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Social Sentiment */}
            <TabsContent value="sentiment">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedStocks.map((symbol, idx) => {
                  const sentiment = sentimentData.get(symbol);
                  if (!sentiment) return null;

                  return (
                    <Card key={symbol} className="bg-zinc-900 border-white/10">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[idx] }} />
                          {symbol} Social Sentiment
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {sentiment.map((item, sentIdx) => (
                          <div key={sentIdx} className="space-y-3 pb-4 border-b border-white/10 last:border-0">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-lg">{item.platform}</span>
                              {item.trending && (
                                <Badge variant="outline" className="border-orange-500/50 text-orange-400 bg-orange-500/10">
                                  🔥 Trending
                                </Badge>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-zinc-800 rounded-lg p-3">
                                <div className="text-white/60 text-xs mb-1">Sentiment</div>
                                <Badge
                                  variant="outline"
                                  className={
                                    item.sentiment === 'bullish'
                                      ? 'border-green-500/50 text-green-400 bg-green-500/10'
                                      : item.sentiment === 'bearish'
                                      ? 'border-red-500/50 text-red-400 bg-red-500/10'
                                      : 'border-yellow-500/50 text-yellow-400 bg-yellow-500/10'
                                  }
                                >
                                  {item.sentiment.toUpperCase()}
                                </Badge>
                              </div>
                              <div className="bg-zinc-800 rounded-lg p-3">
                                <div className="text-white/60 text-xs mb-1">Score</div>
                                <div className={`font-bold text-lg ${item.score > 0 ? 'text-green-400' : item.score < 0 ? 'text-red-400' : 'text-yellow-400'}`}>
                                  {item.score > 0 ? '+' : ''}{item.score.toFixed(2)}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between bg-zinc-800 rounded-lg p-3">
                              <span className="text-white/60 text-sm">Mentions (24h)</span>
                              <span className="font-bold text-white">{item.mentions.toLocaleString()}</span>
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
        ) : (
          <Card className="bg-zinc-900 border-white/10">
            <CardContent className="flex flex-col items-center justify-center py-20">
              <BarChart3 className="w-20 h-20 text-white/10 mb-4" />
              <h3 className="text-2xl font-semibold text-white/60 mb-2">No Stocks Selected</h3>
              <p className="text-white/40 text-center max-w-md mb-6">
                Search for stocks above and add them to start comparing. Compare up to 5 stocks with real-time data, news, and sentiment analysis.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA'].map(symbol => (
                  <Button
                    key={symbol}
                    variant="outline"
                    size="sm"
                    onClick={() => addStock(symbol)}
                    className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                  >
                    + {symbol}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
