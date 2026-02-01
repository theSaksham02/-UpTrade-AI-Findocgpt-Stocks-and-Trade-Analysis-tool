"use client"

import { motion, useInView } from "framer-motion"
import { Check, Zap, ChevronDown } from "lucide-react"
import { useRef, useState } from "react"
import { PricingToggle } from "./pricing-toggle"

const pricingTiers = [
  {
    name: "Basic",
    monthlyPrice: 0,
    annualPrice: 0,
    subtitle: "Free forever",
    description: "Get started with essential trading tools",
    features: [
      "2 charts per tab",
      "Basic market data",
      "5 watchlists",
      "Community support",
      "Mobile app access",
      "Basic alerts (5)",
    ],
    popular: false,
    cta: "Get Started Free",
  },
  {
    name: "Essential",
    monthlyPrice: 14.95,
    annualPrice: 12.95,
    subtitle: "",
    description: "Enhanced tools for active traders",
    features: [
      "5 charts per tab",
      "Real-time data",
      "Unlimited watchlists",
      "Email support",
      "10 indicators per chart",
      "Price alerts (20)",
      "Ad-free experience",
    ],
    popular: false,
    cta: "Start Free Trial",
  },
  {
    name: "Plus",
    monthlyPrice: 29.95,
    annualPrice: 24.95,
    subtitle: "",
    description: "Advanced features for serious traders",
    features: [
      "10 charts per tab",
      "All Essential features",
      "25 indicators per chart",
      "Volume Profile",
      "Bar Replay",
      "Price alerts (100)",
      "Priority support",
      "Intraday data",
    ],
    popular: false,
    cta: "Start Free Trial",
  },
  {
    name: "Premium",
    monthlyPrice: 59.95,
    annualPrice: 49.95,
    subtitle: "Most Popular",
    description: "Complete toolkit for professional traders",
    features: [
      "Unlimited charts",
      "All Plus features",
      "AI-powered analysis",
      "Custom indicators",
      "Second-based alerts",
      "Extended hours data",
      "Multi-monitor support",
      "API access (Basic)",
      "Dedicated support",
    ],
    popular: true,
    cta: "Start Free Trial",
  },
  {
    name: "Ultimate",
    monthlyPrice: 119.95,
    annualPrice: 99.95,
    subtitle: "",
    description: "Maximum power for institutional needs",
    features: [
      "Everything in Premium",
      "Unlimited AI analysis",
      "Full API access",
      "White-label options",
      "Dedicated account manager",
      "Custom integrations",
      "Server-side alerts",
      "SLA guarantee",
      "Training & onboarding",
    ],
    popular: false,
    cta: "Contact Sales",
  },
]

const comparisonFeatures = [
  { name: "Charts per tab", basic: "2", essential: "5", plus: "10", premium: "Unlimited", ultimate: "Unlimited" },
  { name: "Indicators per chart", basic: "3", essential: "10", plus: "25", premium: "Unlimited", ultimate: "Unlimited" },
  { name: "Real-time data", basic: false, essential: true, plus: true, premium: true, ultimate: true },
  { name: "AI Analysis", basic: false, essential: false, plus: false, premium: true, ultimate: true },
  { name: "Volume Profile", basic: false, essential: false, plus: true, premium: true, ultimate: true },
  { name: "Bar Replay", basic: false, essential: false, plus: true, premium: true, ultimate: true },
  { name: "API Access", basic: false, essential: false, plus: false, premium: "Basic", ultimate: "Full" },
  { name: "Custom Alerts", basic: "5", essential: "20", plus: "100", premium: "Unlimited", ultimate: "Unlimited" },
  { name: "Ad-free", basic: false, essential: true, plus: true, premium: true, ultimate: true },
  { name: "Priority Support", basic: false, essential: false, plus: true, premium: true, ultimate: true },
]

