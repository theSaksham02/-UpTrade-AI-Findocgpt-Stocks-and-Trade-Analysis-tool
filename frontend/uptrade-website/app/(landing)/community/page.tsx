'use client'

import { MessageCircle, Github, Twitter, Disc, Users, Award } from 'lucide-react';
import { LandingHeader } from '@/components/landing/Header';
// Footer handled by layout

const channels = [
    { name: 'Discord', members: '4,200+', icon: Disc, desc: 'Real-time chat, strategy sharing, and support' },
    { name: 'Twitter/X', members: '12,500+', icon: Twitter, desc: 'Product updates, market insights, and memes' },
    { name: 'GitHub', members: '850 stars', icon: Github, desc: 'Open-source SDKs, issue tracking, contributions' },
];

const leaderboard = [
    { rank: 1, name: 'QuantTrader_99', contribution: 'Divergence strategy backtest', impact: '2,400 users using' },
    { rank: 2, name: 'ML_Engineer', contribution: 'Custom sentiment model', impact: 'Published in docs' },
    { rank: 3, name: 'AlphaSeeker', contribution: 'Bug bounty: WebSocket reconnection', impact: 'Fixed in v2.1' },
];

export default function CommunityPage() {
    return (
        <div className="bg-[#0b0e14] min-h-screen">
            <LandingHeader />

            <section className="pt-32 pb-20 px-6 text-center border-b border-[#2a2e39]">
                <h1 className="text-5xl font-bold text-white mb-6">Community</h1>
                <p className="text-xl text-[#868993] max-w-2xl mx-auto">
                    Join 4,000+ traders, quants, and developers building the future of market intelligence.
                </p>
            </section>

            <section className="py-24 px-6">
                <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mb-24">
                    {channels.map((channel) => (
                        <a
                            key={channel.name}
                            href="#"
                            className="bg-[#131722]/40 backdrop-blur-md border border-[#2a2e39]/50 rounded-xl p-8 text-center hover:border-[#363a45] transition-colors group"
                        >
                            <channel.icon className="w-12 h-12 text-[#2962FF] mx-auto mb-4 group-hover:scale-110 transition-transform" />
                            <h3 className="text-xl font-bold text-white mb-2">{channel.name}</h3>
                            <div className="text-[#089981] font-mono text-sm mb-3">{channel.members}</div>
                            <p className="text-[#868993] text-sm">{channel.desc}</p>
                        </a>
                    ))}
                </div>

                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-white mb-8 text-center">Top Contributors</h2>
                    <div className="space-y-4">
                        {leaderboard.map((user) => (
                            <div key={user.name} className="flex items-center gap-4 bg-[#131722] border border-[#2a2e39] rounded-xl p-6">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${user.rank === 1 ? 'bg-[#ff9800] text-black' :
                                    user.rank === 2 ? 'bg-[#868993] text-black' :
                                        'bg-[#2a2e39] text-white'
                                    }`}>
                                    {user.rank}
                                </div>
                                <div className="flex-1">
                                    <div className="text-white font-medium">{user.name}</div>
                                    <div className="text-[#868993] text-sm">{user.contribution}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[#089981] text-sm font-medium">{user.impact}</div>
                                    <Award className="w-5 h-5 text-[#ff9800] ml-auto mt-1" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

// Footer removed (handled by layout)
        </div>
    );
};
