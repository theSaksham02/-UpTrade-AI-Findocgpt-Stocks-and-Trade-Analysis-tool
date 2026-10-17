'use client'

import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import type { BarsResponse } from '@/lib/market/types'
import type { Analysis, BacktestResult } from '@/lib/model/uptrade'
import { displaySymbol, fmtPct, fmtPrice, useApi, useQuotes } from '@/components/uptrade-terminal/hooks'
import { Sparkline, type OverviewItem, type ScanItem } from './market-widgets'
import { AMBER, DOWN, EquityChart, ForecastChart, PAPER, UP } from './charts'
import { Reveal, RevealItem, Stagger, WordReveal } from './motion'
import { VENUES } from './research'

// ------------------------------------------------------------
// Shared bits
// ------------------------------------------------------------

const Wrap = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`mx-auto max-w-[1280px] px-5 md:px-8 ${className}`}>{children}</div>
)

function SectionHead({ kicker, title, children, href, cta }: { kicker: string; title: React.ReactNode; children?: React.ReactNode; href?: string; cta?: string }) {
    return (
        <Reveal className="mb-8 grid gap-4 border-t border-[#ecebe6]/15 pt-6 md:grid-cols-[220px_1fr_auto] md:items-baseline">
            <div className="font-mono text-xs uppercase tracking-[0.14em] text-[#ecebe6]/45">{kicker}</div>
            <div>
                <h2 className="font-display text-4xl leading-[1.05] text-[#ecebe6] md:text-5xl">{title}</h2>
                {children && <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#ecebe6]/60">{children}</p>}
            </div>
            {href && (
                <Link href={href} className="group inline-flex items-center gap-1 text-sm text-[#ecebe6]/70 underline-offset-4 hover:text-[#ecebe6] hover:underline">
                    {cta} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
            )}
        </Reveal>
    )
}

const pctClass = (v: number) => (v >= 0 ? 'text-[#3fb97f]' : 'text-[#e5534b]')

// Shown instead of skeletons when a request failed, so a provider outage doesn't look like endless loading
const UNAVAILABLE = 'Market data is temporarily unavailable.'
const Unavailable = ({ className = '' }: { className?: string }) => (
    <p className={`text-sm text-[#ecebe6]/50 ${className}`}>{UNAVAILABLE}</p>
)

// ------------------------------------------------------------
// Ticker tape
// ------------------------------------------------------------

// ------------------------------------------------------------
// Hero: S&P 500 with the model's forecast drawn on it
// ------------------------------------------------------------

const HERO_SYMBOLS = [
    { s: '^GSPC', label: 'S&P 500' },
    { s: '^NDX', label: 'Nasdaq 100' },
    { s: 'BTC-USD', label: 'Bitcoin' },
    { s: 'GLD', label: 'Gold' },
]

function Hero() {
    const [i, setI] = useState(0)
    const [touched, setTouched] = useState(false)
    const sym = HERO_SYMBOLS[i]
    const enc = encodeURIComponent(sym.s)
    const bars = useApi<BarsResponse>(`/api/market/bars?symbol=${enc}&interval=1D`)
    const model = useApi<{ analysis: Analysis }>(`/api/model/analyze?symbol=${enc}`)
    const history = useMemo(() => (bars.data?.candles ?? []).slice(-130).map((c) => ({ time: c.time, value: c.close })), [bars.data])
    const forecast = useMemo(() => model.data?.analysis.forecast ?? [], [model.data])
    const q = bars.data?.quote
    const end = forecast[forecast.length - 1]

    // Rotate through markets until the visitor picks one (never with reduced motion)
    useEffect(() => {
        if (touched || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        const id = setInterval(() => setI((x) => (x + 1) % HERO_SYMBOLS.length), 9000)
        return () => clearInterval(id)
    }, [touched])

    return (
        <section className="relative overflow-hidden">
            <motion.div aria-hidden className="pointer-events-none absolute -left-32 top-24 h-[420px] w-[420px] rounded-full border border-[#ecebe6]/[0.06]" initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.6 }} />
            <Wrap className="relative grid gap-10 pb-14 pt-14 md:pt-20 lg:grid-cols-[1fr_1.15fr] lg:items-end">
                <div>
                    <Reveal>
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#ecebe6]/12 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-[#ecebe6]/60">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#e8b04a]" /> Free beta · for investors and teams
                        </div>
                    </Reveal>
                    <h1 className="font-display text-[56px] leading-[0.98] text-[#ecebe6] md:text-[84px]">
                        <WordReveal text="A trading terminal that" />{' '}
                        <WordReveal text="shows its work." className="italic text-[#e8b04a]" delay={0.3} />
                    </h1>
                    <Reveal delay={0.5}>
                        <p className="mt-6 max-w-md text-[17px] leading-8 text-[#ecebe6]/65">
                            Charts for stocks, ETFs, indices and crypto. Every forecast is drawn with its error band, and every
                            strategy comes with a five-year backtest — losses included.
                        </p>
                    </Reveal>
                    <Reveal delay={0.6}>
                        <div className="mt-8 flex flex-wrap items-center gap-5">
                            <Link href="/app" className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-md bg-[#ecebe6] px-5 py-3 text-sm font-semibold text-[#0a0b0d]">
                                <span className="absolute inset-0 -translate-x-full bg-[#e8b04a] transition-transform duration-300 ease-out group-hover:translate-x-0" />
                                <span className="relative">Open the terminal</span>
                                <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                            </Link>
                            <Link href="/contact?topic=business" className="group inline-flex items-center gap-1 text-sm text-[#ecebe6]/75 transition-colors hover:text-[#ecebe6]">
                                <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-300 group-hover:bg-[length:100%_1px]">For teams: talk to us</span>
                                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                            </Link>
                        </div>
                    </Reveal>
                </div>

                <Reveal delay={0.2}>
                    <figure className="border border-[#ecebe6]/12 bg-[#0e0f12] transition-colors duration-300 hover:border-[#ecebe6]/25">
                        <figcaption className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-[#ecebe6]/10 px-4 py-2">
                            <div className="flex gap-1" role="tablist" aria-label="Market">
                                {HERO_SYMBOLS.map((h, k) => (
                                    <button
                                        key={h.s}
                                        role="tab"
                                        aria-selected={k === i}
                                        onClick={() => { setI(k); setTouched(true) }}
                                        className={`relative px-2.5 py-1.5 text-sm transition-colors ${k === i ? 'text-[#ecebe6]' : 'text-[#ecebe6]/45 hover:text-[#ecebe6]/80'}`}
                                    >
                                        {k === i && <motion.span layoutId="hero-tab" className="absolute inset-0 rounded-sm bg-[#ecebe6]/[0.07]" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                                        <span className="relative">{h.label}</span>
                                        {k === i && !touched && (
                                            <motion.span key={`p${i}`} className="absolute inset-x-1 bottom-0 h-px origin-left bg-[#e8b04a]" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 9, ease: 'linear' }} />
                                        )}
                                    </button>
                                ))}
                            </div>
                            {q && (
                                <span className="font-mono text-sm tabular-nums">
                                    <span className="text-[#ecebe6]">{fmtPrice(q.price)}</span>{' '}
                                    <span className={pctClass(q.changePercent)}>{fmtPct(q.changePercent, 2, true)}</span>
                                </span>
                            )}
                        </figcaption>
                        <div className="relative h-[300px] px-1 md:h-[360px]">
                            <AnimatePresence mode="wait">
                                <motion.div key={sym.s} className="absolute inset-0 px-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
                                    {history.length && bars.data?.symbol === sym.s ? <ForecastChart history={history} forecast={forecast} /> : bars.error ? <Unavailable className="flex h-full items-center justify-center" /> : <div className="h-full animate-pulse bg-[#ecebe6]/[0.03]" />}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                        <div className="flex flex-wrap gap-x-6 gap-y-1 border-t border-[#ecebe6]/10 px-4 py-3 font-mono text-[11px] text-[#ecebe6]/50">
                            <span><span className="mr-1.5 inline-block w-4 border-t-2 border-dashed border-[#e8b04a] align-middle" />ARIMA(5,1,0) · next 30 sessions</span>
                            <span><span className="mr-1.5 inline-block w-4 border-t border-dotted border-[#e8b04a] align-middle" />95% band</span>
                            {end && <span>Target {fmtPrice(end.value)} · range {fmtPrice(end.lower)}–{fmtPrice(end.upper)}</span>}
                        </div>
                    </figure>
                </Reveal>
            </Wrap>
        </section>
    )
}

// ------------------------------------------------------------
// Research credibility strip
// ------------------------------------------------------------

function ResearchStrip() {
    return (
        <section className="border-y border-[#ecebe6]/10 bg-[#0d0e11]">
            <Wrap className="flex flex-col gap-4 py-6 md:flex-row md:items-center md:gap-8">
                <div className="shrink-0 font-mono text-[11px] uppercase tracking-[0.14em] text-[#ecebe6]/45">Peer-reviewed at</div>
                <Stagger className="flex flex-1 flex-wrap gap-x-8 gap-y-3" gap={0.07}>
                    {VENUES.map((v) => (
                        <RevealItem key={v.venue}>
                            <Link href="/research" className="group block">
                                <span className="font-display text-lg text-[#ecebe6]/80 transition-colors group-hover:text-[#ecebe6]">{v.venue.replace(' International Workshop', '')}</span>
                                <span className="block text-xs text-[#ecebe6]/40 transition-colors group-hover:text-[#e8b04a]">{v.place}</span>
                            </Link>
                        </RevealItem>
                    ))}
                </Stagger>
                <Link href="/research" className="group inline-flex shrink-0 items-center gap-1 text-sm text-[#ecebe6]/70 hover:text-[#ecebe6]">
                    Our research <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
            </Wrap>
        </section>
    )
}

// ------------------------------------------------------------
// Two audiences: investors today (B2C), teams and institutions (B2B)
// ------------------------------------------------------------

const AUDIENCES = [
    {
        id: 'investors',
        kicker: 'For investors',
        title: <>Everything in the terminal, <em className="text-[#e8b04a]">free during beta.</em></>,
        points: ['Charts, indicators and drawing tools', 'The model’s forecast, score and anomalies on any symbol', 'Five-year backtests and headline sentiment', 'A dashboard and watchlist that sync to your account'],
        cta: { href: '/signup?next=/dashboard', label: 'Create a free account' },
        alt: { href: '/app', label: 'or just open the terminal' },
    },
    {
        id: 'teams',
        kicker: 'For teams & institutions',
        title: <>Bring the model to <em className="text-[#e8b04a]">your desk.</em></>,
        points: ['Research partnerships and joint studies', 'Model and backtest runs on your own universe of assets', 'Dashboards built around your team’s watchlists', 'Early access to data and API work as we build it'],
        cta: { href: '/contact?topic=business', label: 'Talk to the team' },
        alt: { href: '/research', label: 'see our research' },
    },
]

function Audiences() {
    return (
        <section className="py-16">
            <Wrap>
                <SectionHead kicker="Who it’s for" title={<>One platform, <em>two ways in.</em></>}>
                    Individual investors use UpTrade free today. Teams and institutions work with us directly.
                </SectionHead>
                <div className="grid gap-4 md:grid-cols-2">
                    {AUDIENCES.map((a, k) => (
                        <Reveal key={a.id} delay={k * 0.1}>
                            <div id={a.id} className="group relative h-full scroll-mt-32 overflow-hidden border border-[#ecebe6]/12 bg-[#0e0f12] p-8 transition-all duration-500 hover:-translate-y-1 hover:border-[#e8b04a]/45 hover:shadow-[0_30px_60px_-30px_rgba(232,176,74,0.25)]">
                                <span aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full border border-[#e8b04a]/0 transition-all duration-700 group-hover:-right-16 group-hover:-top-16 group-hover:border-[#e8b04a]/25" />
                                <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#e8b04a]">{a.kicker}</div>
                                <h3 className="mt-4 font-display text-4xl leading-tight">{a.title}</h3>
                                <ul className="mt-6 space-y-2.5">
                                    {a.points.map((p) => (
                                        <li key={p} className="flex gap-3 text-[15px] text-[#ecebe6]/70">
                                            <span className="mt-2.5 h-px w-4 shrink-0 bg-[#e8b04a] transition-all duration-300 group-hover:w-6" />{p}
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-8 flex flex-wrap items-center gap-4">
                                    <Link href={a.cta.href} className="group/btn relative inline-flex items-center gap-1.5 overflow-hidden rounded-md bg-[#ecebe6] px-4 py-2.5 text-sm font-semibold text-[#0a0b0d]">
                                        <span className="absolute inset-0 -translate-x-full bg-[#e8b04a] transition-transform duration-300 group-hover/btn:translate-x-0" />
                                        <span className="relative">{a.cta.label}</span>
                                        <ArrowRight className="relative h-4 w-4" />
                                    </Link>
                                    <Link href={a.alt.href} className="text-sm text-[#ecebe6]/55 underline-offset-4 hover:text-[#ecebe6] hover:underline">{a.alt.label}</Link>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </Wrap>
        </section>
    )
}

// ------------------------------------------------------------
// The terminal, as a real screenshot
// ------------------------------------------------------------

const CALLOUTS = [
    { n: '1', title: 'Forecast with its error band', text: 'The dashed line is the model’s 30-session path. The dotted fan is how wrong it could be.' },
    { n: '2', title: 'Unusual days, marked', text: 'Arrows flag 3σ price moves; dots flag volume spikes. Click through to see what happened.' },
    { n: '3', title: 'A score you can take apart', text: 'Technical, momentum, risk and forecast — each factor shown, none hidden behind one number.' },
]

function TerminalShowcase() {
    return (
        <section className="py-16">
            <Wrap>
                <SectionHead kicker="The terminal" title={<>Multi-pane charts, <em>with the model on top.</em></>} href="/app" cta="Open it" >
                    RSI and MACD panes, Heikin Ashi, trend lines, four-chart layouts, a live watchlist — and the forecast,
                    anomalies and score for whatever you’re looking at.
                </SectionHead>
                <Reveal className="group overflow-hidden border border-[#ecebe6]/12 bg-[#131722] transition-colors duration-500 hover:border-[#e8b04a]/40">
                    <Image src="/screens/terminal.webp" alt="UpTrade terminal showing NVIDIA daily candles with moving averages, the ARIMA forecast band, anomaly markers and the UpTrade score panel" width={1600} height={960} priority className="h-auto w-full transition-transform duration-700 group-hover:scale-[1.01]" />
                </Reveal>
                <ol className="mt-6 grid gap-6 md:grid-cols-3">
                    {CALLOUTS.map((c) => (
                        <li key={c.n} className="flex gap-3">
                            <span className="font-mono text-sm text-[#e8b04a]">{c.n}</span>
                            <div>
                                <div className="text-[15px] font-medium text-[#ecebe6]">{c.title}</div>
                                <p className="mt-1 text-sm leading-6 text-[#ecebe6]/55">{c.text}</p>
                            </div>
                        </li>
                    ))}
                </ol>
            </Wrap>
        </section>
    )
}

// ------------------------------------------------------------
// Market summary (TradingView-style tabs, our own layout)
// ------------------------------------------------------------

const TABS = {
    Indices: ['^GSPC', '^NDX', '^DJI', '^RUT', '^VIX', '^FTSE'],
    Stocks: ['AAPL', 'NVDA', 'MSFT', 'AMZN', 'TSLA', 'META'],
    Crypto: ['BTC-USD', 'ETH-USD', 'SOL-USD', 'XRP-USD', 'DOGE-USD', 'ADA-USD'],
    ETFs: ['SPY', 'QQQ', 'IWM', 'GLD', 'TLT', 'ARKK'],
} as const
type Tab = keyof typeof TABS

function MarketSummary() {
    const [tab, setTab] = useState<Tab>('Indices')
    const { data, error } = useApi<{ items: OverviewItem[] }>(`/api/market/overview?symbols=${encodeURIComponent(TABS[tab].join(','))}`, 60000)
    return (
        <section className="py-16">
            <Wrap>
                <SectionHead kicker="Markets today" title="Where things stand." href="/markets" cta="Heatmap & movers" />
                <div className="mb-2 flex gap-6 border-b border-[#ecebe6]/10" role="tablist">
                    {(Object.keys(TABS) as Tab[]).map((t) => (
                        <button
                            key={t}
                            role="tab"
                            aria-selected={tab === t}
                            onClick={() => setTab(t)}
                            className={`-mb-px border-b-2 pb-3 text-sm transition-colors ${tab === t ? 'border-[#e8b04a] text-[#ecebe6]' : 'border-transparent text-[#ecebe6]/50 hover:text-[#ecebe6]'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3">
                    {(data?.items ?? []).map((it) => {
                        const q = it.quote
                        return (
                            <Link key={it.symbol} href={`/app?symbol=${encodeURIComponent(it.symbol)}`} className="grid grid-cols-[1fr_96px] items-center gap-4 border-b border-[#ecebe6]/8 py-4 pr-4 hover:bg-[#ecebe6]/[0.03]">
                                <div className="min-w-0">
                                    <div className="truncate text-[15px] text-[#ecebe6]">{q.name}</div>
                                    <div className="mt-1 font-mono text-sm tabular-nums">
                                        <span className="text-[#ecebe6]/85">{fmtPrice(q.price)}</span>{' '}
                                        <span className={pctClass(q.changePercent)}>{fmtPct(q.changePercent, 2, true)}</span>
                                    </div>
                                </div>
                                <Sparkline points={it.spark} up={it.spark.length > 1 && it.spark[it.spark.length - 1].value >= it.spark[0].value} className="h-10 w-full" />
                            </Link>
                        )
                    })}
                    {!data && !error && TABS[tab].map((s) => <div key={s} className="h-[76px] animate-pulse border-b border-[#ecebe6]/8 bg-[#ecebe6]/[0.02]" />)}
                    {!data && error && <Unavailable className="py-4" />}
                </div>
            </Wrap>
        </section>
    )
}

// ------------------------------------------------------------
// Receipts: our own backtest, including where we lose
// ------------------------------------------------------------

function Receipts() {
    const arima = useApi<{ result: BacktestResult }>('/api/model/backtest?symbol=SPY&strategy=arima')
    const sma = useApi<{ result: BacktestResult }>('/api/model/backtest?symbol=SPY&strategy=sma_cross')
    const a = arima.data?.result
    // Rebase the SMA run onto the ARIMA window (ARIMA needs a longer warm-up) so all three lines share a start
    const s = useMemo(() => {
        const r = sma.data?.result
        if (!r || !a) return null
        const pts = r.equity.filter((p) => p.time >= a.start)
        if (pts.length < 2) return null
        const base = pts[0].value
        const eq = pts.map((p) => ({ time: p.time, value: p.value / base }))
        const rets = eq.slice(1).map((p, i) => p.value / eq[i].value - 1)
        const m = rets.reduce((x, y) => x + y, 0) / rets.length
        const sd = Math.sqrt(rets.reduce((x, y) => x + (y - m) ** 2, 0) / (rets.length - 1))
        let peak = 0, dd = 0
        for (const p of eq) { peak = Math.max(peak, p.value); dd = Math.min(dd, p.value / peak - 1) }
        return { equity: eq, totalReturn: eq[eq.length - 1].value - 1, maxDrawdown: dd, sharpe: sd ? (m / sd) * Math.sqrt(252) : 0 }
    }, [sma.data, a])
    const series = useMemo(() => (a && s ? [
        { color: 'rgba(236,235,230,0.45)', width: 2 as const, points: a.buyHold },
        { color: '#6ea8ff', width: 2 as const, points: s.equity },
        { color: AMBER, width: 3 as const, points: a.equity },
    ] : []), [a, s])

    const rows = a && s ? [
        { name: 'Buy & hold SPY', color: 'rgba(236,235,230,0.45)', total: a.buyHoldReturn, dd: null as number | null, sharpe: null as number | null },
        { name: 'SMA 50/200 trend', color: '#6ea8ff', total: s.totalReturn, dd: s.maxDrawdown, sharpe: s.sharpe },
        { name: 'UpTrade ARIMA', color: AMBER, total: a.totalReturn, dd: a.maxDrawdown, sharpe: a.sharpe },
    ] : []
    const lost = a ? a.totalReturn < a.buyHoldReturn : false
    const failed = !series.length && !!(arima.error || sma.error)

    return (
        <section className="py-16">
            <Wrap>
                <SectionHead
                    kicker="Receipts"
                    title={lost ? <>Our model lost to buy-and-hold. <em>We show it anyway.</em></> : <>Our model’s own backtest, <em>published.</em></>}
                >
                    Most trading sites show their best backtest. This is ours on the S&amp;P 500 ETF since {a ? new Date(a.start * 1000).getFullYear() : '…'}: long or flat,
                    signals at the close, filled on the next bar, 10 bps per trade. Run the same test on any symbol in the terminal.
                </SectionHead>
                <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
                    <div className="h-[320px] border border-[#ecebe6]/12 bg-[#0e0f12] p-2 md:h-[380px]">
                        {series.length ? <EquityChart series={series} /> : failed ? <Unavailable className="flex h-full items-center justify-center" /> : <div className="h-full animate-pulse bg-[#ecebe6]/[0.03]" />}
                    </div>
                    <div>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-[#ecebe6]/15 text-left font-mono text-[11px] uppercase tracking-wider text-[#ecebe6]/45">
                                    <th className="py-2 font-normal">Strategy</th>
                                    <th className="py-2 text-right font-normal">Return</th>
                                    <th className="py-2 text-right font-normal">Max DD</th>
                                    <th className="py-2 text-right font-normal">Sharpe</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((r) => (
                                    <tr key={r.name} className="border-b border-[#ecebe6]/8">
                                        <td className="py-3 text-[#ecebe6]"><span className="mr-2 inline-block h-2 w-2" style={{ background: r.color }} />{r.name}</td>
                                        <td className={`py-3 text-right font-mono tabular-nums ${pctClass(r.total)}`}>{fmtPct(r.total, 1)}</td>
                                        <td className="py-3 text-right font-mono tabular-nums text-[#ecebe6]/70">{r.dd == null ? '—' : fmtPct(r.dd, 1)}</td>
                                        <td className="py-3 text-right font-mono tabular-nums text-[#ecebe6]/70">{r.sharpe == null ? '—' : r.sharpe.toFixed(2)}</td>
                                    </tr>
                                ))}
                                {!rows.length && !failed && Array.from({ length: 3 }).map((_, i) => <tr key={i}><td colSpan={4} className="py-3"><div className="h-4 animate-pulse bg-[#ecebe6]/[0.05]" /></td></tr>)}
                            </tbody>
                        </table>
                        <p className="mt-5 text-sm leading-6 text-[#ecebe6]/55">
                            A short-horizon ARIMA has little edge on a trending index — the backtest says so, and the forecast band in
                            the terminal is wide for the same reason. We’d rather you know that before you trust a signal.
                        </p>
                        <Link href="/app/tradex" className="mt-5 inline-flex items-center gap-1 text-sm text-[#ecebe6]/75 underline-offset-4 hover:text-[#ecebe6] hover:underline">
                            Run a backtest <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                </div>
            </Wrap>
        </section>
    )
}

// ------------------------------------------------------------
// Model scan
// ------------------------------------------------------------

const SCAN = ['AAPL', 'MSFT', 'NVDA', 'AMZN', 'GOOGL', 'META', 'TSLA', 'AVGO', 'JPM', 'LLY', 'XOM', 'BTC-USD']

function ModelScan() {
    const { data, error } = useApi<{ items: ScanItem[] }>(`/api/model/scan?symbols=${encodeURIComponent(SCAN.join(','))}`)
    return (
        <section className="py-16">
            <Wrap>
                <SectionHead kicker="Model scan" title="Twelve large caps, ranked." href="/markets#scan" cta="Full scan">
                    The UpTrade score blends trend, momentum, volatility and the 30-session forecast. Recomputed from daily closes.
                </SectionHead>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[680px] text-sm">
                        <thead>
                            <tr className="border-b border-[#ecebe6]/15 text-left font-mono text-[11px] uppercase tracking-wider text-[#ecebe6]/45">
                                <th className="py-2 font-normal">#</th>
                                <th className="py-2 font-normal">Symbol</th>
                                <th className="py-2 text-right font-normal">Price</th>
                                <th className="py-2 text-right font-normal">Today</th>
                                <th className="py-2 text-right font-normal">3 months</th>
                                <th className="py-2 pl-6 font-normal">Score</th>
                                <th className="py-2 font-normal">30-day signal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.items.map((r, i) => (
                                <tr key={r.symbol} className="border-b border-[#ecebe6]/8 hover:bg-[#ecebe6]/[0.03]">
                                    <td className="py-3 font-mono text-[#ecebe6]/40">{String(i + 1).padStart(2, '0')}</td>
                                    <td className="py-3">
                                        <Link href={`/app?symbol=${encodeURIComponent(r.symbol)}`} className="text-[#ecebe6] hover:underline">
                                            {displaySymbol(r.symbol)} <span className="hidden text-[#ecebe6]/40 md:inline">{r.name}</span>
                                        </Link>
                                    </td>
                                    <td className="py-3 text-right font-mono tabular-nums text-[#ecebe6]">{fmtPrice(r.price)}</td>
                                    <td className={`py-3 text-right font-mono tabular-nums ${pctClass(r.changePercent)}`}>{fmtPct(r.changePercent, 2, true)}</td>
                                    <td className={`py-3 text-right font-mono tabular-nums ${pctClass(r.return3M)}`}>{fmtPct(r.return3M, 1)}</td>
                                    <td className="py-3 pl-6">
                                        <span className="flex items-center gap-3">
                                            <span className="w-7 font-mono tabular-nums text-[#ecebe6]">{r.score}</span>
                                            <span className="h-[3px] w-24 bg-[#ecebe6]/10"><span className="block h-full" style={{ width: `${r.score}%`, background: r.stance === 'Bullish' ? UP : r.stance === 'Bearish' ? DOWN : AMBER }} /></span>
                                        </span>
                                    </td>
                                    <td className="py-3 text-[#ecebe6]/70">{r.signal} <span className="font-mono text-[#ecebe6]/40">{fmtPct(r.projectedChangePct, 1, true)}</span></td>
                                </tr>
                            ))}
                            {!data && !error && Array.from({ length: 6 }).map((_, i) => <tr key={i}><td colSpan={7} className="py-3"><div className="h-4 animate-pulse bg-[#ecebe6]/[0.05]" /></td></tr>)}
                            {!data && error && <tr><td colSpan={7} className="py-4"><Unavailable /></td></tr>}
                        </tbody>
                    </table>
                </div>
                <p className="mt-3 font-mono text-[11px] text-[#ecebe6]/40">Model output for research only. Not financial advice.</p>
            </Wrap>
        </section>
    )
}

// ------------------------------------------------------------
// More screens + news
// ------------------------------------------------------------

function MoreScreens() {
    return (
        <section className="py-16">
            <Wrap>
                <SectionHead kicker="Also inside" title="A heatmap and a strategy tester." />
                <div className="grid gap-8 md:grid-cols-2">
                    {[
                        { src: '/screens/markets.webp', w: 1600, h: 1889, alt: 'UpTrade markets page with index cards and a large-cap sector heatmap', title: 'Markets', text: 'Indices, a sector heatmap coloured by today’s move, gainers and losers.', href: '/markets' },
                        { src: '/screens/backtest.webp', w: 1600, h: 960, alt: 'UpTrade terminal with the strategy tester open, showing an equity curve against buy and hold', title: 'Strategy tester', text: 'Four strategies on five years of data, with fees. The equity curve sits next to buy-and-hold.', href: '/app/tradex' },
                    ].map((s) => (
                        <Link key={s.src} href={s.href} className="group block">
                            <div className="aspect-[16/10] overflow-hidden border border-[#ecebe6]/12 bg-[#131722]">
                                <Image src={s.src} alt={s.alt} width={s.w} height={s.h} className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]" />
                            </div>
                            <div className="mt-4 flex items-baseline justify-between gap-4">
                                <div>
                                    <div className="text-[15px] text-[#ecebe6]">{s.title}</div>
                                    <p className="mt-1 text-sm text-[#ecebe6]/55">{s.text}</p>
                                </div>
                                <ArrowUpRight className="h-4 w-4 shrink-0 text-[#ecebe6]/50 group-hover:text-[#ecebe6]" />
                            </div>
                        </Link>
                    ))}
                </div>
            </Wrap>
        </section>
    )
}

type NewsResp = { items: { title: string; publisher: string; link: string; time: number; label: string }[] }

function Headlines() {
    const { data, error } = useApi<NewsResp>('/api/model/sentiment?symbol=SPY', 300000)
    const ago = (t: number) => {
        const s = Date.now() / 1000 - t
        return s < 3600 ? `${Math.max(1, Math.round(s / 60))}m` : s < 86400 ? `${Math.round(s / 3600)}h` : `${Math.round(s / 86400)}d`
    }
    return (
        <section className="py-16">
            <Wrap>
                <SectionHead kicker="Headlines" title="What the market is reading." href="/app/visualx" cta="Sentiment by ticker" />
                <ul className="grid md:grid-cols-2 md:gap-x-10">
                    {(data?.items ?? []).slice(0, 8).map((n, i) => (
                        <li key={i} className="border-b border-[#ecebe6]/8">
                            <a href={n.link} target="_blank" rel="noopener noreferrer" className="flex gap-4 py-4 hover:bg-[#ecebe6]/[0.03]">
                                <span className="w-8 shrink-0 font-mono text-xs text-[#ecebe6]/40">{ago(n.time)}</span>
                                <span className="flex-1">
                                    <span className="text-[15px] leading-6 text-[#ecebe6]">{n.title}</span>
                                    <span className="mt-1 flex items-center gap-2 text-xs text-[#ecebe6]/45">
                                        <span className="h-1.5 w-1.5" style={{ background: n.label === 'positive' ? UP : n.label === 'negative' ? DOWN : 'rgba(236,235,230,0.3)' }} />
                                        {n.publisher}
                                    </span>
                                </span>
                            </a>
                        </li>
                    ))}
                    {!data && !error && Array.from({ length: 6 }).map((_, i) => <li key={i} className="h-20 animate-pulse border-b border-[#ecebe6]/8 bg-[#ecebe6]/[0.02]" />)}
                    {!data && error && <li className="py-4"><Unavailable /></li>}
                </ul>
            </Wrap>
        </section>
    )
}

function Closing() {
    return (
        <section className="py-20">
            <Wrap>
                <div className="border-t border-[#ecebe6]/15 pt-10 md:flex md:items-end md:justify-between">
                    <h2 className="font-display text-5xl leading-[1.02] text-[#ecebe6] md:text-6xl">
                        Open a chart. <em className="text-[#e8b04a]">Check the model.</em>
                    </h2>
                    <div className="mt-6 md:mt-0">
                        <Link href="/app" className="rounded-md bg-[#ecebe6] px-5 py-3 text-sm font-semibold text-[#0a0b0d] hover:bg-white">Open the terminal</Link>
                        <p className="mt-3 text-xs text-[#ecebe6]/45">Free. No card. Sign up only to sync your watchlist.</p>
                    </div>
                </div>
            </Wrap>
        </section>
    )
}

export function Home() {
    return (
        <div className="bg-[#0a0b0d] text-[#ecebe6]" style={{ color: PAPER }}>
            <Hero />
            <ResearchStrip />
            <TerminalShowcase />
            <Audiences />
            <MarketSummary />
            <Receipts />
            <ModelScan />
            <MoreScreens />
            <Headlines />
            <Closing />
        </div>
    )
}

