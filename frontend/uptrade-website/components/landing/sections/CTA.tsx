'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const CTA = () => {
    return (
        <section className="py-24 px-6 bg-gradient-to-b from-[#0b0e14] to-[#131722]">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    Ready to start trading smarter?
                </h2>
                <p className="text-xl text-[#868993] mb-10 max-w-2xl mx-auto">
                    Join thousands of traders who are using UpTrade's AI-powered insights to outperform the market.
                </p>
                <div className="flex items-center justify-center gap-4">
                    <Link
                        href="/signup"
                        className="bg-[#2962FF] hover:bg-[#1e53e5] text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2"
                    >
                        Get Started Free <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link
                        href="/features"
                        className="bg-[#1e222d] hover:bg-[#2a2e39] text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors border border-[#2a2e39]"
                    >
                        View Features
                    </Link>
                </div>
            </div>
        </section>
    );
};
