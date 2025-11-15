# 🚀 UpTrade Dashboard - Setup & Integration Guide

## ✅ What Has Been Built

### 1. **Complete Dashboard Infrastructure**
- ✅ Market Overview Dashboard with real-time data
- ✅ Stock Comparison Tool with charts and metrics
- ✅ Sentiment Analysis Dashboard with AI insights
- ✅ Portfolio Tracking Interface
- ✅ Activity Timeline
- ✅ Dark/Light Theme Support
- ✅ Fully Responsive Design

### 2. **API Integration Layer**
- ✅ API Client (`lib/api.ts`) with all endpoint connections
- ✅ TypeScript interfaces for type-safe data handling
- ✅ Mock data generators for development
- ✅ Error handling and fallback mechanisms

### 3. **UI Components**
- ✅ Market index cards with live updates
- ✅ Stock cards with price and change indicators
- ✅ Interactive charts (Line, Bar, Pie) using Recharts
- ✅ Sentiment visualization components
- ✅ Tabbed navigation system

## 📦 Installation Steps

### Option 1: Using the Pre-built Dashboard (Recommended)

The dashboard is already in the `frontend/dashboard` directory. To run it:

```bash
# Navigate to dashboard
cd frontend/dashboard

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

Dashboard will be available at: **http://localhost:3000**

### Option 2: Fresh Installation

If you encounter issues, you can verify the setup:

```bash
cd frontend/dashboard

# Check if all files are present
ls -la

# Should see:
# - app/
# - components/
# - lib/
# - package.json
# - next.config.mjs
# - tailwind.config.js

# Install dependencies
npm install

# Run development server
npm run dev
```

## 🔌 Connecting to Backend API

### Step 1: Start the FastAPI Backend

```bash
# From project root
cd /path/to/-UpTrade-AI-Findocgpt-Stocks-and-Trade-Analysis-tool

# Activate virtual environment
source .venv/bin/activate

# Start the API server
python api_server.py
```

The backend will run at: **http://localhost:8000**

### Step 2: Configure Dashboard API Connection

1. Create environment file:
   ```bash
   cd frontend/dashboard
   cp .env.local.example .env.local
   ```

2. Edit `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

3. Update components to use real API:
   - Edit `components/market-overview.tsx`
   - Change `const [useMockData, setUseMockData] = useState(true)` to `false`

### Step 3: Test API Connection

```bash
# Test backend health
curl http://localhost:8000/api/health

# Should return:
# {"status":"healthy","timestamp":"...","ai_models":{...}}
```

## 🎨 Dashboard Features

### Market Overview Tab
- **Live Market Indices**: S&P 500, Dow Jones, NASDAQ
- **Top Gainers/Losers**: Real-time stock movements
- **Most Active Stocks**: By trading volume
- **Market Statistics**: Total volume, market cap, active traders

### Stock Comparison Tab
- **Side-by-Side Comparison**: Compare any two stocks
- **Price Charts**: 6-month historical data
- **Financial Metrics**: P/E, EPS, ROA, ROE, Debt/Equity
- **AI Scoring**: Machine learning-based stock scores
- **AI Insights**: Automated analysis and recommendations

### Sentiment Analysis Tab
- **Overall Market Sentiment**: Positive/Neutral/Negative distribution
- **Stock-Specific Sentiment**: Individual stock sentiment scores
- **Multi-Source Analysis**: News, social media, analyst reports
- **Sentiment Trends**: Hourly sentiment changes
- **AI Insights**: Context-aware sentiment interpretation

### Portfolio Tab
- **Account Balances**: Track multiple accounts
- **Transaction History**: Recent buy/sell activities
- **Position Tracking**: Current holdings

### Activity Tab
- **Upcoming Events**: Earnings calls, announcements
- **Market Calendar**: Important dates
- **Scheduled Activities**: Trading schedule

## 🛠️ Customization Guide

### Adding New Dashboard Sections

1. **Create Component**:
   ```tsx
   // components/my-new-dashboard.tsx
   export default function MyNewDashboard() {
     return (
       <div className="space-y-6">
         <Card>
           <CardHeader>
             <CardTitle>My New Feature</CardTitle>
           </CardHeader>
           <CardContent>
             {/* Your content */}
           </CardContent>
         </Card>
       </div>
     )
   }
   ```

