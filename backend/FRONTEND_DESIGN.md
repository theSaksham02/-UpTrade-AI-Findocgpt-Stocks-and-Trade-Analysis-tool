# UpTrade AI - Frontend Design Specification

## Overview
Modern, professional financial trading platform with dark theme, real-time data visualization, and comprehensive analytics.

## Design System

### Color Palette
```
Primary Background: #0A1929 (Deep Navy)
Secondary Background: #132F4C (Navy Blue)
Surface: #1A2027 (Dark Gray)
Accent Primary: #1976D2 (Blue)
Accent Secondary: #0288D1 (Light Blue)
Success: #4CAF50 (Green)
Warning: #FFA726 (Orange)
Danger: #F44336 (Red)
Text Primary: #FFFFFF (White)
Text Secondary: #B0BEC5 (Light Gray)
Text Muted: #78909C (Gray)
Border: #263238 (Dark Border)
```

### Typography
```
Font Family:
  - UI Text: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI"
  - Numbers/Data: "Roboto Mono", monospace
  - Headings: "Inter", sans-serif

Font Sizes:
  - xs: 0.75rem (12px)
  - sm: 0.875rem (14px)
  - base: 1rem (16px)
  - lg: 1.125rem (18px)
  - xl: 1.25rem (20px)
  - 2xl: 1.5rem (24px)
  - 3xl: 1.875rem (30px)
  - 4xl: 2.25rem (36px)

Font Weights:
  - normal: 400
  - medium: 500
  - semibold: 600
  - bold: 700
```

### Spacing System
```
Base unit: 4px

Spacing scale:
  1: 4px
  2: 8px
  3: 12px
  4: 16px
  5: 20px
  6: 24px
  8: 32px
  10: 40px
  12: 48px
  16: 64px
  20: 80px
```

### Border Radius
```
sm: 4px
md: 8px
lg: 12px
xl: 16px
2xl: 24px
full: 9999px
```

### Shadows
```
sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3)
md: 0 4px 6px -1px rgba(0, 0, 0, 0.4)
lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5)
xl: 0 20px 25px -5px rgba(0, 0, 0, 0.6)
```

## Page Layouts

### 1. Dashboard (Home Page)

**Layout: 3-column responsive grid**

```
┌─────────────────────────────────────────────────────────────┐
│ Header: Logo | Portfolio Value | Search | Notifications     │
├─────────────────────────────────────────────────────────────┤
│ Sidebar Navigation                                          │
│ - Dashboard                                                  │
│ - Market Analysis                                           │
│ - Portfolio                                                  │
│ - Trading                                                    │
│ - Forecasting                                               │
│ - News & Sentiment                                          │
│ - Research                                                   │
└─────────────────────────────────────────────────────────────┘

Main Content Area:
┌────────────────────────────┬────────────────────────────────┐
│ Portfolio Overview Card    │ Market Snapshot                │
│ ┌─────────────────────┐   │ ┌──────────────────────────┐  │
│ │ Total Value: $125.4K│   │ │ S&P 500    +0.45% ↑     │  │
│ │ Today's P&L: +$2.1K │   │ │ NASDAQ     +0.78% ↑     │  │
│ │ Total Return: +25.4%│   │ │ DOW        -0.12% ↓     │  │
│ └─────────────────────┘   │ └──────────────────────────┘  │
│ Mini Chart (7-day)        │ Top Gainers/Losers            │
├────────────────────────────┴────────────────────────────────┤
│ Watchlist & Holdings                                        │
│ ┌──────────┬────────┬────────┬────────┬────────┬─────────┐│
│ │ Ticker   │ Price  │ Change │ P&L    │ Shares │ Actions ││
│ ├──────────┼────────┼────────┼────────┼────────┼─────────┤│
│ │ AAPL     │ $185.2 │ +1.2%  │ +$340  │ 50     │ Trade   ││
│ │ GOOGL    │ $142.1 │ -0.5%  │ -$120  │ 30     │ Trade   ││
│ │ TSLA     │ $242.8 │ +3.2%  │ +$890  │ 40     │ Trade   ││
│ └──────────┴────────┴────────┴────────┴────────┴─────────┘│
├─────────────────────────────────────────────────────────────┤
│ Recent Activity                   │ AI Insights              │
│ ┌─────────────────────────────┐  │ ┌────────────────────┐  │
│ │ • Bought 50 AAPL @ $180     │  │ │ "AAPL showing      │  │
│ │ • Sold 20 MSFT @ $375       │  │ │  bullish signals   │  │
│ │ • Forecast: TSLA +5% (7d)   │  │ │  with RSI at 58"   │  │
│ └─────────────────────────────┘  │ └────────────────────┘  │
└─────────────────────────────────┴─────────────────────────┘
```

