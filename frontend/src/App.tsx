import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import MarketAnalysis from './pages/MarketAnalysis'
import Portfolio from './pages/Portfolio'
import Trading from './pages/Trading'
import Forecasting from './pages/Forecasting'
import NewsSentiment from './pages/NewsSentiment'
import Research from './pages/Research'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/market" element={<MarketAnalysis />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/trading" element={<Trading />} />
        <Route path="/forecasting" element={<Forecasting />} />
        <Route path="/news" element={<NewsSentiment />} />
        <Route path="/research" element={<Research />} />
      </Routes>
    </Layout>
  )
}

export default App
