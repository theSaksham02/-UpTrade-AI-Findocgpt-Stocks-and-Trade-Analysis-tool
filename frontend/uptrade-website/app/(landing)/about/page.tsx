'use client';

import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Activity } from 'lucide-react';
import { LandingHeader } from '@/components/landing/Header';

export default function AboutPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Parallax transforms
    const y1 = useTransform(scrollYProgress, [0, 1], [0, -500]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <div ref={containerRef} className="bg-[#02040a] min-h-[200vh] relative overflow-hidden">

            {/* =========================================
          BACKGROUND LAYERS (Depth Effect)
      ========================================= */}

            {/* Layer 1: Deep Space Gradient */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,_#0a1628_0%,_#02040a_50%)]" />

            {/* Layer 2: Animated Noise Texture for Film Grain */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none">
                <svg className="w-full h-full">
                    <filter id="noise">
                        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#noise)" />
                </svg>
            </div>

            {/* Layer 3: Floating Organic Blobs (3D CSS) */}
            <FloatingBlobs />

            {/* =========================================
          HERO SECTION (First Viewport)
      ========================================= */}

            <section className="h-screen relative flex items-center justify-center">
                <LandingHeader />

                {/* Floating Glass Button - Like "Contact us" in video */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="fixed top-1/2 right-20 z-50 hidden lg:block"
                >
                    <a
                        href="/app"
                        className="group relative px-8 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden block"
                    >
                        {/* Inner glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#2962FF]/20 via-transparent to-[#089981]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <span className="relative text-white/90 font-medium tracking-wide text-sm">
                            Launch Platform
                        </span>
                    </a>
                </motion.div>

                {/* Large Background Text - "We Are" */}
                <motion.div style={{ y: y1 }} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <h1 className="text-[20vw] font-black text-white/[0.02] tracking-tighter whitespace-nowrap">
                        UPTRADE
                    </h1>
                </motion.div>

                {/* Hero Content */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-40">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                    >
                        <h2 className="text-6xl font-light text-white mb-6 tracking-tighter">
                            Creating a <br />
                            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#2962FF] to-[#089981]">
                                Brighter Future
                            </span>
                        </h2>
                    </motion.div>
                </div>

                {/* Right side info - Like hello@nexaai */}
                <div className="absolute bottom-12 right-12 text-right z-40">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="text-white/60 text-sm font-light tracking-wider"
                    >
                        hello@uptrade.io
                    </motion.div>
                    <div className="text-white/30 text-xs mt-2">Decision Intelligence Engine</div>
                </div>

                {/* Navigation Grid - Like Services, About us, etc */}
                <div className="absolute bottom-12 left-12 grid grid-cols-2 gap-12 z-40">
                    <div>
                        <div className="text-white/40 text-xs uppercase tracking-widest mb-4">Explore</div>
                        <nav className="space-y-3">
                            {['Services', 'About us', 'Insight', 'Career', 'News'].map((item, i) => (
                                <motion.a
                                    key={item}
                                    href={`/${item.toLowerCase().replace(' ', '-')}`}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.8 + i * 0.1 }}
                                    className="block text-white/70 hover:text-white text-sm font-light transition-colors"
                                >
                                    {item}
                                </motion.a>
                            ))}
                        </nav>
                    </div>

                    <div>
                        <div className="text-white/40 text-xs uppercase tracking-widest mb-4">Social</div>
                        <nav className="space-y-3">
                            {['Instagram', 'X / Twitter', 'LinkedIn', 'Discord'].map((item, i) => (
                                <motion.a
                                    key={item}
                                    href="#"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 1 + i * 0.1 }}
                                    className="block text-white/70 hover:text-white text-sm font-light transition-colors"
                                >
                                    {item}
                                </motion.a>
                            ))}
                        </nav>
                    </div>
                </div>
            </section>

            {/* =========================================
          SECOND SECTION: About Us Content
          (Torch/Glow Element)
      ========================================= */}

            <section className="h-screen relative flex items-center justify-center">
                {/* Central Glowing Element - The "Torch" */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <TorchElement />
                </div>

                {/* Left Text - "Our Mission" */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="absolute left-20 top-1/2 -translate-y-1/2 z-40"
                >
                    <div className="w-12 h-px bg-white/20 mb-4" />
                    <div className="text-white/60 text-sm tracking-wider">Our Mission</div>
                </motion.div>

                {/* Right Text - Staggered Word Reveal */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="absolute right-20 top-1/2 -translate-y-1/2 z-40 max-w-md text-right"
                >
                    <StaggeredText text="Building the future of financial intelligence" />
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                        className="text-white/50 text-sm mt-6 leading-relaxed"
                    >
                        Eliminating the fragmentation tax through unified decision intelligence.
                    </motion.p>
                </motion.div>
            </section>

            {/* Footer Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-between items-center text-white/30 text-xs z-50 pointer-events-none">
                <span>© 2024 UPTRADE AI SOLUTION</span>
                <div className="flex gap-6 pointer-events-auto">
                    <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
                    <a href="/terms" className="hover:text-white transition-colors">Terms & conditions</a>
                </div>
            </div>
        </div>
    );
};

// =========================================
// COMPONENT: Floating Organic Blobs
// =========================================
const FloatingBlobs = () => {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
            {/* Main large blob */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                    x: [0, 100, 0],
                    y: [0, -50, 0],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-1/4 left-1/4 w-[600px] h-[600px]"
                style={{
                    background: 'radial-gradient(circle, rgba(41,98,255,0.3) 0%, transparent 70%)',
                    filter: 'blur(60px)',
                    mixBlendMode: 'screen'
                }}
            />

            {/* Secondary blob */}
            <motion.div
                animate={{
                    scale: [1.2, 1, 1.2],
                    rotate: [90, 0, 90],
                    x: [0, -100, 0],
                    y: [0, 100, 0],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px]"
                style={{
                    background: 'radial-gradient(circle, rgba(8,153,129,0.2) 0%, transparent 70%)',
                    filter: 'blur(80px)',
                    mixBlendMode: 'screen'
                }}
            />

            {/* Small accent blobs */}
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    animate={{
                        y: [0, -200, 0],
                        x: [0, Math.random() * 100 - 50, 0],
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 10 + Math.random() * 10,
                        repeat: Infinity,
                        delay: i * 2,
                        ease: "easeInOut"
                    }}
                    className="absolute w-32 h-32 rounded-full"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        background: `radial-gradient(circle, rgba(41,98,255,${0.2 + Math.random() * 0.3}) 0%, transparent 70%)`,
                        filter: `blur(${30 + Math.random() * 20}px)`,
                    }}
                />
            ))}
        </div>
    );
};

