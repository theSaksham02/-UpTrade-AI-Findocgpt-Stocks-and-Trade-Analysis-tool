'use client'

import { useRef } from 'react';
import {
    Zap, Shield, Globe, Clock,
    BarChart3, Brain, Server, Lock,
    ChevronRight, ExternalLink
} from 'lucide-react';
import { motion, useInView } from 'framer-motion';
// Header and Footer handled by layout

const features = [
    {
        category: 'Data Infrastructure',
        icon: Server,
        items: [
            {
                title: 'Multi-Source Data Fusion',
                desc: 'Real-time ingestion from 13 exchanges, 50+ news sources, Twitter, Reddit, SEC EDGAR filings. Unified schema with sub-100ms latency.',
                stat: '1.2M messages/sec',
                tech: 'Kafka + Redis Streams'
            },
            {
                title: 'Vector Database',
                desc: '384-dimensional embeddings for every market event. Query semantic similarity across 50B+ vectors in <50ms using HNSW indexing.',
                stat: '99.97% recall@10',
                tech: 'Weaviate + Pinecone'
            },
            {
                title: 'Time-Series Optimization',
                desc: 'Tick-level historical data compressed using Gorilla encoding. Query 5 years of minute bars in 200ms.',
                stat: '50TB compressed to 800GB',
                tech: 'TimescaleDB + Parquet'
            }
        ]
    },
    {
        category: 'AI/ML Engine',
        icon: Brain,
        items: [
            {
                title: 'DistilBERT Sentiment',
                desc: 'Fine-tuned on 2.3M financial social posts. Classifies bullish/bearish/neutral with 89.3% accuracy. GPU-accelerated inference.',
                stat: '<10ms inference',
                tech: 'PyTorch + ONNX Runtime'
            },
            {
                title: 'Divergence Detection',
                desc: 'Statistical arbitrage signals when price-s correlation breaks down. Z-score >2.5 triggers alerts with 73% directional accuracy.',
                stat: '50,000+ backtests',
                tech: 'Pandas + NumPy + SciPy'
            },
            {
                title: 'Factor Fusion',
                desc: 'Late-fusion neural network combines fundamental, technical, sentiment factors. Attention mechanism weights by market regime.',
                stat: 'Sharpe 1.8 vs 0.9 buy-hold',
                tech: 'PyTorch LSTM + Transformer'
            }
        ]
    },
    {
        category: 'Execution & Alerts',
        icon: Zap,
        items: [
            {
                title: 'WebSocket Streaming',
                desc: 'Persistent connections with automatic reconnection. Message ordering guarantees, compression via permessage-deflate.',
                stat: '<50ms p99 latency',
                tech: 'uWebSockets + Socket.io'
            },
            {
                title: 'Smart Alerts',
                desc: 'Compound conditions: "Alert if AAPL sentiment drops >20% AND price holds within 0.5% for 5 minutes."',
                stat: '12M alerts/day processed',
                tech: 'Custom rule engine'
            },
            {
                title: 'Backtest Engine',
                desc: 'Event-driven simulation with slippage modeling. Walk-forward analysis, Monte Carlo validation, regime detection.',
                stat: '10 years data, 1min resolution',
                tech: 'Vectorized Python'
            }
        ]
    }
];

