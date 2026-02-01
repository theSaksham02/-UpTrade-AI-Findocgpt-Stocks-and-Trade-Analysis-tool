'use client'

import { Search, Mail, MessageCircle, FileText } from 'lucide-react';
import { LandingHeader } from '@/components/landing/Header';
import { Footer } from '@/components/footer';

const faqs = [
    { q: 'Why is my WebSocket disconnecting frequently?', a: 'Check your connection timeout settings. We recommend implementing exponential backoff reconnection with a max delay of 30 seconds. Also ensure you are sending ping frames every 30 seconds.' },
    { q: 'How do I interpret the PAS (Predictive Alpha Score)?', a: 'PAS ranges 0-100. 70+ is considered strong. Breakdown shows contribution from Fundamental, Sentiment, and Technical factors. Historical backtests show Sharpe 1.8 for top quartile PAS stocks.' },
    { q: 'What exchanges are supported for real-time data?', a: 'US Equities (NYSE, NASDAQ, IEX), Crypto (Coinbase, Binance, Kraken), Forex (OANDA). Options data requires separate OPRA agreement.' },
    { q: 'Can I export historical sentiment data?', a: 'Yes, Professional and Enterprise plans can export via /historical endpoint. CSV, Parquet, and JSON formats supported. Max 5 years lookback.' },
];

export default function SupportPage() {
    return (
        <div className="bg-[#0b0e14] min-h-screen">
            <LandingHeader />

            <section className="pt-32 pb-20 px-6 text-center border-b border-[#2a2e39]">
                <h1 className="text-5xl font-bold text-white mb-6">Support Center</h1>
                <div className="max-w-2xl mx-auto relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#868993]" />
                    <input
                        type="text"
                        placeholder="Search FAQs or documentation..."
                        className="w-full bg-[#131722] border border-[#2a2e39] rounded-xl py-4 pl-12 pr-4 text-white placeholder-[#868993] focus:border-[#2962FF] outline-none"
                    />
                </div>
            </section>

            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto space-y-12">
                    {/* Contact Options */}
                    <div className="grid md:grid-cols-3 gap-6">
                        <a href="#" className="bg-[#131722] border border-[#2a2e39] rounded-xl p-6 text-center hover:border-[#363a45] transition-colors">
                            <Mail className="w-8 h-8 text-[#2962FF] mx-auto mb-3" />
                            <div className="text-white font-medium mb-1">Email Support</div>
                            <div className="text-[#868993] text-sm">Response in 24h</div>
                        </a>
                        <a href="#" className="bg-[#131722] border border-[#2a2e39] rounded-xl p-6 text-center hover:border-[#363a45] transition-colors">
                            <MessageCircle className="w-8 h-8 text-[#089981] mx-auto mb-3" />
                            <div className="text-white font-medium mb-1">Live Chat</div>
                            <div className="text-[#868993] text-sm">Pro & Enterprise</div>
                        </a>
                        <a href="/docs" className="bg-[#131722] border border-[#2a2e39] rounded-xl p-6 text-center hover:border-[#363a45] transition-colors">
                            <FileText className="w-8 h-8 text-[#ff9800] mx-auto mb-3" />
                            <div className="text-white font-medium mb-1">Documentation</div>
                            <div className="text-[#868993] text-sm">Self-service</div>
                        </a>
                    </div>

                    {/* FAQs */}
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-6">Common Questions</h2>
                        <div className="space-y-4">
                            {faqs.map((faq, i) => (
                                <details key={i} className="bg-[#131722] border border-[#2a2e39] rounded-xl group">
                                    <summary className="p-6 cursor-pointer list-none flex items-center justify-between text-white font-medium hover:text-[#2962FF] transition-colors">
                                        {faq.q}
                                        <span className="text-[#868993] group-open:rotate-180 transition-transform">▼</span>
                                    </summary>
                                    <div className="px-6 pb-6 text-[#868993] leading-relaxed">
                                        {faq.a}
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>

                    {/* Still need help */}
                    <div className="bg-[#131722] border border-[#2a2e39] rounded-xl p-8 text-center">
                        <h3 className="text-xl font-bold text-white mb-2">Still need help?</h3>
                        <p className="text-[#868993] mb-6">Our support team is available Monday-Friday, 9am-6pm EST.</p>
                        <a href="mailto:support@uptrade.io" className="inline-block bg-[#2962FF] hover:bg-[#1e53e5] text-white px-6 py-3 rounded-lg font-medium">
                            Contact Support
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};
