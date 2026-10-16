'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Plus, X } from 'lucide-react'
import { displayName, useSession } from '@/components/auth/use-session'
import { useWatchlistSync, type SyncState } from '@/components/uptrade-terminal/use-watchlist-sync'
import { displaySymbol, fmtPct, fmtPrice, useApi, useLocalStorage } from '@/components/uptrade-terminal/hooks'
import SymbolSearch from '@/components/uptrade-terminal/symbol-search'
import { Sparkline, type OverviewItem, type ScanItem } from './market-widgets'
import { AMBER, DOWN, EquityChart, UP } from './charts'

// Same key as the terminal, so both pages share one watchlist
const DEFAULT_WATCHLIST = ['AAPL', 'MSFT', 'NVDA', 'TSLA', 'AMZN', 'GOOGL', 'META', 'SPY', 'QQQ', 'BTC-USD', 'ETH-USD']

const SYNC_NOTE: Record<SyncState, string> = {
    off: 'Saved in this browser',
    loading: 'Loading your account…',
    synced: 'Synced to your account',
    saving: 'Saving…',
    error: 'Couldn’t sync — changes kept in this browser',
}

const pctClass = (v: number) => (v >= 0 ? 'text-[#3fb97f]' : 'text-[#e5534b]')

function Stat({ label, value, sub, tone }: { label: string; value: React.ReactNode; sub?: React.ReactNode; tone?: string }) {
    return (
        <div className="border-t border-[#ecebe6]/15 pt-4">
            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#ecebe6]/45">{label}</div>
            <div className={`mt-2 font-display text-4xl leading-none ${tone ?? 'text-[#ecebe6]'}`}>{value}</div>
            {sub && <div className="mt-2 text-sm text-[#ecebe6]/55">{sub}</div>}
        </div>
    )
}

type NewsResp = { items: { title: string; publisher: string; link: string; time: number; label: string }[] }

function HoldingsNews({ symbols }: { symbols: string[] }) {
    // Headlines for the first two names on the list (each is one feed request)
    const a = useApi<NewsResp>(symbols[0] ? `/api/model/sentiment?symbol=${encodeURIComponent(symbols[0])}` : null, 300000)
    const b = useApi<NewsResp>(symbols[1] ? `/api/model/sentiment?symbol=${encodeURIComponent(symbols[1])}` : null, 300000)
    const items = useMemo(() => {
        const seen = new Set<string>()
        return [...(a.data?.items ?? []).map((n) => ({ ...n, sym: symbols[0] })), ...(b.data?.items ?? []).map((n) => ({ ...n, sym: symbols[1] }))]
            .filter((n) => (seen.has(n.title) ? false : (seen.add(n.title), true)))
            .sort((x, y) => y.time - x.time)
            .slice(0, 8)
    }, [a.data, b.data, symbols])
    const ago = (t: number) => {
        const s = Date.now() / 1000 - t
        return s < 3600 ? `${Math.max(1, Math.round(s / 60))}m` : s < 86400 ? `${Math.round(s / 3600)}h` : `${Math.round(s / 86400)}d`
    }
    return (
        <ul>
            {items.map((n, i) => (
                <li key={i} className="border-b border-[#ecebe6]/8">
                    <a href={n.link} target="_blank" rel="noopener noreferrer" className="flex gap-3 py-3 hover:bg-[#ecebe6]/[0.03]">
                        <span className="w-14 shrink-0 font-mono text-[11px] text-[#e8b04a]">{displaySymbol(n.sym)}</span>
                        <span className="flex-1 text-sm leading-6 text-[#ecebe6]">{n.title}</span>
                        <span className="w-7 shrink-0 text-right font-mono text-[11px] text-[#ecebe6]/40">{ago(n.time)}</span>
                    </a>
                </li>
            ))}
            {!a.data && symbols.length > 0 && Array.from({ length: 4 }).map((_, i) => <li key={i} className="my-3 h-5 animate-pulse bg-[#ecebe6]/[0.04]" />)}
            {a.data && !items.length && <li className="py-3 text-sm text-[#ecebe6]/50">No recent headlines.</li>}
        </ul>
    )
}

