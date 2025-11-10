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
    <div className="min-h-screen bg-gradient-to-br from-[#1A0537] via-[#221022] to-[#0D0219]">
      {/* Enhanced Sidebar - Corona Inspired */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-[#221022] to-[#1A0537] border-r border-white/10 shadow-xl">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-6 border-b border-white/10 bg-accent-purple/10">
            <h1 className="text-2xl font-bold text-accent-purple">UpTrade AI</h1>
          </div>

          {/* Profile Section - Corona Style */}
          <div className="p-4 border-b border-white/10">
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all duration-200 group"
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-purple flex items-center justify-center shadow-lg">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-status-success rounded-full border-2 border-[#221022]" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-white group-hover:text-accent-purple transition-colors">Premium User</p>
                  <p className="text-xs text-white/60">trader@uptrade.ai</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-white/60 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#1A0537] border border-white/10 rounded-xl shadow-xl overflow-hidden z-10">
                  <a href="/settings" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors group">
                    <Settings className="w-4 h-4 text-white/60 group-hover:text-accent-purple transition-colors" />
                    <span className="text-sm text-white/80 group-hover:text-white transition-colors">Settings</span>
                  </a>
                  <a href="/profile" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors group">
                    <User className="w-4 h-4 text-white/60 group-hover:text-accent-purple transition-colors" />
                    <span className="text-sm text-white/80 group-hover:text-white transition-colors">Profile</span>
                  </a>
                  <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors group border-t border-white/10">
                    <LogOut className="w-4 h-4 text-white/60 group-hover:text-status-danger transition-colors" />
                    <span className="text-sm text-white/80 group-hover:text-status-danger transition-colors">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-thin">
            {/* Navigation Category Label */}
            <div className="px-4 mb-3">
              <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">Navigation</span>
            </div>

            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group relative overflow-hidden ${
                    isActive
                      ? 'bg-gradient-purple text-white shadow-lg'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 mr-3 transition-transform duration-200 relative z-10`} />
                  <span className="relative z-10">{item.name}</span>
                </Link>
              );
            })}

            {/* More Section */}
            <div className="px-4 mt-6 mb-3">
              <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">More</span>
            </div>

            <a href="/documentation" className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-all duration-200 group">
              <FileText className="w-5 h-5 mr-3 transition-transform" />
              Documentation
            </a>
          </nav>

          {/* Footer with Version */}
          <div className="p-4 border-t border-white/10 bg-accent-purple/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/60">UpTrade AI</span>
              <span className="text-xs px-2 py-0.5 bg-gradient-purple rounded-full text-white font-semibold shadow-lg">PRO</span>
            </div>
            <p className="text-xs text-white/40">Version 1.0.0</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pl-64">
        {/* Top Navbar */}
        <div className="sticky top-0 z-40 bg-[#1A0537]/95 backdrop-blur-xl border-b border-white/10 shadow-xl">
          <div className="px-8 py-4 flex items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                <input 
                  type="text" 
                  placeholder="Search stocks, news, or filings..." 
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/30 transition-all outline-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 ml-6">
              <button className="relative w-10 h-10 rounded-lg hover:bg-white/5 transition-colors flex items-center justify-center group">
                <Bell className="w-5 h-5 text-white/60 group-hover:text-accent-purple transition-colors" />
                <div className="absolute top-2 right-2 w-2 h-2 bg-status-danger rounded-full animate-pulse" />
              </button>
              
              <div className="flex items-center gap-2 px-4 py-2 bg-accent-purple/10 border border-accent-purple/30 rounded-lg">
                <div className="w-2 h-2 bg-status-success rounded-full animate-pulse" />
                <span className="text-sm font-medium text-accent-purple">Markets Open</span>
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
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-purple text-white rounded-full shadow-lg flex items-center justify-center z-40 group relative overflow-hidden hover:shadow-xl transition-all duration-200"
          title="Open AI Assistant"
        >
          <Sparkles className="w-7 h-7 relative z-10 transition-transform duration-200" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-status-success rounded-full animate-pulse shadow-lg" />
        </button>
      )}

      {/* Floating AI Assistant */}
      {showAI && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-40 transition-all duration-200"
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
