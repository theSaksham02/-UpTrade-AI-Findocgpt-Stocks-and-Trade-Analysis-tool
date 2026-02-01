'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue } from 'framer-motion';
import {
    Globe, Cpu, Shield, Zap, Target,
    ArrowRight, Linkedin, Twitter, Github
} from 'lucide-react';
import { TextScramble } from '@/components/effects/TextScramble';
import { LandingHeader } from '@/components/landing/Header';

// 3D Floating Card Component
const FloatingCard = ({ children, delay = 0, className = '' }: any) => {
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [10, -10]);
    const rotateY = useTransform(y, [-100, 100], [-10, 10]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay, ease: [0.23, 1, 0.32, 1] }}
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
            whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
            className={`relative ${className}`}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-[#2962FF]/20 to-transparent rounded-2xl blur-xl -z-10" />
            {children}
        </motion.div>
    );
};

// Animated 3D Background Mesh
const BackgroundMesh = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Floating 3D Orbs */}
            <motion.div
                animate={{
                    y: [0, -50, 0],
                    rotateX: [0, 360],
                    rotateY: [0, 180],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-20 left-[10%] w-96 h-96 bg-[#2962FF]/10 rounded-full blur-[100px]"
                style={{ transformStyle: 'preserve-3d' }}
            />
            <motion.div
                animate={{
                    y: [0, 50, 0],
                    rotateX: [180, 0],
                    rotateY: [0, 360],
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-20 right-[10%] w-[500px] h-[500px] bg-[#089981]/10 rounded-full blur-[120px]"
                style={{ transformStyle: 'preserve-3d' }}
            />

            {/* Floating Particles */}
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-[#2962FF]/50 rounded-full"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [0, -100, 0],
                        opacity: [0, 1, 0],
                        scale: [0, 1.5, 0],
                    }}
                    transition={{
                        duration: Math.random() * 5 + 5,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                    }}
                />
            ))}
        </div>
    );
};

