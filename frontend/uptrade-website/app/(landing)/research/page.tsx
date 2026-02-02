'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Send } from 'lucide-react';

const filters = ['All', 'Analysis', 'Strategy', 'API Updates'];

const articles = [
    {
        id: 1,
        tag: 'Analysis',
        title: 'TSLA Sentiment Divergence: A Case Study in Early Warning Detection',
        excerpt: 'How our VisualX engine detected a 0.84σ sentiment crash 3 minutes before the price dropped 8%. Breaking down the signal anatomy.',
        date: 'Jan 28, 2026',
        readTime: '8 min',
        featured: true,
        sparkline: [40, 42, 44, 43, 45, 47, 46, 48, 50, 52, 51, 49, 45, 38, 32, 28, 25, 22, 20, 18],
    },
    {
        id: 2,
        tag: 'Strategy',
        title: 'Building a Divergence-Based Trading System with UpTrade API',
        excerpt: 'Step-by-step guide to creating an automated alert system that triggers on sentiment-price divergence signals.',
        date: 'Jan 25, 2026',
        readTime: '12 min',
        featured: false,
        sparkline: [20, 22, 25, 28, 30, 32, 35, 38, 40, 42, 45, 48, 50, 52, 55, 58, 60, 62, 64, 66],
    },
    {
        id: 3,
        tag: 'API Updates',
        title: 'WebSocket v2: Reduced Latency and New Event Types',
        excerpt: 'Announcing our new WebSocket infrastructure with <50ms p99 latency and support for order flow events.',
        date: 'Jan 22, 2026',
        readTime: '5 min',
        featured: false,
        sparkline: [30, 32, 31, 33, 35, 34, 36, 38, 37, 39, 40, 42, 41, 43, 45, 46, 48, 47, 49, 50],
    },
    {
        id: 4,
        tag: 'Analysis',
        title: 'Crypto Market Microstructure: What Order Flow Reveals About BTC',
        excerpt: 'Analyzing on-chain metrics and exchange order flow to understand Bitcoin price action at the micro level.',
        date: 'Jan 18, 2026',
        readTime: '10 min',
        featured: false,
        sparkline: [45, 48, 50, 52, 55, 53, 50, 48, 52, 56, 60, 58, 55, 52, 54, 58, 62, 65, 68, 70],
    },
    {
        id: 5,
        tag: 'Strategy',
        title: 'Factor Fusion: Combining Sentiment, Technical, and On-chain Signals',
        excerpt: 'How our TradeX scoring model uses late-fusion neural networks to weight multiple signal sources by regime.',
        date: 'Jan 15, 2026',
        readTime: '15 min',
        featured: false,
        sparkline: [35, 38, 40, 42, 44, 46, 48, 50, 48, 46, 44, 42, 40, 38, 40, 42, 45, 48, 50, 52],
    },
];

const tagColors: Record<string, string> = {
    'Analysis': 'text-[#00d4ff] bg-[#00d4ff]/10 border-[#00d4ff]/30',
    'Strategy': 'text-[#7c3aed] bg-[#7c3aed]/10 border-[#7c3aed]/30',
    'API Updates': 'text-[#10b981] bg-[#10b981]/10 border-[#10b981]/30',
};

const Sparkline = ({ data }: { data: number[] }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const points = data.map((v, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - ((v - min) / range) * 100;
        return `${x},${y}`;
    }).join(' ');

    const isUp = data[data.length - 1] > data[0];

    return (
        <svg viewBox="0 0 100 100" className="w-20 h-8" preserveAspectRatio="none">
            <polyline
                fill="none"
                stroke={isUp ? '#10b981' : '#ef4444'}
                strokeWidth="2"
                points={points}
            />
        </svg>
    );
};

export default function ResearchPage() {
    const [activeFilter, setActiveFilter] = useState('All');
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const filteredArticles = activeFilter === 'All'
        ? articles
        : articles.filter(a => a.tag === activeFilter);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
            setTimeout(() => setSubscribed(false), 3000);
            setEmail('');
        }
    };

    return (
        <div className="min-h-screen">
            {/* Header */}
            <section className="pt-32 pb-8 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <div className="text-[#00d4ff] font-mono text-sm mb-2 tracking-wider">RESEARCH</div>
                            <h1 className="text-4xl font-bold text-white tracking-tight">
                                Market Intelligence
                            </h1>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
                            </span>
                            <span className="text-[#10b981] font-mono">Markets Open</span>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-2 mb-8">
                        {filters.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-3 py-1.5 text-sm font-mono rounded-full border transition-all ${activeFilter === filter
                                        ? 'bg-[#00d4ff] text-[#0a0a0f] border-[#00d4ff] font-bold'
                                        : 'text-[#868993] border-white/10 hover:border-white/30 hover:text-white'
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Article List */}
            <section className="px-6 pb-16">
                <div className="max-w-4xl mx-auto">
                    <div className="space-y-1">
                        {filteredArticles.map((article, idx) => (
                            <motion.a
                                key={article.id}
                                href={`/research/${article.id}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className={`group block ${article.featured
                                        ? 'border-l-2 border-[#00d4ff] bg-[#13131f]/50 rounded-r-lg'
                                        : 'border-l-2 border-transparent hover:border-white/20'
                                    } p-4 hover:bg-[#13131f]/30 transition-all`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`text-xs px-2 py-0.5 rounded-full border ${tagColors[article.tag]}`}>
                                                {article.tag}
                                            </span>
                                            {article.featured && (
                                                <span className="text-xs text-[#fbbf24] font-mono">Featured</span>
                                            )}
                                        </div>
                                        <h3 className="text-white font-medium text-lg mb-1 group-hover:text-[#00d4ff] transition-colors line-clamp-1">
                                            {article.title}
                                        </h3>
                                        <p className="text-[#868993] text-sm line-clamp-2 mb-2">
                                            {article.excerpt}
                                        </p>
                                        <div className="flex items-center gap-4 text-xs text-[#868993] font-mono">
                                            <span>{article.date}</span>
                                            <span>•</span>
                                            <span>{article.readTime} read</span>
                                            <span className="ml-auto text-[#00d4ff] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                                Read <ArrowRight className="w-3 h-3" />
                                            </span>
                                        </div>
                                    </div>
                                    <div className="hidden sm:block shrink-0">
                                        <Sparkline data={article.sparkline} />
                                    </div>
                                </div>
                            </motion.a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="px-6 pb-24">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-[#13131f] border border-white/10 rounded-lg p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-[#868993] font-mono text-sm">$</span>
                            <span className="text-white font-mono">subscribe --to research-digest</span>
                        </div>
                        <form onSubmit={handleSubscribe} className="flex gap-2">
                            <div className="flex-1 relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#868993] font-mono text-sm">
                                    email:
                                </span>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full bg-[#0a0a0f] border border-white/10 text-white px-4 py-2.5 pl-16 rounded font-mono text-sm focus:outline-none focus:border-[#00d4ff] placeholder:text-[#868993]/50"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-4 py-2.5 bg-[#00d4ff] text-[#0a0a0f] font-mono font-bold text-sm rounded hover:bg-[#00b8d9] transition-colors flex items-center gap-2"
                            >
                                <Send className="w-4 h-4" />
                                Send
                            </button>
                        </form>
                        {subscribed && (
                            <div className="mt-3 text-[#10b981] text-sm font-mono">
                                ✓ Subscribed successfully [{new Date().toISOString()}]
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
