'use client';

import { useState, useEffect, useRef } from 'react';
import { AlertTriangle, TrendingDown, Clock, Copy, Check } from 'lucide-react';

interface TerminalLine {
    type: 'command' | 'response' | 'alert' | 'data' | 'json';
    content: string;
    delay?: number;
}

const terminalScript: TerminalLine[] = [
    { type: 'command', content: '$ curl api.uptrade.com/v1/divergence/TSLA', delay: 0 },
    { type: 'response', content: 'HTTP/1.1 200 OK • latency: 42ms', delay: 600 },
    { type: 'json', content: '{', delay: 1000 },
    { type: 'json', content: '  "symbol": "TSLA",', delay: 1100 },
    { type: 'json', content: '  "price": 263.04,', delay: 1200 },
    { type: 'json', content: '  "timestamp": "2026-02-02T09:34:12Z",', delay: 1300 },
    { type: 'alert', content: '  "divergence_detected": true,', delay: 1600 },
    { type: 'data', content: '  "sentiment_sigma": -0.84,', delay: 1800 },
    { type: 'data', content: '  "divergence_type": "LIQUIDITY",', delay: 2000 },
    { type: 'data', content: '  "confidence": 0.94,', delay: 2200 },
    { type: 'data', content: '  "eta_volatility_sec": 180', delay: 2400 },
    { type: 'json', content: '}', delay: 2600 },
];

