'use client'

import { Microscope, Brain, Network, Binary } from 'lucide-react';
import { LandingHeader } from '@/components/landing/Header';
import { Footer } from '@/components/footer';

const models = [
    {
        name: 'VisualX-Sentiment-v2',
        type: 'Transformer',
        architecture: 'DistilBERT-base',
        params: '66M',
        trainingData: '2.3M labeled financial posts',
        accuracy: '89.3%',
        latency: '8ms',
        hardware: 'NVIDIA T4 GPU'
    },
    {
        name: 'TradeX-Fusion-v1',
        type: 'Ensemble',
        architecture: 'LSTM + Attention',
        params: '12M',
        trainingData: '15 years OHLCV + sentiment',
        accuracy: 'Sharpe 1.8',
        latency: '15ms',
        hardware: 'CPU (AVX-512)'
    },
    {
        name: 'Divergence-Detect-v3',
        type: 'Statistical',
        architecture: 'Z-Score + CUSUM',
        params: 'N/A',
        trainingData: '50,000 historical divergences',
        accuracy: '73% precision',
        latency: '3ms',
        hardware: 'CPU'
    }
];

export default function AIAnalysisPage() {
    return (
        <div className="bg-[#0b0e14] min-h-screen">
            <LandingHeader />

            <section className="pt-32 pb-20 px-6 border-b border-[#2a2e39]">
                <div className="max-w-5xl mx-auto">
                    <div className="text-[#089981] font-mono text-sm mb-4 tracking-wider">MACHINE LEARNING</div>
                    <h1 className="text-5xl font-bold text-white mb-6">Models That Understand Markets</h1>
                    <p className="text-xl text-[#868993] max-w-3xl">
                        Production-grade ML infrastructure with full observability.
                        Every prediction includes confidence intervals and feature attribution.
                    </p>
                </div>
            </section>

            <section className="py-24 px-6">
                <div className="max-w-6xl mx-auto space-y-8">
                    {models.map((model) => (
                        <div key={model.name} className="bg-[#131722] border border-[#2a2e39] rounded-xl p-6">
                            <div className="grid md:grid-cols-6 gap-6 items-center">
                                <div className="md:col-span-2">
                                    <h3 className="text-xl font-bold text-white mb-1">{model.name}</h3>
                                    <div className="text-[#089981] text-sm font-mono">{model.type}</div>
                                </div>

                                <div className="space-y-1">
                                    <div className="text-xs text-[#868993] uppercase">Architecture</div>
                                    <div className="text-white text-sm">{model.architecture}</div>
                                    <div className="text-[#868993] text-xs">{model.params} params</div>
                                </div>

                                <div className="space-y-1">
                                    <div className="text-xs text-[#868993] uppercase">Training Data</div>
                                    <div className="text-white text-sm">{model.trainingData}</div>
                                </div>

                                <div className="space-y-1">
                                    <div className="text-xs text-[#868993] uppercase">Performance</div>
                                    <div className="text-[#089981] font-bold">{model.accuracy}</div>
                                    <div className="text-[#868993] text-xs">{model.latency} latency</div>
                                </div>

                                <div className="space-y-1">
                                    <div className="text-xs text-[#868993] uppercase">Infrastructure</div>
                                    <div className="text-white text-sm">{model.hardware}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Feature Attribution Example */}
            <section className="py-24 px-6 bg-[#131722] border-y border-[#2a2e39]">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-white mb-8">Explainable Predictions</h2>
                    <p className="text-[#868993] mb-8">
                        Every PAS score includes SHAP values showing which factors drove the prediction.
                    </p>

                    <div className="bg-[#0b0e14] rounded-xl border border-[#2a2e39] p-6">
                        <div className="text-sm text-[#868993] mb-4">AAPL Prediction Breakdown (PAS: 87.4)</div>

                        {[
                            { factor: 'Social Sentiment', impact: '+12.4', direction: 'positive', desc: 'Twitter bullishness up 34%' },
                            { factor: 'RSI Momentum', impact: '+8.2', direction: 'positive', desc: '14-day RSI at 62, trend up' },
                            { factor: 'P/E Ratio', impact: '-3.1', direction: 'negative', desc: '28.4x vs sector 24.1x' },
                            { factor: 'Options Flow', impact: '+6.3', direction: 'positive', desc: 'Unusual call buying detected' },
                        ].map((item) => (
                            <div key={item.factor} className="flex items-center justify-between py-3 border-b border-[#2a2e39] last:border-0">
                                <div>
                                    <div className="text-white text-sm font-medium">{item.factor}</div>
                                    <div className="text-[#868993] text-xs">{item.desc}</div>
                                </div>
                                <div className={`font-mono font-bold ${item.direction === 'positive' ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                                    {item.impact}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};
