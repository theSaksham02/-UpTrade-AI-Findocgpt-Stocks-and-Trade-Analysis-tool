'use client'

import { useEffect, useRef } from 'react'
import { AreaSeries, ColorType, createChart, CrosshairMode, LineSeries, LineStyle, type IChartApi, type UTCTimestamp } from 'lightweight-charts'

export const INK = '#0a0b0d'
export const PAPER = '#ecebe6'
export const MUTED = 'rgba(236,235,230,0.5)'
export const RULE = 'rgba(236,235,230,0.1)'
export const AMBER = '#e8b04a'
export const UP = '#3fb97f'
export const DOWN = '#e5534b'

type Pt = { time: number; value: number }
const ts = (p: Pt) => ({ time: p.time as UTCTimestamp, value: p.value })

function baseChart(el: HTMLElement, opts: { interactive?: boolean; percent?: boolean } = {}): IChartApi {
    return createChart(el, {
        autoSize: true,
        layout: {
            background: { type: ColorType.Solid, color: 'transparent' },
            textColor: MUTED,
            fontFamily: getComputedStyle(document.body).getPropertyValue('--font-code').trim() || 'monospace',
            fontSize: 11,
            attributionLogo: false,
        },
        grid: { vertLines: { visible: false }, horzLines: { color: RULE } },
        rightPriceScale: { borderVisible: false, scaleMargins: { top: 0.12, bottom: 0.08 } },
        timeScale: { borderVisible: false, fixLeftEdge: true, fixRightEdge: true },
        crosshair: {
            mode: CrosshairMode.Magnet,
            vertLine: { color: 'rgba(236,235,230,0.3)', style: LineStyle.Dashed, labelBackgroundColor: '#22242a' },
            horzLine: { color: 'rgba(236,235,230,0.3)', style: LineStyle.Dashed, labelBackgroundColor: '#22242a' },
        },
        handleScroll: !!opts.interactive,
        handleScale: !!opts.interactive,
        localization: opts.percent ? { priceFormatter: (v: number) => `${v >= 0 ? '+' : ''}${v.toFixed(0)}%` } : undefined,
    })
}

// Price history + ARIMA forecast with its 95% band
export function ForecastChart({ history, forecast }: { history: Pt[]; forecast: { time: number; value: number; lower: number; upper: number }[] }) {
    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (!ref.current || history.length < 2) return
        const chart = baseChart(ref.current)
        chart.addSeries(AreaSeries, {
            lineColor: PAPER, lineWidth: 2, topColor: 'rgba(236,235,230,0.10)', bottomColor: 'rgba(236,235,230,0)',
            priceLineVisible: false, lastValueVisible: true,
        }).setData(history.map(ts))
        if (forecast.length) {
            const last = history[history.length - 1]
            const line = (k: 'value' | 'lower' | 'upper') => [ts(last), ...forecast.map((f) => ({ time: f.time as UTCTimestamp, value: f[k] }))]
            const band = { color: 'rgba(232,176,74,0.55)', lineWidth: 1 as const, lineStyle: LineStyle.Dotted, priceLineVisible: false, lastValueVisible: false, crosshairMarkerVisible: false }
            chart.addSeries(LineSeries, band).setData(line('upper'))
            chart.addSeries(LineSeries, band).setData(line('lower'))
            chart.addSeries(LineSeries, { color: AMBER, lineWidth: 2, lineStyle: LineStyle.Dashed, priceLineVisible: false }).setData(line('value'))
        }
        chart.timeScale().fitContent()
        return () => chart.remove()
    }, [history, forecast])
    return <div ref={ref} className="h-full w-full" />
}

// Several equity curves (as % return) on one chart
export function EquityChart({ series }: { series: { color: string; width?: 1 | 2 | 3; dashed?: boolean; points: Pt[] }[] }) {
    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (!ref.current || !series.length) return
        const chart = baseChart(ref.current, { percent: true })
        for (const s of series) {
            chart.addSeries(LineSeries, {
                color: s.color, lineWidth: s.width ?? 2, lineStyle: s.dashed ? LineStyle.Dashed : LineStyle.Solid,
                priceLineVisible: false, lastValueVisible: true,
            }).setData(s.points.map((p) => ({ time: p.time as UTCTimestamp, value: (p.value - 1) * 100 })))
        }
        chart.timeScale().fitContent()
        return () => chart.remove()
    }, [series])
    return <div ref={ref} className="h-full w-full" />
}
