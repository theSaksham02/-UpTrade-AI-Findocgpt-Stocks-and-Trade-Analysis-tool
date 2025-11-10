/**
 * TradeX (Pro) - Uncover Unseen Opportunities
 * AI-powered multi-factor comparison engine
 */
import { useNavigate } from 'react-router-dom';
import { Menu, ArrowLeftRight, TrendingUp, Shield, LayoutDashboard } from 'lucide-react';

export default function TradeX() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full overflow-x-hidden min-h-screen">
      {/* Background Layers */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#1A0537] via-[#221022] to-[#0D0219] -z-10" />
      <div 
        className="absolute top-0 left-0 w-full h-full opacity-5 -z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

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
            <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em]">TradeX</h2>
          </div>
          <div className="hidden md:flex items-center gap-9">
            <a className="text-white/80 hover:text-white text-sm font-medium leading-normal transition-colors cursor-pointer" onClick={() => navigate('/')}>Home</a>
            <a className="text-white/80 hover:text-white text-sm font-medium leading-normal transition-colors cursor-pointer" onClick={() => navigate('/dashboard')}>Dashboard</a>
            <a className="text-white/80 hover:text-white text-sm font-medium leading-normal transition-colors cursor-pointer" onClick={() => navigate('/visualx')}>VisualX</a>
            <a className="text-white/80 hover:text-white text-sm font-medium leading-normal transition-colors cursor-pointer" onClick={() => navigate('/portfolio')}>TradeSphere</a>
          </div>
          <div className="hidden md:flex gap-2">
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-gradient-purple text-white text-sm font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity"
            >
              <span className="truncate">Start Comparing</span>
            </button>
            <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-transparent border border-white text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-white/10 transition-colors">
              <span className="truncate">Explore Pro</span>
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

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-10 lg:px-20">
        {/* Hero Section */}
        <section className="min-h-[calc(100vh-69px)] flex flex-col items-center justify-center text-center py-20">
          <div className="max-w-4xl flex flex-col items-center gap-6">
            <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] md:text-6xl">
              TradeX: Uncover Unseen Opportunities.
            </h1>
            <h2 className="text-white/80 text-base font-normal leading-normal md:text-xl max-w-3xl">
              Go beyond basic P/E ratios. TradeX provides an AI-powered, multi-factor comparison engine for strategic alpha discovery.
            </h2>
            <div className="mt-8 w-full max-w-3xl aspect-video bg-black/30 rounded-xl border border-white/10 p-4 flex items-center justify-center">
              <p className="text-white/40">Chart visualization coming soon</p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <button 
                onClick={() => navigate('/dashboard')}
                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-gradient-purple text-white text-base font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity"
              >
                <span className="truncate">Start Comparing with TradeX</span>
              </button>
              <button 
                onClick={() => navigate('/')}
                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-transparent border border-white text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-white/10 transition-colors"
              >
                <span className="truncate">Explore Uptrade Pro</span>
              </button>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-20 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-white text-3xl md:text-4xl font-bold leading-tight tracking-[-0.015em]">
              Why Old Metrics Fall Short.
            </h2>
            <p className="text-white/70 text-base md:text-lg font-normal leading-normal mt-6">
              Traditional stock comparison tools only scratch the surface, missing real-time sentiment, narrative shifts, and complex fundamental relationships.
            </p>
          </div>
        </section>

        {/* Solution Section */}
        <section className="py-20 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-white text-3xl md:text-4xl font-bold leading-tight tracking-[-0.015em]">
              The AI-Driven Advantage.
            </h2>
            <p className="text-white/70 text-base md:text-lg font-normal leading-normal mt-6">
              TradeX integrates real-time market data, deep fundamental analysis, and proprietary AI sentiment scores for a 360-degree view.
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="relative group bg-white/5 p-8 rounded-xl border border-white/10 text-center flex flex-col items-center transition-all duration-300 hover:border-accent-purple hover:bg-accent-purple/10 hover:-translate-y-2">
              <div className="absolute top-0 left-0 w-full h-full rounded-xl bg-gradient-to-br from-accent-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-br from-accent-purple/20 to-white/10 mb-6 border border-white/10 shadow-lg">
                <ArrowLeftRight className="w-8 h-8 text-accent-purple" />
              </div>
              <h3 className="text-lg font-bold text-white z-10">Multi-Factor Comparison</h3>
            </div>

            <div className="relative group bg-white/5 p-8 rounded-xl border border-white/10 text-center flex flex-col items-center transition-all duration-300 hover:border-accent-purple hover:bg-accent-purple/10 hover:-translate-y-2">
              <div className="absolute top-0 left-0 w-full h-full rounded-xl bg-gradient-to-br from-accent-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-br from-accent-purple/20 to-white/10 mb-6 border border-white/10 shadow-lg">
                <TrendingUp className="w-8 h-8 text-accent-purple" />
              </div>
              <h3 className="text-lg font-bold text-white z-10">Narrative-Driven Scoring</h3>
            </div>

            <div className="relative group bg-white/5 p-8 rounded-xl border border-white/10 text-center flex flex-col items-center transition-all duration-300 hover:border-accent-purple hover:bg-accent-purple/10 hover:-translate-y-2">
              <div className="absolute top-0 left-0 w-full h-full rounded-xl bg-gradient-to-br from-accent-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-br from-accent-purple/20 to-white/10 mb-6 border border-white/10 shadow-lg">
                <Shield className="w-8 h-8 text-accent-purple" />
              </div>
              <h3 className="text-lg font-bold text-white z-10">Risk &amp; Volatility Overlay</h3>
            </div>

            <div className="relative group bg-white/5 p-8 rounded-xl border border-white/10 text-center flex flex-col items-center transition-all duration-300 hover:border-accent-purple hover:bg-accent-purple/10 hover:-translate-y-2">
              <div className="absolute top-0 left-0 w-full h-full rounded-xl bg-gradient-to-br from-accent-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-br from-accent-purple/20 to-white/10 mb-6 border border-white/10 shadow-lg">
                <LayoutDashboard className="w-8 h-8 text-accent-purple" />
              </div>
              <h3 className="text-lg font-bold text-white z-10">Customizable Dashboards</h3>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-white text-3xl md:text-4xl font-bold leading-tight tracking-[-0.015em]">
              Make Smarter Decisions, Faster.
            </h2>
            <p className="text-white/70 text-base md:text-lg font-normal leading-normal mt-6">
              Validate Investment Theses, Identify Arbitrage Opportunities, Optimize Portfolio Allocation.
            </p>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <button 
                onClick={() => navigate('/dashboard')}
                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-[#8B5CF6] text-white text-base font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity"
              >
                <span className="truncate">Start Comparing with TradeX</span>
              </button>
              <button 
                onClick={() => navigate('/')}
                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-transparent border border-white text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-white/10 transition-colors"
              >
                <span className="truncate">Explore Uptrade Pro</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20">
        <div className="container mx-auto px-4 md:px-10 lg:px-20 py-8 text-center text-sm text-white/50">
          © 2024 TradeX. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