**Components:**
- Header with portfolio summary
- Collapsible sidebar navigation
- Portfolio overview cards with metrics
- Market indices ticker
- Interactive watchlist table
- Recent trades timeline
- AI-generated insights panel

### 2. Market Analysis Page

**Layout: Full-width with chart focus**

```
┌─────────────────────────────────────────────────────────────┐
│ Ticker Search: [AAPL ▼] | Timeframe: 1D 1W 1M 3M 6M 1Y 5Y │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│     Main Stock Chart (TradingView-style)                    │
│     ┌───────────────────────────────────────────────┐      │
│     │                      AAPL                      │      │
│     │  Price: $185.24  +2.15 (+1.17%)               │      │
│     │  ┌─────────────────────────────────────────┐  │      │
│     │  │         Candlestick Chart               │  │      │
│     │  │                                         │  │      │
│     │  │   /\    /\                             │  │      │
│     │  │  /  \  /  \__/\                        │  │      │
│     │  │ /    \/      \                         │  │      │
│     │  └─────────────────────────────────────────┘  │      │
│     │  Volume Bar Chart                           │  │      │
│     └───────────────────────────────────────────────┘      │
│                                                              │
├──────────────────────┬──────────────────────────────────────┤
│ Technical Indicators │ Trading Signals                      │
│ ┌──────────────────┐│ ┌──────────────────────────────────┐ │
│ │ RSI: 58.3 (Hold) ││ │ Overall Signal: BUY              │ │
│ │ MACD: Bullish ↑  ││ │ ┌──────────────┬──────────────┐ │ │
│ │ BB: Mid-range    ││ │ │ RSI         │ HOLD         │ │ │
│ │ SMA-50: $178.2   ││ │ │ MACD        │ BUY  ↑       │ │ │
│ │ SMA-200: $165.8  ││ │ │ Bollinger   │ BUY  ↑       │ │ │
│ │ ATR: 4.2         ││ │ │ Stochastic  │ HOLD         │ │ │
│ │ Volume: High     ││ │ │ Trend       │ STRONG BUY ↑ │ │ │
│ └──────────────────┘│ └──────────────┴──────────────┘ │ │
│                      │                                    │ │
│ Indicator Charts     │ ML Forecast Preview                │ │
│ (RSI, MACD overlay)  │ 30-day: $195 (Confidence: 78%)     │ │
└──────────────────────┴──────────────────────────────────────┘
```

**Components:**
- Advanced chart with candlestick/line/area views
- Indicator overlays (Bollinger Bands, Moving Averages)
- Technical indicator panel
- Smart signal aggregation
- Quick forecast preview
- Drawing tools (trendlines, support/resistance)
- Save chart layouts

### 3. Portfolio Management Page

**Layout: Dashboard with allocation view**

