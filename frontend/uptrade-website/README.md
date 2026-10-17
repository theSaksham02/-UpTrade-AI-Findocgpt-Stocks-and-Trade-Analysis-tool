# UpTrade web app

Next.js 14 (App Router) app for the UpTrade site, terminal (`/app`) and dashboard (`/dashboard`).
See the [repository README](../../README.md) for setup, checks and deployment, and [LAUNCH.md](LAUNCH.md) for
environment variables and the Supabase setup.

| Path | Purpose |
|---|---|
| `app/(landing)/` | Marketing pages, markets, dashboard, legal |
| `app/app/` | The terminal |
| `app/api/market/*` | Quotes, bars, search, overview (Yahoo Finance, cached) |
| `app/api/model/*` | Model output: analyze, scan, backtest, sentiment |
| `components/uptrade-terminal/` | Terminal UI: chart panel, watchlist, insights panels |
| `components/site/` | Site header/footer, home, markets, dashboard |
| `lib/model/` | UpTrade model and headline sentiment |
| `lib/market/` | Yahoo Finance client and API helpers |
| `lib/supabase/` | Supabase browser/server clients |
| `tests/` | Unit (`tests/unit`) and smoke (`tests/e2e`) tests |
