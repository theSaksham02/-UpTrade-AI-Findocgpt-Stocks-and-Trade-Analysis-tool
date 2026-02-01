'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { createChart, IChartApi, ISeriesApi, CandlestickSeries, HistogramSeries, LineSeries } from 'lightweight-charts'
import { ChartConfig, OHLCV, SentimentData, DivergenceAlert, WebSocketMessage } from '@/types/uptrade'
import { useWebSocket } from '@/hooks/useWebSocket'
import { AlertTriangle, Wifi, WifiOff, TrendingUp, TrendingDown, Activity, X } from 'lucide-react'

// TradingView color palette
const colors = {
    background: '#0b0e14',
    surface: '#131722',
    grid: '#2a2e39',
    border: '#363a45',
    text: '#d1d4dc',
    textMuted: '#868993',
    green: '#089981',
    red: '#f23645',
    blue: '#2962FF',
    orange: '#ff9800',
    purple: '#9C27B0',
}

interface ChartInstance {
    id: string
    symbol: string
    chart: IChartApi
    candleSeries: ISeriesApi<'Candlestick'>
    sentimentSeries: ISeriesApi<'Histogram'> | null
    volumeSeries: ISeriesApi<'Histogram'> | null
    lastPrice: number
    lastSentiment: number
}

interface MultiChartGridProps {
    configs?: ChartConfig[]
    wsUrl?: string
}

// Alert Item Component
function AlertItem({ alert, onDismiss }: { alert: DivergenceAlert; onDismiss: (id: string) => void }) {
    const severityColors = {
        critical: { bg: 'rgba(242, 54, 69, 0.15)', border: colors.red },
        high: { bg: 'rgba(255, 152, 0, 0.15)', border: colors.orange },
        medium: { bg: 'rgba(41, 98, 255, 0.15)', border: colors.blue },
        low: { bg: 'rgba(135, 135, 140, 0.15)', border: colors.textMuted },
    }

    const style = severityColors[alert.severity]

    return (
        <div
            className="rounded-lg p-3 animate-slide-in relative"
            style={{
                backgroundColor: style.bg,
                borderLeft: `3px solid ${style.border}`,
            }}
        >
            <button
                onClick={() => onDismiss(alert.id)}
                className="absolute top-2 right-2 p-1 rounded hover:bg-white/10"
            >
                <X className="w-3 h-3" style={{ color: colors.textMuted }} />
            </button>

            <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4" style={{ color: style.border }} />
                <span className="font-bold text-sm" style={{ color: colors.text }}>
                    {alert.symbol}
                </span>
                <span
                    className="text-xs px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: style.border, color: 'white' }}
                >
                    {alert.severity.toUpperCase()}
                </span>
            </div>

            <p className="text-xs leading-relaxed pr-6" style={{ color: colors.text }}>
                {alert.message}
            </p>

            <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: colors.textMuted }}>
                <span>Price: ${alert.price.toFixed(2)}</span>
                <span>Sentiment: {(alert.sentiment * 100).toFixed(1)}%</span>
            </div>

            <span className="text-xs block mt-1" style={{ color: colors.textMuted }}>
                {new Date(alert.timestamp).toLocaleTimeString()}
            </span>
        </div>
    )
}

// Connection Status Badge
function ConnectionBadge({ status }: { status: string }) {
    const isConnected = status === 'connected'

    return (
        <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{
                backgroundColor: 'rgba(19, 23, 34, 0.9)',
                border: `1px solid ${colors.border}`,
                color: isConnected ? colors.green : colors.red,
            }}
        >
            {isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            {status.toUpperCase()}
        </div>
    )
}

