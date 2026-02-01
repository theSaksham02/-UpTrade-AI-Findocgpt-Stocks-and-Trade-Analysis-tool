'use client'

import { useState } from 'react';
import { Code, Terminal, Webhook, Key, Book, ChevronRight, Copy, Check } from 'lucide-react';
import { LandingHeader } from '@/components/landing/Header';
// Footer handled by layout

export default function APIPage() {
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState<'rest' | 'websocket'>('rest');

    const codeExample = `import requests

# Get real-time sentiment
response = requests.get(
    'https://api.uptrade.io/v1/sentiment/AAPL',
    headers={'Authorization': 'Bearer YOUR_API_KEY'}
)

data = response.json()
print(f"Sentiment Score: {data['composite_score']}")
# Output: Sentiment Score: 0.84

# Check for divergence alerts
if data['anomaly_detected']:
    print(f"⚠️  {data['anomaly_type'].upper()} DETECTED")`;

    const wsExample = `const ws = new WebSocket(
  'wss://stream.uptrade.io/ws/AAPL'
);

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  if (data.type === 'DIVERGENCE_ALERT') {
    // Trigger your trading logic
    console.log('Liquidity divergence!', data);
  }
};`;

    return (
        <div className="bg-transparent min-h-screen">
            <LandingHeader />
            {/* Hero */}
            <section className="pt-32 pb-24 px-6 border-b border-[#2a2e39]">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-[#2962FF]/20 rounded-lg flex items-center justify-center">
                            <Code className="w-5 h-5 text-[#2962FF]" />
                        </div>
                        <span className="text-[#2962FF] font-mono text-sm tracking-wider">DEVELOPER API</span>
                    </div>

                    <h1 className="text-5xl font-bold text-white mb-6">
                        Build on Uptrade
                    </h1>
                    <p className="text-xl text-[#868993] max-w-2xl mb-8">
                        Real-time market data, sentiment analysis, and divergence detection
                        via REST and WebSocket APIs. 99.9% uptime SLA.
                    </p>

                    <div className="flex items-center gap-4">
                        <button className="bg-[#2962FF] hover:bg-[#1e53e5] text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2">
                            <Key className="w-4 h-4" />
                            Get API Key
                        </button>
                        <button className="text-white border border-[#2a2e39] hover:border-[#868993] px-6 py-3 rounded-lg font-medium flex items-center gap-2">
                            <Book className="w-4 h-4" />
                            Documentation
                        </button>
                    </div>
                </div>
            </section>

            {/* Code Example Section */}
            <section className="py-24 px-6">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
                    {/* Left: Description */}
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-6">Start in 30 Seconds</h2>
                        <p className="text-[#868993] mb-8 leading-relaxed">
                            Our Python SDK and REST API make it easy to integrate sentiment data
                            into your existing trading infrastructure. WebSocket streams deliver
                            sub-50ms latency for real-time strategies.
                        </p>

                        <div className="space-y-4">
                            {[
                                { icon: Terminal, title: 'REST API', desc: 'HTTP endpoints for historical data and aggregates' },
                                { icon: Webhook, title: 'WebSocket', desc: 'Real-time streaming for live sentiment and alerts' },
                                { icon: Code, title: 'Python SDK', desc: 'pip install uptrade-api' },
                            ].map((item) => (
                                <div key={item.title} className="flex items-start gap-4 p-4 bg-[#131722]/40 backdrop-blur-md rounded-lg border border-[#2a2e39]/50">
                                    <item.icon className="w-5 h-5 text-[#2962FF] mt-0.5" />
                                    <div>
                                        <h3 className="text-white font-medium">{item.title}</h3>
                                        <p className="text-[#868993] text-sm">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Interactive Code */}
                    <div className="bg-[#131722]/40 backdrop-blur-md rounded-xl border border-[#2a2e39]/50 overflow-hidden">
                        {/* Tabs */}
                        <div className="flex border-b border-[#2a2e39]">
                            <button
                                onClick={() => setActiveTab('rest')}
                                className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'rest' ? 'bg-[#1e222d] text-white' : 'text-[#868993]'
                                    }`}
                            >
                                <Terminal className="w-4 h-4" />
                                REST API
                            </button>
                            <button
                                onClick={() => setActiveTab('websocket')}
                                className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'websocket' ? 'bg-[#1e222d] text-white' : 'text-[#868993]'
                                    }`}
                            >
                                <Webhook className="w-4 h-4" />
                                WebSocket
                            </button>
                        </div>

                        {/* Code */}
                        <div className="relative p-6 bg-[#0b0e14]/40 backdrop-blur-md">
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(activeTab === 'rest' ? codeExample : wsExample);
                                    setCopied(true);
                                    setTimeout(() => setCopied(false), 2000);
                                }}
                                className="absolute top-4 right-4 text-[#868993] hover:text-white"
                            >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </button>

                            <pre className="text-sm font-mono text-[#d1d4dc] overflow-x-auto">
                                <code>{activeTab === 'rest' ? codeExample : wsExample}</code>
                            </pre>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Tiers */}
            <section className="py-24 px-6 border-t border-[#2a2e39]/30 bg-[#131722]/20 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-white text-center mb-12">API Pricing</h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                name: 'Developer',
                                price: 'Free',
                                requests: '100 / day',
                                ws: '1 connection',
                                features: ['Real-time sentiment', 'Basic divergence alerts', 'Community support']
                            },
                            {
                                name: 'Pro',
                                price: '$99/mo',
                                requests: '10,000 / day',
                                ws: '10 connections',
                                features: ['All Developer features', 'Historical data (1 year)', 'Priority email support', '99.9% SLA'],
                                popular: true
                            },
                            {
                                name: 'Enterprise',
                                price: 'Custom',
                                requests: 'Unlimited',
                                ws: 'Unlimited',
                                features: ['All Pro features', 'Custom models', 'Dedicated support', 'SSO & audit logs']
                            }
                        ].map((tier) => (
                            <div
                                key={tier.name}
                                className={`bg-[#0b0e14]/40 backdrop-blur-md rounded-xl p-6 border ${tier.popular ? 'border-[#2962FF]' : 'border-[#2a2e39]/50'
                                    }`}
                            >
                                {tier.popular && (
                                    <div className="text-[#2962FF] text-xs font-bold uppercase tracking-wider mb-4">
                                        Most Popular
                                    </div>
                                )}
                                <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                                <div className="text-3xl font-bold text-white mb-6">{tier.price}</div>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[#868993]">Requests</span>
                                        <span className="text-white">{tier.requests}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[#868993]">WebSocket</span>
                                        <span className="text-white">{tier.ws}</span>
                                    </div>
                                </div>

                                <ul className="space-y-3 mb-6">
                                    {tier.features.map((feat) => (
                                        <li key={feat} className="flex items-center gap-2 text-sm text-[#868993]">
                                            <Check className="w-4 h-4 text-[#089981]" />
                                            {feat}
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    className={`w-full py-3 rounded-lg font-medium transition-colors ${tier.popular
                                        ? 'bg-[#2962FF] hover:bg-[#1e53e5] text-white'
                                        : 'bg-[#1e222d] hover:bg-[#2a2e39] text-white'
                                        }`}
                                >
                                    Get Started
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Endpoint Reference */}
            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-white mb-8">Endpoint Reference</h2>

                    <div className="space-y-4">
                        {[
                            { method: 'GET', endpoint: '/v1/sentiment/{symbol}', desc: 'Current sentiment aggregate' },
                            { method: 'GET', endpoint: '/v1/sentiment/{symbol}/historical', desc: 'Historical sentiment time series' },
                            { method: 'GET', endpoint: '/v1/divergence/{symbol}', desc: 'Active divergence alerts' },
                            { method: 'GET', endpoint: '/v1/compare', desc: 'Multi-factor comparison' },
                            { method: 'WS', endpoint: '/ws/{symbol}', desc: 'Real-time sentiment stream' },
                        ].map((endpoint) => (
                            <div key={endpoint.endpoint} className="flex items-center gap-4 p-4 bg-[#131722]/40 backdrop-blur-md rounded-lg border border-[#2a2e39]/50 hover:border-[#2962FF]/50 transition-colors group cursor-pointer">
                                <span className={`font-mono text-sm px-2 py-1 rounded ${endpoint.method === 'GET' ? 'bg-[#089981]/20 text-[#089981]' :
                                    endpoint.method === 'POST' ? 'bg-[#2962FF]/20 text-[#2962FF]' :
                                        'bg-[#ff9800]/20 text-[#ff9800]'
                                    }`}>
                                    {endpoint.method}
                                </span>
                                <code className="text-[#d1d4dc] font-mono text-sm">{endpoint.endpoint}</code>
                                <span className="text-[#868993] text-sm ml-auto group-hover:text-white transition-colors">
                                    {endpoint.desc}
                                </span>
                                <ChevronRight className="w-4 h-4 text-[#868993] group-hover:translate-x-1 transition-transform" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
// Footer removed (handled by layout)
        </div>
    );
};
