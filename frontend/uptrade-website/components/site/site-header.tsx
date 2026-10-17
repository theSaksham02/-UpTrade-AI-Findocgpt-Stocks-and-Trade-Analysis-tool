'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import {
    ArrowRight, BarChart3, BookOpen, Briefcase, CandlestickChart, ChevronDown, FlaskConical, LayoutDashboard,
    Menu, Newspaper, Search, User, X,
} from 'lucide-react'
import SymbolSearch from '@/components/uptrade-terminal/symbol-search'
import { useSession } from '@/components/auth/use-session'
import { displaySymbol, fmtPct, fmtPrice, useQuotes } from '@/components/uptrade-terminal/hooks'
import { EASE } from './motion'

type MenuItem = { href: string; title: string; text: string; Icon: typeof CandlestickChart }

const PRODUCTS: MenuItem[] = [
    { href: '/app', title: 'Terminal', text: 'Multi-pane charts, indicators and the model on top', Icon: CandlestickChart },
    { href: '/markets', title: 'Markets', text: 'Heatmap, movers and the model scan', Icon: BarChart3 },
    { href: '/dashboard', title: 'Dashboard', text: 'Your watchlist, scores and news', Icon: LayoutDashboard },
    { href: '/app/tradex', title: 'Strategy tester', text: 'Five years of daily data, fees included', Icon: FlaskConical },
    { href: '/app/visualx', title: 'Sentiment', text: 'How the headlines lean, by ticker', Icon: Newspaper },
]

const SOLUTIONS: MenuItem[] = [
    { href: '/#investors', title: 'For investors', text: 'The full terminal, free during beta', Icon: User },
    { href: '/#teams', title: 'For teams & institutions', text: 'Research partnerships and custom model work', Icon: Briefcase },
    { href: '/research', title: 'Research', text: 'Peer-reviewed work behind UpTrade', Icon: BookOpen },
]

