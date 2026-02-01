'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { GlassmorphismNav } from '@/components/glassmorphism-nav'
import Aurora from '@/components/Aurora'
import { Footer } from '@/components/footer'

// Marketing Landing Page - Converts visitors to users
// Product lives at /app
export default function LandingPage() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight - windowHeight
      const scrolled = window.scrollY
      const progress = Math.min(scrolled / documentHeight, 1)
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen overflow-hidden" style={{ backgroundColor: '#0b0e14' }}>
      <main className="min-h-screen relative overflow-hidden">
        {/* Aurora Background */}
        <div
          className="fixed inset-0 w-full h-full pointer-events-none"
          style={{ opacity: Math.max(0.3, 1 - scrollProgress * 0.7) }}
        >
          <Aurora colorStops={["#2962FF", "#089981", "#1e222d"]} amplitude={0.8} blend={0.4} speed={0.5} />
        </div>

        <div className="relative z-10">
          <GlassmorphismNav />

          {/* Hero Section */}
          <section className="min-h-screen flex items-center justify-center px-4 py-20">
            <div className="max-w-6xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-[#2962FF]/20 border border-[#2962FF]/30 rounded-full px-4 py-2 mb-8">
                <span className="w-2 h-2 rounded-full bg-[#089981] animate-pulse"></span>
                <span className="text-[#2962FF] text-sm font-medium">Now in Beta • 50,000+ Symbols</span>
              </div>

              {/* Headline */}
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Trade Smarter with
                <br />
                <span className="bg-gradient-to-r from-[#2962FF] to-[#089981] bg-clip-text text-transparent">
                  AI-Powered Insights
                </span>
              </h1>

              <p className="text-xl text-[#868993] max-w-3xl mx-auto mb-10">
                Real-time sentiment analysis, multi-factor stock comparison, and strategy simulation.
                Everything a professional trader needs, powered by machine learning.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Link href="/app">
                  <button className="px-8 py-4 bg-[#2962FF] hover:bg-[#1e53e5] text-white font-bold rounded-lg text-lg transition-all transform hover:scale-105">
                    Launch Terminal →
                  </button>
                </Link>
                <Link href="#features">
                  <button className="px-8 py-4 bg-transparent border-2 border-[#363a45] hover:border-[#2962FF] text-white font-medium rounded-lg text-lg transition-all">
                    See Features
                  </button>
                </Link>
              </div>

              {/* Terminal Preview */}
              <div className="relative mx-auto max-w-5xl">
                <div className="bg-[#131722] rounded-lg border border-[#2a2e39] overflow-hidden shadow-2xl">
                  {/* Terminal Header */}
                  <div className="h-10 bg-[#0b0e14] border-b border-[#2a2e39] flex items-center px-4">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#f23645]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#ffd54f]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#089981]"></div>
                    </div>
                    <span className="ml-4 text-[#868993] text-sm">UpTrade Terminal</span>
                  </div>

                  {/* Mock Dashboard */}
                  <div className="h-80 flex">
                    {/* Mock Watchlist */}
                    <div className="w-40 bg-[#131722] border-r border-[#2a2e39] p-3">
                      {[
                        { sym: 'AAPL', price: '186.45', pct: '-0.64%', down: true },
                        { sym: 'TSLA', price: '248.76', pct: '-2.05%', down: true },
                        { sym: 'SPY', price: '478.23', pct: '+0.39%', down: false },
                        { sym: 'NVDA', price: '721.84', pct: '+2.18%', down: false },
                      ].map(s => (
                        <div key={s.sym} className="flex justify-between items-center py-2 border-b border-[#1e222d]">
                          <span className="text-white text-sm font-medium">{s.sym}</span>
                          <span className={`text-xs font-mono ${s.down ? 'text-[#f23645]' : 'text-[#089981]'}`}>
                            {s.pct}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Mock Chart */}
                    <div className="flex-1 p-4">
                      <div className="h-full flex items-end justify-around gap-1">
                        {[40, 55, 45, 60, 70, 65, 80, 75, 85, 70, 90, 85, 95].map((h, i) => (
                          <div
                            key={i}
                            className={`w-4 rounded-t ${i > 9 ? 'bg-[#089981]' : 'bg-[#f23645]'}`}
                            style={{ height: `${h}%` }}
                          ></div>
                        ))}
                      </div>
                    </div>

                    {/* Mock Panel */}
                    <div className="w-60 bg-[#131722] border-l border-[#2a2e39] p-3">
                      <div className="text-[#868993] text-xs uppercase tracking-wider mb-3">TradeX Analysis</div>
                      <div className="bg-[#1e222d] rounded p-3 mb-2">
                        <div className="flex justify-between">
                          <span className="text-white font-bold">AAPL</span>
                          <span className="text-[#089981] font-mono text-sm">PAS: 84</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {['Fundamental', 'Sentiment', 'Technical'].map((f, i) => (
                          <div key={f} className="flex items-center gap-2">
                            <span className="text-[#868993] text-xs w-20">{f}</span>
                            <div className="flex-1 h-1.5 bg-[#2a2e39] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#2962FF] rounded-full"
                                style={{ width: `${70 + i * 8}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Glow Effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-[#2962FF]/20 via-[#089981]/20 to-[#2962FF]/20 blur-3xl -z-10"></div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-white text-center mb-4">
                Three Powerful Engines
              </h2>
              <p className="text-[#868993] text-center mb-16 max-w-2xl mx-auto">
                Each engine is designed for a specific task. Use them together for complete market coverage.
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                {/* TradeX */}
                <Link href="/app/tradex">
                  <div className="bg-[#131722] border border-[#2a2e39] rounded-xl p-6 hover:border-[#2962FF] transition-all cursor-pointer group">
                    <div className="w-12 h-12 bg-[#2962FF]/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-[#2962FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="20" x2="18" y2="10" />
                        <line x1="12" y1="20" x2="12" y2="4" />
                        <line x1="6" y1="20" x2="6" y2="14" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">TradeX</h3>
                    <p className="text-[#868993] text-sm mb-4">
                      Multi-factor stock comparison. Compare PAS scores, fundamentals, sentiment, and technicals side-by-side.
                    </p>
                    <span className="text-[#2962FF] text-sm font-medium group-hover:underline">
                      Launch TradeX →
                    </span>
                  </div>
                </Link>

                {/* VisualX */}
                <Link href="/app/visualx">
                  <div className="bg-[#131722] border border-[#2a2e39] rounded-xl p-6 hover:border-[#089981] transition-all cursor-pointer group">
                    <div className="w-12 h-12 bg-[#089981]/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-[#089981]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">VisualX</h3>
                    <p className="text-[#868993] text-sm mb-4">
                      Real-time sentiment analysis. Track divergence alerts, social mentions, and institutional signals.
                    </p>
                    <span className="text-[#089981] text-sm font-medium group-hover:underline">
                      Launch VisualX →
                    </span>
                  </div>
                </Link>

                {/* TradeSphere */}
                <Link href="/app">
                  <div className="bg-[#131722] border border-[#2a2e39] rounded-xl p-6 hover:border-[#ff9800] transition-all cursor-pointer group">
                    <div className="w-12 h-12 bg-[#ff9800]/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-[#ff9800]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">TradeSphere</h3>
                    <p className="text-[#868993] text-sm mb-4">
                      Strategy simulator. Backtest your ideas across 10 years of historical data with one click.
                    </p>
                    <span className="text-[#ff9800] text-sm font-medium group-hover:underline">
                      Launch Simulator →
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-20 px-4 border-t border-[#2a2e39]">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {[
                  { value: '50,000+', label: 'Symbols' },
                  { value: '<50ms', label: 'Avg Latency' },
                  { value: '1,000+', label: 'Data Sources' },
                  { value: '99.9%', label: 'Uptime' },
                ].map(stat => (
                  <div key={stat.label}>
                    <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                    <div className="text-[#868993] text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold text-white mb-6">
                Ready to Trade Smarter?
              </h2>
              <p className="text-[#868993] text-lg mb-8">
                Join thousands of traders using AI-powered insights.
              </p>
              <Link href="/app">
                <button className="px-10 py-5 bg-[#2962FF] hover:bg-[#1e53e5] text-white font-bold rounded-lg text-xl transition-all transform hover:scale-105">
                  Open Terminal Now →
                </button>
              </Link>
            </div>
          </section>

          <Footer />
        </div>
      </main>
    </div>
  )
}
