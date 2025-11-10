/**
 * TradeX (Pro) - Uncover Unseen Opportunities
 * AI-powered multi-factor comparison engine with live entity extraction
 */
import { useNavigate } from 'react-router-dom';
import { Menu, ArrowLeftRight, TrendingUp, Shield, LayoutDashboard, Search, Building2, DollarSign, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useCompanyAnalysis, useEntityExtraction } from '../utils/hooks';
import { LoadingSpinner } from '../components/LoadingSpinner';

export default function TradeX() {
  const navigate = useNavigate();
  const [searchSymbol, setSearchSymbol] = useState('');
  const [analysisSymbol, setAnalysisSymbol] = useState('');
  const [extractText, setExtractText] = useState('');
  
  const { data: companyData, loading: companyLoading, error: companyError } = useCompanyAnalysis(analysisSymbol);
  const { data: entityData, loading: entityLoading, refetch: refetchEntities } = useEntityExtraction(extractText);

  const handleAnalyze = () => {
    if (searchSymbol.trim()) {
      setAnalysisSymbol(searchSymbol.trim().toUpperCase());
    }
  };

  const handleExtract = () => {
    if (extractText.trim()) {
      refetchEntities();
    }
  };

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

        {/* Live Company Analysis Section */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-white text-3xl md:text-4xl font-bold leading-tight tracking-[-0.015em] mb-4">
                Try TradeX Live Analysis
              </h2>
              <p className="text-white/70 text-base md:text-lg font-normal leading-normal">
                Analyze any company with real-time AI-powered insights
              </p>
            </div>

            {/* Company Search */}
            <div className="bg-white/5 p-8 rounded-xl border border-white/10 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-white/70 text-sm font-medium mb-2 block">Stock Symbol</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="text"
                      value={searchSymbol}
                      onChange={(e) => setSearchSymbol(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
                      placeholder="Enter stock symbol (e.g., AAPL, TSLA, MSFT)"
                      className="w-full pl-10 pr-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-accent-purple transition-colors"
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleAnalyze}
                    disabled={!searchSymbol.trim() || companyLoading}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-purple text-white font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {companyLoading ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="w-5 h-5" />
                        Analyze
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Company Analysis Results */}
            {companyLoading && (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" text="Analyzing company data..." />
              </div>
            )}

            {companyError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
                <p className="text-red-400">Failed to load company data. Please try again.</p>
              </div>
            )}

            {companyData && !companyLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company Overview */}
                <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-lg bg-gradient-purple flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white text-xl font-bold">{companyData.company_overview?.Name || analysisSymbol}</h3>
                      <p className="text-white/60 text-sm">{companyData.company_overview?.Sector || 'Technology'}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {companyData.company_overview?.MarketCapitalization && (
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-white/70">Market Cap</span>
                        <span className="text-white font-semibold">
                          ${(parseFloat(companyData.company_overview.MarketCapitalization) / 1e9).toFixed(2)}B
                        </span>
                      </div>
                    )}
                    {companyData.company_overview?.PERatio && (
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-white/70">P/E Ratio</span>
                        <span className="text-white font-semibold">{companyData.company_overview.PERatio}</span>
                      </div>
                    )}
                    {companyData.company_overview?.Beta && (
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-white/70">Beta</span>
                        <span className="text-white font-semibold">{companyData.company_overview.Beta}</span>
                      </div>
                    )}
                    {companyData.company_overview?.DividendYield && (
                      <div className="flex justify-between items-center py-2">
                        <span className="text-white/70">Dividend Yield</span>
                        <span className="text-white font-semibold">{(parseFloat(companyData.company_overview.DividendYield) * 100).toFixed(2)}%</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stock Quote */}
                <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center border border-green-500/30">
                      <DollarSign className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-white text-xl font-bold">Live Quote</h3>
                      <p className="text-white/60 text-sm">Real-time pricing</p>
                    </div>
                  </div>
                  
                  {companyData.stock_quote && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-white/70">Price</span>
                        <span className="text-white font-bold text-2xl">${companyData.stock_quote.price}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-white/70">Change</span>
                        <span className={`font-semibold ${companyData.stock_quote.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {companyData.stock_quote.change >= 0 ? '+' : ''}{companyData.stock_quote.change} ({companyData.stock_quote.change_percent >= 0 ? '+' : ''}{companyData.stock_quote.change_percent}%)
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-white/70">Volume</span>
                        <span className="text-white font-semibold">{companyData.stock_quote.volume?.toLocaleString() || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-white/70">Previous Close</span>
                        <span className="text-white font-semibold">${companyData.stock_quote.previous_close}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sentiment Analysis */}
                {companyData.news_sentiment && companyData.news_sentiment.articles.length > 0 && (
                  <div className="md:col-span-2 bg-white/5 p-6 rounded-xl border border-white/10">
                    <h3 className="text-white text-xl font-bold mb-4">Recent News Sentiment</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                        <div className="text-green-400 text-2xl font-bold">{companyData.news_sentiment.sentiment_analysis.positive_count}</div>
                        <div className="text-white/70 text-sm">Positive Articles</div>
                      </div>
                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                        <div className="text-red-400 text-2xl font-bold">{companyData.news_sentiment.sentiment_analysis.negative_count}</div>
                        <div className="text-white/70 text-sm">Negative Articles</div>
                      </div>
                      <div className="bg-gray-500/10 border border-gray-500/30 rounded-lg p-4">
                        <div className="text-gray-400 text-2xl font-bold">{companyData.news_sentiment.sentiment_analysis.neutral_count}</div>
                        <div className="text-white/70 text-sm">Neutral Articles</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {companyData.news_sentiment.articles.slice(0, 3).map((article: any, index: number) => (
                        <div key={index} className="bg-black/30 p-4 rounded-lg border border-white/10">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h4 className="text-white font-semibold text-sm mb-1">{article.title}</h4>
                              <p className="text-white/60 text-xs">{article.source} • {article.published_at}</p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              article.sentiment === 'positive' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                              article.sentiment === 'negative' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                              'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                            }`}>
                              {article.sentiment} ({article.sentiment_score?.toFixed(2)})
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Entity Extraction Section */}
            <div className="mt-12 bg-white/5 p-8 rounded-xl border border-white/10">
              <h3 className="text-white text-xl font-bold mb-4">AI Entity Extraction</h3>
              <p className="text-white/70 text-sm mb-6">
                Paste any financial text to extract companies, metrics, and key entities
              </p>
              
              <textarea
                value={extractText}
                onChange={(e) => setExtractText(e.target.value)}
                placeholder="Paste financial news, earnings reports, or any text containing company information..."
                className="w-full h-32 p-4 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-accent-purple transition-colors resize-none mb-4"
              />
              
              <button
                onClick={handleExtract}
                disabled={!extractText.trim() || entityLoading}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-purple text-white font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {entityLoading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Extracting...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Extract Entities
                  </>
                )}
              </button>

              {entityData && entityData.entities && entityData.entities.length > 0 && (
                <div className="mt-6 space-y-4">
                  <h4 className="text-white font-semibold">Extracted Entities:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {entityData.entities.map((entity: any, index: number) => (
                      <div key={index} className="bg-black/30 p-4 rounded-lg border border-white/10 flex items-center justify-between">
                        <div>
                          <span className="text-white font-medium">{entity.text}</span>
                          <span className="text-white/60 text-sm ml-2">({entity.type})</span>
                        </div>
                        <span className="text-accent-purple text-sm font-semibold">
                          {(entity.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
