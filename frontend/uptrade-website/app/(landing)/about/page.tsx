'use client'

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Twitter, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const timeline = [
    {
        year: '2021',
        title: 'Internal Tool at Hedge Fund',
        description: 'Started as an internal research tool to detect sentiment-price divergences before market moves.'
    },
    {
        year: '2022',
        title: 'VisualX Algorithm Breakthrough',
        description: 'Developed the core divergence detection engine. 73% accuracy on backtested signals across 50k+ events.'
    },
    {
        year: '2023',
        title: 'Public Beta Launch',
        description: 'Launched API access for developers. First 1,000 users within 60 days. Zero marketing spend.'
    },
    {
        year: '2024',
        title: '12,000+ Active Traders',
        description: 'Processing 1.2M messages/sec. Expanded to crypto, forex, and options data coverage.'
    },
];

const stats = [
    { value: '50+', label: 'Data Sources' },
    { value: '<50ms', label: 'P99 Latency' },
    { value: '99.99%', label: 'API Uptime' },
];

const founderImages = [
    {
        src: '/images/founder/pitch_1.png',
        caption: 'Pitching UpTrade at the GEAC Investor Summit',
        context: 'Value Tiers & Enterprise Access'
    },
    {
        src: '/images/founder/pitch_2.png',
        caption: 'Introducing the Intelligence Loop',
        context: 'TradeX & TradeSphere Demo'
    },
    {
        src: '/images/founder/pitch_3.png',
        caption: 'Addressing the Core Problem',
        context: 'PITCH STAGE - Investor Demo Day'
    },
];

const techStack = `# UpTrade Architecture

## Data Layer
- PostgreSQL + TimescaleDB (time-series)
- Redis Cluster (caching, pub/sub)
- Weaviate (vector embeddings)

## Processing
- FastAPI (Python REST/WebSocket)
- Kafka (event streaming)
- PyTorch + ONNX (ML inference)

## Infrastructure  
- Kubernetes on GCP
- CloudFlare (edge caching)
- Datadog (observability)`;

const jobs = [
    { role: 'Senior Backend Engineer', dept: 'Engineering', location: 'Remote (US/EU)', link: '#' },
    { role: 'ML Engineer, NLP', dept: 'AI/ML', location: 'San Francisco', link: '#' },
    { role: 'DevOps/SRE', dept: 'Infrastructure', location: 'Remote', link: '#' },
];