export function ClientDashboard() {
    const session = useSession()
    const [watchlist, setWatchlist] = useLocalStorage<string[]>('uptrade.watchlist', DEFAULT_WATCHLIST)
    const syncState = useWatchlistSync(session.user, watchlist, setWatchlist)
    const [searchOpen, setSearchOpen] = useState(false)

    // The overview and scan endpoints cap at 12 / 16 symbols
    const top = watchlist.slice(0, 12)
    const key = top.join(',')
    const overview = useApi<{ items: OverviewItem[] }>(key ? `/api/market/overview?symbols=${encodeURIComponent(key)}` : null, 60000)
    const scan = useApi<{ items: ScanItem[] }>(key ? `/api/model/scan?symbols=${encodeURIComponent(key)}` : null)

    const rows = useMemo(() => {
        const ov = new Map((overview.data?.items ?? []).map((i) => [i.symbol, i]))
        const sc = new Map((scan.data?.items ?? []).map((i) => [i.symbol, i]))
        return top.map((s) => ({ symbol: s, ov: ov.get(s.toUpperCase()), sc: sc.get(s.toUpperCase()) }))
    }, [overview.data, scan.data, key]) // eslint-disable-line react-hooks/exhaustive-deps

    const quoted = rows.filter((r) => r.ov)
    const advancing = quoted.filter((r) => r.ov!.quote.changePercent > 0).length
    const avgDay = quoted.length ? quoted.reduce((a, r) => a + r.ov!.quote.changePercent, 0) / quoted.length : null
    const sortedDay = [...quoted].sort((a, b) => b.ov!.quote.changePercent - a.ov!.quote.changePercent)
    const best = sortedDay[0], worst = sortedDay[sortedDay.length - 1]
    const bullish = (scan.data?.items ?? []).filter((i) => i.stance === 'Bullish').length

    // Equal-weight index of the watchlist over the sparkline window (~3 months)
    const basket = useMemo(() => {
        const series = (overview.data?.items ?? []).filter((i) => i.spark.length > 20 && i.quote.type !== 'INDEX')
        if (!series.length) return []
        const byTime = new Map<number, number[]>()
        for (const s of series) {
            const base = s.spark[0].value
            for (const p of s.spark) {
                const day = Math.floor(p.time / 86400) * 86400
                const arr = byTime.get(day) ?? []
                arr.push(p.value / base)
                byTime.set(day, arr)
            }
        }
        return [...byTime.entries()]
            .filter(([, v]) => v.length >= Math.ceil(series.length * 0.6))
            .sort((a, b) => a[0] - b[0])
            .map(([time, v]) => ({ time, value: v.reduce((x, y) => x + y, 0) / v.length }))
    }, [overview.data])
    const basketReturn = basket.length > 1 ? basket[basket.length - 1].value / basket[0].value - 1 : null

    const name = session.user ? displayName(session.user).split('@')[0] : null

    return (
        <div className="min-h-screen bg-[#0a0b0d] text-[#ecebe6]">
            <div className="mx-auto max-w-[1280px] px-5 pb-20 pt-10 md:px-8">
                {/* Heading */}
                <div className="flex flex-wrap items-end justify-between gap-6">
                    <div>
                        <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#ecebe6]/45">Dashboard</div>
                        <h1 className="mt-2 font-display text-5xl leading-none md:text-6xl">
                            {name ? <>Welcome back, <em className="text-[#e8b04a]">{name}.</em></> : <>Your <em className="text-[#e8b04a]">watchlist,</em> at a glance.</>}
                        </h1>
                        <p className="mt-3 text-sm text-[#ecebe6]/55">
                            {SYNC_NOTE[syncState]}
                            {!session.user && session.configured && !session.loading && (
                                <> · <Link href="/login?next=/dashboard" className="text-[#ecebe6] underline underline-offset-4">Sign in</Link> to keep it across devices</>
                            )}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSearchOpen(true)} className="inline-flex items-center gap-1.5 rounded-md border border-[#ecebe6]/15 px-4 py-2.5 text-sm hover:bg-[#ecebe6]/[0.05]">
                            <Plus className="h-4 w-4" /> Add symbol
                        </button>
                        <Link href="/app" className="rounded-md bg-[#ecebe6] px-4 py-2.5 text-sm font-semibold text-[#0a0b0d] hover:bg-white">Open terminal</Link>
                    </div>
                </div>

                {/* Summary */}
                <div className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
                    <Stat label="Advancing today" value={quoted.length ? `${advancing}/${quoted.length}` : '—'} sub={avgDay != null ? <>Average move <span className={pctClass(avgDay)}>{fmtPct(avgDay, 2, true)}</span></> : 'Loading quotes…'} />
                    <Stat label="Best today" value={best ? displaySymbol(best.symbol) : '—'} tone="text-[#3fb97f]" sub={best ? fmtPct(best.ov!.quote.changePercent, 2, true) : undefined} />
                    <Stat label="Worst today" value={worst && worst !== best ? displaySymbol(worst.symbol) : '—'} tone="text-[#e5534b]" sub={worst && worst !== best ? fmtPct(worst.ov!.quote.changePercent, 2, true) : undefined} />
                    <Stat label="Model: bullish" value={scan.data ? `${bullish}/${scan.data.items.length}` : '—'} sub={scan.data ? 'Names the UpTrade score rates bullish' : 'Running the model…'} />
                </div>

                <div className="mt-12 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
                    {/* Watchlist table */}
                    <section>
                        <h2 className="mb-3 font-display text-3xl">Watchlist</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[640px] text-sm">
                                <thead>
                                    <tr className="border-b border-[#ecebe6]/15 text-left font-mono text-[11px] uppercase tracking-wider text-[#ecebe6]/45">
                                        <th className="py-2 font-normal">Symbol</th>
                                        <th className="py-2 text-right font-normal">Price</th>
                                        <th className="py-2 pl-4 text-right font-normal">Today</th>
                                        <th className="py-2 pl-5 font-normal">3 months</th>
                                        <th className="py-2 font-normal">Score</th>
                                        <th className="py-2 font-normal">30-day</th>
                                        <th className="w-6" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map(({ symbol, ov, sc }) => (
                                        <tr key={symbol} className="group border-b border-[#ecebe6]/8 hover:bg-[#ecebe6]/[0.03]">
                                            <td className="py-3">
                                                <Link href={`/app?symbol=${encodeURIComponent(symbol)}`} className="hover:underline">
                                                    <span className="text-[#ecebe6]">{displaySymbol(symbol)}</span>
                                                    {ov && <span className="ml-2 hidden text-[#ecebe6]/40 xl:inline">{ov.quote.name}</span>}
                                                </Link>
                                            </td>
                                            <td className="py-3 text-right font-mono tabular-nums">{ov ? fmtPrice(ov.quote.price) : '…'}</td>
                                            <td className={`py-3 pl-4 text-right font-mono tabular-nums ${ov ? pctClass(ov.quote.changePercent) : ''}`}>{ov ? fmtPct(ov.quote.changePercent, 2, true) : ''}</td>
                                            <td className="py-3 pl-5">{ov && <Sparkline points={ov.spark} up={ov.spark[ov.spark.length - 1].value >= ov.spark[0].value} className="h-7 w-24" />}</td>
                                            <td className="py-3">
                                                {sc ? (
                                                    <span className="flex items-center gap-2">
                                                        <span className="w-6 font-mono tabular-nums">{sc.score}</span>
                                                        <span className="h-[3px] w-14 bg-[#ecebe6]/10"><span className="block h-full" style={{ width: `${sc.score}%`, background: sc.stance === 'Bullish' ? UP : sc.stance === 'Bearish' ? DOWN : AMBER }} /></span>
                                                    </span>
                                                ) : <span className="text-[#ecebe6]/30">…</span>}
                                            </td>
                                            <td className="py-3 text-[#ecebe6]/70">{sc ? <>{sc.signal} <span className="font-mono text-[#ecebe6]/40">{fmtPct(sc.projectedChangePct, 1, true)}</span></> : ''}</td>
                                            <td className="py-3 text-right">
                                                <button onClick={() => setWatchlist(watchlist.filter((s) => s !== symbol))} aria-label={`Remove ${symbol}`} className="rounded p-1 text-[#ecebe6]/30 opacity-0 hover:text-[#ecebe6] group-hover:opacity-100 focus:opacity-100">
                                                    <X className="h-3.5 w-3.5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {!watchlist.length && (
                                        <tr><td colSpan={7} className="py-8 text-center text-[#ecebe6]/50">Your watchlist is empty. <button onClick={() => setSearchOpen(true)} className="text-[#ecebe6] underline underline-offset-4">Add a symbol</button>.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {watchlist.length > 12 && <p className="mt-3 text-xs text-[#ecebe6]/45">Showing the first 12 of {watchlist.length}. The full list is in the terminal.</p>}
                        <p className="mt-3 font-mono text-[11px] text-[#ecebe6]/40">Scores and signals are model output for research only. Not financial advice.</p>
                    </section>

                    {/* Right column */}
                    <aside className="space-y-10">
                        <section>
                            <div className="flex items-baseline justify-between">
                                <h2 className="font-display text-3xl">Equal-weight basket</h2>
                                {basketReturn != null && <span className={`font-mono text-sm ${pctClass(basketReturn)}`}>{fmtPct(basketReturn, 1)}</span>}
                            </div>
                            <p className="mt-1 text-sm text-[#ecebe6]/50">Your watchlist as if you held each name equally, last ~3 months.</p>
                            <div className="mt-4 h-48 border border-[#ecebe6]/12 bg-[#0e0f12] p-1">
                                {basket.length > 1 ? <EquityChart series={[{ color: AMBER, width: 2, points: basket }]} /> : <div className="h-full animate-pulse bg-[#ecebe6]/[0.03]" />}
                            </div>
                        </section>

                        <section>
                            <h2 className="font-display text-3xl">News on your names</h2>
                            <div className="mt-3">
                                <HoldingsNews symbols={watchlist.filter((s) => !s.startsWith('^')).slice(0, 2)} />
                            </div>
                        </section>

                        <section className="border-t border-[#ecebe6]/15 pt-4">
                            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#ecebe6]/45">Account</div>
                            {session.user ? (
                                <div className="mt-3 flex items-center justify-between gap-4 text-sm">
                                    <div>
                                        <div className="text-[#ecebe6]">{session.user.email}</div>
                                        <div className="text-[#ecebe6]/50">Free plan · watchlist sync on</div>
                                    </div>
                                    <button onClick={session.signOut} className="rounded-md border border-[#ecebe6]/15 px-3 py-2 hover:bg-[#ecebe6]/[0.05]">Sign out</button>
                                </div>
                            ) : (
                                <div className="mt-3 text-sm text-[#ecebe6]/60">
                                    {session.configured ? (
                                        <>You’re not signed in. <Link href="/signup?next=/dashboard" className="text-[#ecebe6] underline underline-offset-4">Create a free account</Link> to sync this watchlist across devices.</>
                                    ) : 'Accounts aren’t enabled on this deployment yet; your watchlist is saved in this browser.'}
                                </div>
                            )}
                            <Link href="/app" className="mt-5 inline-flex items-center gap-1 text-sm text-[#ecebe6]/75 underline-offset-4 hover:text-[#ecebe6] hover:underline">
                                Charts, forecasts and backtests in the terminal <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </section>
                    </aside>
                </div>
            </div>

            <SymbolSearch
                open={searchOpen}
                title="Add to watchlist"
                onClose={() => setSearchOpen(false)}
                onPick={(s) => {
                    const sym = s.toUpperCase()
                    if (!watchlist.includes(sym)) setWatchlist([sym, ...watchlist])
                }}
            />
        </div>
    )
}
