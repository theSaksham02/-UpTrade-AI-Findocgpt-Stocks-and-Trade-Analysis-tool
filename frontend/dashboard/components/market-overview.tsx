"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Activity, DollarSign, BarChart3, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { apiClient, generateMockMarketOverview, type MarketOverview, type StockQuote } from "@/lib/api"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export default function MarketOverviewDashboard() {
  const [marketData, setMarketData] = useState<MarketOverview | null>(null)
  const [loading, setLoading] = useState(true)
  const [useMockData, setUseMockData] = useState(true)

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setLoading(true)
        if (useMockData) {
          // Use mock data for development
          const mock = generateMockMarketOverview()
          setMarketData(mock)
        } else {
          // Try to fetch from API
          const data = await apiClient.getMarketOverview()
          setMarketData(data)
        }
      } catch (error) {
        console.error('Failed to fetch market data:', error)
        // Fallback to mock data
        setMarketData(generateMockMarketOverview())
      } finally {
        setLoading(false)
      }
    }

    fetchMarketData()
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchMarketData, 30000)
    return () => clearInterval(interval)
  }, [useMockData])

  if (loading || !marketData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Market Indices */}
      <div className="grid gap-4 md:grid-cols-3">
        {Object.entries(marketData.indices).map(([name, data]) => (
          <Card key={name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{name}</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.value.toLocaleString()}</div>
              <p className={`text-xs flex items-center gap-1 ${data.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {data.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {data.change >= 0 ? '+' : ''}{data.change.toFixed(2)} ({data.changePercent.toFixed(2)}%)
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(marketData.mostActive.reduce((acc, stock) => acc + stock.volume, 0) / 1000000).toFixed(0)}M
            </div>
            <p className="text-xs text-muted-foreground">+12.5% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Market Cap</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45.2T</div>
            <p className="text-xs text-muted-foreground">Total market value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Stocks</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{marketData.mostActive.length}</div>
            <p className="text-xs text-muted-foreground">Top movers today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Traders</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10.2K</div>
            <p className="text-xs text-muted-foreground">Online now</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Movers */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Top Gainers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Top Gainers
            </CardTitle>
            <CardDescription>Best performing stocks today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {marketData.topGainers.slice(0, 5).map((stock) => (
                <StockRow key={stock.symbol} stock={stock} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Losers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-500" />
              Top Losers
            </CardTitle>
            <CardDescription>Worst performing stocks today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {marketData.topLosers.slice(0, 5).map((stock) => (
                <StockRow key={stock.symbol} stock={stock} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Most Active */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Most Active
          </CardTitle>
          <CardDescription>Stocks with highest trading volume</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {marketData.mostActive.slice(0, 8).map((stock) => (
              <StockRow key={stock.symbol} stock={stock} showVolume />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function StockRow({ stock, showVolume = false }: { stock: StockQuote; showVolume?: boolean }) {
  const isPositive = stock.change >= 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
          {stock.symbol.slice(0, 2)}
        </div>
        <div>
          <div className="font-semibold">{stock.symbol}</div>
          {showVolume && (
            <div className="text-xs text-muted-foreground">
              Vol: {(stock.volume / 1000000).toFixed(1)}M
            </div>
          )}
        </div>
      </div>
      <div className="text-right">
        <div className="font-semibold">${stock.price.toFixed(2)}</div>
        <div className={`text-xs flex items-center gap-1 justify-end ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
        </div>
      </div>
    </div>
  )
}
