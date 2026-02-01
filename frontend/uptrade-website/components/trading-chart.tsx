'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { createChart, IChartApi, ISeriesApi, CandlestickData, Time, CandlestickSeries, LineSeries, HistogramSeries } from 'lightweight-charts'

interface ChartData {
    time: Time
    open: number
    high: number
    low: number
    close: number
    volume?: number
}

interface TradingChartProps {
    symbol: string
    data: ChartData[]
    width?: number
    height?: number
    showVolume?: boolean
    onCrosshairMove?: (time: Time | null, price: number | null) => void
}

// TradingView color palette
const colors = {
    background: '#131722',
    text: '#d1d4dc',
    textMuted: '#787b86',
    grid: '#2a2e39',
    border: '#363a45',
    green: '#089981',
    red: '#f23645',
    blue: '#2962FF',
}

export function TradingChart({
    symbol,
    data,
    width,
    height = 400,
    showVolume = true,
    onCrosshairMove
}: TradingChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null)
    const chartRef = useRef<IChartApi | null>(null)
    const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)
    const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null)
    const [currentPrice, setCurrentPrice] = useState<number | null>(null)
    const [priceChange, setPriceChange] = useState<{ value: number; percent: number } | null>(null)

    // Create chart on mount
    useEffect(() => {
        if (!chartContainerRef.current) return

        const chartWidth = width || chartContainerRef.current.clientWidth

        const chart = createChart(chartContainerRef.current, {
            width: chartWidth,
            height: height,
            layout: {
                background: { color: colors.background },
                textColor: colors.text,
            },
            grid: {
                vertLines: { color: colors.grid },
                horzLines: { color: colors.grid },
            },
            rightPriceScale: {
                borderColor: colors.border,
                scaleMargins: {
                    top: 0.1,
                    bottom: showVolume ? 0.25 : 0.1,
                },
            },
            timeScale: {
                borderColor: colors.border,
                timeVisible: true,
                secondsVisible: false,
            },
            crosshair: {
                mode: 1,
                vertLine: {
                    color: colors.blue,
                    width: 1,
                    style: 2,
                    labelBackgroundColor: colors.blue,
                },
                horzLine: {
                    color: colors.blue,
                    width: 1,
                    style: 2,
                    labelBackgroundColor: colors.blue,
                },
            },
        })

        // Add candlestick series
        const candleSeries = chart.addSeries(CandlestickSeries, {
            upColor: colors.green,
            downColor: colors.red,
            borderUpColor: colors.green,
            borderDownColor: colors.red,
            wickUpColor: colors.green,
            wickDownColor: colors.red,
        })

        // Add volume series if enabled
        let volumeSeries: ISeriesApi<'Histogram'> | null = null
        if (showVolume) {
            volumeSeries = chart.addSeries(HistogramSeries, {
                color: colors.blue,
                priceFormat: {
                    type: 'volume',
                },
                priceScaleId: 'volume',
            })

            chart.priceScale('volume').applyOptions({
                scaleMargins: {
                    top: 0.85,
                    bottom: 0,
                },
            })
        }

        chartRef.current = chart
        candleSeriesRef.current = candleSeries
        volumeSeriesRef.current = volumeSeries

        // Handle crosshair move
        chart.subscribeCrosshairMove((param) => {
            if (param.time && candleSeries) {
                const data = param.seriesData.get(candleSeries) as CandlestickData
                if (data) {
                    onCrosshairMove?.(param.time, data.close)
                }
            } else {
                onCrosshairMove?.(null, null)
            }
        })

        // Handle window resize
        const handleResize = () => {
            if (chartContainerRef.current && chart) {
                chart.applyOptions({
                    width: chartContainerRef.current.clientWidth
                })
            }
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
            chart.remove()
        }
    }, [height, width, showVolume, onCrosshairMove])

    // Update data
    useEffect(() => {
        if (!candleSeriesRef.current || !data.length) return

        candleSeriesRef.current.setData(data)

        if (volumeSeriesRef.current && showVolume) {
            const volumeData = data.map((d) => ({
                time: d.time,
                value: d.volume || 0,
                color: d.close >= d.open ? colors.green + '50' : colors.red + '50',
            }))
            volumeSeriesRef.current.setData(volumeData)
        }

        // Calculate price change
        if (data.length >= 2) {
            const lastBar = data[data.length - 1]
            const prevBar = data[data.length - 2]
            const change = lastBar.close - prevBar.close
            const changePercent = (change / prevBar.close) * 100
            setCurrentPrice(lastBar.close)
            setPriceChange({ value: change, percent: changePercent })
        }

        // Fit content
        chartRef.current?.timeScale().fitContent()
    }, [data, showVolume])

    return (
        <div className="relative rounded-lg overflow-hidden" style={{ backgroundColor: colors.background }}>
            {/* Chart Header */}
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${colors.border}` }}>
                <div className="flex items-center gap-4">
                    <span className="font-bold text-lg" style={{ color: colors.text }}>{symbol}</span>
                    {currentPrice && (
                        <span className="font-semibold text-xl" style={{ color: colors.text }}>
                            ${currentPrice.toFixed(2)}
                        </span>
                    )}
                    {priceChange && (
                        <span
                            className="text-sm font-medium"
                            style={{ color: priceChange.value >= 0 ? colors.green : colors.red }}
                        >
                            {priceChange.value >= 0 ? '+' : ''}{priceChange.value.toFixed(2)}
                            ({priceChange.percent >= 0 ? '+' : ''}{priceChange.percent.toFixed(2)}%)
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {['1D', '1W', '1M', '3M', '1Y', 'All'].map((tf) => (
                        <button
                            key={tf}
                            className="px-2 py-1 text-xs font-medium rounded transition-colors"
                            style={{
                                color: colors.textMuted,
                                backgroundColor: 'transparent',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = colors.grid
                                e.currentTarget.style.color = colors.text
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent'
                                e.currentTarget.style.color = colors.textMuted
                            }}
                        >
                            {tf}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chart Container */}
            <div ref={chartContainerRef} />
        </div>
    )
}

// Multi-chart layout component
interface MultiChartLayoutProps {
    symbols: string[]
    dataMap: Record<string, ChartData[]>
    layout?: '1x1' | '1x2' | '2x2' | '2x3'
}

export function MultiChartLayout({ symbols, dataMap, layout = '2x2' }: MultiChartLayoutProps) {
    const [syncedTime, setSyncedTime] = useState<Time | null>(null)

    const gridCols = {
        '1x1': 'grid-cols-1',
        '1x2': 'grid-cols-2',
        '2x2': 'grid-cols-2',
        '2x3': 'grid-cols-3',
    }

    const chartHeight = {
        '1x1': 500,
        '1x2': 400,
        '2x2': 300,
        '2x3': 250,
    }

    return (
        <div className={`grid ${gridCols[layout]} gap-4`}>
            {symbols.slice(0, layout === '2x3' ? 6 : layout === '2x2' ? 4 : layout === '1x2' ? 2 : 1).map((symbol) => (
                <TradingChart
                    key={symbol}
                    symbol={symbol}
                    data={dataMap[symbol] || []}
                    height={chartHeight[layout]}
                    showVolume={layout !== '2x3'}
                />
            ))}
        </div>
    )
}

// Real-time data hook for WebSocket connection
export function useMarketData(symbol: string) {
    const [data, setData] = useState<ChartData[]>([])
    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {
        // Generate sample data for demo
        const generateHistoricalData = (): ChartData[] => {
            const bars: ChartData[] = []
            const now = new Date()
            let price = 100 + Math.random() * 100

            for (let i = 365; i >= 0; i--) {
                const date = new Date(now)
                date.setDate(date.getDate() - i)

                const volatility = 0.02
                const change = price * volatility * (Math.random() - 0.5)
                const open = price
                const close = price + change
                const high = Math.max(open, close) * (1 + Math.random() * volatility)
                const low = Math.min(open, close) * (1 - Math.random() * volatility)
                const volume = Math.floor(Math.random() * 10000000)

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

        setData(generateHistoricalData())
        setIsConnected(true)

        // Simulate real-time updates
        const interval = setInterval(() => {
            setData((prev) => {
                if (prev.length === 0) return prev

                const lastBar = prev[prev.length - 1]
                const volatility = 0.005
                const change = lastBar.close * volatility * (Math.random() - 0.5)
                const newClose = lastBar.close + change

                const updatedBar: ChartData = {
                    ...lastBar,
                    high: Math.max(lastBar.high, newClose),
                    low: Math.min(lastBar.low, newClose),
                    close: parseFloat(newClose.toFixed(2)),
                    volume: (lastBar.volume || 0) + Math.floor(Math.random() * 10000),
                }

                return [...prev.slice(0, -1), updatedBar]
            })
        }, 2000)

        return () => clearInterval(interval)
    }, [symbol])

    return { data, isConnected }
}