// =========================================
// COMPONENT: Central Torch/Glow Element
// =========================================
const TorchElement = () => {
    return (
        <div className="relative w-40 h-96 flex items-center justify-center">
            {/* Core bright light */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.8, 1, 0.8],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute w-8 h-32 bg-white rounded-full blur-xl"
                style={{
                    boxShadow: '0 0 60px 20px rgba(41,98,255,0.8), 0 0 100px 40px rgba(41,98,255,0.4)'
                }}
            />

            {/* Inner flame */}
            <motion.div
                animate={{
                    height: ['80%', '100%', '80%'],
                    opacity: [0.9, 1, 0.9],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute w-4 h-24 bg-gradient-to-t from-[#2962FF] via-white to-transparent rounded-full blur-md"
            />

            {/* Outer glow ring */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute w-64 h-64 border border-[#2962FF]/20 rounded-full"
                style={{
                    background: 'conic-gradient(from 0deg, transparent, rgba(41,98,255,0.1), transparent)'
                }}
            />

            {/* Orbiting particles */}
            {[...Array(3)].map((_, i) => (
                <motion.div
                    key={i}
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 10 + i * 5,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute w-full h-full"
                    style={{ animationDelay: `${i * 3}s` }}
                >
                    <div
                        className="absolute w-2 h-2 bg-[#2962FF] rounded-full blur-sm"
                        style={{
                            top: '0%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            boxShadow: '0 0 20px 5px rgba(41,98,255,0.8)'
                        }}
                    />
                </motion.div>
            ))}

            {/* Trail effect */}
            <div className="absolute top-full w-2 h-32 bg-gradient-to-b from-[#2962FF]/50 to-transparent blur-lg" />
        </div>
    );
};

// =========================================
// COMPONENT: Staggered Text Animation
// =========================================
const StaggeredText = ({ text }: { text: string }) => {
    const words = text.split(' ');

    return (
        <h2 className="text-4xl md:text-5xl font-light text-white leading-tight">
            {words.map((word, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{
                        duration: 0.8,
                        delay: i * 0.15,
                        ease: [0.23, 1, 0.32, 1]
                    }}
                    className="inline-block mr-3"
                >
                    {word}
                </motion.span>
            ))}
        </h2>
    );
};
