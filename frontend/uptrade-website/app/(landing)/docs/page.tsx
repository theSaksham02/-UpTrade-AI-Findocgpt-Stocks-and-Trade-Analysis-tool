'use client'

import { Search, Book, Code, Zap, Terminal } from 'lucide-react';
import { LandingHeader } from '@/components/landing/Header';
// Footer handled by layout

const docs = [
    {
        category: 'Getting Started',
        icon: Zap,
        items: [
            { title: 'Quick Start', desc: 'Your first API request in 5 minutes' },
            { title: 'Authentication', desc: 'API keys and OAuth2 flow' },
            { title: 'Rate Limits', desc: 'Understanding quotas and headers' },
            { title: 'Error Handling', desc: 'Status codes and retry logic' },
        ]
    },
    {
        category: 'REST API',
        icon: Terminal,
        items: [
            { title: 'Sentiment', desc: 'Aggregate and historical endpoints' },
            { title: 'Divergence', desc: 'Alert configuration and history' },
            { title: 'Comparison', desc: 'Multi-factor scoring' },
            { title: 'Stocks', desc: 'Quotes, fundamentals, technicals' },
        ]
    },
    {
        category: 'WebSocket',
        icon: Code,
        items: [
            { title: 'Streaming Protocol', desc: 'Connection and authentication' },
            { title: 'Subscriptions', desc: 'Managing symbol lists' },
            { title: 'Message Format', desc: 'Event types and schemas' },
            { title: 'Reconnection', desc: 'Handling disconnections' },
        ]
    },
    {
        category: 'SDKs',
        icon: Book,
        items: [
            { title: 'Python SDK', desc: 'pip install uptrade-api' },
            { title: 'JavaScript SDK', desc: 'npm install @uptrade/sdk' },
            { title: 'Rust SDK', desc: 'cargo add uptrade' },
            { title: 'Webhooks', desc: 'Receiving server-side events' },
        ]
    },
];

export default function DocsPage() {
    return (
        <div className="bg-transparent min-h-screen">
            <LandingHeader />

            <section className="pt-32 pb-20 px-6 text-center border-b border-[#2a2e39]">
                <h1 className="text-5xl font-bold text-white mb-6">Documentation</h1>
                <p className="text-xl text-[#868993] mb-8">Everything you need to integrate Uptrade into your workflow.</p>

                <div className="max-w-2xl mx-auto relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#868993]" />
                    <input
                        type="text"
                        placeholder="Search documentation..."
                        className="w-full bg-[#131722]/40 backdrop-blur-md border border-[#2a2e39]/50 rounded-xl py-4 pl-12 pr-4 text-white placeholder-[#868993] focus:border-[#2962FF] outline-none"
                    />
                </div>
            </section>

            <section className="py-24 px-6">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
                    {docs.map((section) => (
                        <div key={section.category} className="bg-[#131722]/40 backdrop-blur-md border border-[#2a2e39]/50 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <section.icon className="w-6 h-6 text-[#2962FF]" />
                                <h2 className="text-xl font-bold text-white">{section.category}</h2>
                            </div>

                            <div className="space-y-3">
                                {section.items.map((item) => (
                                    <a
                                        key={item.title}
                                        href="#"
                                        className="block p-4 rounded-lg hover:bg-[#1e222d] transition-colors group"
                                    >
                                        <div className="text-white font-medium group-hover:text-[#2962FF] transition-colors mb-1">
                                            {item.title}
                                        </div>
                                        <div className="text-[#868993] text-sm">{item.desc}</div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

// Footer removed (handled by layout)
        </div>
    );
};
