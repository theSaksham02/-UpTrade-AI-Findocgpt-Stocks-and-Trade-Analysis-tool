import type React from 'react'

export const LEGAL_UPDATED = 'October 16, 2026'

export function LegalTitle({ children, updated = LEGAL_UPDATED }: { children: React.ReactNode; updated?: string }) {
    return (
        <header className="mb-12">
            <h1 className="font-display text-5xl text-[#ecebe6] mb-4">{children}</h1>
            <p className="font-mono text-xs uppercase tracking-wider text-[#868993]">Last updated {updated} · Draft for the free beta</p>
        </header>
    )
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="space-y-4">
            <h2 className="text-xl font-semibold text-[#ecebe6] mt-10">{title}</h2>
            {children}
        </section>
    )
}

export function LegalList({ children }: { children: React.ReactNode }) {
    return <ul className="list-disc pl-5 space-y-2 marker:text-[#e8b04a]">{children}</ul>
}

// Unfilled values the owner still has to supply. Highlighted so they can't ship unnoticed.
export function Placeholder({ children }: { children: React.ReactNode }) {
    return <span className="font-mono text-[0.9em] text-[#e8b04a]">{children}</span>
}

export const ENTITY = <Placeholder>[LEGAL ENTITY NAME]</Placeholder>
export const CONTACT = <Placeholder>[CONTACT EMAIL]</Placeholder>
