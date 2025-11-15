import { GlassmorphismNav } from "@/components/glassmorphism-nav"
import Aurora from "@/components/Aurora"
import { Footer } from "@/components/footer"
import { PhoneMockup } from "@/components/phone-mockup"
import { Activity, TrendingUp, MessageSquare, Brain, ArrowRight, CheckCircle2, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function VisualXPage() {
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
                    <Activity className="w-4 h-4 mr-2" />
                    Real-time Sentiment Analysis
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                    See Market
                    <br />
                    <span className="text-purple-400">Sentiment Live</span>
                  </h1>
                  
                  <p className="text-xl text-white/70 mb-8 max-w-2xl">
                    VisualX tracks sentiment across news, social media, and analyst reports in real-time. Detect narrative shifts before the market reacts.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                    <Link href="/dashboard">
                      <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-full px-8 py-6 text-lg">
                        Try VisualX Free
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
                      <span className="text-white/80">Live Sentiment</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-5 h-5 text-purple-400" />
                      <span className="text-white/80">News Detection</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-5 h-5 text-purple-400" />
                      <span className="text-white/80">Social Trends</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-5 h-5 text-purple-400" />
                      <span className="text-white/80">AI Narratives</span>
                    </div>
                  </div>
                </div>
                
                {/* Right Column - Phone Mockup */}
                <div className="flex justify-center">
                  <PhoneMockup
                    headerTitle="VisualX"
                    headerSubtitle="Market Sentiment"
                    headerIcon={<Activity className="w-6 h-6 text-white/80" />}
                    headerBgColor="bg-gradient-to-r from-purple-600 to-pink-600"
                    chatBgColor="bg-slate-50"
                  >
                    {/* Sentiment Dashboard */}
                    <div className="space-y-3">
                      {/* Overall Sentiment */}
                      <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-white">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm opacity-90">Market Sentiment</div>
                          <TrendingUp className="w-5 h-5" />
                        </div>
                        <div className="text-3xl font-bold mb-1">Bullish</div>
                        <div className="text-sm opacity-90">Score: 78/100</div>
                      </div>
                      
                      {/* Trending Topics */}
                      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center space-x-2 mb-3">
                          <MessageSquare className="w-4 h-4 text-purple-600" />
                          <div className="font-semibold text-gray-900 text-sm">Trending Now</div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">#AI Revolution</div>
                            <div className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium">
                              +85%
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">#Fed Meeting</div>
                            <div className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs font-medium">
                              Neutral
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">#Tech Earnings</div>
                            <div className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium">
                              +92%
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Recent News Impact */}
                      <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
                        <div className="flex items-start space-x-2 mb-2">
                          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                            <BarChart3 className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-semibold text-blue-900 mb-1">
                              Breaking: Fed holds rates steady
                            </div>
                            <div className="text-xs text-blue-700">
                              2 minutes ago • Bloomberg
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-10">
                          <div className="text-xs text-blue-600 font-medium">Impact:</div>
                          <div className="flex-1 bg-blue-200 rounded-full h-1.5">
                            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: "70%" }}></div>
                          </div>
                          <div className="text-xs font-semibold text-blue-600">High</div>
                        </div>
                      </div>
                      
                      {/* AI Analysis */}
                      <div className="bg-purple-100 rounded-xl p-3 border border-purple-200">
                        <div className="flex items-start space-x-2">
                          <Brain className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                          <div className="text-xs text-purple-900">
                            <span className="font-semibold">AI Analysis:</span> Strong bullish sentiment detected across tech sector. Positive earnings surprise from major players driving optimism.
                          </div>
                        </div>
                      </div>
                      
                      {/* Social Media Buzz */}
                      <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-3 border border-pink-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-xs font-semibold text-gray-900">Social Media Buzz</div>
                          <div className="text-xs text-pink-600 font-bold">🔥 Trending</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-2xl">📱</div>
                          <div className="flex-1">
                            <div className="text-xs text-gray-700">52.3K mentions</div>
                            <div className="text-xs text-pink-600 font-medium">+127% vs yesterday</div>
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
                Advanced Sentiment Intelligence
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
                  <Activity className="w-12 h-12 text-purple-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-3">Real-time Tracking</h3>
                  <p className="text-white/70">
                    Monitor sentiment changes across 1000+ sources including news, social media, and analyst reports.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
                  <Brain className="w-12 h-12 text-pink-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-3">AI Narrative Detection</h3>
                  <p className="text-white/70">
                    Identify emerging narratives and storylines before they become mainstream market drivers.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
                  <MessageSquare className="w-12 h-12 text-blue-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-3">Social Trends</h3>
                  <p className="text-white/70">
                    Track trending topics and hashtags with impact scoring to gauge market influence.
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
