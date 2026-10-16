import { NextResponse, type NextRequest } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase/server'
import { isAuthConfigured, safeNext } from '@/lib/supabase/config'

// Landing point for Google OAuth and email-confirmation links (PKCE code exchange)
export async function GET(request: NextRequest) {
    const { searchParams, origin } = request.nextUrl
    const code = searchParams.get('code')
    const next = safeNext(searchParams.get('next'))

    if (!isAuthConfigured) return NextResponse.redirect(`${origin}/login?error=not_configured`)
    if (code) {
        const { error } = await getSupabaseServer().auth.exchangeCodeForSession(code)
        if (!error) return NextResponse.redirect(`${origin}${next}`)
        return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`)
    }
    const err = searchParams.get('error_description') || searchParams.get('error') || 'Missing sign-in code'
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(err)}`)
}
