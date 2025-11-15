import { GlassmorphismNav } from "@/components/glassmorphism-nav"
import Aurora from "@/components/Aurora"
import { Footer } from "@/components/footer"
import { Activity, BarChart3, Target, Zap, ArrowRight, CheckCircle2, TrendingUp, AlertTriangle, Calendar, LineChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function VisualXLandingPage() {
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
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-cyan-500/20 backdrop-blur-md border border-cyan-500/30 text-cyan-300 text-sm font-medium mb-8">
                    <Activity className="w-4 h-4 mr-2" />
                    Deep Market Intelligence
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                    Visualize Market
                    <br />
                    <span className="text-cyan-400">Movements</span>
                  </h1>
                  
                  <p className="text-xl text-white/70 mb-8 max-w-2xl">
                    VisualX uses advanced AI to detect anomalies, forecast prices, and correlate market movements with news events. See what others miss.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                    <Link href="/visualx/tool">
                      <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-full px-8 py-6 text-lg">
                        Try VisualX Now
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
                    <Link href="/dashboard">
                      <Button variant="outline" className="rounded-full px-8 py-6 text-lg border-2 border-white/30 text-white hover:bg-white/10">
                        Back to Dashboard
                      </Button>
                    </Link>
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
                    <div>
                      <div className="text-3xl font-bold text-cyan-400">14-Day</div>
                      <div className="text-sm text-white/60">Forecast</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-cyan-400">AI</div>
                      <div className="text-sm text-white/60">Detection</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-cyan-400">Real-time</div>
                      <div className="text-sm text-white/60">Analysis</div>
                    </div>
                  </div>
                </div>
                
                {/* Right Column - Feature Cards */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Timeline Analysis</h3>
                        <p className="text-white/60 text-sm">
                          Gantt-style visualization showing market movements correlated with news events and sentiment shifts.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Anomaly Detection</h3>
                        <p className="text-white/60 text-sm">
                          AI-powered detection of unusual price movements using statistical analysis and z-score calculations.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Price Forecasting</h3>
                        <p className="text-white/60 text-sm">
                          14-day predictions with confidence intervals using advanced regression models and historical patterns.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Sentiment Trends</h3>
                        <p className="text-white/60 text-sm">
                          Track how news sentiment evolves over time and correlates with price movements.
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
                  <div key={idx} className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/10 transition-all">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-4 text-white">
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
                  <div key={idx} className="text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">
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
              <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-xl border-2 border-cyan-500/50 rounded-3xl p-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  See Market Movements Like Never Before
                </h2>
                <p className="text-xl text-white/70 mb-8">
                  Start detecting anomalies and forecasting prices with AI-powered analytics
                </p>
                <Link href="/visualx/tool">
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-full px-12 py-6 text-lg">
                    Start Using VisualX Free
                    <ArrowRight className="ml-2 w-5 h-5" />
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
