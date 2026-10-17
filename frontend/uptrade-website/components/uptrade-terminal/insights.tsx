'use client'

import { useEffect, useRef, useState } from 'react'
import { ColorType, LineSeries, createChart, type UTCTimestamp } from 'lightweight-charts'
import { ExternalLink } from 'lucide-react'
import type { Analysis, BacktestResult, Strategy } from '@/lib/model/uptrade'
import { C, displaySymbol, fmtPct, fmtPrice, useApi } from './hooks'

const Empty = ({ children }: { children: React.ReactNode }) => (
    <div className="p-4 text-center text-xs" style={{ color: C.muted }}>{children}</div>
)

const Section = ({ title, children, right }: { title: string; children: React.ReactNode; right?: React.ReactNode }) => (
    <section className="space-y-2 px-3 py-3" style={{ borderBottom: `1px solid ${C.border}` }}>
        <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: C.muted }}>{title}</h3>
            {right}
        </div>
        {children}
    </section>
)

const Stat = ({ label, value, color }: { label: string; value: string; color?: string }) => (
    <div>
        <div className="text-[11px]" style={{ color: C.muted }}>{label}</div>
        <div className="font-mono text-[13px] tabular-nums" style={{ color: color || C.text }}>{value}</div>
    </div>
)

const SIGNAL_COLOR: Record<string, string> = { 'Strong Buy': C.up, Buy: C.up, Hold: C.amber, Sell: C.down, 'Strong Sell': C.down }

