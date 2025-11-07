# UpTrade AI - Frontend

Modern, production-ready React + TypeScript frontend for the UpTrade AI financial trading platform.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Route pages (7 main views)
│   ├── services/       # API integration layer
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Helper functions
│   ├── types/          # TypeScript type definitions
│   ├── styles/         # Global styles
│   ├── App.tsx         # Main app component with routes
│   └── main.tsx        # App entry point
├── public/             # Static assets
└── [config files]
```

## 🎨 Features

- **7 Main Pages**: Dashboard, Market Analysis, Portfolio, Trading, Forecasting, News & Sentiment, Research
- **Real-time Data**: WebSocket integration for live price updates
- **Interactive Charts**: Candlestick charts with 9 technical indicators
- **ML Forecasting**: Prophet, Linear Regression, and Moving Average models
- **Portfolio Management**: Holdings, performance tracking, MPT optimization
- **Paper Trading**: Simulated trading with market/limit/stop orders
- **News Sentiment**: VADER sentiment analysis on financial news
- **SEC Filings**: Regulatory document search with sentiment analysis

## 🛠️ Tech Stack

- **React 18** + **TypeScript** - Modern UI framework with type safety
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Query** - Data fetching and caching
- **Zustand** - Lightweight state management
- **Recharts** - Charting library for data visualization
- **Framer Motion** - Animation library
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls

## 🎨 Design System

### Dark Theme
- Primary Background: `#0A1929` (Deep Navy)
- Accent: `#1976D2` (Blue)
- Success: `#4CAF50` (Green)
- Warning: `#FFA726` (Orange)
- Danger: `#F44336` (Red)

### Typography
- UI Text: Inter
- Numbers/Data: Roboto Mono

### Spacing
- Base unit: 4px
- Scale: 1 (4px), 2 (8px), 3 (12px), 4 (16px), 6 (24px), 8 (32px)

## 📡 API Integration

Backend API runs on `http://localhost:8000`

The Vite dev server proxies `/api/*` requests to the backend automatically.

### Example API Calls

```typescript
// Get stock price
GET /api/v1/stocks/AAPL/price

// Create ML forecast
POST /api/v1/forecast/AAPL
{
  "horizon_days": 30,
  "model_name": "prophet"
}

// Place trade order
POST /api/v1/trading/order
{
  "portfolio_id": 1,
  "ticker": "AAPL",
  "order_type": "market",
  "side": "buy",
  "quantity": 10
}
```

## 📋 Development Checklist

See `IMPLEMENTATION_GUIDE.md` for detailed implementation steps and phase-by-phase development guide.

### Phase 1: Core Components (2-3 weeks)
- [ ] Layout & Navigation
- [ ] UI Component Library
- [ ] Responsive Design

### Phase 2: Pages & Features (2-3 weeks)
- [ ] Dashboard
- [ ] Market Analysis with Charts
- [ ] Portfolio Management
- [ ] Trading Interface
- [ ] ML Forecasting
- [ ] News & Sentiment
- [ ] Research & Filings

### Phase 3: API Integration (2 weeks)
- [ ] API Service Layer
- [ ] Custom Hooks
- [ ] React Query Integration

### Phase 4: Real-time Features (1 week)
- [ ] WebSocket Integration
- [ ] Live Price Updates
- [ ] Real-time P&L

### Phase 5: Polish & Testing (1 week)
- [ ] Animations
- [ ] Error Handling
- [ ] Performance Optimization
- [ ] Accessibility

## 🧪 Available Scripts

```bash
# Development server (port 3000)
npm run dev

# Type checking
npm run build

# Preview production build
npm run preview

# Linting
npm run lint
```

## 🌐 Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

## 📦 Build Output

```bash
npm run build
```

Output directory: `dist/`

Contains optimized static files ready for deployment.

## 🎯 Key Features to Implement

1. **Real-time Stock Chart**
   - Candlestick visualization
   - Technical indicator overlays
   - Interactive zoom/pan
   - Drawing tools

2. **Trading Interface**
   - Order entry forms
   - Live positions
   - P&L tracking
   - Order confirmations

3. **Portfolio Analytics**
   - Asset allocation
   - Performance charts
   - Risk metrics (VaR, Sharpe)
   - Optimization

4. **ML Forecasting**
   - Model selection
   - Confidence intervals
   - Performance metrics
   - Historical accuracy

5. **News & Sentiment**
   - VADER sentiment scores
   - Trending analysis
   - Ticker filtering

## 📚 Documentation

- `IMPLEMENTATION_GUIDE.md` - Complete development guide
- `FRONTEND_DESIGN.md` (in backend/) - Full UI/UX specifications
- Component documentation - (to be added as components are built)

## 🚀 Deployment

1. Build the production bundle:
   ```bash
   npm run build
   ```

2. Deploy the `dist/` folder to your hosting service:
   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - GitHub Pages

3. Configure environment variables on your hosting platform

## 🤝 Backend Integration

This frontend is designed to work with the UpTrade AI FastAPI backend.

**Backend features:**
- 39 API endpoints
- Real-time stock data (yfinance)
- Financial news (News API)
- VADER sentiment analysis
- 3 ML forecasting models
- Modern Portfolio Theory optimization
- Paper trading simulation
- 9 technical indicators
- SEC EDGAR filing integration

## 📈 Performance

- **Hot Module Replacement (HMR)** - Instant updates during development
- **Code Splitting** - Lazy load routes and components
- **React Query Caching** - Efficient data fetching and caching
- **Optimized Bundle** - Tree-shaking and minification

## 🎨 Design Philosophy

- **Data-Dense** - Maximize information display for professional traders
- **Real-time** - Live updates with WebSocket connections
- **Professional** - Clean, modern dark theme
- **Responsive** - Works on desktop, tablet, and mobile
- **Accessible** - WCAG 2.1 AA compliance

## 🛠️ Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000
```

### API Connection Issues
- Ensure backend is running on port 8000
- Check CORS configuration in backend
- Verify API proxy in vite.config.ts

### TypeScript Errors
```bash
# Clear TypeScript cache
rm -rf node_modules/.vite
```

## 📞 Support

For issues or questions:
1. Check `IMPLEMENTATION_GUIDE.md` for detailed instructions
2. Review backend API documentation
3. Check console logs for errors

---

**Status**: ✅ Frontend foundation complete - Ready for UI development!

**Next Steps**: Follow `IMPLEMENTATION_GUIDE.md` to build out the complete application.
