'use client'

import { useEffect } from 'react'
import './globals.css'

// Replaces the root layout when it fails, so it brings its own <html>/<body> and can't rely on
// the layout's fonts: the serif fallback keeps the headline in the site's voice.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <html lang="en" className="dark h-full">
            <body className="min-h-screen bg-[#0a0b0d] font-sans text-[#ecebe6] antialiased">
                <main className="flex min-h-screen items-center">
                    <div className="mx-auto w-full max-w-[1280px] px-5 py-24 md:px-8">
                        <div className="font-mono text-xs uppercase tracking-[0.14em] text-[#e8b04a]">Something went wrong</div>
                        <h1 className="mt-4 max-w-2xl font-display text-[56px] leading-[0.98] md:text-[80px]" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                            UpTrade <em className="text-[#e8b04a]">hit an error.</em>
                        </h1>
                        <p className="mt-6 max-w-md text-[17px] leading-8 text-[#ecebe6]/65">
                            It’s on our side, not yours. Try again in a moment.
                        </p>
                        {error.digest && <p className="mt-3 font-mono text-[11px] text-[#ecebe6]/35">Reference {error.digest}</p>}
                        <div className="mt-8 flex flex-wrap items-center gap-5">
                            <button onClick={reset} className="rounded-md bg-[#e8b04a] px-5 py-3 text-sm font-semibold text-[#0a0b0d] hover:bg-[#f0c060]">
                                Try again
                            </button>
                            {/* Plain anchors: a full reload is the point when the root layout is broken */}
                            <a href="/app" className="rounded-md border border-[#ecebe6]/20 px-5 py-3 text-sm text-[#ecebe6] hover:bg-[#ecebe6]/[0.06]">
                                Open the terminal
                            </a>
                            <a href="/" className="text-sm text-[#ecebe6]/75 underline-offset-4 hover:text-[#ecebe6] hover:underline">
                                Home
                            </a>
                        </div>
                    </div>
                </main>
            </body>
        </html>
    )
}
