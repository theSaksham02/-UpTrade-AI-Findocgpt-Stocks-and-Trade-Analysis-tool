import Link from 'next/link'

export const metadata = { title: 'Page not found · UpTrade' }

export default function NotFound() {
    return (
        <main className="flex min-h-screen flex-1 items-center bg-[#0a0b0d] text-[#ecebe6]">
            <div className="mx-auto w-full max-w-[1280px] px-5 py-24 md:px-8">
                <div className="font-mono text-xs uppercase tracking-[0.14em] text-[#e8b04a]">404 · Not found</div>
                <h1 className="mt-4 max-w-2xl font-display text-[56px] leading-[0.98] md:text-[80px]">
                    This page <em className="text-[#e8b04a]">isn’t on the chart.</em>
                </h1>
                <p className="mt-6 max-w-md text-[17px] leading-8 text-[#ecebe6]/65">
                    The link may be old, or the address mistyped. The markets are still where you left them.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-5">
                    <Link href="/app" className="rounded-md bg-[#ecebe6] px-5 py-3 text-sm font-semibold text-[#0a0b0d] hover:bg-white">
                        Open the terminal
                    </Link>
                    <Link href="/" className="text-sm text-[#ecebe6]/75 underline-offset-4 hover:text-[#ecebe6] hover:underline">
                        Back to the home page
                    </Link>
                </div>
            </div>
        </main>
    )
}
