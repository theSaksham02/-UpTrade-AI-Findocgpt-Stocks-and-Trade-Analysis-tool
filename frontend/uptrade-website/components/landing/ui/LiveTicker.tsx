'use client';

import { useState } from 'react';

import { useQuotes } from '@/components/uptrade-terminal/hooks';

const TICKERS = [
    { symbol: 'BTC', yahoo: 'BTC-USD' },
    { symbol: 'TSLA', yahoo: 'TSLA' },
    { symbol: 'NVDA', yahoo: 'NVDA' },
    { symbol: 'SPY', yahoo: 'SPY' },
    { symbol: 'AAPL', yahoo: 'AAPL' },
    { symbol: 'META', yahoo: 'META' },
    { symbol: 'GOOGL', yahoo: 'GOOGL' },
    { symbol: 'AMD', yahoo: 'AMD' },
    { symbol: 'MSFT', yahoo: 'MSFT' },
    { symbol: 'AMZN', yahoo: 'AMZN' },
];

export const LiveTicker = () => {
    const [isPaused, setIsPaused] = useState(false);
    // Real quotes (refreshed every 30s); items without a quote yet are hidden
    const quotes = useQuotes(TICKERS.map((t) => t.yahoo), 30000);
    const tickers = TICKERS.flatMap((t) => {
        const q = quotes[t.yahoo];
        return q ? [{ symbol: t.symbol, price: q.price, change: q.changePercent }] : [];
    });

    const formatPrice = (price: number) =>
        price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    if (!tickers.length) return <div className="h-[45px] w-full bg-[#0b0e14] border-y border-[#2a2e39]" />;

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