```
┌─────────────────────────────────────────────────────────────┐
│ Portfolio Performance                                        │
│ ┌───────────────────────────────────────────────────────┐  │
│ │ Total Value: $125,430.50  (+$12,345.20 / +25.4%)     │  │
│ │ Cash: $35,430.50  |  Invested: $90,000               │  │
│ │                                                        │  │
│ │ [Performance Chart - Last 30 Days]                    │  │
│ │  $130K ┌────────────────────────────────┐            │  │
│ │  $125K │           ╱───╲  ╱──╲          │            │  │
│ │  $120K │      ╱───╱    ╲╱    ╲         │            │  │
│ │  $115K │  ╱──╱                 ╲────    │            │  │
│ │  $110K └────────────────────────────────┘            │  │
│ └───────────────────────────────────────────────────────┘  │
├─────────────────────────┬───────────────────────────────────┤
│ Holdings                │ Asset Allocation                  │
│ ┌─────────────────────┐│ ┌───────────────────────────────┐ │
│ │ Stock  │ Value │ %  ││ │    Pie Chart:                 │ │
│ ├────────┼───────┼────┤│ │    Tech: 40% (Blue)           │ │
│ │ AAPL   │$12.5K │ 14%││ │    Finance: 25% (Green)       │ │
│ │ GOOGL  │$10.8K │ 12%││ │    Healthcare: 15% (Orange)   │ │
│ │ MSFT   │ $9.2K │ 10%││ │    Consumer: 12% (Purple)     │ │
│ │ TSLA   │ $8.5K │  9%││ │    Energy: 8% (Red)           │ │
│ └─────────────────────┘│ └───────────────────────────────┘ │
├─────────────────────────┴───────────────────────────────────┤
│ Risk Metrics                                                 │
│ ┌──────────────┬──────────────┬──────────────┬────────────┐│
│ │ Sharpe Ratio │ VaR (95%)    │ Max Drawdown │ Beta       ││
│ │    1.85      │   -$2,450    │    -8.5%     │   0.92     ││
│ └──────────────┴──────────────┴──────────────┴────────────┘│
│                                                              │
│ Portfolio Optimization                    [Optimize Button] │
│ Risk Tolerance: ○ Conservative ● Moderate ○ Aggressive      │
└──────────────────────────────────────────────────────────────┘
```

**Components:**
- Portfolio value header with sparkline
- Holdings table with real-time updates
- Asset allocation pie/donut chart
- Risk metrics dashboard
- Performance timeline chart
- Optimization controls
- Rebalancing suggestions

### 4. Trading Interface

**Layout: Split view with order entry**

