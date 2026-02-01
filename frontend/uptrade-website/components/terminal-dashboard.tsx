'use client'

import React, { useState, useEffect, useRef } from 'react'
import { createChart, IChartApi, CandlestickData, HistogramData, Time, CandlestickSeries, HistogramSeries } from 'lightweight-charts'

// ============================================================
// TERMINAL DASHBOARD - Bloomberg/TradingView Style
// Dense data, utilitarian design, no decorative elements
// ============================================================

// Generate realistic OHLC data with noise
function generateOHLCData(symbol: string, days: number = 60): CandlestickData[] {
    const data: CandlestickData[] = []
    const basePrices: Record<string, number> = {
        'AAPL': 185.42,
        'TSLA': 248.76,
        'SPY': 478.23,
        'BTC': 42847.50,
        'MSFT': 378.91,
        'GOOGL': 141.23,
        'NVDA': 721.84,
        'META': 474.32
    }

    const basePrice = basePrices[symbol] || 100
    let price = basePrice
    const now = new Date()

    for (let i = days; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)

        // Skip weekends for stocks
        if (symbol !== 'BTC' && (date.getDay() === 0 || date.getDay() === 6)) continue

        const volatility = symbol === 'BTC' ? 0.035 : (symbol === 'TSLA' ? 0.028 : 0.015)
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

// Generate volume data
function generateVolumeData(ohlcData: CandlestickData[]): HistogramData[] {
    return ohlcData.map(candle => ({
        time: candle.time,
        value: Math.floor(Math.random() * 50000000) + 10000000,
        color: candle.close >= candle.open ? 'rgba(38, 166, 154, 0.5)' : 'rgba(239, 83, 80, 0.5)'
    }))
}

// Generate sparkline SVG path
function generateSparkline(trending: 'up' | 'down' | 'flat'): string {
    const points: number[] = []
    let y = 50
    for (let i = 0; i < 24; i++) {
        const trend = trending === 'up' ? -0.8 : (trending === 'down' ? 0.8 : 0)
        y += (Math.random() - 0.5 + trend) * 8
        y = Math.max(10, Math.min(90, y))
        points.push(y)
    }
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${i * 3},${p}`).join(' ')
}

// ============================================================
// WATCHLIST TABLE COMPONENT
// ============================================================
const watchlistData = [
    { symbol: 'AAPL', name: 'Apple Inc', price: 185.42, change: 2.34, pctChange: 1.28, volume: '48.2M', trend: 'up' as const },
    { symbol: 'TSLA', name: 'Tesla Inc', price: 248.76, change: -5.21, pctChange: -2.05, volume: '112.4M', trend: 'down' as const },
    { symbol: 'SPY', name: 'SPDR S&P 500', price: 478.23, change: 1.87, pctChange: 0.39, volume: '67.8M', trend: 'up' as const },
    { symbol: 'BTC', name: 'Bitcoin USD', price: 42847.50, change: 847.25, pctChange: 2.01, volume: '24.1B', trend: 'up' as const },
    { symbol: 'MSFT', name: 'Microsoft', price: 378.91, change: -1.24, pctChange: -0.33, volume: '22.1M', trend: 'down' as const },
    { symbol: 'NVDA', name: 'NVIDIA Corp', price: 721.84, change: 15.42, pctChange: 2.18, volume: '41.2M', trend: 'up' as const },
    { symbol: 'META', name: 'Meta Platforms', price: 474.32, change: 8.91, pctChange: 1.91, volume: '18.7M', trend: 'up' as const },
    { symbol: 'GOOGL', name: 'Alphabet Inc', price: 141.23, change: -0.87, pctChange: -0.61, volume: '28.4M', trend: 'flat' as const },
]

function Watchlist({ onSelect }: { onSelect: (symbol: string) => void }) {
    const [selected, setSelected] = useState('AAPL')

    return (
        <div className="terminal-panel" style={{ height: '100%', overflow: 'hidden' }}>
            <div className="terminal-header">
                <span>WATCHLIST</span>
                <span style={{ color: '#868993' }}>8</span>
            </div>
            <div style={{ overflow: 'auto', height: 'calc(100% - 32px)' }}>
                <table className="terminal-table">
                    <thead>
                        <tr>
                            <th style={{ width: '60px' }}>SYM</th>
                            <th style={{ textAlign: 'right' }}>LAST</th>
                            <th style={{ textAlign: 'right' }}>CHG</th>
                            <th style={{ width: '54px' }}>24H</th>
                        </tr>
                    </thead>
                    <tbody>
                        {watchlistData.map((item, i) => (
                            <tr
                                key={item.symbol}
                                className={selected === item.symbol ? 'selected' : ''}
                                onClick={() => { setSelected(item.symbol); onSelect(item.symbol) }}
                                style={{ height: i % 3 === 0 ? '34px' : '32px' }} // Slight variation
                            >
                                <td>
                                    <span style={{ color: '#e1e4e8', fontWeight: 500 }}>{item.symbol}</span>
                                </td>
                                <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                                    {item.symbol === 'BTC' ? item.price.toLocaleString() : item.price.toFixed(2)}
                                </td>
                                <td style={{
                                    textAlign: 'right',
                                    fontFamily: 'var(--font-mono)',
                                    color: item.change >= 0 ? '#26a69a' : '#ef5350'
                                }}>
                                    {item.change >= 0 ? '+' : ''}{item.pctChange.toFixed(2)}%
                                </td>
                                <td>
                                    <svg width="48" height="20" viewBox="0 0 72 100" preserveAspectRatio="none">
                                        <path
                                            d={generateSparkline(item.trend)}
                                            fill="none"
                                            stroke={item.trend === 'up' ? '#26a69a' : (item.trend === 'down' ? '#ef5350' : '#868993')}
                                            strokeWidth="2"
                                        />
                                    </svg>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

// ============================================================
// MINI CHART COMPONENT
// ============================================================
interface MiniChartProps {
    symbol: string
    ohlcData: CandlestickData[]
}

function MiniChart({ symbol, ohlcData }: MiniChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null)
    const chartRef = useRef<IChartApi | null>(null)

    useEffect(() => {
        if (!chartContainerRef.current || ohlcData.length === 0) return

        const chart = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
            layout: {
                background: { color: '#131722' },
                textColor: '#868993',
                fontSize: 10,
            },
            grid: {
                vertLines: { color: '#1e222d' },
                horzLines: { color: '#1e222d' },
            },
            crosshair: {
                mode: 1,
                vertLine: { color: '#4c525e', width: 1, style: 2, labelBackgroundColor: '#363a45' },
                horzLine: { color: '#4c525e', width: 1, style: 2, labelBackgroundColor: '#363a45' },
            },
            timeScale: {
                borderColor: '#2a2e39',
                timeVisible: true,
                secondsVisible: false,
            },
            rightPriceScale: {
                borderColor: '#2a2e39',
            },
        })

        chartRef.current = chart

        // v5 API: Use addSeries with series type as first argument
        const candlestickSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderUpColor: '#26a69a',
            borderDownColor: '#ef5350',
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
        })

        candlestickSeries.setData(ohlcData)

        // Add volume with v5 API
        const volumeSeries = chart.addSeries(HistogramSeries, {
            color: '#26a69a',
            priceFormat: { type: 'volume' },
            priceScaleId: '',
        })
        volumeSeries.priceScale().applyOptions({
            scaleMargins: { top: 0.85, bottom: 0 },
        })
        volumeSeries.setData(generateVolumeData(ohlcData))

        chart.timeScale().fitContent()

        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({
                    width: chartContainerRef.current.clientWidth,
                    height: chartContainerRef.current.clientHeight,
                })
            }
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
            chart.remove()
        }
    }, [ohlcData])

    const lastCandle = ohlcData[ohlcData.length - 1]
    const prevCandle = ohlcData[ohlcData.length - 2]
    const changePercent = lastCandle && prevCandle
        ? ((lastCandle.close - prevCandle.close) / prevCandle.close * 100).toFixed(2)
        : '0.00'
    const isUp = parseFloat(changePercent) >= 0

    return (
        <div className="chart-cell">
            <div className="chart-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="chart-symbol">{symbol}</span>
                    <span style={{
                        fontSize: '13px',
                        fontFamily: 'var(--font-mono)',
                        color: '#e1e4e8'
                    }}>
                        {lastCandle?.close.toLocaleString()}
                    </span>
                    <span style={{
                        fontSize: '11px',
                        fontFamily: 'var(--font-mono)',
                        color: isUp ? '#26a69a' : '#ef5350'
                    }}>
                        {isUp ? '+' : ''}{changePercent}%
                    </span>
                </div>
                <div style={{ fontSize: '10px', color: '#868993' }}>1D</div>
            </div>
            <div ref={chartContainerRef} style={{ flex: 1 }} />
        </div>
    )
}

// ============================================================
// TRADEX SIDEBAR COMPONENT
// ============================================================
const tradexData = [
    { symbol: 'NVDA', pas: 86.4, value: 0.82, sent: 0.91, mom: 0.78, qual: 0.85, status: 'strong' as const },
    { symbol: 'AAPL', pas: 82.1, value: 0.75, sent: 0.88, mom: 0.72, qual: 0.91, status: 'strong' as const },
    { symbol: 'META', pas: 78.3, value: 0.68, sent: 0.84, mom: 0.81, qual: 0.73, status: 'moderate' as const },
    { symbol: 'MSFT', pas: 76.9, value: 0.79, sent: 0.71, mom: 0.69, qual: 0.88, status: 'moderate' as const },
    { symbol: 'GOOGL', pas: 71.2, value: 0.65, sent: 0.62, mom: 0.74, qual: 0.82, status: 'moderate' as const },
    { symbol: 'TSLA', pas: 64.8, value: 0.42, sent: 0.78, mom: 0.85, qual: 0.48, status: 'weak' as const },
]

function TradeXSidebar() {
    return (
        <div className="terminal-panel" style={{ height: '100%' }}>
            <div className="terminal-header">
                <span>TRADEX ENGINE</span>
                <span style={{
                    fontSize: '9px',
                    padding: '2px 6px',
                    background: '#26a69a20',
                    color: '#26a69a',
                    borderRadius: '2px'
                }}>LIVE</span>
            </div>

            <div style={{ padding: '8px', borderBottom: '1px solid #2a2e39' }}>
                <div style={{ fontSize: '10px', color: '#868993', marginBottom: '4px', letterSpacing: '0.05em' }}>
                    PREDICTIVE ALPHA SCORES
                </div>
            </div>

            <div style={{ overflow: 'auto', flex: 1 }}>
                {tradexData.map((item, i) => (
                    <div
                        key={item.symbol}
                        className="tradex-row"
                        style={{ borderLeft: i === 0 ? '2px solid #26a69a' : '2px solid transparent' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                            <span style={{ color: '#e1e4e8', fontWeight: 500, fontSize: '12px' }}>{item.symbol}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '14px',
                                    color: item.pas >= 80 ? '#26a69a' : (item.pas >= 70 ? '#ffd54f' : '#ef5350')
                                }}>
                                    {item.pas}
                                </span>
                                <div style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: item.status === 'strong' ? '#26a69a' : (item.status === 'moderate' ? '#ffd54f' : '#ef5350')
                                }} />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px', fontSize: '10px' }}>
                            <div className="factor-bar">
                                <span>VAL</span>
                                <div className="bar-track">
                                    <div className="bar-fill" style={{ width: `${item.value * 100}%`, background: '#2962ff' }} />
                                </div>
                            </div>
                            <div className="factor-bar">
                                <span>SNT</span>
                                <div className="bar-track">
                                    <div className="bar-fill" style={{ width: `${item.sent * 100}%`, background: '#26a69a' }} />
                                </div>
                            </div>
                            <div className="factor-bar">
                                <span>MOM</span>
                                <div className="bar-track">
                                    <div className="bar-fill" style={{ width: `${item.mom * 100}%`, background: '#ff9800' }} />
                                </div>
                            </div>
                            <div className="factor-bar">
                                <span>QUA</span>
                                <div className="bar-track">
                                    <div className="bar-fill" style={{ width: `${item.qual * 100}%`, background: '#ab47bc' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{
                padding: '8px',
                borderTop: '1px solid #2a2e39',
                fontSize: '10px',
                color: '#868993'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Confidence</span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>94.2%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                    <span>Updated</span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>2.4s ago</span>
                </div>
            </div>
        </div>
    )
}

// ============================================================
// TERMINAL LOG COMPONENT
// ============================================================
function TerminalLog() {
    const [logs, setLogs] = useState<string[]>([])

    useEffect(() => {
        const baseLogs = [
            '14:32:02 [INFO] AAPL sentiment divergence detected Z=3.41',
            '14:32:01 [DATA] SPY volume spike +47% vs 20D avg',
            '14:31:58 [ALERT] BTC RSI oversold (28.4) - monitoring',
            '14:31:55 [INFO] NVDA cross-modal attention weight: 0.82',
            '14:31:52 [DATA] Ingested 1,247 vectors (12.4ms)',
            '14:31:48 [INFO] META fundamental score updated: 0.68→0.71',
            '14:31:45 [ALERT] TSLA price-sentiment correlation breakdown',
            '14:31:42 [DATA] Processed 8,421 tweets (sentiment: +0.12)',
        ]
        setLogs(baseLogs)

        // Simulate new log entries
        const interval = setInterval(() => {
            const types = ['INFO', 'DATA', 'ALERT']
            const symbols = ['AAPL', 'TSLA', 'NVDA', 'META', 'SPY', 'BTC']
            const messages = [
                'Vector similarity search completed (4.2ms)',
                'Sentiment spike detected +0.24',
                'Factor weights recalculated',
                'HNSW index updated (12,847 vectors)',
                'Cross-modal fusion complete',
                'Price momentum signal: bullish',
            ]

            const now = new Date()
            const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
            const type = types[Math.floor(Math.random() * types.length)]
            const symbol = symbols[Math.floor(Math.random() * symbols.length)]
            const msg = messages[Math.floor(Math.random() * messages.length)]

            setLogs(prev => [`${time} [${type}] ${symbol} ${msg}`, ...prev.slice(0, 7)])
        }, 3000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="terminal-panel" style={{ height: '100%' }}>
            <div className="terminal-header">
                <span>SYSTEM LOG</span>
                <span style={{ color: '#26a69a', fontSize: '10px' }}>● LIVE</span>
            </div>
            <div className="terminal-log">
                {logs.map((log, i) => {
                    const isAlert = log.includes('[ALERT]')
                    const isData = log.includes('[DATA]')
                    return (
                        <div
                            key={i}
                            className="log-line"
                            style={{
                                color: isAlert ? '#ffd54f' : (isData ? '#26a69a' : '#868993'),
                                opacity: 1 - (i * 0.08)
                            }}
                        >
                            {log}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

// ============================================================
// MAIN TERMINAL DASHBOARD
// ============================================================
export default function TerminalDashboard() {
    const [currentTime, setCurrentTime] = useState('')
    const [chartData, setChartData] = useState<Record<string, CandlestickData[]>>({})
    const symbols = ['AAPL', 'TSLA', 'SPY', 'BTC']

    useEffect(() => {
        // Generate chart data
        const data: Record<string, CandlestickData[]> = {}
        symbols.forEach(sym => {
            data[sym] = generateOHLCData(sym, 60)
        })
        setChartData(data)

        // Update clock
        const updateTime = () => {
            const now = new Date()
            const est = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }))
            setCurrentTime(
                `${est.getHours().toString().padStart(2, '0')}:${est.getMinutes().toString().padStart(2, '0')}:${est.getSeconds().toString().padStart(2, '0')} EST`
            )
        }
        updateTime()
        const interval = setInterval(updateTime, 1000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="terminal-root">
            {/* Scanline overlay */}
            <div className="scanline-overlay" />

            {/* Header */}
            <header className="terminal-topbar">
                <div className="topbar-left">
                    <span className="logo">UPTRADE</span>
                    <span className="logo-tag">TERMINAL</span>
                </div>

                <div className="topbar-center">
                    <div className="search-box">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#868993" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                        <input type="text" placeholder="Search symbol..." />
                    </div>
                </div>

                <div className="topbar-right">
                    <div className="status-indicator">
                        <span className="status-dot" />
                        <span>LIVE</span>
                    </div>
                    <div className="clock">{currentTime}</div>
                </div>
            </header>

            {/* Main Layout */}
            <main className="terminal-main">
                {/* Left: Watchlist */}
                <aside className="terminal-left">
                    <Watchlist onSelect={(s) => console.log('Selected:', s)} />
                </aside>

                {/* Center: Charts */}
                <section className="terminal-center">
                    <div className="chart-grid">
                        {symbols.map(sym => (
                            <MiniChart
                                key={sym}
                                symbol={sym}
                                ohlcData={chartData[sym] || []}
                            />
                        ))}
                    </div>

                    {/* Log below charts */}
                    <div className="terminal-log-section">
                        <TerminalLog />
                    </div>
                </section>

                {/* Right: TradeX */}
                <aside className="terminal-right">
                    <TradeXSidebar />
                </aside>
            </main>
        </div>
    )
}
