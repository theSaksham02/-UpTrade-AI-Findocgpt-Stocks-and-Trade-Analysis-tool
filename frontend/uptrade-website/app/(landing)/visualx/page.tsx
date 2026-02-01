'use client'

import { AlertTriangle, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import { LandingHeader } from '@/components/landing/Header';
// Footer handled by layout

export default function VisualXPage() {
  return (
    <div className="bg-[#0b0e14] min-h-screen">
      <LandingHeader />
      {/* Hero with Animated Heatmap Background */}
      <section className="relative h-screen flex items-center overflow-hidden pt-20">
        {/* Animated Grid Heatmap Background */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          {/* Placeholder for canvas - using gradient for now */}
          <div className="w-full h-full bg-gradient-to-br from-transparent via-[#f23645]/5 to-[#2962FF]/5" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#f23645]/10 border border-[#f23645]/30 rounded-full">
              <AlertTriangle className="w-4 h-4 text-[#f23645]" />
              <span className="text-[#f23645] text-sm font-medium">Early Warning System</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-[1.1]">
              See What Price
              <br />
              <span className="text-[#f23645]">Hides From You.</span>
            </h1>

            <p className="text-lg text-[#868993] max-w-lg">
              VisualX detects Liquidity Divergences—when price stays calm but
              underlying sentiment crashes. You get 3-5 minutes warning before
              volatility explodes.
            </p>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#089981] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">73%</span>
                </div>
                <div className="text-sm">
                  <div className="text-white">Accuracy Rate</div>
                  <div className="text-[#868993]">On 50k+ divergences</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#2962FF] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">3m</span>
                </div>
                <div className="text-sm">
                  <div className="text-white">Avg Warning</div>
                  <div className="text-[#868993]">Before volatility</div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Divergence Alert Mockup */}
          <div className="relative">
            <div className="bg-[#131722]/40 backdrop-blur-md border border-[#2a2e39]/50 rounded-2xl p-6">
              {/* Chart with Divergence Marker */}
              <div className="relative bg-[#0b0e14]/40 backdrop-blur-md rounded-lg p-4 h-64">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-white font-bold">TSLA - 1D Chart</span>
                  <span className="text-[#868993] text-xs font-mono">VisualX Active</span>
                </div>
                <svg viewBox="0 0 400 200" className="w-full h-full">
                  {/* Price line (stable) */}
                  <path
                    d="M 0 150 Q 100 145, 200 148 T 400 152"
                    stroke="#d1d4dc"
                    strokeWidth="2"
                    fill="none"
                  />
                  {/* Sentiment line (crashing) */}
                  <path
                    d="M 0 50 Q 100 80, 200 120 T 400 180"
                    stroke="#f23645"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="5,5"
                  />
                  {/* Divergence zone */}
                  <rect x="250" y="20" width="100" height="160" fill="#f23645" fillOpacity="0.1" />
                  <text x="300" y="40" fill="#f23645" textAnchor="middle" fontSize="10">
                    DIVERGENCE
                  </text>
                </svg>

                {/* Alert Popup */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-4 right-4 bg-[#f23645] text-white p-3 rounded-lg shadow-2xl max-w-[200px]"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Bell className="w-4 h-4" />
                    <span className="font-bold text-sm">ALERT</span>
                  </div>
                  <div className="text-xs">
                    Price stable (+0.2%) but sentiment crashed to -0.84σ
                  </div>
                </motion.div>
              </div>

              {/* Sentiment Bar */}
              <div className="mt-4 bg-[#1e222d] rounded-lg p-3">
                <div className="flex items-center justify-between text-xs text-[#868993] mb-2">
                  <span>Social Sentiment (5min)</span>
                  <span className="text-[#f23645]">-0.84σ</span>
                </div>
                <div className="h-2 bg-[#2a2e39] rounded-full overflow-hidden">
                  <div className="h-full w-1/4 bg-gradient-to-r from-[#089981] to-[#f23645]" />
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-[#089981]">Bullish</span>
                  <span className="text-[#f23645]">Bearish</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How Divergence Detection Works */}
      <section className="py-24 border-t border-[#2a2e39]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white text-center mb-16">The Divergence Detection Pipeline</h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Ingest', desc: '50k+ social posts, news articles, SEC filings processed/sec' },
              { step: '02', title: 'Embed', desc: 'DistilBERT converts text to 384-dimensional sentiment vectors' },
              { step: '03', title: 'Compare', desc: 'Real-time correlation between price velocity & sentiment delta' },
              { step: '04', title: 'Alert', desc: 'Z-score > 2.5 triggers notification with confidence interval' },
            ].map((item, i) => (
              <div key={item.step} className="relative">
                <div className="text-5xl font-bold text-[#2a2e39] mb-4">{item.step}</div>
                <h3 className="text-white font-bold mb-2">{item.title}</h3>
                <p className="text-[#868993] text-sm">{item.desc}</p>
                {i < 3 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-[#2a2e39] to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
// Footer removed (handled by layout)
    </div>
  );
};
