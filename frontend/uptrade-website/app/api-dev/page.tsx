import { GlassmorphismNav } from "@/components/glassmorphism-nav"
import Aurora from "@/components/Aurora"
import { Footer } from "@/components/footer"
import { Code, Terminal, Zap, Lock, ArrowRight, CheckCircle2, Layers, GitBranch, Database, Cloud } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function APIDevPage() {
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
                <Code className="w-4 h-4 mr-2" />
                Developer-First API Platform
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6">
                Build with
                <br />
                <span className="text-purple-400">UpTrade APIs</span>
              </h1>
              
              <p className="text-xl text-white/70 mb-12 max-w-3xl mx-auto">
                Access market data, AI analysis, sentiment feeds, and more. RESTful APIs with WebSocket support for real-time data. Built for developers who demand speed and reliability.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Link href="/dashboard">
                  <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-full px-8 py-6 text-lg">
                    Get API Key
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Button variant="outline" className="rounded-full px-8 py-6 text-lg border-2 border-white/30 text-white hover:bg-white/10">
                  View Docs
                </Button>
              </div>
              
              {/* Key Features Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-20">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
                  <CheckCircle2 className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <div className="text-white/80 text-sm">RESTful API</div>
                </div>
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
                  <CheckCircle2 className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <div className="text-white/80 text-sm">WebSockets</div>
                </div>
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
                  <CheckCircle2 className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <div className="text-white/80 text-sm">99.9% Uptime</div>
                </div>
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
                  <CheckCircle2 className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <div className="text-white/80 text-sm">Low Latency</div>
                </div>
              </div>
              
              {/* Code Example Section */}
              <div className="max-w-5xl mx-auto">
                <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-12">
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2">Quick Start Code Example</h3>
                    <p className="text-white/60">Get started in minutes with our simple API</p>
                  </div>
                  
                  {/* Tabs */}
                  <div className="flex space-x-2 mb-6 border-b border-white/10">
                    <button className="px-4 py-2 text-purple-400 border-b-2 border-purple-400 font-medium">
                      Python
                    </button>
                    <button className="px-4 py-2 text-white/50 hover:text-white/70 font-medium">
                      JavaScript
                    </button>
                    <button className="px-4 py-2 text-white/50 hover:text-white/70 font-medium">
                      cURL
                    </button>
                  </div>
                  
                  {/* Code Block */}
                  <div className="bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-left overflow-x-auto">
                    <pre className="text-sm text-gray-300 font-mono leading-relaxed">
                      <code>
{`import uptrade

# Initialize client
client = uptrade.Client(api_key="your_api_key")

# Get real-time stock data
stock = client.stocks.get("AAPL")
print(f"Price: $` + `{stock.price}")
print(f"AI Score: {stock.ai_score}")

# Get sentiment analysis
sentiment = client.sentiment.analyze("AAPL")
print(f"Sentiment: {sentiment.score}")

# Stream real-time data
@client.stream.ticker("AAPL")
def on_update(data):
    print(f"Live update: {data.price}")

client.stream.start()`}
                      </code>
                    </pre>
                  </div>
                  
                  {/* Response Example */}
                  <div className="mt-6">
                    <div className="text-white/60 text-sm mb-3 flex items-center space-x-2">
                      <Terminal className="w-4 h-4" />
                      <span>API Response:</span>
                    </div>
                    <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl p-4 border border-green-500/30">
                      <pre className="text-sm text-green-400 font-mono">
                        <code>{`{
  "symbol": "AAPL",
  "price": 189.52,
  "change": +2.34,
  "change_percent": +1.25,
  "ai_score": 87,
  "sentiment": {
    "score": 0.78,
    "label": "bullish",
    "confidence": 0.92
  },
  "status": "success",
  "timestamp": "2024-01-15T10:30:00Z"
}`}</code>
                      </pre>
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
                Enterprise-Grade Infrastructure
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
                  <Zap className="w-12 h-12 text-purple-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-3">Lightning Fast</h3>
                  <p className="text-white/70">
                    Average response time under 50ms. Optimized endpoints with CDN distribution for global low latency.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
                  <Lock className="w-12 h-12 text-green-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-3">Secure & Reliable</h3>
                  <p className="text-white/70">
                    Bank-grade encryption, SOC 2 compliant infrastructure, and 99.9% uptime SLA guarantee.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
                  <Layers className="w-12 h-12 text-blue-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-3">Scalable</h3>
                  <p className="text-white/70">
                    From prototype to production. Scale from 100 to 10M requests per day without configuration changes.
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          {/* API Endpoints Section */}
          <section className="py-20 px-4">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-bold text-white text-center mb-12">
                Available API Endpoints
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Market Data API</h3>
                      <p className="text-white/70 text-sm">Real-time and historical stock data</p>
                    </div>
                    <Database className="w-8 h-8 text-purple-400" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-white/60">• Live quotes & prices</div>
                    <div className="text-sm text-white/60">• Historical OHLCV data</div>
                    <div className="text-sm text-white/60">• Intraday tick data</div>
                    <div className="text-sm text-white/60">• Market hours & status</div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">AI Analysis API</h3>
                      <p className="text-white/70 text-sm">Machine learning powered insights</p>
                    </div>
                    <GitBranch className="w-8 h-8 text-blue-400" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-white/60">• AI-generated scores</div>
                    <div className="text-sm text-white/60">• Price predictions</div>
                    <div className="text-sm text-white/60">• Anomaly detection</div>
                    <div className="text-sm text-white/60">• Pattern recognition</div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Sentiment API</h3>
                      <p className="text-white/70 text-sm">Social & news sentiment analysis</p>
                    </div>
                    <Cloud className="w-8 h-8 text-green-400" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-white/60">• Real-time sentiment scores</div>
                    <div className="text-sm text-white/60">• News impact analysis</div>
                    <div className="text-sm text-white/60">• Social media trends</div>
                    <div className="text-sm text-white/60">• Narrative detection</div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Document API</h3>
                      <p className="text-white/70 text-sm">Q&A and document processing</p>
                    </div>
                    <Terminal className="w-8 h-8 text-orange-400" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-white/60">• Document upload & storage</div>
                    <div className="text-sm text-white/60">• Natural language queries</div>
                    <div className="text-sm text-white/60">• Citation extraction</div>
                    <div className="text-sm text-white/60">• Batch processing</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Pricing for Developers */}
          <section className="py-20 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold text-white mb-6">
                Developer-Friendly Pricing
              </h2>
              <p className="text-xl text-white/70 mb-12">
                Start free, scale as you grow. No hidden fees.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-2">Free Tier</h3>
                  <div className="text-3xl font-bold text-purple-400 mb-4">$0</div>
                  <div className="space-y-2 text-left">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <span className="text-white/70 text-sm">1,000 requests/day</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <span className="text-white/70 text-sm">All endpoints</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <span className="text-white/70 text-sm">Community support</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-500/50 rounded-2xl p-6 relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    POPULAR
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
                  <div className="text-3xl font-bold text-purple-400 mb-4">$99<span className="text-lg text-white/60">/mo</span></div>
                  <div className="space-y-2 text-left">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <span className="text-white/70 text-sm">100,000 requests/day</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <span className="text-white/70 text-sm">WebSocket access</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <span className="text-white/70 text-sm">Priority support</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-2">Enterprise</h3>
                  <div className="text-3xl font-bold text-purple-400 mb-4">Custom</div>
                  <div className="space-y-2 text-left">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <span className="text-white/70 text-sm">Unlimited requests</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <span className="text-white/70 text-sm">Dedicated support</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <span className="text-white/70 text-sm">Custom SLA</span>
                    </div>
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
