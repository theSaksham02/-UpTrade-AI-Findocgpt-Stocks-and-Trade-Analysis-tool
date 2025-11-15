"use client"

import { useState } from "react"
import { Search, TrendingUp, TrendingDown, DollarSign, BarChart3, Calendar, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { InteractiveChart } from "./interactive-chart"
import { 
  getStockQuote, 
  getHistoricalData, 
  getStockNews,
  type StockQuote,
  type HistoricalDataPoint,
  type NewsArticle
} from "@/lib/api-client"

type ChartPeriod = "1D" | "1M" | "1Y" | "10Y"

export default function StockSearchRealTime() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStock, setSelectedStock] = useState<string | null>(null)
  const [stockData, setStockData] = useState<StockQuote | null>(null)
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([])
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([])
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>("1M")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    setLoading(true)
    setError(null)
    setSelectedStock(searchQuery.toUpperCase())

    try {
      // Fetch all data in parallel for faster loading
      const [quote, news, historical] = await Promise.all([
        getStockQuote(searchQuery),
        getStockNews(searchQuery),
        getHistoricalData(searchQuery, chartPeriod)
      ])

      setStockData(quote)
      setNewsArticles(news)
      setHistoricalData(historical)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch real-time stock data'
      setError(errorMessage)
      console.error('Stock search error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handlePeriodChange = async (period: ChartPeriod) => {
    if (!selectedStock) return
    
    setChartPeriod(period)
    setLoading(true)
    setError(null)

    try {
      const historical = await getHistoricalData(selectedStock, period)
      setHistoricalData(historical)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch historical data'
      setError(errorMessage)
      console.error('Period change error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const priceChange = stockData ? stockData.change : 0
  const priceChangePercent = stockData ? stockData.changePercent : 0
  const isPositive = priceChange >= 0

  return (
    <div className="p-6 space-y-6">
      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Search & Analysis</CardTitle>
          <CardDescription>Search for real-time stock data, historical charts, and latest news</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter stock symbol (e.g., AAPL, MSFT, GOOGL)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
              disabled={loading}
            />
            <Button onClick={handleSearch} disabled={loading}>
              <Search className="w-4 h-4 mr-2" />
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>
          
          {/* Error Display */}
          {error && (
            <Card className="mt-4 border-red-500/50 bg-red-50/5">
              <CardContent className="p-4 flex items-center gap-2 text-red-500">
                <AlertCircle className="w-5 h-5" />
                <div>
                  <p className="font-semibold">Error fetching data</p>
                  <p className="text-sm">{error}</p>
                  <p className="text-xs mt-1">Make sure the backend server is running and API keys are configured.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Stock Data Display */}
      {stockData && selectedStock && !error && (
        <div className="space-y-6">
          {/* Stock Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{selectedStock}</CardTitle>
                  <CardDescription>{stockData.name}</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">${stockData.price.toFixed(2)}</div>
                  <div className={`flex items-center gap-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span className="font-semibold">
                      {isPositive ? '+' : ''}{priceChange.toFixed(2)} ({isPositive ? '+' : ''}{priceChangePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Market Cap</p>
                  <p className="text-lg font-semibold">
                    ${(stockData.marketCap / 1e9).toFixed(2)}B
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Volume</p>
                  <p className="text-lg font-semibold">
                    {(stockData.volume / 1e6).toFixed(2)}M
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">P/E Ratio</p>
                  <p className="text-lg font-semibold">{stockData.pe?.toFixed(2) || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">52W High/Low</p>
                  <p className="text-lg font-semibold">
                    ${stockData.high52Week?.toFixed(2) || 'N/A'} / ${stockData.low52Week?.toFixed(2) || 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Price Chart - Real-Time Data</CardTitle>
                <div className="flex gap-2">
                  {(["1D", "1M", "1Y", "10Y"] as ChartPeriod[]).map((period) => (
                    <Button
                      key={period}
                      variant={chartPeriod === period ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePeriodChange(period)}
                      disabled={loading}
                    >
                      {period}
                    </Button>
                  ))}
                </div>
              </div>
              <CardDescription>
                Interactive chart with zoom and pan capabilities. Drag the brush to zoom into specific periods.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {historicalData.length > 0 ? (
                <InteractiveChart
                  data={historicalData}
                  height={400}
                  showVolume={true}
                  showBrush={true}
                  title={`${selectedStock} - ${chartPeriod} Price History`}
                />
              ) : (
                <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                  {loading ? 'Loading chart data...' : 'No historical data available'}
                </div>
              )}
            </CardContent>
          </Card>

          {/* News Section */}
          <Card>
            <CardHeader>
              <CardTitle>Latest News & Sentiment</CardTitle>
              <CardDescription>Real-time news from multiple sources</CardDescription>
            </CardHeader>
            <CardContent>
              {newsArticles.length > 0 ? (
                <div className="space-y-4">
                  {newsArticles.map((article, index) => (
                    <div key={index} className="border-b pb-4 last:border-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold hover:text-primary cursor-pointer">
                            {article.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {article.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <span>{article.source}</span>
                            <span>•</span>
                            <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        {article.sentiment && (
                          <Badge
                            variant={
                              article.sentiment === 'positive' ? 'default' :
                              article.sentiment === 'negative' ? 'destructive' : 'secondary'
                            }
                          >
                            {article.sentiment}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  {loading ? 'Loading news...' : 'No news articles available'}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {!selectedStock && !loading && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BarChart3 className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Search for a Stock</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Enter a stock symbol above to view real-time prices, interactive charts, and latest news.
              All data is fetched live from financial APIs.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
