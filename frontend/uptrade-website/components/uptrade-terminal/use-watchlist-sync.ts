'use client'

import { useEffect, useRef, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { getSupabaseBrowser } from '@/lib/supabase/client'

export type SyncState = 'off' | 'loading' | 'synced' | 'saving' | 'error'

/**
 * Mirrors the (localStorage-backed) watchlist to public.watchlists for a signed-in user.
 * On sign-in the account copy wins; an account with no saved list is seeded from this browser.
 * Signed out, nothing changes: the watchlist lives in localStorage only.
 */
export function useWatchlistSync(user: User | null, watchlist: string[], setWatchlist: (w: string[]) => void): SyncState {
    const [state, setState] = useState<SyncState>('off')
    const userId = user?.id ?? null
    // JSON of what the server holds; null until the first load for this user has finished
    const serverCopy = useRef<string | null>(null)
    const latest = useRef(watchlist)
    latest.current = watchlist

    useEffect(() => {
        serverCopy.current = null
        const supabase = getSupabaseBrowser()
        if (!supabase || !userId) return setState('off')
        let cancelled = false
        setState('loading')
        ;(async () => {
            const { data, error } = await supabase.from('watchlists').select('symbols').eq('user_id', userId).maybeSingle()
            if (cancelled) return
            if (error) return setState('error')
            if (data) {
                serverCopy.current = JSON.stringify(data.symbols)
                setWatchlist(data.symbols)
                setState('synced')
            } else {
                const symbols = latest.current
                const { error: insErr } = await supabase.from('watchlists').insert({ user_id: userId, symbols })
                if (cancelled) return
                if (insErr) return setState('error')
                serverCopy.current = JSON.stringify(symbols)
                setState('synced')
            }
        })()
        return () => { cancelled = true }
    }, [userId, setWatchlist])

    // Save local edits (debounced) once the initial load is done
    useEffect(() => {
        const supabase = getSupabaseBrowser()
        if (!supabase || !userId || serverCopy.current === null) return
        const json = JSON.stringify(watchlist)
        if (json === serverCopy.current) return
        const id = setTimeout(async () => {
            setState('saving')
            const { error } = await supabase
                .from('watchlists')
                .upsert({ user_id: userId, symbols: watchlist, updated_at: new Date().toISOString() })
            if (error) return setState('error')
            serverCopy.current = json
            setState('synced')
        }, 600)
        return () => clearTimeout(id)
    }, [watchlist, userId])

    return state
}