// ------------------------------------------------------------
// UpTrade AI (model output)
// ------------------------------------------------------------
export function AIPanel({ symbol }: { symbol: string }) {
    const { data, error, loading } = useApi<{ analysis: Analysis; disclaimer: string }>(`/api/model/analyze?symbol=${encodeURIComponent(symbol)}`)
    if (loading && !data) return <Empty>Running UpTrade model on {displaySymbol(symbol)}…</Empty>
    if (error) return <Empty><span style={{ color: C.down }}>{error}</span></Empty>
    if (!data) return null
    const a = data.analysis
    const end = a.forecast[a.forecast.length - 1]
    const stanceColor = a.stance === 'Bullish' ? C.up : a.stance === 'Bearish' ? C.down : C.amber

    return (
        <div>
            <Section title="UpTrade Score">
                <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 shrink-0">
                        <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90">
                            <circle cx="18" cy="18" r="15.9" fill="none" stroke={C.border2} strokeWidth="3" />
                            <circle cx="18" cy="18" r="15.9" fill="none" stroke={stanceColor} strokeWidth="3" strokeDasharray={`${a.scores.composite} 100`} strokeLinecap="round" />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center font-mono text-lg font-semibold" style={{ color: C.text }}>{a.scores.composite}</span>
                    </div>
                    <div>
                        <div className="text-base font-semibold" style={{ color: stanceColor }}>{a.stance}</div>
                        <div className="text-[11px]" style={{ color: C.muted }}>Composite of technical, momentum, risk and forecast factors</div>
                    </div>
                </div>
                <div className="space-y-1.5 pt-1">
                    {([['Technical', a.scores.technical, C.accent], ['Momentum', a.scores.momentum, C.up], ['Risk (low vol = high)', a.scores.risk, C.amber], ['Forecast', a.scores.forecast, C.purple]] as const).map(([l, v, c]) => (
                        <div key={l} className="flex items-center gap-2 text-[11px]">
                            <span className="w-32 shrink-0" style={{ color: C.muted }}>{l}</span>
                            <div className="h-1.5 flex-1 overflow-hidden rounded-full" style={{ background: C.border2 }}>
                                <div className="h-full rounded-full" style={{ width: `${v}%`, background: c }} />
                            </div>
                            <span className="w-6 text-right font-mono" style={{ color: C.text }}>{v}</span>
                        </div>
                    ))}
                </div>
            </Section>

            <Section title={`${a.horizon}-session forecast`}>
                <div className="flex items-center justify-between">
                    <span className="rounded px-2 py-0.5 text-[12px] font-semibold" style={{ background: `${SIGNAL_COLOR[a.recommendation.signal]}22`, color: SIGNAL_COLOR[a.recommendation.signal] }}>
                        {a.recommendation.signal}
                    </span>
                    <span className="font-mono text-[13px]" style={{ color: a.recommendation.projectedChangePct >= 0 ? C.up : C.down }}>
                        {fmtPct(a.recommendation.projectedChangePct, 2, true)}
                    </span>
                </div>
                <p className="text-[12px] leading-5" style={{ color: C.text }}>{a.recommendation.reason}</p>
                <div className="grid grid-cols-3 gap-2">
                    <Stat label="Last" value={fmtPrice(a.lastPrice)} />
                    <Stat label="Target" value={fmtPrice(end.value)} />
                    <Stat label="95% band" value={`${fmtPrice(end.lower)}–${fmtPrice(end.upper)}`} />
                </div>
                <div className="text-[11px]" style={{ color: C.muted }}>
                    ARIMA({a.model.order.join(',')}) fitted on the last {a.model.trainingBars} daily closes. Wide bands mean low confidence.
                </div>
            </Section>

            <Section title="Technical signals">
                <div className="space-y-1">
                    {a.signals.map((s) => (
                        <div key={s.label} className="flex items-center justify-between text-[12px]">
                            <span style={{ color: C.muted }}>{s.label}</span>
                            <span style={{ color: s.bullish == null ? C.text : s.bullish ? C.up : C.down }}>{s.value}</span>
                        </div>
                    ))}
                </div>
            </Section>

            <Section title="Performance & risk">
                <div className="grid grid-cols-3 gap-2">
                    {([['1M', a.stats.return1M], ['3M', a.stats.return3M], ['6M', a.stats.return6M], ['1Y', a.stats.return1Y]] as const).map(([l, v]) => (
                        <Stat key={l} label={l} value={fmtPct(v)} color={v >= 0 ? C.up : C.down} />
                    ))}
                    <Stat label="Volatility (ann.)" value={fmtPct(a.stats.volatility, 1).replace('+', '')} />
                    <Stat label="Max DD (1Y)" value={fmtPct(a.stats.maxDrawdown1Y, 1)} color={C.down} />
                </div>
            </Section>

            <Section title={`Anomalies (${a.anomalies.length})`}>
                {a.anomalies.length ? (
                    <div className="max-h-48 space-y-1 overflow-y-auto">
                        {[...a.anomalies].reverse().slice(0, 12).map((x, i) => (
                            <div key={i} className="flex items-center justify-between gap-2 text-[12px]">
                                <span className="shrink-0 font-mono" style={{ color: C.muted }}>{new Date(x.time * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit', timeZone: 'UTC' })}</span>
                                <span className="truncate" style={{ color: x.kind === 'volume' ? C.amber : x.value > 0 ? C.up : C.down }}>{x.detail}</span>
                            </div>
                        ))}
                    </div>
                ) : <div className="text-[12px]" style={{ color: C.muted }}>None detected recently</div>}
            </Section>

            <p className="px-3 py-3 text-[11px] leading-4" style={{ color: C.muted }}>{data.disclaimer}</p>
        </div>
    )
}

// ------------------------------------------------------------
// News & sentiment
// ------------------------------------------------------------
type NewsResp = { model: string; overall: number; items: { title: string; publisher: string; link: string; time: number; score: number; label: string }[] }

function ago(t: number) {
    const s = Date.now() / 1000 - t
    if (s < 3600) return `${Math.max(1, Math.round(s / 60))}m`
    if (s < 86400) return `${Math.round(s / 3600)}h`
    return `${Math.round(s / 86400)}d`
}

export function NewsPanel({ symbol }: { symbol: string }) {
    const { data, error, loading } = useApi<NewsResp>(`/api/model/sentiment?symbol=${encodeURIComponent(symbol)}`, 300000)
    if (loading && !data) return <Empty>Loading headlines…</Empty>
    if (error) return <Empty><span style={{ color: C.down }}>{error}</span></Empty>
    if (!data) return null
    const pct = ((data.overall + 1) / 2) * 100
    return (
        <div>
            <Section title="Headline sentiment" right={<span className="text-[11px]" style={{ color: C.muted }}>{data.model}</span>}>
                <div className="flex items-center justify-between text-[12px]">
                    <span style={{ color: C.muted }}>{data.items.length} headlines</span>
                    <span className="font-mono" style={{ color: data.overall > 0.05 ? C.up : data.overall < -0.05 ? C.down : C.amber }}>
                        {data.overall >= 0 ? '+' : ''}{data.overall.toFixed(2)}
                    </span>
                </div>
                <div className="relative h-2 rounded-full" style={{ background: `linear-gradient(90deg, ${C.down}, ${C.amber}, ${C.up})` }}>
                    <div className="absolute -top-1 h-4 w-1 rounded" style={{ left: `calc(${pct}% - 2px)`, background: '#fff' }} />
                </div>
            </Section>
            <div>
                {data.items.map((n, i) => (
                    <a key={i} href={n.link} target="_blank" rel="noopener noreferrer" className="block px-3 py-2 hover:bg-[#24252a]" style={{ borderBottom: `1px solid ${C.border}` }}>
                        <div className="flex items-start gap-2">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: n.label === 'positive' ? C.up : n.label === 'negative' ? C.down : C.muted }} />
                            <span className="text-[12px] leading-5" style={{ color: C.text }}>{n.title}</span>
                            <ExternalLink size={12} className="mt-1 shrink-0" color={C.muted} />
                        </div>
                        <div className="ml-3.5 mt-0.5 text-[11px]" style={{ color: C.muted }}>{n.publisher} · {ago(n.time)}</div>
                    </a>
                ))}
                {!data.items.length && <Empty>No recent headlines for {displaySymbol(symbol)}</Empty>}
            </div>
        </div>
    )
}

