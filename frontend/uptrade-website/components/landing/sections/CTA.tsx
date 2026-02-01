'use client'

import Link from 'next/link'

export function CTA() {
    return (
        <section className="py-32 px-4 text-center">
            <h2 className="text-5xl font-bold text-white mb-8">Ready to replace your legacy terminal?</h2>
            <Link href="/app">
                <button className="px-12 py-5 bg-[#2962FF] hover:bg-[#1e53e5] text-white font-bold rounded-lg text-xl transition-all shadow-xl hover:shadow-[#2962FF]/50 hover:-translate-y-1">
                    Launch Platform Now
                </button>
            </Link>
            <p className="mt-6 text-[#868993]">No credit card required. Instant access.</p>
        </section>
    )
}
