'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <main className="flex min-h-screen flex-1 items-center bg-[#0a0b0d] text-[#ecebe6]">
            <div className="mx-auto w-full max-w-[1280px] px-5 py-24 md:px-8">
                <div className="font-mono text-xs uppercase tracking-[0.14em] text-[#e8b04a]">Something went wrong</div>
                <h1 className="mt-4 max-w-2xl font-display text-[56px] leading-[0.98] md:text-[80px]">
                    This page <em className="text-[#e8b04a]">hit an error.</em>
                </h1>
                <p className="mt-6 max-w-md text-[17px] leading-8 text-[#ecebe6]/65">
                    It’s on our side, not yours. Try again — if market data is the problem, it usually comes back within a minute.
                </p>
                {error.digest && <p className="mt-3 font-mono text-[11px] text-[#ecebe6]/35">Reference {error.digest}</p>}
                <div className="mt-8 flex flex-wrap items-center gap-5">
                    <button onClick={reset} className="rounded-md bg-[#e8b04a] px-5 py-3 text-sm font-semibold text-[#0a0b0d] hover:bg-[#f0c060]">
                        Try again
                    </button>
                    <Link href="/app" className="rounded-md border border-[#ecebe6]/20 px-5 py-3 text-sm text-[#ecebe6] hover:bg-[#ecebe6]/[0.06]">
                        Open the terminal
                    </Link>
                    <Link href="/" className="text-sm text-[#ecebe6]/75 underline-offset-4 hover:text-[#ecebe6] hover:underline">
                        Home
                    </Link>
                </div>
            </div>
        </main>
    )
}
