"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, TrendingUp, TrendingDown, BarChart3, Activity, AlertCircle } from "lucide-react"
import { useState } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar, BarChart, Legend } from "recharts"
import { compareStocks, getHistoricalData, type ComparisonData } from "@/lib/api-client"
import { InteractiveChart } from "./interactive-chart"

export default function StockComparisonDashboard() {
  const [stock1, setStock1] = useState("AAPL")
  const [stock2, setStock2] = useState("MSFT")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null)
  const [historicalData1, setHistoricalData1] = useState<any[]>([])
  const [historicalData2, setHistoricalData2] = useState<any[]>([])

  const handleCompare = async () => {
    if (!stock1.trim() || !stock2.trim()) return
    
    setLoading(true)
    setError(null)
    
    try {
      const [comparison, hist1, hist2] = await Promise.all([
        compareStocks([stock1, stock2]),
        getHistoricalData(stock1, '1M'),
        getHistoricalData(stock2, '1M')
      ])
      
      setComparisonData(comparison)
      setHistoricalData1(hist1)
      setHistoricalData2(hist2)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to compare stocks'
      setError(errorMsg)
      console.error('Comparison error:', err)
    } finally {
      setLoading(false)
    }
  }

  const stock1Data = comparisonData?.[stock1.toUpperCase()]
  const stock2Data = comparisonData?.[stock2.toUpperCase()]

  // Merge historical data for comparison chart
  const chartData = historicalData1.map((d1, idx) => {
    const dataPoint: any = { date: d1.date }
    dataPoint[stock1] = d1.close
    dataPoint[stock2] = historicalData2[idx]?.close || null
    return dataPoint
  })

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <Card>
        <CardHeader>
          <CardTitle>Compare Stocks</CardTitle>
          <CardDescription>Enter two stock symbols to compare their performance and metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <Input
                placeholder="Stock 1 (e.g., AAPL)"
                value={stock1}
                onChange={(e) => setStock1(e.target.value.toUpperCase())}
                className="w-full text-sm sm:text-base"
              />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-muted-foreground text-center sm:text-left">VS</div>
            <div className="flex-1">
              <Input
                placeholder="Stock 2 (e.g., MSFT)"
                value={stock2}
                onChange={(e) => setStock2(e.target.value.toUpperCase())}
                className="w-full text-sm sm:text-base"
              />
            </div>
            <Button className="w-full sm:w-auto" onClick={handleCompare} disabled={loading}>
              <Search className="h-4 w-4 mr-2" />
              {loading ? 'Comparing...' : 'Compare'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-red-500/50 bg-red-50/5">
          <CardContent className="flex items-center gap-3 p-6">
            <AlertCircle className="w-8 h-8 text-red-500 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-500">Failed to compare stocks</p>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
              <p className="text-xs text-muted-foreground mt-2">Ensure the backend is running and both symbols are valid.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stock Cards */}
      {stock1Data && stock2Data && (
        <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-2 border-green-500/50 bg-green-50/5 dark:bg-green-950/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{stock1}</CardTitle>
                <CardDescription>{stock1Data.name || 'Stock 1'}</CardDescription>
              </div>
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-white font-bold text-xl">
                
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">${stock1Data.price?.toFixed(2)}</div>
                <div className="flex items-center gap-2 text-green-500">
                  <TrendingUp className="h-4 w-4" />
                  +{stock1Data.change?.toFixed(2)} (+{stock1Data.changePercent?.toFixed(2)}%)
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">AI Score</div>
                <div className="text-2xl font-bold text-green-500">{stock1Data.score}/100</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-4 pt-3 sm:pt-4 border-t">
              <div className="space-y-1">
                <div className="text-xs sm:text-sm text-muted-foreground">Market Cap</div>
                <div className="text-sm sm:text-base font-semibold truncate">${stock1Data.marketCap}T</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs sm:text-sm text-muted-foreground">P/E Ratio</div>
                <div className="text-sm sm:text-base font-semibold truncate">{stock1Data.pe}</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs sm:text-sm text-muted-foreground">EPS</div>
                <div className="text-sm sm:text-base font-semibold truncate">${stock1Data.eps}</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs sm:text-sm text-muted-foreground">Revenue</div>
                <div className="text-sm sm:text-base font-semibold truncate">${stock1Data.revenue}B</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-500/50 bg-blue-50/5 dark:bg-blue-950/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{stock2}</CardTitle>
                <CardDescription>{stock2Data.name || 'Stock 2'}</CardDescription>
              </div>
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-xl">
                ⊞
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">${stock2Data.price?.toFixed(2)}</div>
                <div className="flex items-center gap-2 text-blue-500">
                  <TrendingUp className="h-4 w-4" />
                  +{stock2Data.change?.toFixed(2)} (+{stock2Data.changePercent?.toFixed(2)}%)
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">AI Score</div>
                <div className="text-2xl font-bold text-blue-500">{stock2Data.score}/100</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-4 pt-3 sm:pt-4 border-t">
              <div className="space-y-1">
                <div className="text-xs sm:text-sm text-muted-foreground">Market Cap</div>
                <div className="text-sm sm:text-base font-semibold truncate">${stock2Data.marketCap}T</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs sm:text-sm text-muted-foreground">P/E Ratio</div>
                <div className="text-sm sm:text-base font-semibold truncate">{stock2Data.pe}</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs sm:text-sm text-muted-foreground">EPS</div>
                <div className="text-sm sm:text-base font-semibold truncate">${stock2Data.eps}</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs sm:text-sm text-muted-foreground">Revenue</div>
                <div className="text-sm sm:text-base font-semibold truncate">${stock2Data.revenue}B</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      )}

      {/* Price Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Price Comparison (6M)</CardTitle>
          <CardDescription>Historical price movement comparison</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <XAxis dataKey="month" stroke="#888888" fontSize={12} />
              <YAxis stroke="#888888" fontSize={12} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="AAPL" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="MSFT" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Metrics Comparison */}
      {stock1Data && stock2Data && (
        <Card>
        <CardHeader>
          <CardTitle>Financial Metrics Comparison</CardTitle>
          <CardDescription>Key financial indicators side-by-side</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                { metric: "ROA", AAPL: stock1Data.roa, MSFT: stock2Data.roa },
                { metric: "ROE", AAPL: stock1Data.roe, MSFT: stock2Data.roe },
                { metric: "P/E", AAPL: stock1Data.pe, MSFT: stock2Data.pe },
                { metric: "Debt/Equity", AAPL: stock1Data.debtToEquity, MSFT: stock2Data.debtToEquity },
              ]}
            >
              <XAxis dataKey="metric" stroke="#888888" fontSize={12} />
              <YAxis stroke="#888888" fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar dataKey="AAPL" fill="#10b981" radius={[8, 8, 0, 0]} />
              <Bar dataKey="MSFT" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      )}

      {/* AI Insight */}
      <Card className="border-2 border-purple-500/50 bg-purple-50/5 dark:bg-purple-950/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-purple-500" />
            AI Insight
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {comparisonData && stock1Data && stock2Data ? (
              <><span className="font-semibold text-foreground">Real-Time Comparison:</span> {stock1} trades at ${stock1Data.price?.toFixed(2)} with P/E of {stock1Data.pe?.toFixed(2)}, while {stock2} trades at ${stock2Data.price?.toFixed(2)} with P/E of {stock2Data.pe?.toFixed(2)}. Both showing {stock1Data.changePercent > 0 ? 'positive' : 'negative'} momentum. Data updated in real-time from market APIs.</>
            ) : (
              <><span className="font-semibold text-foreground">Search stocks above</span> to see real-time comparison data, financial metrics, and AI-powered insights.</>  
            )}
          </p>
        </CardContent>
      </Card>
      
      {/* Empty State */}
      {!comparisonData && !loading && !error && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BarChart3 className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Compare Two Stocks</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Enter two stock symbols above and click Compare to see real-time side-by-side analysis.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