export default function AboutPage() {
    const [currentImage, setCurrentImage] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    // Auto-advance carousel
    useEffect(() => {
        if (isHovered) return;
        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % founderImages.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [isHovered]);

    const nextImage = () => setCurrentImage((prev) => (prev + 1) % founderImages.length);
    const prevImage = () => setCurrentImage((prev) => (prev - 1 + founderImages.length) % founderImages.length);

    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="pt-32 pb-16 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight"
                    >
                        Built by traders who were tired of being slow.
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-[#868993] leading-relaxed"
                    >
                        We spent years watching retail traders lose to institutional speed.
                        UpTrade exists to close that gap.
                    </motion.p>
                </div>
            </section>

            {/* Founder Showcase - Image Carousel */}
            <section className="py-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-xs text-[#868993] font-mono uppercase tracking-wider mb-8">
                        // Founder in Action
                    </h2>

                    <div
                        className="relative group"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        {/* Main Image Container */}
                        <motion.div
                            className="relative aspect-[16/10] rounded-xl overflow-hidden border border-white/10 bg-[#13131f]"
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.3 }}
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentImage}
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                    className="absolute inset-0"
                                >
                                    <Image
                                        src={founderImages[currentImage].src}
                                        alt={founderImages[currentImage].caption}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
                                </motion.div>
                            </AnimatePresence>

                            {/* Caption */}
                            <motion.div
                                className="absolute bottom-0 left-0 right-0 p-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="w-2 h-2 bg-[#00d4ff] rounded-full animate-pulse" />
                                    <span className="text-[#00d4ff] font-mono text-xs uppercase tracking-wider">
                                        {founderImages[currentImage].context}
                                    </span>
                                </div>
                                <p className="text-white text-lg font-medium">
                                    {founderImages[currentImage].caption}
                                </p>
                            </motion.div>

                            {/* Navigation Arrows */}
                            <button
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#0a0a0f]/80 border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#00d4ff] hover:border-[#00d4ff] hover:text-[#0a0a0f]"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#0a0a0f]/80 border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#00d4ff] hover:border-[#00d4ff] hover:text-[#0a0a0f]"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </motion.div>

                        {/* Dots Indicator */}
                        <div className="flex justify-center gap-2 mt-4">
                            {founderImages.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentImage(idx)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImage
                                            ? 'w-8 bg-[#00d4ff]'
                                            : 'w-1.5 bg-white/30 hover:bg-white/50'
                                        }`}
                                />
                            ))}
                        </div>

                        {/* Floating Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                            className="absolute -top-4 -right-4 bg-[#00d4ff] text-[#0a0a0f] px-3 py-1.5 rounded-full font-mono text-xs font-bold shadow-lg shadow-[#00d4ff]/30"
                        >
                            Live Pitch
                        </motion.div>
                    </div>

                    {/* Founder Info Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-8 bg-[#13131f] border border-white/10 rounded-lg p-6 flex items-center gap-6"
                    >
                        <div className="w-16 h-16 bg-gradient-to-br from-[#00d4ff] to-[#7c3aed] rounded-lg flex items-center justify-center text-white font-bold font-mono text-xl">
                            SM
                        </div>
                        <div className="flex-1">
                            <div className="text-white font-bold text-lg">Saksham Mishra</div>
                            <div className="text-[#868993] text-sm">Founder & CEO</div>
                            <div className="text-xs text-[#868993] mt-1 font-mono">
                                Building the future of trading intelligence
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <a href="https://linkedin.com" className="text-[#868993] hover:text-[#00d4ff] transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a href="https://twitter.com" className="text-[#868993] hover:text-[#00d4ff] transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="https://github.com" className="text-[#868993] hover:text-[#00d4ff] transition-colors">
                                <Github className="w-5 h-5" />
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Timeline */}
            <section className="py-16 px-6">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-xs text-[#868993] font-mono uppercase tracking-wider mb-8">
                        // Timeline
                    </h2>
                    <div className="space-y-8 border-l-2 border-white/10 pl-8">
                        {timeline.map((item, idx) => (
                            <motion.div
                                key={item.year}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="relative"
                            >
                                <div className="absolute -left-[41px] w-4 h-4 rounded-full bg-[#00d4ff] border-4 border-[#0a0a0f]" />
                                <div className="text-[#00d4ff] font-mono text-sm mb-1">{item.year}</div>
                                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                                <p className="text-[#868993] text-sm leading-relaxed">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 px-6 border-y border-white/10">
                <div className="max-w-3xl mx-auto">
                    <div className="grid grid-cols-3 gap-8">
                        {stats.map((stat, idx) => (
                            <motion.div
                                key={stat.label}
                                className="text-center"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <div className="text-3xl md:text-4xl font-bold text-white font-mono">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-[#868993] mt-1">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tech Stack */}
            <section className="py-16 px-6">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-xs text-[#868993] font-mono uppercase tracking-wider mb-8">
                        // Tech Stack
                    </h2>
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="bg-[#13131f] border border-white/10 rounded-lg overflow-hidden"
                    >
                        <div className="flex items-center gap-2 px-4 py-2 bg-[#0a0a0f] border-b border-white/10">
                            <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
                            <div className="w-3 h-3 rounded-full bg-[#fbbf24]" />
                            <div className="w-3 h-3 rounded-full bg-[#10b981]" />
                            <span className="text-xs text-[#868993] font-mono ml-2">architecture.md</span>
                        </div>
                        <pre className="p-4 text-sm font-mono text-[#868993] overflow-x-auto whitespace-pre-wrap">
                            {techStack.split('\n').map((line, i) => {
                                if (line.startsWith('# ')) {
                                    return <div key={i} className="text-white font-bold">{line}</div>;
                                } else if (line.startsWith('## ')) {
                                    return <div key={i} className="text-[#00d4ff] mt-4">{line}</div>;
                                } else if (line.startsWith('- ')) {
                                    return <div key={i} className="text-[#868993] pl-2">{line}</div>;
                                }
                                return <div key={i}>{line}</div>;
                            })}
                        </pre>
                    </motion.div>
                </div>
            </section>

            {/* Careers */}
            <section className="py-16 px-6 pb-24">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-xs text-[#868993] font-mono uppercase tracking-wider mb-8">
                        // Open Positions
                    </h2>
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="bg-[#13131f] border border-white/10 rounded-lg overflow-hidden"
                    >
                        <div className="grid grid-cols-4 gap-4 px-4 py-3 bg-[#0a0a0f] border-b border-white/10 text-xs text-[#868993] font-mono uppercase tracking-wider">
                            <div>Role</div>
                            <div>Department</div>
                            <div>Location</div>
                            <div></div>
                        </div>
                        {jobs.map((job, idx) => (
                            <motion.div
                                key={job.role}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className={`grid grid-cols-4 gap-4 px-4 py-4 items-center ${idx !== jobs.length - 1 ? 'border-b border-white/10' : ''
                                    } hover:bg-white/5 transition-colors`}
                            >
                                <div className="text-white font-medium">{job.role}</div>
                                <div className="text-[#868993] text-sm">{job.dept}</div>
                                <div className="text-[#868993] text-sm font-mono">{job.location}</div>
                                <div className="text-right">
                                    <a
                                        href={job.link}
                                        className="text-[#00d4ff] text-sm font-mono hover:underline"
                                    >
                                        Apply →
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
