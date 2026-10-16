'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
    AreaSeries, BarSeries, CandlestickSeries, ColorType, CrosshairMode, HistogramSeries, LineSeries, LineStyle, PriceScaleMode,
    createChart, createSeriesMarkers, createTextWatermark,
    type IChartApi, type IPriceLine, type ISeriesApi, type SeriesType, type Time, type UTCTimestamp,
} from 'lightweight-charts'
import type { BarsResponse, Candle, Interval } from '@/lib/market/types'
import { bollinger, ema, macd, rsi, sma, type Analysis, type Series } from '@/lib/model/uptrade'
import { C, displaySymbol, fmtPct, fmtPrice, useApi } from './hooks'

export type ChartType = 'candles' | 'hollow' | 'heikin' | 'bars' | 'line' | 'area'
export type IndicatorKey = 'vol' | 'sma20' | 'sma50' | 'sma200' | 'ema20' | 'bb' | 'rsi' | 'macd'
export type Tool = 'cursor' | 'trend' | 'hline'

export const INDICATOR_META: Record<IndicatorKey, { label: string; color: string; pane?: boolean }> = {
    vol: { label: 'Volume', color: C.muted },
    sma20: { label: 'SMA 20', color: C.yellow },
    sma50: { label: 'SMA 50', color: C.accent },
    sma200: { label: 'SMA 200', color: C.amber },
    ema20: { label: 'EMA 20', color: '#26c6da' },
    bb: { label: 'Bollinger Bands (20, 2)', color: '#7e57c2' },
    rsi: { label: 'RSI 14', color: '#7e57c2', pane: true },
    macd: { label: 'MACD 12 26 9', color: C.accent, pane: true },
}

interface Props {
    symbol: string
    interval: Interval
    chartType: ChartType
    indicators: IndicatorKey[]
    showForecast: boolean
    showAnomalies: boolean
    logScale: boolean
    tool: Tool
    clearToken: number
    active: boolean
    compact?: boolean
    onActivate: () => void
    onToolDone: () => void
    onQuote?: (q: BarsResponse['quote']) => void
}

type Drawing = { kind: 'hline'; price: number } | { kind: 'trend'; a: { t: number; p: number }; b: { t: number; p: number } }

const ts = (t: number) => t as UTCTimestamp
const line = (vals: Series, candles: Candle[]) =>
    vals.flatMap((v, i) => (v == null ? [] : [{ time: ts(candles[i].time), value: v }]))

function heikinAshi(c: Candle[]): Candle[] {
    const out: Candle[] = []
    c.forEach((b, i) => {
        const close = (b.open + b.high + b.low + b.close) / 4
        const open = i === 0 ? (b.open + b.close) / 2 : (out[i - 1].open + out[i - 1].close) / 2
        out.push({ ...b, open, close, high: Math.max(b.high, open, close), low: Math.min(b.low, open, close) })
    })
    return out
}

