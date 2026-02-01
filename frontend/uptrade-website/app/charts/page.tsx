'use client'

import { GlassmorphismNav } from "@/components/glassmorphism-nav"
import { Footer } from "@/components/footer"
import { TradingChart, MultiChartLayout, useMarketData } from "@/components/trading-chart"
import { useState, useEffect } from "react"
import { Search, Plus, LayoutGrid, Maximize2, Settings, TrendingUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Time } from "lightweight-charts"

// Sample stock data generator
function generateChartData(basePrice: number, symbol: string) {
    const bars = []
    const now = new Date()
    let price = basePrice

    for (let i = 180; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)

        const volatility = 0.02
        const trend = symbol === 'AAPL' || symbol === 'MSFT' ? 0.001 : -0.0005
        const change = price * volatility * (Math.random() - 0.5 + trend)
        const open = price
        const close = price + change
        const high = Math.max(open, close) * (1 + Math.random() * volatility)
        const low = Math.min(open, close) * (1 - Math.random() * volatility)
        const volume = Math.floor(Math.random() * 10000000) + 1000000

        bars.push({
            time: date.toISOString().split('T')[0] as Time,
            open: parseFloat(open.toFixed(2)),
            high: parseFloat(high.toFixed(2)),
            low: parseFloat(low.toFixed(2)),
            close: parseFloat(close.toFixed(2)),
            volume,
        })

        price = close
    }

    return bars
}

