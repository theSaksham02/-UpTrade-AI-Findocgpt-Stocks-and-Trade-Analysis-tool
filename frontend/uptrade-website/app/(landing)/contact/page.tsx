'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const TOPICS = [
    { id: 'general', label: 'General question' },
    { id: 'business', label: 'Business, partnerships or research' },
    { id: 'bug', label: 'Something is broken' },
    { id: 'data', label: 'Wrong or missing market data' },
    { id: 'account', label: 'My account or data deletion' },
] as const

const field = 'w-full rounded-md border border-[#ecebe6]/15 bg-[#0e0f12] px-3.5 py-2.5 text-[15px] text-[#ecebe6] outline-none placeholder:text-[#ecebe6]/30 focus:border-[#e8b04a]/70'

export default function ContactPage() {
    const [form, setForm] = useState({ email: '', topic: 'general', message: '', website: '' })
    const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
    const [error, setError] = useState('')

    // "Talk to us" links arrive with ?topic=business
    useEffect(() => {
        const t = new URLSearchParams(window.location.search).get('topic')
        if (t && TOPICS.some((x) => x.id === t)) setForm((f) => ({ ...f, topic: t }))
    }, [])

    async function submit(e: React.FormEvent) {
        e.preventDefault()
        setState('sending')
        setError('')
        try {
            const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
            const body = await res.json().catch(() => ({}))
            if (!res.ok) throw new Error(body.error || 'Couldn’t send your message.')
            setState('sent')
        } catch (err) {
            setError((err as Error).message)
            setState('error')
        }
    }

    return (
        <div className="min-h-screen bg-[#0a0b0d] text-[#ecebe6]">
            <div className="mx-auto grid max-w-[1100px] gap-14 px-5 pb-24 pt-14 md:grid-cols-[1fr_1.2fr] md:px-8">
                <div>
                    <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#ecebe6]/45">Contact</div>
                    <h1 className="mt-3 font-display text-5xl leading-[1.02] md:text-6xl">Tell us what’s <em className="text-[#e8b04a]">not working.</em></h1>
                    <p className="mt-5 max-w-sm text-[15px] leading-7 text-[#ecebe6]/60">
                        UpTrade is in free beta and built by a small team. Bug reports, wrong prices and feature requests all
                        come here, and we read every one.
                    </p>
                    <ul className="mt-8 space-y-3 border-t border-[#ecebe6]/12 pt-6 text-sm text-[#ecebe6]/60">
                        <li>To delete your account and data, choose <span className="text-[#ecebe6]">“My account or data deletion”</span> and send from the email you signed up with.</li>
                        <li>For how the model and data work, see the <Link href="/docs" className="text-[#ecebe6] underline underline-offset-4">docs</Link>.</li>
                    </ul>
                </div>

                <div>
                    {state === 'sent' ? (
                        <div className="border border-[#ecebe6]/12 bg-[#0e0f12] p-8">
                            <h2 className="font-display text-3xl">Thanks — message received.</h2>
                            <p className="mt-3 text-[15px] text-[#ecebe6]/60">We’ll reply to {form.email}, usually within two working days.</p>
                            <button onClick={() => { setForm({ email: form.email, topic: 'general', message: '', website: '' }); setState('idle') }} className="mt-6 text-sm text-[#ecebe6]/75 underline underline-offset-4 hover:text-[#ecebe6]">
                                Send another
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={submit} className="space-y-5">
                            <label className="block">
                                <span className="mb-1.5 block text-sm text-[#ecebe6]/70">Your email</span>
                                <input type="email" required autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={field} placeholder="you@example.com" />
                            </label>
                            <label className="block">
                                <span className="mb-1.5 block text-sm text-[#ecebe6]/70">Topic</span>
                                <select value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} className={field}>
                                    {TOPICS.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
                                </select>
                            </label>
                            <label className="block">
                                <span className="mb-1.5 block text-sm text-[#ecebe6]/70">Message</span>
                                <textarea required minLength={5} maxLength={5000} rows={7} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={field} placeholder="What happened, and on which symbol or page?" />
                            </label>
                            {/* Honeypot: hidden from people, filled by bots */}
                            <input type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="hidden" aria-hidden />
                            {state === 'error' && <p className="text-sm text-[#e5534b]" role="alert">{error}</p>}
                            <button type="submit" disabled={state === 'sending'} className="rounded-md bg-[#ecebe6] px-5 py-3 text-sm font-semibold text-[#0a0b0d] hover:bg-white disabled:opacity-60">
                                {state === 'sending' ? 'Sending…' : 'Send message'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
