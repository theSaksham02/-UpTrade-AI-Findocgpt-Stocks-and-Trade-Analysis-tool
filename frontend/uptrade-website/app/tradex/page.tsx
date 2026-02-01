'use client'

import { GlassmorphismNav } from "@/components/glassmorphism-nav"
import { Footer } from "@/components/footer"
import { TrendingUp, BarChart3, Target, Zap, ArrowRight, LineChart, PieChart, Activity, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"

export default function TradeXLandingPage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--tv-bg-dark)' }}>
      <GlassmorphismNav />

      <main className="pt-32 pb-16">
        {/* Hero Section */}
        <section className="min-h-[80vh] flex items-center justify-center px-4 relative">
          {/* Background gradient */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(41, 98, 255, 0.15) 0%, transparent 50%)',
            }}
          />

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Column */}
              <div className="text-center lg:text-left">
                <div
                  className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium mb-8"
                  style={{
                    backgroundColor: 'var(--tv-surface)',
                    border: '1px solid var(--tv-border)',
                    color: 'var(--tv-blue)'
                  }}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Multi-Factor Stock Comparison
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                  <span style={{ color: 'var(--tv-text-primary)' }}>Compare Stocks</span>
                  <br />
                  <span
                    className="bg-clip-text text-transparent"
                    style={{ backgroundImage: 'linear-gradient(135deg, #2962FF, #00C853)' }}
                  >
                    Like a Pro
                  </span>
                </h1>

                <p className="text-lg mb-8 max-w-2xl" style={{ color: 'var(--tv-text-muted)' }}>
                  TradeX analyzes 100+ metrics across multiple stocks instantly. Compare fundamentals, technicals, sentiment, and more in one powerful view.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                  <Link href="/tradex/tool">
                    <Button
                      className="text-white rounded-lg px-8 py-6 text-lg transition-all duration-300 hover:scale-105 hover:brightness-110 group"
                      style={{ backgroundColor: 'var(--tv-blue)' }}
                    >
                      Try TradeX Now
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button
                      variant="outline"
                      className="rounded-lg px-8 py-6 text-lg transition-all duration-300 hover:scale-105"
                      style={{
                        borderColor: 'var(--tv-border)',
                        color: 'var(--tv-text)',
                        backgroundColor: 'transparent'
                      }}
                    >
                      Back to Dashboard
                    </Button>
                  </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
                  <div className="text-center lg:text-left">
                    <div className="text-3xl font-bold" style={{ color: 'var(--tv-blue)' }}>5</div>
                    <div className="text-sm" style={{ color: 'var(--tv-text-muted)' }}>Stocks at Once</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-3xl font-bold" style={{ color: 'var(--tv-blue)' }}>100+</div>
                    <div className="text-sm" style={{ color: 'var(--tv-text-muted)' }}>Metrics</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-3xl font-bold" style={{ color: 'var(--tv-green)' }}>Real-time</div>
                    <div className="text-sm" style={{ color: 'var(--tv-text-muted)' }}>Updates</div>
                  </div>
                </div>
              </div>

              {/* Right Column - Feature Cards */}
              <div className="grid grid-cols-1 gap-4">
                {[
                  { icon: LineChart, title: "Multi-Stock Charts", desc: "Overlay up to 5 stocks on interactive charts. Switch between 1D, 1M, 1Y, 10Y periods instantly.", color: 'var(--tv-blue)' },
                  { icon: BarChart3, title: "Key Metrics Comparison", desc: "Compare P/E ratios, market cap, volume, and 50+ other metrics side-by-side in real-time.", color: 'var(--tv-green)' },
                  { icon: Activity, title: "Sentiment Analysis", desc: "Track news sentiment and social media buzz from Reddit, Twitter, and StockTwits.", color: '#ff9800' },
                  { icon: Search, title: "Universal Search", desc: "Search all US stocks, ETFs, and options with instant autocomplete suggestions.", color: '#f23645' },
                ].map((feature, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl p-6 transition-all duration-300 cursor-pointer hover:-translate-y-1"
                    style={{
                      backgroundColor: 'var(--tv-surface)',
                      border: hoveredCard === idx ? `1px solid ${feature.color}` : '1px solid var(--tv-border)',
                    }}
                    onMouseEnter={() => setHoveredCard(idx)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: 'var(--tv-surface-hover)' }}
                      >
                        <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--tv-text-primary)' }}>{feature.title}</h3>
                        <p className="text-sm" style={{ color: 'var(--tv-text-muted)' }}>{feature.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--tv-text-primary)' }}>
                Everything You Need to Compare Stocks
              </h2>
              <p className="text-xl" style={{ color: 'var(--tv-text-muted)' }}>
                Professional-grade tools for serious investors
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: TrendingUp, title: "Performance Ranking", desc: "Automatically ranks stocks by performance with color-coded indicators" },
                { icon: BarChart3, title: "Volume Analysis", desc: "Compare trading volumes and identify unusual activity patterns" },
                { icon: PieChart, title: "Market Cap Comparison", desc: "Evaluate company sizes and market positions instantly" },
                { icon: Activity, title: "Real-Time News", desc: "Latest news with sentiment analysis for each stock" },
                { icon: Target, title: "52-Week Range", desc: "See high/low ranges and current position visualization" },
                { icon: Zap, title: "Lightning Fast", desc: "Sub-second load times with optimized data fetching" }
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="rounded-lg p-6 transition-all duration-200 hover:-translate-y-1 cursor-pointer"
                  style={{
                    backgroundColor: 'var(--tv-surface)',
                    border: '1px solid var(--tv-border)',
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: 'var(--tv-surface-hover)' }}
                  >
                    <feature.icon className="w-7 h-7" style={{ color: 'var(--tv-blue)' }} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--tv-text-primary)' }}>{feature.title}</h3>
                  <p style={{ color: 'var(--tv-text-muted)' }}>{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div
              className="rounded-2xl p-12"
              style={{
                backgroundColor: 'var(--tv-surface)',
                border: '1px solid var(--tv-blue)',
              }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: 'var(--tv-text-primary)' }}>
                Ready to Compare Stocks Like a Pro?
              </h2>
              <p className="text-xl mb-8" style={{ color: 'var(--tv-text-muted)' }}>
                Join thousands of investors using TradeX to make better investment decisions
              </p>
              <Link href="/tradex/tool">
                <Button
                  className="text-white rounded-lg px-12 py-6 text-lg transition-all duration-300 hover:scale-105 hover:brightness-110 group"
                  style={{ backgroundColor: 'var(--tv-blue)' }}
                >
                  Start Using TradeX Free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <p className="text-sm mt-4" style={{ color: 'var(--tv-text-muted)' }}>No credit card required • Free forever</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
