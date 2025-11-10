/**
 * Landing Page - UpTrade AI
 * The Terminal, Reimagined by AI
 */
import { useNavigate } from 'react-router-dom';
import { Menu, Brain, Radio, TrendingUp, Activity } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full overflow-x-hidden">
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
