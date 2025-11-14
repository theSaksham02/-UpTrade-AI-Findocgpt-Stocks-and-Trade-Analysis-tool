"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Activity, FileText, TrendingUp, AlertCircle } from "lucide-react"

const aiFeatures = [
  {
    icon: Activity,
    title: "Sentiment Analysis",
    description: "Our AI scans thousands of news articles, social media posts, and financial reports to gauge market sentiment in real-time.",
    delay: 0.1,
  },
  {
    icon: FileText,
    title: "Document Analysis",
    description: "Automatically extract insights from financial statements, SEC filings, and earnings reports with natural language processing.",
    delay: 0.2,
  },
  {
    icon: TrendingUp,
    title: "Predictive Modeling",
    description: "Machine learning models trained on historical data to forecast price movements and identify profitable opportunities.",
    delay: 0.3,
  },
  {
    icon: AlertCircle,
    title: "Risk Assessment",
    description: "Real-time portfolio risk analysis with AI-powered recommendations to optimize your risk-reward ratio.",
    delay: 0.4,
  },
]

export function AIAnalysisSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="ai-analysis" className="py-20 px-4 relative" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 backdrop-blur-md border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
            <Activity className="w-4 h-4 mr-2" />
            Powered by Advanced AI
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            AI That <span className="text-blue-400">Understands</span> Markets
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Our proprietary AI models process millions of data points to give you unparalleled market intelligence
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {aiFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              transition={{ duration: 0.6, delay: feature.delay }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex items-start space-x-4">
                <div className="bg-blue-500/10 text-blue-400 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-white/70 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-md border border-white/10 rounded-3xl p-12 text-center"
        >
          <div className="max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold text-white mb-4">
              Processing <span className="text-blue-400">1M+</span> Data Points Per Second
            </h3>
            <p className="text-white/70 text-lg mb-8">
              Our AI infrastructure analyzes market data at unprecedented speed, giving you the edge you need to stay ahead
            </p>
            <div className="grid grid-cols-3 gap-8">
              <div>
                <div className="text-4xl font-bold text-blue-400 mb-2">150+</div>
                <div className="text-white/60">Data Sources</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-400 mb-2">24/7</div>
                <div className="text-white/60">Monitoring</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-400 mb-2">&lt;10ms</div>
                <div className="text-white/60">Response Time</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
