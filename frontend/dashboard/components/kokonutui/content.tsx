"use client"

import { Calendar, CreditCard, Wallet, TrendingUp, BarChart3, Activity } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MarketOverviewDashboard from "@/components/market-overview"
import StockComparisonDashboard from "@/components/stock-comparison"
import SentimentAnalysisDashboard from "@/components/sentiment-dashboard"
import List01 from "./list-01"
import List02 from "./list-02"
import List03 from "./list-03"

export default function () {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Market Overview</TabsTrigger>
          <TabsTrigger value="comparison">Stock Comparison</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <MarketOverviewDashboard />
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
