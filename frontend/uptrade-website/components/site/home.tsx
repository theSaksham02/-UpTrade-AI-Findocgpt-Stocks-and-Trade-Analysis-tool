'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Brain, CandlestickChart, FlaskConical, Newspaper } from 'lucide-react'
import type { BarsResponse } from '@/lib/market/types'
import { displaySymbol, fmtPct, fmtPrice, useApi } from '@/components/uptrade-terminal/hooks'
import { HeroChart, QuoteCard, SkeletonCard, type OverviewItem, type ScanItem } from './market-widgets'

const TABS = {
    Indices: ['^GSPC', '^NDX', '^DJI', '^RUT', '^VIX', '^FTSE'],
    Stocks: ['AAPL', 'NVDA', 'MSFT', 'AMZN', 'TSLA', 'META'],
    Crypto: ['BTC-USD', 'ETH-USD', 'SOL-USD', 'XRP-USD', 'DOGE-USD', 'ADA-USD'],
    ETFs: ['SPY', 'QQQ', 'IWM', 'GLD', 'TLT', 'ARKK'],
} as const
type Tab = keyof typeof TABS

const SCAN = ['AAPL', 'MSFT', 'NVDA', 'AMZN', 'GOOGL', 'META', 'TSLA', 'AVGO', 'JPM', 'LLY', 'XOM', 'BTC-USD']

const STANCE_STYLE: Record<ScanItem['stance'], string> = {
    Bullish: 'bg-green-500/10 text-green-400',
    Neutral: 'bg-amber-500/10 text-amber-300',
    Bearish: 'bg-red-500/10 text-red-400',
}

function SectionHeading({ title, href, cta }: { title: string; href?: string; cta?: string }) {
    return (
        <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="font-display text-2xl font-bold tracking-tight text-white md:text-3xl">{title}</h2>
            {href && (
                <Link href={href} className="group flex shrink-0 items-center gap-1 text-sm font-medium text-white/60 hover:text-white">
                    {cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
            )}
        </div>
    )
}

function Hero() {
    const { data } = useApi<BarsResponse>('/api/market/bars?symbol=%5EGSPC&interval=1D')
    const points = useMemo(() => (data?.candles ?? []).slice(-252).map((c) => ({ time: c.time, value: c.close })), [data])
    const q = data?.quote
    const yr = points.length > 1 ? points[points.length - 1].value / points[0].value - 1 : null

    return (
        <section className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(41,98,255,0.22),transparent_70%)]" />
            <div className="relative mx-auto max-w-[1400px] px-4 pb-10 pt-16 md:px-6 md:pt-24">
                <div className="max-w-3xl">
                    <h1 className="font-display text-5xl font-bold leading-[1.02] tracking-tight text-white md:text-7xl">
                        Every market.<br />
                        <span className="bg-gradient-to-r from-[#5b8cff] to-[#22c55e] bg-clip-text text-transparent">One honest model.</span>
                    </h1>
                    <p className="mt-6 max-w-xl text-lg leading-8 text-white/60">
                        Live charts, a transparent forecasting model and backtests you can check yourself — free, in your browser.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link href="/app" className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-white/90">
                            Open the terminal
                        </Link>
                        <Link href="/markets" className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white hover:bg-white/[0.06]">
                            Explore markets
                        </Link>
                    </div>
                </div>

                <div className="relative mt-12 h-[300px] rounded-3xl border border-white/[0.08] bg-white/[0.02] p-2 md:h-[420px]">
                    <div className="absolute left-5 top-4 z-10">
                        <div className="text-sm font-semibold text-white">S&amp;P 500 <span className="font-normal text-white/40">· 1Y</span></div>
                        {q && (
                            <div className="mt-1 flex items-baseline gap-2 font-mono tabular-nums">
                                <span className="text-2xl font-medium text-white">{fmtPrice(q.price)}</span>
                                <span className={q.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}>{fmtPct(q.changePercent, 2, true)}<span className="hidden sm:inline"> today</span></span>
                                {yr != null && <span className="hidden text-white/40 sm:inline">{fmtPct(yr, 1)} 1Y</span>}
                            </div>
                        )}
                    </div>
                    {points.length ? <HeroChart points={points} /> : <div className="h-full w-full animate-pulse rounded-2xl bg-white/[0.02]" />}
                </div>
            </div>
        </section>
    )
}

