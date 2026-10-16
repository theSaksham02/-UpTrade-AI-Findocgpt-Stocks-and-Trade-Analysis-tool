# UpTrade

A trading terminal that shows its work: live charts for stocks, ETFs, indices and crypto, an open forecasting
model with its error band, factor scores, anomaly markers and five-year backtests. Free beta.

Live: https://up-trade-ai-findocgpt-stocks-and-tr.vercel.app

## Repository

| Path | What it is |
|---|---|
| `frontend/uptrade-website/` | The product: a Next.js 14 app (site, terminal, dashboard, API routes). Deployed on Vercel. |
| `frontend/uptrade-website/lib/model/uptrade.ts` | The UpTrade model in TypeScript: ARIMA(5,1,0) forecast, score, anomalies, backtester. |
| `frontend/uptrade-website/supabase/migrations/` | Database schema for accounts (watchlists, waitlist, contact messages). |
| `research/` | The original Python pipeline (statsmodels ARIMA, strategy rules, anomaly detection). The reference implementation the TypeScript model is tested against. |
| `data/` | Research datasets. Not used by the app. |

## Run the app locally

```bash
cd frontend/uptrade-website
cp .env.example .env.local   # optional: add Supabase keys to enable accounts
npm install
npm run dev                  # http://localhost:3000
```

Everything works without environment variables except accounts, the waitlist and the contact form.

## Checks

```bash
cd frontend/uptrade-website
npm run typecheck
npm test            # unit tests (Vitest)
npm run test:e2e    # smoke tests (Playwright; builds and starts the app)
```

CI runs all of these on every pull request (`.github/workflows/ci.yml`).

## Deploy

Vercel, with **Root Directory = `frontend/uptrade-website`**. Environment variables and the Supabase setup are
described in [`frontend/uptrade-website/LAUNCH.md`](frontend/uptrade-website/LAUNCH.md).

## Data & disclaimer

Market data comes from Yahoo Finance and may be delayed. Model output is for research and education only and is
not investment advice.
