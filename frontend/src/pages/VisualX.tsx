/**
 * VisualX (Pro) - Real-Time Market Pulse
 * Trade the narrative with sentiment-driven insights
 */
import { Radio, TrendingUp, ArrowRight, Activity } from 'lucide-react';

export default function VisualX() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-accent-purple/10 rounded-lg">
              <Radio className="w-8 h-8 text-accent-purple" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-text-primary">VisualX</h1>
              <p className="text-text-muted">Real-Time Market Pulse & Sentiment Analysis</p>
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
              Trade the Narrative
            </h2>
            <p className="text-white/80 text-lg mb-6">
              VisualX is your real-time market pulse, processing global news and social media 24/7. It identifies emerging narratives, detects sentiment-driven volatility, and alerts you to narrative shifts before the market moves.
            </p>
            <div className="flex gap-4">
              <button className="btn-premium">
                <span>Start Monitoring</span>
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
            <Radio className="w-10 h-10 text-accent-purple mb-4" />
            <h3 className="text-xl font-bold text-text-primary mb-2">
              Real-Time Sentiment
            </h3>
            <p className="text-text-secondary">
              Monitor global news, Twitter, Reddit, and financial forums 24/7 for sentiment shifts.
            </p>
          </div>

          <div className="card-premium">
            <Activity className="w-10 h-10 text-accent-purple mb-4" />
            <h3 className="text-xl font-bold text-text-primary mb-2">
              Narrative Detection
            </h3>
            <p className="text-text-secondary">
              AI identifies emerging narratives and storylines that drive market movements.
            </p>
          </div>

          <div className="card-premium">
            <TrendingUp className="w-10 h-10 text-accent-purple mb-4" />
            <h3 className="text-xl font-bold text-text-primary mb-2">
              Volatility Alerts
            </h3>
            <p className="text-text-secondary">
              Get instant alerts when sentiment-driven volatility spikes are detected.
            </p>
          </div>
        </div>

        {/* Coming Soon Message */}
        <div className="bg-primary-surface border border-border rounded-xl p-12 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-accent-purple/10 rounded-full mb-6">
              <Radio className="w-10 h-10 text-accent-purple" />
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-4">
              VisualX is Coming Soon
            </h3>
            <p className="text-text-secondary mb-6">
              Our advanced sentiment engine is being trained on billions of data points. Join the waitlist to get early access and help shape the future of narrative trading.
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
              What's Included in VisualX Pro:
            </h4>
            <ul className="space-y-2 text-text-secondary">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent-purple rounded-full"></span>
                Real-time social sentiment tracking
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent-purple rounded-full"></span>
                News impact analysis
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent-purple rounded-full"></span>
                Narrative shift detection
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent-purple rounded-full"></span>
                Custom alert configuration
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent-purple rounded-full"></span>
                Historical sentiment data
              </li>
            </ul>
          </div>

          <div className="bg-primary-surface border border-border rounded-lg p-6">
            <h4 className="text-lg font-semibold text-text-primary mb-3">
              Data Sources Monitored:
            </h4>
            <ul className="space-y-2 text-text-secondary">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-status-success rounded-full"></span>
                Twitter/X financial community
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-status-success rounded-full"></span>
                Reddit (WallStreetBets, stocks, etc.)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-status-success rounded-full"></span>
                Financial news outlets (Bloomberg, Reuters)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-status-success rounded-full"></span>
                Earnings call transcripts
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-status-success rounded-full"></span>
                SEC filings & press releases
              </li>
            </ul>
          </div>
        </div>

        {/* Visualization Preview */}
        <div className="mt-12 bg-primary-surface border border-border rounded-xl p-8">
          <h3 className="text-2xl font-bold text-text-primary mb-6">
            Sentiment Visualization Preview
          </h3>
          <div className="bg-black/30 rounded-lg p-8 border border-accent-purple/20 min-h-[300px] flex items-center justify-center">
            <div className="text-center">
              <Activity className="w-16 h-16 text-accent-purple mx-auto mb-4 animate-pulse-slow" />
              <p className="text-text-secondary">
                Interactive sentiment charts and narrative timelines will appear here
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
