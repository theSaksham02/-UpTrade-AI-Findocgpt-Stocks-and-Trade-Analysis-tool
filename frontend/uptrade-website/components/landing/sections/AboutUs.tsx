'use client'

export function AboutUs() {
    return (
        <section className="py-24 px-4 bg-[#0d1017] border-t border-[#2a2e39]">
            <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-md font-bold text-[#2962FF] uppercase tracking-widest mb-4">About UpTrade</h2>
                <h3 className="text-4xl md:text-5xl font-bold text-white mb-16">
                    We turn noise into <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2962FF] to-[#089981] animate-pulse">Alpha</span>.
                </h3>

                <div className="grid md:grid-cols-3 gap-12">
                    <div className="p-8 bg-[#131722] rounded-2xl border border-[#2a2e39] hover:border-[#2962FF] transition-all duration-500 hover:-translate-y-2 group">
                        <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform duration-300">⚡️</div>
                        <h4 className="text-xl font-bold text-white mb-4">Latency First</h4>
                        <p className="text-[#868993] leading-relaxed">
                            Built on Rust and Go backends, our engines process millions of data points with sub-50ms latency. Speed is not a feature, it's a requirement.
                        </p>
                    </div>

                    <div className="p-8 bg-[#131722] rounded-2xl border border-[#2a2e39] hover:border-[#089981] transition-all duration-500 hover:-translate-y-2 group">
                        <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform duration-300">🧠</div>
                        <h4 className="text-xl font-bold text-white mb-4">AI Native</h4>
                        <p className="text-[#868993] leading-relaxed">
                            We don't bolt AI on. UpTrade is built around DistilBERT and Transformer models that read SEC filings and earnings calls faster than you can blink.
                        </p>
                    </div>

                    <div className="p-8 bg-[#131722] rounded-2xl border border-[#2a2e39] hover:border-[#f23645] transition-all duration-500 hover:-translate-y-2 group">
                        <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform duration-300">🛡️</div>
                        <h4 className="text-xl font-bold text-white mb-4">Institutional Grade</h4>
                        <p className="text-[#868993] leading-relaxed">
                            Designed by former HFT engineers. We bring dark pool tracking, option flow analysis, and level 2 data to retail without the $24k price tag.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
