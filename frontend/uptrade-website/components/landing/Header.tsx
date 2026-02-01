'use client';

import { useState, useEffect } from 'react';
import { Activity, ChevronDown, Command, Menu, X } from 'lucide-react';
import Link from 'next/link';

export const LandingHeader = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 w-[95vw] max-w-7xl transition-all duration-300`}>
            <div className={`rounded-full border px-6 py-3 transition-all duration-300 ${scrolled
                ? 'bg-[#0b0e14]/80 backdrop-blur-xl border-[#2a2e39] shadow-2xl'
                : 'bg-[#0b0e14]/60 backdrop-blur-md border-transparent hover:bg-[#0b0e14]/80 hover:border-[#2a2e39]'
                }`}>
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#2962FF] rounded-lg flex items-center justify-center">
                            <Activity className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-white font-bold text-xl">UpTrade</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8">
                        <div className="relative group">
                            <button className="flex items-center gap-1 text-[#868993] hover:text-white text-sm font-medium py-2">
                                Product <ChevronDown className="w-4 h-4" />
                            </button>
                            <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                <div className="bg-[#131722]/80 backdrop-blur-md border border-[#2a2e39]/50 rounded-lg shadow-xl py-2 w-48 overflow-hidden">
                                    <Link href="/features" className="block px-4 py-2 text-sm text-[#868993] hover:text-white hover:bg-[#1e222d] transition-colors">Features</Link>
                                    <Link href="/tradex" className="block px-4 py-2 text-sm text-[#868993] hover:text-white hover:bg-[#1e222d] transition-colors">TradeX</Link>
                                    <Link href="/visualx" className="block px-4 py-2 text-sm text-[#868993] hover:text-white hover:bg-[#1e222d] transition-colors">VisualX</Link>
                                    <Link href="/ai-analysis" className="block px-4 py-2 text-sm text-[#868993] hover:text-white hover:bg-[#1e222d] transition-colors">AI Analysis</Link>
                                </div>
                            </div>
                        </div>

                        <div className="relative group">
                            <button className="flex items-center gap-1 text-[#868993] hover:text-white text-sm font-medium py-2">
                                Solutions <ChevronDown className="w-4 h-4" />
                            </button>
                            <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                <div className="bg-[#131722]/80 backdrop-blur-md border border-[#2a2e39]/50 rounded-lg shadow-xl py-2 w-48 overflow-hidden">
                                    <Link href="/docs" className="block px-4 py-2 text-sm text-[#868993] hover:text-white hover:bg-[#1e222d] transition-colors">For Developers</Link>
                                    <Link href="/pricing" className="block px-4 py-2 text-sm text-[#868993] hover:text-white hover:bg-[#1e222d] transition-colors">For Traders</Link>
                                    <Link href="/api-page" className="block px-4 py-2 text-sm text-[#868993] hover:text-white hover:bg-[#1e222d] transition-colors">For Institutions</Link>
                                </div>
                            </div>
                        </div>

                        <Link href="/pricing" className="text-[#868993] hover:text-white text-sm font-medium">Pricing</Link>

                        <div className="relative group">
                            <button className="flex items-center gap-1 text-[#868993] hover:text-white text-sm font-medium py-2">
                                Developers <ChevronDown className="w-4 h-4" />
                            </button>
                            <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                <div className="bg-[#131722]/80 backdrop-blur-md border border-[#2a2e39]/50 rounded-lg shadow-xl py-2 w-48 overflow-hidden">
                                    <Link href="/docs" className="block px-4 py-2 text-sm text-[#868993] hover:text-white hover:bg-[#1e222d] transition-colors">Documentation</Link>
                                    <Link href="/api-page" className="block px-4 py-2 text-sm text-[#868993] hover:text-white hover:bg-[#1e222d] transition-colors">API Reference</Link>
                                </div>
                            </div>
                        </div>

                        <div className="relative group">
                            <button className="flex items-center gap-1 text-[#868993] hover:text-white text-sm font-medium py-2">
                                Company <ChevronDown className="w-4 h-4" />
                            </button>
                            <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                <div className="bg-[#131722]/80 backdrop-blur-md border border-[#2a2e39]/50 rounded-lg shadow-xl py-2 w-48 overflow-hidden">
                                    <Link href="/about" className="block px-4 py-2 text-sm text-[#868993] hover:text-white hover:bg-[#1e222d] transition-colors">About Us</Link>
                                    <Link href="/blog" className="block px-4 py-2 text-sm text-[#868993] hover:text-white hover:bg-[#1e222d] transition-colors">Blog</Link>
                                    <Link href="/careers" className="block px-4 py-2 text-sm text-[#868993] hover:text-white hover:bg-[#1e222d] transition-colors">Careers</Link>
                                </div>
                            </div>
                        </div>
                    </nav>

                    <div className="hidden md:flex items-center gap-4">
                        <button className="flex items-center gap-2 px-3 py-1.5 bg-[#1e222d] border border-[#363a45] rounded-lg text-[#868993] hover:text-white transition-colors">
                            <Command className="w-4 h-4" />
                            <span className="text-xs">K</span>
                        </button>
                        <Link href="/login" className="text-[#868993] hover:text-white text-sm font-medium transition-colors">
                            Sign In
                        </Link>
                        <Link
                            href="/app"
                            className="bg-[#2962FF] hover:bg-[#1e53e5] text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-blue-900/20"
                        >
                            Launch Platform
                        </Link>
                    </div>

                    <button className="md:hidden text-white" onClick={() => setMobileOpen(!mobileOpen)}>
                        {mobileOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {mobileOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 mx-6 bg-[#131722] border border-[#2a2e39] rounded-xl p-4 shadow-2xl animate-in slide-in-from-top-2">
                    <div className="flex flex-col gap-4">
                        <Link href="/features" className="text-[#868993] hover:text-white" onClick={() => setMobileOpen(false)}>Features</Link>
                        <Link href="/pricing" className="text-[#868993] hover:text-white" onClick={() => setMobileOpen(false)}>Pricing</Link>
                        <Link href="/docs" className="text-[#868993] hover:text-white" onClick={() => setMobileOpen(false)}>Docs</Link>
                        <Link href="/about" className="text-[#868993] hover:text-white" onClick={() => setMobileOpen(false)}>About</Link>
                        <hr className="border-[#2a2e39]" />
                        <Link href="/login" className="text-[#868993] hover:text-white" onClick={() => setMobileOpen(false)}>Sign In</Link>
                        <Link href="/app" className="bg-[#2962FF] text-white text-center py-3 rounded-lg font-medium" onClick={() => setMobileOpen(false)}>
                            Launch Platform
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
};