export default function ChartPanel(props: Props) {
    const { symbol, interval, chartType, indicators, showForecast, showAnomalies, logScale, tool, clearToken, active, compact } = props
    const containerRef = useRef<HTMLDivElement>(null)
    const chartRef = useRef<IChartApi | null>(null)
    const mainRef = useRef<ISeriesApi<SeriesType> | null>(null)
    const extraRef = useRef<ISeriesApi<SeriesType>[]>([])
    const drawingsRef = useRef<Drawing[]>([])
    const drawnRef = useRef<{ lines: IPriceLine[]; series: ISeriesApi<SeriesType>[] }>({ lines: [], series: [] })
    const pendingRef = useRef<{ t: number; p: number } | null>(null)
    const viewKeyRef = useRef('')
    const watermarkRef = useRef<{ detach: () => void } | null>(null)
    const toolRef = useRef(tool)
    toolRef.current = tool
    const cbRef = useRef(props)
    cbRef.current = props

    const [hover, setHover] = useState<Candle | null>(null)
    const [pending, setPending] = useState(false)

    const refresh = interval === '5m' || interval === '15m' ? 30000 : interval === '1h' ? 60000 : 120000
    const bars = useApi<BarsResponse>(`/api/market/bars?symbol=${encodeURIComponent(symbol)}&interval=${interval}`, refresh)
    const wantsModel = interval === '1D' && (showForecast || showAnomalies)
    const model = useApi<{ analysis: Analysis }>(wantsModel ? `/api/model/analyze?symbol=${encodeURIComponent(symbol)}` : null)

    const candles = bars.data?.candles
    const quote = bars.data?.quote
    useEffect(() => {
        if (quote) cbRef.current.onQuote?.(quote)
    }, [quote])

    const shown = useMemo(() => (candles && chartType === 'heikin' ? heikinAshi(candles) : candles), [candles, chartType])

    // ---- create chart once ----
    useEffect(() => {
        const el = containerRef.current
        if (!el) return
        const intraday = !['1D', '1W', '1M'].includes(interval)
        const chart = createChart(el, {
            autoSize: true,
            layout: {
                background: { type: ColorType.Solid, color: C.bg },
                textColor: C.text,
                fontSize: 11,
                fontFamily: getComputedStyle(document.body).getPropertyValue('--font-code').trim() || 'ui-monospace, monospace',
                panes: { separatorColor: C.border, separatorHoverColor: 'rgba(41,98,255,0.3)', enableResize: true },
            },
            grid: { vertLines: { color: 'rgba(42,46,57,0.6)' }, horzLines: { color: 'rgba(42,46,57,0.6)' } },
            crosshair: {
                mode: CrosshairMode.Normal,
                vertLine: { color: '#9598a1', width: 1, style: LineStyle.Dashed, labelBackgroundColor: C.border2 },
                horzLine: { color: '#9598a1', width: 1, style: LineStyle.Dashed, labelBackgroundColor: C.border2 },
            },
            rightPriceScale: { borderColor: C.border },
            timeScale: { borderColor: C.border, timeVisible: intraday, secondsVisible: false, rightOffset: 8 },
            localization: {
                timeFormatter: (t: Time) => {
                    const d = new Date((t as number) * 1000)
                    return intraday
                        ? d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                        : d.toLocaleDateString('en-US', { weekday: 'short', year: '2-digit', month: 'short', day: 'numeric', timeZone: 'UTC' })
                },
            },
        })
        chartRef.current = chart

        chart.subscribeCrosshairMove((param) => {
            const main = mainRef.current
            if (!main || !param.time) return setHover(null)
            const d = param.seriesData.get(main) as any
            if (d && d.open != null) setHover({ time: param.time as number, open: d.open, high: d.high, low: d.low, close: d.close, volume: 0 })
            else if (d && d.value != null) setHover({ time: param.time as number, open: d.value, high: d.value, low: d.value, close: d.value, volume: 0 })
        })

        return () => {
            // detach plugins before disposing, or they schedule a paint on a dead chart
            try { watermarkRef.current?.detach() } catch { }
            watermarkRef.current = null
            chart.remove()
            chartRef.current = null
            mainRef.current = null
            extraRef.current = []
            drawnRef.current = { lines: [], series: [] }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [interval])

    useEffect(() => {
        if (tool === 'cursor' && pendingRef.current) {
            pendingRef.current = null
            setPending(false)
        }
    }, [tool])

    // Drawing clicks are handled on the DOM so they work regardless of the chart's drag detection
    function handleDrawClick(e: React.MouseEvent<HTMLDivElement>) {
        const chart = chartRef.current, main = mainRef.current, el = containerRef.current
        const t = toolRef.current
        if (!chart || !main || !el || t === 'cursor') return
        const rect = el.getBoundingClientRect()
        const x = e.clientX - rect.left, y = e.clientY - rect.top
        if (x > chart.timeScale().width() || y > chart.paneSize(0).height) return
        const price = main.coordinateToPrice(y)
        const time = chart.timeScale().coordinateToTime(x) as number | null
        if (price == null) return
        if (t === 'hline') {
            drawingsRef.current.push({ kind: 'hline', price })
            renderDrawings()
            cbRef.current.onToolDone()
        } else if (t === 'trend' && time != null) {
            const a = pendingRef.current
            if (!a) {
                pendingRef.current = { t: time, p: price }
                setPending(true)
                return
            }
            pendingRef.current = null
            setPending(false)
            if (a.t !== time) {
                drawingsRef.current.push({ kind: 'trend', a, b: { t: time, p: price } })
                renderDrawings()
            }
            cbRef.current.onToolDone()
        }
    }

    function renderDrawings() {
        const chart = chartRef.current, main = mainRef.current
        if (!chart || !main) return
        drawnRef.current.lines.forEach((l) => { try { main.removePriceLine(l) } catch { } })
        drawnRef.current.series.forEach((s) => { try { chart.removeSeries(s) } catch { } })
        drawnRef.current = { lines: [], series: [] }
        for (const d of drawingsRef.current) {
            if (d.kind === 'hline') {
                drawnRef.current.lines.push(main.createPriceLine({ price: d.price, color: C.accent, lineWidth: 1, lineStyle: LineStyle.Solid, axisLabelVisible: true, title: '' }))
            } else {
                const [p, q] = d.a.t < d.b.t ? [d.a, d.b] : [d.b, d.a]
                const s = chart.addSeries(LineSeries, { color: C.accent, lineWidth: 2, priceLineVisible: false, lastValueVisible: false, crosshairMarkerVisible: false })
                s.setData([{ time: ts(p.t), value: p.p }, { time: ts(q.t), value: q.p }])
                drawnRef.current.series.push(s)
            }
        }
    }

    useEffect(() => {
        drawingsRef.current = []
        pendingRef.current = null
        setPending(false)
        renderDrawings()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clearToken, symbol, interval])

    // ---- (re)build series ----
    const forecast = showForecast && interval === '1D' ? model.data?.analysis.forecast : undefined
    const anomalies = showAnomalies && interval === '1D' ? model.data?.analysis.anomalies : undefined
    const indicatorKey = indicators.join(',')

    useEffect(() => {
        const chart = chartRef.current
        if (!chart || !shown?.length || !candles) return

        const viewKey = `${symbol}|${interval}`
        const keepRange = viewKeyRef.current === viewKey ? chart.timeScale().getVisibleLogicalRange() : null

        // tear down
        drawnRef.current.series.forEach((s) => { try { chart.removeSeries(s) } catch { } })
        drawnRef.current = { lines: [], series: [] }
        extraRef.current.forEach((s) => { try { chart.removeSeries(s) } catch { } })
        extraRef.current = []
        if (mainRef.current) { try { chart.removeSeries(mainRef.current) } catch { } }
        while (chart.panes().length > 1) chart.removePane(chart.panes().length - 1)

        const last = candles[candles.length - 1].close
        const precision = last < 1 ? 4 : 2
        const priceFormat = { type: 'price' as const, precision, minMove: 1 / 10 ** precision }
        const data = shown.map((c) => ({ time: ts(c.time), open: c.open, high: c.high, low: c.low, close: c.close }))

        let main: ISeriesApi<SeriesType>
        if (chartType === 'line') {
            main = chart.addSeries(LineSeries, { color: C.accent, lineWidth: 2, priceFormat })
            main.setData(data.map((d) => ({ time: d.time, value: d.close })))
        } else if (chartType === 'area') {
            main = chart.addSeries(AreaSeries, { lineColor: C.accent, topColor: 'rgba(41,98,255,0.28)', bottomColor: 'rgba(41,98,255,0.02)', lineWidth: 2, priceFormat })
            main.setData(data.map((d) => ({ time: d.time, value: d.close })))
        } else if (chartType === 'bars') {
            main = chart.addSeries(BarSeries, { upColor: C.up, downColor: C.down, priceFormat })
            main.setData(data)
        } else {
            const hollow = chartType === 'hollow'
            main = chart.addSeries(CandlestickSeries, {
                upColor: hollow ? 'rgba(0,0,0,0)' : C.up, downColor: C.down,
                borderUpColor: C.up, borderDownColor: C.down, wickUpColor: C.up, wickDownColor: C.down, priceFormat,
            })
            main.setData(data)
        }
        mainRef.current = main
        const add = <T extends SeriesType>(s: ISeriesApi<T>) => (extraRef.current.push(s as any), s)
        const closes = candles.map((c) => c.close)

        const has = (k: IndicatorKey) => indicators.includes(k)
        if (has('vol') && candles.some((c) => c.volume > 0)) {
            const v = add(chart.addSeries(HistogramSeries, { priceFormat: { type: 'volume' }, priceScaleId: 'vol', lastValueVisible: false, priceLineVisible: false }))
            v.priceScale().applyOptions({ scaleMargins: { top: 0.82, bottom: 0 } })
            v.setData(candles.map((c) => ({ time: ts(c.time), value: c.volume, color: c.close >= c.open ? 'rgba(8,153,129,0.35)' : 'rgba(242,54,69,0.35)' })))
        }
        const overlay = (vals: Series, color: string, width: 1 | 2 = 1, style = LineStyle.Solid) =>
            add(chart.addSeries(LineSeries, { color, lineWidth: width, lineStyle: style, priceLineVisible: false, lastValueVisible: false, crosshairMarkerVisible: false })).setData(line(vals, candles))
        if (has('sma20')) overlay(sma(closes, 20), INDICATOR_META.sma20.color)
        if (has('sma50')) overlay(sma(closes, 50), INDICATOR_META.sma50.color)
        if (has('sma200')) overlay(sma(closes, 200), INDICATOR_META.sma200.color)
        if (has('ema20')) overlay(ema(closes, 20), INDICATOR_META.ema20.color)
        if (has('bb')) {
            const b = bollinger(closes)
            overlay(b.upper, INDICATOR_META.bb.color)
            overlay(b.mid, 'rgba(126,87,194,0.6)', 1, LineStyle.Dotted)
            overlay(b.lower, INDICATOR_META.bb.color)
        }

        let pane = 1
        if (has('rsi')) {
            const s = add(chart.addSeries(LineSeries, { color: INDICATOR_META.rsi.color, lineWidth: 1, priceLineVisible: false }, pane))
            s.setData(line(rsi(closes), candles))
            s.createPriceLine({ price: 70, color: C.muted, lineStyle: LineStyle.Dashed, lineWidth: 1, axisLabelVisible: false, title: '' })
            s.createPriceLine({ price: 30, color: C.muted, lineStyle: LineStyle.Dashed, lineWidth: 1, axisLabelVisible: false, title: '' })
            pane++
        }
        if (has('macd')) {
            const m = macd(closes)
            add(chart.addSeries(HistogramSeries, { priceLineVisible: false, lastValueVisible: false }, pane)).setData(
                m.hist.flatMap((v, i) => (v == null ? [] : [{ time: ts(candles[i].time), value: v, color: v >= 0 ? 'rgba(8,153,129,0.6)' : 'rgba(242,54,69,0.6)' }])),
            )
            add(chart.addSeries(LineSeries, { color: C.accent, lineWidth: 1, priceLineVisible: false, lastValueVisible: false }, pane)).setData(line(m.line, candles))
            add(chart.addSeries(LineSeries, { color: C.amber, lineWidth: 1, priceLineVisible: false, lastValueVisible: false }, pane)).setData(line(m.signal, candles))
            pane++
        }
        const panes = chart.panes()
        if (panes.length > 1) panes.forEach((p, i) => p.setStretchFactor(i === 0 ? (compact ? 2.5 : 4) : 1))

        if (forecast?.length) {
            const anchor = { time: ts(candles[candles.length - 1].time), value: last }
            const fl = (key: 'value' | 'lower' | 'upper') => [anchor, ...forecast.map((f) => ({ time: ts(f.time), value: f[key] }))]
            add(chart.addSeries(LineSeries, { color: C.purple, lineWidth: 2, lineStyle: LineStyle.Dashed, priceLineVisible: false, title: 'Forecast', priceFormat })).setData(fl('value'))
            add(chart.addSeries(LineSeries, { color: 'rgba(171,71,188,0.45)', lineWidth: 1, lineStyle: LineStyle.Dotted, priceLineVisible: false, lastValueVisible: false, crosshairMarkerVisible: false })).setData(fl('upper'))
            add(chart.addSeries(LineSeries, { color: 'rgba(171,71,188,0.45)', lineWidth: 1, lineStyle: LineStyle.Dotted, priceLineVisible: false, lastValueVisible: false, crosshairMarkerVisible: false })).setData(fl('lower'))
        }

        if (anomalies?.length) {
            const times = new Set(candles.map((c) => c.time))
            createSeriesMarkers(main, anomalies.filter((a) => times.has(a.time)).map((a) => (
                a.kind === 'volume'
                    ? { time: ts(a.time), position: 'belowBar' as const, shape: 'circle' as const, color: C.amber, size: 0.6 }
                    : { time: ts(a.time), position: a.value > 0 ? 'belowBar' as const : 'aboveBar' as const, shape: a.value > 0 ? 'arrowUp' as const : 'arrowDown' as const, color: a.value > 0 ? C.up : C.down }
            )))
        }

        chart.priceScale('right').applyOptions({ mode: logScale ? PriceScaleMode.Logarithmic : PriceScaleMode.Normal })
        renderDrawings()

        if (keepRange) chart.timeScale().setVisibleLogicalRange(keepRange)
        else {
            const n = candles.length
            chart.timeScale().setVisibleLogicalRange({ from: Math.max(0, n - (compact ? 120 : 180)), to: n + (forecast?.length ? 34 : 6) })
        }
        viewKeyRef.current = viewKey
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shown, chartType, indicatorKey, forecast, anomalies, logScale, compact])

    // Watermark
    useEffect(() => {
        const chart = chartRef.current
        if (!chart) return
        try { watermarkRef.current?.detach() } catch { }
        const wm = createTextWatermark(chart.panes()[0], {
            horzAlign: 'center', vertAlign: 'center',
            lines: [{ text: `${displaySymbol(symbol)}, ${interval}`, color: 'rgba(120,123,134,0.10)', fontSize: compact ? 28 : 52, fontStyle: '600' }],
        })
        watermarkRef.current = wm
    }, [symbol, interval, compact, shown])

    const bar = hover ?? candles?.[candles.length - 1]
    const prev = candles && bar ? candles[Math.max(0, candles.findIndex((c) => c.time === bar.time) - 1)] : undefined
    const chg = bar && prev ? bar.close - prev.close : 0
    const up = chg >= 0

    return (
        <div
            className={`relative h-full w-full min-h-0 ${tool !== 'cursor' ? 'cursor-crosshair' : ''}`}
            style={{ outline: active ? `1px solid ${C.accent}` : 'none', outlineOffset: -1 }}
            onMouseDown={props.onActivate}
            onClick={handleDrawClick}
        >
            <div ref={containerRef} className="absolute inset-0" />

            {/* Legend */}
            <div className="pointer-events-none absolute left-2 top-1.5 z-10 space-y-0.5 text-[11px] leading-4" style={{ color: C.text }}>
                <div className="flex flex-wrap items-center gap-x-2">
                    <span className="font-semibold text-[13px]">{quote?.name ? `${quote.name}` : displaySymbol(symbol)}</span>
                    <span style={{ color: C.muted }}>· {interval} · {quote?.exchange || '…'}</span>
                    {bar && !compact && (
                        <span className="font-mono" style={{ color: up ? C.up : C.down }}>
                            <span style={{ color: C.muted }}>O</span>{fmtPrice(bar.open)} <span style={{ color: C.muted }}>H</span>{fmtPrice(bar.high)}{' '}
                            <span style={{ color: C.muted }}>L</span>{fmtPrice(bar.low)} <span style={{ color: C.muted }}>C</span>{fmtPrice(bar.close)}{' '}
                            {chg >= 0 ? '+' : ''}{fmtPrice(chg)} ({fmtPct(prev ? chg / prev.close : 0)})
                        </span>
                    )}
                </div>
                {compact && bar && (
                    <div className="font-mono" style={{ color: up ? C.up : C.down }}>{fmtPrice(bar.close)} {fmtPct(prev ? chg / prev.close : 0)}</div>
                )}
                {!compact && indicators.filter((k) => !INDICATOR_META[k].pane && k !== 'vol').map((k) => (
                    <div key={k} className="flex items-center gap-1.5">
                        <span className="inline-block h-0.5 w-3" style={{ background: INDICATOR_META[k].color }} />
                        <span style={{ color: C.muted }}>{INDICATOR_META[k].label}</span>
                    </div>
                ))}
                {!compact && forecast?.length ? (
                    <div className="flex items-center gap-1.5">
                        <span className="inline-block h-0.5 w-3 border-t-2 border-dashed" style={{ borderColor: C.purple }} />
                        <span style={{ color: C.muted }}>UpTrade ARIMA(5,1,0) · {forecast.length}d · 95% band</span>
                    </div>
                ) : null}
                {!compact && indicators.includes('vol') && candles?.length && !candles.some((c) => c.volume > 0) ? (
                    <div style={{ color: C.muted }}>No volume data for this symbol</div>
                ) : null}
                {!compact && (showForecast || showAnomalies) && interval !== '1D' && (
                    <div style={{ color: C.muted }}>Forecast &amp; anomalies are computed on the 1D interval</div>
                )}
            </div>

            {pending && (
                <div className="pointer-events-none absolute left-1/2 top-2 z-10 -translate-x-1/2 rounded px-2 py-1 text-[11px]" style={{ background: C.accent, color: '#fff' }}>
                    Click the second point
                </div>
            )}

            {bars.loading && !candles && (
                <div className="absolute inset-0 z-10 flex items-center justify-center text-xs" style={{ color: C.muted }}>Loading {displaySymbol(symbol)}…</div>
            )}
            {bars.error && !candles && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-1 text-xs" style={{ color: C.muted }}>
                    <span style={{ color: C.down }}>Couldn’t load {displaySymbol(symbol)}</span>
                    <span>{bars.error}</span>
                </div>
            )}
        </div>
    )
}