```
┌─────────────────────────────────────────────────────────────┐
│ Quick Trade Panel               │ Current Positions         │
│ ┌─────────────────────────────┐│ ┌─────────────────────────┐│
│ │ Ticker: [AAPL      ▼]       ││ │ Stock │ Qty │ Avg Cost ││
│ │ Type: ● Market ○ Limit      ││ ├───────┼─────┼──────────┤│
│ │       ○ Stop                ││ │ AAPL  │ 50  │ $180.00  ││
│ │                             ││ │ GOOGL │ 30  │ $138.50  ││
│ │ Side: ● Buy   ○ Sell        ││ │ MSFT  │ 25  │ $370.20  ││
│ │ Quantity: [10 shares]       ││ └─────────────────────────┘│
│ │ Price: [Market    ]         ││                             │
│ │                             ││ Unrealized P&L: +$2,450     │
│ │ Estimated Cost: $1,852.40   ││ Today's Change: +$340       │
│ │ (includes $1.85 fee)        ││                             │
│ │                             ││ [Close All Positions]       │
│ │ [Place Order Button]        ││                             │
│ └─────────────────────────────┘│                             │
├─────────────────────────────────┴─────────────────────────────┤
│ Order History & Trade Log                                     │
│ ┌───────┬────────┬──────┬──────┬────────┬─────────┬────────┐│
│ │ Time  │ Ticker │ Side │ Type │ Qty    │ Price   │ Status ││
│ ├───────┼────────┼──────┼──────┼────────┼─────────┼────────┤│
│ │ 10:32 │ AAPL   │ BUY  │ MKT  │ 50     │ $180.50 │ FILLED ││
│ │ 09:15 │ GOOGL  │ SELL │ LMT  │ 10     │ $142.00 │ FILLED ││
│ │ 08:45 │ TSLA   │ BUY  │ STOP │ 20     │ $240.00 │ PENDING││
│ └───────┴────────┴──────┴──────┴────────┴─────────┴────────┘│
├─────────────────────────────────────────────────────────────┤
│ Performance Leaderboard (Paper Trading)                      │
│ ┌───────┬──────────────┬─────────────┬──────────────────┐   │
│ │ Rank  │ Username     │ Total Value │ 30-Day Return    │   │
│ ├───────┼──────────────┼─────────────┼──────────────────┤   │
│ │  🥇1  │ TraderPro    │ $135,840    │ +35.8% ↑        │   │
│ │  🥈2  │ You          │ $125,430    │ +25.4% ↑        │   │
│ │  🥉3  │ InvestorMax  │ $118,220    │ +18.2% ↑        │   │
│ └───────┴──────────────┴─────────────┴──────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**Components:**
- Quick trade order entry form
- Current positions summary
- Real-time P&L display
- Order history table with filters
- Order book/depth chart
- Trade execution confirmation
- Paper trading leaderboard

### 5. ML Forecasting Page

**Layout: Model comparison view**

```
┌─────────────────────────────────────────────────────────────┐
│ Stock: [AAPL ▼] | Horizon: [30 days ▼] | Model: [All ▼]   │
├─────────────────────────────────────────────────────────────┤
│ Forecast Visualization                                       │
│ ┌───────────────────────────────────────────────────────┐  │
│ │                    Price Forecast                      │  │
│ │  $200 ┌──────────────────────────────────────┐        │  │
│ │  $195 │                    ╱──Prophet        │        │  │
│ │  $190 │              ╱────╱    (78% conf)    │        │  │
│ │  $185 │        ╱────╱           ┌───┐        │        │  │
│ │  $180 │   ────╱            ╱────┘   └───┐    │        │  │
│ │  $175 │ Historical  ╱─Linear Reg      └───   │        │  │
│ │       └──────────────────────────────────────┘        │  │
│ │       Past ←──────────→ Future (Confidence Bands)     │  │
│ └───────────────────────────────────────────────────────┘  │
├──────────────────────────┬──────────────────────────────────┤
│ Model Predictions        │ Model Performance                │
│ ┌──────────────────────┐│ ┌──────────────────────────────┐ │
│ │ Prophet (Recommended)││ │ Accuracy (Backtests):        │ │
│ │ Prediction: $195.50  ││ │ ┌────────────┬──────────────┐│ │
│ │ Confidence: 78%      ││ │ │ Prophet    │ 78% (Best)   ││ │
│ │ Range: $188-$203     ││ │ │ Linear Reg │ 72%          ││ │
│ │                      ││ │ │ Moving Avg │ 70%          ││ │
│ │ Linear Regression    ││ │ └────────────┴──────────────┘│ │
│ │ Prediction: $192.30  ││ │                               │ │
│ │ Confidence: 72%      ││ │ Features Used:                │ │
│ │ Range: $185-$200     ││ │ • Trend                       │ │
│ │                      ││ │ • Seasonality (weekly/yearly) │ │
│ │ Moving Average       ││ │ • Volume patterns             │ │
│ │ Prediction: $191.80  ││ │ • Historical volatility       │ │
│ │ Confidence: 70%      ││ │                               │ │
│ └──────────────────────┘│ └──────────────────────────────┘ │
│                          │                                   │
│ [Generate New Forecast]  │ [Download Report]                │
└──────────────────────────┴──────────────────────────────────┘
```

**Components:**
- Multi-model forecast chart with confidence bands
- Model comparison cards
- Prediction accuracy metrics
- Feature importance display
- Historical accuracy tracking
- Downloadable forecast reports
- Model training progress indicators

### 6. News & Sentiment Page

**Layout: Feed with sentiment analysis**

```
┌─────────────────────────────────────────────────────────────┐
│ Filter: [All ▼] | Sentiment: [All ▼] | Source: [All ▼]    │
├─────────────────────────────────────────────────────────────┤
│ Trending Stocks by Sentiment                                 │
│ ┌────────┬────────────┬─────────────┬───────────────────┐  │
│ │ Ticker │ Sentiment  │ Mentions    │ Trend             │  │
│ ├────────┼────────────┼─────────────┼───────────────────┤  │
│ │ AAPL   │ +0.65 🟢   │ 142 today   │ ↑ Bullish         │  │
│ │ TSLA   │ +0.48 🟢   │ 98 today    │ ↑ Positive        │  │
│ │ GOOGL  │ +0.22 🟡   │ 67 today    │ → Neutral         │  │
│ │ AMZN   │ -0.15 🟡   │ 54 today    │ ↓ Slightly Neg    │  │
│ └────────┴────────────┴─────────────┴───────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│ News Feed                                                    │
│ ┌───────────────────────────────────────────────────────┐  │
│ │ 🟢 +0.78 | AAPL | Apple announces new AI features     │  │
│ │ ┌─────────────────────────────────────────────────┐   │  │
│ │ │ Apple Inc. revealed groundbreaking AI integration │  │
│ │ │ across its product line, boosting investor...     │  │
│ │ └─────────────────────────────────────────────────┘   │  │
│ │ Reuters • 2 hours ago • Related: AAPL, MSFT          │  │
│ │ [Read More] [Add to Watchlist]                        │  │
│ ├───────────────────────────────────────────────────────┤  │
│ │ 🟢 +0.52 | TSLA | Tesla Q4 earnings beat estimates    │  │
│ │ ┌─────────────────────────────────────────────────┐   │  │
│ │ │ Tesla reported better-than-expected quarterly... │  │
│ │ └─────────────────────────────────────────────────┘   │  │
│ │ CNBC • 4 hours ago • Related: TSLA                    │  │
│ │ [Read More] [Add to Watchlist]                        │  │
│ ├───────────────────────────────────────────────────────┤  │
│ │ 🟡 +0.12 | MARKET | Fed signals cautious approach     │  │
│ │ ┌─────────────────────────────────────────────────┐   │  │
│ │ │ Federal Reserve officials indicated a measured... │  │
│ │ └─────────────────────────────────────────────────┘   │  │
│ │ Bloomberg • 6 hours ago                               │  │
│ └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Components:**
- Trending stocks sentiment heatmap
- News feed with sentiment badges
- Real-time sentiment scoring (VADER)
- Filter by ticker, sentiment, source
- Related stocks tags
- Social media mention counts
- Sentiment timeline charts
- Save articles to reading list

