'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { createChart, IChartApi, CandlestickData, HistogramData, Time, CandlestickSeries, HistogramSeries } from 'lightweight-charts'

// ============================================================
// UNIFIED TRADING DASHBOARD - TradingView/Bloomberg Style
// Single integrated interface, no separate marketing pages
// ============================================================

// Icons (inline SVG for zero dependencies)
const Icons = {
    Search: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
    ),
    TrendingUp: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
        </svg>
    ),
    BarChart: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
        </svg>
    ),
    Eye: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
        </svg>
    ),
    Play: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
    ),
    Bell: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
    ),
    Grid: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
        </svg>
    ),
    Maximize: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
        </svg>
    ),
    X: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    ),
    Alert: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
    ),
}

// ============================================================
// GENERATE REALISTIC OHLC DATA
// ============================================================
function generateOHLCData(symbol: string, days: number = 60): CandlestickData[] {
    const basePrices: Record<string, number> = {
        'AAPL': 186.45, 'TSLA': 248.76, 'SPY': 478.23, 'BTCUSD': 42847.50,
        'MSFT': 378.91, 'GOOGL': 141.23, 'NVDA': 721.84, 'META': 474.32,
        'AMZN': 172.45, 'AMD': 168.92
    }

    const data: CandlestickData[] = []
    let price = basePrices[symbol] || 100
    const now = new Date()

    for (let i = days; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)
        if (symbol !== 'BTCUSD' && (date.getDay() === 0 || date.getDay() === 6)) continue

        const volatility = symbol === 'BTCUSD' ? 0.035 : (symbol === 'TSLA' ? 0.028 : 0.015)
        const change = (Math.random() - 0.48) * volatility * price
        const open = price
        const close = price + change
        const high = Math.max(open, close) + Math.random() * Math.abs(change) * 0.5
        const low = Math.min(open, close) - Math.random() * Math.abs(change) * 0.5

        data.push({
            time: date.toISOString().split('T')[0] as Time,
            open: parseFloat(open.toFixed(2)),
            high: parseFloat(high.toFixed(2)),
            low: parseFloat(low.toFixed(2)),
            close: parseFloat(close.toFixed(2))
        })
        price = close
    }
    return data
}

function generateVolumeData(ohlcData: CandlestickData[]): HistogramData[] {
    return ohlcData.map(candle => ({
        time: candle.time,
        value: Math.floor(Math.random() * 50000000) + 10000000,
        color: candle.close >= candle.open ? 'rgba(8, 153, 129, 0.5)' : 'rgba(242, 54, 69, 0.5)'
    }))
}

