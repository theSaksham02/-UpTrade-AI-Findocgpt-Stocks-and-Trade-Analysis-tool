'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { CountUp, EASE, Reveal, RevealItem, Stagger, WordReveal } from './motion'

// Venues exactly as recorded by the team. Add paper titles, abstracts and links here when they're public.
export const VENUES = [
    {
        venue: 'Higher Education Finance Research Conference',
        place: 'Federal Reserve Bank of Philadelphia, US',
        format: 'In person',
        status: 'Peer-reviewed research presented',
        kind: 'presented',
    },
    {
        venue: 'P2P Financial Systems International Workshop (P2PFISY 2026)',
        place: 'Astana, Kazakhstan',
        format: 'Virtual presentation',
        status: 'Peer-reviewed research presented virtually',
        kind: 'presented',
    },
    {
        venue: 'IRMC 2026',
        place: 'Conference',
        format: '',
        status: 'Peer-reviewed research',
        kind: 'peer-reviewed',
    },
    {
        venue: '2026 RegTech Forum',
        place: 'Beijing, China',
        format: '',
        status: 'Research accepted by the programme committee following peer review',
        kind: 'accepted',
    },
] as const

const KIND_LABEL: Record<(typeof VENUES)[number]['kind'], string> = {
    presented: 'Presented',
    'peer-reviewed': 'Peer-reviewed',
    accepted: 'Accepted',
}

