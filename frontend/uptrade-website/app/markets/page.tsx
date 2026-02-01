"use client"

import { useState } from "react"
import { GlassmorphismNav } from "@/components/glassmorphism-nav"
import { Footer } from "@/components/footer"
import { TrendingUp, TrendingDown, BarChart3, Coins, DollarSign, LineChart, ChevronRight, Search } from "lucide-react"

// Mock market data
const marketTicker = [
    { symbol: "S&P 500", price: "6,939.02", change: "-0.43%", negative: true },
    { symbol: "NASDAQ", price: "19,824.50", change: "+0.12%", negative: false },
    { symbol: "DOW", price: "44,882.13", change: "-0.28%", negative: true },
    { symbol: "BTC", price: "103,245.00", change: "+2.34%", negative: false },
    { symbol: "ETH", price: "3,245.80", change: "+1.87%", negative: false },
    { symbol: "EUR/USD", price: "1.0342", change: "-0.15%", negative: true },
]

const assetTabs = ["Stocks", "Crypto", "Forex", "Futures", "Bonds", "ETFs"]

const marketCategories = [
    {
        icon: LineChart,
        title: "Stocks",
        description: "Access 70+ stock exchanges worldwide with real-time data",
        stats: ["Indices: 150+", "Stocks: 50K+", "Real-time"],
        tags: ["Tech", "Finance", "Healthcare"],
        color: "#2962FF",
    },
    {
        icon: Coins,
        title: "Crypto",
        description: "Trade cryptocurrencies 24/7 with advanced AI analysis",
        stats: ["Coins: 10K+", "Exchanges: 50+", "24/7 Trading"],
        tags: ["Bitcoin", "Ethereum", "DeFi"],
        color: "#ff9800",
    },
    {
        icon: DollarSign,
        title: "Forex",
        description: "Global currency pairs with institutional-grade spreads",
        stats: ["Pairs: 100+", "Markets: 24/5", "Low Spreads"],
        tags: ["EUR/USD", "GBP/USD", "USD/JPY"],
        color: "#089981",
    },
    {
        icon: BarChart3,
        title: "Futures",
        description: "Trade futures contracts across commodities and indices",
        stats: ["Contracts: 500+", "Commodities", "E-minis"],
        tags: ["Gold", "Oil", "S&P 500"],
        color: "#9c27b0",
    },
]

const majorIndices = [
    { icon: "100", name: "Nasdaq 100", symbol: "NDX", price: "25,552.39", currency: "USD", change: "-1.28%", negative: true },
    { icon: "225", name: "Japan 225", symbol: "NI225", price: "53,322.80", currency: "JPY", change: "-0.10%", negative: true },
    { icon: "🇨🇳", name: "SSE Composite", symbol: "000001", price: "4,117.9476", currency: "CNY", change: "-0.96%", negative: true },
    { icon: "🇬🇧", name: "FTSE 100", symbol: "UKX", price: "10,223.54", currency: "GBP", change: "+0.51%", negative: false },
    { icon: "🇩🇪", name: "DAX", symbol: "DAX", price: "24,538.81", currency: "EUR", change: "+0.94%", negative: false },
    { icon: "40", name: "CAC 40", symbol: "PX1", price: "8,126.53", currency: "EUR", change: "+0.68%", negative: false },
]

const heatmapData = [
    { ticker: "AAPL", change: 2.34, size: 100 },
    { ticker: "MSFT", change: 1.56, size: 95 },
    { ticker: "GOOGL", change: -0.87, size: 85 },
    { ticker: "AMZN", change: 0.45, size: 80 },
    { ticker: "NVDA", change: 3.21, size: 90 },
    { ticker: "TSLA", change: -2.13, size: 70 },
    { ticker: "META", change: 1.78, size: 75 },
    { ticker: "BRK.B", change: -0.32, size: 65 },
    { ticker: "JPM", change: 0.89, size: 60 },
    { ticker: "V", change: 1.23, size: 55 },
    { ticker: "JNJ", change: -0.56, size: 50 },
    { ticker: "WMT", change: 0.67, size: 45 },
]

