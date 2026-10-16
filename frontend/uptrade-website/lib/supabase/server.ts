import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { SUPABASE_KEY, SUPABASE_URL } from './config'

// Server client for route handlers and server components (reads/writes the auth cookies)
export function getSupabaseServer() {
    const cookieStore = cookies()
    return createServerClient(SUPABASE_URL, SUPABASE_KEY, {
        cookies: {
            getAll: () => cookieStore.getAll(),
            setAll: (toSet) => {
                try {
                    toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
                } catch {
                    // Called from a server component: cookies are read-only there; middleware refreshes them
                }
            },
        },
    })
}