function MarketSummary() {
    const [tab, setTab] = useState<Tab>('Indices')
    const { data } = useApi<{ items: OverviewItem[] }>(`/api/market/overview?symbols=${encodeURIComponent(TABS[tab].join(','))}`, 60000)
    return (
        <section className="mx-auto max-w-[1400px] px-4 py-14 md:px-6">
            <SectionHeading title="Market summary" href="/markets" cta="See all markets" />
            <div className="mb-5 flex gap-2 overflow-x-auto" role="tablist">
                {(Object.keys(TABS) as Tab[]).map((t) => (
                    <button
                        key={t}
                        role="tab"
                        aria-selected={tab === t}
                        onClick={() => setTab(t)}
                        className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${tab === t ? 'bg-white text-black' : 'bg-white/[0.06] text-white/70 hover:bg-white/[0.1] hover:text-white'}`}
                    >
                        {t}
                    </button>
                ))}
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                {data?.items?.length
                    ? data.items.map((it) => <QuoteCard key={it.symbol} item={it} />)
                    : TABS[tab].map((s) => <SkeletonCard key={s} />)}
            </div>
        </section>
    )
}

function ModelScan() {
    const { data, error } = useApi<{ items: ScanItem[]; disclaimer: string }>(`/api/model/scan?symbols=${encodeURIComponent(SCAN.join(','))}`)
    return (
        <section className="mx-auto max-w-[1400px] px-4 py-14 md:px-6">
            <SectionHeading title="UpTrade model scan" href="/markets#scan" cta="Full scan" />
            <p className="-mt-3 mb-6 max-w-2xl text-sm text-white/50">
                Large caps ranked by the UpTrade score: technical trend, momentum, volatility and a 30-session ARIMA forecast, recomputed from daily data.
            </p>
            <div className="overflow-x-auto rounded-2xl border border-white/[0.08]">
                <table className="w-full min-w-[720px] text-sm">
                    <thead>
                        <tr className="border-b border-white/[0.08] text-left text-xs uppercase tracking-wide text-white/40">
                            <th className="px-4 py-3 font-medium">Symbol</th>
                            <th className="px-4 py-3 text-right font-medium">Price</th>
                            <th className="px-4 py-3 text-right font-medium">Today</th>
                            <th className="px-4 py-3 text-right font-medium">3M</th>
                            <th className="px-4 py-3 font-medium">Score</th>
                            <th className="px-4 py-3 font-medium">Stance</th>
                            <th className="px-4 py-3 font-medium">30-day signal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.items.map((r) => (
                            <tr key={r.symbol} className="border-b border-white/[0.05] last:border-0 hover:bg-white/[0.03]">
                                <td className="px-4 py-3">
                                    <Link href={`/app?symbol=${encodeURIComponent(r.symbol)}`} className="block">
                                        <span className="font-semibold text-white">{displaySymbol(r.symbol)}</span>
                                        <span className="ml-2 hidden text-white/40 md:inline">{r.name}</span>
                                    </Link>
                                </td>
                                <td className="px-4 py-3 text-right font-mono tabular-nums text-white">{fmtPrice(r.price)}</td>
                                <td className={`px-4 py-3 text-right font-mono tabular-nums ${r.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>{fmtPct(r.changePercent, 2, true)}</td>
                                <td className={`px-4 py-3 text-right font-mono tabular-nums ${r.return3M >= 0 ? 'text-green-400' : 'text-red-400'}`}>{fmtPct(r.return3M, 1)}</td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/10">
                                            <div className="h-full rounded-full bg-[#5b8cff]" style={{ width: `${r.score}%` }} />
                                        </div>
                                        <span className="font-mono tabular-nums text-white">{r.score}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3"><span className={`rounded-md px-2 py-0.5 text-xs font-medium ${STANCE_STYLE[r.stance]}`}>{r.stance}</span></td>
                                <td className="px-4 py-3 text-white/70">{r.signal} <span className="font-mono text-white/40">({fmtPct(r.projectedChangePct, 1, true)})</span></td>
                            </tr>
                        ))}
                        {!data && !error && Array.from({ length: 6 }).map((_, i) => (
                            <tr key={i} className="border-b border-white/[0.05]"><td colSpan={7} className="px-4 py-4"><div className="h-4 animate-pulse rounded bg-white/[0.05]" /></td></tr>
                        ))}
                        {error && <tr><td colSpan={7} className="px-4 py-6 text-center text-white/50">Couldn’t run the scan right now.</td></tr>}
                    </tbody>
                </table>
            </div>
            <p className="mt-3 text-xs text-white/40">{data?.disclaimer ?? 'Model output for research only. Not financial advice.'}</p>
        </section>
    )
}

type NewsResp = { model: string; overall: number; items: { title: string; publisher: string; link: string; time: number; label: string }[] }

function TopStories() {
    const { data } = useApi<NewsResp>('/api/model/sentiment?symbol=SPY', 300000)
    const ago = (t: number) => {
        const s = Date.now() / 1000 - t
        return s < 3600 ? `${Math.max(1, Math.round(s / 60))}m ago` : s < 86400 ? `${Math.round(s / 3600)}h ago` : `${Math.round(s / 86400)}d ago`
    }
    return (
        <section className="mx-auto max-w-[1400px] px-4 py-14 md:px-6">
            <SectionHeading title="Top stories" href="/app/visualx" cta="Sentiment by ticker" />
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {(data?.items ?? []).slice(0, 9).map((n, i) => (
                    <a key={i} href={n.link} target="_blank" rel="noopener noreferrer" className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 transition-colors hover:border-white/20 hover:bg-white/[0.05]">
                        <span className="text-[15px] font-medium leading-6 text-white">{n.title}</span>
                        <span className="mt-3 flex items-center gap-2 text-xs text-white/40">
                            <span className={`h-1.5 w-1.5 rounded-full ${n.label === 'positive' ? 'bg-green-400' : n.label === 'negative' ? 'bg-red-400' : 'bg-white/30'}`} />
                            {n.publisher} · {ago(n.time)}
                        </span>
                    </a>
                ))}
                {!data && Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-28 animate-pulse rounded-2xl bg-white/[0.03]" />)}
            </div>
        </section>
    )
}

const FEATURES = [
    { Icon: CandlestickChart, title: 'Terminal', text: 'Multi-pane charts from 5-minute to monthly bars, RSI and MACD panes, Bollinger Bands, trend lines and 4-chart layouts.', href: '/app', cta: 'Open terminal' },
    { Icon: Brain, title: 'Open forecasting model', text: 'ARIMA(5,1,0) with a 95% confidence band, plus anomaly detection and a composite score. Every input is shown.', href: '/app', cta: 'See it on a chart' },
    { Icon: FlaskConical, title: 'Strategy tester', text: 'Backtest the model against SMA, MACD and RSI strategies on five years of daily data, with fees and next-bar fills.', href: '/app/tradex', cta: 'Run a backtest' },
    { Icon: Newspaper, title: 'Headline sentiment', text: 'Scores the latest headlines for any ticker and shows at a glance whether the news is leaning positive or negative.', href: '/app/visualx', cta: 'Read the news' },
]

function Features() {
    return (
        <section className="mx-auto max-w-[1400px] px-4 py-14 md:px-6">
            <SectionHeading title="Built for people who check the work" />
            <div className="grid gap-3 md:grid-cols-2">
                {FEATURES.map(({ Icon, title, text, href, cta }) => (
                    <Link key={title} href={href} className="group rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-transparent p-7 transition-colors hover:border-white/20">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#2962ff]/15 text-[#7da2ff]"><Icon className="h-5 w-5" /></span>
                        <h3 className="mt-5 font-display text-xl font-semibold text-white">{title}</h3>
                        <p className="mt-2 max-w-md text-sm leading-6 text-white/55">{text}</p>
                        <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-white/80 group-hover:text-white">
                            {cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    )
}

function CallToAction() {
    return (
        <section className="mx-auto max-w-[1400px] px-4 pb-20 pt-6 md:px-6">
            <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0d1220] px-6 py-14 text-center md:py-20">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_80%_at_50%_100%,rgba(41,98,255,0.35),transparent_70%)]" />
                <h2 className="relative font-display text-3xl font-bold tracking-tight text-white md:text-5xl">Start with a chart. Stay for the model.</h2>
                <p className="relative mx-auto mt-4 max-w-lg text-white/60">No download and no card needed. Your watchlist and layout are saved as you go.</p>
                <Link href="/app" className="relative mt-8 inline-block rounded-full bg-white px-7 py-3 text-sm font-semibold text-black hover:bg-white/90">
                    Open the terminal
                </Link>
            </div>
        </section>
    )
}

export function Home() {
    return (
        <div className="bg-[#07080c] text-white">
            <Hero />
            <MarketSummary />
            <ModelScan />
            <TopStories />
            <Features />
            <CallToAction />
        </div>
    )
}

