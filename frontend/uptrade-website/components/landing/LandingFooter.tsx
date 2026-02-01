'use client';

import Link from 'next/link';
import { Activity } from 'lucide-react';

export const LandingFooter = () => (
    <footer className="bg-[#0b0e14] border-t border-[#2a2e39] py-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-[#2962FF] rounded-lg flex items-center justify-center">
                        <Activity className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white font-bold text-xl">UpTrade</span>
                </div>
                <p className="text-[#868993] text-sm">
                    Decision Intelligence Engine for modern traders.
                </p>
            </div>

            <div>
                <h4 className="text-white font-bold mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-[#868993]">
                    <li><Link href="/features" className="hover:text-white">Features</Link></li>
                    <li><Link href="/ai-analysis" className="hover:text-white">AI Analysis</Link></li>
                    <li><Link href="/performance" className="hover:text-white">Performance</Link></li>
                    <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                </ul>
            </div>

            <div>
                <h4 className="text-white font-bold mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-[#868993]">
                    <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                    <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                    <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
                    <li><Link href="/press" className="hover:text-white">Press Kit</Link></li>
                </ul>
            </div>

            <div>
                <h4 className="text-white font-bold mb-4">Resources</h4>
                <ul className="space-y-2 text-sm text-[#868993]">
                    <li><Link href="/docs" className="hover:text-white">Documentation</Link></li>
                    <li><Link href="/api-page" className="hover:text-white">API Reference</Link></li>
                    <li><Link href="/community" className="hover:text-white">Community</Link></li>
                    <li><Link href="/support" className="hover:text-white">Support</Link></li>
                </ul>
            </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-[#2a2e39] flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[#868993]">
            <div>© 2024 UpTrade. All rights reserved.</div>
            <div className="flex gap-6">
                <Link href="/privacy" className="hover:text-white">Privacy</Link>
                <Link href="/terms" className="hover:text-white">Terms</Link>
                <Link href="/cookies" className="hover:text-white">Cookies</Link>
                <Link href="/disclaimer" className="hover:text-white">Disclaimer</Link>
            </div>
        </div>
    </footer>
);
