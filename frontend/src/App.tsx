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

function App() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <>
      {isLandingPage ? (
        <Routes>
          <Route path="/" element={<LandingPage />} />
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
            <Route path="/tradex" element={<div className="p-8 text-center text-text-primary"><h1 className="text-4xl font-bold mb-4">TradeX (Pro)</h1><p className="text-text-secondary">Coming Soon</p></div>} />
            <Route path="/visualx" element={<div className="p-8 text-center text-text-primary"><h1 className="text-4xl font-bold mb-4">VisualX (Pro)</h1><p className="text-text-secondary">Coming Soon</p></div>} />
            <Route path="/hftx" element={<div className="p-8 text-center text-text-primary"><h1 className="text-4xl font-bold mb-4">HFTX (Pro)</h1><p className="text-text-secondary">Coming Soon</p></div>} />
          </Routes>
        </Layout>
      )}
    </>
  )
}

export default App