export const Terminal = () => {
    const [lines, setLines] = useState<TerminalLine[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [latency, setLatency] = useState(42);
    const [copied, setCopied] = useState(false);
    const [countdown, setCountdown] = useState(180);
    const chartRef = useRef<HTMLDivElement>(null);

    // Typewriter effect
    useEffect(() => {
        if (currentIndex >= terminalScript.length) {
            const resetTimer = setTimeout(() => {
                setLines([]);
                setCurrentIndex(0);
                setCountdown(180);
            }, 8000);
            return () => clearTimeout(resetTimer);
        }

        const line = terminalScript[currentIndex];
        const timer = setTimeout(() => {
            setLines(prev => [...prev, line]);
            setCurrentIndex(prev => prev + 1);
        }, line.delay || 0);

        return () => clearTimeout(timer);
    }, [currentIndex]);

    // Latency jitter
    useEffect(() => {
        const interval = setInterval(() => {
            setLatency(42 + Math.floor(Math.random() * 10));
        }, 1200);
        return () => clearInterval(interval);
    }, []);

    // Countdown
    useEffect(() => {
        if (countdown <= 0 || currentIndex < 8) return;
        const timer = setInterval(() => {
            setCountdown(prev => Math.max(0, prev - 1));
        }, 1000);
        return () => clearInterval(timer);
    }, [countdown, currentIndex]);

    const handleCopy = () => {
        navigator.clipboard.writeText('curl api.uptrade.com/v1/divergence/TSLA');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

    const getLineColor = (type: TerminalLine['type']) => {
        switch (type) {
            case 'command': return 'text-[#00d4ff]';
            case 'response': return 'text-[#868993]';
            case 'alert': return 'text-[#ef4444]';
            case 'data': return 'text-[#10b981]';
            case 'json': return 'text-[#868993]';
            default: return 'text-white';
        }
    };

    // Generate simulated divergence chart data
    const generateChartBars = () => {
        const priceData = [40, 42, 41, 43, 44, 45, 44, 46, 47, 46, 48, 49, 48, 50, 51, 50, 52, 51, 53, 52];
        const sentimentData = [38, 40, 39, 41, 42, 40, 35, 30, 25, 22, 18, 15, 12, 10, 8, 7, 6, 5, 5, 4];

        return { priceData, sentimentData };
    };

    const { priceData, sentimentData } = generateChartBars();
    const showChart = currentIndex >= 6;
    const showAlert = lines.some(l => l.type === 'alert');

    return (
        <div className="relative font-mono">
            {/* Terminal window */}
            <div className="bg-[#0b0e14] border border-white/10 rounded-lg overflow-hidden shadow-2xl">
                {/* Header bar */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#13131f] border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#fbbf24]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                    </div>
                    <span className="text-[10px] text-[#868993] uppercase tracking-wider">VisualX Terminal v2.4.1</span>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] text-[#10b981] font-medium">{latency}ms</span>
                        <button
                            onClick={handleCopy}
                            className="text-[#868993] hover:text-white transition-colors"
                        >
                            {copied ? <Check className="w-3.5 h-3.5 text-[#10b981]" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                    </div>
                </div>

                {/* Terminal content */}
                <div className="p-4 text-xs leading-relaxed min-h-[240px]">
                    {lines.map((line, i) => (
                        <div key={i} className={`${getLineColor(line.type)} ${line.type === 'json' ? 'pl-0' : ''}`}>
                            {line.content}
                        </div>
                    ))}

                    {/* Blinking cursor */}
                    {currentIndex < terminalScript.length && (
                        <span className="inline-block w-1.5 h-3.5 bg-[#00d4ff] animate-pulse ml-0.5" />
                    )}
                </div>

                {/* Alert banner */}
                {showAlert && (
                    <div className="mx-4 mb-4 flex items-center gap-2 px-3 py-2 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded">
                        <AlertTriangle className="w-3.5 h-3.5 text-[#ef4444]" />
                        <span className="text-[#ef4444] text-[10px] font-bold uppercase tracking-wider">
                            TSLA Liquidity Divergence Detected
                        </span>
                        <span className="text-[#868993] text-[10px] ml-auto">
                            σ = -0.84
                        </span>
                    </div>
                )}

                {/* Mini chart */}
                {showChart && (
                    <div className="mx-4 mb-4 p-3 bg-[#0a0a0f] border border-white/5 rounded">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] text-[#868993] uppercase tracking-wider">Price vs Sentiment</span>
                            <div className="flex items-center gap-3 text-[10px]">
                                <span className="flex items-center gap-1">
                                    <span className="w-2 h-2 bg-[#2962FF] rounded-sm" />
                                    <span className="text-[#868993]">Price</span>
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="w-2 h-2 bg-[#ef4444] rounded-sm" />
                                    <span className="text-[#868993]">Sentiment</span>
                                </span>
                            </div>
                        </div>

                        {/* Dual line chart */}
                        <div className="relative h-16" ref={chartRef}>
                            <svg className="w-full h-full" viewBox="0 0 200 60" preserveAspectRatio="none">
                                {/* Price line (stable) */}
                                <polyline
                                    fill="none"
                                    stroke="#2962FF"
                                    strokeWidth="1.5"
                                    points={priceData.map((v, i) => `${i * 10.5},${60 - v}`).join(' ')}
                                />
                                {/* Sentiment line (crashing) */}
                                <polyline
                                    fill="none"
                                    stroke="#ef4444"
                                    strokeWidth="1.5"
                                    points={sentimentData.map((v, i) => `${i * 10.5},${60 - v}`).join(' ')}
                                />
                                {/* Divergence zone highlight */}
                                <rect x="60" y="0" width="140" height="60" fill="rgba(239,68,68,0.05)" />
                            </svg>
                        </div>

                        {/* Countdown */}
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-3 h-3 text-[#fbbf24]" />
                                <span className="text-[10px] text-[#868993]">ETA volatility expansion:</span>
                            </div>
                            <span className="text-[#fbbf24] text-xs font-bold font-mono">{formatTime(countdown)}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* TradeX Score floating badge */}
            <div className="absolute -top-3 -right-3 bg-[#13131f] border border-white/10 rounded px-2.5 py-1.5 shadow-lg">
                <div className="text-[8px] text-[#868993] uppercase tracking-wider">TradeX</div>
                <div className="text-white font-bold text-lg leading-none">94<span className="text-[10px] text-[#868993]">/100</span></div>
            </div>

            {/* Sentiment badge */}
            {showAlert && (
                <div className="absolute -bottom-3 -left-3 bg-[#13131f] border border-[#ef4444]/30 rounded px-2.5 py-1.5 shadow-lg">
                    <div className="text-[8px] text-[#868993] uppercase tracking-wider">Sentiment</div>
                    <div className="flex items-center gap-1">
                        <TrendingDown className="w-3 h-3 text-[#ef4444]" />
                        <span className="text-[#ef4444] font-bold text-sm">Bearish</span>
                    </div>
                </div>
            )}
        </div>
    );
};
