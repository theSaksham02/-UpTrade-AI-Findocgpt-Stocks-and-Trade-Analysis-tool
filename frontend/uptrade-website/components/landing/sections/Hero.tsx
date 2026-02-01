'use client'

import Link from 'next/link'
import { DemoChart } from '../demo-chart'

export function Hero() {
    return (
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
    )
}
