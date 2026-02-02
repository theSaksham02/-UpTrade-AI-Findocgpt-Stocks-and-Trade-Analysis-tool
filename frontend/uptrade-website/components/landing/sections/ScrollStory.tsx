'use client';

import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, TrendingDown, Clock, DollarSign, ArrowRight } from 'lucide-react';

interface StoryStep {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    chartData: number[];
    sentimentData: number[];
    alert?: string;
    pnl?: string;
}

const storySteps: StoryStep[] = [
    {
        id: 1,
        title: 'Normal Market',
        subtitle: '9:31 AM EST',
        description: 'Price and sentiment moving in harmony. TSLA trading at $263.04.',
        chartData: [50, 52, 51, 53, 54, 52, 55, 56, 54, 57, 58, 56, 59, 60],
        sentimentData: [48, 50, 49, 51, 52, 50, 53, 54, 52, 55, 56, 54, 57, 58],
    },
    {
        id: 2,
        title: 'Divergence Detected',
        subtitle: '9:34 AM EST',
        description: 'VisualX detects sentiment crashing while price remains stable.',
        chartData: [60, 61, 60, 62, 61, 63, 62, 64, 63, 65, 64, 66, 65, 67],
        sentimentData: [58, 55, 52, 48, 45, 42, 38, 35, 32, 28, 25, 22, 20, 18],
        alert: 'TSLA Divergence: -0.84σ',
    },
    {
        id: 3,
        title: 'Volatility Expansion',
        subtitle: '9:37 AM EST — 3 minutes later',
        description: 'Price crashes 8% as predicted by the divergence signal.',
        chartData: [67, 65, 60, 55, 50, 45, 42, 40, 38, 35, 33, 30, 28, 25],
        sentimentData: [18, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 5],
    },
    {
        id: 4,
        title: 'Your Position',
        subtitle: 'Protected by early exit',
        description: 'You exited 3 minutes before the crash. Others weren\'t so lucky.',
        chartData: [25, 24, 23, 24, 25, 24, 26, 27, 26, 28, 29, 28, 30, 31],
        sentimentData: [5, 6, 7, 8, 10, 12, 15, 18, 20, 23, 25, 28, 30, 32],
        pnl: '+$1,240',
    },
];

const MiniChart = ({ data, color, animate }: { data: number[]; color: string; animate: boolean }) => {
    const maxVal = Math.max(...data);
    const minVal = Math.min(...data);
    const range = maxVal - minVal || 1;

    return (
        <div className="flex items-end gap-0.5 h-24">
            {data.map((val, i) => (
                <div
                    key={i}
                    className={`flex-1 rounded-t transition-all duration-500 ${animate ? 'opacity-100' : 'opacity-30'}`}
                    style={{
                        height: `${((val - minVal) / range) * 100}%`,
                        backgroundColor: color,
                        transitionDelay: animate ? `${i * 50}ms` : '0ms',
                    }}
                />
            ))}
        </div>
    );
};

