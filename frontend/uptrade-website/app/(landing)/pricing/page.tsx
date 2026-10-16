'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { getSupabaseBrowser } from '@/lib/supabase/client'

const INCLUDED = [
    'Terminal: multi-pane charts, 5-minute to monthly bars, RSI, MACD, Bollinger Bands, drawing tools, up to 4 charts',
    'UpTrade model on any symbol: 30-session ARIMA forecast with error band, composite score, anomaly markers',
    'Strategy tester: four strategies on five years of daily data, with fees',
    'Headline sentiment for any ticker',
    'Markets page: indices, sector heatmap, gainers and losers',
    'Dashboard and watchlist, synced to your account',
]

const LIMITS = [
    'Prices come from Yahoo Finance and can be delayed, by 15 minutes or more on some exchanges.',
    'No order execution, broker connection, alerts or API — UpTrade is a research tool.',
    'Model output is not investment advice; the backtests show where it loses.',
]

export default function PricingPage() {
    const [email, setEmail] = useState('')
    const [state, setState] = useState<'idle' | 'saving' | 'done' | 'error'>('idle')
    const [msg, setMsg] = useState('')

    async function join(e: React.FormEvent) {
        e.preventDefault()
        const supabase = getSupabaseBrowser()
        if (!supabase) {
            setState('error')
            setMsg('The waitlist isn’t enabled on this deployment yet.')
            return
        }
        setState('saving')
        const { error } = await supabase.from('waitlist').insert({ email: email.trim().toLowerCase() })
        // 23505 = already on the list; treat as success
        if (error && error.code !== '23505') {
            setState('error')
            setMsg('Couldn’t add you just now. Please try again.')
            return
        }
        setState('done')
    }

    return (
        <div className="min-h-screen bg-[#0a0b0d] text-[#ecebe6]">
            <div className="mx-auto max-w-[1100px] px-5 pb-24 pt-14 md:px-8">
                <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#ecebe6]/45">Pricing</div>
                <h1 className="mt-3 max-w-3xl font-display text-5xl leading-[1.02] md:text-7xl">Free while we’re <em className="text-[#e8b04a]">in beta.</em></h1>
                <p className="mt-5 max-w-xl text-[17px] leading-8 text-[#ecebe6]/60">
                    Everything UpTrade does today is free. No card, no trial clock. An account is only needed to sync your watchlist.
                </p>

                <div className="mt-14 grid gap-12 md:grid-cols-[1.3fr_1fr]">
                    <section className="border-t border-[#ecebe6]/15 pt-6">
                        <div className="flex items-baseline justify-between">
                            <h2 className="font-display text-3xl">Beta</h2>
                            <div className="font-mono"><span className="text-3xl">$0</span><span className="text-sm text-[#ecebe6]/50"> / month</span></div>
                        </div>
                        <ul className="mt-6 space-y-3">
                            {INCLUDED.map((i) => (
                                <li key={i} className="flex gap-3 text-[15px] leading-6 text-[#ecebe6]/80">
                                    <Check className="mt-1 h-4 w-4 shrink-0 text-[#e8b04a]" />{i}
                                </li>
                            ))}
                        </ul>
                        <div className="mt-8 flex flex-wrap gap-4">
                            <Link href="/app" className="rounded-md bg-[#ecebe6] px-5 py-3 text-sm font-semibold text-[#0a0b0d] hover:bg-white">Open the terminal</Link>
                            <Link href="/signup?next=/dashboard" className="rounded-md border border-[#ecebe6]/15 px-5 py-3 text-sm hover:bg-[#ecebe6]/[0.05]">Create a free account</Link>
                        </div>
                        <div className="mt-10">
                            <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#ecebe6]/45">Good to know</h3>
                            <ul className="mt-3 space-y-2 text-sm leading-6 text-[#ecebe6]/55">
                                {LIMITS.map((l) => <li key={l}>— {l}</li>)}
                            </ul>
                        </div>
                    </section>

                    <section className="h-fit border border-[#ecebe6]/12 bg-[#0e0f12] p-7">
                        <h2 className="font-display text-3xl">Pro, later.</h2>
                        <p className="mt-3 text-[15px] leading-7 text-[#ecebe6]/60">
                            We’ll add a paid plan once there’s something worth paying for — likely price alerts, more history and a
                            faster data feed. Leave your email and we’ll tell you before it launches. Nothing changes for beta users without notice.
                        </p>
                        {state === 'done' ? (
                            <p className="mt-6 text-[15px] text-[#3fb97f]">You’re on the list. We’ll email {email.trim()} before Pro launches.</p>
                        ) : (
                            <form onSubmit={join} className="mt-6 flex flex-col gap-3 sm:flex-row">
                                <input
                                    type="email"
                                    required
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    aria-label="Email for the Pro waitlist"
                                    className="min-w-0 flex-1 rounded-md border border-[#ecebe6]/15 bg-[#0a0b0d] px-3.5 py-2.5 text-[15px] outline-none placeholder:text-[#ecebe6]/30 focus:border-[#e8b04a]/70"
                                />
                                <button type="submit" disabled={state === 'saving'} className="rounded-md bg-[#e8b04a] px-4 py-2.5 text-sm font-semibold text-[#0a0b0d] hover:brightness-110 disabled:opacity-60">
                                    {state === 'saving' ? 'Adding…' : 'Join the waitlist'}
                                </button>
                            </form>
                        )}
                        {state === 'error' && <p className="mt-3 text-sm text-[#e5534b]" role="alert">{msg}</p>}
                        <p className="mt-4 text-xs text-[#ecebe6]/40">One email when Pro is ready. No marketing list.</p>
                    </section>
                </div>
            </div>
        </div>
    )
}
