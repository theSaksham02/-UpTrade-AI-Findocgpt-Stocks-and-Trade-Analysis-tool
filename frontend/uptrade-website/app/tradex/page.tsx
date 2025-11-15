'use client'

import { GlassmorphismNav } from "@/components/glassmorphism-nav"
import Aurora from "@/components/Aurora"
import { Footer } from "@/components/footer"
import { TrendingUp, BarChart3, Target, Zap, ArrowRight, CheckCircle2, Search, LineChart, PieChart, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"

export default function TradeXLandingPage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)
  return (
    <div className="min-h-screen bg-black overflow-hidden">
      <main className="min-h-screen relative overflow-hidden">
        <div className="fixed inset-0 w-full h-full">
          <Aurora colorStops={["#6b21a8", "#8b5cf6", "#7c3aed"]} amplitude={1.2} blend={0.6} speed={0.8} />
        </div>
        <div className="relative z-10">
          <GlassmorphismNav />
          
          {/* Hero Section */}
          <section className="min-h-screen flex items-center justify-center px-4 py-20 relative">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Column */}
                <div className="text-center lg:text-left">
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/20 backdrop-blur-md border border-purple-500/30 text-purple-300 text-sm font-medium mb-8 animate-pulse hover:animate-none hover:scale-105 transition-all duration-300">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Multi-Factor Stock Comparison
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 transition-all duration-500 hover:scale-105">
                    Compare Stocks
                    <br />
                    <span className="text-purple-400 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Like a Pro</span>
                  </h1>
                  
                  <p className="text-xl text-white/70 mb-8 max-w-2xl">
                    TradeX analyzes 100+ metrics across multiple stocks instantly. Compare fundamentals, technicals, sentiment, and more in one powerful view.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                    <Link href="/tradex/tool">
                      <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-full px-8 py-6 text-lg transform hover:scale-110 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/50 group">
                        Try TradeX Now
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                    <Link href="/dashboard">
                      <Button variant="outline" className="rounded-full px-8 py-6 text-lg border-2 border-white/30 text-white hover:bg-white/10 transform hover:scale-105 transition-all duration-300 hover:border-white/60">
                        Back to Dashboard
                      </Button>
                    </Link>
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
                    <div className="transform hover:scale-110 transition-all duration-300 cursor-pointer">
                      <div className="text-3xl font-bold text-purple-400 hover:text-purple-300">5</div>
                      <div className="text-sm text-white/60 hover:text-white/80">Stocks at Once</div>
                    </div>
                    <div className="transform hover:scale-110 transition-all duration-300 cursor-pointer">
                      <div className="text-3xl font-bold text-purple-400 hover:text-purple-300">100+</div>
                      <div className="text-sm text-white/60 hover:text-white/80">Metrics</div>
                    </div>
                    <div className="transform hover:scale-110 transition-all duration-300 cursor-pointer">
                      <div className="text-3xl font-bold text-purple-400 hover:text-purple-300">Real-time</div>
                      <div className="text-sm text-white/60 hover:text-white/80">Updates</div>
                    </div>
                  </div>
                </div>
                
                {/* Right Column - Feature Cards */}
                <div className="grid grid-cols-1 gap-4">
                  <div 
                    className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6 transform hover:scale-105 hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-purple-500/20"
                    onMouseEnter={() => setHoveredCard(0)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${hoveredCard === 0 ? 'rotate-12 scale-110' : ''}`}>
                        <LineChart className={`w-6 h-6 text-white transition-transform duration-300 ${hoveredCard === 0 ? 'scale-125' : ''}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Multi-Stock Charts</h3>
                        <p className="text-white/60 text-sm">
                          Overlay up to 5 stocks on interactive charts. Switch between 1D, 1M, 1Y, 10Y periods instantly.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6 transform hover:scale-105 hover:bg-white/10 hover:border-blue-500/50 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-blue-500/20"
                    onMouseEnter={() => setHoveredCard(1)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${hoveredCard === 1 ? 'rotate-12 scale-110' : ''}`}>
                        <BarChart3 className={`w-6 h-6 text-white transition-transform duration-300 ${hoveredCard === 1 ? 'scale-125' : ''}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Key Metrics Comparison</h3>
                        <p className="text-white/60 text-sm">
                          Compare P/E ratios, market cap, volume, and 50+ other metrics side-by-side in real-time.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6 transform hover:scale-105 hover:bg-white/10 hover:border-green-500/50 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-green-500/20"
                    onMouseEnter={() => setHoveredCard(2)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${hoveredCard === 2 ? 'rotate-12 scale-110' : ''}`}>
                        <Activity className={`w-6 h-6 text-white transition-transform duration-300 ${hoveredCard === 2 ? 'scale-125' : ''}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Sentiment Analysis</h3>
                        <p className="text-white/60 text-sm">
                          Track news sentiment and social media buzz from Reddit, Twitter, and StockTwits.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6 transform hover:scale-105 hover:bg-white/10 hover:border-orange-500/50 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-orange-500/20"
                    onMouseEnter={() => setHoveredCard(3)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${hoveredCard === 3 ? 'rotate-12 scale-110' : ''}`}>
                        <Search className={`w-6 h-6 text-white transition-transform duration-300 ${hoveredCard === 3 ? 'scale-125' : ''}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Universal Search</h3>
                        <p className="text-white/60 text-sm">
                          Search all US stocks, ETFs, and options with instant autocomplete suggestions.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Features Section */}
          <section className="py-20 px-4 relative">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Everything You Need to Compare Stocks
                </h2>
                <p className="text-xl text-white/60">
                  Professional-grade tools for serious investors
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    icon: <TrendingUp className="w-8 h-8" />,
                    title: "Performance Ranking",
                    description: "Automatically ranks stocks by performance with color-coded indicators"
                  },
                  {
                    icon: <BarChart3 className="w-8 h-8" />,
                    title: "Volume Analysis",
                    description: "Compare trading volumes and identify unusual activity patterns"
                  },
                  {
                    icon: <PieChart className="w-8 h-8" />,
                    title: "Market Cap Comparison",
                    description: "Evaluate company sizes and market positions instantly"
                  },
                  {
                    icon: <Activity className="w-8 h-8" />,
                    title: "Real-Time News",
                    description: "Latest news with sentiment analysis for each stock"
                  },
                  {
                    icon: <Target className="w-8 h-8" />,
                    title: "52-Week Range",
                    description: "See high/low ranges and current position visualization"
                  },
                  {
                    icon: <Zap className="w-8 h-8" />,
                    title: "Lightning Fast",
                    description: "Sub-second load times with optimized data fetching"
                  }
                ].map((feature, idx) => (
                  <div 
                    key={idx} 
                    className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/10 transition-all transform hover:scale-105 hover:border-purple-500/50 cursor-pointer hover:shadow-xl hover:shadow-purple-500/20 duration-300"
                    onMouseEnter={() => setHoveredFeature(idx)}
                    onMouseLeave={() => setHoveredFeature(null)}
                  >
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4 text-white transition-all duration-300 ${hoveredFeature === idx ? 'rotate-6 scale-110' : ''}`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-white/60">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
          
          {/* CTA Section */}
          <section className="py-20 px-4 relative">
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl border-2 border-purple-500/50 rounded-3xl p-12 transform hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/30">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Ready to Compare Stocks Like a Pro?
                </h2>
                <p className="text-xl text-white/70 mb-8">
                  Join thousands of investors using TradeX to make better investment decisions
                </p>
                <Link href="/tradex/tool">
                  <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-full px-12 py-6 text-lg transform hover:scale-110 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/50 group">
                    Start Using TradeX Free
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <p className="text-white/40 text-sm mt-4">No credit card required • Free forever</p>
              </div>
            </div>
          </section>
          
          <Footer />
        </div>
      </main>
    </div>
  )
}
