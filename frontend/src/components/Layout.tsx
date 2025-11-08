/**
 * Layout Component - Corona Template Inspired
 * Enhanced layout with premium sidebar, profile section, and nested menus
 */
import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Briefcase, 
  LineChart, 
  Newspaper, 
  FileText,
  Activity,
  Sparkles,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Bell,
  Search
} from 'lucide-react';
import LiveTickerTape from './LiveTickerTape';
import AIAssistant from './AIAssistant';

interface LayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Market Analysis', href: '/market', icon: TrendingUp },
  { name: 'Portfolio', href: '/portfolio', icon: Briefcase },
  { name: 'Trading', href: '/trading', icon: Activity },
  { name: 'Forecasting', href: '/forecasting', icon: LineChart },
  { name: 'News & Sentiment', href: '/news', icon: Newspaper },
  { name: 'Research', href: '/research', icon: FileText },
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [showAI, setShowAI] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-primary-bg">
      {/* Enhanced Sidebar - Corona Inspired */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-gradient-surface border-r border-border/50 shadow-premium">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-6 border-b border-border/30 bg-gradient-to-r from-accent-purple/10 to-accent-blue/10">
            <h1 className="text-2xl font-bold text-gradient animate-shimmer">UpTrade AI</h1>
          </div>

          {/* Profile Section - Corona Style */}
          <div className="p-4 border-b border-border/30">
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-primary-hover transition-all duration-300 group"
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-blue flex items-center justify-center shadow-glow">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-status-success rounded-full border-2 border-primary-surface" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-text-primary group-hover:text-gradient transition-colors">Premium User</p>
                  <p className="text-xs text-text-muted">trader@uptrade.ai</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-300 ${showProfileMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-primary-surface border border-border/50 rounded-xl shadow-premium overflow-hidden z-10">
                  <a href="/settings" className="flex items-center gap-3 px-4 py-3 hover:bg-primary-hover transition-colors group">
                    <Settings className="w-4 h-4 text-text-muted group-hover:text-accent-blue transition-colors" />
                    <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">Settings</span>
                  </a>
                  <a href="/profile" className="flex items-center gap-3 px-4 py-3 hover:bg-primary-hover transition-colors group">
                    <User className="w-4 h-4 text-text-muted group-hover:text-accent-purple transition-colors" />
                    <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">Profile</span>
                  </a>
                  <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary-hover transition-colors group border-t border-border/30">
                    <LogOut className="w-4 h-4 text-text-muted group-hover:text-status-danger transition-colors" />
                    <span className="text-sm text-text-secondary group-hover:text-status-danger transition-colors">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-thin">
            {/* Navigation Category Label */}
            <div className="px-4 mb-3">
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Navigation</span>
            </div>

            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 group relative overflow-hidden ${
                    isActive
                      ? 'bg-gradient-blue text-white shadow-premium'
                      : 'text-text-secondary hover:bg-primary-hover hover:text-text-primary hover:shadow-md'
                  }`}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-white opacity-10 animate-pulse" />
                  )}
                  <Icon className={`w-5 h-5 mr-3 transition-transform duration-300 relative z-10 ${isActive ? '' : 'group-hover:scale-110'}`} />
                  <span className="relative z-10">{item.name}</span>
                </Link>
              );
            })}

            {/* More Section */}
            <div className="px-4 mt-6 mb-3">
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">More</span>
            </div>

            <a href="/documentation" className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-text-secondary hover:bg-primary-hover hover:text-text-primary transition-all duration-300 group">
              <FileText className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
              Documentation
            </a>
          </nav>

          {/* Footer with Version */}
          <div className="p-4 border-t border-border/30 bg-gradient-to-r from-accent-purple/5 to-accent-blue/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-text-muted">UpTrade AI</span>
              <span className="text-xs px-2 py-0.5 bg-gradient-gold rounded-full text-white font-semibold shadow-glow">PRO</span>
            </div>
            <p className="text-xs text-text-muted">Version 1.0.0</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pl-64">
        {/* Top Navbar */}
        <div className="sticky top-0 z-40 bg-primary-surface/95 backdrop-blur-xl border-b border-border/50 shadow-md">
          <div className="px-8 py-4 flex items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input 
                  type="text" 
                  placeholder="Search stocks, news, or filings..." 
                  className="search-premium w-full pl-12 pr-4 py-3"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 ml-6">
              <button className="relative w-10 h-10 rounded-lg hover:bg-primary-hover transition-colors flex items-center justify-center group">
                <Bell className="w-5 h-5 text-text-muted group-hover:text-accent-blue transition-colors" />
                <div className="absolute top-2 right-2 w-2 h-2 bg-status-danger rounded-full animate-pulse" />
              </button>
              
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-gold/10 border border-accent-gold/30 rounded-lg">
                <div className="w-2 h-2 bg-status-success rounded-full animate-pulse" />
                <span className="text-sm font-medium text-accent-gold">Markets Open</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Ticker Tape */}
        <LiveTickerTape />
        
        <div className="px-8 py-6">
          {children}
        </div>
      </main>

      {/* Floating AI Assistant Button */}
      {!showAI && (
        <button
          onClick={() => setShowAI(true)}
          className="fixed bottom-6 right-6 w-16 h-16 btn-gradient text-white rounded-full shadow-glow flex items-center justify-center z-40 group relative overflow-hidden"
          title="Open AI Assistant"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          <Sparkles className="w-7 h-7 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-status-success rounded-full animate-pulse shadow-glow" />
        </button>
      )}

      {/* Floating AI Assistant */}
      {showAI && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-40 transition-all duration-300"
            onClick={() => setShowAI(false)}
          />
          {/* AI Assistant */}
          <div className="z-50">
            <AIAssistant 
              onClose={() => setShowAI(false)} 
              isFloating={true}
            />
          </div>
        </>
      )}
    </div>
  );
}