// Mini Chart Stats
function ChartStats({ symbol, price, change }: { symbol: string; price: number; change: number }) {
    const isPositive = change >= 0

    return (
        <div
            className="absolute top-2 left-2 flex items-center gap-3 px-3 py-1.5 rounded-lg z-10"
            style={{ backgroundColor: 'rgba(11, 14, 20, 0.85)' }}
        >
            <span className="font-bold text-sm" style={{ color: colors.text }}>
                {symbol}
            </span>
            <span className="font-medium text-sm" style={{ color: colors.text }}>
                ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span
                className="flex items-center gap-0.5 text-xs font-medium"
                style={{ color: isPositive ? colors.green : colors.red }}
            >
                {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {isPositive ? '+' : ''}{change.toFixed(2)}%
            </span>
        </div>
    )
}

export function MultiChartGrid({ configs, wsUrl = 'ws://localhost:8080' }: MultiChartGridProps) {
    const chartRefs = useRef<Map<string, ChartInstance>>(new Map())
    const gridContainerRef = useRef<HTMLDivElement>(null)
    const [alerts, setAlerts] = useState<DivergenceAlert[]>([])
    const [chartSymbols, setChartSymbols] = useState<string[]>(['AAPL', 'MSFT', 'GOOGL', 'BTC'])
    const [chartPrices, setChartPrices] = useState<Record<string, { price: number; change: number }>>({})

    // Default configs
    const defaultConfigs: ChartConfig[] = chartSymbols.map((symbol, index) => ({
        id: `chart-${index}`,
        symbol,
        interval: '1D',
        layout: index === 0 ? 'main' : 'secondary',
        showSentiment: true,
        showVolume: true,
    }))

    const chartConfigs = configs || defaultConfigs

    // WebSocket connection (simulated for demo)
    const { connectionStatus, lastMessage, subscribe, isConnected } = useWebSocket(wsUrl, {
        onMessage: (msg) => handleWebSocketMessage(msg),
    })

    // Handle WebSocket messages
    const handleWebSocketMessage = useCallback((msg: WebSocketMessage) => {
        if (!msg.symbol) return

        const instance = chartRefs.current.get(msg.symbol)
        if (!instance) return

        switch (msg.type) {
            case 'candle':
                if (msg.data) {
                    const candle = msg.data as OHLCV
                    instance.candleSeries.update({
                        time: candle.time as any,
                        open: candle.open,
                        high: candle.high,
                        low: candle.low,
                        close: candle.close,
                    })
                    instance.lastPrice = candle.close

                    // Update volume
                    if (instance.volumeSeries) {
                        instance.volumeSeries.update({
                            time: candle.time as any,
                            value: candle.volume,
                            color: candle.close >= candle.open ? colors.green + '40' : colors.red + '40',
                        })
                    }

                    // Check for divergence
                    checkDivergence(instance)
                }
                break

            case 'sentiment':
                if (msg.data) {
                    const sentiment = msg.data as SentimentData
                    if (instance.sentimentSeries) {
                        instance.sentimentSeries.update({
                            time: sentiment.time as any,
                            value: sentiment.score * 100, // Scale for visibility
                            color: sentiment.score > 0 ? colors.green + '60' : colors.red + '60',
                        })
                    }
                    instance.lastSentiment = sentiment.score
                }
                break

            case 'alert':
                if (msg.data) {
                    addAlert(msg.data as DivergenceAlert)
                }
                break
        }
    }, [])

    // Initialize charts
    useEffect(() => {
        if (!gridContainerRef.current) return

        // Clear existing charts
        chartRefs.current.forEach((instance) => {
            instance.chart.remove()
        })
        chartRefs.current.clear()

        // Create new charts
        chartConfigs.forEach((config, index) => {
            const container = document.getElementById(`chart-container-${index}`)
            if (!container) return

            const chart = createChart(container, {
                width: container.clientWidth,
                height: container.clientHeight,
                layout: {
                    background: { color: colors.background },
                    textColor: colors.text,
                },
                grid: {
                    vertLines: { color: colors.grid, style: 1 },
                    horzLines: { color: colors.grid, style: 1 },
                },
                rightPriceScale: {
                    borderColor: colors.border,
                    scaleMargins: { top: 0.1, bottom: 0.25 },
                },
                leftPriceScale: {
                    visible: true,
                    borderColor: colors.border,
                    scaleMargins: { top: 0.85, bottom: 0 },
                },
                timeScale: {
                    borderColor: colors.border,
                    timeVisible: true,
                    secondsVisible: false,
                },
                crosshair: {
                    mode: 1,
                    vertLine: { color: '#758696', labelBackgroundColor: '#758696' },
                    horzLine: { color: '#758696', labelBackgroundColor: '#758696' },
                },
            })

            // Candlestick series
            const candleSeries = chart.addSeries(CandlestickSeries, {
                upColor: colors.green,
                downColor: colors.red,
                borderUpColor: colors.green,
                borderDownColor: colors.red,
                wickUpColor: colors.green,
                wickDownColor: colors.red,
            })

            // Volume series
            const volumeSeries = chart.addSeries(HistogramSeries, {
                color: colors.blue,
                priceFormat: { type: 'volume' },
                priceScaleId: 'volume',
            })
            chart.priceScale('volume').applyOptions({
                scaleMargins: { top: 0.85, bottom: 0 },
            })

            // Sentiment histogram (on left scale)
            let sentimentSeries: ISeriesApi<'Histogram'> | null = null
            if (config.showSentiment) {
                sentimentSeries = chart.addSeries(HistogramSeries, {
                    color: colors.blue,
                    priceFormat: { type: 'custom', minMove: 0.01, formatter: (p: number) => p.toFixed(1) },
                    priceScaleId: 'left',
                })
            }

            // Generate demo data
            const demoData = generateDemoData(config.symbol)
            candleSeries.setData(demoData.candles as any)
            volumeSeries.setData(demoData.volume as any)
            if (sentimentSeries) {
                sentimentSeries.setData(demoData.sentiment as any)
            }

            // Store instance
            chartRefs.current.set(config.symbol, {
                id: config.id,
                symbol: config.symbol,
                chart,
                candleSeries,
                sentimentSeries,
                volumeSeries,
                lastPrice: demoData.candles[demoData.candles.length - 1].close,
                lastSentiment: 0,
            })

            // Update price state
            setChartPrices((prev) => ({
                ...prev,
                [config.symbol]: {
                    price: demoData.candles[demoData.candles.length - 1].close,
                    change: ((demoData.candles[demoData.candles.length - 1].close - demoData.candles[0].close) / demoData.candles[0].close) * 100,
                },
            }))

            // Sync crosshair
            chart.subscribeCrosshairMove((param) => {
                if (param.time) {
                    syncCrosshair(config.symbol, param.time as number)
                }
            })

            // Handle resize
            const resizeObserver = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    chart.applyOptions({
                        width: entry.contentRect.width,
                        height: entry.contentRect.height,
                    })
                }
            })
            resizeObserver.observe(container)

            chart.timeScale().fitContent()
        })

        // Simulate real-time updates
        const updateInterval = setInterval(() => {
            chartRefs.current.forEach((instance) => {
                const lastPrice = instance.lastPrice
                const volatility = 0.003
                const change = lastPrice * volatility * (Math.random() - 0.5)
                const newPrice = parseFloat((lastPrice + change).toFixed(2))

                instance.lastPrice = newPrice

                setChartPrices((prev) => ({
                    ...prev,
                    [instance.symbol]: {
                        price: newPrice,
                        change: prev[instance.symbol]?.change || 0,
                    },
                }))
            })
        }, 2000)

        return () => {
            clearInterval(updateInterval)
            chartRefs.current.forEach((instance) => {
                instance.chart.remove()
            })
        }
    }, [chartConfigs])

    // Sync crosshair across charts
    const syncCrosshair = (sourceSymbol: string, time: number) => {
        chartRefs.current.forEach((instance, symbol) => {
            if (symbol !== sourceSymbol) {
                // Sync time position
            }
        })
    }

    // Check for divergence
    const checkDivergence = (instance: ChartInstance) => {
        // Simulated divergence detection
        if (Math.random() < 0.02) { // 2% chance for demo
            const alert: DivergenceAlert = {
                id: `div-${Date.now()}`,
                symbol: instance.symbol,
                type: 'LIQUIDITY_DIVERGENCE',
                severity: Math.random() > 0.7 ? 'critical' : 'high',
                timestamp: Date.now(),
                price: instance.lastPrice,
                sentiment: instance.lastSentiment,
                message: `Liquidity divergence detected: Price at $${instance.lastPrice.toFixed(2)}, sentiment shifted`,
            }
            addAlert(alert)
        }
    }

    // Add alert
    const addAlert = (alert: DivergenceAlert) => {
        setAlerts((prev) => [alert, ...prev].slice(0, 20))
    }

    // Dismiss alert
    const dismissAlert = (id: string) => {
        setAlerts((prev) => prev.filter((a) => a.id !== id))
    }

    return (
        <div className="uptrade-chart-grid h-screen flex flex-col" style={{ backgroundColor: colors.background }}>
            {/* Top Bar */}
            <div
                className="flex items-center justify-between px-4 py-2"
                style={{ borderBottom: `1px solid ${colors.border}` }}
            >
                <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5" style={{ color: colors.blue }} />
                    <span className="font-bold" style={{ color: colors.text }}>Decision Intelligence Engine</span>
                </div>
                <ConnectionBadge status={connectionStatus} />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex">
                {/* Chart Grid */}
                <div ref={gridContainerRef} className="flex-1 grid grid-cols-2 grid-rows-2 gap-2 p-2">
                    {chartConfigs.map((config, index) => (
                        <div
                            key={config.id}
                            id={`chart-container-${index}`}
                            className="relative rounded-lg overflow-hidden"
                            style={{
                                backgroundColor: colors.surface,
                                border: `1px solid ${colors.border}`,
                            }}
                        >
                            <ChartStats
                                symbol={config.symbol}
                                price={chartPrices[config.symbol]?.price || 0}
                                change={chartPrices[config.symbol]?.change || 0}
                            />
                        </div>
                    ))}
                </div>

                {/* Alerts Panel */}
                <div
                    className="w-80 flex-shrink-0 flex flex-col"
                    style={{ borderLeft: `1px solid ${colors.border}` }}
                >
                    <div
                        className="px-4 py-3 flex items-center justify-between"
                        style={{ borderBottom: `1px solid ${colors.border}` }}
                    >
                        <span className="font-semibold text-sm" style={{ color: colors.text }}>
                            Divergence Alerts
                        </span>
                        <span
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: colors.red + '20', color: colors.red }}
                        >
                            {alerts.length}
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 space-y-2">
                        {alerts.length === 0 ? (
                            <div className="text-center py-8" style={{ color: colors.textMuted }}>
                                <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No active alerts</p>
                            </div>
                        ) : (
                            alerts.map((alert) => (
                                <AlertItem key={alert.id} alert={alert} onDismiss={dismissAlert} />
                            ))
                        )}
                    </div>
                </div>
            </div>

            <style jsx global>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease;
        }
      `}</style>
        </div>
    )
}

// Generate demo data
function generateDemoData(symbol: string) {
    const basePrices: Record<string, number> = {
        AAPL: 189,
        MSFT: 378,
        GOOGL: 141,
        AMZN: 178,
        NVDA: 721,
        TSLA: 248,
        META: 475,
        BTC: 43250,
    }

    const basePrice = basePrices[symbol] || 100
    const candles: any[] = []
    const volume: any[] = []
    const sentiment: any[] = []

    const now = new Date()
    let price = basePrice * (0.9 + Math.random() * 0.1)

    for (let i = 180; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)
        const time = date.toISOString().split('T')[0]

        const volatility = 0.02
        const change = price * volatility * (Math.random() - 0.48) // Slight upward bias
        const open = price
        const close = price + change
        const high = Math.max(open, close) * (1 + Math.random() * volatility * 0.5)
        const low = Math.min(open, close) * (1 - Math.random() * volatility * 0.5)
        const vol = Math.floor(Math.random() * 10000000) + 1000000

        candles.push({ time, open, high, low, close })
        volume.push({
            time,
            value: vol,
            color: close >= open ? colors.green + '40' : colors.red + '40',
        })
        sentiment.push({
            time,
            value: (Math.random() - 0.5) * 100,
            color: Math.random() > 0.5 ? colors.green + '50' : colors.red + '50',
        })

        price = close
    }

    return { candles, volume, sentiment }
}

export default MultiChartGrid