// ------------------------------------------------------------
// Backtest
// ------------------------------------------------------------
const STRATEGY_OPTIONS: { id: Strategy; label: string }[] = [
    { id: 'arima', label: 'UpTrade ARIMA (walk-forward)' },
    { id: 'sma_cross', label: 'SMA 50/200 trend' },
    { id: 'macd', label: 'MACD crossover' },
    { id: 'rsi_reversion', label: 'RSI 30/70 mean reversion' },
]

function EquityChart({ result }: { result: BacktestResult }) {
    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (!ref.current) return
        const chart = createChart(ref.current, {
            autoSize: true,
            layout: { background: { type: ColorType.Solid, color: C.bg }, textColor: C.muted, fontSize: 10, attributionLogo: false },
            grid: { vertLines: { visible: false }, horzLines: { color: 'rgba(36,37,42,0.6)' } },
            rightPriceScale: { borderVisible: false },
            timeScale: { borderVisible: false },
            handleScroll: false,
            handleScale: false,
        })
        const toPts = (s: { time: number; value: number }[]) => s.map((p) => ({ time: p.time as UTCTimestamp, value: (p.value - 1) * 100 }))
        const fmt = { type: 'custom' as const, formatter: (v: number) => `${v.toFixed(0)}%` }
        chart.addSeries(LineSeries, { color: C.muted, lineWidth: 1, priceLineVisible: false, lastValueVisible: false, priceFormat: fmt }).setData(toPts(result.buyHold))
        chart.addSeries(LineSeries, { color: C.accent, lineWidth: 2, priceLineVisible: false, priceFormat: fmt }).setData(toPts(result.equity))
        chart.timeScale().fitContent()
        return () => chart.remove()
    }, [result])
    return <div ref={ref} className="h-40 w-full" />
}

export function BacktestPanel({ symbol }: { symbol: string }) {
    const [strategy, setStrategy] = useState<Strategy>('arima')
    const [feeBps, setFeeBps] = useState(10)
    const { data, error, loading } = useApi<{ result: BacktestResult }>(`/api/model/backtest?symbol=${encodeURIComponent(symbol)}&strategy=${strategy}&feeBps=${feeBps}`)
    const r = data?.result
    return (
        <div>
            <Section title="Strategy tester">
                <select
                    value={strategy}
                    onChange={(e) => setStrategy(e.target.value as Strategy)}
                    className="w-full rounded px-2 py-1.5 text-[12px] outline-none"
                    style={{ background: C.bg, color: C.text, border: `1px solid ${C.border2}` }}
                    aria-label="Strategy"
                >
                    {STRATEGY_OPTIONS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
                <label className="flex items-center justify-between text-[12px]" style={{ color: C.muted }}>
                    Fees per trade (bps)
                    <select value={feeBps} onChange={(e) => setFeeBps(Number(e.target.value))} className="rounded px-1 py-0.5 outline-none" style={{ background: C.bg, color: C.text, border: `1px solid ${C.border2}` }}>
                        {[0, 5, 10, 25, 50].map((v) => <option key={v} value={v}>{v}</option>)}
                    </select>
                </label>
                <div className="text-[11px]" style={{ color: C.muted }}>Long/flat on daily bars, up to 5 years. Signals at close, filled next bar.</div>
            </Section>
            {loading && !r && <Empty>Running backtest…</Empty>}
            {error && <Empty><span style={{ color: C.down }}>{error}</span></Empty>}
            {r && (
                <>
                    <Section title="Equity curve" right={<span className="flex items-center gap-2 text-[11px]" style={{ color: C.muted }}><span style={{ color: C.accent }}>■ Strategy</span><span>■ Buy &amp; hold</span></span>}>
                        <EquityChart result={r} />
                    </Section>
                    <Section title="Results">
                        <div className="grid grid-cols-3 gap-x-2 gap-y-3">
                            <Stat label="Net return" value={fmtPct(r.totalReturn, 1)} color={r.totalReturn >= 0 ? C.up : C.down} />
                            <Stat label="Buy & hold" value={fmtPct(r.buyHoldReturn, 1)} color={r.buyHoldReturn >= 0 ? C.up : C.down} />
                            <Stat label="CAGR" value={fmtPct(r.cagr, 1)} />
                            <Stat label="Sharpe" value={r.sharpe.toFixed(2)} />
                            <Stat label="Max drawdown" value={fmtPct(r.maxDrawdown, 1)} color={C.down} />
                            <Stat label="Trades" value={String(r.trades)} />
                            <Stat label="Win rate" value={r.trades ? `${(r.winRate * 100).toFixed(0)}%` : '—'} />
                            <Stat label="Profit factor" value={Number.isFinite(r.profitFactor) ? r.profitFactor.toFixed(2) : '∞'} />
                            <Stat label="Exposure" value={`${(r.exposure * 100).toFixed(0)}%`} />
                        </div>
                        <div className="text-[11px]" style={{ color: C.muted }}>
                            {new Date(r.start * 1000).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} – {new Date(r.end * 1000).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} · Past performance does not predict future results.
                        </div>
                    </Section>
                </>
            )}
        </div>
    )
}
