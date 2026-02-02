'use client'

import Link from 'next/link'
import { Terminal } from '../ui/Terminal'
import { Zap } from 'lucide-react'
import { useState, useEffect } from 'react'

export function Hero() {
    const [tradersOnline, setTradersOnline] = useState(1247);

    // Simulate live trader count fluctuation
    useEffect(() => {
        const interval = setInterval(() => {
            setTradersOnline(prev => Math.max(1100, Math.min(1400, prev + Math.floor((Math.random() - 0.5) * 20))));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="pt-28 pb-20 px-6 relative z-10">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                {/* Left: Terminal Copy */}
                <div className="text-left">
                    {/* Live badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#10b981]/10 text-[#10b981] text-xs font-mono font-bold mb-8 border border-[#10b981]/20">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
                        </span>
                        LIVE: {tradersOnline.toLocaleString()} TRADERS ONLINE
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-8 leading-[1.1] tracking-tight">
                        Your Bloomberg Terminal Costs{' '}
                        <span className="relative inline-block">
                            <span className="line-through decoration-[#ef4444] decoration-4 text-white/30">$24K</span>
                        </span>
                        /yr.
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] to-[#2962FF]">
                            UpTrade is $0.
                        </span>
                    </h1>

                    <p className="text-lg lg:text-xl text-[#868993] mb-10 leading-relaxed max-w-lg">
                        Institutional-grade decision intelligence.{' '}
                        <strong className="text-white font-medium">VisualX</strong> divergence detection,{' '}
                        <strong className="text-white font-medium">TradeX</strong> scoring, and{' '}
                        <span className="text-[#00d4ff] font-mono">&lt;50ms</span> latency.
                    </p>

                    {/* CTA Section */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="relative flex-1 max-w-xs">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full bg-[#131722] border border-[#2a2e39] text-white px-5 py-4 rounded-lg focus:outline-none focus:border-[#00d4ff] focus:ring-1 focus:ring-[#00d4ff]/50 transition-all placeholder:text-[#868993]"
                            />
                        </div>
                        <Link href="/app">
                            <button className="w-full sm:w-auto px-8 py-4 bg-[#00d4ff] hover:bg-[#00b8d9] text-[#0a0a0f] font-bold rounded-lg text-lg transition-all hover:scale-[1.02] active:scale-[0.98]">
                                Get Access
                            </button>
                        </Link>
                    </div>

                    <p className="text-xs text-[#868993] font-mono flex items-center gap-2">
                        <Zap className="w-3 h-3 text-[#fbbf24]" />
                        No credit card required • 14-day Pro trial included
                    </p>
                </div>

                {/* Right: Interactive Terminal */}
                <div className="relative lg:pl-8">
                    {/* Subtle glow effect - single color, not gradient */}
                    <div className="absolute inset-0 bg-[#00d4ff]/5 blur-[80px] -z-10 rounded-full scale-125" />

                    <Terminal />

                    {/* Floating stat card */}
                    <div className="absolute -bottom-4 -left-4 bg-[#0b0e14]/90 backdrop-blur-md border border-[#2a2e39] p-4 rounded-lg shadow-xl hidden lg:block animate-float-slow">
                        <div className="text-xs text-[#868993] mb-1 font-mono">TSLA SENTIMENT</div>
                        <div className="text-[#ef4444] font-bold flex items-center gap-1 text-lg">
                            ▼ Bearish
                            <span className="text-sm font-mono">(-0.84σ)</span>
                        </div>
                    </div>

                    {/* Another floating card */}
                    <div className="absolute -top-4 -right-4 bg-[#0b0e14]/90 backdrop-blur-md border border-[#10b981]/30 p-3 rounded-lg shadow-xl hidden lg:block animate-float-delayed">
                        <div className="text-xs text-[#10b981] font-mono font-bold">TradeX Score</div>
                        <div className="text-white font-bold text-xl">94<span className="text-sm text-[#868993]">/100</span></div>
                    </div>
                </div>
            </div>
        </section>
    )
}
