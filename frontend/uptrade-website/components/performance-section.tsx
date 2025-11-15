"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { TrendingUp, DollarSign, Target, Award } from "lucide-react"
import { AdvancedPerformanceChart } from "./advanced-performance-chart"

const stats = [
  {
    icon: TrendingUp,
    value: "+127%",
    label: "Average Annual Returns",
    color: "text-green-400",
  },
  {
    icon: DollarSign,
    value: "$2.5B+",
    label: "Total Volume Traded",
    color: "text-blue-400",
  },
  {
    icon: Target,
    value: "98.7%",
    label: "Prediction Accuracy",
    color: "text-purple-400",
  },
  {
    icon: Award,
    value: "10K+",
    label: "Satisfied Traders",
    color: "text-yellow-400",
  },
]

export function PerformanceSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="performance" className="py-20 px-4 relative" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Proven <span className="text-blue-400">Performance</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Our track record speaks for itself. See how UpTrade is transforming trading for thousands of users
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-all duration-300"
            >
              <div className={`${stat.color} flex justify-center mb-4`}>
                <stat.icon className="w-10 h-10" />
              </div>
              <div className={`text-4xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
              <div className="text-white/70 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Performance Chart Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12"
        >
          <AdvancedPerformanceChart isInView={isInView} />
        </motion.div>

        {/* Risk Disclosure */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 text-center"
        >
          <p className="text-white/50 text-sm max-w-3xl mx-auto">
            * Past performance is not indicative of future results. Trading involves risk and may result in the loss of capital. Please trade responsibly.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
