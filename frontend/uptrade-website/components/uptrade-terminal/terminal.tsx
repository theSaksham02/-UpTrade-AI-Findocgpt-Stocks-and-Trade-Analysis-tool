'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import {
    AreaChart, BarChart3, Brain, CandlestickChart, ChevronDown, Crosshair, FlaskConical, LineChart, List,
    LogIn, LogOut, Minus, Newspaper, PanelRight, Search, Slash, Sparkles, Trash2, Activity, X,
} from 'lucide-react'
import { displayName, useSession } from '@/components/auth/use-session'
import { useWatchlistSync, type SyncState } from './use-watchlist-sync'
import { INTERVALS, type Interval, type Quote } from '@/lib/market/types'
import ChartPanel, { INDICATOR_META, type ChartType, type IndicatorKey, type Tool } from './chart-panel'
import SymbolSearch from './symbol-search'
import { SymbolDetails, Watchlist } from './watchlist'
import { AIPanel, BacktestPanel, NewsPanel } from './insights'
import { C, displaySymbol, useLocalStorage, useQuotes } from './hooks'

type Layout = 1 | 2 | 4
type SidePanel = 'watchlist' | 'ai' | 'news' | 'backtest'

const DEFAULT_WATCHLIST = ['AAPL', 'MSFT', 'NVDA', 'TSLA', 'AMZN', 'GOOGL', 'META', 'SPY', 'QQQ', 'BTC-USD', 'ETH-USD']
const DEFAULT_CHARTS = ['AAPL', 'BTC-USD', 'NVDA', 'SPY']

const CHART_TYPES: { id: ChartType; label: string; Icon: typeof CandlestickChart }[] = [
    { id: 'candles', label: 'Candles', Icon: CandlestickChart },
    { id: 'hollow', label: 'Hollow candles', Icon: CandlestickChart },
    { id: 'heikin', label: 'Heikin Ashi', Icon: CandlestickChart },
    { id: 'bars', label: 'Bars', Icon: BarChart3 },
    { id: 'line', label: 'Line', Icon: LineChart },
    { id: 'area', label: 'Area', Icon: AreaChart },
]

function Dropdown({ label, children, width = 220 }: { label: React.ReactNode; children: (close: () => void) => React.ReactNode; width?: number }) {
    const [pos, setPos] = useState<{ left: number; top: number } | null>(null)
    const btnRef = useRef<HTMLButtonElement>(null)
    const menuRef = useRef<HTMLDivElement>(null)
    const close = useCallback(() => setPos(null), [])
    useEffect(() => {
        if (!pos) return
        // capture phase: the chart canvas swallows bubbling pointer events
        const h = (e: Event) => {
            const t = e.target as Node
            if (!menuRef.current?.contains(t) && !btnRef.current?.contains(t)) close()
        }
        const k = (e: KeyboardEvent) => e.key === 'Escape' && close()
        document.addEventListener('pointerdown', h, true)
        document.addEventListener('keydown', k)
        window.addEventListener('resize', close)
        return () => {
            document.removeEventListener('pointerdown', h, true)
            document.removeEventListener('keydown', k)
            window.removeEventListener('resize', close)
        }
    }, [pos, close])
    return (
        <>
            <button
                ref={btnRef}
                onClick={() => {
                    if (pos) return close()
                    const r = btnRef.current!.getBoundingClientRect()
                    setPos({ left: Math.min(r.left, window.innerWidth - width - 8), top: r.bottom + 4 })
                }}
                aria-expanded={!!pos}
                className="flex h-8 shrink-0 items-center gap-1 rounded px-2 text-[13px] hover:bg-[#2a2e39]"
                style={{ color: C.text }}
            >
                {label}<ChevronDown size={12} color={C.muted} />
            </button>
            {pos && (
                <div ref={menuRef} className="fixed z-[90] rounded-md py-1 shadow-2xl" style={{ ...pos, width, background: C.panel, border: `1px solid ${C.border2}` }}>
                    {children(close)}
                </div>
            )}
        </>
    )
}

const SYNC_LABEL: Record<SyncState, string> = {
    off: 'Watchlist saved in this browser',
    loading: 'Loading your watchlist…',
    synced: 'Watchlist synced to your account',
    saving: 'Saving watchlist…',
    error: 'Watchlist sync failed; changes are kept in this browser',
}

