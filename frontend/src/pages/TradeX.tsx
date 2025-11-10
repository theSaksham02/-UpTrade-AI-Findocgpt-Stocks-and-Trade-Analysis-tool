/**
 * TradeX (Pro) - Compare X
 * Your alpha discovery tool for asymmetric opportunities
 */
import { TrendingUp, BarChart3, ArrowRight } from 'lucide-react';

export default function TradeX() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-accent-purple/10 rounded-lg">
              <TrendingUp className="w-8 h-8 text-accent-purple" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-text-primary">TradeX</h1>
              <p className="text-text-muted">Compare X - Your Alpha Discovery Tool</p>
            </div>
          </div>
          <div className="inline-block px-4 py-2 bg-accent-purple/20 text-accent-purple border border-accent-purple/30 rounded-full text-sm font-semibold">
            PRO Feature
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-purple-dark rounded-xl p-12 mb-12 border border-accent-purple/20">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold text-white mb-4">
              Find Your Asymmetric Edge
            </h2>
            <p className="text-white/80 text-lg mb-6">
              Stack any two assets against thousands of metrics—from standard fundamentals to our proprietary, real-time sentiment scores. Uncover asymmetric opportunities and hidden correlations.
            </p>
            <div className="flex gap-4">
              <button className="btn-premium">
                <span>Start Comparing</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
                Watch Demo
              </button>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card-premium">
            <BarChart3 className="w-10 h-10 text-accent-purple mb-4" />
            <h3 className="text-xl font-bold text-text-primary mb-2">
              Multi-Asset Comparison
            </h3>
            <p className="text-text-secondary">
              Compare stocks, ETFs, crypto, and commodities side-by-side with real-time data.
            </p>
          </div>

          <div className="card-premium">
            <TrendingUp className="w-10 h-10 text-accent-purple mb-4" />
            <h3 className="text-xl font-bold text-text-primary mb-2">
              Cumulative Returns
            </h3>
            <p className="text-text-secondary">
              Analyze historical performance and volatility patterns across different timeframes.
            </p>
          </div>

          <div className="card-premium">
            <BarChart3 className="w-10 h-10 text-accent-purple mb-4" />
            <h3 className="text-xl font-bold text-text-primary mb-2">
              Sentiment Scores
            </h3>
            <p className="text-text-secondary">
              Our proprietary AI-driven sentiment analysis for each asset in real-time.
            </p>
          </div>
        </div>

        {/* Coming Soon Message */}
        <div className="bg-primary-surface border border-border rounded-xl p-12 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-accent-purple/10 rounded-full mb-6">
              <TrendingUp className="w-10 h-10 text-accent-purple" />
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-4">
              TradeX is Coming Soon
            </h3>
            <p className="text-text-secondary mb-6">
              We're putting the finishing touches on our advanced comparison engine. Join the waitlist to get early access and exclusive beta features.
            </p>
            <button className="btn-premium">
              <span>Join Waitlist</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Preview Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-primary-surface border border-border rounded-lg p-6">
            <h4 className="text-lg font-semibold text-text-primary mb-3">
              What's Included in TradeX Pro:
            </h4>
            <ul className="space-y-2 text-text-secondary">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent-purple rounded-full"></span>
                Unlimited asset comparisons
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent-purple rounded-full"></span>
                Real-time sentiment analysis
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent-purple rounded-full"></span>
                Advanced correlation metrics
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent-purple rounded-full"></span>
                Historical volatility analysis
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent-purple rounded-full"></span>
                Export to CSV/PDF
              </li>
            </ul>
          </div>

          <div className="bg-primary-surface border border-border rounded-lg p-6">
            <h4 className="text-lg font-semibold text-text-primary mb-3">
              Early Access Benefits:
            </h4>
            <ul className="space-y-2 text-text-secondary">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-status-success rounded-full"></span>
                30% lifetime discount
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-status-success rounded-full"></span>
                Priority feature requests
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-status-success rounded-full"></span>
                Dedicated support channel
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-status-success rounded-full"></span>
                Beta feature access
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-status-success rounded-full"></span>
                Exclusive webinars
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