const faqs = [
  {
    question: "Can I switch plans at any time?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll be charged the prorated difference. When downgrading, the new rate applies at your next billing cycle."
  },
  {
    question: "Is there a free trial?",
    answer: "Yes! All paid plans include a 14-day free trial. No credit card required to start. You'll only be charged after the trial ends if you decide to continue."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and cryptocurrency payments including Bitcoin and Ethereum."
  },
  {
    question: "Can I get a refund?",
    answer: "We offer a 30-day money-back guarantee on all plans. If you're not satisfied, contact our support team for a full refund."
  },
  {
    question: "Do you offer discounts for annual billing?",
    answer: "Yes! Annual billing saves you 16% compared to monthly billing. This is automatically applied when you select the annual option."
  },
]

export function PricingSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [isAnnual, setIsAnnual] = useState(true)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <section id="pricing" className="py-20 px-4 relative" ref={ref} style={{ backgroundColor: 'var(--tv-bg-dark)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--tv-text-primary)' }}>
            Choose Your <span style={{ color: 'var(--tv-blue)' }}>Trading Plan</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--tv-text-muted)' }}>
            Flexible plans designed to grow with your trading journey. Start free, upgrade anytime.
          </p>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <PricingToggle isAnnual={isAnnual} onToggle={() => setIsAnnual(!isAnnual)} />
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-20">
          {pricingTiers.map((tier, index) => {
            const price = isAnnual ? tier.annualPrice : tier.monthlyPrice
            const savings = tier.monthlyPrice > 0 ? Math.round((tier.monthlyPrice - tier.annualPrice) * 12) : 0

            return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
                className={`relative group ${tier.popular ? 'lg:-mt-4 lg:mb-0' : ''}`}
              >
                {/* Popular Badge */}
                {tier.popular && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 z-10"
                    style={{ backgroundColor: 'var(--tv-blue)', color: 'white' }}
                  >
                    <Zap className="w-3 h-3" />
                    Most Popular
                  </div>
                )}

                {/* Card */}
                <div
                  className={`h-full rounded-lg p-5 transition-all duration-300 ${tier.popular
                      ? 'ring-2 ring-[var(--tv-blue)] shadow-lg shadow-[var(--tv-blue)]/20'
                      : 'hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30'
                    }`}
                  style={{
                    backgroundColor: 'var(--tv-surface)',
                    border: `1px solid ${tier.popular ? 'var(--tv-blue)' : 'var(--tv-border)'}`,
                  }}
                >
                  {/* Plan Name */}
                  <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--tv-text-primary)' }}>
                    {tier.name}
                  </h3>
                  {tier.subtitle && tier.name === "Basic" && (
                    <p className="text-xs mb-3" style={{ color: 'var(--tv-green)' }}>{tier.subtitle}</p>
                  )}
                  {!tier.subtitle && <div className="h-4 mb-3" />}

                  {/* Price */}
                  <div className="mb-4">
                    <div className="flex items-baseline">
                      {price === 0 ? (
                        <span className="text-3xl font-bold" style={{ color: 'var(--tv-text-primary)' }}>Free</span>
                      ) : (
                        <>
                          <span className="text-sm" style={{ color: 'var(--tv-text-muted)' }}>$</span>
                          <span className="text-3xl font-bold" style={{ color: 'var(--tv-text-primary)' }}>
                            {price.toFixed(2).split('.')[0]}
                          </span>
                          <span className="text-lg" style={{ color: 'var(--tv-text-muted)' }}>
                            .{price.toFixed(2).split('.')[1]}
                          </span>
                          <span className="text-sm ml-1" style={{ color: 'var(--tv-text-muted)' }}>/mo</span>
                        </>
                      )}
                    </div>
                    {isAnnual && savings > 0 && (
                      <div
                        className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium"
                        style={{ backgroundColor: 'var(--tv-green-bg)', color: 'var(--tv-green)' }}
                      >
                        Save ${savings}/year
                      </div>
                    )}
                    {isAnnual && price > 0 && (
                      <p className="text-xs mt-1" style={{ color: 'var(--tv-text-muted)' }}>Billed annually</p>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs mb-4 min-h-[2rem]" style={{ color: 'var(--tv-text-secondary)' }}>
                    {tier.description}
                  </p>

                  {/* CTA Button */}
                  <button
                    className={`w-full py-2.5 rounded font-medium text-sm transition-all duration-200 mb-4 ${tier.popular
                        ? 'hover:brightness-110'
                        : 'hover:bg-[var(--tv-surface-hover)]'
                      }`}
                    style={{
                      backgroundColor: tier.popular ? 'var(--tv-blue)' : 'transparent',
                      color: tier.popular ? 'white' : 'var(--tv-blue)',
                      border: tier.popular ? 'none' : '1px solid var(--tv-blue)',
                    }}
                  >
                    {tier.cta}
                  </button>

                  {/* Features */}
                  <ul className="space-y-2">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--tv-blue)' }} />
                        <span style={{ color: 'var(--tv-text)' }}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-20 overflow-x-auto"
        >
          <h3 className="text-2xl font-bold mb-6 text-center" style={{ color: 'var(--tv-text-primary)' }}>
            Compare Features
          </h3>
          <table className="w-full min-w-[800px]" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--tv-surface-hover)' }}>
                <th className="text-left p-4 text-sm font-semibold sticky left-0" style={{ color: 'var(--tv-text-primary)', backgroundColor: 'var(--tv-surface-hover)' }}>Feature</th>
                {pricingTiers.map(tier => (
                  <th key={tier.name} className="p-4 text-sm font-semibold text-center" style={{ color: tier.popular ? 'var(--tv-blue)' : 'var(--tv-text-primary)' }}>
                    {tier.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonFeatures.map((feature, index) => (
                <tr
                  key={feature.name}
                  style={{ backgroundColor: index % 2 === 0 ? 'var(--tv-surface)' : 'var(--tv-bg-dark)' }}
                >
                  <td className="p-4 text-sm sticky left-0" style={{ color: 'var(--tv-text)', backgroundColor: index % 2 === 0 ? 'var(--tv-surface)' : 'var(--tv-bg-dark)' }}>
                    {feature.name}
                  </td>
                  {['basic', 'essential', 'plus', 'premium', 'ultimate'].map(tier => {
                    const value = feature[tier as keyof typeof feature]
                    return (
                      <td key={tier} className="p-4 text-center">
                        {typeof value === 'boolean' ? (
                          value ? (
                            <Check className="w-5 h-5 mx-auto" style={{ color: 'var(--tv-blue)' }} />
                          ) : (
                            <span style={{ color: 'var(--tv-text-muted)' }}>—</span>
                          )
                        ) : (
                          <span className="text-sm" style={{ color: 'var(--tv-text)' }}>{value}</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <h3 className="text-2xl font-bold mb-8 text-center" style={{ color: 'var(--tv-text-primary)' }}>
            Frequently Asked Questions
          </h3>
          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-lg overflow-hidden"
                style={{ backgroundColor: 'var(--tv-surface)', border: '1px solid var(--tv-border)' }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-[var(--tv-surface-hover)] transition-colors"
                >
                  <span className="font-medium text-sm" style={{ color: 'var(--tv-text-primary)' }}>
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}
                    style={{ color: 'var(--tv-text-muted)' }}
                  />
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: openFaq === index ? 'auto' : 0, opacity: openFaq === index ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="px-4 pb-4 text-sm" style={{ color: 'var(--tv-text-muted)' }}>
                    {faq.answer}
                  </p>
                </motion.div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Trust Signals */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <span className="text-xs" style={{ color: 'var(--tv-text-muted)' }}>🔒 SSL Secure</span>
            <span className="text-xs" style={{ color: 'var(--tv-text-muted)' }}>💳 All major cards accepted</span>
            <span className="text-xs" style={{ color: 'var(--tv-text-muted)' }}>🔄 Cancel anytime</span>
            <span className="text-xs" style={{ color: 'var(--tv-text-muted)' }}>💰 30-day money-back guarantee</span>
          </div>
          <p className="text-sm" style={{ color: 'var(--tv-text-secondary)' }}>
            All plans include a 14-day free trial. No credit card required.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
