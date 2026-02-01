'use client'

import { GlassmorphismNav } from "@/components/glassmorphism-nav"
import { Footer } from "@/components/footer"
import { Code, Terminal, Zap, Lock, ArrowRight, CheckCircle2, Layers, GitBranch, Database, Cloud } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"

export default function APIDevPage() {
  const [activeTab, setActiveTab] = useState('python')

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--tv-bg-dark)' }}>
      <GlassmorphismNav />

      <main className="pt-32 pb-16">
        {/* Hero Section */}
        <section className="min-h-[80vh] flex items-center justify-center px-4 relative">
          {/* Background gradient */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(41, 98, 255, 0.15) 0%, transparent 50%)',
            }}
          />

          <div className="max-w-7xl mx-auto text-center relative z-10">
            <div
              className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium mb-8"
              style={{
                backgroundColor: 'var(--tv-surface)',
                border: '1px solid var(--tv-border)',
                color: 'var(--tv-blue)'
              }}
            >
              <Code className="w-4 h-4 mr-2" />
              Developer-First API Platform
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              <span style={{ color: 'var(--tv-text-primary)' }}>Build with</span>
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(135deg, #2962FF, #00C853)' }}
              >
                UpTrade APIs
              </span>
            </h1>

            <p className="text-lg mb-12 max-w-3xl mx-auto" style={{ color: 'var(--tv-text-muted)' }}>
              Access market data, AI analysis, sentiment feeds, and more. RESTful APIs with WebSocket support for real-time data. Built for developers who demand speed and reliability.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/dashboard">
                <Button
                  className="text-white rounded-lg px-8 py-6 text-lg transition-all duration-300 hover:scale-105 hover:brightness-110"
                  style={{ backgroundColor: 'var(--tv-blue)' }}
                >
                  Get API Key
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button
                variant="outline"
                className="rounded-lg px-8 py-6 text-lg"
                style={{
                  borderColor: 'var(--tv-border)',
                  color: 'var(--tv-text)',
                  backgroundColor: 'transparent'
                }}
              >
                View Docs
              </Button>
            </div>

            {/* Key Features Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-20">
              {[
                { label: "RESTful API" },
                { label: "WebSockets" },
                { label: "99.9% Uptime" },
                { label: "Low Latency" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-lg p-4"
                  style={{ backgroundColor: 'var(--tv-surface)', border: '1px solid var(--tv-border)' }}
                >
                  <CheckCircle2 className="w-6 h-6 mx-auto mb-2" style={{ color: 'var(--tv-blue)' }} />
                  <div className="text-sm" style={{ color: 'var(--tv-text)' }}>{item.label}</div>
                </div>
              ))}
            </div>

            {/* Code Example Section */}
            <div className="max-w-5xl mx-auto">
              <div
                className="rounded-2xl p-8 md:p-12 text-left"
                style={{ backgroundColor: 'var(--tv-surface)', border: '1px solid var(--tv-border)' }}
              >
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--tv-text-primary)' }}>Quick Start Code Example</h3>
                  <p style={{ color: 'var(--tv-text-muted)' }}>Get started in minutes with our simple API</p>
                </div>

                {/* Tabs */}
                <div className="flex space-x-2 mb-6 border-b" style={{ borderColor: 'var(--tv-border)' }}>
                  {['python', 'javascript', 'curl'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className="px-4 py-2 font-medium capitalize relative"
                      style={{
                        color: activeTab === tab ? 'var(--tv-blue)' : 'var(--tv-text-muted)',
                      }}
                    >
                      {tab}
                      {activeTab === tab && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: 'var(--tv-blue)' }} />
                      )}
                    </button>
                  ))}
                </div>

                {/* Code Block */}
                <div
                  className="rounded-xl p-6 overflow-x-auto"
                  style={{ backgroundColor: 'var(--tv-bg-dark)', border: '1px solid var(--tv-border)' }}
                >
                  <pre className="text-sm font-mono leading-relaxed" style={{ color: 'var(--tv-text)' }}>
                    <code>{`import uptrade

# Initialize client
client = uptrade.Client(api_key="your_api_key")

# Get real-time stock data
stock = client.stocks.get("AAPL")
print(f"Price: \${stock.price}")
print(f"AI Score: {stock.ai_score}")

# Get sentiment analysis
sentiment = client.sentiment.analyze("AAPL")
print(f"Sentiment: {sentiment.score}")

# Stream real-time data
@client.stream.ticker("AAPL")
def on_update(data):
    print(f"Live update: {data.price}")

client.stream.start()`}</code>
                  </pre>
                </div>

                {/* Response Example */}
                <div className="mt-6">
                  <div className="text-sm mb-3 flex items-center space-x-2" style={{ color: 'var(--tv-text-muted)' }}>
                    <Terminal className="w-4 h-4" />
                    <span>API Response:</span>
                  </div>
                  <div
                    className="rounded-xl p-4"
                    style={{ backgroundColor: 'var(--tv-bg-dark)', border: '1px solid var(--tv-green)' }}
                  >
                    <pre className="text-sm font-mono" style={{ color: 'var(--tv-green)' }}>
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
  "status": "success"
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
            <h2 className="text-4xl font-bold text-center mb-12" style={{ color: 'var(--tv-text-primary)' }}>
              Enterprise-Grade Infrastructure
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Zap, title: "Lightning Fast", desc: "Average response time under 50ms. Optimized endpoints with CDN distribution for global low latency.", color: 'var(--tv-blue)' },
                { icon: Lock, title: "Secure & Reliable", desc: "Bank-grade encryption, SOC 2 compliant infrastructure, and 99.9% uptime SLA guarantee.", color: 'var(--tv-green)' },
                { icon: Layers, title: "Scalable", desc: "From prototype to production. Scale from 100 to 10M requests per day without configuration changes.", color: 'var(--tv-blue)' },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="rounded-lg p-8"
                  style={{ backgroundColor: 'var(--tv-surface)', border: '1px solid var(--tv-border)' }}
                >
                  <feature.icon className="w-12 h-12 mb-4" style={{ color: feature.color }} />
                  <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--tv-text-primary)' }}>{feature.title}</h3>
                  <p style={{ color: 'var(--tv-text-muted)' }}>{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* API Endpoints Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12" style={{ color: 'var(--tv-text-primary)' }}>
              Available API Endpoints
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {[
                { icon: Database, title: "Market Data API", desc: "Real-time and historical stock data", items: ["Live quotes & prices", "Historical OHLCV data", "Intraday tick data", "Market hours & status"], color: 'var(--tv-blue)' },
                { icon: GitBranch, title: "AI Analysis API", desc: "Machine learning powered insights", items: ["AI-generated scores", "Price predictions", "Anomaly detection", "Pattern recognition"], color: 'var(--tv-green)' },
                { icon: Cloud, title: "Sentiment API", desc: "Social & news sentiment analysis", items: ["Real-time sentiment scores", "News impact analysis", "Social media trends", "Narrative detection"], color: 'var(--tv-blue)' },
                { icon: Terminal, title: "Document API", desc: "Q&A and document processing", items: ["Document upload & storage", "Natural language queries", "Citation extraction", "Batch processing"], color: '#ff9800' },
              ].map((endpoint, idx) => (
                <div
                  key={idx}
                  className="rounded-xl p-6"
                  style={{
                    backgroundColor: 'var(--tv-surface)',
                    border: `1px solid ${endpoint.color}`,
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--tv-text-primary)' }}>{endpoint.title}</h3>
                      <p className="text-sm" style={{ color: 'var(--tv-text-muted)' }}>{endpoint.desc}</p>
                    </div>
                    <endpoint.icon className="w-8 h-8" style={{ color: endpoint.color }} />
                  </div>
                  <div className="space-y-2">
                    {endpoint.items.map((item, i) => (
                      <div key={i} className="text-sm" style={{ color: 'var(--tv-text-secondary)' }}>• {item}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing for Developers */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6" style={{ color: 'var(--tv-text-primary)' }}>
              Developer-Friendly Pricing
            </h2>
            <p className="text-xl mb-12" style={{ color: 'var(--tv-text-muted)' }}>
              Start free, scale as you grow. No hidden fees.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: "Free Tier", price: "$0", features: ["1,000 requests/day", "All endpoints", "Community support"] },
                { name: "Pro", price: "$99", period: "/mo", features: ["100,000 requests/day", "WebSocket access", "Priority support"], popular: true },
                { name: "Enterprise", price: "Custom", features: ["Unlimited requests", "Dedicated support", "Custom SLA"] },
              ].map((tier, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl p-6 relative"
                  style={{
                    backgroundColor: 'var(--tv-surface)',
                    border: tier.popular ? '2px solid var(--tv-blue)' : '1px solid var(--tv-border)',
                  }}
                >
                  {tier.popular && (
                    <div
                      className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: 'var(--tv-blue)' }}
                    >
                      POPULAR
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--tv-text-primary)' }}>{tier.name}</h3>
                  <div className="text-3xl font-bold mb-4" style={{ color: 'var(--tv-blue)' }}>
                    {tier.price}
                    {tier.period && <span className="text-lg" style={{ color: 'var(--tv-text-muted)' }}>{tier.period}</span>}
                  </div>
                  <div className="space-y-2 text-left">
                    {tier.features.map((feature, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--tv-blue)' }} />
                        <span className="text-sm" style={{ color: 'var(--tv-text-muted)' }}>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
