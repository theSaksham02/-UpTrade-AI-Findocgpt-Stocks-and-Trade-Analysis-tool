/**
 * VisualX (Pro) - Decode the Market's True Pulse
 * Real-time sentiment analysis and narrative detection
 */
import { useNavigate } from 'react-router-dom';
import { Menu, Activity, MessageSquare, Bell, Users, Share2, TrendingUp, TrendingDown } from 'lucide-react';

export default function VisualX() {
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
            <svg className="h-6 w-6 text-accent-purple" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2.5L2.5 12L12 21.5L21.5 12L12 2.5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              <path d="M15 9L9 15" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              <path d="M9 9L15 15" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em]">visualX</h2>
          </div>
          <div className="hidden md:flex items-center gap-9">
            <a className="text-white/80 hover:text-white text-sm font-medium leading-normal transition-colors cursor-pointer" onClick={() => navigate('/')}>Home</a>
            <a className="text-white/80 hover:text-white text-sm font-medium leading-normal transition-colors cursor-pointer" onClick={() => navigate('/dashboard')}>Dashboard</a>
            <a className="text-white/80 hover:text-white text-sm font-medium leading-normal transition-colors cursor-pointer" onClick={() => navigate('/tradex')}>TradeX</a>
            <a className="text-white/80 hover:text-white text-sm font-medium leading-normal transition-colors cursor-pointer" onClick={() => navigate('/portfolio')}>TradeSphere</a>
          </div>
          <div className="hidden md:flex gap-2">
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-accent-purple text-white text-sm font-bold leading-normal tracking-[0.015em] hover:brightness-110 transition-all duration-300"
            >
              <span className="truncate">Experience visualX Now</span>
            </button>
            <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-transparent border border-white text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-white/10 transition-colors">
              <span className="truncate">Learn More</span>
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
        {/* Hero Section with Animated Network */}
        <section className="min-h-[calc(100vh-69px)] flex flex-col items-center justify-center text-center py-20 relative">
          {/* Rotating Arcs Background */}
          <div className="absolute inset-0 -top-20 -z-10 flex items-center justify-center opacity-20">
            <div className="relative w-full max-w-4xl aspect-square">
              <svg className="absolute inset-0 w-full h-full animate-pulse-slow" fill="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="48" stroke="url(#gradient-1)" strokeDasharray="2 4" strokeLinecap="round" strokeWidth="1" />
                <defs>
                  <linearGradient id="gradient-1" x1="0%" x2="100%" y1="0%" y2="0%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
              <svg className="absolute inset-0 w-full h-full animate-pulse-slow" style={{ animationDelay: '1s' }} fill="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="40" stroke="url(#gradient-2)" strokeDasharray="4 2" strokeLinecap="round" strokeWidth="1" />
                <defs>
                  <linearGradient id="gradient-2" x1="0%" x2="100%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          <div className="max-w-4xl flex flex-col items-center gap-6">
            <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] md:text-6xl">
              visualX: Decode the Market's True Pulse.
            </h1>
            <h2 className="text-white/80 text-base font-normal leading-normal md:text-xl">
              Beyond the headlines. Beyond the noise. visualX reveals the real-time market narrative and sentiment that drives price action.
            </h2>
            <div className="mt-4 flex flex-wrap gap-3 justify-center">
              <button 
                onClick={() => navigate('/dashboard')}
                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-accent-purple text-white text-base font-bold leading-normal tracking-[0.015em] hover:brightness-110 transition-all duration-300"
              >
                <span className="truncate">Experience visualX Now</span>
              </button>
              <button 
                onClick={() => navigate('/')}
                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-transparent border border-white text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-white/10 transition-colors"
              >
                <span className="truncate">Learn More About Uptrade's AI</span>
              </button>
            </div>
          </div>

          {/* Sentiment Network Visualization */}
          <div className="mt-16 w-full max-w-5xl h-96 relative bg-black/30 rounded-xl border border-white/10 flex items-center justify-center p-4 overflow-hidden">
            <div className="absolute inset-0 w-full h-full">
              <svg className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line className="stroke-current text-white/10 animate-pulse-slow" strokeDasharray="4 4" strokeWidth="1" x1="20%" x2="50%" y1="20%" y2="50%" />
                <line className="stroke-current text-white/10 animate-pulse-slow" style={{ animationDelay: '0.5s' }} strokeDasharray="4 4" strokeWidth="1" x1="80%" x2="50%" y1="30%" y2="50%" />
                <line className="stroke-current text-white/10 animate-pulse-slow" style={{ animationDelay: '1s' }} strokeDasharray="4 4" strokeWidth="1" x1="30%" x2="50%" y1="80%" y2="50%" />
                <line className="stroke-current text-white/10 animate-pulse-slow" strokeDasharray="4 4" strokeWidth="1" x1="60%" x2="50%" y1="15%" y2="50%" />
                <line className="stroke-current text-white/10 animate-pulse-slow" style={{ animationDelay: '0.5s' }} strokeDasharray="4 4" strokeWidth="1" x1="75%" x2="50%" y1="75%" y2="50%" />
                <circle className="fill-current text-white/20 animate-pulse-slow" cx="20%" cy="20%" r="6" />
                <circle className="fill-current text-white/20 animate-pulse-slow" style={{ animationDelay: '0.5s' }} cx="80%" cy="30%" r="8" />
                <circle className="fill-current text-white/20 animate-pulse-slow" style={{ animationDelay: '1s' }} cx="30%" cy="80%" r="5" />
                <circle className="fill-current text-white/20 animate-pulse-slow" cx="60%" cy="15%" r="7" />
                <circle className="fill-current text-white/20 animate-pulse-slow" style={{ animationDelay: '0.5s' }} cx="75%" cy="75%" r="9" />
                <circle className="fill-current text-accent-purple/80" cx="50%" cy="50%" r="20" />
              </svg>
              
              {/* Floating Sentiment Indicators */}
              <div className="absolute top-1/4 left-1/4 animate-pulse-slow">
                <div className="flex items-center gap-1 bg-green-500/80 text-white text-xs px-2 py-1 rounded-full">
                  <span>+0.85</span>
                  <TrendingUp className="w-3 h-3" />
                </div>
              </div>
              <div className="absolute top-1/3 right-1/4 animate-pulse-slow" style={{ animationDelay: '1.5s' }}>
                <div className="flex items-center gap-1 bg-red-500/80 text-white text-xs px-2 py-1 rounded-full">
                  <span>-1.20</span>
                  <TrendingDown className="w-3 h-3" />
                </div>
              </div>
              <div className="absolute bottom-1/4 left-1/3 animate-pulse-slow" style={{ animationDelay: '2.5s' }}>
                <div className="flex items-center gap-1 bg-green-500/80 text-white text-xs px-2 py-1 rounded-full">
                  <span>+2.15</span>
                  <TrendingUp className="w-3 h-3" />
                </div>
              </div>
            </div>

            {/* Central Sentiment Score */}
            <div className="animate-pulse-slow rounded-full p-2">
              <div className="bg-accent-purple/30 w-32 h-32 rounded-full flex flex-col items-center justify-center border-2 border-accent-purple">
                <span className="text-3xl font-bold text-white">+1.42</span>
                <span className="text-xs text-white/70">Live Sentiment</span>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-20 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-white text-3xl md:text-4xl font-bold leading-tight tracking-[-0.015em]">
              Why News Feeds Aren't Enough.
            </h2>
            <p className="text-white/70 text-base md:text-lg font-normal leading-normal mt-6">
              Traditional news feeds provide a fragmented view. They report events, but miss the critical context: the collective emotional impact of the narrative, its direct influence on specific stocks, and the subtle shifts in market perception that signal major trend changes.
            </p>
          </div>
        </section>

        {/* Solution Section */}
        <section className="py-20 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-white text-3xl md:text-4xl font-bold leading-tight tracking-[-0.015em]">
              AI-Powered Sentiment, In Real-Time.
            </h2>
            <p className="text-white/70 text-base md:text-lg font-normal leading-normal mt-6">
              visualX uses advanced NLP models to analyze millions of global news articles, social media discussions, and analyst reports, transforming unstructured text into precise, actionable sentiment scores and narrative trends that you can trade on.
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-white/5 p-6 rounded-xl border border-white/10 text-center flex flex-col items-center group hover:bg-white/10 hover:border-accent-purple transition-all duration-300">
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-accent-purple/20 mb-4 transition-all duration-300 group-hover:bg-accent-purple/30 group-hover:scale-110">
                <Activity className="w-6 h-6 text-accent-purple" />
              </div>
              <h3 className="text-lg font-bold">Real-time Sentiment Stream</h3>
            </div>

            <div className="bg-white/5 p-6 rounded-xl border border-white/10 text-center flex flex-col items-center group hover:bg-white/10 hover:border-accent-purple transition-all duration-300">
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-accent-purple/20 mb-4 transition-all duration-300 group-hover:bg-accent-purple/30 group-hover:scale-110">
                <MessageSquare className="w-6 h-6 text-accent-purple" />
              </div>
              <h3 className="text-lg font-bold">Narrative Detection</h3>
            </div>

            <div className="bg-white/5 p-6 rounded-xl border border-white/10 text-center flex flex-col items-center group hover:bg-white/10 hover:border-accent-purple transition-all duration-300">
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-accent-purple/20 mb-4 transition-all duration-300 group-hover:bg-accent-purple/30 group-hover:scale-110">
                <Bell className="w-6 h-6 text-accent-purple" />
              </div>
              <h3 className="text-lg font-bold">Sentiment Volatility Alerts</h3>
            </div>

            <div className="bg-white/5 p-6 rounded-xl border border-white/10 text-center flex flex-col items-center group hover:bg-white/10 hover:border-accent-purple transition-all duration-300">
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-accent-purple/20 mb-4 transition-all duration-300 group-hover:bg-accent-purple/30 group-hover:scale-110">
                <Users className="w-6 h-6 text-accent-purple" />
              </div>
              <h3 className="text-lg font-bold">Correlation Overlay</h3>
            </div>

            <div className="bg-white/5 p-6 rounded-xl border border-white/10 text-center flex flex-col items-center group hover:bg-white/10 hover:border-accent-purple transition-all duration-300">
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-accent-purple/20 mb-4 transition-all duration-300 group-hover:bg-accent-purple/30 group-hover:scale-110">
                <Share2 className="w-6 h-6 text-accent-purple" />
              </div>
              <h3 className="text-lg font-bold">Source Attribution</h3>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20">
          <div className="text-center mb-12">
            <h2 className="text-white text-3xl md:text-4xl font-bold leading-tight tracking-[-0.015em]">
              Anticipate Shifts. Minimize Risk.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="p-8 bg-white/5 rounded-xl border border-white/10 h-full text-center">
              <h3 className="text-xl font-bold mb-4">Pre-emptive Trading</h3>
              <p className="text-white/70">
                Identify market-moving narratives before they hit the mainstream, giving you a critical time advantage.
              </p>
            </div>

            <div className="p-8 bg-white/5 rounded-xl border border-white/10 h-full text-center">
              <h3 className="text-xl font-bold mb-4">Risk Mitigation</h3>
              <p className="text-white/70">
                Detect negative sentiment spikes and narrative decay to protect your portfolio from unforeseen downturns.
              </p>
            </div>

            <div className="p-8 bg-white/5 rounded-xl border border-white/10 h-full text-center">
              <h3 className="text-xl font-bold mb-4">Strategic Entry/Exit Points</h3>
              <p className="text-white/70">
                Use sentiment momentum and volatility data to time your trades with greater precision and confidence.
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] md:text-5xl">
              Your Edge is Waiting.
            </h2>
            <p className="text-white/70 text-base md:text-lg font-normal leading-normal mt-6">
              Stop reacting to old news. Decode the market's true pulse and start trading the narrative. Experience the future of financial analysis today.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <button 
                onClick={() => navigate('/dashboard')}
                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-accent-purple text-white text-base font-bold leading-normal tracking-[0.015em] hover:brightness-110 transition-all duration-300"
              >
                <span className="truncate">Experience visualX Now</span>
              </button>
              <button 
                onClick={() => navigate('/')}
                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-transparent border border-white text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-white/10 transition-colors"
              >
                <span className="truncate">Learn More About Uptrade's AI</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20">
        <div className="container mx-auto px-4 md:px-10 lg:px-20 py-8 text-center text-sm text-white/50">
          © 2024 visualX. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
