'use client'

import { Check, X, HelpCircle } from 'lucide-react';
import { LandingHeader } from '@/components/landing/Header';
// Footer handled by layout

const plans = [
    {
        name: 'Developer',
        price: 'Free',
        description: 'For individual developers and algo traders',
        features: [
            { text: '100 API requests/day', included: true },
            { text: '1 WebSocket connection', included: true },
            { text: 'Real-time sentiment (delayed 15min)', included: true },
            { text: 'TradeX basic factors', included: true },
            { text: 'Community support', included: true },
            { text: 'VisualX divergence alerts', included: false },
            { text: 'Historical data API', included: false },
            { text: 'Custom models', included: false },
        ],
        cta: 'Start Free',
        popular: false
    },
    {
        name: 'Professional',
        price: '$99',
        period: '/month',
        description: 'For professional traders and small funds',
        features: [
            { text: '10,000 API requests/day', included: true },
            { text: '10 WebSocket connections', included: true },
            { text: 'Real-time sentiment (live)', included: true },
            { text: 'TradeX all factors', included: true },
            { text: 'Priority email support', included: true },
            { text: 'VisualX divergence alerts', included: true },
            { text: '5 years historical data', included: true },
            { text: 'Custom models', included: false },
        ],
        cta: 'Start Pro Trial',
        popular: true
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        description: 'For institutions and high-frequency shops',
        features: [
            { text: 'Unlimited API requests', included: true },
            { text: 'Unlimited WebSocket connections', included: true },
            { text: 'Real-time sentiment + raw feed', included: true },
            { text: 'TradeX + custom factor weights', included: true },
            { text: '24/7 phone + Slack support', included: true },
            { text: 'VisualX + custom alert rules', included: true },
            { text: 'Full historical tick data', included: true },
            { text: 'Deploy custom models', included: true },
        ],
        cta: 'Contact Sales',
        popular: false
    }
];

const dataFees = [
    { exchange: 'US Equities (Tape A)', fee: 'Free', notes: 'Included in all plans' },
    { exchange: 'US Equities (Tape B/C)', fee: '$2/mo', notes: 'Professional+ only' },
    { exchange: 'Options (OPRA)', fee: '$25/mo', notes: 'Professional+ only' },
    { exchange: 'Crypto (Coinbase, Binance)', fee: 'Free', notes: 'Real-time included' },
    { exchange: 'Forex (OANDA)', fee: 'Free', notes: 'Real-time included' },
];

export default function PricingPage() {
    return (
        <div className="bg-[#0b0e14] min-h-screen">
            <LandingHeader />

            <section className="pt-32 pb-20 px-6 text-center border-b border-[#2a2e39]">
                <h1 className="text-5xl font-bold text-white mb-6">Simple, Transparent Pricing</h1>
                <p className="text-xl text-[#868993] max-w-2xl mx-auto">
                    Start free. Scale as you grow. No hidden fees, no long-term contracts.
                </p>
            </section>

            <section className="py-24 px-6">
                <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`bg-[#131722]/40 backdrop-blur-md rounded-xl border ${plan.popular ? 'border-[#2962FF]' : 'border-[#2a2e39]/50'
                                } p-6 flex flex-col`}
                        >
                            {plan.popular && (
                                <div className="text-[#2962FF] text-xs font-bold uppercase tracking-wider mb-4">
                                    Most Popular
                                </div>
                            )}
                            <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                            <div className="flex items-baseline gap-1 mb-2">
                                <span className="text-4xl font-bold text-white">{plan.price}</span>
                                {plan.period && <span className="text-[#868993]">{plan.period}</span>}
                            </div>
                            <p className="text-[#868993] text-sm mb-6">{plan.description}</p>

                            <ul className="space-y-3 mb-8 flex-1">
                                {plan.features.map((feature) => (
                                    <li key={feature.text} className="flex items-start gap-3">
                                        {feature.included ? (
                                            <Check className="w-5 h-5 text-[#089981] shrink-0" />
                                        ) : (
                                            <X className="w-5 h-5 text-[#868993] shrink-0" />
                                        )}
                                        <span className={feature.included ? 'text-[#d1d4dc]' : 'text-[#868993]'}>
                                            {feature.text}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                className={`w-full py-3 rounded-lg font-medium transition-colors ${plan.popular
                                    ? 'bg-[#2962FF] hover:bg-[#1e53e5] text-white'
                                    : 'bg-[#1e222d] hover:bg-[#2a2e39] text-white'
                                    }`}
                            >
                                {plan.cta}
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Data Fees */}
            <section className="py-24 px-6 bg-[#131722]/20 backdrop-blur-sm border-y border-[#2a2e39]/30">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-2 mb-8">
                        <h2 className="text-2xl font-bold text-white">Market Data Fees</h2>
                        <HelpCircle className="w-5 h-5 text-[#868993]" />
                    </div>
                    <p className="text-[#868993] mb-6">
                        Exchange-mandated fees passed through at cost. Required for real-time US equity data.
                    </p>

                    <div className="bg-[#0b0e14]/40 backdrop-blur-md rounded-xl border border-[#2a2e39]/50 overflow-hidden">
                        <div className="grid grid-cols-3 gap-4 px-6 py-3 border-b border-[#2a2e39] bg-[#1e222d] text-sm font-medium text-[#868993]">
                            <div>Exchange</div>
                            <div>Monthly Fee</div>
                            <div>Notes</div>
                        </div>
                        {dataFees.map((fee) => (
                            <div key={fee.exchange} className="grid grid-cols-3 gap-4 px-6 py-4 border-b border-[#2a2e39] last:border-0 text-sm">
                                <div className="text-white">{fee.exchange}</div>
                                <div className="text-[#089981] font-mono">{fee.fee}</div>
                                <div className="text-[#868993]">{fee.notes}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-24 px-6">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {[
                            { q: 'Can I upgrade or downgrade anytime?', a: 'Yes. Changes take effect at the start of your next billing cycle. No proration for downgrades.' },
                            { q: 'What happens if I exceed my API limits?', a: 'You will receive a 429 status code. We do not auto-upgrade or charge overages.' },
                            { q: 'Do you offer educational discounts?', a: 'Yes. University students and researchers email support@uptrade.io with .edu verification.' },
                            { q: 'Is there a self-hosted option?', a: 'Enterprise customers can deploy on-premise. Contact sales for VPC pricing.' },
                        ].map((faq, i) => (
                            <div key={i} className="bg-[#131722]/40 backdrop-blur-md border border-[#2a2e39]/50 rounded-lg p-6">
                                <h3 className="text-white font-medium mb-2">{faq.q}</h3>
                                <p className="text-[#868993] text-sm">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

// Footer removed (handled by layout)
        </div>
    );
};