### 7. Research & SEC Filings Page

**Layout: Document browser with analysis**

```
┌─────────────────────────────────────────────────────────────┐
│ Company: [AAPL ▼] | Filing Type: [All ▼] | Year: [2024 ▼] │
├─────────────────────────────────────────────────────────────┤
│ Company Fundamentals                                         │
│ ┌──────────────┬──────────────┬──────────────┬────────────┐│
│ │ Market Cap   │ P/E Ratio    │ EPS          │ Dividend   ││
│ │ $2.85T       │ 28.5         │ $6.42        │ 0.52%      ││
│ ├──────────────┼──────────────┼──────────────┼────────────┤│
│ │ Revenue      │ Net Income   │ ROE          │ Debt/Eq    ││
│ │ $383.9B      │ $96.8B       │ 145.2%       │ 1.72       ││
│ └──────────────┴──────────────┴──────────────┴────────────┘│
├─────────────────────────────────────────────────────────────┤
│ SEC Filings                                                  │
│ ┌───────────────────────────────────────────────────────┐  │
│ │ 📄 Form 10-K (Annual Report) - Dec 31, 2023          │  │
│ │ ┌─────────────────────────────────────────────────┐   │  │
│ │ │ Sentiment: 🟢 Positive (+0.68)                   │   │  │
│ │ │ Key Topics: Revenue growth, AI investment, M&A   │   │  │
│ │ │ [View Full Document] [Download PDF] [Analyze]   │   │  │
│ │ └─────────────────────────────────────────────────┘   │  │
│ ├───────────────────────────────────────────────────────┤  │
│ │ 📄 Form 10-Q (Quarterly Report) - Sep 30, 2023       │  │
│ │ ┌─────────────────────────────────────────────────┐   │  │
│ │ │ Sentiment: 🟡 Neutral (+0.15)                    │   │  │
│ │ │ Key Topics: Services growth, supply chain        │   │  │
│ │ │ [View Full Document] [Download PDF] [Analyze]   │   │  │
│ │ └─────────────────────────────────────────────────┘   │  │
│ ├───────────────────────────────────────────────────────┤  │
│ │ 📄 Form 8-K (Current Report) - Nov 15, 2023          │  │
│ │ ┌─────────────────────────────────────────────────┐   │  │
│ │ │ Sentiment: 🟢 Positive (+0.42)                   │   │  │
│ │ │ Event: Executive appointment announcement        │   │  │
│ │ │ [View Full Document] [Download PDF] [Analyze]   │   │  │
│ │ └─────────────────────────────────────────────────┘   │  │
│ └───────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│ Financial Charts & Analysis                                  │
│ [Revenue Trends] [Earnings History] [Valuation Metrics]     │
└─────────────────────────────────────────────────────────────┘
```