export default function MarketsPage() {
    const [activeTab, setActiveTab] = useState("Stocks")

    return (
        <div className="min-h-screen bg-transparent">
            <GlassmorphismNav />

            <main className="pt-24 pb-16">
                {/* Market Ticker */}
                <div
                    className="border-y overflow-hidden"
                    style={{ backgroundColor: 'var(--tv-surface)', borderColor: 'var(--tv-border)' }}
                >
                    <div className="flex items-center gap-8 px-4 py-3 animate-slide-left whitespace-nowrap">
                        {[...marketTicker, ...marketTicker].map((item, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <span className="font-medium" style={{ color: 'var(--tv-text-primary)' }}>{item.symbol}</span>
                                <span style={{ color: 'var(--tv-text)' }}>{item.price}</span>
                                <span
                                    className="flex items-center gap-1"
                                    style={{ color: item.negative ? 'var(--tv-red)' : 'var(--tv-green)' }}
                                >
                                    {item.negative ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                                    {item.change}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 mt-8">
                    {/* Page Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: 'var(--tv-text-primary)' }}>
                                Markets
                            </h1>
                            <p style={{ color: 'var(--tv-text-muted)' }}>
                                Track global markets, analyze sectors, and discover opportunities
                            </p>
                        </div>

                        {/* Search Bar */}
                        <div
                            className="hidden md:flex items-center gap-2 px-4 py-2 rounded"
                            style={{ backgroundColor: 'var(--tv-surface)', border: '1px solid var(--tv-border)' }}
                        >
                            <Search className="w-4 h-4" style={{ color: 'var(--tv-text-muted)' }} />
                            <input
                                type="text"
                                placeholder="Symbol, Name, or Exchange..."
                                className="bg-transparent border-none outline-none text-sm w-64"
                                style={{ color: 'var(--tv-text)' }}
                            />
                        </div>
                    </div>

                    {/* Asset Tabs */}
                    <div
                        className="flex items-center gap-1 border-b mb-8 overflow-x-auto"
                        style={{ borderColor: 'var(--tv-border)' }}
                    >
                        {assetTabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-3 text-sm font-medium transition-colors relative ${activeTab === tab ? '' : 'hover:bg-[var(--tv-surface)]'
                                    }`}
                                style={{
                                    color: activeTab === tab ? 'var(--tv-text-primary)' : 'var(--tv-text-muted)',
                                }}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <div
                                        className="absolute bottom-0 left-0 right-0 h-0.5"
                                        style={{ backgroundColor: 'var(--tv-blue)' }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Market Categories + Heatmap */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Market Category Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {marketCategories.map((category, index) => (
                                    <div
                                        key={index}
                                        className="rounded-lg p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer group"
                                        style={{
                                            backgroundColor: 'var(--tv-surface)',
                                            border: '1px solid var(--tv-border)',
                                        }}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div
                                                className="p-3 rounded-lg"
                                                style={{ backgroundColor: 'var(--tv-surface-hover)' }}
                                            >
                                                <category.icon className="w-6 h-6" style={{ color: category.color }} />
                                            </div>
                                            <span
                                                className="flex items-center gap-1 text-sm group-hover:gap-2 transition-all"
                                                style={{ color: 'var(--tv-blue)' }}
                                            >
                                                View <ChevronRight className="w-4 h-4" />
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--tv-text-primary)' }}>
                                            {category.title}
                                        </h3>
                                        <p className="text-sm mb-4" style={{ color: 'var(--tv-text-muted)' }}>
                                            {category.description}
                                        </p>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {category.stats.map((stat, i) => (
                                                <span
                                                    key={i}
                                                    className="text-xs uppercase"
                                                    style={{ color: 'var(--tv-text-secondary)' }}
                                                >
                                                    {stat}{i < category.stats.length - 1 && " • "}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {category.tags.map((tag, i) => (
                                                <span
                                                    key={i}
                                                    className="px-3 py-1 rounded text-xs"
                                                    style={{
                                                        backgroundColor: 'var(--tv-surface-hover)',
                                                        color: 'var(--tv-text)'
                                                    }}
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Market Heatmap */}
                            <div
                                className="rounded-lg p-6"
                                style={{ backgroundColor: 'var(--tv-surface)', border: '1px solid var(--tv-border)' }}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold" style={{ color: 'var(--tv-text-primary)' }}>
                                        Market Heatmap
                                    </h3>
                                    <div className="flex items-center gap-4 text-xs">
                                        <span className="flex items-center gap-1">
                                            <div className="w-3 h-3 rounded" style={{ backgroundColor: 'var(--tv-green)' }} />
                                            Positive
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <div className="w-3 h-3 rounded" style={{ backgroundColor: 'var(--tv-red)' }} />
                                            Negative
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                                    {heatmapData.map((stock, index) => {
                                        const intensity = Math.min(Math.abs(stock.change) / 3, 1)
                                        const bgColor = stock.change >= 0
                                            ? `rgba(8, 153, 129, ${0.3 + intensity * 0.7})`
                                            : `rgba(242, 54, 69, ${0.3 + intensity * 0.7})`

                                        return (
                                            <div
                                                key={index}
                                                className="aspect-square rounded flex flex-col items-center justify-center p-2 cursor-pointer hover:scale-105 transition-transform"
                                                style={{ backgroundColor: bgColor }}
                                            >
                                                <span className="text-xs font-bold" style={{ color: 'var(--tv-text-primary)' }}>
                                                    {stock.ticker}
                                                </span>
                                                <span className="text-xs" style={{ color: 'var(--tv-text-primary)' }}>
                                                    {stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)}%
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Major Indices */}
                        <div className="space-y-6">
                            {/* S&P 500 Chart */}
                            <div
                                className="rounded-lg p-6"
                                style={{ backgroundColor: 'var(--tv-surface)', border: '1px solid var(--tv-border)' }}
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div
                                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                                        style={{ backgroundColor: 'var(--tv-blue)', color: 'white' }}
                                    >
                                        500
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold" style={{ color: 'var(--tv-text-primary)' }}>S&P 500</span>
                                            <span className="text-xs" style={{ color: 'var(--tv-text-muted)' }}>SPX</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl font-bold" style={{ color: 'var(--tv-text-primary)' }}>6,939.02</span>
                                            <span style={{ color: 'var(--tv-red)' }}>-0.43%</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Mini chart */}
                                <div className="h-32 mt-4">
                                    <svg viewBox="0 0 200 80" className="w-full h-full">
                                        <path
                                            d="M0,40 L10,42 L20,38 L30,45 L40,35 L50,40 L60,32 L70,38 L80,30 L90,35 L100,28 L110,32 L120,25 L130,30 L140,22 L150,28 L160,20 L170,25 L180,18 L190,22 L200,15"
                                            fill="none"
                                            stroke="#f23645"
                                            strokeWidth="2"
                                        />
                                    </svg>
                                </div>
                            </div>

                            {/* Major Indices List */}
                            <div
                                className="rounded-lg p-6"
                                style={{ backgroundColor: 'var(--tv-surface)', border: '1px solid var(--tv-border)' }}
                            >
                                <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--tv-text-primary)' }}>
                                    Major Indices
                                </h3>

                                <div className="space-y-4">
                                    {majorIndices.map((index, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center justify-between py-2 border-b last:border-0 cursor-pointer hover:bg-[var(--tv-surface-hover)] -mx-2 px-2 rounded transition-colors"
                                            style={{ borderColor: 'var(--tv-border)' }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                                                    style={{ backgroundColor: 'var(--tv-surface-hover)', color: 'var(--tv-text)' }}
                                                >
                                                    {index.icon}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-sm" style={{ color: 'var(--tv-text-primary)' }}>
                                                        {index.name}
                                                    </div>
                                                    <div className="text-xs" style={{ color: 'var(--tv-text-muted)' }}>
                                                        {index.symbol}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm" style={{ color: 'var(--tv-text-primary)' }}>
                                                    {index.price}<span className="text-xs ml-1" style={{ color: 'var(--tv-text-muted)' }}>{index.currency}</span>
                                                </div>
                                                <div
                                                    className="text-xs"
                                                    style={{ color: index.negative ? 'var(--tv-red)' : 'var(--tv-green)' }}
                                                >
                                                    {index.change}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <a
                                    href="#"
                                    className="flex items-center gap-1 mt-4 text-sm"
                                    style={{ color: 'var(--tv-blue)' }}
                                >
                                    See all major indices <ChevronRight className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
