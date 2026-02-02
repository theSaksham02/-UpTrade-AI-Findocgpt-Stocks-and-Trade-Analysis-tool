'use client'

import { useState } from 'react';
import { Check, X, Copy } from 'lucide-react';

const plans = [
    {
        name: 'Starter',
        price: { monthly: 0, annual: 0 },
        description: 'For individual developers and algo traders',
        specs: [
            { key: 'API Rate Limit', value: '100/min' },
            { key: 'WebSocket Latency', value: '<100ms' },
            { key: 'Data Sources', value: '10' },
            { key: 'VisualX Alerts', value: '5/day' },
            { key: 'Historical Data', value: '1 year' },
            { key: 'Support', value: 'Community' },
        ],
        cta: '> Start Free',
        ctaStyle: 'outline',
        popular: false
    },
    {
        name: 'Pro',
        price: { monthly: 99, annual: 79 },
        description: 'For professional traders and small funds',
        specs: [
            { key: 'API Rate Limit', value: 'Unlimited' },
            { key: 'WebSocket Latency', value: '<50ms' },
            { key: 'Data Sources', value: '50+' },
            { key: 'VisualX Alerts', value: 'Unlimited' },
            { key: 'Historical Data', value: '5 years' },
            { key: 'Support', value: 'Priority Email' },
        ],
        cta: '> Upgrade to Pro',
        ctaStyle: 'primary',
        popular: true
    },
    {
        name: 'Enterprise',
        price: { monthly: null, annual: null },
        description: 'For institutions and high-frequency shops',
        specs: [
            { key: 'API Rate Limit', value: 'Custom' },
            { key: 'WebSocket Latency', value: '<10ms' },
            { key: 'Data Sources', value: 'Unlimited' },
            { key: 'VisualX Alerts', value: 'White-label' },
            { key: 'Historical Data', value: 'Full tick data' },
            { key: 'Support', value: 'Dedicated Slack' },
        ],
        cta: '> Contact Sales',
        ctaStyle: 'outline',
        popular: false
    }
];

const faqs = [
    {
        q: 'Can I upgrade or downgrade anytime?',
        a: 'Yes. Changes take effect at the start of your next billing cycle. No proration for downgrades.'
    },
    {
        q: 'What happens if I exceed my API limits?',
        a: 'You will receive a 429 status code. We do not auto-upgrade or charge overages.'
    },
    {
        q: 'Do you offer educational discounts?',
        a: 'Yes. University students and researchers email support@uptrade.io with .edu verification.'
    },
    {
        q: 'Is there a self-hosted option?',
        a: 'Enterprise customers can deploy on-premise. Contact sales for VPC pricing.'
    },
];

