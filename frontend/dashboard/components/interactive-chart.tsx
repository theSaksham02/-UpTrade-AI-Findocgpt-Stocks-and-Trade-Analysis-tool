/**
 * 📈 INTERACTIVE CHART COMPONENT
 * Features: Zoom, Pan, Brush, Enhanced Tooltips
 * 100% Real-Time Data Visualization
 */

"use client"

import { useState } from "react"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Brush,
  ReferenceLine,
} from "recharts"

interface DataPoint {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

interface InteractiveChartProps {
  data: DataPoint[]
  height?: number
  showVolume?: boolean
  showBrush?: boolean
  title?: string
}

export function InteractiveChart({
  data,
  height = 400,
  showVolume = true,
  showBrush = true,
  title,
}: InteractiveChartProps) {
  const [brushStartIndex, setBrushStartIndex] = useState(0)
  const [brushEndIndex, setBrushEndIndex] = useState(data.length - 1)

  // Calculate price change for color
  const firstPrice = data[0]?.close || 0
  const lastPrice = data[data.length - 1]?.close || 0
  const priceChange = lastPrice - firstPrice
  const isPositive = priceChange >= 0

  // Custom tooltip with enhanced information
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null

    const data = payload[0].payload
    return (
      <div className="bg-white dark:bg-[#1F1F23] border border-purple-200 dark:border-purple-900/50 rounded-lg shadow-xl p-4">
        <p className="text-sm font-semibold mb-2 text-gray-900 dark:text-white">
          {data.date}
        </p>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between gap-4">
            <span className="text-gray-600 dark:text-gray-400">Open:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              ${data.open.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-green-600 dark:text-green-400">High:</span>
            <span className="font-medium text-green-600 dark:text-green-400">
              ${data.high.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-red-600 dark:text-red-400">Low:</span>
            <span className="font-medium text-red-600 dark:text-red-400">
              ${data.low.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-600 dark:text-gray-400">Close:</span>
            <span className="font-bold text-gray-900 dark:text-white">
              ${data.close.toFixed(2)}
            </span>
          </div>
          {showVolume && (
            <div className="flex justify-between gap-4 pt-1 border-t border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Volume:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {(data.volume / 1000000).toFixed(2)}M
              </span>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
        </div>
      )}
      
      {/* Main Chart with Zoom/Pan */}
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: showBrush ? 60 : 0 }}
        >
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={isPositive ? "#10b981" : "#ef4444"}
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor={isPositive ? "#10b981" : "#ef4444"}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#374151"
            opacity={0.3}
          />

          <XAxis
            dataKey="date"
            stroke="#9ca3af"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            angle={-45}
            textAnchor="end"
            height={60}
          />

          <YAxis
            stroke="#9ca3af"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value.toFixed(0)}`}
            domain={['dataMin - 5', 'dataMax + 5']}
          />

          <Tooltip content={<CustomTooltip />} />

          {/* Price Area */}
          <Area
            type="monotone"
            dataKey="close"
            stroke={isPositive ? "#10b981" : "#ef4444"}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorPrice)"
            animationDuration={300}
          />

          {/* Reference line for starting price */}
          <ReferenceLine
            y={firstPrice}
            stroke="#6b7280"
            strokeDasharray="3 3"
            label={{
              value: `Start: $${firstPrice.toFixed(2)}`,
              position: 'right',
              fill: '#6b7280',
              fontSize: 12,
            }}
          />

          {/* Brush for zooming/panning */}
          {showBrush && (
            <Brush
              dataKey="date"
              height={30}
              stroke="#8b5cf6"
              fill="#8b5cf6"
              fillOpacity={0.2}
              onChange={(e: any) => {
                if (e.startIndex !== undefined) setBrushStartIndex(e.startIndex)
                if (e.endIndex !== undefined) setBrushEndIndex(e.endIndex)
              }}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>

      {/* Chart Controls Info */}
      <div className="mt-4 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <div className={`w-3 h-3 rounded-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`} />
            {isPositive ? 'Bullish' : 'Bearish'}
          </span>
          <span>
            Change: {isPositive ? '+' : ''}${priceChange.toFixed(2)} (
            {((priceChange / firstPrice) * 100).toFixed(2)}%)
          </span>
        </div>
        <div className="text-gray-500 dark:text-gray-500">
          💡 Drag brush to zoom | Hover for details
        </div>
      </div>
    </div>
  )
}