export function Research() {
    return (
        <div className="min-h-screen bg-[#0a0b0d] text-[#ecebe6]">
            {/* Hero */}
            <section className="relative overflow-hidden">
                <motion.div
                    aria-hidden
                    className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full border border-[#e8b04a]/15"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.4, ease: EASE }}
                />
                <motion.div
                    aria-hidden
                    className="pointer-events-none absolute -right-20 -top-20 h-[360px] w-[360px] rounded-full border border-[#ecebe6]/10"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.4, ease: EASE, delay: 0.15 }}
                />
                <div className="relative mx-auto max-w-[1280px] px-5 pb-16 pt-16 md:px-8 md:pt-24">
                    <Reveal>
                        <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#ecebe6]/45">Research</div>
                    </Reveal>
                    <h1 className="mt-4 max-w-4xl font-display text-[52px] leading-[0.98] md:text-[88px]">
                        <WordReveal text="Peer-reviewed first." />
                        <br />
                        <WordReveal text="Then shipped." className="italic text-[#e8b04a]" delay={0.25} />
                    </h1>
                    <Reveal delay={0.45}>
                        <p className="mt-6 max-w-xl text-[17px] leading-8 text-[#ecebe6]/65">
                            The UpTrade team’s work has been reviewed by programme committees and presented at finance and
                            regulatory-technology venues in the United States, Kazakhstan and China.
                        </p>
                    </Reveal>

                    <Stagger className="mt-12 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3">
                        <RevealItem className="border-t border-[#ecebe6]/15 pt-4">
                            <div className="font-display text-5xl"><CountUp value={4} /></div>
                            <div className="mt-1 text-sm text-[#ecebe6]/55">Peer-reviewed venues</div>
                        </RevealItem>
                        <RevealItem className="border-t border-[#ecebe6]/15 pt-4">
                            <div className="font-display text-5xl"><CountUp value={3} /></div>
                            <div className="mt-1 text-sm text-[#ecebe6]/55">Countries: US, Kazakhstan, China</div>
                        </RevealItem>
                        <RevealItem className="border-t border-[#ecebe6]/15 pt-4">
                            <div className="font-display text-5xl"><CountUp value={2} /></div>
                            <div className="mt-1 text-sm text-[#ecebe6]/55">Presented in person or virtually</div>
                        </RevealItem>
                    </Stagger>
                </div>
            </section>

            {/* Venues */}
            <section className="mx-auto max-w-[1280px] px-5 pb-20 md:px-8">
                <Reveal>
                    <div className="grid grid-cols-[48px_1fr] gap-4 border-b border-[#ecebe6]/15 pb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[#ecebe6]/45 md:grid-cols-[64px_1.4fr_1fr_1.2fr]">
                        <span>#</span>
                        <span>Venue</span>
                        <span className="hidden md:block">Location / format</span>
                        <span className="hidden md:block">Status</span>
                    </div>
                </Reveal>
                <Stagger gap={0.1}>
                    {VENUES.map((v, i) => (
                        <RevealItem key={v.venue}>
                            <div className="group relative grid grid-cols-[48px_1fr] gap-4 border-b border-[#ecebe6]/10 py-7 transition-colors duration-300 hover:bg-[#ecebe6]/[0.025] md:grid-cols-[64px_1.4fr_1fr_1.2fr] md:items-center">
                                <span className="absolute inset-y-0 left-0 w-px origin-top scale-y-0 bg-[#e8b04a] transition-transform duration-500 group-hover:scale-y-100" />
                                <span className="pl-3 font-mono text-sm text-[#ecebe6]/40 transition-colors group-hover:text-[#e8b04a]">{String(i + 1).padStart(2, '0')}</span>
                                <div>
                                    <h2 className="font-display text-2xl leading-tight transition-transform duration-300 group-hover:translate-x-1 md:text-3xl">{v.venue}</h2>
                                    <div className="mt-2 text-sm text-[#ecebe6]/55 md:hidden">
                                        {v.place}{v.format ? ` · ${v.format}` : ''}
                                    </div>
                                    <div className="mt-2 text-sm text-[#ecebe6]/70 md:hidden">{v.status}</div>
                                </div>
                                <div className="hidden text-[15px] text-[#ecebe6]/70 md:block">
                                    {v.place}
                                    {v.format && <div className="text-sm text-[#ecebe6]/45">{v.format}</div>}
                                </div>
                                <div className="hidden items-start gap-3 md:flex">
                                    <span className={`mt-0.5 shrink-0 rounded-sm border px-2 py-0.5 font-mono text-[10.5px] uppercase tracking-wider ${v.kind === 'accepted' ? 'border-[#e8b04a]/50 text-[#e8b04a]' : 'border-[#3fb97f]/50 text-[#3fb97f]'}`}>
                                        {KIND_LABEL[v.kind]}
                                    </span>
                                    <span className="text-[15px] leading-6 text-[#ecebe6]/75">{v.status}</span>
                                </div>
                            </div>
                        </RevealItem>
                    ))}
                </Stagger>
            </section>

            {/* Bridge to the product + request */}
            <section className="mx-auto max-w-[1280px] px-5 pb-24 md:px-8">
                <div className="grid gap-4 md:grid-cols-2">
                    <Reveal>
                        <Link href="/contact?topic=business" className="group block h-full border border-[#ecebe6]/12 bg-[#0e0f12] p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[#e8b04a]/50">
                            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#e8b04a]">For researchers & institutions</div>
                            <h3 className="mt-4 font-display text-3xl leading-tight">Request a paper or propose a collaboration.</h3>
                            <p className="mt-3 text-[15px] leading-7 text-[#ecebe6]/60">Papers and slides are shared on request. We’re also open to joint research and data partnerships.</p>
                            <span className="mt-6 inline-flex items-center gap-1 text-sm text-[#ecebe6] transition-all group-hover:gap-2">Talk to the team <ArrowRight className="h-4 w-4" /></span>
                        </Link>
                    </Reveal>
                    <Reveal delay={0.1}>
                        <Link href="/docs#model" className="group block h-full border border-[#ecebe6]/12 bg-[#0e0f12] p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[#ecebe6]/35">
                            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#ecebe6]/45">In the product</div>
                            <h3 className="mt-4 font-display text-3xl leading-tight">See exactly how the model in the terminal works.</h3>
                            <p className="mt-3 text-[15px] leading-7 text-[#ecebe6]/60">Forecast, score, anomaly rules and backtest assumptions — every number documented.</p>
                            <span className="mt-6 inline-flex items-center gap-1 text-sm text-[#ecebe6] transition-all group-hover:gap-2">Read the docs <ArrowUpRight className="h-4 w-4" /></span>
                        </Link>
                    </Reveal>
                </div>
            </section>
        </div>
    )
}
