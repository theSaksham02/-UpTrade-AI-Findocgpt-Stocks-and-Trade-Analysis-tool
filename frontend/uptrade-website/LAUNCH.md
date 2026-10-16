# UpTrade — launch notes

## What ships

- **Terminal** (`/app`, also `/dashboard`): TradingView-style charting on real market data.
  - Intervals 5m / 15m / 1h / 1D / 1W / 1M; candles, hollow, Heikin Ashi, bars, line, area; log scale
  - Indicators: volume, SMA 20/50/200, EMA 20, Bollinger Bands, RSI and MACD in separate panes
  - Drawing tools: trend line, horizontal line (Alt+T / Alt+H, Esc to cancel)
  - 1, 2 or 4 chart layouts; type anywhere (or ⌘K) to search symbols
  - Watchlist with live quotes; layout, watchlist and indicators are saved in the browser, and the watchlist syncs to the user's account when signed in
  - Right panel: **UpTrade AI** (score, forecast, signals, anomalies), **News** (headline sentiment), **Backtest**
  - Deep links: `/app?symbol=TSLA`; `/app/tradex` opens Backtest, `/app/visualx` opens News
- **UpTrade model** (`lib/model/uptrade.ts`), a TypeScript port of the Python pipeline:
  - ARIMA(5,1,0) 30-session forecast with 95% band (`forecasting_model.py`). Checked against statsmodels on the same BTC data: forecasts agree to within 0.05%.
  - Buy/Hold/Sell thresholds from `investment_strategy.py`
  - Volume-spike anomalies from `anomaly_detection.py`, plus 3σ price-move anomalies
  - Composite score (technical 35%, momentum 30%, risk 15%, forecast 20%)
  - Backtester (long/flat, next-bar fills, fees): walk-forward ARIMA, SMA 50/200, MACD, RSI 30/70
- **Accounts** (Supabase Auth): `/signup` and `/login` with email + password or Google, password reset via `/forgot-password` → emailed link → `/reset-password`, sign-out from the account menu in the terminal header. Nothing requires an account; signing in only syncs the watchlist (`public.watchlists`, row-level security so users see only their own row).
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

Environment variables (see `.env.example`):

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (or the legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY`): turn on accounts. Without them the site builds and runs, `/login` says accounts aren't enabled, and the header shows no sign-in button.
- `NEXT_PUBLIC_AUTH_GOOGLE=true`: shows "Continue with Google" on `/login` and `/signup`. Set it only after step 4 below.
- `HUGGINGFACE_API_KEY`: uses FinBERT (`ProsusAI/finbert`) for headline sentiment instead of the word-list fallback.
- `NEXT_PUBLIC_WS_URL`: only for the legacy multi-chart grid; leave unset.

### Setting up accounts (Supabase)

1. Create a Supabase project and copy its URL and publishable key into `.env.local` (locally) and the host's env settings.
2. Create the watchlist table: run `supabase/migrations/20261016000000_watchlists.sql` in the SQL editor (or `supabase db push`).
3. **Authentication → URL Configuration:** set Site URL to the production origin and add `http://localhost:3000/auth/callback` and `https://<your-domain>/auth/callback` to Redirect URLs. Email-confirmation, password-reset and Google sign-in links all land on `/auth/callback` (reset links add `?next=/reset-password`, the same pattern sign-up uses for `?next=`).
4. **Google sign-in (optional):** create an OAuth client in Google Cloud Console (type *Web application*, authorized redirect URI `https://<project-ref>.supabase.co/auth/v1/callback`), then paste its client ID and secret into Supabase → Authentication → Providers → Google, and set `NEXT_PUBLIC_AUTH_GOOGLE=true`.
5. **Security:** turn on leaked-password protection (Authentication → Policies); the Supabase security advisor flags it as off by default.
6. **Email:** Supabase's built-in mailer is rate-limited (a few emails per hour) and meant for testing. Configure custom SMTP (Authentication → Emails) before launch, or turn off "Confirm email" if you accept unverified addresses.

How it fits together: `middleware.ts` refreshes the session cookie on page requests (it never blocks a page), `lib/supabase/*` creates the browser and server clients, `app/auth/callback` exchanges the OAuth/email code for a session, and `components/uptrade-terminal/use-watchlist-sync.ts` mirrors the watchlist (account copy wins on sign-in; a new account is seeded from the browser's list).

## Known limitations (be upfront about these at launch)

- **Data source:** Yahoo Finance's public endpoints. They are unofficial, can be delayed, and may rate-limit or change without notice. For a commercial launch, swap `lib/market/yahoo.ts` for a licensed feed (Polygon, Finnhub, Alpaca, etc.); the rest of the app only depends on `lib/market/types.ts`.
- **Accounts are optional and gate nothing.** The terminal is public by design; accounts only sync the watchlist. Chart layout and indicators still live in the browser. Password-reset links use PKCE, so they only work in the browser that requested them (opening the email on another device shows "invalid or expired" and offers a new link). The reset email is sent by Supabase's mailer, so it needs custom SMTP (step 6) before real users can receive it.
- **Mobile:** charts and the toolbar work on phones; the right-hand panel (watchlist, AI, news, backtest) is desktop-only (≥768px).
- `next.config.mjs` still has `typescript.ignoreBuildErrors: true` because of existing errors in `components/RotatingText.tsx` and the legacy `tradex/tool` / `visualx/tool` pages (now redirected). New code type-checks cleanly.
- Model output is for research only; the UI says so next to every forecast and backtest.
