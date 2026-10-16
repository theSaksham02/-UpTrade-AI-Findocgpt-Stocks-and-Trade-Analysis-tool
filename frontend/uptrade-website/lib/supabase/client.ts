'use client'

import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import { SUPABASE_KEY, SUPABASE_URL, isAuthConfigured } from './config'

let client: SupabaseClient | null = null

// Browser client (singleton). Returns null when Supabase isn't configured.
export function getSupabaseBrowser() {
    if (!isAuthConfigured) return null
    if (!client) client = createBrowserClient(SUPABASE_URL, SUPABASE_KEY)
    return client
}
