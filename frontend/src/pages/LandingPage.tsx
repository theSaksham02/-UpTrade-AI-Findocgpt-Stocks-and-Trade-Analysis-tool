/**
 * UpTrade AI Landing Page - Professional, Visual-Heavy, Modern
 * Inspired by OpenBB, Stripe, and leading fintech platforms
 * The Terminal, Reimagined by AI
 */
import { useNavigate } from 'react-router-dom';
import { 
  Menu, X, ChevronRight, ArrowRight, Brain, Radio, TrendingUp, Activity, 
  BarChart3, LineChart, Zap, Shield, Code, Globe, Users, Rocket, Lock, 
  Mail, Phone, MapPin, Github, Linkedin, Twitter, ExternalLink, Check
} from 'lucide-react';
import { useState } from 'react';

const NAV_LINKS = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'TradeX', href: '/tradex' },
  { label: 'VisualX', href: '/visualx' },
  { label: 'TradeSphere', href: '/portfolio' },
  { label: 'Research', href: '/research' },
  { label: 'Docs', href: '#docs' },
  { label: 'Contact', href: '#contact' }
];

const CORE_PRODUCTS = [
  {
    title: 'TradeX',
    subtitle: 'Find Your Asymmetric Edge',
    description: 'Multi-factor comparison engine powered by AI. Stack any two assets against thousands of metrics—from standard fundamentals to proprietary sentiment scores.',
    icon: TrendingUp,
    color: 'from-emerald-500/20 to-green-600/20',
    borderColor: 'border-green-500/30',
    features: ['Multi-factor Analysis', 'Real-time Sentiment', 'Entity Extraction', 'Risk Scoring'],
    href: '/tradex',
    gradient: 'from-emerald-900/50 to-green-900/50'
  },
  {
    title: 'VisualX',
    subtitle: 'Trade the Narrative',
    description: 'Real-time market pulse processing 24/7. Identifies emerging narratives, detects sentiment-driven volatility, and alerts to market shifts before they happen.',
    icon: Radio,
    color: 'from-cyan-500/20 to-blue-600/20',
    borderColor: 'border-cyan-500/30',
    features: ['Live News Feed', 'Sentiment Analysis', 'Narrative Detection', 'Volatility Alerts'],
    href: '/visualx',
    gradient: 'from-cyan-900/50 to-blue-900/50'
  },
  {
    title: 'Research (FinDocGPT)',
    subtitle: 'Query Your Universe',
    description: 'AI that has read millions of SEC filings and research reports. Ask complex questions in natural language, get instant, sourced answers.',
    icon: Brain,
    color: 'from-violet-500/20 to-purple-600/20',
    borderColor: 'border-violet-500/30',
    features: ['Document Q&A', 'SEC Filing Search', 'NLP Analysis', 'Citation Tracking'],
    href: '/research',
    gradient: 'from-violet-900/50 to-purple-900/50'
  },
  {
    title: 'TradeSphere',
    subtitle: 'Build, Test, Deploy',
    description: 'Your personal quant lab. Manage holdings, test strategies with live data, deploy algorithms with one click. Real-time portfolio optimization.',
    icon: Activity,
    color: 'from-orange-500/20 to-red-600/20',
    borderColor: 'border-orange-500/30',
    features: ['Portfolio Management', 'Strategy Backtesting', 'Paper Trading', 'Performance Analytics'],
    href: '/portfolio',
    gradient: 'from-orange-900/50 to-red-900/50'
  }
];

const FEATURES = [
  { icon: BarChart3, title: 'Real-time Market Data', description: 'Live quotes, OHLCV, depth, and order book data updated millisecond by millisecond.' },
  { icon: LineChart, title: 'Advanced Analytics', description: 'Technical indicators, correlations, volatility forecasts, and pattern recognition.' },
  { icon: Zap, title: 'Lightning Fast', description: 'Sub-millisecond latency. Watch live sentiment scores update in real-time.' },
  { icon: Shield, title: 'Enterprise Security', description: 'Bank-grade encryption, SOC 2 compliant, API keys with granular permissions.' },
  { icon: Code, title: 'Comprehensive API', description: 'RESTful API + WebSocket streams. Full documentation with SDKs in Python, JS, Go.' },
  { icon: Globe, title: 'Global Coverage', description: 'Equities, crypto, forex, commodities. 50+ exchanges. 10M+ instruments.' }
];