function AccountMenu({ session, syncState }: { session: ReturnType<typeof useSession>; syncState: SyncState }) {
    const { user, loading, configured, signOut } = session
    if (!configured || loading) return null
    if (!user) {
        const next = typeof window === 'undefined' ? '/app' : window.location.pathname + window.location.search
        return (
            <Link href={`/login?next=${encodeURIComponent(next)}`} className="ml-1 flex h-8 shrink-0 items-center gap-1.5 rounded px-2 hover:bg-[#2a2e39]" title="Sign in to sync your watchlist">
                <LogIn size={15} /><span className="hidden sm:inline">Sign in</span>
            </Link>
        )
    }
    const name = displayName(user)
    return (
        <Dropdown
            width={240}
            label={
                <span className="flex items-center gap-1.5" title={name}>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold text-white" style={{ background: C.accent }}>{name.charAt(0).toUpperCase()}</span>
                    <span className="hidden max-w-[140px] truncate xl:inline">{name}</span>
                </span>
            }
        >
            {(close) => (
                <>
                    <div className="px-3 py-2" style={{ borderBottom: `1px solid ${C.border2}` }}>
                        <div className="truncate font-medium">{name}</div>
                        {user.email && user.email !== name && <div className="truncate text-[12px]" style={{ color: C.muted }}>{user.email}</div>}
                        <div className="mt-1 text-[11px]" style={{ color: syncState === 'error' ? C.amber : C.muted }}>{SYNC_LABEL[syncState]}</div>
                    </div>
                    <button onClick={async () => { close(); await signOut() }} className="flex w-full items-center gap-2 px-3 py-1.5 text-left hover:bg-[#2a2e39]">
                        <LogOut size={15} />Sign out
                    </button>
                </>
            )}
        </Dropdown>
    )
}

const Sep = () => <div className="mx-1 h-5 w-px shrink-0" style={{ background: C.border2 }} />

function ToolButton({ active, onClick, title, children }: { active?: boolean; onClick: () => void; title: string; children: React.ReactNode }) {
    return (
        <button
            onClick={onClick}
            title={title}
            aria-label={title}
            aria-pressed={active}
            className="flex h-9 w-9 items-center justify-center rounded hover:bg-[#2a2e39]"
            style={{ color: active ? C.accent : C.text, background: active ? 'rgba(41,98,255,0.15)' : undefined }}
        >
            {children}
        </button>
    )
}

