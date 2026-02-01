'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { GlassmorphismNav } from '@/components/glassmorphism-nav'
import { Footer } from '@/components/footer'
import { DemoChart } from '@/components/landing/demo-chart'

// High-Converting Landing Page
// Strategy: Bloomberg Comparison + Live Demo + Technical Credibility
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
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#0b0e14] overflow-hidden font-sans text-slate-300">

      {/* Background Gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-[#2962FF]/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-[#089981]/10 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <div className="relative z-10">
        <GlassmorphismNav />

        {/* HERO SECTION */}
        <section className="pt-32 pb-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight tracking-tight">
              "Your Bloomberg Terminal Costs <span className="line-through decoration-[#f23645] decoration-4 text-white/50">$24,000</span>/year.
              <br />
              <span className="text-[#2962FF]">UpTrade is $0."</span>
            </h1>

            <p className="text-xl text-[#868993] max-w-3xl mx-auto mb-10 leading-relaxed font-light">
              Decision Intelligence Engine with <strong className="text-white font-medium">VisualX</strong> divergence detection,<br className="hidden md:block" />
              <strong className="text-white font-medium">TradeX</strong> multi-factor scoring, and real-time sentiment overlay.
            </p>

            <div className="flex justify-center mb-16">
              <Link href="/app">
                <button className="px-10 py-4 bg-[#2962FF] hover:bg-[#1e53e5] text-white font-bold rounded-lg text-lg transition-all shadow-lg hover:shadow-[#2962FF]/50 transform hover:scale-105">
                  Launch Platform →
                </button>
              </Link>
            </div>

            {/* LIVE DEMO CHART */}
            <div className="max-w-5xl mx-auto mb-24">
              <div className="text-sm text-[#868993] mb-4 flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#f23645] animate-pulse"></span>
                Live Divergence Detection Preview
              </div>
              <DemoChart />
              <p className="mt-4 text-sm text-[#868993]">
                <span className="text-[#f23645] font-bold">Watch:</span> TSLA sentiment crashes (-0.84σ) while price holds flat.
                VisualX alert fires 3 mins before volatility expansion.
              </p>
            </div>
          </div>
        </section>

        {/* COMPARISON TABLE */}
        <section className="py-20 px-4 bg-[#0b0e14]">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Stop Paying for Legacy Terminals</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#2a2e39]">
                    <th className="py-4 pl-4 text-[#868993] font-medium uppercase text-xs tracking-wider">Feature</th>
                    <th className="py-4 text-[#868993] font-medium uppercase text-xs tracking-wider">Bloomberg</th>
                    <th className="py-4 text-[#868993] font-medium uppercase text-xs tracking-wider">TradingView Pro</th>
                    <th className="py-4 pr-4 text-[#2962FF] font-bold uppercase text-xs tracking-wider">UpTrade</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-[#2a2e39]/50 hover:bg-[#1e222d] transition-colors">
                    <td className="py-4 pl-4 font-medium text-white">Cost per Year</td>
                    <td className="py-4 text-[#f23645]">$24,000</td>
                    <td className="py-4 text-white">$720</td>
                    <td className="py-4 pr-4 text-[#089981] font-bold">$0 (Free Beta)</td>
                  </tr>
                  <tr className="border-b border-[#2a2e39]/50 hover:bg-[#1e222d] transition-colors">
                    <td className="py-4 pl-4 font-medium text-white">Real-Time Data</td>
                    <td className="py-4 text-[#089981]">✓ Included</td>
                    <td className="py-4 text-white">Extra fees</td>
                    <td className="py-4 pr-4 text-[#089981] font-bold">✓ Included</td>
                  </tr>
                  <tr className="border-b border-[#2a2e39]/50 hover:bg-[#1e222d] transition-colors">
                    <td className="py-4 pl-4 font-medium text-white">Sentiment Overlay</td>
                    <td className="py-4 text-[#f23645]">✗ Text only</td>
                    <td className="py-4 text-[#f23645]">✗ No</td>
                    <td className="py-4 pr-4 text-[#089981] font-bold">✓ Real-time VisualX</td>
                  </tr>
                  <tr className="border-b border-[#2a2e39]/50 hover:bg-[#1e222d] transition-colors">
                    <td className="py-4 pl-4 font-medium text-white">Divergence Alerts</td>
                    <td className="py-4 text-[#f23645]">✗ Manual setup</td>
                    <td className="py-4 text-[#f23645]">✗ Price only</td>
                    <td className="py-4 pr-4 text-[#089981] font-bold">✓ Auto-Detection</td>
                  </tr>
                  <tr className="border-b border-[#2a2e39]/50 hover:bg-[#1e222d] transition-colors">
                    <td className="py-4 pl-4 font-medium text-white">Multi-Factor AI Review</td>
                    <td className="py-4 text-[#089981]">✓</td>
                    <td className="py-4 text-[#f23645]">✗</td>
                    <td className="py-4 pr-4 text-[#089981] font-bold">✓ TradeX Engine</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* CREDIBILITY WALL */}
        <section className="py-20 px-4 border-t border-[#2a2e39]">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="p-6 bg-[#131722] rounded-xl border border-[#2a2e39]">
                <div className="text-[#2962FF] font-bold text-3xl mb-1">50ms</div>
                <div className="text-white font-bold mb-2">Avg Latency</div>
                <p className="text-[#868993] text-xs">
                  Optimized vector search with HNSW indexing for instant similarity lookups.
                </p>
              </div>
              <div className="p-6 bg-[#131722] rounded-xl border border-[#2a2e39]">
                <div className="text-[#089981] font-bold text-3xl mb-1">DistilBERT</div>
                <div className="text-white font-bold mb-2">NLP Models</div>
                <p className="text-[#868993] text-xs">
                  Financial-specific fine-tuning on 10M+ earnings calls and SEC filings.
                </p>
              </div>
              <div className="p-6 bg-[#131722] rounded-xl border border-[#2a2e39]">
                <div className="text-[#ffd54f] font-bold text-3xl mb-1">1M+</div>
                <div className="text-white font-bold mb-2">Data Points/Sec</div>
                <p className="text-[#868993] text-xs">
                  Processing real-time tic-data, social feeds, and news production.
                </p>
              </div>
              <div className="p-6 bg-[#131722] rounded-xl border border-[#2a2e39]">
                <div className="text-[#f23645] font-bold text-3xl mb-1">73%</div>
                <div className="text-white font-bold mb-2">Alert Accuracy</div>
                <p className="text-[#868993] text-xs">
                  Backtested on 50,000+ historical divergence events for high signal/noise ratio.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* COPY STRATEGY SECTIONS */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-[#f23645] font-bold tracking-wider uppercase text-sm mb-2">VisualX Engine</h3>
              <h2 className="text-4xl font-bold text-white mb-6">Catch Divergences Before They Break</h2>
              <p className="text-[#868993] text-lg mb-6 leading-relaxed">
                VisualX detects when price is stable but sentiment crashes—giving you <span className="text-white font-medium">3-5 minutes advance warning</span> on volatility expansion.
              </p>
              <p className="text-[#868993] text-lg mb-8 leading-relaxed">
                Most traders react to price. UpTrade traders react to the <i>cause</i> of price movement.
              </p>
              <Link href="/app/visualx" className="text-[#2962FF] font-bold hover:underline">
                Explore VisualX →
              </Link>
            </div>
            <div className="bg-[#131722] rounded-xl border border-[#2a2e39] p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-50 text-[10rem] font-bold text-[#2a2e39] leading-none select-none -z-0">
                VX
              </div>
              <div className="relative z-10">
                {/* Mock VisualX Card */}
                <div className="bg-[#1e222d] p-4 rounded mb-4 border-l-4 border-[#f23645]">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[#f23645] font-bold text-xs uppercase">Liquidity Alert</span>
                    <span className="text-[#868993] text-xs">12:42 PM</span>
                  </div>
                  <div className="text-white font-medium">Institutional Sell-off Detected</div>
                  <div className="text-[#868993] text-sm mt-1">
                    Large block volume (50k) on bid side. Sentiment: -0.92
                  </div>
                </div>
                <div className="bg-[#1e222d] p-4 rounded border-l-4 border-[#089981]">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[#089981] font-bold text-xs uppercase">Momentum</span>
                    <span className="text-[#868993] text-xs">12:45 PM</span>
                  </div>
                  <div className="text-white font-medium">Retail FOMO Spike</div>
                  <div className="text-[#868993] text-sm mt-1">
                    Social mentions +400% in 5m. Sentiment: +0.88
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 bg-[#0d1017]">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 bg-[#131722] rounded-xl border border-[#2a2e39] p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 p-4 opacity-50 text-[10rem] font-bold text-[#2a2e39] leading-none select-none -z-0">
                TX
              </div>
              <div className="relative z-10 space-y-3">
                {/* Mock TradeX List */}
                {['NVDA', 'AMD', 'INTC', 'TSM', 'QCOM'].map((sym, i) => (
                  <div key={sym} className="flex items-center justify-between p-3 bg-[#1e222d] rounded border border-[#2a2e39]">
                    <span className="text-white font-bold w-16">{sym}</span>
                    <div className="flex-1 px-4">
                      <div className="h-1.5 bg-[#2a2e39] rounded-full overflow-hidden">
                        <div className="h-full bg-[#2962FF]" style={{ width: `${90 - i * 15}%` }}></div>
                      </div>
                    </div>
                    <span className="text-white font-mono">{90 - i * 15}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h3 className="text-[#2962FF] font-bold tracking-wider uppercase text-sm mb-2">TradeX Engine</h3>
              <h2 className="text-4xl font-bold text-white mb-6">Don't Compare 2 Stocks. Compare 100.</h2>
              <p className="text-[#868993] text-lg mb-6 leading-relaxed">
                TradeX factor engine ranks entire sectors by <span className="text-white">Fundamental × Sentiment × Technical</span> scores in 50ms.
              </p>
              <p className="text-[#868993] text-lg mb-8 leading-relaxed">
                Find the statistical outlier in 10,000 assets instantly. Stop manually reading balance sheets.
              </p>
              <Link href="/app/tradex" className="text-[#2962FF] font-bold hover:underline">
                Explore TradeX →
              </Link>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-32 px-4 text-center">
          <h2 className="text-5xl font-bold text-white mb-8">Ready to replace your legacy terminal?</h2>
          <Link href="/app">
            <button className="px-12 py-5 bg-[#2962FF] hover:bg-[#1e53e5] text-white font-bold rounded-lg text-xl transition-all shadow-xl hover:shadow-[#2962FF]/50 hover:-translate-y-1">
              Launch Platform Now
            </button>
          </Link>
          <p className="mt-6 text-[#868993]">No credit card required. Instant access.</p>
        </section>

        <Footer />
      </div>
    </div>
  )
}
