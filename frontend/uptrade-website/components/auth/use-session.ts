'use client'

import { useCallback, useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { getSupabaseBrowser } from '@/lib/supabase/client'
import { isAuthConfigured } from '@/lib/supabase/config'

// Current Supabase user on the client; `loading` is true until the first check finishes.
export function useSession() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(isAuthConfigured)

    useEffect(() => {
        const supabase = getSupabaseBrowser()
        if (!supabase) return
        let cancelled = false
        supabase.auth.getUser().then(({ data }) => {
            if (cancelled) return
            setUser(data.user)
            setLoading(false)
        })
        const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
            setLoading(false)
        })
        return () => {
            cancelled = true
            sub.subscription.unsubscribe()
        }
    }, [])

    const signOut = useCallback(async () => {
        await getSupabaseBrowser()?.auth.signOut()
        setUser(null)
    }, [])

    return { user, loading, configured: isAuthConfigured, signOut }
}

export function displayName(user: User) {
    const meta = user.user_metadata || {}
    return (meta.full_name || meta.name || user.email || 'Account') as string
}
