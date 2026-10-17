'use client'

import { Plus, X } from 'lucide-react'
import type { Quote } from '@/lib/market/types'
import { C, displaySymbol, fmtCompact, fmtPct, fmtPrice } from './hooks'

export function Watchlist({ symbols, quotes, selected, onSelect, onRemove, onAdd }: {
    symbols: string[]
    quotes: Record<string, Quote>
    selected: string
    onSelect: (s: string) => void
    onRemove: (s: string) => void
    onAdd: () => void
}) {
    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex h-9 shrink-0 items-center justify-between px-3" style={{ borderBottom: `1px solid ${C.border}` }}>
                <span className="text-[13px] font-semibold" style={{ color: C.text }}>Watchlist</span>
                <button onClick={onAdd} className="rounded p-1 hover:bg-[#24252a]" aria-label="Add symbol" title="Add symbol" style={{ color: C.muted }}>
                    <Plus size={16} />
                </button>
            </div>
            <div className="grid grid-cols-[1fr_auto_auto] gap-x-3 px-3 py-1 text-[11px]" style={{ color: C.muted }}>
                <span>Symbol</span><span className="text-right">Last</span><span className="w-16 text-right">Chg%</span>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
                {symbols.map((s) => {
                    const q = quotes[s.toUpperCase()]
                    const up = (q?.changePercent ?? 0) >= 0
                    return (
                        <div
                            key={s}
                            onClick={() => onSelect(s)}
                            className="group relative grid cursor-pointer grid-cols-[1fr_auto_auto] items-center gap-x-3 px-3 py-1.5 text-[13px] hover:bg-[#24252a]"
                            style={{ background: s === selected ? 'rgba(232,176,74,0.12)' : undefined }}
                        >
                            <span className="truncate font-medium" style={{ color: C.text }} title={q?.name}>{displaySymbol(s)}</span>
                            <span className="text-right font-mono tabular-nums" style={{ color: C.text }}>{q ? fmtPrice(q.price) : '…'}</span>
                            <span className="w-16 text-right font-mono tabular-nums" style={{ color: q ? (up ? C.up : C.down) : C.muted }}>
                                {q ? fmtPct(q.changePercent, 2, true) : ''}
                            </span>
                            <button
                                onClick={(e) => { e.stopPropagation(); onRemove(s) }}
                                className="absolute right-1 hidden rounded p-0.5 group-hover:block"
                                style={{ background: C.panel, color: C.muted }}
                                aria-label={`Remove ${s}`}
                            >
                                <X size={12} />
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export function SymbolDetails({ quote }: { quote?: Quote }) {
    if (!quote) return <div className="h-32 shrink-0 p-3 text-xs" style={{ color: C.muted, borderTop: `1px solid ${C.border}` }}>Loading…</div>
    const up = quote.change >= 0
    const range = (lo: number | null, hi: number | null) => {
        if (lo == null || hi == null || hi <= lo) return null
        return Math.min(100, Math.max(0, ((quote.price - lo) / (hi - lo)) * 100))
    }
    const day = range(quote.dayLow, quote.dayHigh)
    const yr = range(quote.fiftyTwoWeekLow, quote.fiftyTwoWeekHigh)
    const Bar = ({ pct, lo, hi, label }: { pct: number | null; lo: number | null; hi: number | null; label: string }) => (
        <div>
            <div className="mb-1 flex justify-between text-[11px]" style={{ color: C.muted }}><span>{label}</span></div>
            <div className="relative h-1 rounded" style={{ background: C.border2 }}>
                {pct != null && <div className="absolute -top-0.5 h-2 w-0.5 rounded" style={{ left: `${pct}%`, background: C.text }} />}
            </div>
            <div className="mt-1 flex justify-between font-mono text-[11px]" style={{ color: C.text }}><span>{fmtPrice(lo)}</span><span>{fmtPrice(hi)}</span></div>
        </div>
    )
    return (
        <div className="shrink-0 space-y-3 p-3" style={{ borderTop: `1px solid ${C.border}` }}>
            <div>
                <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-[13px] font-semibold" style={{ color: C.text }}>{quote.name}</span>
                    <span className="shrink-0 text-[11px]" style={{ color: C.muted }}>{quote.exchange}</span>
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                    <span className="font-mono text-2xl font-semibold tabular-nums" style={{ color: C.text }}>{fmtPrice(quote.price)}</span>
                    <span className="text-[11px]" style={{ color: C.muted }}>{quote.currency}</span>
                    <span className="font-mono text-sm tabular-nums" style={{ color: up ? C.up : C.down }}>
                        {up ? '+' : ''}{fmtPrice(quote.change)} ({fmtPct(quote.changePercent, 2, true)})
                    </span>
                </div>
                <div className="mt-0.5 text-[11px]" style={{ color: C.muted }}>
                    As of {new Date(quote.time * 1000).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} · Vol {fmtCompact(quote.volume)}
                </div>
            </div>
            <Bar pct={day} lo={quote.dayLow} hi={quote.dayHigh} label="Day's range" />
            <Bar pct={yr} lo={quote.fiftyTwoWeekLow} hi={quote.fiftyTwoWeekHigh} label="52-week range" />
        </div>
    )
}
