import { Routes, Route, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import MarketAnalysis from './pages/MarketAnalysis'
import Portfolio from './pages/Portfolio'
import Trading from './pages/Trading'
import Forecasting from './pages/Forecasting'
import NewsSentiment from './pages/NewsSentiment'
import Research from './pages/Research'
import TradeX from './pages/TradeX'
import VisualX from './pages/VisualX'

function App() {
  const location = useLocation();
  // Pages without sidebar Layout
  const standalonePages = ['/', '/tradex', '/visualx', '/tradesphere'];
  const isStandalonePage = standalonePages.includes(location.pathname);

  return (
    <>
      {isStandalonePage ? (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/tradex" element={<TradeX />} />
          <Route path="/visualx" element={<VisualX />} />
          <Route path="/tradesphere" element={<div className="min-h-screen bg-gradient-to-br from-[#1A0537] via-[#221022] to-[#0D0219] flex items-center justify-center"><div className="text-center"><h1 className="text-6xl font-bold text-accent-purple mb-4">TradeSphere</h1><p className="text-white/70 text-xl">Coming Soon</p></div></div>} />
        </Routes>
      ) : (
        <Layout>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/market" element={<MarketAnalysis />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/trading" element={<Trading />} />
            <Route path="/forecasting" element={<Forecasting />} />
            <Route path="/news" element={<NewsSentiment />} />
            <Route path="/research" element={<Research />} />
            <Route path="/hftx" element={<div className="p-8 text-center text-text-primary"><h1 className="text-4xl font-bold mb-4">HFTX (Pro)</h1><p className="text-text-secondary">Coming Soon</p></div>} />
          </Routes>
        </Layout>
      )}
    </>
  )
}

export default App
