import { GlassmorphismNav } from "@/components/glassmorphism-nav"
import Aurora from "@/components/Aurora"
import { Footer } from "@/components/footer"
import { PhoneMockup } from "@/components/phone-mockup"
import { TrendingUp, BarChart3, Target, Zap, ArrowRight, CheckCircle2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function TradeXPage() {
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
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Column */}
                <div className="text-center lg:text-left">
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/20 backdrop-blur-md border border-purple-500/30 text-purple-300 text-sm font-medium mb-8">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Multi-Factor Stock Comparison
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                    Compare Stocks
                    <br />
                    <span className="text-purple-400">Like a Pro</span>
                  </h1>
                  
                  <p className="text-xl text-white/70 mb-8 max-w-2xl">
                    TradeX analyzes 100+ metrics across multiple stocks instantly. Compare fundamentals, technicals, sentiment, and more in one powerful view.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                    <Link href="/dashboard">
                      <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-full px-8 py-6 text-lg">
                        Try TradeX Free
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
                    <Button variant="outline" className="rounded-full px-8 py-6 text-lg border-2 border-white/30 text-white hover:bg-white/10">
                      Watch Demo
                    </Button>
                  </div>
                  
                  {/* Key Features */}
                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-5 h-5 text-purple-400" />
                      <span className="text-white/80">100+ Metrics</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-5 h-5 text-purple-400" />
                      <span className="text-white/80">Real-time Data</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-5 h-5 text-purple-400" />
                      <span className="text-white/80">AI Insights</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-5 h-5 text-purple-400" />
                      <span className="text-white/80">Smart Alerts</span>
                    </div>
                  </div>
                </div>
                
                {/* Right Column - Phone Mockup */}
                <div className="flex justify-center">
                  <PhoneMockup
                    headerTitle="TradeX"
                    headerSubtitle="Stock Comparison"
                    headerIcon={<BarChart3 className="w-6 h-6 text-white/80" />}
                    headerBgColor="bg-gradient-to-r from-purple-600 to-purple-700"
                    chatBgColor="bg-slate-50"
                  >
                    {/* Stock Comparison Cards */}
                    <div className="space-y-3">
                      {/* Search Bar */}
                      <div className="bg-white rounded-xl p-3 shadow-sm flex items-center space-x-2">
                        <Search className="w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Compare AAPL vs MSFT..."
                          className="flex-1 outline-none text-sm text-gray-700"
                          disabled
                        />
                      </div>
                      
                      {/* Stock Card 1 - AAPL */}
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-white font-bold text-xs">
                              
                            </div>
                            <div>
                              <div className="font-bold text-gray-900 text-sm">AAPL</div>
                              <div className="text-xs text-gray-500">Apple Inc.</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-green-600 text-sm">$178.45</div>
                            <div className="text-xs text-green-600">+2.34%</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs mt-3">
                          <div>
                            <div className="text-gray-500">P/E</div>
                            <div className="font-semibold text-gray-900">28.5</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Mkt Cap</div>
                            <div className="font-semibold text-gray-900">$2.8T</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Score</div>
                            <div className="font-semibold text-green-600">92/100</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* VS Badge */}
                      <div className="flex justify-center">
                        <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">
                          VS
                        </div>
                      </div>
                      
                      {/* Stock Card 2 - MSFT */}
                      <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl p-4 border border-blue-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-xs">
                              ⊞
                            </div>
                            <div>
                              <div className="font-bold text-gray-900 text-sm">MSFT</div>
                              <div className="text-xs text-gray-500">Microsoft Corp.</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-blue-600 text-sm">$378.91</div>
                            <div className="text-xs text-blue-600">+1.87%</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs mt-3">
                          <div>
                            <div className="text-gray-500">P/E</div>
                            <div className="font-semibold text-gray-900">32.1</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Mkt Cap</div>
                            <div className="font-semibold text-gray-900">$2.9T</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Score</div>
                            <div className="font-semibold text-blue-600">89/100</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* AI Insight */}
                      <div className="bg-purple-100 rounded-xl p-3 border border-purple-200">
                        <div className="flex items-start space-x-2">
                          <Zap className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                          <div className="text-xs text-purple-900">
                            <span className="font-semibold">AI Insight:</span> Both stocks show strong fundamentals. AAPL has better value metrics, while MSFT leads in growth potential.
                          </div>
                        </div>
                      </div>
                    </div>
                  </PhoneMockup>
                </div>
              </div>
            </div>
          </section>
          
          {/* Features Section */}
          <section className="py-20 px-4">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-bold text-white text-center mb-12">
                Powerful Comparison Tools
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
                  <BarChart3 className="w-12 h-12 text-purple-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-3">100+ Metrics</h3>
                  <p className="text-white/70">
                    Compare fundamentals, technicals, sentiment, valuation, growth, and more across unlimited stocks.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
                  <Zap className="w-12 h-12 text-yellow-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-3">Real-time Updates</h3>
                  <p className="text-white/70">
                    Live data streams keep your comparisons current with every market movement.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
                  <Search className="w-12 h-12 text-blue-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-3">Smart Search</h3>
                  <p className="text-white/70">
                    AI-powered search finds similar stocks and suggests relevant comparisons automatically.
                  </p>
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
