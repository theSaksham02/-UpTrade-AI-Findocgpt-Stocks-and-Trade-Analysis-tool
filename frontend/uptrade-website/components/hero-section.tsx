"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Play, TrendingUp, BarChart3, Zap } from "lucide-react"

export function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 pt-32 pb-16 relative overflow-hidden">
      {/* Background gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(41, 98, 255, 0.15) 0%, transparent 50%)',
        }}
      />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Main Headline - TradingView Style */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in-heading">
          <span style={{ color: 'var(--tv-text-primary)' }}>Look First</span>
          <span className="mx-3 md:mx-4" style={{ color: 'var(--tv-text-muted)' }}>/</span>
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: 'linear-gradient(135deg, #2962FF, #00C853)' }}
          >
            Then Trade.
          </span>
        </h1>

        {/* Subheading */}
        <p
          className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 animate-fade-in-subheading"
          style={{ color: 'var(--tv-text-secondary)' }}
        >
          The best trades require research, then commitment. Join millions of traders using AI-powered analysis.
        </p>

        {/* CTA Buttons - TradingView Style */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-in-buttons">
          <Link href="/dashboard">
            <Button
              size="lg"
              className="rounded-full px-8 py-5 text-base font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl group cursor-pointer"
              style={{
                backgroundColor: 'white',
                color: '#131722',
              }}
            >
              Get started for free
            </Button>
          </Link>

          <p
            className="text-sm"
            style={{ color: 'var(--tv-text-muted)' }}
          >
            $0 forever, no credit card needed
          </p>
        </div>

        {/* Trading Dashboard Mockup */}
        <div className="relative max-w-4xl mx-auto mb-12 animate-fade-in-trust">
          <div
            className="rounded-xl overflow-hidden shadow-2xl border"
            style={{
              backgroundColor: 'var(--tv-surface)',
              borderColor: 'var(--tv-border)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 100px rgba(41, 98, 255, 0.1)',
            }}
          >
            {/* Mock window header */}
            <div
              className="flex items-center gap-2 px-4 py-3 border-b"
              style={{ borderColor: 'var(--tv-border)' }}
            >
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div
                className="flex-1 text-center text-sm"
                style={{ color: 'var(--tv-text-muted)' }}
              >
                UpTrade Dashboard
              </div>
            </div>

            {/* Mock dashboard content */}
            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Chart preview boxes */}
              <div
                className="aspect-video rounded-lg p-4 flex flex-col justify-between"
                style={{ backgroundColor: 'var(--tv-bg-dark)' }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium" style={{ color: 'var(--tv-text)' }}>AAPL</span>
                  <span className="text-xs" style={{ color: 'var(--tv-green)' }}>+2.34%</span>
                </div>
                <div className="flex-1 flex items-end">
                  <svg viewBox="0 0 100 40" className="w-full h-8">
                    <path
                      d="M0,35 L10,30 L20,32 L30,25 L40,28 L50,20 L60,22 L70,15 L80,18 L90,10 L100,5"
                      fill="none"
                      stroke="#089981"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>

              <div
                className="aspect-video rounded-lg p-4 flex flex-col justify-between"
                style={{ backgroundColor: 'var(--tv-bg-dark)' }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium" style={{ color: 'var(--tv-text)' }}>BTC</span>
                  <span className="text-xs" style={{ color: 'var(--tv-red)' }}>-1.23%</span>
                </div>
                <div className="flex-1 flex items-end">
                  <svg viewBox="0 0 100 40" className="w-full h-8">
                    <path
                      d="M0,10 L10,15 L20,12 L30,20 L40,18 L50,25 L60,22 L70,30 L80,28 L90,32 L100,35"
                      fill="none"
                      stroke="#f23645"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>

              <div
                className="aspect-video rounded-lg p-4 flex flex-col justify-between"
                style={{ backgroundColor: 'var(--tv-bg-dark)' }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium" style={{ color: 'var(--tv-text)' }}>SPY</span>
                  <span className="text-xs" style={{ color: 'var(--tv-green)' }}>+0.87%</span>
                </div>
                <div className="flex-1 flex items-end">
                  <svg viewBox="0 0 100 40" className="w-full h-8">
                    <path
                      d="M0,30 L10,28 L20,25 L30,26 L40,22 L50,24 L60,20 L70,18 L80,15 L90,12 L100,10"
                      fill="none"
                      stroke="#089981"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>

              <div
                className="aspect-video rounded-lg p-4 flex flex-col justify-between"
                style={{ backgroundColor: 'var(--tv-bg-dark)' }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium" style={{ color: 'var(--tv-text)' }}>ETH</span>
                  <span className="text-xs" style={{ color: 'var(--tv-green)' }}>+3.56%</span>
                </div>
                <div className="flex-1 flex items-end">
                  <svg viewBox="0 0 100 40" className="w-full h-8">
                    <path
                      d="M0,38 L10,35 L20,30 L30,32 L40,25 L50,20 L60,18 L70,15 L80,10 L90,8 L100,5"
                      fill="none"
                      stroke="#089981"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Floating glow effect */}
          <div
            className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-20 blur-3xl opacity-30"
            style={{ backgroundColor: 'var(--tv-blue)' }}
          />
        </div>

        {/* Stats Section */}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 animate-fade-in-trust">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <TrendingUp className="w-5 h-5" style={{ color: 'var(--tv-blue)' }} />
              <span className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--tv-text-primary)' }}>100M+</span>
            </div>
            <span className="text-sm" style={{ color: 'var(--tv-text-muted)' }}>Active Traders</span>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <BarChart3 className="w-5 h-5" style={{ color: 'var(--tv-green)' }} />
              <span className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--tv-text-primary)' }}>50K+</span>
            </div>
            <span className="text-sm" style={{ color: 'var(--tv-text-muted)' }}>Stocks Analyzed</span>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Zap className="w-5 h-5" style={{ color: 'var(--tv-blue)' }} />
              <span className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--tv-text-primary)' }}>Real-time</span>
            </div>
            <span className="text-sm" style={{ color: 'var(--tv-text-muted)' }}>AI Analysis</span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="mt-16 animate-bounce">
          <svg
            className="w-6 h-6 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{ color: 'var(--tv-text-muted)' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  )
}
