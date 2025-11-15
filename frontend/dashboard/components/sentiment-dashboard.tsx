"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Activity, Smile, Frown, Meh } from "lucide-react"
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts"

export default function SentimentAnalysisDashboard() {
  // Mock sentiment data
  const sentimentData = [
    { name: "Positive", value: 45, color: "#10b981" },
    { name: "Neutral", value: 35, color: "#f59e0b" },
    { name: "Negative", value: 20, color: "#ef4444" },
  ]

  const stockSentiments = [
    { symbol: "AAPL", sentiment: "positive", score: 0.85, volume: 245, sources: ["News", "Social Media", "Analyst Reports"] },
    { symbol: "MSFT", sentiment: "positive", score: 0.72, volume: 189, sources: ["News", "Analyst Reports"] },
    { symbol: "GOOGL", sentiment: "neutral", score: 0.45, volume: 156, sources: ["Social Media", "News"] },
    { symbol: "TSLA", sentiment: "negative", score: -0.32, volume: 567, sources: ["Social Media", "News"] },
    { symbol: "AMZN", sentiment: "positive", score: 0.68, volume: 198, sources: ["Analyst Reports", "News"] },
  ]

  const trendData = [
    { time: "9AM", positive: 40, neutral: 35, negative: 25 },
    { time: "11AM", positive: 42, neutral: 33, negative: 25 },
    { time: "1PM", positive: 45, neutral: 32, negative: 23 },
    { time: "3PM", positive: 44, neutral: 35, negative: 21 },
    { time: "Now", positive: 45, neutral: 35, negative: 20 },
  ]

  return (
    <div className="space-y-6">
      {/* Overall Sentiment */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-2 border-green-500/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Positive Sentiment</CardTitle>
            <Smile className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">45%</div>
            <p className="text-xs text-muted-foreground mt-1">+5% from yesterday</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-yellow-500/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Neutral Sentiment</CardTitle>
            <Meh className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-500">35%</div>
            <p className="text-xs text-muted-foreground mt-1">-2% from yesterday</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-red-500/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Negative Sentiment</CardTitle>
            <Frown className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">20%</div>
            <p className="text-xs text-muted-foreground mt-1">-3% from yesterday</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Sentiment Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Distribution</CardTitle>
            <CardDescription>Overall market sentiment breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sentiment Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Trend Today</CardTitle>
            <CardDescription>Hourly sentiment changes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trendData}>
                <XAxis dataKey="time" stroke="#888888" fontSize={12} />
                <YAxis stroke="#888888" fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="positive" fill="#10b981" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="neutral" fill="#f59e0b" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="negative" fill="#ef4444" stackId="a" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Stock-Specific Sentiment */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Sentiment Analysis</CardTitle>
          <CardDescription>Real-time sentiment scores for major stocks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stockSentiments.map((stock) => (
              <div key={stock.symbol} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {stock.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{stock.symbol}</div>
                    <div className="flex gap-2 mt-1">
                      {stock.sources.map((source) => (
                        <Badge key={source} variant="outline" className="text-xs">
                          {source}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Mentions</div>
                    <div className="text-lg font-semibold">{stock.volume}</div>
                  </div>

                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Score</div>
                    <div
                      className={`text-lg font-bold ${
                        stock.sentiment === "positive"
                          ? "text-green-500"
                          : stock.sentiment === "negative"
                          ? "text-red-500"
                          : "text-yellow-500"
                      }`}
                    >
                      {stock.score > 0 ? "+" : ""}
                      {stock.score.toFixed(2)}
                    </div>
                  </div>

                  <Badge
                    className={`${
                      stock.sentiment === "positive"
                        ? "bg-green-500 hover:bg-green-600"
                        : stock.sentiment === "negative"
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-yellow-500 hover:bg-yellow-600"
                    } text-white`}
                  >
                    {stock.sentiment === "positive" ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : stock.sentiment === "negative" ? (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    ) : (
                      <Activity className="h-3 w-3 mr-1" />
                    )}
                    {stock.sentiment.toUpperCase()}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="border-2 border-purple-500/50 bg-purple-50/5 dark:bg-purple-950/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-purple-500" />
            AI Sentiment Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">AAPL & MSFT:</span> Strong positive sentiment driven
              by recent product launches and strong earnings reports. Social media buzz at 2-month high.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-red-500 mt-2"></div>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">TSLA:</span> Negative sentiment spike due to
              production concerns and regulatory scrutiny. Analyst downgrades contributing to bearish outlook.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2"></div>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Overall Market:</span> Sentiment improving with 45%
              positive readings. Key sectors: Technology (+8%), Healthcare (+5%), Energy (-3%).
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
