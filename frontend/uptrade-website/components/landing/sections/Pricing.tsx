'use client';

import { useState, useRef, useEffect } from 'react';
import { Check, Zap, Crown, Building2 } from 'lucide-react';

interface PricingPlan {
    name: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    cta: string;
    popular?: boolean;
    icon: React.ReactNode;
    color: string;
}

const plans: PricingPlan[] = [
    {
        name: 'Starter',
        price: '$0',
        period: 'forever',
        description: 'Perfect for exploring the platform',
        features: [
            '5 watchlist symbols',
            'Basic TradeX scores',
            'Daily market summary',
            'Community access',
        ],
        cta: 'Start Free',
        icon: <Zap className="w-5 h-5" />,
        color: '#868993',
    },
    {
        name: 'Pro',
        price: '$29',
        period: '/month',
        description: 'For serious retail traders',
        features: [
            'Unlimited watchlist',
            'VisualX divergence alerts',
            'Real-time TradeX scoring',
            '<50ms latency',
            'API access (1k calls/day)',
            'Priority support',
        ],
        cta: 'Go Pro',
        popular: true,
        icon: <Crown className="w-5 h-5" />,
        color: '#00d4ff',
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        period: '',
        description: 'For funds and institutions',
        features: [
            'Everything in Pro',
            'Unlimited API calls',
            'Custom integrations',
            'Dedicated account manager',
            'SLA guarantees',
            'On-premise deployment',
        ],
        cta: 'Contact Sales',
        icon: <Building2 className="w-5 h-5" />,
        color: '#7c3aed',
    },
];

const PricingCard = ({ plan, isAnnual }: { plan: PricingPlan; isAnnual: boolean }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [transform, setTransform] = useState('');

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        setTransform(`perspective(1000px) rotateX(${-y / 30}deg) rotateY(${x / 30}deg) translateZ(10px)`);
    };

    const handleMouseLeave = () => {
        setTransform('perspective(1000px) rotateX(0) rotateY(0) translateZ(0)');
    };

    const annualPrice = plan.price !== '$0' && plan.price !== 'Custom'
        ? `$${Math.round(parseInt(plan.price.replace('$', '')) * 0.8)}`
        : plan.price;

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`relative rounded-2xl border p-8 transition-all duration-300 ease-out ${plan.popular
                    ? 'border-[#00d4ff]/50 bg-[#131722]/80'
                    : 'border-[#2a2e39] bg-[#131722]/60'
                }`}
            style={{
                transform,
                transformStyle: 'preserve-3d',
                boxShadow: plan.popular ? `0 0 40px ${plan.color}20` : 'none'
            }}
        >
            {/* Popular badge */}
            {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#00d4ff] to-[#2962FF] text-white text-xs font-bold rounded-full">
                    MOST POPULAR
                </div>
            )}

            {/* Icon */}
            <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                style={{ backgroundColor: `${plan.color}20`, color: plan.color }}
            >
                {plan.icon}
            </div>

            {/* Name & Price */}
            <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
            <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-bold text-white">
                    {isAnnual ? annualPrice : plan.price}
                </span>
                <span className="text-[#868993]">{plan.period}</span>
            </div>
            {isAnnual && plan.price !== '$0' && plan.price !== 'Custom' && (
                <div className="text-xs text-[#10b981] mb-2">Save 20% annually</div>
            )}
            <p className="text-[#868993] text-sm mb-6">{plan.description}</p>

            {/* Features */}
            <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-[#868993]">
                        <Check className="w-4 h-4 text-[#10b981] mt-0.5 flex-shrink-0" />
                        {feature}
                    </li>
                ))}
            </ul>

            {/* CTA */}
            <button
                className={`w-full py-3 rounded-lg font-bold transition-all ${plan.popular
                        ? 'bg-gradient-to-r from-[#00d4ff] to-[#2962FF] text-white hover:shadow-[0_0_30px_rgba(0,212,255,0.3)]'
                        : 'bg-[#2a2e39] text-white hover:bg-[#3a3e49]'
                    }`}
            >
                {plan.cta}
            </button>
        </div>
    );
};

export const Pricing = () => {
    const [isAnnual, setIsAnnual] = useState(false);

    return (
        <section className="py-24 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-[#868993] text-lg max-w-xl mx-auto mb-8">
                        Start free. Upgrade when you're ready. No hidden fees.
                    </p>

                    {/* Toggle */}
                    <div className="inline-flex items-center gap-4 bg-[#131722] rounded-full p-1 border border-[#2a2e39]">
                        <button
                            onClick={() => setIsAnnual(false)}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${!isAnnual ? 'bg-[#2962FF] text-white' : 'text-[#868993] hover:text-white'
                                }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setIsAnnual(true)}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${isAnnual ? 'bg-[#2962FF] text-white' : 'text-[#868993] hover:text-white'
                                }`}
                        >
                            Annual
                            <span className="ml-2 text-[#10b981] text-xs">-20%</span>
                        </button>
                    </div>
                </div>

                {/* Cards */}
                <div className="grid md:grid-cols-3 gap-8">
                    {plans.map((plan, i) => (
                        <PricingCard key={i} plan={plan} isAnnual={isAnnual} />
                    ))}
                </div>
            </div>
        </section>
    );
};
