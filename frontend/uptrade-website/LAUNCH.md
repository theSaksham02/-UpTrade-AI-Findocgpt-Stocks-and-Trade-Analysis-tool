# UpTrade — launch notes

## What ships

- **Terminal** (`/app`, also `/dashboard`): TradingView-style charting on real market data.
  - Intervals 5m / 15m / 1h / 1D / 1W / 1M; candles, hollow, Heikin Ashi, bars, line, area; log scale
  - Indicators: volume, SMA 20/50/200, EMA 20, Bollinger Bands, RSI and MACD in separate panes
  - Drawing tools: trend line, horizontal line (Alt+T / Alt+H, Esc to cancel)
  - 1, 2 or 4 chart layouts; type anywhere (or ⌘K) to search symbols
  - Watchlist with live quotes; layout, watchlist and indicators are saved in the browser
  - Right panel: **UpTrade AI** (score, forecast, signals, anomalies), **News** (headline sentiment), **Backtest**
  - Deep links: `/app?symbol=TSLA`; `/app/tradex` opens Backtest, `/app/visualx` opens News
- **UpTrade model** (`lib/model/uptrade.ts`), a TypeScript port of the Python pipeline:
  - ARIMA(5,1,0) 30-session forecast with 95% band (`forecasting_model.py`). Checked against statsmodels on the same BTC data: forecasts agree to within 0.05%.
  - Buy/Hold/Sell thresholds from `investment_strategy.py`
  - Volume-spike anomalies from `anomaly_detection.py`, plus 3σ price-move anomalies
  - Composite score (technical 35%, momentum 30%, risk 15%, forecast 20%)
  - Backtester (long/flat, next-bar fills, fees): walk-forward ARIMA, SMA 50/200, MACD, RSI 30/70
- **API routes** (Next.js; no separate backend needed):

  | Route | Purpose | Cache |
  |---|---|---|
  | `GET /api/market/quotes?symbols=A,B` | quotes, up to 40 symbols | 15s |
  | `GET /api/market/bars?symbol=&interval=` | OHLCV | 30s–1h |
  | `GET /api/market/search?q=` | symbol search | 5m |
  | `GET /api/model/analyze?symbol=` | UpTrade model output | 10m |
  | `GET /api/model/backtest?symbol=&strategy=&feeBps=` | backtest | 10m |
  | `GET /api/model/sentiment?symbol=` | headlines and sentiment | 15m |

## Deploy

**Vercel:** import the repo and set **Root Directory = `frontend/uptrade-website`** (framework is detected; `vercel.json` lives there).
**Netlify:** the existing root `netlify.toml` already points at this folder.

Optional environment variables (see `.env.example`):

- `HUGGINGFACE_API_KEY`: uses FinBERT (`ProsusAI/finbert`) for headline sentiment instead of the word-list fallback.
- `NEXT_PUBLIC_WS_URL`: only for the legacy multi-chart grid; leave unset.

## Known limitations (be upfront about these at launch)

- **Data source:** Yahoo Finance's public endpoints. They are unofficial, can be delayed, and may rate-limit or change without notice. For a commercial launch, swap `lib/market/yahoo.ts` for a licensed feed (Polygon, Finnhub, Alpaca, etc.); the rest of the app only depends on `lib/market/types.ts`.
- **No real authentication.** `/login` and `/signup` are UI only (they store a placeholder token). The terminal is therefore public. Don't advertise accounts until real auth exists.
- **Mobile:** charts and the toolbar work on phones; the right-hand panel (watchlist, AI, news, backtest) is desktop-only (≥768px).
- `next.config.mjs` still has `typescript.ignoreBuildErrors: true` because of existing errors in `components/RotatingText.tsx` and the legacy `tradex/tool` / `visualx/tool` pages (now redirected). New code type-checks cleanly.
- Model output is for research only; the UI says so next to every forecast and backtest.