// 3D Team Member Card
const TeamCard = ({ member, index }: any) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, rotateY: -90 }}
            whileInView={{ opacity: 1, rotateY: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2, ease: [0.23, 1, 0.32, 1] }}
            viewport={{ once: true }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative group perspective-1000 h-96"
        >
            <motion.div
                animate={{ rotateY: isHovered ? 180 : 0 }}
                transition={{ duration: 0.6 }}
                className="relative w-full h-full preserve-3d cursor-pointer"
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Front */}
                <div className="absolute inset-0 backface-hidden">
                    <div className="h-full bg-[#131722]/80 backdrop-blur-sm border border-[#2a2e39] rounded-2xl p-6 overflow-hidden relative flex flex-col items-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#2962FF]/10 via-transparent to-[#089981]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Avatar Placeholder with 3D effect */}
                        <div className="relative w-24 h-24 mb-6">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#2962FF] to-[#089981] opacity-20 blur-md group-hover:opacity-40 transition-opacity" />
                            <div className="relative w-full h-full rounded-full bg-[#1e222d] border-2 border-[#363a45] flex items-center justify-center text-2xl font-bold text-white overflow-hidden">
                                {member.name.split(' ').map((n: string) => n[0]).join('')}
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-white text-center mb-1">{member.name}</h3>
                        <p className="text-[#2962FF] text-sm text-center mb-4">{member.role}</p>
                        <p className="text-[#868993] text-sm text-center leading-relaxed">{member.bio}</p>

                        <div className="mt-auto flex justify-center gap-3">
                            {[Linkedin, Twitter, Github].map((Icon, i) => (
                                <div key={i} className="p-2 rounded-full hover:bg-[#2a2e39] transition-colors">
                                    <Icon className="w-4 h-4 text-[#868993] hover:text-[#2962FF]" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Back (Stats) */}
                <div
                    className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden"
                    style={{ transform: 'rotateY(180deg)' }}
                >
                    <div className="h-full bg-gradient-to-br from-[#2962FF] to-[#1e53e5] p-6 flex flex-col justify-center text-white relative">
                        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
                        <h4 className="text-lg font-bold mb-6 text-center">Impact Metrics</h4>
                        <div className="space-y-6">
                            <div className="text-center">
                                <div className="text-xs opacity-80 uppercase tracking-wider mb-1">Models Deployed</div>
                                <div className="text-3xl font-mono font-bold">{member.metrics.models}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xs opacity-80 uppercase tracking-wider mb-1">Accuracy Rate</div>
                                <div className="text-3xl font-mono font-bold">{member.metrics.accuracy}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xs opacity-80 uppercase tracking-wider mb-1">Papers Published</div>
                                <div className="text-3xl font-mono font-bold">{member.metrics.papers}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// Value Card with 3D tilt
const ValueCard = ({ icon: Icon, title, desc, color, index }: any) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-50, 50], [10, -10]);
    const rotateY = useTransform(x, [-50, 50], [-10, 10]);

    function handleMouseMove(event: any) {
        const rect = event.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set(event.clientX - centerX);
        y.set(event.clientY - centerY);
    }

    function handleMouseLeave() {
        x.set(0);
        y.set(0);
    }

    return (
        <motion.div
            initial={{ opacity: 0, z: -100 }}
            whileInView={{ opacity: 1, z: 0 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
            className="relative h-full perspective-1000"
        >
            <div className="h-full bg-[#131722]/40 backdrop-blur-md border border-[#2a2e39] hover:border-[color:var(--glow-color)] rounded-2xl p-8 transition-all duration-300 group" style={{ '--glow-color': color } as any}>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[color:var(--glow-color)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ '--glow-color': color } as any} />

                <motion.div
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 relative"
                    style={{ backgroundColor: `${color}20` }}
                >
                    <Icon className="w-7 h-7" style={{ color }} />
                    <div className="absolute inset-0 rounded-xl blur-xl opacity-40" style={{ backgroundColor: color }} />
                </motion.div>

                <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                <p className="text-[#868993] leading-relaxed text-sm">{desc}</p>
            </div>
        </motion.div>
    );
};

