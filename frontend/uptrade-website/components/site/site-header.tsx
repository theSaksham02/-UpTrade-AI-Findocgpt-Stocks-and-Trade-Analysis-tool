'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronDown, Menu, Search, TrendingUp, X } from 'lucide-react'
import SymbolSearch from '@/components/uptrade-terminal/symbol-search'

const PRODUCTS = [
    { href: '/app', title: 'Terminal', text: 'Multi-pane charts, indicators and drawing tools' },
    { href: '/markets', title: 'Markets', text: 'Heatmap, movers and the model scan' },
    { href: '/app/tradex', title: 'Strategy tester', text: 'Backtest four strategies on five years of data' },
    { href: '/app/visualx', title: 'Sentiment', text: 'Headline sentiment for any ticker' },
]

const NAV = [
    { href: '/markets', label: 'Markets' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/docs', label: 'Docs' },
    { href: '/about', label: 'About' },
]

export function SiteHeader() {
    const router = useRouter()
    const [searchOpen, setSearchOpen] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8)
        const onKey = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault()
                setSearchOpen(true)
            }
        }
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        window.addEventListener('keydown', onKey)
        return () => {
            window.removeEventListener('scroll', onScroll)
            window.removeEventListener('keydown', onKey)
        }
    }, [])

    return (
        <>
            <header
                className={`fixed inset-x-0 top-0 z-50 h-16 border-b transition-colors ${scrolled ? 'border-white/10 bg-[#07080c]/90 backdrop-blur-md' : 'border-transparent bg-[#07080c]/60 backdrop-blur-sm'}`}
            >
                <div className="mx-auto flex h-full max-w-[1400px] items-center gap-3 px-4 md:gap-6 md:px-6">
                    <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="UpTrade home">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2962ff]">
                            <TrendingUp className="h-[18px] w-[18px] text-white" />
                        </span>
                        <span className="font-display text-lg font-bold tracking-tight text-white">UpTrade</span>
                    </Link>

                    <button
                        onClick={() => setSearchOpen(true)}
                        className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 text-left text-sm text-white/50 transition-colors hover:bg-white/[0.1] md:max-w-xs"
                    >
                        <Search className="h-4 w-4 shrink-0" />
                        <span className="truncate">Search markets</span>
                        <kbd className="ml-auto hidden shrink-0 rounded border border-white/15 px-1.5 font-mono text-[11px] text-white/40 sm:inline">⌘K</kbd>
                    </button>

                    <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
                        <div className="group relative">
                            <button className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/[0.06] hover:text-white">
                                Products <ChevronDown className="h-3.5 w-3.5" />
                            </button>
                            <div className="invisible absolute left-0 top-full pt-2 opacity-0 transition-all duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                                <div className="w-80 rounded-xl border border-white/10 bg-[#11131a] p-2 shadow-2xl">
                                    {PRODUCTS.map((p) => (
                                        <Link key={p.href} href={p.href} className="block rounded-lg px-3 py-2.5 hover:bg-white/[0.06]">
                                            <div className="text-sm font-semibold text-white">{p.title}</div>
                                            <div className="text-xs text-white/50">{p.text}</div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {NAV.map((n) => (
                            <Link key={n.href} href={n.href} className="rounded-full px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/[0.06] hover:text-white">
                                {n.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="ml-auto flex shrink-0 items-center gap-2">
                        <Link href="/login" className="hidden rounded-full px-3 py-2 text-sm font-medium text-white/80 hover:text-white sm:inline">
                            Sign in
                        </Link>
                        <Link href="/app" className="hidden rounded-full bg-[#2962ff] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1e53e5] sm:inline">
                            Open terminal
                        </Link>
                        <button onClick={() => setMobileOpen((o) => !o)} className="rounded-full p-2 text-white lg:hidden" aria-label="Menu" aria-expanded={mobileOpen}>
                            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                {mobileOpen && (
                    <div className="border-t border-white/10 bg-[#07080c] px-4 pb-6 pt-2 lg:hidden">
                        {[...PRODUCTS.map((p) => ({ href: p.href, label: p.title })), ...NAV].map((n) => (
                            <Link key={n.href + n.label} href={n.href} onClick={() => setMobileOpen(false)} className="block border-b border-white/5 py-3 text-base text-white/90">
                                {n.label}
                            </Link>
                        ))}
                        <div className="mt-4 flex gap-2">
                            <Link href="/login" className="flex-1 rounded-full border border-white/15 py-2.5 text-center text-sm font-medium text-white">Sign in</Link>
                            <Link href="/app" className="flex-1 rounded-full bg-[#2962ff] py-2.5 text-center text-sm font-semibold text-white">Open terminal</Link>
                        </div>
                    </div>
                )}
            </header>

            <SymbolSearch
                open={searchOpen}
                onClose={() => setSearchOpen(false)}
                onPick={(s) => router.push(`/app?symbol=${encodeURIComponent(s)}`)}
            />
        </>
    )
}
