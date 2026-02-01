'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue } from 'framer-motion';
import {
    Activity, ArrowRight, Check, X,
    BarChart2, Zap, Globe, Shield,
    Linkedin, Twitter, Github, MousePointer2
} from 'lucide-react';
import { LandingHeader } from '@/components/landing/Header';

// =========================================
// COMPONENT: Floating Organic Blobs (Background)
// =========================================
const FloatingBlobs = () => {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#0a1628_0%,_#02040a_50%)]" />
            <div className="absolute inset-0 opacity-[0.03]">
                <svg className="w-full h-full">
                    <filter id="noise">
                        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#noise)" />
                </svg>
            </div>

            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                    x: [0, 100, 0],
                    y: [0, -50, 0],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 left-1/4 w-[600px] h-[600px]"
                style={{
                    background: 'radial-gradient(circle, rgba(41,98,255,0.2) 0%, transparent 70%)',
                    filter: 'blur(60px)',
                    mixBlendMode: 'screen'
                }}
            />

            <motion.div
                animate={{
                    scale: [1.2, 1, 1.2],
                    rotate: [90, 0, 90],
                    x: [0, -100, 0],
                    y: [0, 100, 0],
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px]"
                style={{
                    background: 'radial-gradient(circle, rgba(8,153,129,0.15) 0%, transparent 70%)',
                    filter: 'blur(80px)',
                    mixBlendMode: 'screen'
                }}
            />
        </div>
    );
};

