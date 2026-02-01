'use client'

import Link from 'next/link'

export function FeaturesGrid() {
    return (
        <>
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
                    <div className="bg-[#131722] rounded-xl border border-[#2a2e39] p-8 relative overflow-hidden group hover:border-[#f23645]/50 transition-colors duration-500">
                        <div className="absolute top-0 right-0 p-4 opacity-50 text-[10rem] font-bold text-[#2a2e39] leading-none select-none -z-0 group-hover:text-[#f23645]/10 transition-colors duration-500">
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
                    <div className="order-2 md:order-1 bg-[#131722] rounded-xl border border-[#2a2e39] p-8 relative overflow-hidden group hover:border-[#2962FF]/50 transition-colors duration-500">
                        <div className="absolute top-0 left-0 p-4 opacity-50 text-[10rem] font-bold text-[#2a2e39] leading-none select-none -z-0 group-hover:text-[#2962FF]/10 transition-colors duration-500">
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
        </>
    )
}
