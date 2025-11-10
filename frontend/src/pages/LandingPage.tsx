/**
 * Landing Page - UpTrade AI
 * Main entry point with navigation to Dashboard and features
 */
import { ArrowRight, TrendingUp, BarChart3, Zap, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      id: 'dashboard',
      title: 'UpTrade AI Dashboard',
      description: 'Complete trading command center with real-time analytics, portfolio tracking, and market insights.',
      icon: TrendingUp,
      route: '/dashboard',
      color: 'purple'
    },
    {
      id: 'tradex',
      title: 'TradeX (Pro)',
      description: 'Compare multiple tickers side-by-side with cumulative returns and volatility analysis.',
      icon: BarChart3,
      route: '/tradex',
      color: 'purple',
      badge: 'Pro'
    },
    {
      id: 'visualx',
      title: 'VisualX (Pro)',
      description: 'Estimate social and news sentiment influence on returns with advanced visualization.',
      icon: FileText,
      route: '/visualx',
      color: 'purple',
      badge: 'Pro'
    },
    {
      id: 'hftx',
      title: 'HFTX (Pro)',
      description: 'High-frequency trading toolkit with simulators and microstructure analytics.',
      icon: Zap,
      route: '/hftx',
      color: 'purple',
      badge: 'Coming Soon'
    },
  ];

  return (
    <div className="min-h-screen bg-primary-bg relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-bg via-primary-surface to-primary-bg opacity-50" />
      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.1) 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-block mb-4 px-4 py-2 bg-accent-purple/10 border border-accent-purple/30 rounded-full">
            <span className="text-accent-purple font-semibold text-sm">Professional Trading Platform</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-text-primary mb-6">
            UpTrade AI
          </h1>
          
          <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto mb-8 leading-relaxed">
            AI-powered financial document analysis and market insights.
            <br />
            Premium dashboards, instant Q&A with sources, and investor-grade analytics.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="px-4 py-2 bg-primary-surface border border-border rounded-lg">
              <span className="text-text-secondary text-sm">✨ New Flash Features</span>
            </div>
            <div className="px-4 py-2 bg-status-success/10 border border-status-success/30 rounded-lg">
              <span className="text-status-success text-sm font-semibold">99.9% Uptime</span>
            </div>
            <div className="px-4 py-2 bg-accent-purple/10 border border-accent-purple/30 rounded-lg">
              <span className="text-accent-purple text-sm font-semibold">95% Q&A Accuracy</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-purple text-white text-lg font-semibold rounded-lg shadow-xl hover:shadow-2xl transition-all duration-200"
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-text-primary mb-12">
            Professional Trading Suite
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.id}
                  onClick={() => navigate(feature.route)}
                  className="group relative bg-primary-surface border border-border rounded-lg p-8 cursor-pointer transition-all duration-200 hover:border-accent-purple/50 hover:shadow-xl"
                >
                  {/* Icon */}
                  <div className="mb-6 inline-block p-4 bg-accent-purple/10 rounded-lg">
                    <Icon className="w-8 h-8 text-accent-purple" />
                  </div>

                  {/* Title and Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-2xl font-bold text-text-primary group-hover:text-accent-purple transition-colors">
                      {feature.title}
                    </h3>
                    {feature.badge && (
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        feature.badge === 'Pro' 
                          ? 'bg-accent-purple/20 text-accent-purple border border-accent-purple/30'
                          : 'bg-status-warning/20 text-status-warning border border-status-warning/30'
                      }`}>
                        {feature.badge}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-text-secondary leading-relaxed mb-4">
                    {feature.description}
                  </p>

                  {/* Arrow */}
                  <div className="flex items-center text-accent-purple font-semibold group-hover:gap-2 transition-all duration-200">
                    <span>Open</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-200" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats Section */}
        <div className="max-w-6xl mx-auto mt-20">
          <div className="bg-primary-surface border border-border rounded-lg p-8">
            <h3 className="text-2xl font-bold text-center text-text-primary mb-8">
              Trusted by Professional Traders
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-accent-purple mb-2">95%</div>
                <div className="text-text-secondary text-sm">Q&A Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-accent-purple mb-2">2.3s</div>
                <div className="text-text-secondary text-sm">Median Latency</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-accent-purple mb-2">361</div>
                <div className="text-text-secondary text-sm">Documents</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-accent-purple mb-2">99.9%</div>
                <div className="text-text-secondary text-sm">Uptime</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-20 text-text-muted text-sm">
          <p>© 2024 UpTrade AI. Professional Trading Platform.</p>
        </div>
      </div>
    </div>
  );
}
