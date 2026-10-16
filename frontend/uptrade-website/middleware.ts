import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { SUPABASE_KEY, SUPABASE_URL, isAuthConfigured } from '@/lib/supabase/config'

// ------------------------------------------------------------
// API rate limit: fixed one-minute window per IP, kept in memory.
// Best effort — each serverless instance has its own counters — but enough to stop
// a single scraper from burning through the Yahoo budget or the model's CPU.
// ------------------------------------------------------------

const WINDOW_MS = 60_000
const LIMITS: { prefix: string; max: number }[] = [
    { prefix: '/api/model/', max: 20 }, // scan / analyze / backtest are CPU-heavy
    { prefix: '/api/market/', max: 120 },
]
const hits = new Map<string, { count: number; reset: number }>()
let lastSweep = 0

function clientIp(request: NextRequest) {
    const fwd = request.headers.get('x-forwarded-for')
    return fwd?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'unknown'
}

function rateLimit(request: NextRequest) {
    const { pathname } = request.nextUrl
    const rule = LIMITS.find((l) => pathname.startsWith(l.prefix))
    if (!rule) return null

    const now = Date.now()
    if (now - lastSweep > WINDOW_MS) {
        lastSweep = now
        hits.forEach((v, k) => { if (v.reset <= now) hits.delete(k) })
    }

    const key = `${rule.prefix}|${clientIp(request)}`
    let entry = hits.get(key)
    if (!entry || entry.reset <= now) {
        entry = { count: 0, reset: now + WINDOW_MS }
        hits.set(key, entry)
    }
    entry.count++
    if (entry.count <= rule.max) return null

    const retryAfter = Math.max(1, Math.ceil((entry.reset - now) / 1000))
    return NextResponse.json(
        { error: 'Too many requests. Please slow down and try again shortly.' },
        {
            status: 429,
            headers: {
                'Retry-After': String(retryAfter),
                'X-RateLimit-Limit': String(rule.max),
                'X-RateLimit-Remaining': '0',
                'Cache-Control': 'no-store',
            },
        },
    )
}

// Rate-limits the API and keeps the Supabase session cookie fresh. Nothing is protected: every page stays public.
export async function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith('/api/')) return rateLimit(request) ?? NextResponse.next()

    let response = NextResponse.next({ request })
    if (!isAuthConfigured) return response

    const supabase = createServerClient(SUPABASE_URL, SUPABASE_KEY, {
        cookies: {
            getAll: () => request.cookies.getAll(),
            setAll: (toSet) => {
                toSet.forEach(({ name, value }) => request.cookies.set(name, value))
                response = NextResponse.next({ request })
                toSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
            },
        },
    })
    // Validates the JWT and refreshes it when it is close to expiry
    await supabase.auth.getClaims()
    return response
}

export const config = {
    // Pages and API routes; skip static assets
    matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$).*)'],
}