const COMPARISON = [
  { feature: 'Real-time Sentiment Analysis', tradingTerminal: false, uptrade: true },
  { feature: 'AI Document Analysis', tradingTerminal: false, uptrade: true },
  { feature: 'Entity Extraction (NER)', tradingTerminal: false, uptrade: true },
  { feature: 'Narrative Detection', tradingTerminal: false, uptrade: true },
  { feature: 'Standard Charts & Data', tradingTerminal: true, uptrade: true },
  { feature: 'SEC Filings Integration', tradingTerminal: false, uptrade: true },
  { feature: 'Portfolio Management', tradingTerminal: true, uptrade: true },
  { feature: 'Paper Trading', tradingTerminal: false, uptrade: true },
  { feature: 'Strategy Backtesting', tradingTerminal: true, uptrade: true },
  { feature: 'Public API Access', tradingTerminal: false, uptrade: true }
];

const PRICING_TIERS = [
  {
    name: 'Starter',
    price: 'Free',
    description: 'Perfect for learning and experimentation',
    features: [
      'UpTrade Dashboard access',
      'Real-time market data (delayed 15min)',
      'Basic sentiment analysis',
      'Limited API calls (100/month)',
      'Community support'
    ],
    cta: 'Get Started',
    highlighted: false
  },
  {
    name: 'Professional',
    price: '$99',
    period: '/month',
    description: 'For serious traders and analysts',
    features: [
      'Everything in Starter',
      'Real-time data (live)',
      'Advanced sentiment scoring',
      'NER entity extraction',
      'Paper trading platform',
      '10,000 API calls/month',
      'Priority email support',
      'Custom alerts'
    ],
    cta: 'Start Free Trial',
    highlighted: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For institutions and HFT firms',
    features: [
      'Everything in Professional',
      'Unlimited API calls',
      'Dedicated API gateway',
      'White-label options',
      'Custom models & training',
      '24/7 Phone support',
      'SLA guarantee (99.9%)',
      'On-premise deployment'
    ],
    cta: 'Contact Sales',
    highlighted: false
  }
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="relative w-full overflow-x-hidden bg-[#0D0219]">
      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#1A0537] via-[#221022] to-[#0D0219]" />
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-conic from-purple-900/20 via-transparent to-transparent blur-3xl animate-spin" style={{ animationDuration: '20s' }} />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-conic from-violet-900/20 via-transparent to-transparent blur-3xl animate-spin" style={{ animationDuration: '30s', animationDirection: 'reverse' }} />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 px-4 md:px-10 lg:px-20 backdrop-blur-xl bg-[#0D0219]/80 border-b border-white/10">
        <nav className="container mx-auto flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-purple rounded-lg flex items-center justify-center">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <span className="text-white text-xl font-bold">UpTrade</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                onClick={() => link.href.startsWith('#') ? null : navigate(link.href)}
                href={link.href}
                className="text-white/70 hover:text-white text-sm font-medium transition-colors cursor-pointer"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex gap-3">
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-gradient-purple hover:opacity-90 text-white text-sm font-bold rounded-lg transition-all"
            >
              Get Started Free
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-white/10">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                onClick={() => {
                  if (!link.href.startsWith('#')) navigate(link.href);
                  setMobileMenuOpen(false);
                }}
                href={link.href}
                className="block py-2 text-white/70 hover:text-white text-sm font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        {/* HERO SECTION */}
        <section className="min-h-[calc(100vh-70px)] px-4 md:px-10 lg:px-20 py-20 flex items-center justify-center">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div>
                <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full">
                  <Zap className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-400 text-sm font-medium">AI-Powered Financial Intelligence</span>
                </div>

                <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
                  The Terminal, Reimagined by <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">AI.</span>
                </h1>

                <p className="text-xl text-white/70 mb-8 leading-relaxed">
                  Real-time market intelligence, institutional-grade document analysis, and predictive insights in one unified platform. Stop switching tabs. Start finding alpha.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="px-8 py-3 bg-gradient-purple hover:opacity-90 text-white font-bold rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    Get Started Free <ArrowRight className="w-5 h-5" />
                  </button>
                  <button className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition-all border border-white/20 flex items-center justify-center gap-2">
                    Watch Demo <ExternalLink className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-8">
                  <div>
                    <div className="text-3xl font-bold text-white">50M+</div>
                    <div className="text-white/60 text-sm">Market Data Points Daily</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white">10M+</div>
                    <div className="text-white/60 text-sm">Instruments Tracked</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white">24/7</div>
                    <div className="text-white/60 text-sm">AI Analysis</div>
                  </div>
                </div>
              </div>

              {/* Right Visual */}
              <div className="relative h-96 hidden lg:block">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-violet-900/30 rounded-2xl blur-3xl" />
                <div className="absolute inset-0 border border-purple-500/20 rounded-2xl" />
                
                {/* Animated Chart */}
                <div className="absolute inset-8">
                  <svg className="w-full h-full" viewBox="0 0 300 200" fill="none">
                    {/* Grid */}
                    {[...Array(5)].map((_, i) => (
                      <g key={i}>
                        <line x1="0" y1={i * 40 + 40} x2="300" y2={i * 40 + 40} stroke="rgba(168,85,247,0.1)" strokeWidth="1" />
                      </g>
                    ))}
                    
                    {/* Charts */}
                    <polyline points="20,150 60,100 100,120 140,70 180,90 220,40 280,60" stroke="url(#gradientLine)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    
                    {/* Data points */}
                    {[20, 60, 100, 140, 180, 220, 280].map((x, i) => (
                      <circle key={i} cx={x} cy={[150, 100, 120, 70, 90, 40, 60][i]} r="4" fill="url(#gradientDot)" className="animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                    ))}
                    
                    <defs>
                      <linearGradient id="gradientLine" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                      <radialGradient id="gradientDot">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#7c3aed" />
                      </radialGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROBLEM SECTION */}
        <section className="px-4 md:px-10 lg:px-20 py-20 bg-white/5">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              The Problem is Real
            </h2>
            <p className="text-xl text-white/70 mb-12">
              Professional traders and analysts waste 6+ hours a day stitching together data from disconnected sources. By the time you synthesize it, the alpha is gone.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-xl">
                <div className="text-3xl mb-3">🔄</div>
                <h3 className="text-white font-bold mb-2">Tab Chaos</h3>
                <p className="text-white/70 text-sm">Bloomberg, SEC Edgar, Twitter, news sites. Too many sources, too much friction.</p>
              </div>
              <div className="p-6 bg-orange-500/10 border border-orange-500/30 rounded-xl">
                <div className="text-3xl mb-3">⏱️</div>
                <h3 className="text-white font-bold mb-2">Stale Data</h3>
                <p className="text-white/70 text-sm">15-minute delays on charts. By the time you see news, the market has repriced.</p>
              </div>
              <div className="p-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="text-white font-bold mb-2">No Insights</h3>
                <p className="text-white/70 text-sm">Raw data isn't intelligence. You're doing the analysis. You should be finding opportunities.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CORE PRODUCTS SECTION */}
        <section className="px-4 md:px-10 lg:px-20 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                Four Products. One Platform.
              </h2>
              <p className="text-xl text-white/70">
                Everything you need to make smarter investment decisions
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {CORE_PRODUCTS.map((product, idx) => {
                const Icon = product.icon;
                return (
                  <div
                    key={idx}
                    onClick={() => navigate(product.href)}
                    className="group cursor-pointer relative p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-purple-500/50 transition-all duration-300 hover:bg-white/10 hover:shadow-2xl"
                  >
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${product.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl -z-10`} />

                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${product.color} border ${product.borderColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-white mb-1">{product.title}</h3>
                    <p className="text-purple-400 font-semibold text-sm mb-3">{product.subtitle}</p>
                    <p className="text-white/70 mb-6">{product.description}</p>

                    {/* Features */}
                    <div className="space-y-2 mb-6">
                      {product.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-white/60 text-sm">
                          <Check className="w-4 h-4 text-green-400" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="flex items-center gap-2 text-purple-400 group-hover:text-purple-300 font-semibold">
                      Explore {product.title} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="px-4 md:px-10 lg:px-20 py-20 bg-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                Built for Modern Finance
              </h2>
              <p className="text-xl text-white/70">
                Enterprise-grade infrastructure meets developer-friendly APIs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 bg-white/5 border border-white/10 rounded-xl hover:border-purple-500/50 hover:bg-white/10 transition-all duration-300 group"
                  >
                    <Icon className="w-10 h-10 text-purple-400 mb-4 group-hover:text-purple-300 transition-colors" />
                    <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-white/70 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* COMPARISON SECTION */}
        <section className="px-4 md:px-10 lg:px-20 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                Why Choose UpTrade
              </h2>
              <p className="text-xl text-white/70">
                We've reimagined what a trading platform should be
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-4 px-4 text-white font-bold">Feature</th>
                    <th className="text-center py-4 px-4 text-white/70 font-semibold">Traditional Terminal</th>
                    <th className="text-center py-4 px-4 text-white font-semibold">UpTrade</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((row, idx) => (
                    <tr key={idx} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 text-white font-medium">{row.feature}</td>
                      <td className="py-4 px-4 text-center">
                        {row.tradingTerminal ? (
                          <Check className="w-5 h-5 text-green-400 mx-auto" />
                        ) : (
                          <div className="w-5 h-5 border-2 border-white/30 rounded mx-auto" />
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Check className="w-5 h-5 text-green-400 mx-auto" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* PRICING SECTION */}
        <section className="px-4 md:px-10 lg:px-20 py-20 bg-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-xl text-white/70">
                Start free. Scale as you grow.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {PRICING_TIERS.map((tier, idx) => (
                <div
                  key={idx}
                  className={`relative p-8 rounded-2xl border transition-all duration-300 ${
                    tier.highlighted
                      ? 'border-purple-500/50 bg-gradient-to-br from-purple-500/10 to-transparent scale-105 shadow-2xl'
                      : 'border-white/10 bg-white/5 hover:border-purple-500/30'
                  }`}
                >
                  {tier.highlighted && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-purple px-4 py-1 rounded-full text-white text-sm font-bold">
                        Most Popular
                      </div>
                    </div>
                  )}

                  <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                  <p className="text-white/70 text-sm mb-6">{tier.description}</p>

                  <div className="mb-6">
                    <span className="text-4xl font-black text-white">{tier.price}</span>
                    {tier.period && <span className="text-white/70 ml-2">{tier.period}</span>}
                  </div>

                  <button
                    onClick={() => navigate('/dashboard')}
                    className={`w-full py-3 rounded-lg font-bold mb-8 transition-all ${
                      tier.highlighted
                        ? 'bg-gradient-purple hover:opacity-90 text-white'
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                    }`}
                  >
                    {tier.cta}
                  </button>

                  <div className="space-y-4">
                    {tier.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-white/80 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* API/DOCS SECTION */}
        <section className="px-4 md:px-10 lg:px-20 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-black text-white mb-6">For Developers</h2>
                <p className="text-xl text-white/70 mb-8">
                  Complete API access with SDKs in Python, JavaScript, and Go. Build custom strategies, integrate with your infrastructure, deploy at scale.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-4">
                    <Code className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="text-white font-bold mb-1">Multiple SDKs</h4>
                      <p className="text-white/70 text-sm">Python, JavaScript, Go, C++</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Globe className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="text-white font-bold mb-1">Websocket Streams</h4>
                      <p className="text-white/70 text-sm">Real-time updates with sub-second latency</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Shield className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="text-white font-bold mb-1">Fine-grained Permissions</h4>
                      <p className="text-white/70 text-sm">Control exactly what each API key can do</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/research')}
                  className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition-all border border-white/20 flex items-center gap-2"
                >
                  View Documentation <ExternalLink className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-black/50 p-6 rounded-xl border border-purple-500/30 overflow-hidden">
                <div className="bg-black/30 p-4 rounded font-mono text-sm text-green-400 overflow-x-auto">
                  <pre>{`import uptrade

client = uptrade.Client(
  api_key='your_api_key'
)

# Get live sentiment
sentiment = client.get_sentiment('TSLA')
print(sentiment.score)  # 0.75

# Stream real-time data
for quote in client.stream_quotes(['AAPL','MSFT']):
  print(quote.price, quote.change)

# Backtest strategy
strategy = client.backtest(
  name='mean_reversion',
  instruments=['SPY', 'QQQ'],
  start='2023-01-01'
)
print(strategy.sharpe_ratio)`}</pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="px-4 md:px-10 lg:px-20 py-20 bg-gradient-to-r from-purple-900/50 to-violet-900/50 border-t border-b border-purple-500/30">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Ready to Find Your Alpha?
            </h2>
            <p className="text-xl text-white/70 mb-10">
              Join thousands of traders, analysts, and quants who are making better decisions with UpTrade.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/dashboard')}
                className="px-8 py-4 bg-gradient-purple hover:opacity-90 text-white font-bold rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                Start Free Today <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition-all border border-white/20 flex items-center justify-center gap-2">
                Schedule a Demo <ExternalLink className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="px-4 md:px-10 lg:px-20 py-20 bg-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                Get in Touch
              </h2>
              <p className="text-xl text-white/70">
                Have questions? Our team is here to help.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 bg-white/5 border border-white/10 rounded-xl text-center">
                <Mail className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-white font-bold mb-2">Email</h3>
                <a href="mailto:support@uptrade.ai" className="text-purple-400 hover:text-purple-300 transition-colors">
                  support@uptrade.ai
                </a>
              </div>

              <div className="p-8 bg-white/5 border border-white/10 rounded-xl text-center">
                <Phone className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-white font-bold mb-2">Phone</h3>
                <a href="tel:+1234567890" className="text-purple-400 hover:text-purple-300 transition-colors">
                  +1 (650) 999-7777
                </a>
              </div>

              <div className="p-8 bg-white/5 border border-white/10 rounded-xl text-center">
                <MapPin className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-white font-bold mb-2">Location</h3>
                <p className="text-white/70">
                  San Francisco, CA<br />
                  Singapore
                </p>
              </div>
            </div>

            <div className="mt-16 p-8 bg-white/5 border border-white/10 rounded-xl">
              <h3 className="text-2xl font-bold text-white mb-4">Quick Contact Form</h3>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Your Name" className="px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-500" />
                <input type="email" placeholder="Your Email" className="px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-500" />
                <textarea placeholder="Your Message" rows={4} className="md:col-span-2 px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-500 resize-none" />
                <button type="submit" className="md:col-span-2 px-6 py-3 bg-gradient-purple hover:opacity-90 text-white font-bold rounded-lg transition-all">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="px-4 md:px-10 lg:px-20 py-12 border-t border-white/10 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="text-white font-bold mb-4">Product</h4>
              <ul className="space-y-2">
                {['Dashboard', 'TradeX', 'VisualX', 'TradeSphere', 'Research'].map(item => (
                  <li key={item}><a href="#" className="text-white/70 hover:text-white text-sm transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Developer</h4>
              <ul className="space-y-2">
                {['API Reference', 'Documentation', 'SDKs', 'GitHub'].map(item => (
                  <li key={item}><a href="#" className="text-white/70 hover:text-white text-sm transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                {['About', 'Blog', 'Contact', 'Careers'].map(item => (
                  <li key={item}><a href="#" className="text-white/70 hover:text-white text-sm transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                {['Privacy', 'Terms', 'Security', 'Compliance'].map(item => (
                  <li key={item}><a href="#" className="text-white/70 hover:text-white text-sm transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-white/50 text-sm">© 2024 UpTrade. All rights reserved.</p>
              <div className="flex gap-6 mt-4 md:mt-0">
                <a href="#" className="text-white/70 hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
                <a href="#" className="text-white/70 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
                <a href="#" className="text-white/70 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
      {/* Background Layers */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#1A0537] via-[#221022] to-[#0D0219] -z-10" />
      <div 
        className="absolute top-0 left-0 w-full h-full opacity-5 -z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`
        }}
      />
      <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-purple-900/50 rounded-full filter blur-3xl animate-pulse-slow -z-10" />
      <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-violet-900/40 rounded-full filter blur-3xl animate-pulse-slow -z-10" style={{ animationDelay: '3s' }} />

      {/* Header */}
      <header className="sticky top-0 z-50 px-4 md:px-10 lg:px-20 backdrop-blur-md bg-[#221022]/50">
        <nav className="container mx-auto flex items-center justify-between border-b border-white/10 py-3">
          <div className="flex items-center gap-4">
            <svg className="h-6 w-6 text-accent-purple" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_6_535)">
                <path clipRule="evenodd" d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z" fill="currentColor" fillRule="evenodd" />
              </g>
              <defs>
                <clipPath id="clip0_6_535"><rect fill="white" height="48" width="48" /></clipPath>
              </defs>
            </svg>
            <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em]">Uptrade</h2>
          </div>
          <div className="hidden md:flex items-center gap-9">
            <a className="text-white/80 hover:text-white text-sm font-medium leading-normal transition-colors cursor-pointer" onClick={() => navigate('/dashboard')}>Dashboard</a>
            <a className="text-white/80 hover:text-white text-sm font-medium leading-normal transition-colors cursor-pointer" onClick={() => navigate('/tradex')}>TradeX</a>
            <a className="text-white/80 hover:text-white text-sm font-medium leading-normal transition-colors cursor-pointer" onClick={() => navigate('/visualx')}>VisualX</a>
            <a className="text-white/80 hover:text-white text-sm font-medium leading-normal transition-colors cursor-pointer" onClick={() => navigate('/portfolio')}>TradeSphere</a>
          </div>
          <div className="hidden md:flex gap-2">
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-gradient-purple text-white text-sm font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity"
            >
              <span className="truncate">Get Started for Free</span>
            </button>
            <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-white/10 text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-white/20 transition-colors">
              <span className="truncate">Book Demo</span>
            </button>
          </div>
          <div className="md:hidden">
            <button className="text-white">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-10 lg:px-20">
        {/* Hero Section with Orbital Animation */}
        <section className="min-h-[calc(100vh-69px)] flex items-center justify-center text-center py-20 relative">
          <div className="absolute inset-0 flex items-center justify-center -z-10">
            <div className="w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full border border-purple-500/10 relative">
              <div className="absolute inset-2 md:inset-4 rounded-full border border-purple-500/10" />
              <div className="absolute inset-4 md:inset-8 rounded-full border border-purple-500/10" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-purple-500 rounded-full shadow-[0_0_20px_5px] shadow-purple-500" />
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-violet-400 rounded-full animate-pulse-slow" />
              <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-violet-400 rounded-full animate-pulse-slow" style={{ animationDelay: '1s' }} />
              <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-violet-400 rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }} />
              <div className="absolute bottom-1/2 right-1/4 w-3 h-3 bg-violet-400 rounded-full animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
            </div>
          </div>
          <div className="max-w-3xl flex flex-col items-center gap-6 relative z-10">
            <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] md:text-6xl">
              The Terminal, Reimagined by AI.
            </h1>
            <h2 className="text-white/80 text-base font-normal leading-normal md:text-xl">
              Uptrade unifies real-time market data, institutional-grade document analysis, and predictive AI insights into one powerful, intuitive platform. Stop switching tabs. Start finding alpha.
            </h2>
            <div className="mt-4 flex flex-wrap gap-3 justify-center">
              <button 
                onClick={() => navigate('/dashboard')}
                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-gradient-purple text-white text-base font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity"
              >
                <span className="truncate">Get Started for Free</span>
              </button>
              <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-white/10 text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-white/20 transition-colors">
                <span className="truncate">Book Enterprise Demo</span>
              </button>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-20 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="relative mb-12 flex justify-center items-center">
              <div className="w-full h-24 bg-gradient-to-r from-transparent via-purple-900/50 to-transparent blur-xl" />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-full h-16 text-purple-400/30" fill="none" preserveAspectRatio="none" stroke="currentColor" viewBox="0 0 200 20">
                  <polyline points="0,10 20,15 40,5 60,18 80,8 100,12 120,5 140,15 160,10 180,18 200,10" strokeWidth="2" />
                </svg>
              </div>
            </div>
            <h2 className="text-white text-3xl md:text-4xl font-bold leading-tight tracking-[-0.015em]">
              Stop Drowning in Disconnected Data.
            </h2>
            <p className="text-white/70 text-base md:text-lg font-normal leading-normal mt-6">
              Professional investors and quants waste hours a day trying to connect the dots. You have one tool for charts, another for SEC filings, a third for news, and a fourth for social sentiment. By the time you manually synthesize this fragmented data, the market has moved. Your alpha is gone.
            </p>
          </div>
        </section>

        {/* Solution Section */}
        <section className="py-20 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="relative mb-12 flex flex-col justify-center items-center gap-4">
              <div className="relative w-48 h-24">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-purple-900/60 to-transparent blur-lg" />
                <svg className="absolute inset-0 w-full h-full text-purple-400" fill="none" viewBox="0 0 100 50">
                  <path d="M10 40 Q 30 10, 50 25 T 90 15" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
                  <path d="M85 20 L 90 15 L 85 10" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </div>
            </div>
            <h2 className="text-white text-3xl md:text-4xl font-bold leading-tight tracking-[-0.015em]">
              From Noise to Signal. Instantly.
            </h2>
            <p className="text-white/70 text-base md:text-lg font-normal leading-normal mt-6">
              Uptrade is your single source of truth. We ingest, index, and analyze millions of financial data points in real-time. Our AI-native engine connects them for you. Ask complex questions, get data-backed answers. Identify cross-asset correlations. Discover narrative-driven opportunities. Build, backtest, and deploy strategies—all from one command.
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/5 p-8 rounded-xl border border-white/10 hover:border-purple-500/30 transition-colors cursor-pointer" onClick={() => navigate('/research')}>
              <div className="flex items-center gap-4 mb-4">
                <Brain className="w-8 h-8 text-accent-purple" />
                <h3 className="text-xl font-bold text-white">Query Your Universe</h3>
              </div>
              <p className="text-white/70">
                Our core engine (FinDocGPT) has read and understood millions of global SEC filings, earnings call transcripts, and research reports. Ask complex, natural language questions and get an instant, sourced, and synthesized answer.
              </p>
            </div>

            <div className="bg-white/5 p-8 rounded-xl border border-white/10 hover:border-purple-500/30 transition-colors cursor-pointer" onClick={() => navigate('/visualx')}>
              <div className="flex items-center gap-4 mb-4">
                <Radio className="w-8 h-8 text-accent-purple" />
                <h3 className="text-xl font-bold text-white">Trade the Narrative</h3>
              </div>
              <p className="text-white/70">
                visualX is your real-time market pulse, processing global news and social media 24/7. It identifies emerging narratives, detects sentiment-driven volatility, and alerts you to narrative shifts.
              </p>
            </div>

            <div className="bg-white/5 p-8 rounded-xl border border-white/10 hover:border-purple-500/30 transition-colors cursor-pointer" onClick={() => navigate('/tradex')}>
              <div className="flex items-center gap-4 mb-4">
                <TrendingUp className="w-8 h-8 text-accent-purple" />
                <h3 className="text-xl font-bold text-white">Find Your Asymmetric Edge</h3>
              </div>
              <p className="text-white/70">
                TradeX and Compare X are your alpha discovery tools. Stack any two assets against thousands of metrics—from standard fundamentals to our proprietary, real-time sentiment scores. Uncover asymmetric opportunities and hidden correlations.
              </p>
            </div>

            <div className="bg-white/5 p-8 rounded-xl border border-white/10 hover:border-purple-500/30 transition-colors cursor-pointer" onClick={() => navigate('/portfolio')}>
              <div className="flex items-center gap-4 mb-4">
                <Activity className="w-8 h-8 text-accent-purple" />
                <h3 className="text-xl font-bold text-white">Build, Test, Deploy</h3>
              </div>
              <p className="text-white/70">
                This is your personal quant lab. Use our Portfolio twin (TradeSphere) to manage and optimize your holdings with AI. Test complex, multi-factor strategies against real-world data with our real-time Paper Trading environment. Deploy your strategy with a single click.
              </p>
            </div>
          </div>
        </section>

        {/* User Personas Section */}
        <section className="py-20">
          <div className="text-center mb-12">
            <h2 className="text-white text-3xl md:text-4xl font-bold leading-tight tracking-[-0.015em]">
              Built for Analysts. Scalable for Quants.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            <div className="p-8 bg-white/5 rounded-xl border border-white/10 h-full flex flex-col">
              <h3 className="text-xl font-bold mb-4 text-white">For the Modern Analyst &amp; Investor</h3>
              <p className="text-white/70 mb-6 flex-grow">
                Get the power of a Bloomberg terminal with the intuitive feel of a modern web app. A clean, customizable dashboard gives you all the intelligence you need, without the clutter.
              </p>
              <div className="bg-black/50 p-6 rounded-lg h-48 flex items-center justify-center border border-purple-500/20">
                <div className="text-center">
                  <TrendingUp className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  <p className="text-purple-400 text-sm">Sleek Dashboard UI</p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-white/5 rounded-xl border border-white/10 h-full flex flex-col">
              <h3 className="text-xl font-bold mb-4 text-white">For the Quant &amp; HFT Firm</h3>
              <p className="text-white/70 mb-6 flex-grow">
                The engine, exposed. Access our data and models via a comprehensive, low-latency API. Integrate our sentiment scores and forecasting data directly into your own trading algorithms.
              </p>
              <div className="bg-black/50 p-4 rounded-lg h-48 font-mono text-sm text-green-400 overflow-hidden border border-purple-500/20">
                <p className="text-purple-400">import <span className="text-sky-400">uptrade</span></p>
                <p className="mt-2"><span className="text-sky-400">client</span> = <span className="text-purple-400">uptrade</span>.Client(</p>
                <p className="ml-4">api_key=<span className="text-yellow-400">"your_key"</span></p>
                <p>)</p>
                <p className="mt-2"><span className="text-sky-400">sentiment</span> = <span className="text-purple-400">client</span>.get_sentiment(</p>
                <p className="ml-4"><span className="text-yellow-400">"TSLA"</span></p>
                <p>)</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] md:text-5xl">
              Your Alpha is Waiting.
            </h2>
            <p className="text-white/70 text-base md:text-lg font-normal leading-normal mt-6">
              Stop switching tabs. Stop analyzing stale data. Stop guessing. Sign up for the platform that's built for the future of finance.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <button 
                onClick={() => navigate('/dashboard')}
                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-gradient-purple text-white text-base font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity"
              >
                <span className="truncate">Get Started for Free</span>
              </button>
              <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-white/10 text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-white/20 transition-colors">
                <span className="truncate">Request Enterprise Demo</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20">
        <div className="container mx-auto px-4 md:px-10 lg:px-20 py-8 text-center text-sm text-white/50">
          © 2024 Uptrade. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