**Components:**
- Company fundamentals dashboard
- SEC filing browser with filters
- Filing sentiment analysis
- Document viewer with highlighting
- Financial ratio charts
- Peer comparison tools
- Download reports (PDF/Excel)

## Component Specifications

### 1. Stock Chart Component
```typescript
interface StockChartProps {
  ticker: string;
  timeframe: '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | '5Y';
  chartType: 'candlestick' | 'line' | 'area';
  indicators?: ('ma' | 'ema' | 'bb' | 'rsi' | 'macd')[];
  height?: number;
}
```
**Features:**
- Real-time price updates via WebSocket
- Interactive crosshair
- Zoom and pan
- Drawing tools
- Indicator overlays
- Volume bars
- Save/load chart layouts

### 2. Portfolio Card Component
```typescript
interface PortfolioCardProps {
  totalValue: number;
  todayPnL: number;
  totalReturn: number;
  cashBalance: number;
  positions: Position[];
}
```
**Features:**
- Real-time value updates
- Color-coded P&L (green/red)
- Mini sparkline chart
- Quick stats
- Expandable details

### 3. Trade Order Form Component
```typescript
interface OrderFormProps {
  ticker: string;
  orderType: 'market' | 'limit' | 'stop';
  side: 'buy' | 'sell';
  onSubmit: (order: Order) => void;
  currentPrice: number;
  availableCash: number;
}
```
**Features:**
- Real-time cost calculation
- Fee estimation
- Order validation
- Confirmation modal
- Success/error notifications

### 4. News Card Component
```typescript
interface NewsCardProps {
  title: string;
  content: string;
  source: string;
  publishedAt: Date;
  sentimentScore: number;
  relatedTickers: string[];
}
```
**Features:**
- Sentiment badge (color-coded)
- Related ticker chips
- Read more expansion
- Share functionality
- Save to favorites

### 5. Technical Indicator Panel
```typescript
interface IndicatorPanelProps {
  ticker: string;
  indicators: {
    rsi: number;
    macd: { value: number; signal: number; histogram: number };
    bollingerBands: { upper: number; middle: number; lower: number };
    atr: number;
    stochastic: { k: number; d: number };
  };
  signals: TradingSignal[];
}
```
**Features:**
- Real-time indicator values
- Signal interpretation
- Visual indicators (arrows, colors)
- Expandable details
- Historical comparisons