export default function PricingPage() {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
    const [copiedCmd, setCopiedCmd] = useState(false);

    const handleCopyCmd = () => {
        navigator.clipboard.writeText('curl -X POST api.uptrade.com/v1/subscribe -H "Authorization: Bearer $API_KEY"');
        setCopiedCmd(true);
        setTimeout(() => setCopiedCmd(false), 2000);
    };

    return (
        <div className="min-h-screen">
            {/* Header */}
            <section className="pt-32 pb-16 px-6 text-center">
                <div className="text-[#00d4ff] font-mono text-sm mb-4 tracking-wider">PRICING</div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                    Infrastructure Pricing
                </h1>
                <p className="text-lg text-[#868993] max-w-xl mx-auto">
                    Compute cost passed through at cost. No margin on infrastructure.
                </p>

                {/* Billing Toggle */}
                <div className="mt-8 inline-flex items-center gap-1 p-1 bg-[#13131f] border border-white/10 rounded-lg">
                    <button
                        onClick={() => setBillingCycle('monthly')}
                        className={`px-4 py-2 text-sm font-mono rounded transition-all ${billingCycle === 'monthly'
                                ? 'bg-[#00d4ff] text-[#0a0a0f] font-bold'
                                : 'text-[#868993] hover:text-white'
                            }`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setBillingCycle('annual')}
                        className={`px-4 py-2 text-sm font-mono rounded transition-all flex items-center gap-2 ${billingCycle === 'annual'
                                ? 'bg-[#00d4ff] text-[#0a0a0f] font-bold'
                                : 'text-[#868993] hover:text-white'
                            }`}
                    >
                        Annual
                        <span className={`text-xs px-1.5 py-0.5 rounded ${billingCycle === 'annual' ? 'bg-[#0a0a0f]/20' : 'bg-[#10b981]/20 text-[#10b981]'
                            }`}>
                            -20%
                        </span>
                    </button>
                </div>
            </section>

            {/* Pricing Table */}
            <section className="px-6 pb-20">
                <div className="max-w-5xl mx-auto">
                    {/* Header Row */}
                    <div className="grid grid-cols-4 gap-4 mb-2 px-4">
                        <div className="text-xs text-[#868993] font-mono uppercase tracking-wider py-3">
                            Specifications
                        </div>
                        {plans.map((plan) => (
                            <div
                                key={plan.name}
                                className={`text-center py-3 ${plan.popular ? 'text-[#00d4ff]' : 'text-white'}`}
                            >
                                <div className="font-bold text-lg">{plan.name}</div>
                            </div>
                        ))}
                    </div>

                    {/* Price Row */}
                    <div className="grid grid-cols-4 gap-4 border-y border-white/10 px-4 py-4 bg-[#13131f]/50">
                        <div className="text-xs text-[#868993] font-mono uppercase tracking-wider flex items-center">
                            Price
                        </div>
                        {plans.map((plan) => (
                            <div
                                key={plan.name}
                                className={`text-center ${plan.popular ? 'relative' : ''}`}
                            >
                                {plan.popular && (
                                    <div className="absolute -left-2 top-0 bottom-0 w-0.5 bg-[#00d4ff] rounded-full" />
                                )}
                                {plan.price[billingCycle] !== null ? (
                                    <div className="font-mono">
                                        <span className="text-3xl font-bold text-white">
                                            ${plan.price[billingCycle]}
                                        </span>
                                        <span className="text-[#868993] text-sm">/mo</span>
                                    </div>
                                ) : (
                                    <div className="text-2xl font-bold text-white font-mono">Custom</div>
                                )}
                                <div className="text-xs text-[#868993] mt-1">{plan.description}</div>
                            </div>
                        ))}
                    </div>

                    {/* Spec Rows */}
                    {plans[0].specs.map((spec, idx) => (
                        <div
                            key={spec.key}
                            className={`grid grid-cols-4 gap-4 px-4 py-3 ${idx % 2 === 0 ? 'bg-[#0a0a0f]' : 'bg-[#13131f]/30'
                                }`}
                        >
                            <div className="text-sm text-[#868993] font-mono">
                                {spec.key}
                            </div>
                            {plans.map((plan) => (
                                <div
                                    key={plan.name}
                                    className={`text-center font-mono text-sm ${plan.popular ? 'text-[#00d4ff] font-medium' : 'text-white'
                                        }`}
                                >
                                    {plan.specs[idx].value}
                                </div>
                            ))}
                        </div>
                    ))}

                    {/* CTA Row */}
                    <div className="grid grid-cols-4 gap-4 px-4 py-6 border-t border-white/10">
                        <div></div>
                        {plans.map((plan) => (
                            <div key={plan.name} className="text-center">
                                <button
                                    className={`w-full py-3 px-4 rounded font-mono text-sm transition-all ${plan.ctaStyle === 'primary'
                                            ? 'bg-[#00d4ff] text-[#0a0a0f] font-bold hover:bg-[#00b8d9]'
                                            : 'border border-white/20 text-white hover:border-[#00d4ff] hover:text-[#00d4ff]'
                                        } ${plan.popular ? 'shadow-[0_0_20px_rgba(0,212,255,0.2)]' : ''}`}
                                >
                                    {plan.cta}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* API Command */}
            <section className="px-6 pb-20">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-[#13131f] border border-white/10 rounded-lg overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-2 bg-[#0a0a0f] border-b border-white/10">
                            <span className="text-xs text-[#868993] font-mono">Subscribe via API</span>
                            <button
                                onClick={handleCopyCmd}
                                className="text-[#868993] hover:text-white transition-colors"
                            >
                                {copiedCmd ? <Check className="w-4 h-4 text-[#10b981]" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>
                        <pre className="p-4 text-sm font-mono text-[#00d4ff] overflow-x-auto">
                            <code>curl -X POST api.uptrade.com/v1/subscribe -H "Authorization: Bearer $API_KEY"</code>
                        </pre>
                    </div>
                </div>
            </section>

            {/* FAQ - Terminal Style */}
            <section className="px-6 pb-24">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-white mb-8 font-mono">
                        <span className="text-[#868993]"># </span>FAQ
                    </h2>
                    <div className="space-y-4 font-mono">
                        {faqs.map((faq, i) => (
                            <div key={i} className="bg-[#13131f] border border-white/10 rounded-lg p-4">
                                <div className="text-[#00d4ff] text-sm mb-2">
                                    <span className="text-[#868993]">Q: </span>{faq.q}
                                </div>
                                <div className="text-white text-sm pl-3 border-l-2 border-[#10b981]/30">
                                    <span className="text-[#10b981]">A: </span>{faq.a}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
