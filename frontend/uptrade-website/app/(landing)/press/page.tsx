'use client'

import { Download, ExternalLink, Mail } from 'lucide-react';
import { LandingHeader } from '@/components/landing/Header';
import { Footer } from '@/components/footer';

const logos = [
    { name: 'Logo Dark (PNG)', size: '24 KB', url: '/press/logo-dark.png' },
    { name: 'Logo Light (PNG)', size: '24 KB', url: '/press/logo-light.png' },
    { name: 'Logo Vector (SVG)', size: '8 KB', url: '/press/logo.svg' },
    { name: 'Icon Only (PNG)', size: '12 KB', url: '/press/icon.png' },
];

const mediaMentions = [
    { outlet: 'TechCrunch', title: 'UpTrade raises $12M to democratize quant trading tools', date: 'Jan 15, 2024', url: '#' },
    { outlet: 'Bloomberg', title: 'Retail traders get institutional-grade sentiment analysis', date: 'Feb 3, 2024', url: '#' },
    { outlet: 'Wired', title: 'The AI models predicting market moves from Twitter sentiment', date: 'Mar 8, 2024', url: '#' },
];

const brandColors = [
    { name: 'UpTrade Blue', hex: '#2962FF', usage: 'Primary actions, links' },
    { name: 'Bull Green', hex: '#089981', usage: 'Positive movement, success' },
    { name: 'Bear Red', hex: '#f23645', usage: 'Negative movement, alerts' },
    { name: 'Dark Background', hex: '#0b0e14', usage: 'App background' },
];

export default function PressPage() {
    return (
        <div className="bg-[#0b0e14] min-h-screen">
            <LandingHeader />

            <section className="pt-32 pb-20 px-6 text-center border-b border-[#2a2e39]">
                <h1 className="text-5xl font-bold text-white mb-6">Press Kit</h1>
                <p className="text-xl text-[#868993]">Download brand assets, read our story, and get in touch.</p>
            </section>

            <div className="max-w-5xl mx-auto px-6 py-24 space-y-24">
                {/* Logos */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-8">Brand Assets</h2>
                    <div className="grid md:grid-cols-4 gap-6">
                        {logos.map((logo) => (
                            <div key={logo.name} className="bg-[#131722] border border-[#2a2e39] rounded-xl p-6 text-center">
                                <div className="w-16 h-16 bg-[#2962FF] rounded-lg mx-auto mb-4" />
                                <div className="text-white text-sm font-medium mb-1">{logo.name}</div>
                                <div className="text-[#868993] text-xs mb-4">{logo.size}</div>
                                <button className="text-[#2962FF] text-sm flex items-center justify-center gap-1 mx-auto">
                                    <Download className="w-4 h-4" /> Download
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Colors */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-8">Brand Colors</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {brandColors.map((color) => (
                            <div key={color.name} className="flex items-center gap-4 bg-[#131722] border border-[#2a2e39] rounded-xl p-4">
                                <div className="w-16 h-16 rounded-lg" style={{ backgroundColor: color.hex }} />
                                <div>
                                    <div className="text-white font-medium">{color.name}</div>
                                    <div className="text-[#868993] font-mono text-sm">{color.hex}</div>
                                    <div className="text-[#868993] text-xs mt-1">{color.usage}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Coverage */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-8">Media Coverage</h2>
                    <div className="space-y-4">
                        {mediaMentions.map((article) => (
                            <a
                                key={article.title}
                                href={article.url}
                                className="flex items-center justify-between bg-[#131722] border border-[#2a2e39] rounded-xl p-6 hover:border-[#363a45] transition-colors"
                            >
                                <div>
                                    <div className="text-[#2962FF] text-sm font-medium mb-1">{article.outlet}</div>
                                    <div className="text-white font-medium">{article.title}</div>
                                    <div className="text-[#868993] text-sm">{article.date}</div>
                                </div>
                                <ExternalLink className="w-5 h-5 text-[#868993]" />
                            </a>
                        ))}
                    </div>
                </section>

                {/* Contact */}
                <section className="bg-[#131722] border border-[#2a2e39] rounded-2xl p-8 text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Media Inquiries</h2>
                    <p className="text-[#868993] mb-6">For press kits, interview requests, or speaking opportunities</p>
                    <a href="mailto:press@uptrade.io" className="inline-flex items-center gap-2 bg-[#2962FF] hover:bg-[#1e53e5] text-white px-6 py-3 rounded-lg font-medium">
                        <Mail className="w-5 h-5" /> press@uptrade.io
                    </a>
                </section>
            </div>

            <Footer />
        </div>
    );
};
