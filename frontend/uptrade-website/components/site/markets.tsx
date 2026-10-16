'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import type { Quote } from '@/lib/market/types'
import { displaySymbol, fmtPct, fmtPrice, useApi, useQuotes } from '@/components/uptrade-terminal/hooks'
import { QuoteCard, SkeletonCard, type OverviewItem, type ScanItem } from './market-widgets'

const INDICES = ['^GSPC', '^NDX', '^DJI', '^RUT', '^VIX', 'BTC-USD']

// Equal-weight sectors (no market-cap feed) — tiles are sized by sector, coloured by today's move
const SECTORS: { name: string; symbols: string[] }[] = [
    { name: 'Technology', symbols: ['AAPL', 'MSFT', 'NVDA', 'AVGO', 'ORCL', 'AMD', 'CRM', 'ADBE'] },
    { name: 'Communication', symbols: ['GOOGL', 'META', 'NFLX', 'DIS'] },
    { name: 'Consumer', symbols: ['AMZN', 'TSLA', 'HD', 'MCD', 'COST', 'WMT', 'NKE'] },
    { name: 'Financials', symbols: ['JPM', 'V', 'MA', 'BAC', 'GS'] },
    { name: 'Health care', symbols: ['LLY', 'UNH', 'JNJ', 'MRK', 'ABBV'] },
    { name: 'Industrials', symbols: ['CAT', 'GE', 'BA'] },
    { name: 'Energy', symbols: ['XOM', 'CVX'] },
]
const UNIVERSE = SECTORS.flatMap((s) => s.symbols)
const CRYPTO = ['BTC-USD', 'ETH-USD', 'SOL-USD', 'XRP-USD', 'BNB-USD', 'DOGE-USD', 'ADA-USD', 'AVAX-USD']
const SCAN = ['AAPL', 'MSFT', 'NVDA', 'AMZN', 'GOOGL', 'META', 'TSLA', 'AVGO', 'JPM', 'LLY', 'XOM', 'COST', 'NFLX', 'AMD', 'BTC-USD', 'ETH-USD']

// Diverging scale: red ← grey → green, saturating at ±3%
function heatColor(pct: number) {
    const t = Math.max(-1, Math.min(1, pct / 3))
    if (Math.abs(t) < 0.04) return '#2a2e39'
    const [r, g, b] = t > 0 ? [22, 163, 74] : [220, 38, 38]
    const a = 0.25 + 0.75 * Math.abs(t)
    return `rgba(${r},${g},${b},${a.toFixed(2)})`
}