// ============================================================
// TRADING HEADER
// ============================================================
function TradingHeader({ onSearch }: { onSearch: (query: string) => void }) {
    const [searchQuery, setSearchQuery] = useState('')
    const [time, setTime] = useState('')

    useEffect(() => {
        const update = () => {
            const now = new Date()
            const est = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }))
            setTime(`${est.getHours().toString().padStart(2, '0')}:${est.getMinutes().toString().padStart(2, '0')}:${est.getSeconds().toString().padStart(2, '0')}`)
        }
        update()
        const interval = setInterval(update, 1000)
        return () => clearInterval(interval)
    }, [])

    return (
        <header className="h-12 bg-[#131722] border-b border-[#2a2e39] flex items-center px-4 justify-between fixed w-full top-0 z-50">
            {/* LEFT: Logo + Symbol Search */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-[#2962FF] rounded flex items-center justify-center">
                        <Icons.TrendingUp />
                    </div>
                    <span className="font-bold text-white text-lg tracking-tight">UpTrade</span>
                </div>

                <div className="relative">
                    <div className="flex items-center bg-[#1e222d] border border-[#363a45] rounded px-3 py-1.5 w-64 focus-within:border-[#2962FF]">
                        <span className="text-[#868993] mr-2"><Icons.Search /></span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && onSearch(searchQuery)}
                            placeholder="Symbol, name, exchange..."
                            className="bg-transparent text-white text-sm outline-none w-full placeholder-[#868993]"
                        />
                        <span className="text-[#868993] text-xs border border-[#363a45] rounded px-1.5 py-0.5">⌘K</span>
                    </div>
                </div>
            </div>

            {/* CENTER: Market Status */}
            <div className="hidden md:flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#089981] animate-pulse"></span>
                    <span className="text-[#868993]">Market Open</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[#868993]">S&P 500</span>
                    <span className="text-white font-mono">4,783.83</span>
                    <span className="text-[#089981] font-mono text-xs">+0.54%</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[#868993]">VIX</span>
                    <span className="text-[#f23645] font-mono">13.22</span>
                </div>
                <div className="text-[#868993] font-mono text-xs">{time} EST</div>
            </div>

            {/* RIGHT: User */}
            <div className="flex items-center gap-3">
                <span className="text-[#868993] cursor-pointer hover:text-white"><Icons.Bell /></span>
                <div className="w-px h-4 bg-[#363a45]"></div>
                <div className="w-8 h-8 rounded-full bg-[#2962FF] flex items-center justify-center text-white text-sm font-bold cursor-pointer">
                    U
                </div>
            </div>
        </header>
    )
}

// ============================================================
// WATCHLIST SIDEBAR
// ============================================================
const WATCHLIST_DATA = [
    { symbol: 'AAPL', name: 'Apple Inc', price: 186.45, change: -1.21, pct: -0.64 },
    { symbol: 'TSLA', name: 'Tesla Inc', price: 248.76, change: -5.21, pct: -2.05 },
    { symbol: 'SPY', name: 'SPDR S&P 500', price: 478.23, change: 1.87, pct: 0.39 },
    { symbol: 'BTCUSD', name: 'Bitcoin', price: 42847.50, change: 847.25, pct: 2.01 },
    { symbol: 'MSFT', name: 'Microsoft', price: 378.91, change: -1.24, pct: -0.33 },
    { symbol: 'NVDA', name: 'NVIDIA', price: 721.84, change: 15.42, pct: 2.18 },
    { symbol: 'META', name: 'Meta', price: 474.32, change: 8.91, pct: 1.91 },
    { symbol: 'GOOGL', name: 'Alphabet', price: 141.23, change: -0.87, pct: -0.61 },
    { symbol: 'AMD', name: 'AMD', price: 168.92, change: 3.24, pct: 1.96 },
    { symbol: 'AMZN', name: 'Amazon', price: 172.45, change: 2.15, pct: 1.26 },
]

function WatchlistSidebar({
    symbols,
    onSelectSymbol
}: {
    symbols: string[]
    onSelectSymbol: (symbol: string) => void
}) {
    const [filter, setFilter] = useState('')

    const filtered = WATCHLIST_DATA.filter(w =>
        w.symbol.toLowerCase().includes(filter.toLowerCase()) ||
        w.name.toLowerCase().includes(filter.toLowerCase())
    )

    return (
        <aside className="w-48 bg-[#131722] border-r border-[#2a2e39] flex flex-col">
            <div className="p-2 border-b border-[#2a2e39]">
                <div className="flex items-center bg-[#1e222d] border border-[#363a45] rounded px-2 py-1">
                    <span className="text-[#868993] mr-1"><Icons.Search /></span>
                    <input
                        type="text"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        placeholder="Filter..."
                        className="bg-transparent text-white text-xs outline-none w-full placeholder-[#868993]"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="text-[#868993] uppercase tracking-wider">
                            <th className="text-left p-2 font-medium">Sym</th>
                            <th className="text-right p-2 font-medium">Last</th>
                            <th className="text-right p-2 font-medium">%</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((item) => {
                            const isActive = symbols.includes(item.symbol)
                            return (
                                <tr
                                    key={item.symbol}
                                    onClick={() => onSelectSymbol(item.symbol)}
                                    className={`cursor-pointer border-b border-[#1e222d] hover:bg-[#1e222d] ${isActive ? 'bg-[#2962FF]/10' : ''}`}
                                >
                                    <td className="p-2">
                                        <div className="text-white font-medium">{item.symbol}</div>
                                    </td>
                                    <td className="p-2 text-right font-mono text-white">
                                        {item.symbol === 'BTCUSD' ? item.price.toLocaleString() : item.price.toFixed(2)}
                                    </td>
                                    <td className={`p-2 text-right font-mono ${item.pct >= 0 ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                                        {item.pct >= 0 ? '+' : ''}{item.pct.toFixed(2)}%
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </aside>
    )
}

// ============================================================
// CHART CARD COMPONENT
// ============================================================
interface ChartCardProps {
    symbol: string
    isActive: boolean
    onRemove: () => void
    onMaximize: () => void
}

function ChartCard({ symbol, isActive, onRemove, onMaximize }: ChartCardProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null)
    const chartRef = useRef<IChartApi | null>(null)
    const [lastPrice, setLastPrice] = useState({ price: 0, change: 0, pct: 0 })

    useEffect(() => {
        if (!chartContainerRef.current) return

        const ohlcData = generateOHLCData(symbol, 60)
        const lastCandle = ohlcData[ohlcData.length - 1]
        const prevCandle = ohlcData[ohlcData.length - 2]

        if (lastCandle && prevCandle) {
            const change = lastCandle.close - prevCandle.close
            const pct = (change / prevCandle.close) * 100
            setLastPrice({ price: lastCandle.close, change, pct })
        }

        const chart = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
            layout: {
                background: { color: '#131722' },
                textColor: '#d1d4dc',
                fontSize: 10,
            },
            grid: {
                vertLines: { color: '#2a2e39' },
                horzLines: { color: '#2a2e39' },
            },
            rightPriceScale: {
                borderColor: '#363a45',
                scaleMargins: { top: 0.1, bottom: 0.2 },
            },
            timeScale: {
                borderColor: '#363a45',
                timeVisible: true,
            },
            crosshair: {
                mode: 1,
                vertLine: { color: '#758696', labelBackgroundColor: '#363a45' },
                horzLine: { color: '#758696', labelBackgroundColor: '#363a45' },
            },
        })

        chartRef.current = chart

        const candleSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#089981',
            downColor: '#f23645',
            borderUpColor: '#089981',
            borderDownColor: '#f23645',
            wickUpColor: '#089981',
            wickDownColor: '#f23645',
        })

        candleSeries.setData(ohlcData)

        const volumeSeries = chart.addSeries(HistogramSeries, {
            color: '#089981',
            priceFormat: { type: 'volume' },
            priceScaleId: '',
        })
        volumeSeries.priceScale().applyOptions({
            scaleMargins: { top: 0.85, bottom: 0 },
        })
        volumeSeries.setData(generateVolumeData(ohlcData))

        chart.timeScale().fitContent()

        const handleResize = () => {
            if (chartContainerRef.current && chartRef.current) {
                chartRef.current.applyOptions({
                    width: chartContainerRef.current.clientWidth,
                    height: chartContainerRef.current.clientHeight,
                })
            }
        }

        window.addEventListener('resize', handleResize)
        const resizeObserver = new ResizeObserver(handleResize)
        resizeObserver.observe(chartContainerRef.current)

        return () => {
            window.removeEventListener('resize', handleResize)
            resizeObserver.disconnect()
            chart.remove()
        }
    }, [symbol])

    const isUp = lastPrice.pct >= 0

    return (
        <div className={`bg-[#131722] relative group flex flex-col ${isActive ? 'ring-1 ring-[#2962FF] ring-inset' : ''}`}>
            {/* Chart Header */}
            <div className="h-8 flex items-center justify-between px-3 border-b border-[#2a2e39]">
                <div className="flex items-center gap-3">
                    <span className="text-white font-bold text-sm">{symbol}</span>
                    <span className="text-white font-mono text-sm">
                        {symbol === 'BTCUSD' ? lastPrice.price.toLocaleString() : lastPrice.price.toFixed(2)}
                    </span>
                    <span className={`font-mono text-xs ${isUp ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                        {isUp ? '+' : ''}{lastPrice.change.toFixed(2)} ({isUp ? '+' : ''}{lastPrice.pct.toFixed(2)}%)
                    </span>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={onMaximize} className="p-1 hover:bg-[#2a2e39] rounded text-[#868993] hover:text-white">
                        <Icons.Maximize />
                    </button>
                    <button onClick={onRemove} className="p-1 hover:bg-[#2a2e39] rounded text-[#868993] hover:text-white">
                        <Icons.X />
                    </button>
                </div>
            </div>

            {/* Chart */}
            <div ref={chartContainerRef} className="flex-1" />
        </div>
    )
}

// ============================================================
// TRADEX PANEL
// ============================================================
function TradeXPanel({ symbols }: { symbols: string[] }) {
    const factorData = useMemo(() => symbols.map(sym => ({
        symbol: sym,
        pas: Math.floor(Math.random() * 30) + 60,
        fundamental: Math.floor(Math.random() * 40) + 50,
        sentiment: Math.floor(Math.random() * 40) + 50,
        technical: Math.floor(Math.random() * 40) + 50,
    })).sort((a, b) => b.pas - a.pas), [symbols])

    return (
        <div className="p-3 space-y-3">
            <div className="text-[#868993] text-xs uppercase tracking-wider">Multi-Factor Comparison</div>

            {factorData.map((item) => (
                <div key={item.symbol} className="bg-[#1e222d] rounded border border-[#2a2e39] p-3">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-bold text-sm">{item.symbol}</span>
                        <span className={`text-xs font-mono ${item.pas >= 80 ? 'text-[#089981]' : item.pas >= 70 ? 'text-[#ffd54f]' : 'text-[#f23645]'}`}>
                            PAS: {item.pas}
                        </span>
                    </div>

                    <div className="space-y-2">
                        {[
                            { label: 'Fundamental', value: item.fundamental, color: '#2962FF' },
                            { label: 'Sentiment', value: item.sentiment, color: '#089981' },
                            { label: 'Technical', value: item.technical, color: '#ff9800' },
                        ].map(factor => (
                            <div key={factor.label} className="flex items-center gap-2 text-xs">
                                <span className="text-[#868993] w-20">{factor.label}</span>
                                <div className="flex-1 h-1.5 bg-[#2a2e39] rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full"
                                        style={{ width: `${factor.value}%`, background: factor.color }}
                                    />
                                </div>
                                <span className="text-white font-mono w-6 text-right">{factor.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {/* Similarity Search */}
            <div className="pt-3 border-t border-[#2a2e39]">
                <label className="text-[#868993] text-xs block mb-2">Find similar to {symbols[0]}:</label>
                <div className="flex gap-2">
                    <select className="flex-1 bg-[#1e222d] border border-[#363a45] rounded text-white text-xs p-2 outline-none">
                        <option>Better Sentiment</option>
                        <option>Lower P/E</option>
                        <option>Higher Volume</option>
                    </select>
                    <button className="px-3 py-2 bg-[#2962FF] text-white rounded text-xs hover:bg-[#1e53e5]">
                        Search
                    </button>
                </div>
            </div>
        </div>
    )
}

// ============================================================
// VISUALX PANEL
// ============================================================
function VisualXPanel({ symbol }: { symbol: string }) {
    const [alerts, setAlerts] = useState([
        { text: 'Bullish momentum confirmed', score: 0.82, time: '2m ago' },
        { text: 'Institutional buying detected', score: 0.91, time: '5m ago' },
        { text: 'Weak guidance sentiment', score: -0.45, time: '12m ago' },
    ])

    return (
        <div className="p-3 space-y-3">
            <div className="text-[#868993] text-xs uppercase tracking-wider">VisualX Sentiment</div>

            {/* Divergence Alert */}
            <div className="bg-[#f23645]/10 border border-[#f23645]/30 rounded p-3">
                <div className="flex items-start gap-2">
                    <span className="text-[#f23645] mt-0.5"><Icons.Alert /></span>
                    <div>
                        <div className="text-[#f23645] font-bold text-xs">LIQUIDITY DIVERGENCE</div>
                        <div className="text-[#868993] text-xs mt-1">Price stable but sentiment crashing on {symbol}</div>
                        <div className="text-white font-mono text-lg mt-2">-0.84 σ</div>
                    </div>
                </div>
            </div>

            {/* Sentiment Stream */}
            <div>
                <div className="text-[#868993] text-xs uppercase tracking-wider mb-2">Live Mentions</div>
                <div className="space-y-2">
                    {alerts.map((item, i) => (
                        <div key={i} className="bg-[#1e222d] rounded p-2 border-l-2 border-[#2962FF]">
                            <p className="text-white text-xs mb-1">{item.text}</p>
                            <div className="flex justify-between items-center">
                                <span className={`font-mono text-xs ${item.score > 0 ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                                    {item.score > 0 ? '+' : ''}{item.score.toFixed(2)}
                                </span>
                                <span className="text-[#868993] text-xs">{item.time}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sentiment Gauge */}
            <div className="pt-3 border-t border-[#2a2e39]">
                <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#868993]">Overall Sentiment</span>
                    <span className="text-[#089981] font-mono">+0.42</span>
                </div>
                <div className="h-2 bg-[#2a2e39] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#f23645] via-[#ffd54f] to-[#089981]" style={{ width: '71%' }} />
                </div>
            </div>
        </div>
    )
}

// ============================================================
// TRADESPHERE PANEL (Simulator)
// ============================================================
function TradeSpherePanel() {
    return (
        <div className="p-3 space-y-3">
            <div className="text-[#868993] text-xs uppercase tracking-wider">Strategy Simulator</div>

            <div className="bg-[#1e222d] rounded border border-[#2a2e39] p-3">
                <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                        <div className="text-[#868993] mb-1">Sharpe Ratio</div>
                        <div className="text-white font-mono text-lg">1.84</div>
                    </div>
                    <div>
                        <div className="text-[#868993] mb-1">Max Drawdown</div>
                        <div className="text-[#f23645] font-mono text-lg">-12.4%</div>
                    </div>
                    <div>
                        <div className="text-[#868993] mb-1">Win Rate</div>
                        <div className="text-[#089981] font-mono text-lg">68.2%</div>
                    </div>
                    <div>
                        <div className="text-[#868993] mb-1">Profit Factor</div>
                        <div className="text-white font-mono text-lg">2.14</div>
                    </div>
                </div>
            </div>

            <button className="w-full py-2 bg-[#2962FF] text-white rounded text-sm font-medium hover:bg-[#1e53e5]">
                Run Backtest
            </button>

            <div className="text-[#868993] text-xs text-center">
                Simulate strategies across 10 years of data
            </div>
        </div>
    )
}

// ============================================================
// CHART TOOLBAR
// ============================================================
function ChartToolbar({
    activeSymbol,
    layout,
    onLayoutChange
}: {
    activeSymbol: string
    layout: '2x2' | 'single'
    onLayoutChange: (l: '2x2' | 'single') => void
}) {
    const symbolData = WATCHLIST_DATA.find(w => w.symbol === activeSymbol) || WATCHLIST_DATA[0]

    return (
        <div className="h-10 bg-[#131722] border-b border-[#2a2e39] flex items-center px-4 justify-between">
            <div className="flex items-center gap-4">
                <span className="text-white font-bold text-lg">{symbolData.symbol}</span>
                <span className="text-[#868993] text-sm">{symbolData.name}</span>
                <span className="text-white font-mono ml-2">
                    ${symbolData.symbol === 'BTCUSD' ? symbolData.price.toLocaleString() : symbolData.price.toFixed(2)}
                </span>
                <span className={`font-mono text-sm ${symbolData.pct >= 0 ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                    {symbolData.change >= 0 ? '+' : ''}{symbolData.change.toFixed(2)} ({symbolData.pct >= 0 ? '+' : ''}{symbolData.pct.toFixed(2)}%)
                </span>
            </div>

            <div className="flex items-center gap-4">
                {/* Timeframe */}
                <div className="flex items-center gap-1">
                    {['1D', '1W', '1M', '3M', '1Y'].map((tf, i) => (
                        <button
                            key={tf}
                            className={`px-2 py-1 text-xs rounded ${i === 0 ? 'bg-[#2962FF] text-white' : 'text-[#868993] hover:text-white hover:bg-[#2a2e39]'}`}
                        >
                            {tf}
                        </button>
                    ))}
                </div>

                {/* Layout */}
                <div className="flex items-center gap-1 bg-[#1e222d] rounded p-1">
                    <button
                        onClick={() => onLayoutChange('2x2')}
                        className={`p-1 rounded ${layout === '2x2' ? 'bg-[#2962FF] text-white' : 'text-[#868993] hover:text-white'}`}
                    >
                        <Icons.Grid />
                    </button>
                    <button
                        onClick={() => onLayoutChange('single')}
                        className={`p-1 rounded ${layout === 'single' ? 'bg-[#2962FF] text-white' : 'text-[#868993] hover:text-white'}`}
                    >
                        <Icons.Maximize />
                    </button>
                </div>
            </div>
        </div>
    )
}

// ============================================================
// MAIN TRADING DASHBOARD
// ============================================================
export default function TradingDashboard() {
    const [symbols, setSymbols] = useState(['AAPL', 'TSLA', 'SPY', 'BTCUSD'])
    const [activePanel, setActivePanel] = useState<'tradex' | 'visualx' | 'tradesphere'>('tradex')
    const [layout, setLayout] = useState<'2x2' | 'single'>('2x2')
    const [activeChart, setActiveChart] = useState(0)

    const handleSymbolSelect = useCallback((symbol: string) => {
        if (!symbols.includes(symbol)) {
            setSymbols(prev => [symbol, ...prev.slice(0, 3)])
        }
    }, [symbols])

    const handleRemoveChart = useCallback((index: number) => {
        setSymbols(prev => prev.filter((_, i) => i !== index))
    }, [])

    const handleMaximize = useCallback((index: number) => {
        setActiveChart(index)
        setLayout('single')
    }, [])

    return (
        <div className="h-screen flex flex-col bg-[#0b0e14] pt-12">
            <TradingHeader onSearch={handleSymbolSelect} />

            <div className="flex flex-1 overflow-hidden">
                {/* Left: Watchlist */}
                <WatchlistSidebar symbols={symbols} onSelectSymbol={handleSymbolSelect} />

                {/* Center: Charts */}
                <main className="flex-1 flex flex-col min-w-0">
                    <ChartToolbar
                        activeSymbol={symbols[activeChart] || symbols[0]}
                        layout={layout}
                        onLayoutChange={setLayout}
                    />

                    {/* Chart Grid */}
                    <div className={`flex-1 bg-[#2a2e39] ${layout === '2x2'
                            ? 'grid grid-cols-2 grid-rows-2 gap-px'
                            : 'flex'
                        }`}>
                        {layout === '2x2' ? (
                            symbols.slice(0, 4).map((sym, i) => (
                                <ChartCard
                                    key={sym}
                                    symbol={sym}
                                    isActive={i === activeChart}
                                    onRemove={() => handleRemoveChart(i)}
                                    onMaximize={() => handleMaximize(i)}
                                />
                            ))
                        ) : (
                            <ChartCard
                                symbol={symbols[activeChart] || symbols[0]}
                                isActive={true}
                                onRemove={() => { }}
                                onMaximize={() => setLayout('2x2')}
                            />
                        )}
                    </div>
                </main>

                {/* Right: Engine Panels */}
                <aside className="w-72 bg-[#131722] border-l border-[#2a2e39] flex flex-col">
                    {/* Panel Tabs */}
                    <div className="flex border-b border-[#2a2e39]">
                        {[
                            { id: 'tradex' as const, label: 'TradeX', Icon: Icons.BarChart },
                            { id: 'visualx' as const, label: 'VisualX', Icon: Icons.Eye },
                            { id: 'tradesphere' as const, label: 'Sim', Icon: Icons.Play },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActivePanel(tab.id)}
                                className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium border-b-2 transition-colors
                  ${activePanel === tab.id
                                        ? 'text-[#2962FF] border-[#2962FF] bg-[#1e222d]'
                                        : 'text-[#868993] border-transparent hover:text-white hover:bg-[#1e222d]'
                                    }`}
                            >
                                <tab.Icon />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Panel Content */}
                    <div className="flex-1 overflow-y-auto">
                        {activePanel === 'tradex' && <TradeXPanel symbols={symbols} />}
                        {activePanel === 'visualx' && <VisualXPanel symbol={symbols[0]} />}
                        {activePanel === 'tradesphere' && <TradeSpherePanel />}
                    </div>
                </aside>
            </div>
        </div>
    )
}