// Watchlist component
function Watchlist({ symbols, onSelect }: { symbols: string[], onSelect: (symbol: string) => void }) {
    const stockData = [
        { symbol: 'AAPL', name: 'Apple Inc.', price: 189.52, change: 2.34, changePercent: 1.25 },
        { symbol: 'MSFT', name: 'Microsoft', price: 378.91, change: 5.67, changePercent: 1.52 },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 141.80, change: -1.23, changePercent: -0.86 },
        { symbol: 'AMZN', name: 'Amazon', price: 178.25, change: 3.45, changePercent: 1.97 },
        { symbol: 'NVDA', name: 'NVIDIA', price: 721.33, change: 15.67, changePercent: 2.22 },
        { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.50, change: -8.75, changePercent: -3.40 },
        { symbol: 'META', name: 'Meta Platforms', price: 474.99, change: 12.34, changePercent: 2.67 },
        { symbol: 'BTC', name: 'Bitcoin', price: 43250.00, change: 1250.00, changePercent: 2.98 },
    ]

    return (
        <div
            className="rounded-lg overflow-hidden"
            style={{ backgroundColor: 'var(--tv-surface)', border: '1px solid var(--tv-border)' }}
        >
            <div
                className="px-4 py-3 flex items-center justify-between"
                style={{ borderBottom: '1px solid var(--tv-border)' }}
            >
                <span className="font-semibold" style={{ color: 'var(--tv-text-primary)' }}>Watchlist</span>
                <button className="p-1 rounded hover:bg-white/10 transition-colors">
                    <Plus className="w-4 h-4" style={{ color: 'var(--tv-text-muted)' }} />
                </button>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--tv-border)' }}>
                {stockData.map((stock) => (
                    <button
                        key={stock.symbol}
                        onClick={() => onSelect(stock.symbol)}
                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors text-left"
                    >
                        <div>
                            <div className="font-medium" style={{ color: 'var(--tv-text-primary)' }}>{stock.symbol}</div>
                            <div className="text-xs" style={{ color: 'var(--tv-text-muted)' }}>{stock.name}</div>
                        </div>
                        <div className="text-right">
                            <div className="font-medium" style={{ color: 'var(--tv-text-primary)' }}>
                                ${stock.price.toLocaleString()}
                            </div>
                            <div
                                className="text-xs font-medium"
                                style={{ color: stock.change >= 0 ? 'var(--tv-green)' : 'var(--tv-red)' }}
                            >
                                {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
}

// Top bar with market overview
function MarketBar() {
    const markets = [
        { name: 'S&P 500', value: '4,783.83', change: '+0.54%', positive: true },
        { name: 'Dow Jones', value: '37,440.34', change: '+0.38%', positive: true },
        { name: 'Nasdaq', value: '14,969.65', change: '+0.82%', positive: true },
        { name: 'BTC/USD', value: '43,250.00', change: '+2.98%', positive: true },
        { name: 'ETH/USD', value: '2,285.50', change: '+1.45%', positive: true },
        { name: 'Gold', value: '2,051.30', change: '-0.12%', positive: false },
    ]

    return (
        <div
            className="flex items-center gap-6 px-4 py-2 overflow-x-auto"
            style={{ backgroundColor: 'var(--tv-surface)', borderBottom: '1px solid var(--tv-border)' }}
        >
            {markets.map((m) => (
                <div key={m.name} className="flex items-center gap-2 whitespace-nowrap">
                    <span className="text-sm" style={{ color: 'var(--tv-text-muted)' }}>{m.name}</span>
                    <span className="text-sm font-medium" style={{ color: 'var(--tv-text-primary)' }}>{m.value}</span>
                    <span
                        className="text-sm font-medium"
                        style={{ color: m.positive ? 'var(--tv-green)' : 'var(--tv-red)' }}
                    >
                        {m.change}
                    </span>
                </div>
            ))}
        </div>
    )
}

export default function ChartsPage() {
    const [selectedSymbol, setSelectedSymbol] = useState('AAPL')
    const [layout, setLayout] = useState<'1x1' | '1x2' | '2x2'>('1x1')
    const [chartData, setChartData] = useState<Record<string, any[]>>({})
    const [activeSymbols, setActiveSymbols] = useState(['AAPL'])

    // Generate chart data for each symbol
    useEffect(() => {
        const basePrices: Record<string, number> = {
            'AAPL': 185,
            'MSFT': 375,
            'GOOGL': 140,
            'AMZN': 175,
            'NVDA': 700,
            'TSLA': 250,
            'META': 470,
            'BTC': 43000,
        }

        const data: Record<string, any[]> = {}
        activeSymbols.forEach((symbol) => {
            data[symbol] = generateChartData(basePrices[symbol] || 100, symbol)
        })
        setChartData(data)
    }, [activeSymbols])

    // Simulate real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            setChartData((prev) => {
                const updated = { ...prev }
                Object.keys(updated).forEach((symbol) => {
                    const bars = [...updated[symbol]]
                    if (bars.length > 0) {
                        const lastBar = bars[bars.length - 1]
                        const volatility = 0.003
                        const change = lastBar.close * volatility * (Math.random() - 0.5)
                        const newClose = lastBar.close + change

                        bars[bars.length - 1] = {
                            ...lastBar,
                            high: Math.max(lastBar.high, newClose),
                            low: Math.min(lastBar.low, newClose),
                            close: parseFloat(newClose.toFixed(2)),
                            volume: lastBar.volume + Math.floor(Math.random() * 50000),
                        }
                        updated[symbol] = bars
                    }
                })
                return updated
            })
        }, 3000)

        return () => clearInterval(interval)
    }, [])

    const handleSymbolSelect = (symbol: string) => {
        setSelectedSymbol(symbol)
        if (!activeSymbols.includes(symbol)) {
            const maxSymbols = layout === '1x1' ? 1 : layout === '1x2' ? 2 : 4
            setActiveSymbols((prev) => {
                const newSymbols = [...prev, symbol].slice(-maxSymbols)
                return newSymbols
            })
        }
    }

    const handleLayoutChange = (newLayout: '1x1' | '1x2' | '2x2') => {
        setLayout(newLayout)
        const maxSymbols = newLayout === '1x1' ? 1 : newLayout === '1x2' ? 2 : 4
        setActiveSymbols((prev) => prev.slice(0, maxSymbols))
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--tv-bg-dark)' }}>
            <GlassmorphismNav />

            <main className="pt-20">
                {/* Market Bar */}
                <MarketBar />

                {/* Toolbar */}
                <div
                    className="flex items-center justify-between px-4 py-3"
                    style={{ borderBottom: '1px solid var(--tv-border)' }}
                >
                    <div className="flex items-center gap-4">
                        {/* Symbol search */}
                        <div
                            className="flex items-center gap-2 px-3 py-2 rounded-lg"
                            style={{ backgroundColor: 'var(--tv-surface)', border: '1px solid var(--tv-border)' }}
                        >
                            <Search className="w-4 h-4" style={{ color: 'var(--tv-text-muted)' }} />
                            <input
                                type="text"
                                placeholder="Search symbols..."
                                className="bg-transparent border-none outline-none text-sm w-48"
                                style={{ color: 'var(--tv-text-primary)' }}
                            />
                        </div>

                        {/* Current symbol */}
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" style={{ color: 'var(--tv-blue)' }} />
                            <span className="font-bold text-lg" style={{ color: 'var(--tv-text-primary)' }}>
                                {selectedSymbol}
                            </span>
                            <ChevronDown className="w-4 h-4" style={{ color: 'var(--tv-text-muted)' }} />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Layout buttons */}
                        <div
                            className="flex items-center rounded-lg overflow-hidden"
                            style={{ border: '1px solid var(--tv-border)' }}
                        >
                            {[
                                { value: '1x1', label: '1' },
                                { value: '1x2', label: '2' },
                                { value: '2x2', label: '4' },
                            ].map((l) => (
                                <button
                                    key={l.value}
                                    onClick={() => handleLayoutChange(l.value as any)}
                                    className="px-3 py-2 text-sm font-medium transition-colors"
                                    style={{
                                        backgroundColor: layout === l.value ? 'var(--tv-blue)' : 'transparent',
                                        color: layout === l.value ? 'white' : 'var(--tv-text-muted)',
                                    }}
                                >
                                    {l.label}
                                </button>
                            ))}
                        </div>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-sm"
                            style={{ color: 'var(--tv-text-muted)' }}
                        >
                            <Maximize2 className="w-4 h-4" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-sm"
                            style={{ color: 'var(--tv-text-muted)' }}
                        >
                            <Settings className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex gap-0" style={{ height: 'calc(100vh - 160px)' }}>
                    {/* Watchlist Sidebar */}
                    <div
                        className="w-64 flex-shrink-0 overflow-y-auto p-4"
                        style={{ borderRight: '1px solid var(--tv-border)' }}
                    >
                        <Watchlist symbols={activeSymbols} onSelect={handleSymbolSelect} />
                    </div>

                    {/* Charts Area */}
                    <div className="flex-1 p-4 overflow-y-auto">
                        {layout === '1x1' ? (
                            <TradingChart
                                symbol={activeSymbols[0] || 'AAPL'}
                                data={chartData[activeSymbols[0]] || []}
                                height={600}
                                showVolume={true}
                            />
                        ) : (
                            <MultiChartLayout
                                symbols={activeSymbols}
                                dataMap={chartData}
                                layout={layout}
                            />
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
