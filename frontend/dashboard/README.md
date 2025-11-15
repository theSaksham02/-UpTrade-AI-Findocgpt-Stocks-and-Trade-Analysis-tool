# UpTrade Dashboard

A modern, AI-powered financial trading dashboard built with Next.js 14, React 19, TypeScript, and Tailwind CSS.

## 🚀 Features

### ✅ Built-In Features
- **Market Overview** - Real-time market indices, top movers, and market statistics
- **Stock Comparison** - Side-by-side comparison of stocks with 100+ metrics
- **Sentiment Analysis** - AI-powered sentiment tracking from news, social media, and analyst reports
- **Portfolio Tracking** - Account management and transaction history
- **Dark/Light Mode** - System-aware theme switching
- **Responsive Design** - Mobile-first, fully responsive layout
- **Real-time Charts** - Interactive charts using Recharts

### 🎨 UI Components
- **shadcn/ui** - Complete set of accessible components
- **Radix UI** - Headless UI primitives
- **Lucide Icons** - Beautiful, consistent icons
- **Tailwind CSS** - Utility-first styling

## 📦 Tech Stack

- **Next.js 14.2** - App Router architecture
- **React 19** - Latest React with Server Components
- **TypeScript 5.9** - Type-safe development
- **Tailwind CSS 3.4** - Utility-first styling
- **Recharts** - Data visualization
- **next-themes** - Theme management

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation

1. **Install Dependencies**
   ```bash
   cd frontend/dashboard
   npm install
   # or
   pnpm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Update `.env.local` with your backend API URL:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. **Open Dashboard**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔌 API Integration

The dashboard connects to the FastAPI backend for real-time data. API client is located at `lib/api.ts`.

### Key API Endpoints
- `/api/health` - Health check
- `/api/market/overview` - Market overview data
- `/api/stocks/quote/{symbol}` - Stock quotes
- `/api/sentiment` - Sentiment analysis
- `/api/news` - Financial news

### Using the API Client
```typescript
import { apiClient } from '@/lib/api'

// Get stock quote
const quote = await apiClient.getStockQuote('AAPL')

// Analyze sentiment
const sentiment = await apiClient.analyzeSentiment(['Great earnings!'])

// Get market overview
const market = await apiClient.getMarketOverview()
```

## 📊 Dashboard Sections

### 1. Market Overview
- Live market indices (S&P 500, Dow Jones, NASDAQ)
- Top gainers and losers
- Most active stocks
- Total volume and market cap

### 2. Stock Comparison
- Compare two stocks side-by-side
- Historical price charts
- Financial metrics comparison
- AI-powered insights

### 3. Sentiment Analysis
- Overall market sentiment distribution
- Stock-specific sentiment scores
- Real-time sentiment trends
- Multi-source analysis (news, social media, analysts)

### 4. Portfolio
- Account balances
- Recent transactions
- Position tracking

### 5. Activity
- Upcoming events
- Market calendar
- Earnings announcements

## 🎨 Customization

### Themes
The dashboard supports light/dark mode with system preference detection. Toggle between themes using the theme switcher in the navigation bar.

### Colors
Customize colors in `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      // Add your custom colors
    }
  }
}
```

### Components
All UI components are in `components/ui/` and can be customized using className props.

## 📁 Project Structure

```
frontend/dashboard/
├── app/
│   ├── dashboard/
│   │   └── page.tsx        # Main dashboard page
│   ├── layout.tsx          # Root layout with theme
│   └── page.tsx            # Redirect to dashboard
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── kokonutui/          # Dashboard layout components
│   ├── market-overview.tsx # Market overview component
│   ├── stock-comparison.tsx # Stock comparison component
│   └── sentiment-dashboard.tsx # Sentiment analysis component
├── lib/
│   ├── api.ts              # API client
│   └── utils.ts            # Utility functions
└── public/                 # Static assets
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel deploy
```

### Docker
```bash
docker build -t uptrade-dashboard .
docker run -p 3000:3000 uptrade-dashboard
```

### Environment Variables for Production
```env
NEXT_PUBLIC_API_URL=https://api.uptrade.ai
```

## 🔧 Development

### Adding New Components
```bash
npx shadcn-ui@latest add [component-name]
```

### Running Tests
```bash
npm run test
```

### Linting
```bash
npm run lint
```

## 📝 API Development Mode

By default, the dashboard uses mock data for development. To connect to the real backend:

1. Start the FastAPI backend:
   ```bash
   cd ../../
   python api_server.py
   ```

2. Update the API client in components to set `useMockData = false`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is part of UpTrade AI platform.

## 🆘 Support

For issues and questions:
- Check the [documentation](../README.md)
- Open an issue on GitHub
- Contact: support@uptrade.ai

## 🎯 Roadmap

- [ ] Real-time WebSocket data streaming
- [ ] Advanced charting with TradingView
- [ ] Custom alerts and notifications
- [ ] Portfolio optimization tools
- [ ] Social trading features
- [ ] Mobile app (React Native)

---

Built with ❤️ by the UpTrade AI team
