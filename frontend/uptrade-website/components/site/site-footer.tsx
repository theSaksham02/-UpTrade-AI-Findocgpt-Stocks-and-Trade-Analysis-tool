import Link from 'next/link'

const COLUMNS = [
    {
        title: 'Product',
        links: [
            { href: '/app', label: 'Terminal' },
            { href: '/markets', label: 'Markets' },
            { href: '/app/tradex', label: 'Strategy tester' },
            { href: '/app/visualx', label: 'Sentiment' },
            { href: '/pricing', label: 'Pricing' },
        ],
    },
    {
        title: 'Company',
        links: [
            { href: '/about', label: 'About' },
            { href: '/docs', label: 'Docs' },
            { href: '/contact', label: 'Contact' },
        ],
    },
    {
        title: 'Legal',
        links: [
            { href: '/terms', label: 'Terms' },
            { href: '/privacy', label: 'Privacy' },
            { href: '/cookies', label: 'Cookies' },
            { href: '/disclaimer', label: 'Disclaimer' },
        ],
    },
]

export function SiteFooter() {
    return (
        <footer className="border-t border-[#ecebe6]/10 bg-[#0a0b0d]">
            <div className="mx-auto max-w-[1400px] px-4 py-14 md:px-6">
                <div className="grid gap-10 md:grid-cols-[1.6fr_repeat(3,1fr)]">
                    <div className="max-w-xs">
                        <Link href="/" className="flex items-baseline gap-1.5">
                            <span className="font-display text-[28px] leading-none text-[#ecebe6]">UpTrade</span>
                            <span className="h-1.5 w-1.5 bg-[#e8b04a]" />
                        </Link>
                        <p className="mt-4 text-sm leading-6 text-white/50">
                            Charts, an open forecasting model and market signals in one place.
                        </p>
                    </div>
                    {COLUMNS.map((c) => (
                        <div key={c.title}>
                            <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#ecebe6]/45">{c.title}</h3>
                            <ul className="mt-4 space-y-2.5">
                                {c.links.map((l) => (
                                    <li key={l.href + l.label}>
                                        <Link href={l.href} className="text-sm text-white/50 hover:text-white">{l.label}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="mt-12 space-y-2 border-t border-white/10 pt-6 text-xs leading-5 text-white/40">
                    <p>
                        Market data from Yahoo Finance and may be delayed. Forecasts, scores and backtests are model output
                        for research and education only — not investment advice. Past performance does not predict future results.
                    </p>
                    <p>© {new Date().getFullYear()} UpTrade. Charts by TradingView Lightweight Charts™.</p>
                </div>
            </div>
        </footer>
    )
}
