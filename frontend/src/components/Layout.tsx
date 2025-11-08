/**
 * Layout Component
 * Main layout wrapper with navigation
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
  Sparkles
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

  return (
    <div className="min-h-screen bg-primary-bg">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-gradient-surface border-r border-border/50 shadow-premium">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-border/30">
            <h1 className="text-2xl font-bold text-gradient">UpTrade AI</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-thin">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 group ${
                    isActive
                      ? 'bg-gradient-blue text-white shadow-premium'
                      : 'text-text-secondary hover:bg-primary-hover hover:text-text-primary hover:shadow-md'
                  }`}
                >
                  <Icon className={`w-5 h-5 mr-3 transition-transform duration-300 ${isActive ? '' : 'group-hover:scale-110'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border/30">
            <p className="text-xs text-text-muted text-center">
              UpTrade AI v1.0.0 <span className="text-gradient-gold">Premium</span>
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pl-64">
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
