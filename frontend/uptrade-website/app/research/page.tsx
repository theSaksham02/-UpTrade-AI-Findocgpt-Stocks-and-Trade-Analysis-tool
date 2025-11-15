import { GlassmorphismNav } from "@/components/glassmorphism-nav"
import Aurora from "@/components/Aurora"
import { Footer } from "@/components/footer"
import { FileText, Search, Brain, Zap, ArrowRight, CheckCircle2, MessageSquare, FileSearch, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ResearchPage() {
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
            <div className="max-w-7xl mx-auto text-center">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/20 backdrop-blur-md border border-purple-500/30 text-purple-300 text-sm font-medium mb-8">
                <FileText className="w-4 h-4 mr-2" />
                AI-Powered Document Q&A
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6">
                Ask Anything About
                <br />
                <span className="text-purple-400">Your Documents</span>
              </h1>
              
              <p className="text-xl text-white/70 mb-12 max-w-3xl mx-auto">
                AI-powered document Q&A. Analyze SEC filings, earnings calls, and research reports. Get instant answers with citations and context.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Link href="/dashboard">
                  <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-full px-8 py-6 text-lg">
                    Try Research Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Button variant="outline" className="rounded-full px-8 py-6 text-lg border-2 border-white/30 text-white hover:bg-white/10">
                  Watch Demo
                </Button>
              </div>
              
              {/* Key Features Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-20">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
                  <CheckCircle2 className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <div className="text-white/80 text-sm">SEC Filings</div>
                </div>
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
                  <CheckCircle2 className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <div className="text-white/80 text-sm">Earnings Calls</div>
                </div>
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
                  <CheckCircle2 className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <div className="text-white/80 text-sm">Research PDFs</div>
                </div>
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
                  <CheckCircle2 className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <div className="text-white/80 text-sm">Citations</div>
                </div>
              </div>
              
              {/* Interactive Demo Section */}
              <div className="max-w-5xl mx-auto">
                <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-12">
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2">Interactive Q&A Demo</h3>
                    <p className="text-white/60">Ask questions about financial documents and get instant, cited answers</p>
                  </div>
                  
                  {/* Sample Question */}
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-6 mb-4">
                    <div className="flex items-start space-x-3">
                      <MessageSquare className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                      <div>
                        <div className="text-white/90 font-medium mb-2">Sample Question:</div>
                        <div className="text-white text-lg">
                          "What were Apple's revenue growth drivers in Q4 2023?"
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Sample Answer */}
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                    <div className="flex items-start space-x-3 mb-4">
                      <Brain className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                      <div>
                        <div className="text-white/90 font-medium mb-2">AI Answer:</div>
                        <div className="text-white/80 leading-relaxed">
                          Apple's Q4 2023 revenue growth was primarily driven by three key factors:
                          <br /><br />
                          1. <strong className="text-white">iPhone 15 Series Launch</strong> - Strong demand for Pro models contributed to 18% YoY growth in iPhone revenue
                          <br />
                          2. <strong className="text-white">Services Expansion</strong> - Services revenue reached $22.3B, up 16% YoY, driven by App Store and subscription growth
                          <br />
                          3. <strong className="text-white">International Markets</strong> - Greater China revenue grew 12% despite macroeconomic headwinds
                        </div>
                      </div>
                    </div>
                    
                    {/* Citations */}
                    <div className="mt-6 pt-6 border-t border-white/10">
                      <div className="text-white/60 text-sm mb-3 flex items-center space-x-2">
                        <FileSearch className="w-4 h-4" />
                        <span>Sources & Citations:</span>
                      </div>
                      <div className="space-y-2">
                        <div className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors cursor-pointer">
                          <div className="text-white text-sm font-medium">Apple Inc. 10-K Filing (Q4 2023)</div>
                          <div className="text-white/60 text-xs mt-1">Page 42-45 • SEC Filing • Nov 2, 2023</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors cursor-pointer">
                          <div className="text-white text-sm font-medium">Q4 2023 Earnings Call Transcript</div>
                          <div className="text-white/60 text-xs mt-1">Timestamp 12:34 • Nov 2, 2023</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors cursor-pointer">
                          <div className="text-white text-sm font-medium">Investor Relations Report Q4</div>
                          <div className="text-white/60 text-xs mt-1">Page 8 • Apple.com • Nov 2, 2023</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Features Section */}
          <section className="py-20 px-4">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-bold text-white text-center mb-12">
                Smart Document Analysis
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
                  <Search className="w-12 h-12 text-purple-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-3">Semantic Search</h3>
                  <p className="text-white/70">
                    Ask questions in natural language. Our AI understands context and finds relevant information across thousands of pages.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
                  <FileSearch className="w-12 h-12 text-blue-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-3">Source Citations</h3>
                  <p className="text-white/70">
                    Every answer includes exact citations with page numbers and document references for verification.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
                  <Database className="w-12 h-12 text-green-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-3">Document Library</h3>
                  <p className="text-white/70">
                    Upload and organize unlimited PDFs, 10-Ks, earnings transcripts, and research reports in one place.
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          {/* Use Cases Section */}
          <section className="py-20 px-4">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-bold text-white text-center mb-12">
                Built for Investors & Analysts
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-6">
                  <Zap className="w-8 h-8 text-purple-400 mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">Due Diligence</h3>
                  <p className="text-white/70">
                    Quickly extract key metrics, risks, and opportunities from hundreds of pages of filings and reports.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-2xl p-6">
                  <FileText className="w-8 h-8 text-blue-400 mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">Earnings Analysis</h3>
                  <p className="text-white/70">
                    Compare earnings calls across quarters and competitors to identify trends and management sentiment shifts.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-6">
                  <Brain className="w-8 h-8 text-green-400 mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">Research Deep Dives</h3>
                  <p className="text-white/70">
                    Query multiple analyst reports simultaneously to get comprehensive perspectives on any stock or sector.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-2xl p-6">
                  <MessageSquare className="w-8 h-8 text-orange-400 mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">Thesis Validation</h3>
                  <p className="text-white/70">
                    Validate investment theses by asking targeted questions and getting data-backed answers with sources.
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
