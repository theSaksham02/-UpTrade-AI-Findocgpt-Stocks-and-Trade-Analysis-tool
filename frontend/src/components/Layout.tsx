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
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-blue-600">UpTrade AI</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              UpTrade AI v1.0.0
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
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 z-40 group"
          title="Open AI Assistant"
        >
          <Sparkles className="w-6 h-6" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
        </button>
      )}

      {/* Floating AI Assistant */}
      {showAI && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
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
