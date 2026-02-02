'use client';

import { useState, useEffect } from 'react';

interface TickerItem {
    symbol: string;
    price: number;
    change: number;
}

const initialTickers: TickerItem[] = [
    { symbol: 'BTC', price: 42839.24, change: 2.4 },
    { symbol: 'TSLA', price: 263.04, change: -1.2 },
    { symbol: 'NVDA', price: 721.84, change: 5.6 },
    { symbol: 'SPY', price: 515.19, change: 0.4 },
    { symbol: 'AAPL', price: 186.45, change: -0.64 },
    { symbol: 'META', price: 474.51, change: 1.95 },
    { symbol: 'GOOGL', price: 141.24, change: -0.6 },
    { symbol: 'AMD', price: 168.75, change: 1.8 },
    { symbol: 'MSFT', price: 378.91, change: -0.33 },
    { symbol: 'AMZN', price: 172.44, change: 1.26 },
];

export const LiveTicker = () => {
    const [tickers, setTickers] = useState(initialTickers);
    const [isPaused, setIsPaused] = useState(false);

    // Simulate live price updates
    useEffect(() => {
        const interval = setInterval(() => {
            setTickers(prev => prev.map(ticker => ({
                ...ticker,
                price: ticker.price * (1 + (Math.random() - 0.5) * 0.002),
                change: ticker.change + (Math.random() - 0.5) * 0.1,
            })));
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const formatPrice = (price: number) => {
        if (price > 1000) return price.toFixed(2);
        if (price > 100) return price.toFixed(2);
        return price.toFixed(2);
    };

    return (
        <div
            className="w-full bg-[#0b0e14] border-y border-[#2a2e39] overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div
                className={`flex whitespace-nowrap ${isPaused ? '' : 'animate-ticker'}`}
                style={{
                    animation: isPaused ? 'none' : 'ticker 30s linear infinite',
                }}
            >
                {/* Double the items for seamless loop */}
                {[...tickers, ...tickers].map((ticker, i) => (
                    <a
                        key={`${ticker.symbol}-${i}`}
                        href={`/app?symbol=${ticker.symbol}`}
                        className="flex items-center gap-3 px-6 py-3 border-r border-[#2a2e39]/50 hover:bg-[#131722] transition-colors cursor-pointer group"
                    >
                        <span className="text-white font-bold text-sm group-hover:text-[#00d4ff] transition-colors">
                            {ticker.symbol}
                        </span>
                        <span className="text-[#868993] text-sm font-mono">
                            ${formatPrice(ticker.price)}
                        </span>
                        <span className={`text-xs font-bold flex items-center gap-0.5 ${ticker.change >= 0 ? 'text-[#10b981]' : 'text-[#ef4444]'
                            }`}>
                            {ticker.change >= 0 ? '▲' : '▼'}
                            {Math.abs(ticker.change).toFixed(2)}%
                        </span>
                    </a>
                ))}
            </div>

            <style jsx>{`
                @keyframes ticker {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
        </div>
    );
};
