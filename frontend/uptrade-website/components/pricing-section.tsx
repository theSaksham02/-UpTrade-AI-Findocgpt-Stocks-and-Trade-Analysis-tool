"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Check, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

const pricingTiers = [
  {
    name: "Starter",
    price: "$29",
    period: "/month",
    description: "Perfect for beginners exploring AI-powered trading",
    features: [
      "Real-time market data",
      "Basic AI analysis",
      "5 active watchlists",
      "Email support",
      "Mobile app access",
      "Educational resources",
    ],
    popular: false,
  },
  {
    name: "Professional",
    price: "$99",
    period: "/month",
    description: "Advanced tools for serious traders",
    features: [
      "Everything in Starter",
      "Advanced AI predictions",
      "Unlimited watchlists",
      "Priority support 24/7",
      "Custom alerts",
      "Portfolio analytics",
      "API access",
      "Risk management tools",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "pricing",
    description: "Tailored solutions for institutions",
    features: [
      "Everything in Professional",
      "Dedicated AI models",
      "White-label solutions",
      "Dedicated account manager",
      "Custom integrations",
      "Advanced security",
      "Training & onboarding",
      "SLA guarantee",
    ],
    popular: false,
  },
]

export function PricingSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="pricing" className="py-20 px-4 relative" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Choose Your <span className="text-blue-400">Trading Edge</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Flexible pricing plans designed to scale with your trading journey
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative ${
                tier.popular ? "md:-mt-4 md:mb-0" : ""
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                  <Zap className="w-4 h-4 mr-1" />
                  Most Popular
                </div>
              )}
              <div
                className={`bg-white/5 backdrop-blur-md border ${
                  tier.popular ? "border-blue-500/50" : "border-white/10"
                } rounded-2xl p-8 h-full hover:bg-white/10 transition-all duration-300 ${
                  tier.popular ? "shadow-2xl shadow-blue-500/20" : ""
                }`}
              >
                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                <p className="text-white/60 text-sm mb-6">{tier.description}</p>
                <div className="flex items-baseline mb-8">
                  <span className="text-5xl font-bold text-white">{tier.price}</span>
                  <span className="text-white/60 ml-2">{tier.period}</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-white/80">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full py-6 text-lg font-medium rounded-xl transition-all duration-300 ${
                    tier.popular
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                      : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                  }`}
                >
                  {tier.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-white/60">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
