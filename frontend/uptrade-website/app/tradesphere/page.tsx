import { GlassmorphismNav } from "@/components/glassmorphism-nav"
import Aurora from "@/components/Aurora"
import { Footer } from "@/components/footer"
import { PhoneMockup } from "@/components/phone-mockup"
import { PieChart, TrendingUp, Target, Layers, ArrowRight, CheckCircle2, BarChart3, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function TradeSpherePage() {
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
                    <PieChart className="w-4 h-4 mr-2" />
                    Portfolio Management & Backtesting
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                    Optimize Your
                    <br />
                    <span className="text-purple-400">Portfolio Strategy</span>
                  </h1>
                  
                  <p className="text-xl text-white/70 mb-8 max-w-2xl">
                    Track positions, run scenarios, optimize allocations. TradeSphere gives you institutional-grade portfolio management tools.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                    <Link href="/dashboard">
                      <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-full px-8 py-6 text-lg">
                        Start Free Trial
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
                    <Button variant="outline" className="rounded-full px-8 py-6 text-lg border-2 border-white/30 text-white hover:bg-white/10">
                      View Features
                    </Button>
                  </div>
                  
                  {/* Key Features */}
                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-5 h-5 text-purple-400" />
                      <span className="text-white/80">Position Tracking</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-5 h-5 text-purple-400" />
                      <span className="text-white/80">Backtesting</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-5 h-5 text-purple-400" />
                      <span className="text-white/80">Risk Analytics</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-5 h-5 text-purple-400" />
                      <span className="text-white/80">Optimization</span>
                    </div>
                  </div>
                </div>
                
                {/* Right Column - Phone Mockup */}
                <div className="flex justify-center">
                  <PhoneMockup
                    headerTitle="TradeSphere"
                    headerSubtitle="Portfolio Manager"
                    headerIcon={<PieChart className="w-6 h-6 text-white/80" />}
                    headerBgColor="bg-gradient-to-r from-purple-600 to-indigo-600"
                    chatBgColor="bg-slate-50"
                  >
                    {/* Portfolio Dashboard */}
                    <div className="space-y-3">
                      {/* Total Portfolio Value */}
                      <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-4 text-white">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm opacity-90">Total Value</div>
                          <DollarSign className="w-5 h-5" />
                        </div>
                        <div className="text-3xl font-bold mb-1">$247,583</div>
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="text-green-300">+$12,439</span>
                          <span className="opacity-90">(+5.29%)</span>
                        </div>
                      </div>
                      
                      {/* Top Holdings */}
                      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center space-x-2 mb-3">
                          <Layers className="w-4 h-4 text-purple-600" />
                          <div className="font-semibold text-gray-900 text-sm">Top Holdings</div>
                        </div>
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                                AAPL
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">Apple Inc</div>
                                <div className="text-xs text-gray-500">150 shares</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-semibold text-gray-900">$28,500</div>
                              <div className="text-xs text-green-600">+8.2%</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center text-white text-xs font-bold">
                                MSFT
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">Microsoft</div>
                                <div className="text-xs text-gray-500">100 shares</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-semibold text-gray-900">$42,000</div>
                              <div className="text-xs text-green-600">+12.5%</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
                                AMZN
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">Amazon</div>
                                <div className="text-xs text-gray-500">200 shares</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-semibold text-gray-900">$35,800</div>
                              <div className="text-xs text-red-600">-2.1%</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Allocation Breakdown */}
                      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center space-x-2 mb-3">
                          <Target className="w-4 h-4 text-purple-600" />
                          <div className="font-semibold text-gray-900 text-sm">Allocation</div>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-600">Tech</span>
                              <span className="font-medium text-gray-900">65%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-purple-600 h-2 rounded-full" style={{ width: "65%" }}></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-600">Finance</span>
                              <span className="font-medium text-gray-900">20%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{ width: "20%" }}></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-600">Healthcare</span>
                              <span className="font-medium text-gray-900">15%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-green-600 h-2 rounded-full" style={{ width: "15%" }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Backtest Results */}
                      <div className="bg-indigo-50 rounded-xl p-3 border border-indigo-200">
                        <div className="flex items-start space-x-2 mb-2">
                          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
                            <BarChart3 className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-semibold text-indigo-900 mb-1">
                              Backtest: Aggressive Growth
                            </div>
                            <div className="text-xs text-indigo-700">
                              Historical Performance: 2020-2024
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 ml-10">
                          <div className="bg-white rounded-lg p-2">
                            <div className="text-xs text-gray-600">Return</div>
                            <div className="text-sm font-bold text-indigo-600">+127%</div>
                          </div>
                          <div className="bg-white rounded-lg p-2">
                            <div className="text-xs text-gray-600">Sharpe</div>
                            <div className="text-sm font-bold text-indigo-600">1.85</div>
                          </div>
                          <div className="bg-white rounded-lg p-2">
                            <div className="text-xs text-gray-600">MaxDD</div>
                            <div className="text-sm font-bold text-red-600">-18%</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* AI Recommendation */}
                      <div className="bg-purple-100 rounded-xl p-3 border border-purple-200">
                        <div className="flex items-start space-x-2">
                          <TrendingUp className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                          <div className="text-xs text-purple-900">
                            <span className="font-semibold">AI Suggestion:</span> Consider rebalancing to reduce tech exposure to 55%. Add more defensive positions given current market volatility.
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
                Professional Portfolio Tools
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
                  <Target className="w-12 h-12 text-purple-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-3">Smart Allocation</h3>
                  <p className="text-white/70">
                    AI-powered portfolio optimization across sectors, risk levels, and asset classes.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
                  <BarChart3 className="w-12 h-12 text-indigo-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-3">Advanced Backtesting</h3>
                  <p className="text-white/70">
                    Test strategies against historical data with customizable scenarios and risk parameters.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
                  <Layers className="w-12 h-12 text-blue-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-3">Real-time Tracking</h3>
                  <p className="text-white/70">
                    Monitor all your positions in one place with live updates and performance metrics.
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
