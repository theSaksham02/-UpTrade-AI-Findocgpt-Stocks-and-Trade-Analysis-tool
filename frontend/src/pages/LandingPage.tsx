import { useState, useEffect } from 'react';
import { Menu, X, TrendingUp, BarChart3, Brain, Zap, CheckCircle2, ArrowRight, Clock } from 'lucide-react';

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Calculate time remaining until launch (January 28, 2026)
  useEffect(() => {
    const calculateTimeLeft = () => {
      const launchDate = new Date('2026-01-28T00:00:00').getTime();
      const now = new Date().getTime();
      const difference = launchDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;
    
    setLoading(true);
    
    // Simulate API call (replace with actual backend endpoint)
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
      // Reset form
      setEmail('');
      setName('');
    }, 1500);
  };

  return (
    <div className="relative w-full overflow-x-hidden min-h-screen">
      {/* Background Layers */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#1A0537] via-[#221022] to-[#0D0219] -z-10" />
      <div 
        className="absolute top-0 left-0 w-full h-full opacity-5 -z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 px-4 md:px-10 lg:px-20 backdrop-blur-md bg-[#221022]/50 border-b border-white/10">
        <nav className="container mx-auto flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <svg className="h-8 w-8 text-accent-purple" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_6_535)">
                <path clipRule="evenodd" d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z" fill="currentColor" fillRule="evenodd" />
              </g>
              <defs>
                <clipPath id="clip0_6_535"><rect fill="white" height="48" width="48" /></clipPath>
              </defs>
            </svg>
            <h2 className="text-white text-2xl font-bold leading-tight tracking-[-0.015em]">UpTrade AI</h2>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-white/80 hover:text-white text-sm font-medium transition-colors">Features</a>
            <a href="#products" className="text-white/80 hover:text-white text-sm font-medium transition-colors">Products</a>
            <a href="#pricing" className="text-white/80 hover:text-white text-sm font-medium transition-colors">Pricing</a>
            <a href="#waitlist" className="px-6 py-2.5 bg-gradient-purple text-white text-sm font-bold rounded-lg hover:opacity-90 transition-opacity">
              Join Waitlist
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col gap-4">
              <a href="#features" className="text-white/80 hover:text-white text-sm font-medium transition-colors" onClick={() => setMobileMenuOpen(false)}>Features</a>
              <a href="#products" className="text-white/80 hover:text-white text-sm font-medium transition-colors" onClick={() => setMobileMenuOpen(false)}>Products</a>
              <a href="#pricing" className="text-white/80 hover:text-white text-sm font-medium transition-colors" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
              <a href="#waitlist" className="px-6 py-2.5 bg-gradient-purple text-white text-sm font-bold rounded-lg hover:opacity-90 transition-opacity text-center" onClick={() => setMobileMenuOpen(false)}>
                Join Waitlist
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-10 lg:px-20">
        {/* Hero Section */}
        <section className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center text-center py-20">
          <div className="max-w-5xl flex flex-col items-center gap-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-purple/10 border border-accent-purple/30 rounded-full">
              <Zap className="w-4 h-4 text-accent-purple" />
              <span className="text-accent-purple text-sm font-semibold">AI-Powered Financial Intelligence</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-white text-5xl md:text-7xl font-black leading-tight tracking-[-0.033em]">
              The Future of <br />
              <span className="bg-gradient-to-r from-accent-purple to-purple-400 bg-clip-text text-transparent">
                Smart Trading
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-white/70 text-lg md:text-xl font-normal leading-relaxed max-w-3xl">
              UpTrade AI combines cutting-edge artificial intelligence with real-time market data to give you the edge in financial markets. Join the waitlist for exclusive early access.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <a 
                href="#waitlist"
                className="group flex items-center justify-center gap-2 px-8 py-4 bg-gradient-purple text-white text-lg font-bold rounded-lg hover:opacity-90 transition-all duration-300 shadow-xl shadow-accent-purple/20"
              >
                <span>Join Waitlist Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a 
                href="#features"
                className="flex items-center justify-center px-8 py-4 bg-white/5 border border-white/20 text-white text-lg font-bold rounded-lg hover:bg-white/10 transition-colors"
              >
                Learn More
              </a>
            </div>

            {/* Social Proof */}
            <div className="mt-12 flex items-center gap-8 text-white/60 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span>Early Access Benefits</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32">
          <div className="text-center mb-16">
            <h2 className="text-white text-4xl md:text-5xl font-bold mb-4">
              Powerful Features
            </h2>
            <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto">
              Everything you need to make smarter trading decisions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group bg-white/5 p-8 rounded-2xl border border-white/10 hover:border-accent-purple hover:bg-white/10 transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 rounded-xl bg-gradient-purple flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-white text-xl font-bold mb-3">Real-Time Analysis</h3>
              <p className="text-white/70">
                Get instant insights on stocks, market trends, and trading opportunities powered by AI
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-white/5 p-8 rounded-2xl border border-white/10 hover:border-accent-purple hover:bg-white/10 transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 rounded-xl bg-gradient-purple flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-white text-xl font-bold mb-3">AI Sentiment Analysis</h3>
              <p className="text-white/70">
                Understand market sentiment from thousands of news sources and social media
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-white/5 p-8 rounded-2xl border border-white/10 hover:border-accent-purple hover:bg-white/10 transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 rounded-xl bg-gradient-purple flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-white text-xl font-bold mb-3">Smart Comparisons</h3>
              <p className="text-white/70">
                Compare stocks with multi-factor analysis including fundamentals, technicals, and sentiment
              </p>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section id="products" className="py-32">
          <div className="text-center mb-16">
            <h2 className="text-white text-4xl md:text-5xl font-bold mb-4">
              Our Product Suite
            </h2>
            <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto">
              Specialized tools for every trading need
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* TradeX */}
            <div className="bg-gradient-to-br from-accent-purple/20 to-transparent p-8 rounded-2xl border border-accent-purple/30 text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-white text-2xl font-bold mb-3">TradeX</h3>
              <p className="text-white/70 mb-6">
                AI-powered multi-factor comparison engine for strategic alpha discovery
              </p>
              <div className="inline-block px-4 py-2 bg-white/10 rounded-full text-sm text-white/80">
                Coming Soon
              </div>
            </div>

            {/* VisualX */}
            <div className="bg-gradient-to-br from-purple-400/20 to-transparent p-8 rounded-2xl border border-purple-400/30 text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-white text-2xl font-bold mb-3">VisualX</h3>
              <p className="text-white/70 mb-6">
                Real-time sentiment analysis and narrative detection with live AI
              </p>
              <div className="inline-block px-4 py-2 bg-white/10 rounded-full text-sm text-white/80">
                Coming Soon
              </div>
            </div>

            {/* TradeSphere */}
            <div className="bg-gradient-to-br from-blue-400/20 to-transparent p-8 rounded-2xl border border-blue-400/30 text-center">
              <div className="text-4xl mb-4">🌐</div>
              <h3 className="text-white text-2xl font-bold mb-3">TradeSphere</h3>
              <p className="text-white/70 mb-6">
                Complete portfolio management and optimization platform
              </p>
              <div className="inline-block px-4 py-2 bg-white/10 rounded-full text-sm text-white/80">
                Coming Soon
              </div>
            </div>
          </div>
        </section>

        {/* Waitlist Section */}
        <section id="waitlist" className="py-32">
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-accent-purple/10 to-transparent p-12 rounded-3xl border border-accent-purple/30">
              <div className="text-center mb-10">
                <h2 className="text-white text-4xl md:text-5xl font-bold mb-4">
                  Join the Waitlist
                </h2>
                <p className="text-white/70 text-lg">
                  Be among the first to experience the future of AI-powered trading
                </p>
              </div>

              {submitted ? (
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-8 text-center">
                  <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-white text-2xl font-bold mb-2">You're On The List!</h3>
                  <p className="text-white/70">
                    Thanks for joining! We'll notify you when UpTrade AI launches.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-white/70 text-sm font-medium mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      required
                      className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-accent-purple transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-white/70 text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      required
                      className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-accent-purple transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-8 py-4 bg-gradient-purple text-white text-lg font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-accent-purple/20"
                  >
                    {loading ? 'Joining...' : 'Join Waitlist'}
                  </button>

                  <p className="text-white/50 text-sm text-center">
                    By joining, you agree to receive updates about UpTrade AI. Unsubscribe anytime.
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* Pricing Preview Section */}
        <section id="pricing" className="py-32">
          <div className="text-center mb-16">
            <h2 className="text-white text-4xl md:text-5xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto">
              Choose the plan that's right for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
              <h3 className="text-white text-2xl font-bold mb-2">Free</h3>
              <div className="text-white text-4xl font-black mb-6">
                $0<span className="text-lg font-normal text-white/60">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-white/70">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span>Basic market data</span>
                </li>
                <li className="flex items-center gap-2 text-white/70">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span>5 stock comparisons/day</span>
                </li>
                <li className="flex items-center gap-2 text-white/70">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span>Community support</span>
                </li>
              </ul>
              <div className="text-center text-white/50 text-sm">Available at launch</div>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-accent-purple/20 to-transparent p-8 rounded-2xl border-2 border-accent-purple relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-accent-purple text-white text-sm font-bold rounded-full">
                Most Popular
              </div>
              <h3 className="text-white text-2xl font-bold mb-2">Pro</h3>
              <div className="text-white text-4xl font-black mb-6">
                $49<span className="text-lg font-normal text-white/60">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-white/70">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span>Real-time market data</span>
                </li>
                <li className="flex items-center gap-2 text-white/70">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span>Unlimited comparisons</span>
                </li>
                <li className="flex items-center gap-2 text-white/70">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span>AI sentiment analysis</span>
                </li>
                <li className="flex items-center gap-2 text-white/70">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span>Priority support</span>
                </li>
              </ul>
              <div className="text-center text-white/50 text-sm">Available at launch</div>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
              <h3 className="text-white text-2xl font-bold mb-2">Enterprise</h3>
              <div className="text-white text-4xl font-black mb-6">
                Custom
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-white/70">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span>Everything in Pro</span>
                </li>
                <li className="flex items-center gap-2 text-white/70">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span>Custom integrations</span>
                </li>
                <li className="flex items-center gap-2 text-white/70">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span>Dedicated support</span>
                </li>
                <li className="flex items-center gap-2 text-white/70">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span>API access</span>
                </li>
              </ul>
              <div className="text-center text-white/50 text-sm">Contact us</div>
            </div>
          </div>
        </section>

        {/* Countdown Timer Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-gradient-to-br from-accent-purple/20 via-purple-500/10 to-transparent p-12 rounded-3xl border-2 border-accent-purple/40 overflow-hidden">
              {/* Animated background effects */}
              <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <div className="absolute top-10 left-10 w-32 h-32 bg-accent-purple rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>

              <div className="relative z-10">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-purple/20 border border-accent-purple/40 rounded-full mb-4">
                    <Clock className="w-4 h-4 text-accent-purple" />
                    <span className="text-accent-purple text-sm font-semibold">Official Launch</span>
                  </div>
                  <h2 className="text-white text-3xl md:text-4xl font-bold mb-3">
                    We're Going Live Soon!
                  </h2>
                  <p className="text-white/70 text-lg">
                    January 28, 2026 • Be among the first to experience the future
                  </p>
                </div>

                {/* Countdown Timer */}
                <div className="grid grid-cols-4 gap-4 md:gap-6 max-w-2xl mx-auto">
                  {/* Days */}
                  <div className="bg-black/30 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-accent-purple/50 transition-all duration-300 hover:scale-105">
                    <div className="text-center">
                      <div className="text-4xl md:text-5xl font-black text-white mb-2 font-mono">
                        {String(timeLeft.days).padStart(2, '0')}
                      </div>
                      <div className="text-white/60 text-xs md:text-sm font-semibold uppercase tracking-wider">
                        Days
                      </div>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="bg-black/30 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-accent-purple/50 transition-all duration-300 hover:scale-105">
                    <div className="text-center">
                      <div className="text-4xl md:text-5xl font-black text-white mb-2 font-mono">
                        {String(timeLeft.hours).padStart(2, '0')}
                      </div>
                      <div className="text-white/60 text-xs md:text-sm font-semibold uppercase tracking-wider">
                        Hours
                      </div>
                    </div>
                  </div>

                  {/* Minutes */}
                  <div className="bg-black/30 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-accent-purple/50 transition-all duration-300 hover:scale-105">
                    <div className="text-center">
                      <div className="text-4xl md:text-5xl font-black text-white mb-2 font-mono">
                        {String(timeLeft.minutes).padStart(2, '0')}
                      </div>
                      <div className="text-white/60 text-xs md:text-sm font-semibold uppercase tracking-wider">
                        Minutes
                      </div>
                    </div>
                  </div>

                  {/* Seconds */}
                  <div className="bg-black/30 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-accent-purple/50 transition-all duration-300 hover:scale-105">
                    <div className="text-center">
                      <div className="text-4xl md:text-5xl font-black text-accent-purple mb-2 font-mono animate-pulse">
                        {String(timeLeft.seconds).padStart(2, '0')}
                      </div>
                      <div className="text-white/60 text-xs md:text-sm font-semibold uppercase tracking-wider">
                        Seconds
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA Below Timer */}
                <div className="text-center mt-10">
                  <p className="text-white/80 text-base mb-4">
                    Don't miss out! Join our waitlist for exclusive early access
                  </p>
                  <a 
                    href="#waitlist"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-purple text-white font-bold rounded-lg hover:opacity-90 transition-opacity shadow-xl shadow-accent-purple/30"
                  >
                    <span>Reserve Your Spot</span>
                    <ArrowRight className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20">
        <div className="container mx-auto px-4 md:px-10 lg:px-20 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <svg className="h-8 w-8 text-accent-purple" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_6_535)">
                    <path clipRule="evenodd" d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z" fill="currentColor" fillRule="evenodd" />
                  </g>
                  <defs>
                    <clipPath id="clip0_6_535"><rect fill="white" height="48" width="48" /></clipPath>
                  </defs>
                </svg>
                <h2 className="text-white text-xl font-bold">UpTrade AI</h2>
              </div>
              <p className="text-white/60 text-sm">
                The future of AI-powered financial intelligence
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3">Product</h3>
              <ul className="space-y-2 text-white/60 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#products" className="hover:text-white transition-colors">Products</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3">Company</h3>
              <ul className="space-y-2 text-white/60 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3">Legal</h3>
              <ul className="space-y-2 text-white/60 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center text-sm text-white/50">
            © 2025 UpTrade AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