### 6. Forecast Visualization
```typescript
interface ForecastChartProps {
  historicalData: PricePoint[];
  forecasts: {
    prophet: ForecastData;
    linearRegression: ForecastData;
    movingAverage: ForecastData;
  };
  confidenceInterval: boolean;
}
```
**Features:**
- Multi-model comparison
- Confidence bands
- Historical overlay
- Model selection
- Downloadable charts

## Interactive Flows

### Flow 1: Place a Trade
1. User navigates to Trading page
2. Selects ticker from dropdown/search
3. Chooses order type (Market/Limit/Stop)
4. Enters quantity
5. Reviews estimated cost with fees
6. Clicks "Place Order"
7. Confirmation modal appears
8. User confirms
9. Order executes
10. Success notification shows
11. Position updates in real-time

### Flow 2: View ML Forecast
1. User navigates to Forecasting page
2. Searches for ticker (e.g., AAPL)
3. Selects forecast horizon (30 days)
4. Chooses model or "All"
5. System generates predictions
6. Chart displays with confidence bands
7. Model cards show predictions
8. User can download report
9. Can adjust parameters and regenerate

### Flow 3: Portfolio Optimization
1. User opens Portfolio page
2. Views current allocation
3. Clicks "Optimize" button
4. Selects risk tolerance (Conservative/Moderate/Aggressive)
5. System calculates optimal weights using MPT
6. Shows recommended rebalancing
7. Displays expected Sharpe ratio improvement
8. User can accept or adjust suggestions
9. Can execute rebalancing trades with one click

### Flow 4: News Sentiment Analysis
1. User visits News & Sentiment page
2. Browses trending stocks by sentiment
3. Filters by ticker or sentiment level
4. Clicks on news article
5. Sees full article with sentiment details
6. Views related tickers
7. Can add ticker to watchlist
8. Can drill into ticker details

## Responsive Design

### Desktop (1920x1080+)
- Full 3-column layout
- Expanded charts and tables
- Side-by-side comparisons
- All panels visible

### Tablet (768x1024)
- 2-column layout
- Collapsible sidebar
- Stacked panels
- Simplified charts

### Mobile (375x667)
- Single column
- Bottom navigation
- Swipeable cards
- Condensed tables
- Hamburger menu

## Animations & Interactions

### Micro-interactions
- Button hover effects (scale 1.02, shadow increase)
- Card hover (lift effect with shadow)
- Smooth transitions (300ms ease-in-out)
- Skeleton loaders for data fetching
- Pulse animations for real-time updates
- Toast notifications (slide in from top-right)

### Page Transitions
- Fade in/out (200ms)
- Slide transitions for modals
- Loading states with progress bars

### Real-time Updates
- Price changes: Flash green/red briefly
- New trades: Slide in from top
- Live charts: Smooth data point additions
- Notifications: Badge counts with animation

## Accessibility

### WCAG 2.1 AA Compliance
- Keyboard navigation support
- Screen reader friendly
- Focus indicators
- Alt text for images
- ARIA labels
- Color contrast ratios > 4.5:1
- Skip navigation links

### Keyboard Shortcuts
- `/` - Focus search
- `?` - Show shortcuts help
- `t` - Quick trade
- `p` - Portfolio view
- `n` - News feed
- `Esc` - Close modals

## Technology Stack Recommendations

### Frontend Framework
```
React 18 with TypeScript
- Component-based architecture
- Type safety
- Strong ecosystem
```

### State Management
```
Zustand or Redux Toolkit
- Portfolio state
- User preferences
- Real-time data cache
```

### Styling
```
Tailwind CSS + Headless UI
- Utility-first CSS
- Custom dark theme
- Responsive design system
- Accessible components
```

### Charts & Visualization
```
Recharts or TradingView Lightweight Charts
- Interactive stock charts
- Technical indicators
- Forecast visualizations
- Performance metrics
```

