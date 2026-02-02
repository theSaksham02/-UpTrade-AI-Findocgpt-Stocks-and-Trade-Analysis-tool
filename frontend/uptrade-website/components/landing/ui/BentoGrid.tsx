'use client';

import { TrendingUp, Activity, Terminal, Globe, Zap } from 'lucide-react';
import { LatencyPulse } from './LatencyPulse';
import { useState } from 'react';

export const BentoGrid = () => {
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);

    return (
        <section className="py-24 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 px-4">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Institutional Power. <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] to-[#2962FF]">Retail Access.</span>
                    </h2>
                    <p className="text-[#868993] text-lg max-w-2xl mx-auto">
                        We've packed the power of a hedge fund trading desk into a beautiful, easy-to-use interface.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-4 h-auto md:h-[750px]">

                    {/* VisualX Engine (Large, Top Left) */}
                    <div
                        className="md:col-span-2 md:row-span-2 rounded-2xl border border-[#2a2e39] bg-[#131722]/60 backdrop-blur-xl overflow-hidden relative group transition-all duration-500 p-8 flex flex-col justify-between hover:border-[#ef4444]/50"
                        onMouseEnter={() => setHoveredCard('visualx')}
                        onMouseLeave={() => setHoveredCard(null)}
                        style={{
                            boxShadow: hoveredCard === 'visualx' ? '0 0 40px rgba(239, 68, 68, 0.15)' : 'none'
                        }}
                    >
                        {/* Animated gradient border */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#ef4444]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-[#ef4444]/20 flex items-center justify-center mb-4 text-[#ef4444] group-hover:scale-110 transition-transform">
                                <Activity className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">VisualX Engine</h3>
                            <p className="text-[#868993] mb-6 max-w-sm">Detects divergence 3-5 minutes before price action confirms. It's like having a time machine.</p>
                        </div>

                        {/* Mini chart visualization */}
                        <div className="relative flex-1 rounded-lg overflow-hidden border border-[#2a2e39] bg-[#0b0e14] p-4 mt-4">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-xs text-[#868993] font-mono">TSLA DIVERGENCE</span>
                                <span className="text-xs text-[#ef4444] font-bold">-0.84σ</span>
                            </div>
                            <div className="flex items-end gap-1 h-20">
                                {[40, 42, 38, 45, 43, 47, 44, 48, 46, 50, 48, 52, 50, 54, 52, 56, 54, 58, 56, 60].map((h, i) => (
                                    <div
                                        key={i}
                                        className="flex-1 bg-gradient-to-t from-[#2962FF] to-[#2962FF]/30 rounded-t transition-all duration-300"
                                        style={{
                                            height: `${h + (hoveredCard === 'visualx' ? 10 : 0)}%`,
                                            transitionDelay: `${i * 20}ms`
                                        }}
                                    />
                                ))}
                            </div>
                            {/* Sentiment line */}
                            <div className="absolute bottom-4 left-4 right-4 h-0.5 bg-[#ef4444] rounded opacity-60"
                                style={{
                                    transform: 'rotate(-15deg)',
                                    transformOrigin: 'left center'
                                }}
                            />
                        </div>
                    </div>

                    {/* Latency (Top Right, Tall) */}
                    <div className="md:col-span-1 md:row-span-2">
                        <LatencyPulse />
                    </div>

                    {/* TradeX Scoring (Top Right corner) */}
                    <div
                        className="md:col-span-1 md:row-span-1 rounded-2xl border border-[#2a2e39] bg-[#131722]/60 backdrop-blur-xl p-6 relative overflow-hidden group transition-all duration-300 hover:border-[#10b981]/50"
                        onMouseEnter={() => setHoveredCard('tradex')}
                        onMouseLeave={() => setHoveredCard(null)}
                        style={{
                            boxShadow: hoveredCard === 'tradex' ? '0 0 30px rgba(16, 185, 129, 0.15)' : 'none'
                        }}
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#10b981]/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500" />
                        <div className="flex items-center gap-2 mb-3 text-[#10b981]">
                            <TrendingUp className="w-5 h-5" />
                            <span className="font-bold text-sm">TRADEX</span>
                        </div>
                        <div className="text-5xl font-bold text-white mb-1">94<span className="text-lg text-[#868993] font-normal">/100</span></div>
                        <div className="text-xs text-[#10b981] font-bold uppercase tracking-wider">Strong Buy</div>
                    </div>

                    {/* Sentiment (Middle Right) */}
                    <div
                        className="md:col-span-1 md:row-span-1 rounded-2xl border border-[#2a2e39] bg-[#131722]/60 backdrop-blur-xl p-6 relative overflow-hidden group transition-all duration-300 hover:border-[#7c3aed]/50"
                        onMouseEnter={() => setHoveredCard('sentiment')}
                        onMouseLeave={() => setHoveredCard(null)}
                        style={{
                            boxShadow: hoveredCard === 'sentiment' ? '0 0 30px rgba(124, 58, 237, 0.15)' : 'none'
                        }}
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#7c3aed]/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500" />
                        <div className="flex items-center gap-2 mb-3 text-[#7c3aed]">
                            <Globe className="w-5 h-5" />
                            <span className="font-bold text-sm">SENTIMENT</span>
                        </div>
                        <div className="flex gap-2 mb-2">
                            <span className="px-2 py-1 bg-[#10b981]/20 text-[#10b981] text-xs rounded font-medium">Bullish</span>
                            <span className="px-2 py-1 bg-[#fbbf24]/20 text-[#fbbf24] text-xs rounded font-medium">High Vol</span>
                        </div>
                        <p className="text-[#868993] text-sm">Real-time social & news analysis from 50k+ sources.</p>
                    </div>

                    {/* API Access (Bottom Wide) */}
                    <div
                        className="md:col-span-2 md:row-span-1 rounded-2xl border border-[#2a2e39] bg-[#0b0e14] p-6 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden group transition-all duration-300 hover:border-[#00d4ff]/50"
                        onMouseEnter={() => setHoveredCard('api')}
                        onMouseLeave={() => setHoveredCard(null)}
                        style={{
                            boxShadow: hoveredCard === 'api' ? '0 0 30px rgba(0, 212, 255, 0.1)' : 'none'
                        }}
                    >
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2 text-[#868993]">
                                <Terminal className="w-5 h-5" />
                                <span className="font-bold text-sm">DEVELOPER API</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Direct Market Access</h3>
                            <p className="text-[#868993] text-sm">Connect your own algos via WebSocket or REST API.</p>
                        </div>
                        <div className="w-full md:w-1/2 bg-[#131722] rounded-lg border border-[#2a2e39] p-4 font-mono text-xs text-[#868993] group-hover:border-[#00d4ff]/30 transition-colors">
                            <div className="flex gap-1.5 mb-3">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
                                <div className="w-2.5 h-2.5 rounded-full bg-[#fbbf24]" />
                                <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                            </div>
                            <p><span className="text-[#7c3aed]">const</span> <span className="text-[#00d4ff]">alert</span> = <span className="text-[#7c3aed]">await</span> uptrade.<span className="text-[#10b981]">watch</span>(<span className="text-[#fbbf24]">&apos;TSLA&apos;</span>);</p>
                            <p className="mt-1 text-[#868993]/60">// Returns: {`{ divergence: 0.94, signal: 'SELL' }`}</p>
                        </div>
                    </div>

                    {/* Global Coverage (Bottom Right Wide) */}
                    <div
                        className="md:col-span-2 md:row-span-1 rounded-2xl border border-[#2a2e39] bg-[#131722]/60 backdrop-blur-xl p-6 flex items-center justify-between relative overflow-hidden group transition-all duration-300 hover:border-white/20"
                        onMouseEnter={() => setHoveredCard('global')}
                        onMouseLeave={() => setHoveredCard(null)}
                    >
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Zap className="w-5 h-5 text-[#fbbf24]" />
                                <span className="text-xs text-[#868993] font-bold uppercase">Global Coverage</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1">Stocks, Crypto, Forex, and Indices</h3>
                            <p className="text-[#868993] text-sm">10,000+ assets across 50+ exchanges worldwide.</p>
                        </div>
                        <Globe className="w-20 h-20 text-[#2a2e39] group-hover:text-[#2962FF]/30 transition-colors duration-500 group-hover:rotate-12" />
                    </div>

                </div>
            </div>
        </section>
    );
};
