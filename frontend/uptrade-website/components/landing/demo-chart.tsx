'use client'

import React, { useEffect, useRef, useState } from 'react'
import { createChart, IChartApi, ColorType, CandlestickSeries, CandlestickData, Time } from 'lightweight-charts'

export function DemoChart() {
    const chartContainerRef = useRef<HTMLDivElement>(null)
    const chartRef = useRef<IChartApi | null>(null)
    const [lastPrice, setLastPrice] = useState(248.50)

    useEffect(() => {
        if (!chartContainerRef.current) return

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: '#131722' },
                textColor: '#d1d4dc',
            },
            grid: {
                vertLines: { color: '#2a2e39' },
                horzLines: { color: '#2a2e39' },
            },
            width: chartContainerRef.current.clientWidth,
            height: 400,
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
            },
        })

        const candlestickSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#089981',
            downColor: '#f23645',
            borderVisible: false,
            wickUpColor: '#089981',
            wickDownColor: '#f23645',
        })

        // Generate initial data
        const now = new Date()
        const initialData: CandlestickData<Time>[] = []
        let price = 248.50
        for (let i = 0; i < 100; i++) {
            const time = (new Date(now.getTime() - (100 - i) * 60000).getTime() / 1000) as Time
            const change = (Math.random() - 0.5) * 0.5
            const close = price + change
            initialData.push({
                time: time,
                open: price,
                high: Math.max(price, close) + Math.random() * 0.2,
                low: Math.min(price, close) - Math.random() * 0.2,
                close: close,
            })
            price = close
        }
        candlestickSeries.setData(initialData)

        chart.timeScale().fitContent()

        // Simulate "live" updates
        const interval = setInterval(() => {
            const lastCandle = initialData[initialData.length - 1]
            const lastTime = lastCandle.time as number
            const currentTime = new Date().getTime() / 1000

            // Simple random walk for demo
            const change = (Math.random() - 0.5) * 0.2
            const close = lastPrice + change

            const nextCandle = {
                time: currentTime as Time,
                open: lastPrice,
                high: Math.max(lastPrice, close) + 0.1,
                low: Math.min(lastPrice, close) - 0.1,
                close: close,
            }

            candlestickSeries.update(nextCandle)
            setLastPrice(close)
        }, 1000)

        window.addEventListener('resize', () => {
            if (chartContainerRef.current) {
                chart.resize(chartContainerRef.current.clientWidth, 400)
            }
        })

        return () => {
            clearInterval(interval)
            chart.remove()
        }
    }, [lastPrice])

    return (
        <div className="relative rounded-lg overflow-hidden border border-[#2a2e39] bg-[#131722] shadow-2xl">
            {/* Alert Overlay */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-[#f23645]/10 border border-[#f23645]/50 text-[#f23645] px-4 py-2 rounded-md animate-pulse">
                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f23645] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#f23645]"></span>
                </span>
                <span className="font-bold text-sm tracking-wide">LIQUIDITY DIVERGENCE DETECTED</span>
            </div>

            <div ref={chartContainerRef} className="w-full" />

            {/* VisualX Panel Overlay */}
            <div className="absolute top-4 right-4 w-72 bg-[#1e222d]/95 backdrop-blur border border-[#363a45] rounded-lg p-4 shadow-xl">
                <div className="text-xs text-[#868993] font-bold tracking-wider mb-2">VISUALX ANALYSIS</div>
                <div className="flex justify-between items-end mb-1">
                    <div className="text-white font-mono text-xl">${lastPrice.toFixed(2)}</div>
                    <div className="text-[#089981] font-mono text-sm">+0.2%</div>
                </div>
                <div className="h-px bg-[#2a2e39] my-2"></div>
                <div className="space-y-2">
                    <div>
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-[#868993]">Sentiment Score</span>
                            <span className="text-[#f23645] font-bold">-0.84 σ</span>
                        </div>
                        <div className="h-1.5 bg-[#2a2e39] rounded-full overflow-hidden">
                            <div className="h-full bg-[#f23645] w-[20%]"></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-[#868993]">Institutional Flow</span>
                            <span className="text-[#f23645] font-bold">Bearish</span>
                        </div>
                        <div className="h-1.5 bg-[#2a2e39] rounded-full overflow-hidden">
                            <div className="h-full bg-[#f23645] w-[35%]"></div>
                        </div>
                    </div>
                </div>
                <div className="mt-3 text-[#f23645] text-xs font-medium border-t border-[#f23645]/20 pt-2">
                    ⚠️ Sentiment collapsing while price holds. Brace for volatility.
                </div>
            </div>
        </div>
    )
}