export default function FeaturesPage() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <div className="bg-transparent min-h-screen">
            {/* LandingHeader handled by layout */}

            {/* Hero */}
            <section className="pt-32 pb-20 px-6 border-b border-[#2a2e39]">
                <div className="max-w-5xl mx-auto">
                    <div className="text-[#2962FF] font-mono text-sm mb-4 tracking-wider">PLATFORM OVERVIEW</div>
                    <h1 className="text-5xl font-bold text-white mb-6">Infrastructure for Serious Traders</h1>
                    <p className="text-xl text-[#868993] max-w-3xl leading-relaxed">
                        Uptrade combines institutional-grade data infrastructure with cutting-edge AI.
                        From real-time sentiment streams to vector-based similarity search, every component
                        is optimized for sub-100ms response times.
                    </p>

                    <div className="flex items-center gap-8 mt-12 border-t border-[#2a2e39] pt-8">
                        <div>
                            <div className="text-3xl font-bold text-white font-mono">99.99%</div>
                            <div className="text-sm text-[#868993]">API Uptime</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white font-mono">&lt;50ms</div>
                            <div className="text-sm text-[#868993]">P99 Latency</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white font-mono">50B+</div>
                            <div className="text-sm text-[#868993]">Vectors Indexed</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Detailed Features */}
            <section ref={ref} className="py-24 px-6">
                <div className="max-w-6xl mx-auto space-y-32">
                    {features.map((section, sectionIdx) => (
                        <div key={section.category}>
                            <div className="flex items-center gap-4 mb-12">
                                <div className="w-12 h-12 bg-[#1e222d]/40 backdrop-blur-md rounded-xl flex items-center justify-center border border-[#2a2e39]/50">
                                    <section.icon className="w-6 h-6 text-[#2962FF]" />
                                </div>
                                <h2 className="text-3xl font-bold text-white">{section.category}</h2>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                {section.items.map((item, idx) => (
                                    <motion.div
                                        key={item.title}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                                        transition={{ delay: idx * 0.1 + sectionIdx * 0.2 }}
                                        className="group bg-[#131722]/40 backdrop-blur-md border border-[#2a2e39]/50 rounded-xl p-6 hover:border-[#363a45] transition-colors"
                                    >
                                        <h3 className="text-lg font-bold text-white mb-3 group-hover:text-[#2962FF] transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-[#868993] text-sm leading-relaxed mb-6">
                                            {item.desc}
                                        </p>

                                        <div className="space-y-3 border-t border-[#2a2e39] pt-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-[#868993] uppercase tracking-wider">Performance</span>
                                                <span className="text-[#089981] font-mono text-sm font-bold">{item.stat}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-[#868993] uppercase tracking-wider">Stack</span>
                                                <span className="text-[#d1d4dc] font-mono text-xs">{item.tech}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Architecture Diagram */}
            <section className="py-24 px-6 bg-[#131722]/20 backdrop-blur-sm border-y border-[#2a2e39]/30">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold text-white text-center mb-12">System Architecture</h2>

                    <div className="bg-[#0b0e14]/40 backdrop-blur-md rounded-xl p-8 border border-[#2a2e39]/50 font-mono text-sm">
                        <div className="grid grid-cols-4 gap-4 text-center">
                            <div className="space-y-2">
                                <div className="bg-[#1e222d]/60 backdrop-blur-sm rounded p-3 text-[#2962FF]">Sources</div>
                                <div className="text-[#868993] text-xs space-y-1">
                                    <div>Polygon.io</div>
                                    <div>Finnhub</div>
                                    <div>Twitter API</div>
                                    <div>Reddit</div>
                                    <div>SEC EDGAR</div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="bg-[#1e222d]/60 backdrop-blur-sm rounded p-3 text-[#089981]">Ingestion</div>
                                <div className="text-[#868993] text-xs space-y-1">
                                    <div>Kafka Topics</div>
                                    <div>Redis Streams</div>
                                    <div>WebSocket</div>
                                    <div>REST API</div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="bg-[#1e222d] rounded p-3 text-[#ff9800]">Processing</div>
                                <div className="text-[#868993] text-xs space-y-1">
                                    <div>DistilBERT</div>
                                    <div>LSTM Networks</div>
                                    <div>Vector DB</div>
                                    <div>Time-Series</div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="bg-[#1e222d] rounded p-3 text-[#d1d4dc]">Delivery</div>
                                <div className="text-[#868993] text-xs space-y-1">
                                    <div>WebSocket</div>
                                    <div>SSE</div>
                                    <div>REST API</div>
                                    <div>Webhooks</div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-[#2a2e39] text-center text-[#868993] text-xs">
                            End-to-end latency: 47ms (p99) | Throughput: 1.2M events/sec | Availability: 99.99%
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-6 text-center">
                <h2 className="text-3xl font-bold text-white mb-6">Ready to dive deeper?</h2>
                <p className="text-[#868993] mb-8">Explore our API or launch the platform to see it in action.</p>
                <div className="flex items-center justify-center gap-4">
                    <a href="/api" className="bg-[#2962FF] hover:bg-[#1e53e5] text-white px-6 py-3 rounded-lg font-medium">
                        View API Docs
                    </a>
                    <a href="/app" className="text-white border border-[#2a2e39] hover:border-[#868993] px-6 py-3 rounded-lg font-medium flex items-center gap-2">
                        Launch Platform <ExternalLink className="w-4 h-4" />
                    </a>
                </div>
            </section>

            {/* Footer handled by layout */}
        </div>
    );
};
