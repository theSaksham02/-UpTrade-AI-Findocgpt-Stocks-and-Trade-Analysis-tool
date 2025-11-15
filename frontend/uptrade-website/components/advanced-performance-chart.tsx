"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Activity, DollarSign } from "lucide-react"
import { useEffect, useState } from "react"

interface DataPoint {
  year: number
  value: number
  benchmark: number
  volume: number
}

export function AdvancedPerformanceChart({ isInView }: { isInView: boolean }) {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null)
  const [showVolume, setShowVolume] = useState(false)

  // ⚠️ DISCLAIMER: Illustrative performance data for demonstration purposes
  // NOT actual trading returns. Replace with real backtesting data for production.
  const data: DataPoint[] = [
    { year: 2021, value: 65, benchmark: 45, volume: 80 },
    { year: 2022, value: 80, benchmark: 52, volume: 95 },
    { year: 2023, value: 95, benchmark: 58, volume: 110 },
    { year: 2024, value: 110, benchmark: 63, volume: 125 },
    { year: 2025, value: 127, benchmark: 68, volume: 140 },
  ]

  const maxValue = 127
  const gridLines = [0, 25, 50, 75, 100, 125]

  return (
    <div className="relative">
      {/* Disclaimer Banner */}
      <div className="mb-6 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
        <p className="text-yellow-300 text-sm">
          <span className="font-bold">⚠️ Illustrative Data:</span> Performance metrics shown are for demonstration purposes only and do not represent actual trading returns. Past performance does not guarantee future results. Invest responsibly.
        </p>
      </div>
      
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Performance Comparison</h3>
          <p className="text-white/60 text-sm">UpTrade AI vs Market Benchmark (S&P 500)</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setShowVolume(!showVolume)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-all"
          >
            <Activity className="w-4 h-4" />
            <span className="text-sm">{showVolume ? 'Hide' : 'Show'} Volume</span>
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-6 mb-8">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-blue-500 to-blue-600"></div>
          <span className="text-white/70 text-sm">UpTrade AI Returns</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-white/20 to-white/30"></div>
          <span className="text-white/70 text-sm">S&P 500 Benchmark</span>
        </div>
        {showVolume && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-purple-500 to-purple-600"></div>
            <span className="text-white/70 text-sm">Trading Volume</span>
          </div>
        )}
      </div>

      {/* Main Chart Container */}
      <div className="relative h-96 bg-gradient-to-br from-white/5 to-white/2 rounded-2xl p-6 border border-white/10">
        {/* Y-Axis Grid Lines */}
        <div className="absolute inset-6 flex flex-col justify-between">
          {gridLines.map((value, idx) => (
            <div key={idx} className="relative">
              <div className="absolute left-0 right-0 h-px bg-white/10"></div>
              <span className="absolute -left-12 -top-2 text-white/40 text-xs">{value}%</span>
            </div>
          ))}
        </div>

        {/* Chart Content */}
        <div className="relative h-full flex items-end justify-around px-8">
          {data.map((point, index) => {
            const barHeight = (point.value / maxValue) * 100
            const benchmarkHeight = (point.benchmark / maxValue) * 100
            const volumeHeight = showVolume ? (point.volume / 140) * 30 : 0
            const isHovered = hoveredBar === index

            return (
              <div
                key={index}
                className="relative flex-1 flex flex-col items-center justify-end h-full px-2 group"
                onMouseEnter={() => setHoveredBar(index)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                {/* Hover Card */}
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-32 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl p-4 shadow-2xl z-10 w-48"
                  >
                    <div className="text-white font-semibold mb-3 text-center">{point.year}</div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-white/60 text-xs">UpTrade AI:</span>
                        <span className="text-blue-400 font-bold">+{point.value}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/60 text-xs">S&P 500:</span>
                        <span className="text-white/70 font-bold">+{point.benchmark}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/60 text-xs">Outperformance:</span>
                        <span className="text-green-400 font-bold">+{point.value - point.benchmark}%</span>
                      </div>
                      {showVolume && (
                        <div className="flex items-center justify-between pt-2 border-t border-white/10">
                          <span className="text-white/60 text-xs">Volume:</span>
                          <span className="text-purple-400 font-bold">{point.volume}M</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Performance Badge */}
                {index === data.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                    transition={{ delay: 1.5, duration: 0.5 }}
                    className="absolute -top-16 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg"
                  >
                    <TrendingUp className="w-3 h-3" />
                    Best Year
                  </motion.div>
                )}

                {/* Volume Bar (Behind) */}
                {showVolume && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={isInView ? { height: `${volumeHeight}%` } : { height: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                    className="absolute bottom-0 w-full bg-gradient-to-t from-purple-500/30 to-purple-400/20 rounded-t-lg"
                    style={{ zIndex: 1 }}
                  />
                )}

                {/* Benchmark Bar (Middle) */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={isInView ? { height: `${benchmarkHeight}%` } : { height: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                  className="relative w-16 bg-gradient-to-t from-white/20 to-white/30 rounded-t-lg mr-2"
                  style={{ zIndex: 2 }}
                >
                  {/* Benchmark Value */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-white/50 font-semibold text-xs whitespace-nowrap">
                    +{point.benchmark}%
                  </div>
                </motion.div>

                {/* Main Bar (Front) */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={isInView ? { height: `${barHeight}%` } : { height: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                  className={`relative w-20 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-300 ${
                    isHovered ? 'scale-105 shadow-2xl shadow-blue-500/50' : ''
                  }`}
                  style={{ zIndex: 3 }}
                >
                  {/* Value Label */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-white font-bold text-base whitespace-nowrap">
                    +{point.value}%
                  </div>

                  {/* Glow Effect */}
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-gradient-to-t from-blue-400 to-transparent rounded-t-lg blur-xl"
                    />
                  )}

                  {/* Growth Arrow */}
                  {index > 0 && point.value > data[index - 1].value && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                      transition={{ delay: 1 + index * 0.1 }}
                      className="absolute -top-3 right-0 text-green-400"
                    >
                      <TrendingUp className="w-4 h-4" />
                    </motion.div>
                  )}
                </motion.div>

                {/* Year Label */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-sm font-medium whitespace-nowrap">
                  {point.year}
                </div>

                {/* Growth Indicator Line */}
                {index < data.length - 1 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                    transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                    className="absolute top-0 left-full w-full h-px bg-gradient-to-r from-blue-400/50 to-transparent origin-left"
                    style={{
                      transform: `translateY(-${barHeight}%) rotate(${
                        ((data[index + 1].value - point.value) / maxValue) * 45
                      }deg)`,
                    }}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 1.5 }}
          className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30 rounded-xl p-3 sm:p-4"
        >
          <div className="flex items-center gap-2 mb-1 sm:mb-2">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
            <span className="text-white/60 text-xs">Total Gain</span>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-green-400">+127%</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 1.6 }}
          className="bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/30 rounded-xl p-3 sm:p-4"
        >
          <div className="flex items-center gap-2 mb-1 sm:mb-2">
            <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
            <span className="text-white/60 text-xs">Avg Growth</span>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-blue-400">+25.4%</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 1.7 }}
          className="bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/30 rounded-xl p-3 sm:p-4"
        >
          <div className="flex items-center gap-2 mb-1 sm:mb-2">
            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
            <span className="text-white/60 text-xs">Beat Market</span>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-purple-400">+59%</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 1.8 }}
          className="bg-gradient-to-br from-yellow-500/20 to-orange-500/10 border border-yellow-500/30 rounded-xl p-3 sm:p-4"
        >
          <div className="flex items-center gap-2 mb-1 sm:mb-2">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
            <span className="text-white/60 text-xs">Consistency</span>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-yellow-400">100%</div>
        </motion.div>
      </div>
    </div>
  )
}
