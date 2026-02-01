'use client'

import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { LandingHeader } from '@/components/landing/Header';
// Footer handled by layout

const posts = [
    {
        title: 'Detecting Liquidity Divergences: A Quantitative Approach',
        excerpt: 'How we used statistical arbitrage techniques to identify early warning signals with 73% accuracy across 50,000 events.',
        category: 'Research',
        readTime: '12 min',
        date: 'Mar 15, 2024',
        author: 'Alex Chen',
        slug: 'liquidity-divergences'
    },
    {
        title: 'Scaling Vector Search to 50 Billion Embeddings',
        excerpt: 'Architecture decisions behind our sentiment similarity engine: HNSW vs IVF, quantization strategies, and sharding approaches.',
        category: 'Engineering',
        readTime: '18 min',
        date: 'Mar 8, 2024',
        author: 'Sarah Miller',
        slug: 'vector-search-scale'
    },
    {
        title: 'Fine-Tuning DistilBERT for Financial Sentiment',
        excerpt: 'Domain adaptation techniques, dataset construction from 2.3M labeled examples, and evaluation metrics beyond accuracy.',
        category: 'Machine Learning',
        readTime: '15 min',
        date: 'Feb 28, 2024',
        author: 'Dr. James Park',
        slug: 'financial-sentiment-bert'
    },
    {
        title: 'The Regime-Adjusted Factor Model',
        excerpt: 'Why static factor weights fail in volatile markets. Our dynamic attention mechanism for bull/bear/volatile classification.',
        category: 'Quantitative',
        readTime: '10 min',
        date: 'Feb 20, 2024',
        author: 'Alex Chen',
        slug: 'regime-factor-model'
    }
];

export default function BlogPage() {
    return (
        <div className="bg-transparent min-h-screen">
            <LandingHeader />

            <section className="pt-32 pb-20 px-6 border-b border-[#2a2e39]/30">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-5xl font-bold text-white mb-6">Engineering & Research</h1>
                    <p className="text-xl text-[#868993]">
                        Deep dives into the systems, models, and quantitative methods powering Uptrade.
                    </p>
                </div>
            </section>

            <section className="py-24 px-6">
                <div className="max-w-5xl mx-auto grid gap-8">
                    {posts.map((post) => (
                        <article key={post.slug} className="bg-[#131722]/40 backdrop-blur-md border border-[#2a2e39]/50 rounded-xl p-8 hover:border-[#363a45] transition-colors group cursor-pointer">
                            <div className="flex items-center gap-4 text-sm text-[#868993] mb-4">
                                <span className="text-[#2962FF] font-medium">{post.category}</span>
                                <span>·</span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" /> {post.date}
                                </span>
                                <span>·</span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" /> {post.readTime}
                                </span>
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-[#2962FF] transition-colors">
                                {post.title}
                            </h2>
                            <p className="text-[#868993] mb-4 leading-relaxed">{post.excerpt}</p>

                            <div className="flex items-center justify-between">
                                <div className="text-sm text-[#868993]">By {post.author}</div>
                                <div className="flex items-center gap-2 text-[#2962FF] text-sm font-medium group-hover:gap-3 transition-all">
                                    Read article <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    );
};