function Heatmap({ quotes }: { quotes: Record<string, Quote> }) {
    return (
        <div className="grid grid-cols-2 gap-1 md:grid-cols-4 lg:grid-cols-6">
            {SECTORS.map((sec) => (
                <div key={sec.name} className={`flex flex-col gap-1 rounded-xl bg-white/[0.02] p-1 ${sec.symbols.length >= 4 ? 'col-span-2' : ''}`}>
                    <div className="px-1.5 pt-1 text-[11px] font-semibold uppercase tracking-wide text-white/50">{sec.name}</div>
                    <div className="grid flex-1 grid-cols-[repeat(auto-fill,minmax(68px,1fr))] gap-1">
                        {sec.symbols.map((s) => {
                            const q = quotes[s]
                            return (
                                <Link
                                    key={s}
                                    href={`/app?symbol=${s}`}
                                    title={q ? `${q.name}: ${fmtPrice(q.price)} (${fmtPct(q.changePercent, 2, true)})` : s}
                                    className="flex min-h-[60px] flex-col items-center justify-center rounded-md px-1 text-center transition-[filter] hover:brightness-125"
                                    style={{ background: q ? heatColor(q.changePercent) : 'rgba(255,255,255,0.04)' }}
                                >
                                    <span className="text-sm font-semibold text-white">{s}</span>
                                    <span className="font-mono text-xs text-white/85">{q ? fmtPct(q.changePercent, 2, true) : '…'}</span>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            ))}
        </div>
    )
}

function MoverList({ title, rows }: { title: string; rows: Quote[] }) {
    return (
        <div className="rounded-md border border-white/[0.08]">
            <h3 className="border-b border-white/[0.08] px-4 py-3 text-sm font-medium text-white">{title}</h3>
            <ul>
                {rows.map((q) => (
                    <li key={q.symbol}>
                        <Link href={`/app?symbol=${encodeURIComponent(q.symbol)}`} className="flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-white/[0.03]">
                            <span className="min-w-0">
                                <span className="font-semibold text-white">{displaySymbol(q.symbol)}</span>
                                <span className="ml-2 hidden truncate text-sm text-white/40 sm:inline">{q.name}</span>
                            </span>
                            <span className="flex shrink-0 items-center gap-3 font-mono text-sm tabular-nums">
                                <span className="text-white/80">{fmtPrice(q.price)}</span>
                                <span className={`w-16 text-right ${q.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>{fmtPct(q.changePercent, 2, true)}</span>
                            </span>
                        </Link>
                    </li>
                ))}
                {!rows.length && Array.from({ length: 5 }).map((_, i) => <li key={i} className="mx-4 my-3 h-4 animate-pulse rounded bg-white/[0.05]" />)}
            </ul>
        </div>
    )
}

export function Markets() {
    const indices = useApi<{ items: OverviewItem[] }>(`/api/market/overview?symbols=${encodeURIComponent(INDICES.join(','))}`, 60000)
    const quotes = useQuotes(UNIVERSE, 30000)
    const crypto = useQuotes(CRYPTO, 30000)
    const scan = useApi<{ items: ScanItem[]; disclaimer: string }>(`/api/model/scan?symbols=${encodeURIComponent(SCAN.join(','))}`)

    const sorted = useMemo(() => Object.values(quotes).sort((a, b) => b.changePercent - a.changePercent), [quotes])
    const breadth = sorted.length ? sorted.filter((q) => q.changePercent > 0).length / sorted.length : null

    return (
        <div className="min-h-screen bg-[#0a0b0d] text-white">
            <div className="mx-auto max-w-[1400px] px-4 pb-20 pt-10 md:px-6">
                <h1 className="font-display text-4xl font-normal md:text-5xl">Markets</h1>
                <p className="mt-3 max-w-2xl text-white/55">
                    Today’s moves across indices, large caps and crypto. Click any symbol to open it in the terminal.
                </p>

                <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                    {indices.data?.items?.length ? indices.data.items.map((it) => <QuoteCard key={it.symbol} item={it} />) : INDICES.map((s) => <SkeletonCard key={s} />)}
                </div>

                <section className="mt-14">
                    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                        <h2 className="font-display text-2xl font-normal md:text-3xl">Large-cap heatmap</h2>
                        {breadth != null && (
                            <div className="flex items-center gap-3 text-sm text-white/60">
                                <span>{Math.round(breadth * 100)}% advancing</span>
                                <div className="flex h-2 w-40 overflow-hidden rounded-full bg-red-500/70">
                                    <div className="h-full bg-green-500" style={{ width: `${breadth * 100}%` }} />
                                </div>
                            </div>
                        )}
                    </div>
                    <Heatmap quotes={quotes} />
                    <div className="mt-2 flex items-center justify-end gap-2 text-[11px] text-white/40">
                        <span>−3%</span>
                        <div className="h-2 w-40 rounded-full" style={{ background: `linear-gradient(90deg, ${heatColor(-3)}, ${heatColor(-1)}, #2a2e39, ${heatColor(1)}, ${heatColor(3)})` }} />
                        <span>+3%</span>
                    </div>
                </section>

                <section className="mt-14 grid gap-4 lg:grid-cols-3">
                    <MoverList title="Top gainers" rows={sorted.slice(0, 6)} />
                    <MoverList title="Top losers" rows={sorted.slice(-6).reverse()} />
                    <MoverList title="Crypto" rows={CRYPTO.flatMap((s) => (crypto[s] ? [crypto[s]] : []))} />
                </section>

                <section id="scan" className="mt-14 scroll-mt-24">
                    <h2 className="font-display text-2xl font-normal md:text-3xl">Model scan</h2>
                    <p className="mt-2 max-w-2xl text-sm text-white/50">Ranked by UpTrade score. The 30-day signal comes from the ARIMA forecast with the original Buy / Hold / Sell thresholds.</p>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {scan.data?.items.map((r) => (
                            <Link key={r.symbol} href={`/app?symbol=${encodeURIComponent(r.symbol)}`} className="rounded-md border border-white/[0.08] bg-white/[0.02] p-4 hover:border-white/20">
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold">{displaySymbol(r.symbol)}</span>
                                    <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${r.stance === 'Bullish' ? 'bg-green-500/10 text-green-400' : r.stance === 'Bearish' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-300'}`}>{r.stance}</span>
                                </div>
                                <div className="mt-3 flex items-end justify-between">
                                    <span className="font-display text-4xl font-normal">{r.score}</span>
                                    <span className="text-right text-xs text-white/50">{r.signal}<br /><span className="font-mono">{fmtPct(r.projectedChangePct, 1, true)} / 30d</span></span>
                                </div>
                                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-[#e8b04a]" style={{ width: `${r.score}%` }} /></div>
                            </Link>
                        ))}
                        {!scan.data && Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-36 animate-pulse rounded-md bg-white/[0.03]" />)}
                    </div>
                    <p className="mt-3 text-xs text-white/40">Model output for research only. Not financial advice.</p>
                </section>
            </div>
        </div>
    )
}
