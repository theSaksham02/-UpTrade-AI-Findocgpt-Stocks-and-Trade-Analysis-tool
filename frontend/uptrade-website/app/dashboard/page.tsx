import { GlassmorphismNav } from "@/components/glassmorphism-nav"
import Aurora from "@/components/Aurora"
import { Footer } from "@/components/footer"
import { TrendingUp, Activity, PieChart, FileText, Code, BarChart3, CheckCircle2, Zap } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-black overflow-hidden">
      <main className="min-h-screen relative overflow-hidden">
        <div className="fixed inset-0 w-full h-full">
          <Aurora colorStops={["#6b21a8", "#8b5cf6", "#7c3aed"]} amplitude={1.2} blend={0.6} speed={0.8} />
        </div>
        <div className="relative z-10">
          <GlassmorphismNav />
          
          {/* Hero Section */}
          <section className="min-h-screen flex items-center justify-center px-4 py-20 relative">
            <div className="max-w-7xl mx-auto w-full">
              <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                  Welcome to
                  <br />
                  <span className="text-purple-400">UpTrade Dashboard</span>
                </h1>
                <p className="text-xl text-white/70 max-w-3xl mx-auto">
                  Choose your tool and start analyzing markets with AI-powered insights
                </p>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
                {/* TradeX Card */}
                <Link href="/tradex">
                  <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 cursor-pointer group h-full">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                      TradeX
                    </h3>
                    <p className="text-white/70 mb-6">
                      Real-time stock comparison and AI-powered analysis. Compare stocks side-by-side with advanced metrics.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-white/60">
                        <CheckCircle2 className="w-4 h-4 text-purple-400" />
                        <span>Real-time Comparison</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-white/60">
                        <CheckCircle2 className="w-4 h-4 text-purple-400" />
                        <span>AI Scoring</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-white/60">
                        <CheckCircle2 className="w-4 h-4 text-purple-400" />
                        <span>Smart Alerts</span>
                      </div>
                    </div>
                    <div className="mt-6 text-purple-400 font-semibold group-hover:translate-x-2 transition-transform inline-flex items-center">
                      Launch TradeX →
                    </div>
                  </div>
                </Link>

                {/* VisualX Card */}
                <Link href="/visualx">
                  <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 cursor-pointer group h-full">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Activity className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                      VisualX
                    </h3>
                    <p className="text-white/70 mb-6">
                      Real-time sentiment analysis and narrative detection across news, social media, and analyst reports.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-white/60">
                        <CheckCircle2 className="w-4 h-4 text-blue-400" />
                        <span>Live Sentiment</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-white/60">
                        <CheckCircle2 className="w-4 h-4 text-blue-400" />
                        <span>Narrative Detection</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-white/60">
                        <CheckCircle2 className="w-4 h-4 text-blue-400" />
                        <span>Social Trends</span>
                      </div>
                    </div>
                    <div className="mt-6 text-blue-400 font-semibold group-hover:translate-x-2 transition-transform inline-flex items-center">
                      Launch VisualX →
                    </div>
                  </div>
                </Link>

                {/* TradeSphere Card */}
                <Link href="/tradesphere">
                  <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 cursor-pointer group h-full">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <PieChart className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors">
                      TradeSphere
                    </h3>
                    <p className="text-white/70 mb-6">
                      Portfolio management and backtesting. Track positions, run scenarios, optimize allocations.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-white/60">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        <span>Position Tracking</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-white/60">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        <span>Backtesting Engine</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-white/60">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        <span>Risk Analytics</span>
                      </div>
                    </div>
                    <div className="mt-6 text-green-400 font-semibold group-hover:translate-x-2 transition-transform inline-flex items-center">
                      Launch TradeSphere →
                    </div>
                  </div>
                </Link>

                {/* Research Card */}
                <Link href="/research">
                  <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 cursor-pointer group h-full">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <FileText className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors">
                      Research
                    </h3>
                    <p className="text-white/70 mb-6">
                      AI-powered document Q&A. Analyze SEC filings, earnings calls, and research reports instantly.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-white/60">
                        <CheckCircle2 className="w-4 h-4 text-orange-400" />
                        <span>Document Q&A</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-white/60">
                        <CheckCircle2 className="w-4 h-4 text-orange-400" />
                        <span>Source Citations</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-white/60">
                        <CheckCircle2 className="w-4 h-4 text-orange-400" />
                        <span>Semantic Search</span>
                      </div>
                    </div>
                    <div className="mt-6 text-orange-400 font-semibold group-hover:translate-x-2 transition-transform inline-flex items-center">
                      Launch Research →
                    </div>
                  </div>
                </Link>

                {/* API & Dev Card */}
                <Link href="/api-dev">
                  <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 cursor-pointer group h-full">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Code className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">
                      API & Dev
                    </h3>
                    <p className="text-white/70 mb-6">
                      Access market data, AI analysis, and sentiment feeds through our developer-first API platform.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-white/60">
                        <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                        <span>RESTful API</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-white/60">
                        <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                        <span>WebSocket Streams</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-white/60">
                        <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                        <span>Low Latency</span>
                      </div>
                    </div>
                    <div className="mt-6 text-indigo-400 font-semibold group-hover:translate-x-2 transition-transform inline-flex items-center">
                      View API Docs →
                    </div>
                  </div>
                </Link>

                {/* Quick Stats Card */}
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border-2 border-purple-500/50 rounded-3xl p-8 flex flex-col justify-center">
                  <div className="text-center">
                    <Zap className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-3">
                      All Tools Included
                    </h3>
                    <p className="text-white/70 mb-6">
                      Access all UpTrade products with a single subscription
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between bg-white/10 rounded-lg p-3">
                        <span className="text-white/80 text-sm">Market Coverage</span>
                        <span className="text-white font-bold">50,000+</span>
                      </div>
                      <div className="flex items-center justify-between bg-white/10 rounded-lg p-3">
                        <span className="text-white/80 text-sm">Data Sources</span>
                        <span className="text-white font-bold">1,000+</span>
                      </div>
                      <div className="flex items-center justify-between bg-white/10 rounded-lg p-3">
                        <span className="text-white/80 text-sm">API Uptime</span>
                        <span className="text-white font-bold">99.9%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="max-w-4xl mx-auto text-center">
                <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-white mb-4">Need Help Getting Started?</h3>
                  <p className="text-white/70 mb-6">
                    Check out our documentation or contact our team for a personalized demo
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-full px-6 py-3">
                      <BarChart3 className="w-5 h-5 mr-2" />
                      View Documentation
                    </Button>
                    <Button variant="outline" className="rounded-full px-6 py-3 border-2 border-white/30 text-white hover:bg-white/10">
                      Schedule Demo
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          <Footer />
        </div>
      </main>
    </div>
  )
}
