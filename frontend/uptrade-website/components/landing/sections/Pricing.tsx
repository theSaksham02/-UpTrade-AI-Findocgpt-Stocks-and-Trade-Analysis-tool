'use client';

import { Check } from 'lucide-react';
import Link from 'next/link';

const plans = [
    {
        name: 'Starter',
        price: '$0',
        description: 'Perfect for getting started',
        features: ['Real-time market data', 'Basic charting', '5 AI alerts/day', 'Community support'],
        cta: 'Start Free',
        popular: false,
    },
    {
        name: 'Pro',
        price: '$49',
        description: 'For serious traders',
        features: ['Everything in Starter', 'Advanced AI predictions', 'Unlimited alerts', 'API Access', 'Priority support'],
        cta: 'Get Pro',
        popular: true,
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        description: 'For institutions',
        features: ['Everything in Pro', 'Dedicated infrastructure', 'Custom integrations', '24/7 SLA support', 'On-premise option'],
        cta: 'Contact Sales',
        popular: false,
    },
];

export const Pricing = () => {
    return (
        <section className="py-24 px-6 bg-[#0b0e14] border-t border-[#2a2e39]">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-white mb-4">Simple Pricing</h2>
                    <p className="text-[#868993]">Start for free, upgrade as you grow.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`bg-[#131722] border rounded-2xl p-8 relative ${plan.popular ? 'border-[#2962FF] shadow-2xl shadow-blue-900/20' : 'border-[#2a2e39]'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#2962FF] text-white px-4 py-1 rounded-full text-sm font-medium">
                                    Most Popular
                                </div>
                            )}

                            <div className="text-center mb-8">
                                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                                <div className="text-4xl font-bold text-white mb-2">{plan.price}</div>
                                <p className="text-[#868993] text-sm">{plan.description}</p>
                            </div>

                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-[#d1d4dc] text-sm">
                                        <Check className="w-4 h-4 text-[#2962FF]" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href="/signup"
                                className={`block w-full text-center py-3 rounded-lg font-medium transition-colors ${plan.popular
                                        ? 'bg-[#2962FF] hover:bg-[#1e53e5] text-white'
                                        : 'bg-[#1e222d] hover:bg-[#2a2e39] text-white'
                                    }`}
                            >
                                {plan.cta}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
