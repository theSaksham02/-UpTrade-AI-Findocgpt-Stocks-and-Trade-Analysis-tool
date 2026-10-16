'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { AreaSeries, ColorType, createChart, CrosshairMode, LineStyle, type UTCTimestamp } from 'lightweight-charts'
import type { Quote } from '@/lib/market/types'
import { displaySymbol, fmtPct, fmtPrice } from '@/components/uptrade-terminal/hooks'

export const UP = '#22c55e'
export const DOWN = '#ef4444'

export type OverviewItem = { symbol: string; quote: Quote; spark: { time: number; value: number }[] }
export type ScanItem = {
    symbol: string; name: string; price: number; changePercent: number; score: number
    stance: 'Bullish' | 'Neutral' | 'Bearish'; signal: string; projectedChangePct: number; return3M: number; rsi: number | null
}

export function Sparkline({ points, up, className = 'h-10 w-full' }: { points: { value: number }[]; up: boolean; className?: string }) {
    if (points.length < 2) return <div className={className} />
    const vals = points.map((p) => p.value)
    const min = Math.min(...vals), max = Math.max(...vals)
    const W = 100, H = 32
    const xy = vals.map((v, i) => [(i / (vals.length - 1)) * W, H - ((v - min) / (max - min || 1)) * (H - 2) - 1])
    const d = xy.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(2)},${y.toFixed(2)}`).join('')
    const color = up ? UP : DOWN
    const id = `g${Math.round(vals[0] * 1000)}${vals.length}${up ? 'u' : 'd'}`
    return (
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className={className} aria-hidden>
            <defs>
                <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={`${d}L${W},${H}L0,${H}Z`} fill={`url(#${id})`} />
            <path d={d} fill="none" stroke={color} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        </svg>
    )
}

export function QuoteCard({ item }: { item: OverviewItem }) {
    const q = item.quote
    const up = q.changePercent >= 0
    return (
        <Link
            href={`/app?symbol=${encodeURIComponent(item.symbol)}`}
            className="group block rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 transition-colors hover:border-white/20 hover:bg-white/[0.06]"
        >
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-white">{q.name}</div>
                    <div className="text-xs text-white/40">{displaySymbol(item.symbol)}</div>
                </div>
                <span className={`shrink-0 rounded-md px-1.5 py-0.5 font-mono text-xs ${up ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                    {fmtPct(q.changePercent, 2, true)}
                </span>
            </div>
            <div className="mt-3 font-mono text-xl font-medium tabular-nums text-white">
                {fmtPrice(q.price)} <span className="text-xs text-white/40">{q.currency}</span>
            </div>
            <Sparkline points={item.spark} up={item.spark.length > 1 ? item.spark[item.spark.length - 1].value >= item.spark[0].value : up} className="mt-2 h-12 w-full" />
        </Link>
    )
}

export function SkeletonCard() {
    return <div className="h-[150px] animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.03]" />
}

// Large area chart used in the hero
export function HeroChart({ points }: { points: { time: number; value: number }[] }) {
    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (!ref.current || points.length < 2) return
        const up = points[points.length - 1].value >= points[0].value
        const color = up ? UP : DOWN
        const chart = createChart(ref.current, {
            autoSize: true,
            layout: {
                background: { type: ColorType.Solid, color: 'transparent' },
                textColor: 'rgba(255,255,255,0.45)',
                fontFamily: getComputedStyle(document.body).getPropertyValue('--font-code').trim() || 'monospace',
                fontSize: 11,
                attributionLogo: false,
            },
            grid: { vertLines: { visible: false }, horzLines: { color: 'rgba(255,255,255,0.05)' } },
            rightPriceScale: { borderVisible: false, scaleMargins: { top: 0.15, bottom: 0.05 } },
            timeScale: { borderVisible: false, fixLeftEdge: true, fixRightEdge: true },
            crosshair: {
                mode: CrosshairMode.Magnet,
                vertLine: { color: 'rgba(255,255,255,0.25)', style: LineStyle.Dashed, labelBackgroundColor: '#1f2330' },
                horzLine: { color: 'rgba(255,255,255,0.25)', style: LineStyle.Dashed, labelBackgroundColor: '#1f2330' },
            },
            handleScroll: false,
            handleScale: false,
        })
        const s = chart.addSeries(AreaSeries, {
            lineColor: color, lineWidth: 2,
            topColor: up ? 'rgba(34,197,94,0.28)' : 'rgba(239,68,68,0.28)',
            bottomColor: 'rgba(0,0,0,0)',
            priceLineVisible: false,
        })
        s.setData(points.map((p) => ({ time: p.time as UTCTimestamp, value: p.value })))
        chart.timeScale().fitContent()
        return () => chart.remove()
    }, [points])
    return <div ref={ref} className="h-full w-full" />
}