export default function UpTradeTerminal({ defaultPanel = 'ai' }: { defaultPanel?: SidePanel }) {
    const [watchlist, setWatchlist] = useLocalStorage<string[]>('uptrade.watchlist', DEFAULT_WATCHLIST)
    const [charts, setCharts] = useLocalStorage<string[]>('uptrade.charts', DEFAULT_CHARTS)
    const [layout, setLayout] = useLocalStorage<Layout>('uptrade.layout', 1)
    const [interval, setIntervalTf] = useLocalStorage<Interval>('uptrade.interval', '1D')
    const [chartType, setChartType] = useLocalStorage<ChartType>('uptrade.chartType', 'candles')
    const [indicators, setIndicators] = useLocalStorage<IndicatorKey[]>('uptrade.indicators', ['vol', 'sma50', 'sma200'])
    const [showForecast, setShowForecast] = useLocalStorage('uptrade.forecast', true)
    const [showAnomalies, setShowAnomalies] = useLocalStorage('uptrade.anomalies', true)
    const [logScale, setLogScale] = useLocalStorage('uptrade.log', false)
    const [panel, setPanel] = useState<SidePanel>(defaultPanel)
    const [panelOpen, setPanelOpen] = useState(true)
    // Below md the side panel opens as a sheet over the chart
    const [sheetOpen, setSheetOpen] = useState(false)
    const [active, setActive] = useState(0)
    const [tool, setTool] = useState<Tool>('cursor')
    const [clearToken, setClearToken] = useState(0)
    const [search, setSearch] = useState<null | 'chart' | 'watchlist'>(null)
    const [searchSeed, setSearchSeed] = useState('')
    const [clock, setClock] = useState('')
    const session = useSession()
    const syncState = useWatchlistSync(session.user, watchlist, setWatchlist)

    const activeSymbol = charts[Math.min(active, charts.length - 1)] || 'AAPL'
    const quoteSymbols = useMemo(() => Array.from(new Set([...watchlist, ...charts.slice(0, layout)])), [watchlist, charts, layout])
    const quotes = useQuotes(quoteSymbols)
    const [chartQuotes, setChartQuotes] = useState<Record<string, Quote>>({})
    const activeQuote = quotes[activeSymbol.toUpperCase()] || chartQuotes[activeSymbol]

    useEffect(() => {
        const tick = () => setClock(new Date().toLocaleTimeString('en-US', { hour12: false, timeZone: 'UTC' }) + ' UTC')
        tick()
        const id = setInterval(tick, 1000)
        return () => clearInterval(id)
    }, [])

    // Deep link: /app?symbol=TSLA
    useEffect(() => {
        const s = new URLSearchParams(window.location.search).get('symbol')
        if (s && /^[\^A-Za-z0-9.=\-]{1,20}$/.test(s)) setCharts((c) => [s.toUpperCase(), ...c.filter((x) => x !== s.toUpperCase())])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        document.title = activeQuote ? `${displaySymbol(activeSymbol)} ${activeQuote.price.toLocaleString('en-US', { maximumFractionDigits: 2 })} · UpTrade` : 'UpTrade Terminal'
    }, [activeSymbol, activeQuote])

    const setChartSymbol = useCallback((s: string) => {
        setCharts((c) => {
            const next = [...c]
            while (next.length < 4) next.push(DEFAULT_CHARTS[next.length])
            next[Math.min(active, 3)] = s.toUpperCase()
            return next
        })
    }, [active, setCharts])

    // Keyboard: type to search (TradingView style), Esc to cancel tools, Alt+T/H drawing tools
    useEffect(() => {
        const h = (e: KeyboardEvent) => {
            const tag = (e.target as HTMLElement)?.tagName
            if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA' || search) return
            if (e.key === 'Escape') setTool('cursor')
            else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setSearch('chart') }
            else if (e.altKey && e.code === 'KeyT') setTool('trend')
            else if (e.altKey && e.code === 'KeyH') setTool('hline')
            else if (!e.metaKey && !e.ctrlKey && !e.altKey && /^[a-zA-Z]$/.test(e.key)) {
                e.preventDefault()
                setSearchSeed(e.key)
                setSearch('chart')
            }
        }
        window.addEventListener('keydown', h)
        return () => window.removeEventListener('keydown', h)
    }, [search])

    const toggleIndicator = (k: IndicatorKey) => setIndicators((cur) => (cur.includes(k) ? cur.filter((x) => x !== k) : [...cur, k]))
    const ChartTypeIcon = CHART_TYPES.find((t) => t.id === chartType)?.Icon || CandlestickChart

    const visible = charts.slice(0, layout)
    const gridClass = layout === 1 ? 'grid-cols-1 grid-rows-1' : layout === 2 ? 'grid-cols-1 grid-rows-2 md:grid-cols-2 md:grid-rows-1' : 'grid-cols-1 grid-rows-4 md:grid-cols-2 md:grid-rows-2'

    return (
        <div className="fixed inset-0 z-40 flex flex-col overflow-hidden text-[13px]" style={{ background: '#0c0e15', color: C.text }}>
            {/* ===== Top toolbar ===== */}
            <header className="flex h-11 shrink-0 items-center gap-1 overflow-x-auto px-2" style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}>
                <Link href="/" className="mr-1 flex shrink-0 items-baseline gap-1 rounded px-1.5 py-1 hover:bg-[#2a2e39]" title="UpTrade home">
                    <span className="font-display text-[19px] leading-none text-[#ecebe6]">UpTrade</span>
                    <span className="h-1 w-1 bg-[#e8b04a]" />
                </Link>
                <button onClick={() => setSearch('chart')} className="flex h-8 shrink-0 items-center gap-2 rounded px-2 font-semibold hover:bg-[#2a2e39]" title="Symbol search (⌘K or start typing)">
                    <Search size={15} color={C.muted} />{displaySymbol(activeSymbol)}
                </button>
                <Sep />
                <div className="flex shrink-0 items-center">
                    {INTERVALS.map((tf) => (
                        <button key={tf} onClick={() => setIntervalTf(tf)} className="h-8 rounded px-2 hover:bg-[#2a2e39]" style={{ color: tf === interval ? C.accent : C.text, fontWeight: tf === interval ? 600 : 400 }}>
                            {tf}
                        </button>
                    ))}
                </div>
                <Sep />
                <Dropdown label={<ChartTypeIcon size={17} />} width={180}>
                    {(close) => CHART_TYPES.map((t) => (
                        <button key={t.id} onClick={() => { setChartType(t.id); close() }} className="flex w-full items-center gap-2 px-3 py-1.5 text-left hover:bg-[#2a2e39]" style={{ color: t.id === chartType ? C.accent : C.text }}>
                            <t.Icon size={15} />{t.label}
                        </button>
                    ))}
                </Dropdown>
                <Dropdown label={<span className="flex items-center gap-1.5"><Activity size={15} />Indicators</span>} width={240}>
                    {() => (Object.keys(INDICATOR_META) as IndicatorKey[]).map((k) => (
                        <label key={k} className="flex cursor-pointer items-center gap-2 px-3 py-1.5 hover:bg-[#2a2e39]">
                            <input type="checkbox" checked={indicators.includes(k)} onChange={() => toggleIndicator(k)} className="accent-[#2962ff]" />
                            <span className="inline-block h-0.5 w-3" style={{ background: INDICATOR_META[k].color }} />
                            {INDICATOR_META[k].label}
                        </label>
                    ))}
                </Dropdown>
                <button onClick={() => setShowForecast((v) => !v)} className="flex h-8 shrink-0 items-center gap-1.5 rounded px-2 hover:bg-[#2a2e39]" style={{ color: showForecast ? C.purple : C.text }} title="UpTrade ARIMA forecast (1D)">
                    <Sparkles size={15} /><span className="hidden lg:inline">Forecast</span>
                </button>
                <button onClick={() => setShowAnomalies((v) => !v)} className="flex h-8 shrink-0 items-center gap-1.5 rounded px-2 hover:bg-[#2a2e39]" style={{ color: showAnomalies ? C.amber : C.text }} title="Anomaly markers (1D)">
                    <Brain size={15} /><span className="hidden lg:inline">Anomalies</span>
                </button>
                <Sep />
                <div className="hidden shrink-0 items-center md:flex">
                    {([1, 2, 4] as Layout[]).map((l) => (
                        <button key={l} onClick={() => { setLayout(l); if (active >= l) setActive(0) }} title={`${l} chart${l > 1 ? 's' : ''}`} className="flex h-8 w-8 items-center justify-center rounded hover:bg-[#2a2e39]" style={{ color: l === layout ? C.accent : C.text }}>
                            <span className={`grid gap-px ${l === 1 ? '' : l === 2 ? 'grid-cols-2' : 'grid-cols-2 grid-rows-2'}`}>
                                {Array.from({ length: l }).map((_, i) => <span key={i} className={`block border border-current ${l === 1 ? 'h-3.5 w-3.5' : l === 2 ? 'h-3.5 w-1.5' : 'h-1.5 w-1.5'}`} />)}
                            </span>
                        </button>
                    ))}
                </div>
                <div className="flex-1" />
                <span className="hidden shrink-0 font-mono text-[12px] lg:inline" style={{ color: C.muted }}>{clock}</span>
                <AccountMenu session={session} syncState={syncState} />
                <button onClick={() => setPanelOpen((o) => !o)} className="ml-1 flex h-8 w-8 shrink-0 items-center justify-center rounded hover:bg-[#2a2e39]" title="Toggle right panel" style={{ color: panelOpen ? C.accent : C.text }}>
                    <PanelRight size={17} />
                </button>
            </header>

            <div className="flex min-h-0 flex-1">
                {/* ===== Left drawing toolbar ===== */}
                <nav className="hidden w-12 shrink-0 flex-col items-center gap-1 py-2 sm:flex" style={{ background: C.bg, borderRight: `1px solid ${C.border}` }} aria-label="Drawing tools">
                    <ToolButton active={tool === 'cursor'} onClick={() => setTool('cursor')} title="Crosshair (Esc)"><Crosshair size={18} /></ToolButton>
                    <ToolButton active={tool === 'trend'} onClick={() => setTool('trend')} title="Trend line (Alt+T)"><Slash size={18} /></ToolButton>
                    <ToolButton active={tool === 'hline'} onClick={() => setTool('hline')} title="Horizontal line (Alt+H)"><Minus size={18} /></ToolButton>
                    <div className="my-1 h-px w-6" style={{ background: C.border2 }} />
                    <ToolButton onClick={() => setClearToken((t) => t + 1)} title="Remove all drawings"><Trash2 size={17} /></ToolButton>
                    <div className="flex-1" />
                    <ToolButton active={logScale} onClick={() => setLogScale((v) => !v)} title="Logarithmic price scale"><span className="text-[11px] font-semibold">LOG</span></ToolButton>
                </nav>

                {/* ===== Chart grid ===== */}
                <main className={`grid min-h-0 min-w-0 flex-1 gap-px ${gridClass}`} style={{ background: C.border }}>
                    {visible.map((s, i) => (
                        <ChartPanel
                            key={`${i}-${layout}`}
                            symbol={s}
                            interval={interval}
                            chartType={chartType}
                            indicators={layout === 4 ? indicators.filter((k) => !INDICATOR_META[k].pane) : indicators}
                            showForecast={showForecast}
                            showAnomalies={showAnomalies}
                            logScale={logScale}
                            tool={i === active ? tool : 'cursor'}
                            clearToken={clearToken}
                            active={layout > 1 && i === active}
                            compact={layout === 4}
                            onActivate={() => setActive(i)}
                            onToolDone={() => setTool('cursor')}
                            onQuote={(q) => setChartQuotes((m) => (m[s]?.time === q.time && m[s]?.price === q.price ? m : { ...m, [s]: q }))}
                        />
                    ))}
                </main>

                {/* ===== Right widget panel ===== */}
                {(panelOpen || sheetOpen) && (
                    <aside
                        className={`${sheetOpen ? 'fixed inset-x-0 bottom-6 top-11 z-50 flex' : 'hidden'} w-full flex-col md:static md:z-auto md:w-[320px] md:shrink-0 ${panelOpen ? 'md:flex' : 'md:hidden'}`}
                        style={{ background: C.bg, borderLeft: `1px solid ${C.border}` }}
                    >
                        <div className="flex h-10 shrink-0 items-center justify-between px-3 md:hidden" style={{ borderBottom: `1px solid ${C.border}` }}>
                            <span className="text-[13px] font-semibold">{displaySymbol(activeSymbol)} · panel</span>
                            <button onClick={() => setSheetOpen(false)} aria-label="Close panel" className="rounded p-1.5 hover:bg-[#2a2e39]"><X size={16} /></button>
                        </div>
                        <div className="flex h-[56%] min-h-0 flex-col">
                            <Watchlist
                                symbols={watchlist}
                                quotes={quotes}
                                selected={activeSymbol}
                                onSelect={(sym) => { setChartSymbol(sym); setSheetOpen(false) }}
                                onRemove={(s) => setWatchlist((w) => w.filter((x) => x !== s))}
                                onAdd={() => setSearch('watchlist')}
                            />
                            <SymbolDetails quote={activeQuote} />
                        </div>
                        <div className="flex h-9 shrink-0 items-center" style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }} role="tablist">
                            {([['ai', 'UpTrade AI', Brain], ['news', 'News', Newspaper], ['backtest', 'Backtest', FlaskConical]] as const).map(([id, label, Icon]) => (
                                <button
                                    key={id}
                                    role="tab"
                                    aria-selected={panel === id}
                                    onClick={() => setPanel(id)}
                                    className="flex h-full flex-1 items-center justify-center gap-1.5 text-[12px] font-medium"
                                    style={{ color: panel === id ? C.text : C.muted, boxShadow: panel === id ? `inset 0 -2px 0 ${C.accent}` : undefined }}
                                >
                                    <Icon size={14} />{label}
                                </button>
                            ))}
                        </div>
                        <div className="min-h-0 flex-1 overflow-y-auto">
                            {(panel === 'ai' || panel === 'watchlist') && <AIPanel symbol={activeSymbol} />}
                            {panel === 'news' && <NewsPanel symbol={activeSymbol} />}
                            {panel === 'backtest' && <BacktestPanel symbol={activeSymbol} />}
                        </div>
                    </aside>
                )}
            </div>

            {/* ===== Status bar ===== */}
            <footer className="flex h-6 shrink-0 items-center gap-3 overflow-hidden whitespace-nowrap px-3 text-[11px]" style={{ background: C.bg, borderTop: `1px solid ${C.border}`, color: C.muted }}>
                <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full" style={{ background: Object.keys(quotes).length ? C.up : C.amber }} />{Object.keys(quotes).length ? 'Market data connected' : 'Connecting…'}</span>
                <span>Data: Yahoo Finance · may be delayed</span>
                <span className="hidden sm:inline">For research only — not financial advice</span>
                <div className="flex-1" />
                <button className="flex items-center gap-1 md:hidden" onClick={() => setSearch('chart')}><Search size={12} />Search</button>
                <button className="flex items-center gap-1 font-medium md:hidden" style={{ color: C.text }} onClick={() => setSheetOpen((o) => !o)}><List size={12} />Watchlist · AI · News</button>
            </footer>

            <SymbolSearch
                open={search !== null}
                seed={searchSeed}
                title={search === 'watchlist' ? 'Add to watchlist' : 'Symbol Search'}
                onClose={() => { setSearch(null); setSearchSeed('') }}
                onPick={(s) => {
                    const sym = s.toUpperCase()
                    if (search === 'watchlist') setWatchlist((w) => (w.includes(sym) ? w : [...w, sym]))
                    else setChartSymbol(sym)
                }}
            />
        </div>
    )
}
