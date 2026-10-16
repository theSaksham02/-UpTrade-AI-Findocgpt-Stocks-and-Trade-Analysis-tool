'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowser } from '@/lib/supabase/client'
import { isAuthConfigured } from '@/lib/supabase/config'
import { AuthShell, buttonClass, inputClass } from './auth-form'
import { useSession } from './use-session'

// Step 1: email a recovery link. It lands on /auth/callback (PKCE code exchange), which signs the
// user in with a recovery session and forwards to /reset-password.
export function ForgotPasswordForm() {
    const [email, setEmail] = useState('')
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [notice, setNotice] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const supabase = getSupabaseBrowser()
        if (!supabase) return
        setBusy(true)
        setError(null)
        setNotice(null)
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
        })
        setBusy(false)
        // Supabase doesn't reveal whether the address has an account, so neither do we
        if (error) setError(error.message)
        else setNotice(`If ${email} has an UpTrade account, a reset link is on its way. Open it in this browser.`)
    }

    const disabled = busy || !isAuthConfigured

    return (
        <AuthShell title="Reset your password" subtitle="We'll email you a link to choose a new one" error={error} notice={notice}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm text-[#ecebe6]/60 mb-2">Email</label>
                    <input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={disabled} className={inputClass} placeholder="you@example.com" />
                </div>
                <button type="submit" disabled={disabled} className={buttonClass}>
                    {busy ? 'Please wait…' : 'Send Reset Link'}
                </button>
            </form>

            <p className="text-center text-[#ecebe6]/60 text-sm mt-6">
                Remembered it? <Link href="/login" className="text-[#e8b04a] hover:underline">Sign in</Link>
            </p>
        </AuthShell>
    )
}

// Step 2: the recovery session is active; set the new password and go to the terminal.
export function ResetPasswordForm() {
    const router = useRouter()
    const { user, loading } = useSession()
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const supabase = getSupabaseBrowser()
        if (!supabase) return
        if (password !== confirm) {
            setError("The passwords don't match.")
            return
        }
        setBusy(true)
        setError(null)
        const { error } = await supabase.auth.updateUser({ password })
        if (error) {
            setError(error.message)
            setBusy(false)
            return
        }
        router.replace('/app')
        router.refresh()
    }

    // Without a session the link was opened in another browser, already used, or expired
    const noSession = isAuthConfigured && !loading && !user
    const disabled = busy || loading || !user

    return (
        <AuthShell
            title="Choose a new password"
            subtitle={user?.email ? `For ${user.email}` : 'Pick something you haven’t used here before'}
            error={noSession ? 'This reset link is invalid or has expired. Request a new one below.' : error}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="password" className="block text-sm text-[#ecebe6]/60 mb-2">New password</label>
                    <input id="password" type="password" required minLength={8} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={disabled} className={inputClass} placeholder="At least 8 characters" />
                </div>
                <div>
                    <label htmlFor="confirm" className="block text-sm text-[#ecebe6]/60 mb-2">Confirm new password</label>
                    <input id="confirm" type="password" required minLength={8} autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} disabled={disabled} className={inputClass} placeholder="Type it again" />
                </div>
                <button type="submit" disabled={disabled} className={buttonClass}>
                    {busy ? 'Please wait…' : 'Update Password'}
                </button>
            </form>

            <p className="text-center text-[#ecebe6]/60 text-sm mt-6">
                {noSession
                    ? <Link href="/forgot-password" className="text-[#e8b04a] hover:underline">Send a new reset link</Link>
                    : <Link href="/app" className="text-[#ecebe6]/40 hover:text-[#ecebe6]/60">Cancel and go to the terminal</Link>}
            </p>
        </AuthShell>
    )
}
