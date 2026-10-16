'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { Quote } from '@/lib/market/types'

export function useApi<T>(url: string | null, refreshMs?: number) {
    const [data, setData] = useState<T | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!url) return
        let cancelled = false
        const ctrl = new AbortController()
        const load = async (initial: boolean) => {
            if (initial) setLoading(true)
            try {
                const res = await fetch(url, { signal: ctrl.signal })
                const body = await res.json()
                if (cancelled) return
                if (!res.ok) throw new Error(body?.error || `Request failed (${res.status})`)
                setData(body)
                setError(null)
            } catch (e) {
                if (!cancelled && (e as Error).name !== 'AbortError') setError((e as Error).message)
            } finally {
                if (!cancelled && initial) setLoading(false)
            }
        }
        setData(null)
        load(true)
        const id = refreshMs ? setInterval(() => document.visibilityState === 'visible' && load(false), refreshMs) : null
        return () => {
            cancelled = true
            ctrl.abort()
            if (id) clearInterval(id)
        }
    }, [url, refreshMs])

    return { data, error, loading }
}

export function useQuotes(symbols: string[], refreshMs = 15000) {
    const key = symbols.join(',')
    const { data } = useApi<{ quotes: Record<string, Quote> }>(key ? `/api/market/quotes?symbols=${encodeURIComponent(key)}` : null, refreshMs)
    // Keep the last good snapshot while a refresh is in flight
    const last = useRef<Record<string, Quote>>({})
    if (data?.quotes) last.current = data.quotes
    return last.current
}

export function useLocalStorage<T>(key: string, initial: T) {
    const [value, setValue] = useState<T>(initial)
    useEffect(() => {
        try {
            const raw = localStorage.getItem(key)
            if (raw) setValue(JSON.parse(raw))
        } catch { }
    }, [key])
    // Persist only on explicit updates, so the initial default never overwrites a saved value
    const set = useCallback((v: T | ((prev: T) => T)) => {
        setValue((prev) => {
            const next = typeof v === 'function' ? (v as (p: T) => T)(prev) : v
            try { localStorage.setItem(key, JSON.stringify(next)) } catch { }
            return next
        })
    }, [key])
    return [value, set] as const
}

// ------------------------------------------------------------
// Formatting
// ------------------------------------------------------------

export function fmtPrice(v: number | null | undefined) {
    if (v == null || !Number.isFinite(v)) return '—'
    const abs = Math.abs(v)
    const digits = abs >= 1000 ? 2 : abs >= 1 ? 2 : 4
    return v.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })
}

export function fmtPct(v: number | null | undefined, digits = 2, alreadyPct = false) {
    if (v == null || !Number.isFinite(v)) return '—'
    const p = alreadyPct ? v : v * 100
    return `${p >= 0 ? '+' : ''}${p.toFixed(digits)}%`
}

export function fmtCompact(v: number | null | undefined) {
    if (v == null || !Number.isFinite(v)) return '—'
    return Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(v)
}

export function displaySymbol(s: string) {
    return s.replace(/-USD$/, 'USD').replace(/^\^/, '')
}

export const C = {
    bg: '#131722',
    panel: '#1e222d',
    border: '#2a2e39',
    border2: '#363a45',
    text: '#d1d4dc',
    muted: '#787b86',
    up: '#089981',
    down: '#f23645',
    accent: '#2962ff',
    amber: '#ff9800',
    purple: '#ab47bc',
    yellow: '#f7c948',
}
