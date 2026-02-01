'use client'

import { useRef } from 'react';
import {
  BarChart3, Zap, TrendingUp, Cpu, Database
} from 'lucide-react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { LandingHeader } from '@/components/landing/Header';
// Footer handled by layout

export default function TradeXPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div ref={containerRef} className="bg-transparent min-h-screen">
      <LandingHeader />
      {/* Hero Section with Parallax */}
      <section className="relative h-[90vh] flex items-center overflow-hidden pt-20">
        {/* Background Grid Animation */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(41,98,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(41,98,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

        {/* Floating Orbs */}
        <motion.div
          style={{ y }}
          className="absolute top-20 right-[10%] w-96 h-96 bg-[#2962FF]/10 rounded-full blur-[120px]"
        />
        <div className="absolute bottom-20 left-[5%] w-64 h-64 bg-[#089981]/10 rounded-full blur-[100px]" />

        <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#2962FF]/20 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-[#2962FF]" />
              </div>
              <span className="text-[#2962FF] font-mono text-sm tracking-wider uppercase">
                Multi-Factor Engine
              </span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-[1.1]">
              Stop Guessing.
              <br />
              <span className="text-[#868993]">Start Scoring.</span>
            </h1>

            <p className="text-lg text-[#868993] max-w-lg leading-relaxed">
              TradeX evaluates 147 distinct factors across Fundamental, Technical,
              and Sentiment dimensions. Every asset receives a Predictive Alpha Score (PAS)
              updated in real-time.
            </p>

            <div className="flex items-center gap-4">
              <Link
                href="/app?engine=tradex"
                className="bg-[#2962FF] hover:bg-[#1e53e5] text-white px-8 py-4 rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <Zap className="w-5 h-5" />
                Launch TradeX
              </Link>
              <Link
                href="/api-page"
                className="px-8 py-4 rounded-lg font-medium text-white border border-[#2a2e39] hover:border-[#868993] transition-colors"
              >
                API Documentation
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 pt-4 border-t border-[#2a2e39]">
              <div>
                <div className="text-3xl font-bold text-white font-mono">147</div>
                <div className="text-xs text-[#868993] uppercase tracking-wider">Factors</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white font-mono">&lt;50ms</div>
                <div className="text-xs text-[#868993] uppercase tracking-wider">Recalculation</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white font-mono">73%</div>
                <div className="text-xs text-[#868993] uppercase tracking-wider">Accuracy</div>
              </div>
            </div>
          </div>

          {/* Right: Interactive Preview */}
          <div className="relative">
            <div className="relative bg-[#131722]/40 backdrop-blur-md border border-[#2a2e39]/50 rounded-2xl p-6 shadow-2xl">
              {/* Mock TradeX Interface */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#f23645]" />
                  <div className="w-3 h-3 rounded-full bg-[#ff9800]" />
                  <div className="w-3 h-3 rounded-full bg-[#089981]" />
                </div>
                <span className="text-[#868993] text-xs font-mono">TradeX Comparison Engine</span>
              </div>

              {/* Comparison Table */}
              <div className="space-y-4">
                {[
                  { symbol: 'AAPL', pas: 87.4, fund: 82, sent: 91, tech: 89, trend: 'up' },
                  { symbol: 'MSFT', pas: 84.2, fund: 88, sent: 79, tech: 85, trend: 'up' },
                  { symbol: 'NVDA', pas: 76.8, fund: 72, sent: 85, tech: 73, trend: 'down' },
                ].map((stock, i) => (
                  <motion.div
                    key={stock.symbol}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.2 }}
                    className="bg-[#1e222d]/40 backdrop-blur-md rounded-lg p-4 border border-[#2a2e39]/50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-white font-bold">{stock.symbol}</span>
                        <span className="text-[#089981] font-mono text-sm">PAS: {stock.pas}</span>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${stock.trend === 'up' ? 'bg-[#089981]' : 'bg-[#f23645]'}`} />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: 'Fundamental', val: stock.fund, color: 'bg-[#2962FF]' },
                        { label: 'Sentiment', val: stock.sent, color: 'bg-[#089981]' },
                        { label: 'Technical', val: stock.tech, color: 'bg-[#ff9800]' },
                      ].map((factor) => (
                        <div key={factor.label} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-[#868993]">{factor.label}</span>
                            <span className="text-white font-mono">{factor.val}</span>
                          </div>
                          <div className="h-1.5 bg-[#2a2e39] rounded-full overflow-hidden">
                            <div
                              className={`h-full ${factor.color} rounded-full`}
                              style={{ width: `${factor.val}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-6 -right-6 bg-[#1e222d]/60 backdrop-blur-md border border-[#363a45] rounded-lg p-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#089981]/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-[#089981]" />
                </div>
                <div>
                  <div className="text-white font-bold">Top Pick: AAPL</div>
                  <div className="text-xs text-[#868993]">Sentiment +37% above sector avg</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - 3 Column Grid */}
      <section className="py-24 border-t border-[#2a2e39]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Three Dimensions. One Score.</h2>
            <p className="text-[#868993] max-w-2xl mx-auto">
              TradeX doesn't just aggregate data. It weights factors dynamically based on
              market regime using our proprietary attention mechanism.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Database,
                title: 'Fundamental Layer',
                desc: 'P/E, P/B, ROE, Debt/Equity, FCF growth, EBITDA margins.',
                stat: '23 factors',
                color: '#2962FF'
              },
              {
                icon: Cpu,
                title: 'Sentiment Layer',
                desc: 'DistilBERT NLP on 50k+ daily social mentions, news sentiment, insider activity.',
                stat: '84 factors',
                color: '#089981'
              },
              {
                icon: TrendingUp,
                title: 'Technical Layer',
                desc: 'RSI, MACD, Volume Profile, VWAP, Support/Resistance, Options flow.',
                stat: '40 factors',
                color: '#ff9800'
              }
            ].map((layer, i) => (
              <motion.div
                key={layer.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#131722]/40 backdrop-blur-md border border-[#2a2e39]/50 rounded-xl p-6 hover:border-[#363a45] transition-colors"
                viewport={{ once: true }}
              >
                <div
                  className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center"
                  style={{ backgroundColor: `${layer.color}20` }}
                >
                  <layer.icon className="w-6 h-6" style={{ color: layer.color }} />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{layer.title}</h3>
                <p className="text-[#868993] text-sm mb-4 leading-relaxed">{layer.desc}</p>
                <div className="text-xs font-mono uppercase tracking-wider" style={{ color: layer.color }}>
                  {layer.stat}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Infographic: The Formula */}
      <div ref={containerRef} className="bg-transparent min-h-screen">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-12">The PAS Formula</h2>

          <div className="bg-[#0b0e14]/40 backdrop-blur-md border border-[#2a2e39]/50 rounded-2xl p-8 font-mono text-lg overflow-x-auto">
            <div className="flex flex-nowrap items-center justify-center gap-4 text-[#868993] min-w-[600px]">
              <span className="text-white">PAS</span>
              <span>=</span>
              <div className="flex flex-col items-center">
                <span className="border-b border-[#363a45] px-4 text-[#2962FF]">w₁·Fundamental + w₂·Sentiment + w₃·Technical</span>
                <span className="text-xs text-[#868993] mt-1">Raw Factor Scores</span>
              </div>
              <span>×</span>
              <div className="flex flex-col items-center">
                <span className="border-b border-[#363a45] px-4 text-[#089981]">σ(Market Regime)</span>
                <span className="text-xs text-[#868993] mt-1">Regime Adjustment</span>
              </div>
              <span>+</span>
              <div className="flex flex-col items-center">
                <span className="border-b border-[#363a45] px-4 text-[#ff9800]">α(anomaly)</span>
                <span className="text-xs text-[#868993] mt-1">Divergence Bonus</span>
              </div>
            </div>
          </div>

          <p className="mt-6 text-[#868993] text-sm">
            Weights (w₁, w₂, w₃) dynamically adjusted via attention mechanism.
            <br />
            Bull markets overweight momentum. Bear markets overweight quality.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2962FF]/5 to-transparent" />
        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Score Your Portfolio?</h2>
          <p className="text-[#868993] mb-8 text-lg">
            Join 12,000+ traders using TradeX to identify statistical edges before the market moves.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/app"
              className="bg-[#2962FF] hover:bg-[#1e53e5] text-white px-8 py-4 rounded-lg font-medium text-lg transition-colors"
            >
              Launch TradeX Free
            </Link>
            <Link
              href="/compare"
              className="text-white border border-[#2a2e39] hover:border-[#868993] px-8 py-4 rounded-lg font-medium transition-colors"
            >
              See Comparison
            </Link>
          </div>
        </div>
      </section>
// Footer removed (handled by layout)
    </div>
  );
};
