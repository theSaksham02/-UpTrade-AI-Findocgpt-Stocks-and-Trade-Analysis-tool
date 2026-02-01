'use client'

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { TextScramble, TextDecode } from '@/components/effects/TextScramble';
import { Globe, Users, Award, TrendingUp } from 'lucide-react';
import { LandingHeader } from '@/components/landing/Header';
import { Footer } from '@/components/footer';

export default function AboutPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    const team = [
        { name: 'Alex Chen', role: 'CEO & Co-Founder', prev: 'VP Quant Research, Goldman Sachs', image: 'alex.jpg' },
        { name: 'Sarah Miller', role: 'CTO', prev: 'ML Lead, Google Brain', image: 'sarah.jpg' },
        { name: 'James Park', role: 'Head of Product', prev: 'Product Director, Bloomberg', image: 'james.jpg' },
    ];

    return (
        <div ref={containerRef} className="bg-[#0b0e14] min-h-screen">
            <LandingHeader />
            {/* Hero with Scramble Text */}
            <section className="h-screen flex items-center justify-center relative overflow-hidden">
                {/* Animated Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(41,98,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(41,98,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />

                <div className="text-center z-10 px-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        <TextScramble
                            text="WE ARE DECISION INTELLIGENCE"
                            className="text-5xl md:text-7xl font-bold text-white block mb-6"
                            trigger="mount"
                            speed={40}
                        />
                    </motion.div>

                    <TextDecode
                        text="Built by traders, for traders. No PhD required."
                        className="text-xl text-[#868993] max-w-2xl mx-auto"
                        speed={20}
                    />
                </div>

                {/* Parallax Floating Elements */}
                <motion.div style={{ y: y1 }} className="absolute top-1/4 left-[10%] w-32 h-32 border border-[#2962FF]/30 rounded-full" />
                <motion.div style={{ y: y2 }} className="absolute bottom-1/4 right-[15%] w-48 h-48 border border-[#089981]/20 rounded-full" />
            </section>

            {/* Mission Statement */}
            <motion.section style={{ opacity }} className="py-32 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold text-white mb-8">The Problem We're Solving</h2>
                    <p className="text-2xl text-[#868993] leading-relaxed">
                        "Institutional traders have Bloomberg. Retail traders have scraps.
                        We built the professional-grade intelligence engine that sits in between—
                        powerful enough for hedge funds, accessible enough for individuals."
                    </p>
                </div>
            </motion.section>

            {/* Stats with Animated Counters */}
            <section className="py-24 border-y border-[#2a2e39] bg-[#131722]">
                <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-12">
                    {[
                        { icon: Users, value: '12,000+', label: 'Active Traders' },
                        { icon: Globe, value: '50M+', label: 'Data Points/Day' },
                        { icon: Award, value: '73%', label: 'Alert Accuracy' },
                        { icon: TrendingUp, value: '$2.4B', label: 'Assets Analyzed' },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="text-center"
                        >
                            <stat.icon className="w-8 h-8 text-[#2962FF] mx-auto mb-4" />
                            <div className="text-4xl font-bold text-white mb-2 font-mono">{stat.value}</div>
                            <div className="text-[#868993] text-sm uppercase tracking-wider">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Team Section with Hover Reveal */}
            <section className="py-32 px-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-white text-center mb-16">Built By Industry Veterans</h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {team.map((person, i) => (
                            <motion.div
                                key={person.name}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.2 }}
                                className="group relative bg-[#131722] border border-[#2a2e39] rounded-2xl overflow-hidden hover:border-[#363a45] transition-colors"
                            >
                                {/* Image placeholder with gradient */}
                                <div className="h-64 bg-gradient-to-b from-[#2962FF]/20 to-[#0b0e14] relative overflow-hidden">
                                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-30" />
                                    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#131722] to-transparent" />
                                </div>

                                <div className="p-6 relative">
                                    <h3 className="text-xl font-bold text-white mb-1">{person.name}</h3>
                                    <p className="text-[#2962FF] text-sm mb-2">{person.role}</p>

                                    {/* Hover reveal */}
                                    <div className="h-0 overflow-hidden group-hover:h-auto transition-all">
                                        <p className="text-[#868993] text-sm pt-2 border-t border-[#2a2e39]">
                                            Previously: {person.prev}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Infinite Scroll Tech Stack */}
            <section className="py-24 overflow-hidden border-t border-[#2a2e39]">
                <div className="text-center mb-12">
                    <h3 className="text-[#868993] uppercase tracking-widest text-sm">Our Technology Stack</h3>
                </div>

                <div className="flex animate-marquee whitespace-nowrap overflow-x-hidden">
                    {/* Simple marquee implementation */}
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="flex items-center gap-16 mx-8 animate-scroll">
                            {['Python', 'FastAPI', 'PyTorch', 'React', 'WebSocket', 'Redis', 'TimescaleDB', 'Weaviate'].map((tech) => (
                                <span key={tech} className="text-4xl font-bold text-[#2a2e39] hover:text-[#868993] transition-colors cursor-default">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </section>
            <Footer />
        </div>
    );
};
