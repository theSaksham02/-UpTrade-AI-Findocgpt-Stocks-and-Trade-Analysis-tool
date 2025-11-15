"use client"

import { Calendar, CreditCard, Wallet, TrendingUp, BarChart3, Search, LineChart, Activity } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MarketOverviewDashboard from "@/components/market-overview"
import StockComparisonDashboard from "@/components/stock-comparison"
import SentimentAnalysisDashboard from "@/components/sentiment-dashboard"
import StockSearchDashboard from "@/components/stock-search"
import List01 from "./list-01"
import List02 from "./list-02"

export default function () {
  return (
    <div className="space-y-4">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome to UpTrade AI</h1>
            <p className="text-purple-100 text-lg">Your intelligent trading companion powered by advanced AI</p>
          </div>
          <TrendingUp className="w-16 h-16 opacity-80" />
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-white/50 dark:bg-[#1F1F23]/50 backdrop-blur-sm p-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            <BarChart3 className="w-4 h-4 mr-2" />
            Market Overview
          </TabsTrigger>
          <TabsTrigger value="search" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            <Search className="w-4 h-4 mr-2" />
            Stock Search
          </TabsTrigger>
          <TabsTrigger value="comparison" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            <LineChart className="w-4 h-4 mr-2" />
            Comparison
          </TabsTrigger>
          <TabsTrigger value="sentiment" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            <TrendingUp className="w-4 h-4 mr-2" />
            Sentiment
          </TabsTrigger>
          <TabsTrigger value="tradex" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            <Activity className="w-4 h-4 mr-2" />
            TradeX
          </TabsTrigger>
          <TabsTrigger value="visualx" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white">
            <BarChart3 className="w-4 h-4 mr-2" />
            VisualX
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <MarketOverviewDashboard />
        </TabsContent>
        
        <TabsContent value="search" className="mt-6">
          <StockSearchDashboard />
        </TabsContent>
        
        <TabsContent value="comparison" className="mt-6">
          <StockComparisonDashboard />
        </TabsContent>
        
        <TabsContent value="sentiment" className="mt-6">
          <SentimentAnalysisDashboard />
        </TabsContent>
        
        <TabsContent value="tradex" className="mt-6">
          <div className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-[#0F0F12] rounded-xl p-8 border-2 border-purple-200 dark:border-purple-900">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                  <Activity className="w-8 h-8 text-purple-600" />
                  TradeX - Stock Comparison Tool
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Compare up to 5 stocks with real-time data, charts, news, and sentiment analysis
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-[#1F1F23] rounded-lg p-6 border border-gray-200 dark:border-[#2F2F33]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <LineChart className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Multi-Stock Charts</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Overlay up to 5 stocks on interactive charts with multiple timeframes
                </p>
              </div>
              
              <div className="bg-white dark:bg-[#1F1F23] rounded-lg p-6 border border-gray-200 dark:border-[#2F2F33]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Metrics Comparison</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Compare P/E ratios, market cap, volume, and 50+ metrics side-by-side
                </p>
              </div>
              
              <div className="bg-white dark:bg-[#1F1F23] rounded-lg p-6 border border-gray-200 dark:border-[#2F2F33]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Live Sentiment</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Real-time news sentiment and social media buzz analysis
                </p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-[#1F1F23] rounded-lg p-6 border border-gray-200 dark:border-[#2F2F33]">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Features:</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                  5-stock simultaneous comparison
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                  Interactive price charts (1D, 1M, 1Y, 10Y)
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                  Real-time stock quotes
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                  News with sentiment analysis
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                  Social media sentiment tracking
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                  Performance ranking system
                </li>
              </ul>
              
              <div className="mt-6 flex gap-4">
                <a 
                  href="http://localhost:3000/tradex/tool" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Open TradeX Tool
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                  Opens in a new window on port 3000
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="visualx" className="mt-6">
          <div className="bg-gradient-to-br from-cyan-50 to-white dark:from-cyan-950/20 dark:to-[#0F0F12] rounded-xl p-8 border-2 border-cyan-200 dark:border-cyan-900">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                  <BarChart3 className="w-8 h-8 text-cyan-600" />
                  VisualX - Deep Market Analysis
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  AI-powered anomaly detection, forecasting, and timeline visualization
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-[#1F1F23] rounded-lg p-6 border border-gray-200 dark:border-[#2F2F33]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-cyan-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Timeline Analysis</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Gantt-style visualization of market movements with event correlation
                </p>
              </div>
              
              <div className="bg-white dark:bg-[#1F1F23] rounded-lg p-6 border border-gray-200 dark:border-[#2F2F33]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Anomaly Detection</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  AI-powered detection of unusual price movements using z-score analysis
                </p>
              </div>
              
              <div className="bg-white dark:bg-[#1F1F23] rounded-lg p-6 border border-gray-200 dark:border-[#2F2F33]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Price Forecasting</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  14-day predictions with confidence intervals using regression models
                </p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-[#1F1F23] rounded-lg p-6 border border-gray-200 dark:border-[#2F2F33]">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Features:</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 rounded-full bg-cyan-600"></div>
                  Statistical anomaly detection (z-score)
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 rounded-full bg-cyan-600"></div>
                  14-day price forecasting
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 rounded-full bg-cyan-600"></div>
                  News-event correlation
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 rounded-full bg-cyan-600"></div>
                  Sentiment trend analysis
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 rounded-full bg-cyan-600"></div>
                  Interactive timeline charts
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 rounded-full bg-cyan-600"></div>
                  Severity classification (High/Medium/Low)
                </li>
              </ul>
              
              <div className="mt-6 flex gap-4">
                <a 
                  href="http://localhost:3000/visualx/tool" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Open VisualX Tool
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                  Opens in a new window on port 3000
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
