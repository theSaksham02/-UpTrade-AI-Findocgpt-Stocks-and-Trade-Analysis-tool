'use client'

import { GlassmorphismNav } from "@/components/glassmorphism-nav"
import Aurora from "@/components/Aurora"
import { Footer } from "@/components/footer"
import { Activity, BarChart3, Target, Zap, ArrowRight, CheckCircle2, TrendingUp, AlertTriangle, Calendar, LineChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"

export default function VisualXLandingPage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)
  const [hoveredStep, setHoveredStep] = useState<number | null>(null)
  return (
    <div className="min-h-screen bg-black overflow-hidden">
      <main className="min-h-screen relative overflow-hidden">
        <div className="fixed inset-0 w-full h-full">
          <Aurora colorStops={["#0891b2", "#06b6d4", "#22d3ee"]} amplitude={1.2} blend={0.6} speed={0.8} />
        </div>
        <div className="relative z-10">
          <GlassmorphismNav />
          
          {/* Hero Section */}
          <section className="min-h-screen flex items-center justify-center px-4 py-20 relative">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Column */}
                <div className="text-center lg:text-left">
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-cyan-500/20 backdrop-blur-md border border-cyan-500/30 text-cyan-300 text-sm font-medium mb-8 animate-pulse hover:animate-none hover:scale-105 transition-all duration-300">
                    <Activity className="w-4 h-4 mr-2" />
                    Deep Market Intelligence
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 transition-all duration-500 hover:scale-105">
                    Visualize Market
                    <br />
                    <span className="text-cyan-400 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Movements</span>
                  </h1>
                  
                  <p className="text-xl text-white/70 mb-8 max-w-2xl">
                    VisualX uses advanced AI to analyze stock price movements by correlating them with breaking news, market sentiment shifts, and statistical anomalies. Understand exactly why stocks moved—whether it was earnings reports, Fed announcements, social media buzz, or unusual trading patterns.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                    <Link href="/visualx/tool">
                      <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-full px-8 py-6 text-lg transform hover:scale-110 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/50 group">
                        Try VisualX Now
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                    <Link href="/dashboard">
                      <Button variant="outline" className="rounded-full px-8 py-6 text-lg border-2 border-white/30 text-white hover:bg-white/10 transform hover:scale-105 transition-all duration-300 hover:border-white/60">
                        Back to Dashboard
                      </Button>
                    </Link>
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
                    <div className="transform hover:scale-110 transition-all duration-300 cursor-pointer">
                      <div className="text-3xl font-bold text-cyan-400 hover:text-cyan-300">14-Day</div>
                      <div className="text-sm text-white/60 hover:text-white/80">Forecast</div>
                    </div>
                    <div className="transform hover:scale-110 transition-all duration-300 cursor-pointer">
                      <div className="text-3xl font-bold text-cyan-400 hover:text-cyan-300">AI</div>
                      <div className="text-sm text-white/60 hover:text-white/80">Detection</div>
                    </div>
                    <div className="transform hover:scale-110 transition-all duration-300 cursor-pointer">
                      <div className="text-3xl font-bold text-cyan-400 hover:text-cyan-300">Real-time</div>
                      <div className="text-sm text-white/60 hover:text-white/80">Analysis</div>
                    </div>
                  </div>
                </div>
                
                {/* Right Column - Feature Cards */}
                <div className="grid grid-cols-1 gap-4">
                  <div 
                    className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6 transform hover:scale-105 hover:bg-white/10 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-cyan-500/20"
                    onMouseEnter={() => setHoveredCard(0)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${hoveredCard === 0 ? 'rotate-12 scale-110' : ''}`}>
                        <Calendar className={`w-6 h-6 text-white transition-transform duration-300 ${hoveredCard === 0 ? 'scale-125' : ''}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">News & Sentiment Correlation</h3>
                        <p className="text-white/60 text-sm">
                          See exactly which news events (earnings, Fed policy, product launches) caused price spikes or drops. Timeline view shows sentiment scores alongside price movements to reveal cause-and-effect relationships.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6 transform hover:scale-105 hover:bg-white/10 hover:border-yellow-500/50 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-yellow-500/20"
                    onMouseEnter={() => setHoveredCard(1)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${hoveredCard === 1 ? 'rotate-12 scale-110' : ''}`}>
                        <AlertTriangle className={`w-6 h-6 text-white transition-transform duration-300 ${hoveredCard === 1 ? 'scale-125' : ''}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Why Did It Move? - Anomaly Insights</h3>
                        <p className="text-white/60 text-sm">
                          AI detects unusual price movements and automatically pulls relevant news, earnings data, and social sentiment from that exact time period. Know if the spike was due to breaking news, analyst upgrades, or market manipulation.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6 transform hover:scale-105 hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-purple-500/20"
                    onMouseEnter={() => setHoveredCard(2)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${hoveredCard === 2 ? 'rotate-12 scale-110' : ''}`}>
                        <Target className={`w-6 h-6 text-white transition-transform duration-300 ${hoveredCard === 2 ? 'scale-125' : ''}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Price Forecasting</h3>
                        <p className="text-white/60 text-sm">
                          14-day predictions with confidence intervals using advanced regression models and historical patterns.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6 transform hover:scale-105 hover:bg-white/10 hover:border-green-500/50 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-green-500/20"
                    onMouseEnter={() => setHoveredCard(3)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${hoveredCard === 3 ? 'rotate-12 scale-110' : ''}`}>
                        <TrendingUp className={`w-6 h-6 text-white transition-transform duration-300 ${hoveredCard === 3 ? 'scale-125' : ''}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Sentiment Impact Score</h3>
                        <p className="text-white/60 text-sm">
                          Quantifies how much news sentiment (positive/negative) influenced the actual price movement. Separate scores for financial news, social media, and analyst reports help identify which source drove the change.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Features Section */}
          <section className="py-20 px-4 relative">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Advanced Analytics Powered by AI
                </h2>
                <p className="text-xl text-white/60">
                  Discover patterns invisible to traditional analysis
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    icon: <Activity className="w-8 h-8" />,
                    title: "Event Correlation",
                    description: "See how news events impact stock prices in real-time with visual markers"
                  },
                  {
                    icon: <AlertTriangle className="w-8 h-8" />,
                    title: "Severity Classification",
                    description: "Anomalies ranked by severity: High, Medium, Low with color coding"
                  },
                  {
                    icon: <LineChart className="w-8 h-8" />,
                    title: "Trend Analysis",
                    description: "20-day moving averages with standard deviation bands"
                  },
                  {
                    icon: <BarChart3 className="w-8 h-8" />,
                    title: "Impact Visualization",
                    description: "Bar charts showing event impact percentages on price movements"
                  },
                  {
                    icon: <Target className="w-8 h-8" />,
                    title: "Confidence Scoring",
                    description: "Each forecast includes confidence percentage for reliability"
                  },
                  {
                    icon: <Zap className="w-8 h-8" />,
                    title: "Scatter Plots",
                    description: "Visualize anomalies by price vs deviation in interactive charts"
                  }
                ].map((feature, idx) => (
                  <div 
                    key={idx} 
                    className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/10 transition-all transform hover:scale-105 hover:border-cyan-500/50 cursor-pointer hover:shadow-xl hover:shadow-cyan-500/20 duration-300"
                    onMouseEnter={() => setHoveredFeature(idx)}
                    onMouseLeave={() => setHoveredFeature(null)}
                  >
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-4 text-white transition-all duration-300 ${hoveredFeature === idx ? 'rotate-6 scale-110' : ''}`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-white/60">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
          
          {/* How It Works Section */}
          <section className="py-20 px-4 relative">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  How VisualX Works
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  {
                    step: "1",
                    title: "Select Stock",
                    description: "Search and choose any US stock to analyze"
                  },
                  {
                    step: "2",
                    title: "AI Analysis",
                    description: "Our algorithms detect patterns and anomalies"
                  },
                  {
                    step: "3",
                    title: "Visualize",
                    description: "See timeline with events and predictions"
                  },
                  {
                    step: "4",
                    title: "Make Decisions",
                    description: "Use insights for informed trading"
                  }
                ].map((item, idx) => (
                  <div 
                    key={idx} 
                    className="text-center transform hover:scale-110 transition-all duration-300 cursor-pointer"
                    onMouseEnter={() => setHoveredStep(idx)}
                    onMouseLeave={() => setHoveredStep(null)}
                  >
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4 transition-all duration-300 ${hoveredStep === idx ? 'rotate-12 scale-125 shadow-xl shadow-cyan-500/50' : ''}`}>
                      {item.step}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-white/60 text-sm">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
          
          {/* CTA Section */}
          <section className="py-20 px-4 relative">
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-xl border-2 border-cyan-500/50 rounded-3xl p-12 transform hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/30">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  See Market Movements Like Never Before
                </h2>
                <p className="text-xl text-white/70 mb-8">
                  Start detecting anomalies and forecasting prices with AI-powered analytics
                </p>
                <Link href="/visualx/tool">
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-full px-12 py-6 text-lg transform hover:scale-110 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/50 group">
                    Start Using VisualX Free
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <p className="text-white/40 text-sm mt-4">No credit card required • Free forever</p>
              </div>
            </div>
          </section>
          
          <Footer />
        </div>
      </main>
    </div>
  )
}
