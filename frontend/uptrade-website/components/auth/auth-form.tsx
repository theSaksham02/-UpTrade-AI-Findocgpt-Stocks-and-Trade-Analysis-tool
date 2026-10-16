'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowser } from '@/lib/supabase/client'
import { isAuthConfigured, isGoogleEnabled, safeNext } from '@/lib/supabase/config'

type Mode = 'login' | 'signup'

export const inputClass = 'w-full bg-[#131722] border border-[#2a2e39] rounded-lg px-4 py-3 text-white focus:border-[#2962FF] outline-none disabled:opacity-50'

export const buttonClass = 'w-full bg-[#2962FF] hover:bg-[#1e53e5] text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50'

// Page frame shared by the sign-in, sign-up and password-reset screens
export function AuthShell({ title, subtitle, error, notice, children }: {
    title: string
    subtitle: string
    error?: string | null
    notice?: string | null
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center px-6">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
                    <p className="text-[#868993]">{subtitle}</p>
                </div>

                {!isAuthConfigured && (
                    <div className="mb-4 rounded-lg border border-[#f59e0b]/40 bg-[#f59e0b]/10 px-4 py-3 text-sm text-[#fbbf24]">
                        Accounts aren&apos;t enabled on this deployment yet. The <Link href="/app" className="underline">terminal</Link> works without signing in.
                    </div>
                )}
                {error && <div role="alert" className="mb-4 rounded-lg border border-[#ef4444]/40 bg-[#ef4444]/10 px-4 py-3 text-sm text-[#f87171]">{error}</div>}
                {notice && <div role="status" className="mb-4 rounded-lg border border-[#22c55e]/40 bg-[#22c55e]/10 px-4 py-3 text-sm text-[#4ade80]">{notice}</div>}

                {children}
            </div>
        </div>
    )
}

function GoogleIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
        </svg>
    )
}

export default function AuthForm({ mode }: { mode: Mode }) {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [notice, setNotice] = useState<string | null>(null)
    const [next, setNext] = useState('/app')

    // useSearchParams would force a Suspense boundary; read the query once on mount instead
    useEffect(() => {
        const q = new URLSearchParams(window.location.search)
        setNext(safeNext(q.get('next')))
        const err = q.get('error')
        if (err) setError(err === 'not_configured' ? 'Sign-in is not configured on this deployment.' : err)
    }, [])

    const callbackUrl = () => `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const supabase = getSupabaseBrowser()
        if (!supabase) return
        setBusy(true)
        setError(null)
        setNotice(null)
        try {
            if (mode === 'login') {
                const { error } = await supabase.auth.signInWithPassword({ email, password })
                if (error) throw error
                router.replace(next)
                router.refresh()
            } else {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: { emailRedirectTo: callbackUrl(), data: name ? { full_name: name } : undefined },
                })
                if (error) throw error
                if (data.session) {
                    // Email confirmation is disabled in the project: the user is signed in already
                    router.replace(next)
                    router.refresh()
                } else if (data.user && data.user.identities?.length === 0) {
                    setError('An account with this email already exists. Sign in instead.')
                } else {
                    setNotice(`Check ${email} for a confirmation link to finish creating your account.`)
                    setPassword('')
                }
            }
        } catch (err) {
            setError((err as Error).message)
        } finally {
            setBusy(false)
        }
    }

    const handleGoogle = async () => {
        const supabase = getSupabaseBrowser()
        if (!supabase) return
        setBusy(true)
        setError(null)
        const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: callbackUrl() } })
        // On success the browser navigates to Google; we only get here on error
        if (error) {
            setError(error.message)
            setBusy(false)
        }
    }

    const disabled = busy || !isAuthConfigured
    const isLogin = mode === 'login'

    return (
        <AuthShell
            title={isLogin ? 'Welcome back' : 'Create your account'}
            subtitle={isLogin ? 'Sign in to sync your watchlist across devices' : 'Free account: your watchlist follows you to any device'}
            error={error}
            notice={notice}
        >
            {isGoogleEnabled && (<>
            <button
                type="button"
                onClick={handleGoogle}
                disabled={disabled}
                className="w-full flex items-center justify-center gap-2 bg-white hover:bg-[#f1f3f4] text-[#1f1f1f] py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
                <GoogleIcon />Continue with Google
            </button>

            <div className="my-5 flex items-center gap-3 text-xs text-[#5d606b]">
                <span className="h-px flex-1 bg-[#2a2e39]" />or<span className="h-px flex-1 bg-[#2a2e39]" />
            </div>
            </>)}

            <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                    <div>
                        <label htmlFor="name" className="block text-sm text-[#868993] mb-2">Name <span className="text-[#5d606b]">(optional)</span></label>
                        <input id="name" type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} disabled={disabled} className={inputClass} placeholder="Ada Lovelace" />
                    </div>
                )}
                <div>
                    <label htmlFor="email" className="block text-sm text-[#868993] mb-2">Email</label>
                    <input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={disabled} className={inputClass} placeholder="you@example.com" />
                </div>
                <div>
                    <div className="flex items-baseline justify-between mb-2">
                        <label htmlFor="password" className="block text-sm text-[#868993]">Password</label>
                        {isLogin && <Link href="/forgot-password" className="text-sm text-[#2962FF] hover:underline">Forgot password?</Link>}
                    </div>
                    <input
                        id="password"
                        type="password"
                        required
                        minLength={isLogin ? undefined : 8}
                        autoComplete={isLogin ? 'current-password' : 'new-password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={disabled}
                        className={inputClass}
                        placeholder={isLogin ? '••••••••' : 'At least 8 characters'}
                    />
                </div>
                <button type="submit" disabled={disabled} className={buttonClass}>
                    {busy ? 'Please wait…' : isLogin ? 'Sign In' : 'Create Free Account'}
                </button>
            </form>

            <p className="text-center text-[#868993] text-sm mt-6">
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <Link href={`${isLogin ? '/signup' : '/login'}${next !== '/app' ? `?next=${encodeURIComponent(next)}` : ''}`} className="text-[#2962FF] hover:underline">
                    {isLogin ? 'Sign up' : 'Sign in'}
                </Link>
            </p>
            <p className="text-center text-sm mt-3">
                <Link href="/app" className="text-[#5d606b] hover:text-[#868993]">Continue to the terminal without an account →</Link>
            </p>
        </AuthShell>
    )
}