export default function AboutPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);

    const team = [
        {
            name: 'Alex Chen',
            role: 'CEO & Co-Founder',
            bio: 'Former VP Quantitative Research at Goldman Sachs. PhD Statistics MIT. Built high-frequency systems processing $2B+ daily.',
            metrics: { models: '12', accuracy: '73%', papers: '8' }
        },
        {
            name: 'Sarah Miller',
            role: 'CTO',
            bio: 'ML Lead at Google Brain. 15+ years in NLP and time-series forecasting. Architected sentiment systems processing 1M+ messages/sec.',
            metrics: { models: '24', accuracy: '89%', papers: '15' }
        },
        {
            name: 'James Park',
            role: 'Head of Product',
            bio: 'Product Director at Bloomberg Terminal. Expert in financial UX. Led teams building tools for 300k+ institutional clients.',
            metrics: { models: '6', accuracy: '81%', papers: '3' }
        },
        {
            name: 'Maria Rodriguez',
            role: 'Chief Scientist',
            bio: 'Post-doc at Courant Institute. Specializes in stochastic calculus and market microstructure. Formerly Two Sigma.',
            metrics: { models: '18', accuracy: '77%', papers: '12' }
        }
    ];

    const values = [
        {
            icon: Cpu,
            title: 'Engineering First',
            desc: 'We believe elegant systems outperform brute force. Every line of code is optimized for sub-50ms latency.',
            color: '#2962FF'
        },
        {
            icon: Shield,
            title: 'Radical Transparency',
            desc: 'Our models are explainable. Every prediction shows its work. No black boxes, no hidden biases.',
            color: '#089981'
        },
        {
            icon: Zap,
            title: 'Speed as a Feature',
            desc: 'In markets, milliseconds matter. Our edge is data freshness—processing events before competitors finish reading headers.',
            color: '#ff9800'
        },
        {
            icon: Globe,
            title: 'Democratizing Alpha',
            desc: 'Institutional tools for retail traders. Everyone deserves access to the same intelligence as billion-dollar funds.',
            color: '#f23645'
        }
    ];

    const stats = [
        { value: '50B+', label: 'Data Points Processed', suffix: 'Daily' },
        { value: '12,000+', label: 'Active Traders', suffix: 'Users' },
        { value: '<50ms', label: 'Average Latency', suffix: 'P99' },
        { value: '73%', label: 'Model Accuracy', suffix: 'Verified' }
    ];

    return (
        <div ref={containerRef} className="bg-transparent min-h-screen relative overflow-hidden">
            <LandingHeader />
            <BackgroundMesh />

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center pt-20">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <motion.div
                        style={{ y: y1, scale }}
                        className="text-[20vw] font-bold text-[#1e222d] select-none absolute whitespace-nowrap opacity-20"
                    >
                        INTELLIGENCE
                    </motion.div>
                </div>

                <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
                    >
                        {/* Animated Floating Character */}
                        <motion.div
                            animate={{
                                y: [0, -20, 0],
                                rotateZ: [0, 2, -2, 0],
                            }}
                            transition={{
                                duration: 6,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="w-48 h-48 mx-auto -mb-8 relative z-20"
                        >
                            <img
                                src="/images/character.png"
                                alt="Uptrade AI Bot"
                                className="w-full h-full object-contain mix-blend-screen drop-shadow-[0_0_50px_rgba(41,98,255,0.3)]"
                            />
                        </motion.div>

                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2962FF]/10 border border-[#2962FF]/30 mb-8 backdrop-blur-md">
                            <div className="w-2 h-2 rounded-full bg-[#2962FF] animate-pulse" />
                            <span className="text-[#2962FF] text-sm font-medium">Decision Intelligence Engine</span>
                        </div>

                        <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 leading-none tracking-tight">
                            <span className="block mb-2">We Are Building</span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2962FF] to-[#089981]">
                                The Future
                            </span>
                            <br />
                            <span className="block mt-2">Of Finance</span>
                        </h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 1 }}
                            className="text-xl text-[#868993] max-w-2xl mx-auto leading-relaxed"
                        >
                            Uptrade combines institutional-grade infrastructure with cutting-edge AI.
                            Built by quants from Goldman Sachs, Google Brain, and Two Sigma to give
                            every trader the edge they deserve.
                        </motion.p>
                    </motion.div>

                    {/* Floating Stat Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-4xl mx-auto">
                        {stats.map((stat, i) => (
                            <FloatingCard key={stat.label} delay={i * 0.1}>
                                <div className="bg-[#131722]/40 backdrop-blur-md border border-[#2a2e39]/50 rounded-2xl p-6 text-center hover:border-[#2962FF]/50 transition-colors">
                                    <div className="text-3xl md:text-4xl font-bold text-white font-mono mb-1 bg-gradient-to-br from-white to-[#868993] bg-clip-text text-transparent">
                                        {stat.value}
                                    </div>
                                    <div className="text-xs text-[#868993] uppercase tracking-wider">{stat.label}</div>
                                    <div className="text-[10px] text-[#2962FF] mt-1">{stat.suffix}</div>
                                </div>
                            </FloatingCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission Section with Parallax */}
            <section className="relative py-32 px-6 overflow-hidden">
                <motion.div style={{ y: y2 }} className="absolute right-0 top-0 w-1/2 h-full opacity-30 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-l from-[#2962FF]/20 to-transparent" />
                </motion.div>

                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <div className="text-[#2962FF] font-mono text-sm mb-4 tracking-wider">OUR MISSION</div>
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                                Eliminating the<br />
                                <span className="text-[#868993]">Fragmentation Tax</span>
                            </h2>
                            <p className="text-[#868993] text-lg leading-relaxed mb-6">
                                Modern traders lose 40% of alpha to context switching—jumping between
                                news, charts, SEC filings, and social sentiment. Uptrade collapses this
                                into a single Unified Intelligence Loop.
                            </p>
                            <p className="text-[#868993] text-lg leading-relaxed">
                                Our AI doesn't just show you data. It synthesizes 147 distinct factors
                                into predictive signals, giving you the same edge previously reserved
                                for billion-dollar quant funds.
                            </p>
                        </motion.div>
                    </div>

                    <div className="relative h-[500px]">
                        {/* 3D Floating Elements representing the "Loop" */}
                        <motion.div
                            animate={{
                                rotateY: [0, 360],
                                z: [0, 50, 0]
                            }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-[#2962FF]/30 rounded-full"
                            style={{ transformStyle: 'preserve-3d' }}
                        />
                        <motion.div
                            animate={{
                                rotateX: [0, 360],
                                z: [0, -30, 0]
                            }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 border border-[#089981]/30 rounded-full"
                            style={{ transformStyle: 'preserve-3d' }}
                        />
                        <motion.div
                            animate={{
                                rotateZ: [0, 360],
                                scale: [1, 1.2, 1]
                            }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-[#2962FF]/10 rounded-full blur-xl"
                        />

                        {/* Center Content */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                            <div className="text-6xl font-bold text-white font-mono">147</div>
                            <div className="text-xs text-[#868993] uppercase tracking-wider mt-2">Factors</div>
                        </div>

                        {/* Orbiting Icons */}
                        {[
                            { Icon: Cpu, delay: 0, color: '#2962FF' },
                            { Icon: Globe, delay: 90, color: '#089981' },
                            { Icon: Target, delay: 180, color: '#ff9800' },
                            { Icon: Shield, delay: 270, color: '#f23645' }
                        ].map(({ Icon, delay, color }, i) => (
                            <motion.div
                                key={i}
                                animate={{ rotate: [delay, delay + 360] }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute top-1/2 left-1/2 w-48 h-48 -ml-24 -mt-24"
                                style={{ transformOrigin: 'center' }}
                            >
                                <div
                                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-xl flex items-center justify-center border border-[#2a2e39] bg-[#131722]"
                                    style={{ boxShadow: `0 0 20px ${color}20` }}
                                >
                                    <Icon className="w-6 h-6" style={{ color }} />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values Grid */}
            <section className="py-32 px-6 relative">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-20">
                        <div className="text-[#089981] font-mono text-sm mb-4 tracking-wider">OUR VALUES</div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white">Built on Principles</h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, i) => (
                            <ValueCard key={value.title} {...value} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-32 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#2962FF]/5 via-transparent to-transparent" />

                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="text-center mb-20">
                        <div className="text-[#f23645] font-mono text-sm mb-4 tracking-wider">THE TEAM</div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">World-Class Minds</h2>
                        <p className="text-[#868993] max-w-2xl mx-auto">
                            From Goldman Sachs to Google Brain, our team brings decades of experience
                            in quantitative finance and machine learning.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((member, i) => (
                            <TeamCard key={member.name} member={member} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Join CTA */}
            <section className="py-32 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#2962FF]/10 via-transparent to-transparent pointer-events-none" />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-5xl md:text-7xl font-bold text-white mb-8">
                            Join the
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2962FF] to-[#089981]">
                                Revolution
                            </span>
                        </h2>

                        <p className="text-xl text-[#868993] mb-12 max-w-2xl mx-auto">
                            We're hiring engineers, quants, and designers who want to democratize
                            access to institutional-grade trading intelligence.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <motion.a
                                href="/careers"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-[#2962FF] hover:bg-[#1e53e5] text-white px-8 py-4 rounded-xl font-medium text-lg flex items-center gap-2"
                            >
                                View Open Positions
                                <ArrowRight className="w-5 h-5" />
                            </motion.a>

                            <a
                                href="mailto:hello@uptrade.io"
                                className="border border-[#2a2e39] hover:border-[#868993] text-white px-8 py-4 rounded-xl font-medium text-lg transition-colors"
                            >
                                Get in Touch
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer handled by layout */}
        </div>
    );
};