const LINKS = [
    { href: '/research', label: 'Research' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/docs', label: 'Docs' },
]

const TAPE = ['^GSPC', '^NDX', '^DJI', '^VIX', 'BTC-USD', 'ETH-USD', 'AAPL', 'NVDA', 'MSFT', 'TSLA', 'GLD', 'TLT']
const TAPE_NAMES: Record<string, string> = { '^GSPC': 'S&P 500', '^NDX': 'Nasdaq 100', '^DJI': 'Dow', '^VIX': 'VIX', 'BTC-USD': 'Bitcoin', 'ETH-USD': 'Ether' }

function TickerStrip() {
    const quotes = useQuotes(TAPE, 30000)
    const items = TAPE.flatMap((s) => (quotes[s] ? [{ s, q: quotes[s] }] : []))
    if (!items.length) return <div className="h-full" />
    return (
        <div className="group relative h-full overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_6%,black_94%,transparent)]">
            <div className="flex h-full w-max animate-[ut-tape_70s_linear_infinite] items-center group-hover:[animation-play-state:paused]">
                {[...items, ...items].map(({ s, q }, i) => (
                    <Link key={i} href={`/app?symbol=${encodeURIComponent(s)}`} className="flex items-center gap-2 px-4 font-mono text-[11.5px] transition-colors hover:bg-[#ecebe6]/[0.05]">
                        <span className="text-[#ecebe6]/70">{TAPE_NAMES[s] ?? displaySymbol(s)}</span>
                        <span className="tabular-nums text-[#ecebe6]">{fmtPrice(q.price)}</span>
                        <span className={`tabular-nums ${q.changePercent >= 0 ? 'text-[#3fb97f]' : 'text-[#e5534b]'}`}>{q.changePercent >= 0 ? '▲' : '▼'} {fmtPct(Math.abs(q.changePercent), 2, true).replace('+', '')}</span>
                    </Link>
                ))}
            </div>
        </div>
    )
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
    return (
        <Link href={href} className={`group relative px-3 py-2 text-sm transition-colors ${active ? 'text-[#ecebe6]' : 'text-[#ecebe6]/70 hover:text-[#ecebe6]'}`}>
            {children}
            <span className={`absolute inset-x-3 -bottom-px h-px origin-left bg-[#e8b04a] transition-transform duration-300 ${active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
        </Link>
    )
}

function MegaMenu({ label, items, active, wide }: { label: string; items: MenuItem[]; active: boolean; wide?: boolean }) {
    const [open, setOpen] = useState(false)
    const timer = useRef<ReturnType<typeof setTimeout>>()
    const root = useRef<HTMLDivElement>(null)
    const show = () => { clearTimeout(timer.current); setOpen(true) }
    const hide = () => { timer.current = setTimeout(() => setOpen(false), 120) }

    // Close on scroll, Escape or a click elsewhere
    useEffect(() => {
        if (!open) return
        const close = () => setOpen(false)
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
        const onDown = (e: PointerEvent) => !root.current?.contains(e.target as Node) && close()
        window.addEventListener('scroll', close, { passive: true })
        window.addEventListener('keydown', onKey)
        document.addEventListener('pointerdown', onDown, true)
        return () => {
            window.removeEventListener('scroll', close)
            window.removeEventListener('keydown', onKey)
            document.removeEventListener('pointerdown', onDown, true)
        }
    }, [open])

    return (
        <div ref={root} className="relative" onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
            <button
                aria-expanded={open}
                onClick={() => setOpen((o) => !o)}
                className={`group relative flex items-center gap-1 px-3 py-2 text-sm transition-colors ${active || open ? 'text-[#ecebe6]' : 'text-[#ecebe6]/70 hover:text-[#ecebe6]'}`}
            >
                {label}
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
                <span className={`absolute inset-x-3 -bottom-px h-px origin-left bg-[#e8b04a] transition-transform duration-300 ${active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.98 }}
                        transition={{ duration: 0.18, ease: EASE }}
                        className={`absolute left-0 top-full z-50 pt-3 ${wide ? 'w-[560px]' : 'w-[380px]'}`}
                    >
                        <div className={`grid gap-1 rounded-lg border border-[#ecebe6]/12 bg-[#111216]/95 p-2 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.7)] backdrop-blur-xl ${wide ? 'grid-cols-2' : ''}`}>
                            {items.map(({ href, title, text, Icon }, i) => (
                                <motion.div key={href} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 * i }}>
                                    <Link href={href} onClick={() => setOpen(false)} className="group/item flex gap-3 rounded-md p-3 transition-colors hover:bg-[#ecebe6]/[0.06]">
                                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#ecebe6]/12 text-[#ecebe6]/70 transition-colors group-hover/item:border-[#e8b04a]/60 group-hover/item:text-[#e8b04a]">
                                            <Icon className="h-4 w-4" />
                                        </span>
                                        <span>
                                            <span className="flex items-center gap-1 text-sm font-medium text-[#ecebe6]">
                                                {title}
                                                <ArrowRight className="h-3 w-3 -translate-x-1 opacity-0 transition-all group-hover/item:translate-x-0 group-hover/item:opacity-100" />
                                            </span>
                                            <span className="mt-0.5 block text-xs leading-5 text-[#ecebe6]/50">{text}</span>
                                        </span>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export function SiteHeader() {
    const router = useRouter()
    const pathname = usePathname() || '/'
    const { user } = useSession()
    const [searchOpen, setSearchOpen] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24)
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

    useEffect(() => setMobileOpen(false), [pathname])
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [mobileOpen])

    const isActive = useCallback((href: string) => href !== '/' && pathname.startsWith(href), [pathname])
    const productsActive = PRODUCTS.some((p) => isActive(p.href))

    return (
        <>
            <header className="fixed inset-x-0 top-0 z-50">
                {/* Live ticker strip — collapses once you scroll */}
                <motion.div
                    initial={false}
                    animate={{ height: scrolled ? 0 : 32, opacity: scrolled ? 0 : 1 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    className="overflow-hidden border-b border-[#ecebe6]/8 bg-[#0d0e11]"
                >
                    <div className="flex h-8 items-center">
                        <span className="hidden shrink-0 items-center gap-1.5 border-r border-[#ecebe6]/10 px-4 font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#ecebe6]/50 sm:flex">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3fb97f] opacity-60" />
                                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#3fb97f]" />
                            </span>
                            Markets
                        </span>
                        <div className="min-w-0 flex-1"><TickerStrip /></div>
                    </div>
                </motion.div>

                {/* Main bar */}
                <div className={`border-b transition-all duration-300 ${scrolled ? 'border-[#ecebe6]/12 bg-[#0a0b0d]/85 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.8)] backdrop-blur-xl' : 'border-[#ecebe6]/8 bg-[#0a0b0d]'}`}>
                    <div className={`mx-auto flex max-w-[1400px] items-center gap-2 px-4 transition-all duration-300 md:gap-4 md:px-6 ${scrolled ? 'h-14' : 'h-16'}`}>
                        <Link href="/" className="group mr-2 flex shrink-0 items-baseline gap-1.5" aria-label="UpTrade home">
                            <span className="font-display text-[27px] leading-none text-[#ecebe6]">UpTrade</span>
                            <span className="h-1.5 w-1.5 bg-[#e8b04a] transition-transform duration-300 group-hover:rotate-45 group-hover:scale-125" />
                        </Link>

                        <nav className="hidden items-center lg:flex" aria-label="Main">
                            <MegaMenu label="Products" items={PRODUCTS} active={productsActive} wide />
                            <MegaMenu label="Solutions" items={SOLUTIONS} active={false} />
                            {LINKS.map((l) => <NavLink key={l.href} href={l.href} active={isActive(l.href)}>{l.label}</NavLink>)}
                        </nav>

                        <div className="ml-auto flex items-center gap-2">
                            <button
                                onClick={() => setSearchOpen(true)}
                                className="group hidden h-9 items-center gap-2 rounded-md border border-[#ecebe6]/12 bg-[#ecebe6]/[0.03] px-3 text-sm text-[#ecebe6]/50 transition-colors hover:border-[#ecebe6]/25 hover:text-[#ecebe6]/80 md:flex"
                                aria-label="Search markets"
                            >
                                <Search className="h-4 w-4" />
                                <span className="hidden xl:inline">Search markets</span>
                                <kbd className="rounded border border-[#ecebe6]/15 px-1.5 font-mono text-[10.5px] text-[#ecebe6]/40 transition-colors group-hover:text-[#ecebe6]/60">⌘K</kbd>
                            </button>
                            <Link href={user ? '/dashboard' : '/login'} className="hidden px-2 text-sm text-[#ecebe6]/70 transition-colors hover:text-[#ecebe6] sm:inline">
                                {user ? 'Dashboard' : 'Sign in'}
                            </Link>
                            <Link href="/contact?topic=business" className="hidden rounded-md border border-[#ecebe6]/18 px-3.5 py-2 text-sm text-[#ecebe6] transition-colors hover:border-[#e8b04a]/70 hover:text-[#e8b04a] lg:inline">
                                Talk to us
                            </Link>
                            <Link href="/app" className="group relative hidden overflow-hidden rounded-md bg-[#ecebe6] px-4 py-2 text-sm font-semibold text-[#0a0b0d] sm:inline-flex sm:items-center sm:gap-1.5">
                                <span className="absolute inset-0 -translate-x-full bg-[#e8b04a] transition-transform duration-300 ease-out group-hover:translate-x-0" />
                                <span className="relative">Open terminal</span>
                                <ArrowRight className="relative h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                            </Link>
                            <button onClick={() => setSearchOpen(true)} className="rounded-md p-2 text-[#ecebe6] md:hidden" aria-label="Search markets"><Search className="h-5 w-5" /></button>
                            <button onClick={() => setMobileOpen((o) => !o)} className="rounded-md p-2 text-[#ecebe6] lg:hidden" aria-label="Menu" aria-expanded={mobileOpen}>
                                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                <AnimatePresence>
                    {mobileOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2, ease: EASE }}
                            className="h-[calc(100dvh-88px)] overflow-y-auto border-b border-[#ecebe6]/10 bg-[#0a0b0d] px-5 pb-10 pt-4 lg:hidden"
                        >
                            {[{ title: 'Products', items: PRODUCTS }, { title: 'Solutions', items: SOLUTIONS }].map((group) => (
                                <div key={group.title} className="mb-6">
                                    <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[#ecebe6]/45">{group.title}</div>
                                    {group.items.map(({ href, title, text, Icon }, i) => (
                                        <motion.div key={href} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.03 * i }}>
                                            <Link href={href} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 border-b border-[#ecebe6]/8 py-3">
                                                <Icon className="h-4 w-4 text-[#e8b04a]" />
                                                <span>
                                                    <span className="block text-[15px] text-[#ecebe6]">{title}</span>
                                                    <span className="block text-xs text-[#ecebe6]/45">{text}</span>
                                                </span>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            ))}
                            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#ecebe6]/70">
                                {LINKS.filter((l) => l.href !== '/research').map((l) => <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}>{l.label}</Link>)}
                                <Link href={user ? '/dashboard' : '/login'} onClick={() => setMobileOpen(false)}>{user ? 'Dashboard' : 'Sign in'}</Link>
                            </div>
                            <div className="mt-6 grid gap-2">
                                <Link href="/app" onClick={() => setMobileOpen(false)} className="rounded-md bg-[#ecebe6] py-3 text-center text-sm font-semibold text-[#0a0b0d]">Open terminal</Link>
                                <Link href="/contact?topic=business" onClick={() => setMobileOpen(false)} className="rounded-md border border-[#ecebe6]/18 py-3 text-center text-sm text-[#ecebe6]">Talk to us — for teams</Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            <SymbolSearch
                open={searchOpen}
                onClose={() => setSearchOpen(false)}
                onPick={(s) => router.push(`/app?symbol=${encodeURIComponent(s)}`)}
            />
        </>
    )
}