export const ScrollStory = () => {
    const [activeStep, setActiveStep] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = stepRefs.current.findIndex((ref) => ref === entry.target);
                        if (index !== -1) {
                            setActiveStep(index);
                        }
                    }
                });
            },
            { threshold: 0.6 }
        );

        stepRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <section className="py-24 px-6 bg-[#0a0a0f]">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ef4444]/10 border border-[#ef4444]/20 text-[#ef4444] text-sm font-mono mb-6">
                        <AlertTriangle className="w-4 h-4" />
                        LIVE DIVERGENCE DETECTION
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        See It In Action
                    </h2>
                    <p className="text-[#868993] text-lg max-w-xl mx-auto">
                        Watch how VisualX detected a major TSLA move 3 minutes before it happened.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-start" ref={containerRef}>
                    {/* Left: Sticky Chart */}
                    <div className="lg:sticky lg:top-32 h-fit">
                        <div className="bg-[#131722] border border-[#2a2e39] rounded-2xl p-8 relative overflow-hidden">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <div className="text-white font-bold text-lg">TSLA</div>
                                    <div className="text-[#868993] text-sm">{storySteps[activeStep]?.subtitle}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-[#868993]" />
                                    <span className="text-[#868993] text-sm font-mono">Step {activeStep + 1}/4</span>
                                </div>
                            </div>

                            {/* Charts */}
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs text-[#868993]">PRICE</span>
                                        <span className="text-xs text-[#2962FF] font-mono">
                                            ${(263.04 * (storySteps[activeStep]?.chartData[13] || 50) / 67).toFixed(2)}
                                        </span>
                                    </div>
                                    <MiniChart
                                        data={storySteps[activeStep]?.chartData || []}
                                        color="#2962FF"
                                        animate={true}
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs text-[#868993]">SENTIMENT</span>
                                        <span className={`text-xs font-mono ${(storySteps[activeStep]?.sentimentData[13] || 50) < 30 ? 'text-[#ef4444]' : 'text-[#10b981]'
                                            }`}>
                                            {((storySteps[activeStep]?.sentimentData[13] || 50) / 50 - 1).toFixed(2)}σ
                                        </span>
                                    </div>
                                    <MiniChart
                                        data={storySteps[activeStep]?.sentimentData || []}
                                        color={activeStep >= 1 ? '#ef4444' : '#10b981'}
                                        animate={true}
                                    />
                                </div>
                            </div>

                            {/* Alert popup */}
                            {storySteps[activeStep]?.alert && (
                                <div className="absolute bottom-4 right-4 left-4 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-lg p-4 animate-pulse">
                                    <div className="flex items-center gap-3">
                                        <AlertTriangle className="w-5 h-5 text-[#ef4444]" />
                                        <div>
                                            <div className="text-[#ef4444] font-bold text-sm">VisualX Alert</div>
                                            <div className="text-[#868993] text-xs">{storySteps[activeStep].alert}</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* P&L card */}
                            {storySteps[activeStep]?.pnl && (
                                <div className="absolute bottom-4 right-4 left-4 bg-[#10b981]/10 border border-[#10b981]/30 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <DollarSign className="w-5 h-5 text-[#10b981]" />
                                            <div>
                                                <div className="text-[#10b981] font-bold text-sm">Trade Profit</div>
                                                <div className="text-[#868993] text-xs">Position closed on signal</div>
                                            </div>
                                        </div>
                                        <div className="text-[#10b981] font-bold text-2xl font-mono">
                                            {storySteps[activeStep].pnl}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Scrolling Steps */}
                    <div className="space-y-32 py-20">
                        {storySteps.map((step, i) => (
                            <div
                                key={step.id}
                                ref={(el) => { stepRefs.current[i] = el; }}
                                className={`transition-all duration-500 ${activeStep === i ? 'opacity-100' : 'opacity-30'
                                    }`}
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${activeStep >= i ? 'bg-[#2962FF] text-white' : 'bg-[#2a2e39] text-[#868993]'
                                        }`}>
                                        {step.id}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{step.title}</h3>
                                        <p className="text-[#868993] text-sm">{step.subtitle}</p>
                                    </div>
                                </div>
                                <p className="text-[#868993] text-lg leading-relaxed ml-14">
                                    {step.description}
                                </p>

                                {step.alert && (
                                    <div className="ml-14 mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-lg text-[#ef4444] text-sm">
                                        <AlertTriangle className="w-4 h-4" />
                                        {step.alert}
                                    </div>
                                )}

                                {step.pnl && (
                                    <div className="ml-14 mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#10b981]/10 border border-[#10b981]/30 rounded-lg text-[#10b981] text-lg font-bold">
                                        <TrendingDown className="w-4 h-4 rotate-180" />
                                        {step.pnl} profit
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* CTA */}
                        <div className="pt-10 ml-14">
                            <a
                                href="/app"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#2962FF] to-[#00d4ff] text-white font-bold rounded-lg hover:shadow-[0_0_30px_rgba(0,212,255,0.3)] transition-all group"
                            >
                                Start Detecting Divergences
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
