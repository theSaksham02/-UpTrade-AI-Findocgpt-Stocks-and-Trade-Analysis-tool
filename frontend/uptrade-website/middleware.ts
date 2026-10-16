import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { SUPABASE_KEY, SUPABASE_URL, isAuthConfigured } from '@/lib/supabase/config'

// Keeps the Supabase session cookie fresh. Nothing is protected: every page stays public.
export async function middleware(request: NextRequest) {
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
    // Pages only: skip static assets and the market/model API routes
    matcher: ['/((?!_next/static|_next/image|api/|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$).*)'],
}