2. **Add to Tabs**:
   ```tsx
   // components/kokonutui/content.tsx
   import MyNewDashboard from "@/components/my-new-dashboard"
   
   // Add to TabsList
   <TabsTrigger value="mynew">My Feature</TabsTrigger>
   
   // Add TabsContent
   <TabsContent value="mynew" className="mt-6">
     <MyNewDashboard />
   </TabsContent>
   ```

### Adding New API Endpoints

1. **Update API Client**:
   ```typescript
   // lib/api.ts
   async getMyNewData(): Promise<MyDataType> {
     return this.fetch('/api/my-endpoint')
   }
   ```

2. **Use in Component**:
   ```tsx
   const [data, setData] = useState<MyDataType>()
   
   useEffect(() => {
     const fetchData = async () => {
       const result = await apiClient.getMyNewData()
       setData(result)
     }
     fetchData()
   }, [])
   ```

### Styling & Theming

Colors are defined in `tailwind.config.js`. To customize:

```javascript
theme: {
  extend: {
    colors: {
      'custom-blue': '#0066cc',
      'custom-green': '#00cc66',
    }
  }
}
```

## 📊 API Endpoints Used

| Endpoint | Purpose | Component |
|----------|---------|-----------|
| `/api/health` | Health check | All |
| `/api/market/overview` | Market data | MarketOverview |
| `/api/stocks/quote/{symbol}` | Stock quotes | StockComparison |
| `/api/sentiment` | Sentiment analysis | SentimentDashboard |
| `/api/news` | Financial news | Multiple |
| `/api/stocks/historical/{symbol}` | Price history | StockComparison |

## 🔍 Troubleshooting

### Dashboard won't start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### API connection fails
1. Verify backend is running: `curl http://localhost:8000/api/health`
2. Check CORS settings in `api_server.py`
3. Verify `.env.local` has correct API_URL
4. Check browser console for errors

### Components not displaying data
1. Check if `useMockData` is set correctly
2. Verify API responses in Network tab
3. Check console for TypeScript errors
4. Ensure backend models match frontend interfaces

### Theme not switching
1. Check `ThemeProvider` in `app/layout.tsx`
2. Verify `next-themes` is installed
3. Clear browser cache

## 📈 Performance Optimization

### Production Build
```bash
npm run build
npm start
```

### Enable API Caching
```typescript
// lib/api.ts - Add caching layer
const cache = new Map()

async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const cacheKey = `${endpoint}${JSON.stringify(options)}`
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)
  }
  const result = await fetch(...)
  cache.set(cacheKey, result)
  return result
}
```

## 🚀 Deployment

### Vercel Deployment
```bash
npm install -g vercel
vercel login
vercel
```

### Environment Variables for Production
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

## 📝 Next Steps

1. **Install Dependencies**: Run `npm install` in `frontend/dashboard`
2. **Start Backend**: Run `python api_server.py`
3. **Start Dashboard**: Run `npm run dev` in dashboard folder
4. **Access Dashboard**: Open http://localhost:3000
5. **Configure API**: Update `.env.local` with backend URL
6. **Switch to Real Data**: Set `useMockData = false` in components

## 🎯 Key Files & Structure

```
frontend/dashboard/
├── lib/api.ts                      # ⭐ API client - all backend connections
├── components/
│   ├── market-overview.tsx         # ⭐ Market data dashboard
│   ├── stock-comparison.tsx        # ⭐ Stock comparison tool
│   ├── sentiment-dashboard.tsx     # ⭐ Sentiment analysis
│   └── kokonutui/content.tsx       # ⭐ Main dashboard tabs
├── app/
│   ├── dashboard/page.tsx          # Dashboard entry point
│   └── layout.tsx                  # Root layout with theme
└── .env.local                      # Configuration (create this)
```

## 💡 Pro Tips

1. **Development Mode**: Use mock data to develop without backend running
2. **Hot Reload**: Changes auto-refresh in dev mode
3. **TypeScript**: Use TypeScript features for better DX
4. **Components**: All shadcn/ui components are customizable
5. **Themes**: Dark mode follows system preference by default

## 🆘 Support

- **Documentation**: See `frontend/dashboard/README.md`
- **Backend API**: See `/api/docs` when backend is running
- **Components**: See shadcn/ui docs for component usage

---

**Dashboard is ready to use!** 🎉

Just run `npm install && npm run dev` in the `frontend/dashboard` directory!
