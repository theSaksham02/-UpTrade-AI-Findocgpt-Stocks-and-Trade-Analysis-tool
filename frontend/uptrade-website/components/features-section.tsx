"use client"

import { Brain, TrendingUp, Shield, Zap, BarChart3, Globe } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description: "Advanced machine learning algorithms analyze market trends and predict movements with 98.7% accuracy.",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: TrendingUp,
    title: "Real-Time Insights",
    description: "Get instant market updates and actionable insights delivered directly to your dashboard.",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Shield,
    title: "Risk Management",
    description: "Sophisticated risk assessment tools help protect your portfolio from market volatility.",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Execute trades in milliseconds with our optimized infrastructure and real-time data feeds.",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Comprehensive charting tools and technical indicators for deep market analysis.",
    color: "text-pink-400",
    bgColor: "bg-pink-500/10",
  },
  {
    icon: Globe,
    title: "Global Markets",
    description: "Access to international markets with multi-currency support and 24/7 monitoring.",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
  },
]

export function FeaturesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="features" className="py-20 px-4 relative" ref={ref}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Everything You Need to Trade <span className="text-blue-400">Smarter</span>
          </h2>
          <p className="text-2xl text-white/70 max-w-4xl mx-auto">
            Professional-grade tools powered by artificial intelligence, designed for both beginners and expert traders
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-10 hover:bg-white/10 transition-all duration-300 hover:border-white/20 h-full">
                <div className={`${feature.bgColor} ${feature.color} w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-lg text-white/70 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
