'use client'

import { GlassmorphismNav } from "@/components/glassmorphism-nav"
import { Footer } from "@/components/footer"
import { Activity, BarChart3, Target, Zap, ArrowRight, TrendingUp, AlertTriangle, Calendar, LineChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"

export default function VisualXLandingPage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--tv-bg-dark)' }}>
      <GlassmorphismNav />

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="min-h-[80vh] flex items-center justify-center px-4 relative">
          {/* Background gradient */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(8, 153, 129, 0.15) 0%, transparent 50%)',
            }}
          />

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Column */}
              <div className="text-center lg:text-left">
                <div
                  className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium mb-8"
                  style={{
                    backgroundColor: 'var(--tv-surface)',
                    border: '1px solid var(--tv-border)',
                    color: 'var(--tv-green)'
                  }}
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Deep Market Intelligence
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  <span style={{ color: 'var(--tv-text-primary)' }}>Visualize Market</span>
                  <br />
                  <span
                    className="bg-clip-text text-transparent"
                    style={{ backgroundImage: 'linear-gradient(135deg, #089981, #2962FF)' }}
                  >
                    Movements
                  </span>
                </h1>

                <p className="text-xl mb-8 max-w-2xl" style={{ color: 'var(--tv-text-muted)' }}>
                  VisualX uses advanced AI to analyze stock price movements by correlating them with breaking news, market sentiment, and statistical anomalies. Understand exactly why stocks moved.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                  <Link href="/visualx/tool">
                    <Button
                      className="text-white rounded-lg px-8 py-6 text-lg transition-all duration-300 hover:scale-105 hover:brightness-110 group"
                      style={{ backgroundColor: 'var(--tv-green)' }}
                    >
                      Try VisualX Now
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button
                      variant="outline"
                      className="rounded-lg px-8 py-6 text-lg transition-all duration-300 hover:scale-105"
                      style={{
                        borderColor: 'var(--tv-border)',
                        color: 'var(--tv-text)',
                        backgroundColor: 'transparent'
                      }}
                    >
                      Back to Dashboard
                    </Button>
                  </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
                  <div className="text-center lg:text-left">
                    <div className="text-3xl font-bold" style={{ color: 'var(--tv-green)' }}>14-Day</div>
                    <div className="text-sm" style={{ color: 'var(--tv-text-muted)' }}>Forecast</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-3xl font-bold" style={{ color: 'var(--tv-blue)' }}>AI</div>
                    <div className="text-sm" style={{ color: 'var(--tv-text-muted)' }}>Detection</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-3xl font-bold" style={{ color: 'var(--tv-green)' }}>Real-time</div>
                    <div className="text-sm" style={{ color: 'var(--tv-text-muted)' }}>Analysis</div>
                  </div>
                </div>
              </div>

              {/* Right Column - Feature Cards */}
              <div className="grid grid-cols-1 gap-4">
                {[
                  { icon: Calendar, title: "News & Sentiment Correlation", desc: "See exactly which news events caused price spikes or drops. Timeline view shows sentiment scores alongside price movements.", color: 'var(--tv-blue)' },
                  { icon: AlertTriangle, title: "Why Did It Move? - Anomaly Insights", desc: "AI detects unusual price movements and automatically pulls relevant news, earnings data, and social sentiment.", color: '#ff9800' },
                  { icon: Target, title: "Price Forecasting", desc: "14-day predictions with confidence intervals using advanced regression models and historical patterns.", color: 'var(--tv-green)' },
                  { icon: TrendingUp, title: "Sentiment Impact Score", desc: "Quantifies how much news sentiment influenced the actual price movement with separate scores for each source.", color: 'var(--tv-blue)' },
                ].map((feature, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl p-6 transition-all duration-300 cursor-pointer hover:-translate-y-1"
                    style={{
                      backgroundColor: 'var(--tv-surface)',
                      border: hoveredCard === idx ? `1px solid ${feature.color}` : '1px solid var(--tv-border)',
                    }}
                    onMouseEnter={() => setHoveredCard(idx)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: 'var(--tv-surface-hover)' }}
                      >
                        <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--tv-text-primary)' }}>{feature.title}</h3>
                        <p className="text-sm" style={{ color: 'var(--tv-text-muted)' }}>{feature.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--tv-text-primary)' }}>
                Advanced Analytics Powered by AI
              </h2>
              <p className="text-xl" style={{ color: 'var(--tv-text-muted)' }}>
                Discover patterns invisible to traditional analysis
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Activity, title: "Event Correlation", desc: "See how news events impact stock prices in real-time with visual markers" },
                { icon: AlertTriangle, title: "Severity Classification", desc: "Anomalies ranked by severity: High, Medium, Low with color coding" },
                { icon: LineChart, title: "Trend Analysis", desc: "20-day moving averages with standard deviation bands" },
                { icon: BarChart3, title: "Impact Visualization", desc: "Bar charts showing event impact percentages on price movements" },
                { icon: Target, title: "Confidence Scoring", desc: "Each forecast includes confidence percentage for reliability" },
                { icon: Zap, title: "Scatter Plots", desc: "Visualize anomalies by price vs deviation in interactive charts" }
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="rounded-lg p-6 transition-all duration-200 hover:-translate-y-1 cursor-pointer"
                  style={{
                    backgroundColor: 'var(--tv-surface)',
                    border: '1px solid var(--tv-border)',
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: 'var(--tv-surface-hover)' }}
                  >
                    <feature.icon className="w-7 h-7" style={{ color: 'var(--tv-green)' }} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--tv-text-primary)' }}>{feature.title}</h3>
                  <p style={{ color: 'var(--tv-text-muted)' }}>{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--tv-text-primary)' }}>
                How VisualX Works
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { step: "1", title: "Select Stock", desc: "Search and choose any US stock to analyze" },
                { step: "2", title: "AI Analysis", desc: "Our algorithms detect patterns and anomalies" },
                { step: "3", title: "Visualize", desc: "See timeline with events and predictions" },
                { step: "4", title: "Make Decisions", desc: "Use insights for informed trading" }
              ].map((item, idx) => (
                <div key={idx} className="text-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4"
                    style={{ backgroundColor: 'var(--tv-green)', color: 'white' }}
                  >
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--tv-text-primary)' }}>{item.title}</h3>
                  <p className="text-sm" style={{ color: 'var(--tv-text-muted)' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div
              className="rounded-2xl p-12"
              style={{
                backgroundColor: 'var(--tv-surface)',
                border: '1px solid var(--tv-green)',
              }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: 'var(--tv-text-primary)' }}>
                See Market Movements Like Never Before
              </h2>
              <p className="text-xl mb-8" style={{ color: 'var(--tv-text-muted)' }}>
                Start detecting anomalies and forecasting prices with AI-powered analytics
              </p>
              <Link href="/visualx/tool">
                <Button
                  className="text-white rounded-lg px-12 py-6 text-lg transition-all duration-300 hover:scale-105 hover:brightness-110 group"
                  style={{ backgroundColor: 'var(--tv-green)' }}
                >
                  Start Using VisualX Free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <p className="text-sm mt-4" style={{ color: 'var(--tv-text-muted)' }}>No credit card required • Free forever</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
