"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, TrendingUp, TrendingDown, BarChart3, Activity } from "lucide-react"
import { useState } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar, BarChart, Legend } from "recharts"

export default function StockComparisonDashboard() {
  const [stock1, setStock1] = useState("AAPL")
  const [stock2, setStock2] = useState("MSFT")
  const [loading, setLoading] = useState(false)

  // Mock comparison data
  const comparisonData = {
    AAPL: {
      symbol: "AAPL",
      name: "Apple Inc.",
      price: 178.45,
      change: 4.23,
      changePercent: 2.43,
      marketCap: 2.8,
      pe: 28.5,
      eps: 6.26,
      revenue: 394.3,
      netIncome: 99.8,
      roa: 27.5,
      roe: 175.3,
      debtToEquity: 183.9,
      score: 92,
    },
    MSFT: {
      symbol: "MSFT",
      name: "Microsoft Corporation",
      price: 378.91,
      change: 7.12,
      changePercent: 1.91,
      marketCap: 2.9,
      pe: 32.1,
      eps: 11.80,
      revenue: 227.6,
      netIncome: 88.1,
      roa: 19.2,
      roe: 45.6,
      debtToEquity: 45.2,
      score: 89,
    },
  }

  const chartData = [
    { month: "Jan", AAPL: 165, MSFT: 340 },
    { month: "Feb", AAPL: 170, MSFT: 350 },
    { month: "Mar", AAPL: 168, MSFT: 355 },
    { month: "Apr", AAPL: 172, MSFT: 360 },
    { month: "May", AAPL: 175, MSFT: 370 },
    { month: "Jun", AAPL: 178, MSFT: 379 },
  ]

  const stock1Data = comparisonData[stock1 as keyof typeof comparisonData]
  const stock2Data = comparisonData[stock2 as keyof typeof comparisonData]

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <Card>
        <CardHeader>
          <CardTitle>Compare Stocks</CardTitle>
          <CardDescription>Enter two stock symbols to compare their performance and metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Stock 1 (e.g., AAPL)"
                value={stock1}
                onChange={(e) => setStock1(e.target.value.toUpperCase())}
                className="w-full"
              />
            </div>
            <div className="text-2xl font-bold text-muted-foreground">VS</div>
            <div className="flex-1">
              <Input
                placeholder="Stock 2 (e.g., MSFT)"
                value={stock2}
                onChange={(e) => setStock2(e.target.value.toUpperCase())}
                className="w-full"
              />
            </div>
            <Button>
              <Search className="h-4 w-4 mr-2" />
              Compare
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stock Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-2 border-green-500/50 bg-green-50/5 dark:bg-green-950/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{stock1Data.symbol}</CardTitle>
                <CardDescription>{stock1Data.name}</CardDescription>
              </div>
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-white font-bold text-xl">
                
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">${stock1Data.price}</div>
                <div className="flex items-center gap-2 text-green-500">
                  <TrendingUp className="h-4 w-4" />
                  +{stock1Data.change} (+{stock1Data.changePercent}%)
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">AI Score</div>
                <div className="text-2xl font-bold text-green-500">{stock1Data.score}/100</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <div className="text-sm text-muted-foreground">Market Cap</div>
                <div className="font-semibold">${stock1Data.marketCap}T</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">P/E Ratio</div>
                <div className="font-semibold">{stock1Data.pe}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">EPS</div>
                <div className="font-semibold">${stock1Data.eps}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Revenue</div>
                <div className="font-semibold">${stock1Data.revenue}B</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-500/50 bg-blue-50/5 dark:bg-blue-950/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{stock2Data.symbol}</CardTitle>
                <CardDescription>{stock2Data.name}</CardDescription>
              </div>
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-xl">
                ⊞
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">${stock2Data.price}</div>
                <div className="flex items-center gap-2 text-blue-500">
                  <TrendingUp className="h-4 w-4" />
                  +{stock2Data.change} (+{stock2Data.changePercent}%)
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">AI Score</div>
                <div className="text-2xl font-bold text-blue-500">{stock2Data.score}/100</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <div className="text-sm text-muted-foreground">Market Cap</div>
                <div className="font-semibold">${stock2Data.marketCap}T</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">P/E Ratio</div>
                <div className="font-semibold">{stock2Data.pe}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">EPS</div>
                <div className="font-semibold">${stock2Data.eps}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Revenue</div>
                <div className="font-semibold">${stock2Data.revenue}B</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
            <span className="font-semibold text-foreground">Analysis:</span> Both stocks show strong fundamentals
            with {stock1Data.symbol} demonstrating better value metrics (higher ROA/ROE), while {stock2Data.symbol}{" "}
            leads in growth potential with lower debt-to-equity ratio. {stock1Data.symbol} scores slightly higher
            overall at {stock1Data.score}/100 vs {stock2Data.symbol}'s {stock2Data.score}/100.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
