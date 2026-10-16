// Supabase is optional: without these env vars the app still builds and runs,
// the terminal stays fully usable, and the auth UI explains that sign-in is off.
// NEXT_PUBLIC_* must be referenced literally so Next can inline them in the client bundle.
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const isAuthConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY)
// Show "Continue with Google" only once the Google provider is enabled in Supabase
export const isGoogleEnabled = isAuthConfigured && process.env.NEXT_PUBLIC_AUTH_GOOGLE === 'true'

// Only allow same-site relative redirects after sign-in (no open redirects)
export function safeNext(next: string | null | undefined, fallback = '/app') {
    return next && next.startsWith('/') && !next.startsWith('//') && !next.startsWith('/\\') ? next : fallback
}
