'use client'

import { MapPin, DollarSign, Users } from 'lucide-react';
import { LandingHeader } from '@/components/landing/Header';
import { Footer } from '@/components/footer';

const openings = [
    {
        title: 'Senior Quantitative Researcher',
        team: 'TradeX',
        location: 'New York / Remote',
        salary: '$180k - $250k',
        type: 'Full-time',
        description: 'Build alpha-generating factor models. Experience with LSTM, Transformers, and high-frequency market microstructure required.'
    },
    {
        title: 'Machine Learning Engineer',
        team: 'VisualX',
        location: 'San Francisco / Remote',
        salary: '$160k - $220k',
        type: 'Full-time',
        description: 'Productionize NLP models at scale. Optimize DistilBERT inference to <10ms. CUDA, TensorRT, ONNX experience preferred.'
    },
    {
        title: 'Senior Backend Engineer',
        team: 'Platform',
        location: 'Remote (US/EU)',
        salary: '$150k - $200k',
        type: 'Full-time',
        description: 'Design high-throughput data pipelines. Expert in Kafka, Redis, PostgreSQL. Financial data experience a plus.'
    },
    {
        title: 'Product Designer',
        team: 'Design',
        location: 'New York',
        salary: '$130k - $170k',
        type: 'Full-time',
        description: 'Design professional trading interfaces. Complex data visualization, design systems, and React/TypeScript prototyping.'
    }
];

const benefits = [
    'Equity stake in early-stage startup',
    'Unlimited PTO (minimum 20 days encouraged)',
    'Healthcare, dental, vision (100% employer paid)',
    '$5,000 annual learning budget',
    'Home office stipend ($2,000)',
    'Quarterly team retreats'
];

export default function CareersPage() {
    return (
        <div className="bg-[#0b0e14] min-h-screen">
            <LandingHeader />

            <section className="pt-32 pb-20 px-6 border-b border-[#2a2e39]">
                <div className="max-w-5xl mx-auto text-center">
                    <h1 className="text-5xl font-bold text-white mb-6">Join the Team</h1>
                    <p className="text-xl text-[#868993] max-w-2xl mx-auto">
                        Building the future of decision intelligence. We're hiring exceptional engineers, researchers, and designers.
                    </p>
                </div>
            </section>

            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto space-y-6">
                    {openings.map((job) => (
                        <div key={job.title} className="bg-[#131722] border border-[#2a2e39] rounded-xl p-6 hover:border-[#363a45] transition-colors">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1">{job.title}</h3>
                                    <div className="text-[#2962FF] text-sm font-medium">{job.team}</div>
                                </div>
                                <span className="px-3 py-1 bg-[#1e222d] text-[#868993] text-xs rounded-full uppercase tracking-wider">
                                    {job.type}
                                </span>
                            </div>

                            <p className="text-[#868993] mb-4 text-sm leading-relaxed">{job.description}</p>

                            <div className="flex items-center gap-6 text-sm text-[#868993]">
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" /> {job.location}
                                </span>
                                <span className="flex items-center gap-1">
                                    <DollarSign className="w-4 h-4" /> {job.salary}
                                </span>
                            </div>

                            <button className="mt-6 text-[#2962FF] text-sm font-medium hover:underline">
                                View details →
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            <section className="py-24 px-6 bg-[#131722] border-y border-[#2a2e39]">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-white mb-8 text-center">Benefits</h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        {benefits.map((benefit) => (
                            <div key={benefit} className="flex items-center gap-3 text-[#d1d4dc]">
                                <div className="w-2 h-2 rounded-full bg-[#089981]" />
                                {benefit}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};