// =========================================
// COMPONENT: 3D Team Card (V2 Style)
// =========================================
const TeamCard = ({ member, index }: any) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative group perspective-1000 h-96 w-full"
        >
            <motion.div
                animate={{ rotateY: isHovered ? 180 : 0 }}
                transition={{ duration: 0.6 }}
                className="relative w-full h-full preserve-3d cursor-pointer"
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Front */}
                <div className="absolute inset-0 backface-hidden">
                    <div className="h-full glass-v2 rounded-2xl p-6 flex flex-col items-center justify-center border border-white/5 hover:border-[#2962FF]/30 transition-colors">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#2962FF] to-[#089981] p-[2px] mb-6">
                            <div className="w-full h-full rounded-full bg-[#0b0e14] flex items-center justify-center overflow-hidden">
                                {/* Placeholder for real image */}
                                <span className="text-2xl font-bold text-white">{member.initials}</span>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                        <p className="text-[#2962FF] text-sm mb-4">{member.role}</p>
                        <p className="text-white/60 text-sm text-center leading-relaxed">{member.bio}</p>
                    </div>
                </div>

                {/* Back */}
                <div
                    className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden"
                    style={{ transform: 'rotateY(180deg)' }}
                >
                    <div className="h-full bg-gradient-to-br from-[#2962FF] to-[#0a1628] p-6 flex flex-col justify-center text-white text-center border border-white/10">
                        <h4 className="text-lg font-bold mb-4">Core Focus</h4>
                        <div className="space-y-4">
                            {member.focus.map((item: string) => (
                                <div key={item} className="bg-black/20 rounded-lg py-2 px-3 text-sm backdrop-blur-sm">
                                    {item}
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 flex justify-center gap-4">
                            <Linkedin className="w-5 h-5 opacity-70 hover:opacity-100 cursor-pointer" />
                            <Twitter className="w-5 h-5 opacity-70 hover:opacity-100 cursor-pointer" />
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// =========================================
// MAIN PAGE COMPONENT
// =========================================
export default function AboutPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef });

    const yHero = useTransform(scrollYProgress, [0, 0.2], [0, -100]);
    const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

    return (
        <div ref={containerRef} className="min-h-screen relative text-white selection:bg-[#2962FF]/30">
            <FloatingBlobs />
            <LandingHeader />

            {/* =========================================
          HERO SECTION
      ========================================= */}
            <section className="relative min-h-[90vh] flex flex-col justify-center items-center pt-20 px-6">
                <motion.div
                    style={{ y: yHero, opacity: opacityHero }}
                    className="text-center max-w-5xl mx-auto z-10"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
                        <span className="w-2 h-2 rounded-full bg-[#089981] animate-pulse" />
                        <span className="text-xs font-medium tracking-wider text-white/80">SYSTEM ONLINE • V2.4.0</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 leading-[0.9]">
                        Decision Intelligence
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2962FF] via-[#2962FF] to-[#089981]">
                            for Modern Traders
                        </span>
                    </h1>

                    <p className="text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
                        12,000+ traders use Uptrade to find alpha before the market reacts.
                        Replacing intuition with institutional-grade data pipelines.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a href="/app" className="px-8 py-4 bg-[#2962FF] hover:bg-[#1e53e5] rounded-xl font-medium text-lg transition-all hover:scale-105 flex items-center gap-2 shadow-[0_0_40px_-10px_rgba(41,98,255,0.5)]">
                            Launch Platform <ArrowRight className="w-5 h-5" />
                        </a>
                        <a href="/api-page" className="px-8 py-4 glass-v2 hover:bg-white/5 rounded-xl font-medium text-lg transition-all flex items-center gap-2">
                            View API Reference
                        </a>
                    </div>
                </motion.div>
            </section>

            {/* =========================================
          TRUST BAR
      ========================================= */}
            <section className="border-y border-white/5 bg-black/20 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { val: '50B+', label: 'Data Points' },
                            { val: '12K+', label: 'Active Users' },
                            { val: '73%', label: 'Model Accuracy' },
                            { val: '<50ms', label: 'Global Latency' },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center"
                            >
                                <div className="text-4xl md:text-5xl font-mono font-bold text-white mb-2">{stat.val}</div>
                                <div className="text-sm text-white/40 uppercase tracking-widest">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* =========================================
          THE PROBLEM
      ========================================= */}
            <section className="py-32 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">The Fragmentation Tax</h2>
                        <p className="text-white/60 max-w-2xl mx-auto text-lg">
                            Modern traders lose 40% of their edge switching between disconnected tools.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 relative">
                        {/* The Old Way */}
                        <div className="glass-v2 p-8 rounded-3xl border border-red-500/20 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-red-500/5 group-hover:bg-red-500/10 transition-colors" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6 text-red-400">
                                    <X className="w-6 h-6" />
                                    <span className="font-mono text-sm tracking-widest">THE OLD WAY</span>
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Chaos & Noise</h3>
                                <ul className="space-y-3 text-white/60">
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />15+ Browser Tabs Open</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />Disconnected News Feeds</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />Unverified Social Sentiment</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />Slow Execution Speed</li>
                                </ul>
                            </div>
                        </div>

                        {/* The Uptrade Way */}
                        <div className="glass-v2 p-8 rounded-3xl border border-[#089981]/30 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[#089981]/5 group-hover:bg-[#089981]/10 transition-colors" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6 text-[#089981]">
                                    <Check className="w-6 h-6" />
                                    <span className="font-mono text-sm tracking-widest">THE UPTRADE WAY</span>
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Unified Intelligence</h3>
                                <ul className="space-y-3 text-white/60">
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#089981]/50" />All-in-One Dashboard</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#089981]/50" />AI-Synthesized Signals</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#089981]/50" />Quantitative Sentiment Scoring</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#089981]/50" />Sub-50ms Latency</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================
          THREE PILLARS
      ========================================= */}
            <section className="py-32 px-6 border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <span className="text-[#2962FF] font-mono text-sm tracking-widest">OUR ECOSYSTEM</span>
                        <h2 className="text-4xl md:text-5xl font-bold mt-4">Three Pillars of Alpha</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'VisualX',
                                desc: 'AI-powered technical analysis that identifies patterns invisible to the human eye.',
                                icon: BarChart2,
                                color: '#2962FF'
                            },
                            {
                                title: 'TradeX',
                                desc: 'Execution engine with institutional routing and smart order types.',
                                icon: Zap,
                                color: '#089981'
                            },
                            {
                                title: 'TradeSphere',
                                desc: 'Global sentiment analysis aggregated from 50,000+ news sources.',
                                icon: Globe,
                                color: '#F23645'
                            }
                        ].map((pillar, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -10 }}
                                className="glass-v2 rounded-3xl p-8 group hover:border-white/20 transition-all"
                            >
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-8" style={{ backgroundColor: `${pillar.color}20`, color: pillar.color }}>
                                    <pillar.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">{pillar.title}</h3>
                                <p className="text-white/60 leading-relaxed mb-8">{pillar.desc}</p>

                                {/* Abstract visual placeholder */}
                                <div className="h-40 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/5 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20" />
                                    <div className="absolute bottom-4 left-4 right-4 h-2 rounded-full bg-white/10 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: '70%' }}
                                            transition={{ duration: 1.5, delay: 0.5 }}
                                            className="h-full rounded-full"
                                            style={{ backgroundColor: pillar.color }}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* =========================================
          TEAM
      ========================================= */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">Built by Quants</h2>
                    <div className="grid md:grid-cols-4 gap-6">
                        {[
                            {
                                name: 'Alex Chen', role: 'CEO', initials: 'AC',
                                bio: 'ex-Goldman Sachs. PhD Statistics MIT.',
                                focus: ['Market Microstructure', 'HFT Systems']
                            },
                            {
                                name: 'Sarah Miller', role: 'CTO', initials: 'SM',
                                bio: 'ex-Google Brain. ML Architect.',
                                focus: ['NLP Transformers', 'Time-series']
                            },
                            {
                                name: 'James Park', role: 'Head of Product', initials: 'JP',
                                bio: 'ex-Bloomberg. UX Specialist.',
                                focus: ['Data Visualization', 'Trader UX']
                            },
                            {
                                name: 'Maria R.', role: 'Chief Scientist', initials: 'MR',
                                bio: 'ex-Two Sigma. Math Olympiad.',
                                focus: ['Stochastic Calculus', 'Risk Models']
                            }
                        ].map((member, i) => (
                            <TeamCard key={i} member={member} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* =========================================
          TIMELINE
      ========================================= */}
            <section className="py-32 px-6 border-t border-white/5 relative">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold mb-16 text-center">Our Journey</h2>
                    <div className="relative border-l border-white/10 ml-6 md:ml-0 md:border-l-0 md:border-t md:flex md:justify-between md:items-start md:pt-12">
                        {[
                            { year: '2023', title: 'Inception', desc: 'Core algo development started in MIT dorms.' },
                            { year: '2024', title: 'Beta Launch', desc: 'Onboarded first 1,000 institutional users.' },
                            { year: '2025', title: 'Global Scale', desc: 'Releasing public API and mobile suite.' }
                        ].map((item, i) => (
                            <div key={i} className="relative pl-12 pb-12 md:pl-0 md:pb-0 md:w-1/3 md:text-center group">
                                {/* Dot */}
                                <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-[#2962FF] md:left-1/2 md:-top-[54px] md:-translate-x-1/2 shadow-[0_0_10px_#2962FF]" />

                                <div className="text-[#2962FF] font-mono text-xl font-bold mb-2">{item.year}</div>
                                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* =========================================
          FINAL CTA
      ========================================= */}
            <section className="py-32 px-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#2962FF]/10 pointer-events-none" />
                <div className="relative z-10 max-w-3xl mx-auto">
                    <h2 className="text-5xl md:text-7xl font-bold mb-8">Ready to trade smarter?</h2>
                    <p className="text-xl text-white/60 mb-12">
                        Join the platform used by the world's most sophisticated traders.
                    </p>
                    <a href="/app" className="inline-flex items-center gap-2 px-10 py-5 bg-[#2962FF] hover:bg-[#1e53e5] rounded-2xl font-medium text-xl transition-all hover:scale-105 shadow-[0_0_50px_-10px_rgba(41,98,255,0.6)]">
                        Launch Platform Now <ArrowRight className="w-6 h-6" />
                    </a>
                </div>
            </section>

            {/* Footer is global */}
        </div>
    );
};
