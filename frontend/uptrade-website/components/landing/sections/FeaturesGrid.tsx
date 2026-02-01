'use client';

import { Zap, Shield, Globe, BarChart3, Brain, Server } from 'lucide-react';

const features = [
    {
        title: 'Real-time Analysis',
        description: 'Process market data with sub-millisecond latency using our advanced engine.',
        icon: Zap,
    },
    {
        title: 'AI-Powered Insights',
        description: 'Get predictive analytics and sentiment analysis from 50+ data sources.',
        icon: Brain,
    },
    {
        title: 'Institutional Grade',
        description: 'Bank-level security and infrastructure reliability for your trades.',
        icon: Shield,
    },
    {
        title: 'Global Coverage',
        description: 'Access data from major exchanges across 30+ countries instantly.',
        icon: Globe,
    },
    {
        title: 'Advanced Charting',
        description: 'Professional-grade technical analysis tools and indicators.',
        icon: BarChart3,
    },
    {
        title: 'API Access',
        description: 'Direct access to our data streams via robust REST and WebSocket APIs.',
        icon: Server,
    },
];

export const FeaturesGrid = () => {
    return (
        <section className="py-24 px-6 bg-[#0b0e14]">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-white mb-4">Powerful Features</h2>
                    <p className="text-[#868993] max-w-2xl mx-auto">
                        Everything you need to trade like a professional, powered by artificial intelligence.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, idx) => (
                        <div key={idx} className="bg-[#131722] border border-[#2a2e39] rounded-xl p-6 hover:border-[#2962FF] transition-colors group">
                            <div className="w-12 h-12 bg-[#1e222d] rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#2962FF]/10 transition-colors">
                                <feature.icon className="w-6 h-6 text-[#2962FF]" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                            <p className="text-[#868993]">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
