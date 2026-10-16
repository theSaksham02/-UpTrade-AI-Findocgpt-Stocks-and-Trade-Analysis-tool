'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import type { SearchResult } from '@/lib/market/types'
import { C } from './hooks'

const POPULAR: SearchResult[] = [
    { symbol: 'AAPL', name: 'Apple Inc.', exchange: 'NASDAQ', type: 'EQUITY' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', exchange: 'NASDAQ', type: 'EQUITY' },
    { symbol: 'TSLA', name: 'Tesla, Inc.', exchange: 'NASDAQ', type: 'EQUITY' },
    { symbol: 'MSFT', name: 'Microsoft Corporation', exchange: 'NASDAQ', type: 'EQUITY' },
    { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust', exchange: 'NYSEArca', type: 'ETF' },
    { symbol: 'QQQ', name: 'Invesco QQQ Trust', exchange: 'NASDAQ', type: 'ETF' },
    { symbol: 'BTC-USD', name: 'Bitcoin USD', exchange: 'CCC', type: 'CRYPTOCURRENCY' },
    { symbol: 'ETH-USD', name: 'Ethereum USD', exchange: 'CCC', type: 'CRYPTOCURRENCY' },
    { symbol: '^GSPC', name: 'S&P 500', exchange: 'SNP', type: 'INDEX' },
]

const TYPE_LABEL: Record<string, string> = { EQUITY: 'stock', ETF: 'fund', CRYPTOCURRENCY: 'crypto', INDEX: 'index', MUTUALFUND: 'fund', CURRENCY: 'forex', FUTURE: 'futures' }

export default function SymbolSearch({ open, onClose, onPick, seed = '', title = 'Symbol Search' }: {
    open: boolean
    seed?: string
    onClose: () => void
    onPick: (symbol: string) => void
    title?: string
}) {
    const [q, setQ] = useState('')
    const [results, setResults] = useState<SearchResult[]>(POPULAR)
    // The query `results` belong to; while a newer query is loading we filter locally
    const [resultsFor, setResultsFor] = useState('')
    const [idx, setIdx] = useState(0)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (open) {
            setQ(seed)
            setResults(POPULAR)
            setResultsFor('')
            setIdx(0)
            setTimeout(() => inputRef.current?.focus(), 0)
        }
    }, [open, seed])

    useEffect(() => {
        const query = q.trim()
        if (!query) return
        const ctrl = new AbortController()
        const id = setTimeout(async () => {
            try {
                const res = await fetch(`/api/market/search?q=${encodeURIComponent(query)}`, { signal: ctrl.signal })
                const body = await res.json()
                setResults(body.quotes || [])
                setResultsFor(query)
                setIdx(0)
            } catch { }
        }, 200)
        return () => { clearTimeout(id); ctrl.abort() }
    }, [q])

    // What the list shows (and what Enter picks): popular when empty, server results for the
    // current query, or — until those arrive — known symbols that match what's typed so far.
    const shown = useMemo(() => {
        const query = q.trim()
        if (!query) return POPULAR
        if (resultsFor === query) return results
        const needle = query.toLowerCase()
        const seen = new Set<string>()
        return [...results, ...POPULAR].filter((r) => {
            if (seen.has(r.symbol)) return false
            seen.add(r.symbol)
            return r.symbol.toLowerCase().startsWith(needle) || r.name.toLowerCase().includes(needle)
        })
    }, [q, results, resultsFor])

    useEffect(() => setIdx(0), [shown])

    if (!open) return null

    const pick = (s: string) => { onPick(s); onClose() }

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 pt-[10vh] px-4" onMouseDown={onClose}>
            <div
                role="dialog"
                aria-label={title}
                className="w-full max-w-xl overflow-hidden rounded-md shadow-2xl"
                style={{ background: C.panel, border: `1px solid ${C.border2}` }}
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-4 pt-3 pb-2">
                    <span className="text-sm font-semibold" style={{ color: C.text }}>{title}</span>
                    <button onClick={onClose} aria-label="Close" style={{ color: C.muted }}><X size={16} /></button>
                </div>
                <div className="mx-4 mb-2 flex items-center gap-2 rounded px-3 py-2" style={{ background: C.bg, border: `1px solid ${C.accent}` }}>
                    <Search size={16} color={C.muted} />
                    <input
                        ref={inputRef}
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Escape') onClose()
                            else if (e.key === 'ArrowDown') { e.preventDefault(); setIdx((i) => Math.min(shown.length - 1, i + 1)) }
                            else if (e.key === 'ArrowUp') { e.preventDefault(); setIdx((i) => Math.max(0, i - 1)) }
                            else if (e.key === 'Enter') {
                                const r = shown[idx]
                                if (r) pick(r.symbol)
                                else if (q.trim()) pick(q.trim().toUpperCase())
                            }
                        }}
                        placeholder="Search stocks, ETFs, crypto, indices"
                        className="w-full bg-transparent text-sm outline-none"
                        style={{ color: C.text }}
                    />
                </div>
                <div className="max-h-[50vh] overflow-y-auto pb-2">
                    {!q.trim() && <div className="px-4 py-1 text-[11px] uppercase tracking-wide" style={{ color: C.muted }}>Popular</div>}
                    {shown.map((r, i) => (
                        <button
                            key={r.symbol}
                            onMouseEnter={() => setIdx(i)}
                            onClick={() => pick(r.symbol)}
                            className="flex w-full items-center gap-3 px-4 py-2 text-left text-[13px]"
                            style={{ background: i === idx ? '#2a2e39' : 'transparent', color: C.text }}
                        >
                            <span className="w-24 shrink-0 font-semibold">{r.symbol}</span>
                            <span className="flex-1 truncate" style={{ color: C.muted }}>{r.name}</span>
                            <span className="shrink-0 text-[11px]" style={{ color: C.muted }}>{TYPE_LABEL[r.type] || r.type.toLowerCase()} · {r.exchange}</span>
                        </button>
                    ))}
                    {q.trim() && !shown.length && <div className="px-4 py-6 text-center text-xs" style={{ color: C.muted }}>No symbols match “{q}”</div>}
                </div>
            </div>
        </div>
    )
}
