'use client';

export const AboutUs = () => {
    return (
        <section className="py-24 px-6 bg-[#0b0e14] border-t border-[#2a2e39]">
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-6">About UpTrade</h2>
                    <div className="space-y-4 text-[#868993] leading-relaxed">
                        <p>
                            UpTrade was born from a simple realization: institutional traders have unfair advantages. They have faster data, better tools, and powerful AI.
                        </p>
                        <p>
                            We're changing that. We've built an institutional-grade trading engine that brings the power of high-frequency data analysis and machine learning to everyone.
                        </p>
                        <p>
                            Our mission is to democratize financial intelligence. We don't just show you charts; we help you understand what they mean.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-8 mt-12">
                        <div>
                            <div className="text-3xl font-bold text-white mb-1">50+</div>
                            <div className="text-sm text-[#868993]">Data Sources</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white mb-1">&lt;50ms</div>
                            <div className="text-sm text-[#868993]">Latency</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white mb-1">24/7</div>
                            <div className="text-sm text-[#868993]">AI Monitoring</div>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <div className="aspect-square bg-gradient-to-tr from-[#2962FF]/20 to-[#089981]/20 rounded-2xl border border-[#2a2e39] p-8 flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-6xl font-bold text-white/10 select-none">UPTRADE</div>
                            <div className="mt-4 text-[#2962FF] font-mono">Building the future of trading</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