### Real-time Data
```
WebSocket (Socket.io)
- Live price updates
- Real-time P&L
- Order execution updates
- News feed streaming
```

### API Integration
```
React Query (TanStack Query)
- Data fetching
- Caching
- Optimistic updates
- Background sync
```

### Forms
```
React Hook Form + Zod
- Order entry forms
- Validation
- Type-safe schemas
```

### Animations
```
Framer Motion
- Page transitions
- Micro-interactions
- Chart animations
```

### Table Components
```
TanStack Table (React Table v8)
- Sortable tables
- Pagination
- Filtering
- Virtual scrolling
```

## API Integration Examples

### Fetch Stock Price
```typescript
const { data, isLoading } = useQuery({
  queryKey: ['stockPrice', ticker],
  queryFn: () => fetch(`/api/v1/stocks/${ticker}/price`).then(r => r.json()),
  refetchInterval: 5000, // Refresh every 5 seconds
});
```

### Place Order
```typescript
const placeMutation = useMutation({
  mutationFn: (order: OrderRequest) => 
    fetch('/api/v1/trading/order', {
      method: 'POST',
      body: JSON.stringify(order),
    }),
  onSuccess: () => {
    queryClient.invalidateQueries(['positions']);
    showNotification('Order placed successfully');
  },
});
```

### WebSocket for Real-time Updates
```typescript
useEffect(() => {
  const socket = io('ws://localhost:8000');
  
  socket.on('price_update', (data) => {
    updateStockPrice(data.ticker, data.price);
  });
  
  socket.on('order_filled', (data) => {
    showNotification(`Order filled: ${data.ticker} @ $${data.price}`);
    queryClient.invalidateQueries(['positions']);
  });
  
  return () => socket.disconnect();
}, []);
```

## Performance Optimization

### Code Splitting
- Route-based lazy loading
- Component lazy loading
- Dynamic imports for heavy libraries

### Caching Strategy
- React Query for API caching
- LocalStorage for user preferences
- Session storage for temporary data
- Service worker for offline support

### Optimization Techniques
- Virtualization for long lists (react-window)
- Debounced search inputs
- Memoization of expensive computations
- Image optimization and lazy loading
- Bundle size optimization (<300KB gzipped)

## Security Considerations

### Authentication
- JWT tokens
- Refresh token rotation
- Secure HTTP-only cookies
- CSRF protection

### Data Protection
- HTTPS only
- Input sanitization
- XSS prevention
- Rate limiting on API calls

### API Key Management
- Environment variables
- Never expose in client code
- Backend proxy for sensitive APIs

## Browser Support

### Desktop
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Mobile
- iOS Safari 14+
- Chrome Mobile 90+
- Samsung Internet 14+

## Implementation Phases

### Phase 1: Core UI (2-3 weeks)
- Design system setup
- Navigation and layout
- Dashboard page
- Stock chart component

### Phase 2: Trading Features (2-3 weeks)
- Trading interface
- Order execution
- Position management
- Portfolio page

### Phase 3: Analytics & ML (2 weeks)
- Technical indicators
- Forecasting visualizations
- Performance metrics
- Risk analytics

### Phase 4: Content & Research (1-2 weeks)
- News feed
- Sentiment display
- SEC filings viewer
- Company research

### Phase 5: Real-time & Polish (1-2 weeks)
- WebSocket integration
- Animations and transitions
- Performance optimization
- Testing and bug fixes

## Conclusion

This design specification provides a comprehensive, modern UI/UX for UpTrade AI that prioritizes:
- **Professional trader experience** with data-dense layouts
- **Real-time updates** for prices and positions
- **ML-powered insights** prominently displayed
- **Intuitive navigation** with consistent patterns
- **Responsive design** for all devices
- **Accessibility** compliance
- **Performance** optimization

The dark theme reduces eye strain during extended use, while the blue accent colors provide clear visual hierarchy. All components are designed to work seamlessly with the existing FastAPI backend and its 39 endpoints.
