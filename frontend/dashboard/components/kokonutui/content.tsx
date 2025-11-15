"use client"

import { Calendar, CreditCard, Wallet, TrendingUp, BarChart3, Activity, Search } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MarketOverviewDashboard from "@/components/market-overview"
import StockComparisonDashboard from "@/components/stock-comparison"
import SentimentAnalysisDashboard from "@/components/sentiment-dashboard"
import StockSearchDashboard from "@/components/stock-search"
import List01 from "./list-01"
import List02 from "./list-02"
import List03 from "./list-03"

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
            <Activity className="w-4 h-4 mr-2" />
            Comparison
          </TabsTrigger>
          <TabsTrigger value="sentiment" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            <TrendingUp className="w-4 h-4 mr-2" />
            Sentiment
          </TabsTrigger>
          <TabsTrigger value="portfolio" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            <Wallet className="w-4 h-4 mr-2" />
            Portfolio
          </TabsTrigger>
          <TabsTrigger value="activity" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            <Calendar className="w-4 h-4 mr-2" />
            Activity
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
        
        <TabsContent value="portfolio" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 flex flex-col border border-gray-200 dark:border-[#1F1F23]">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-left flex items-center gap-2 ">
                <Wallet className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-50" />
                Accounts
              </h2>
              <div className="flex-1">
                <List01 className="h-full" />
              </div>
            </div>
            <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 flex flex-col border border-gray-200 dark:border-[#1F1F23]">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-left flex items-center gap-2">
                <CreditCard className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-50" />
                Recent Transactions
              </h2>
              <div className="flex-1">
                <List02 className="h-full" />
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="activity" className="mt-6">
          <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 flex flex-col items-start justify-start border border-gray-200 dark:border-[#1F1F23]">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-left flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-50" />
              Upcoming Events
            </h2>
            <List03 />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
