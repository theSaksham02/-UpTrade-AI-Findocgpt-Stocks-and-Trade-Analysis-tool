// UpTrade model — TypeScript port of the Python pipeline
// (forecasting_model.py, investment_strategy.py, anomaly_detection.py)
// plus factor scoring and a walk-forward backtester.
//
// Pure functions: safe to run in API routes or in the browser.

import type { Candle } from '@/lib/market/types'

export type Series = (number | null)[]

// ------------------------------------------------------------
// Indicators
// ------------------------------------------------------------

export function sma(values: number[], n: number): Series {
    const out: Series = new Array(values.length).fill(null)
    let sum = 0
    for (let i = 0; i < values.length; i++) {
        sum += values[i]
        if (i >= n) sum -= values[i - n]
        if (i >= n - 1) out[i] = sum / n
    }
    return out
}

export function ema(values: number[], n: number): Series {
    const out: Series = new Array(values.length).fill(null)
    if (values.length < n) return out
    const k = 2 / (n + 1)
    let prev = values.slice(0, n).reduce((a, b) => a + b, 0) / n
    out[n - 1] = prev
    for (let i = n; i < values.length; i++) {
        prev = values[i] * k + prev * (1 - k)
        out[i] = prev
    }
    return out
}

export function rsi(values: number[], n = 14): Series {
    const out: Series = new Array(values.length).fill(null)
    if (values.length <= n) return out
    let gain = 0, loss = 0
    for (let i = 1; i <= n; i++) {
        const d = values[i] - values[i - 1]
        if (d > 0) gain += d; else loss -= d
    }
    gain /= n; loss /= n
    out[n] = loss === 0 ? 100 : 100 - 100 / (1 + gain / loss)
    for (let i = n + 1; i < values.length; i++) {
        const d = values[i] - values[i - 1]
        gain = (gain * (n - 1) + Math.max(d, 0)) / n
        loss = (loss * (n - 1) + Math.max(-d, 0)) / n
        out[i] = loss === 0 ? 100 : 100 - 100 / (1 + gain / loss)
    }
    return out
}

export function macd(values: number[], fast = 12, slow = 26, signal = 9) {
    const ef = ema(values, fast), es = ema(values, slow)
    const line: Series = values.map((_, i) => (ef[i] != null && es[i] != null ? ef[i]! - es[i]! : null))
    const start = line.findIndex((v) => v != null)
    const sig: Series = new Array(values.length).fill(null)
    if (start >= 0) {
        const sub = ema(line.slice(start) as number[], signal)
        sub.forEach((v, i) => (sig[start + i] = v))
    }
    const hist: Series = line.map((v, i) => (v != null && sig[i] != null ? v - sig[i]! : null))
    return { line, signal: sig, hist }
}

export function bollinger(values: number[], n = 20, k = 2) {
    const mid = sma(values, n)
    const upper: Series = new Array(values.length).fill(null)
    const lower: Series = new Array(values.length).fill(null)
    for (let i = n - 1; i < values.length; i++) {
        const m = mid[i]!
        let v = 0
        for (let j = i - n + 1; j <= i; j++) v += (values[j] - m) ** 2
        const sd = Math.sqrt(v / n)
        upper[i] = m + k * sd
        lower[i] = m - k * sd
    }
    return { mid, upper, lower }
}

export function atr(candles: Candle[], n = 14): Series {
    const tr = candles.map((c, i) =>
        i === 0 ? c.high - c.low : Math.max(c.high - c.low, Math.abs(c.high - candles[i - 1].close), Math.abs(c.low - candles[i - 1].close)),
    )
    const out: Series = new Array(candles.length).fill(null)
    if (candles.length < n) return out
    let prev = tr.slice(0, n).reduce((a, b) => a + b, 0) / n
    out[n - 1] = prev
    for (let i = n; i < tr.length; i++) {
        prev = (prev * (n - 1) + tr[i]) / n
        out[i] = prev
    }
    return out
}

// ------------------------------------------------------------
// Forecast: ARIMA(p,1,0) — same order as forecasting_model.py (5,1,0),
// fitted by conditional least squares, no constant (statsmodels default for d=1).
// ------------------------------------------------------------

function solve(A: number[][], b: number[]): number[] | null {
    const n = b.length
    const M = A.map((row, i) => [...row, b[i]])
    for (let c = 0; c < n; c++) {
        let piv = c
        for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[piv][c])) piv = r
        if (Math.abs(M[piv][c]) < 1e-12) return null
        ;[M[c], M[piv]] = [M[piv], M[c]]
        for (let r = 0; r < n; r++) {
            if (r === c) continue
            const f = M[r][c] / M[c][c]
            for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k]
        }
    }
    return M.map((row, i) => row[n] / row[i])
}

export function fitAR(diffs: number[], p: number) {
    const XtX = Array.from({ length: p }, () => new Array(p).fill(0))
    const Xty = new Array(p).fill(0)
    for (let t = p; t < diffs.length; t++) {
        for (let i = 0; i < p; i++) {
            Xty[i] += diffs[t - 1 - i] * diffs[t]
            for (let j = 0; j < p; j++) XtX[i][j] += diffs[t - 1 - i] * diffs[t - 1 - j]
        }
    }
    const phi = solve(XtX, Xty) ?? new Array(p).fill(0)
    let sse = 0
    for (let t = p; t < diffs.length; t++) {
        let pred = 0
        for (let i = 0; i < p; i++) pred += phi[i] * diffs[t - 1 - i]
        sse += (diffs[t] - pred) ** 2
    }
    const sigma = Math.sqrt(sse / Math.max(1, diffs.length - 2 * p))
    return { phi, sigma }
}

export interface ForecastPoint {
    time: number
    value: number
    lower: number
    upper: number
}

export function forecastARIMA(candles: Candle[], steps = 30, opts: { p?: number; window?: number; crypto?: boolean } = {}) {
    const p = opts.p ?? 5
    const closes = candles.slice(-(opts.window ?? 756)).map((c) => c.close)
    const diffs = closes.slice(1).map((c, i) => c - closes[i])
    const { phi, sigma } = fitAR(diffs, p)

    // psi weights of the differenced process → variance of the level forecast
    const psi = [1]
    for (let j = 1; j < steps; j++) {
        let v = 0
        for (let i = 0; i < p && i < j; i++) v += phi[i] * psi[j - 1 - i]
        psi.push(v)
    }

    const hist = diffs.slice(-p).reverse()
    let level = closes[closes.length - 1]
    let t = candles[candles.length - 1].time
    let cumPsi = 0, varSum = 0
    const out: ForecastPoint[] = []
    for (let h = 0; h < steps; h++) {
        let d = 0
        for (let i = 0; i < p; i++) d += phi[i] * (hist[i] ?? 0)
        hist.unshift(d)
        hist.length = p
        level += d
        cumPsi += psi[h]
        varSum += cumPsi * cumPsi
        const band = 1.96 * sigma * Math.sqrt(varSum)
        t = nextTradingTime(t, opts.crypto)
        out.push({ time: t, value: level, lower: Math.max(0, level - band), upper: level + band })
    }
    return { points: out, phi, sigma, order: [p, 1, 0] as const }
}

function nextTradingTime(t: number, crypto?: boolean) {
    let next = t + 86400
    if (!crypto) {
        while ([0, 6].includes(new Date(next * 1000).getUTCDay())) next += 86400
    }
    return next
}

// ------------------------------------------------------------
// Recommendation — same thresholds as investment_strategy.py
// ------------------------------------------------------------

export type Signal = 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell'

export function recommend(last: number, end: number, horizon: number): { signal: Signal; projectedChangePct: number; reason: string } {
    const pct = ((end - last) / last) * 100
    const f = (n: number) => n.toFixed(2)
    if (pct > 5) return { signal: 'Strong Buy', projectedChangePct: pct, reason: `The forecast projects a ${f(pct)}% rise over ${horizon} sessions, from ${f(last)} to ${f(end)}.` }
    if (pct > 1.5) return { signal: 'Buy', projectedChangePct: pct, reason: `A moderate upward trend is expected, with a projected gain of ${f(pct)}% over ${horizon} sessions.` }
    if (pct < -5) return { signal: 'Strong Sell', projectedChangePct: pct, reason: `The forecast projects a ${f(pct)}% decline over ${horizon} sessions, indicating strong bearish pressure.` }
    if (pct < -1.5) return { signal: 'Sell', projectedChangePct: pct, reason: `A moderate downward trend is expected, with a projected change of ${f(pct)}% over ${horizon} sessions.` }
    return { signal: 'Hold', projectedChangePct: pct, reason: `The forecast shows a projected change of only ${f(pct)}% over ${horizon} sessions — not a strong enough trend for a buy or sell signal.` }
}

// ------------------------------------------------------------
// Anomalies — anomaly_detection.py (volume) + price-move z-scores
// ------------------------------------------------------------

export interface Anomaly {
    time: number
    kind: 'volume' | 'return'
    value: number
    detail: string
}

export function detectAnomalies(candles: Candle[], window = 30): Anomaly[] {
    const out: Anomaly[] = []
    const rets = candles.map((c, i) => (i === 0 ? 0 : c.close / candles[i - 1].close - 1))
    for (let i = window + 1; i < candles.length; i++) {
        const rw = rets.slice(i - window, i)
        const rm = rw.reduce((a, b) => a + b, 0) / window
        const rs = Math.sqrt(rw.reduce((a, b) => a + (b - rm) ** 2, 0) / (window - 1))
        const z = rs ? (rets[i] - rm) / rs : 0
        if (Math.abs(z) > 3) {
            out.push({ time: candles[i].time, kind: 'return', value: z, detail: `${(rets[i] * 100).toFixed(2)}% move (${z.toFixed(1)}σ vs ${window}-day)` })
        }
        const vw = candles.slice(i - window, i).map((c) => c.volume)
        if (vw.every((v) => v > 0) && candles[i].volume > 0) {
            const vm = vw.reduce((a, b) => a + b, 0) / window
            const vs = Math.sqrt(vw.reduce((a, b) => a + (b - vm) ** 2, 0) / (window - 1))
            if (candles[i].volume > vm + 2.5 * vs) {
                out.push({ time: candles[i].time, kind: 'volume', value: candles[i].volume / vm, detail: `Volume ${(candles[i].volume / vm).toFixed(1)}× the ${window}-day average` })
            }
        }
    }
    return out
}

// ------------------------------------------------------------
// Factor scores & full analysis
// ------------------------------------------------------------

const clamp = (v: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v))
const ret = (closes: number[], n: number) => (closes.length > n ? closes[closes.length - 1] / closes[closes.length - 1 - n] - 1 : 0)

export function annualizedVol(candles: Candle[], lookback = 252, periodsPerYear = 252) {
    const c = candles.slice(-(lookback + 1)).map((x) => x.close)
    const r = c.slice(1).map((v, i) => Math.log(v / c[i]))
    const m = r.reduce((a, b) => a + b, 0) / (r.length || 1)
    return Math.sqrt(r.reduce((a, b) => a + (b - m) ** 2, 0) / Math.max(1, r.length - 1)) * Math.sqrt(periodsPerYear)
}

export function maxDrawdown(values: number[]) {
    let peak = -Infinity, mdd = 0
    for (const v of values) {
        peak = Math.max(peak, v)
        mdd = Math.min(mdd, v / peak - 1)
    }
    return mdd
}

export interface Analysis {
    asOf: number
    lastPrice: number
    horizon: number
    forecast: ForecastPoint[]
    model: { name: string; order: readonly number[]; coefficients: number[]; residualSigma: number; trainingBars: number }
    recommendation: ReturnType<typeof recommend>
    scores: { technical: number; momentum: number; risk: number; forecast: number; composite: number }
    stance: 'Bullish' | 'Neutral' | 'Bearish'
    signals: { label: string; value: string; bullish: boolean | null }[]
    stats: { return1M: number; return3M: number; return6M: number; return1Y: number; volatility: number; maxDrawdown1Y: number; rsi: number | null; atrPct: number | null }
    anomalies: Anomaly[]
}

export function analyze(candles: Candle[], opts: { crypto?: boolean; horizon?: number } = {}): Analysis {
    if (candles.length < 60) throw new Error('Not enough history to analyze (need 60+ daily bars)')
    const horizon = opts.horizon ?? 30
    const ppy = opts.crypto ? 365 : 252
    const closes = candles.map((c) => c.close)
    const last = closes[closes.length - 1]
    const i = closes.length - 1

    const s50 = sma(closes, 50)[i], s200 = sma(closes, 200)[i]
    const r = rsi(closes)[i]
    const m = macd(closes)
    const a = atr(candles)[i]
    const fc = forecastARIMA(candles, horizon, { crypto: opts.crypto })
    const rec = recommend(last, fc.points[fc.points.length - 1].value, horizon)

    // Technical: trend + momentum oscillators (each 20 pts)
    let tech = 0
    const signals: Analysis['signals'] = []
    const add = (label: string, value: string, bullish: boolean | null, pts: number) => {
        signals.push({ label, value, bullish })
        tech += pts
    }
    if (s50 != null) add('Price vs SMA 50', last > s50 ? 'Above' : 'Below', last > s50, last > s50 ? 20 : 0)
    if (s200 != null) add('Price vs SMA 200', last > s200 ? 'Above' : 'Below', last > s200, last > s200 ? 20 : 0)
    if (s50 != null && s200 != null) add('SMA 50/200', s50 > s200 ? 'Golden cross' : 'Death cross', s50 > s200, s50 > s200 ? 20 : 0)
    const h = m.hist[i]
    if (h != null) add('MACD histogram', h > 0 ? 'Positive' : 'Negative', h > 0, h > 0 ? 20 : 0)
    if (r != null) {
        const zone = r > 70 ? 'Overbought' : r < 30 ? 'Oversold' : 'Neutral'
        add('RSI (14)', `${r.toFixed(1)} · ${zone}`, r > 70 ? false : r < 30 ? true : r >= 50, r >= 40 && r <= 70 ? 20 : 10)
    }
    const maxTech = (s50 != null ? 20 : 0) + (s200 != null ? 20 : 0) + (s50 != null && s200 != null ? 20 : 0) + (h != null ? 20 : 0) + (r != null ? 20 : 0)
    const technical = maxTech ? (tech / maxTech) * 100 : 50

    const r1 = ret(closes, 21), r3 = ret(closes, 63), r6 = ret(closes, 126), r12 = ret(closes, opts.crypto ? 365 : 252)
    const momentum = clamp(50 + 50 * Math.tanh((0.2 * r1 + 0.3 * r3 + 0.5 * r6) / 0.25))
    const vol = annualizedVol(candles, 252, ppy)
    const risk = clamp(100 * Math.exp(-vol / 0.6))
    const forecastScore = clamp(50 + 50 * Math.tanh(rec.projectedChangePct / 10))
    const composite = 0.35 * technical + 0.3 * momentum + 0.15 * risk + 0.2 * forecastScore

    return {
        asOf: candles[i].time,
        lastPrice: last,
        horizon,
        forecast: fc.points,
        model: { name: 'ARIMA', order: fc.order, coefficients: fc.phi, residualSigma: fc.sigma, trainingBars: Math.min(756, candles.length) },
        recommendation: rec,
        scores: { technical: Math.round(technical), momentum: Math.round(momentum), risk: Math.round(risk), forecast: Math.round(forecastScore), composite: Math.round(composite) },
        stance: composite >= 65 ? 'Bullish' : composite <= 35 ? 'Bearish' : 'Neutral',
        signals,
        stats: {
            return1M: r1, return3M: r3, return6M: r6, return1Y: r12,
            volatility: vol,
            maxDrawdown1Y: maxDrawdown(closes.slice(-252)),
            rsi: r,
            atrPct: a != null ? a / last : null,
        },
        anomalies: detectAnomalies(candles).slice(-50),
    }
}

// ------------------------------------------------------------
// Backtester (long/flat, decided at close t, applied to t→t+1: no lookahead)
// ------------------------------------------------------------

export type Strategy = 'sma_cross' | 'macd' | 'rsi_reversion' | 'arima'

export const STRATEGIES: Record<Strategy, string> = {
    arima: 'UpTrade ARIMA (walk-forward)',
    sma_cross: 'SMA 50/200 trend',
    macd: 'MACD crossover',
    rsi_reversion: 'RSI 30/70 mean reversion',
}

function positions(candles: Candle[], strategy: Strategy): number[] {
    const closes = candles.map((c) => c.close)
    const pos = new Array(closes.length).fill(0)
    if (strategy === 'sma_cross') {
        const f = sma(closes, 50), s = sma(closes, 200)
        closes.forEach((_, i) => (pos[i] = f[i] != null && s[i] != null && f[i]! > s[i]! ? 1 : 0))
    } else if (strategy === 'macd') {
        const m = macd(closes)
        closes.forEach((_, i) => (pos[i] = m.line[i] != null && m.signal[i] != null && m.line[i]! > m.signal[i]! ? 1 : 0))
    } else if (strategy === 'rsi_reversion') {
        const r = rsi(closes)
        let inPos = 0
        closes.forEach((_, i) => {
            if (r[i] != null && r[i]! < 30) inPos = 1
            else if (r[i] != null && r[i]! > 70) inPos = 0
            pos[i] = inPos
        })
    } else {
        // Refit ARIMA(5,1,0) every 21 bars on the trailing 500 diffs; long if the
        // 5-step-ahead forecast is above the current close.
        const p = 5, refit = 21, train = 500
        let phi: number[] | null = null
        for (let i = train + p; i < closes.length; i++) {
            if (!phi || (i - train - p) % refit === 0) {
                const w = closes.slice(i - train, i + 1)
                phi = fitAR(w.slice(1).map((c, k) => c - w[k]), p).phi
            }
            const hist: number[] = []
            for (let k = 0; k < p; k++) hist.push(closes[i - k] - closes[i - k - 1])
            let sum = 0
            for (let s = 0; s < 5; s++) {
                let d = 0
                for (let k = 0; k < p; k++) d += phi[k] * hist[k]
                hist.unshift(d)
                hist.length = p
                sum += d
            }
            pos[i] = sum > 0 ? 1 : 0
        }
    }
    return pos
}

export interface BacktestResult {
    strategy: Strategy
    label: string
    start: number
    end: number
    totalReturn: number
    cagr: number
    sharpe: number
    maxDrawdown: number
    winRate: number
    profitFactor: number
    trades: number
    exposure: number
    buyHoldReturn: number
    feeBps: number
    equity: { time: number; value: number }[]
    buyHold: { time: number; value: number }[]
}

export function backtest(candles: Candle[], strategy: Strategy, opts: { crypto?: boolean; feeBps?: number } = {}): BacktestResult {
    const feeBps = opts.feeBps ?? 10
    const fee = feeBps / 10000
    const ppy = opts.crypto ? 365 : 252
    const pos = positions(candles, strategy)
    // Skip warm-up so strategies are compared over the same window
    const start = Math.min(candles.length - 2, strategy === 'arima' ? 505 : 200)

    let eq = 1, bh = 1, prevPos = 0
    const equity = [{ time: candles[start].time, value: 1 }]
    const buyHold = [{ time: candles[start].time, value: 1 }]
    const daily: number[] = []
    const tradeReturns: number[] = []
    let tradeEq = 1, trades = 0, exposed = 0

    for (let i = start; i < candles.length - 1; i++) {
        const r = candles[i + 1].close / candles[i].close - 1
        const p = pos[i]
        let dr = p * r
        if (p !== prevPos) {
            dr -= fee
            if (p === 1) { trades++; tradeEq = 1 } else tradeReturns.push(tradeEq - 1)
        }
        if (p === 1) { tradeEq *= 1 + r; exposed++ }
        prevPos = p
        eq *= 1 + dr
        bh *= 1 + r
        daily.push(dr)
        equity.push({ time: candles[i + 1].time, value: eq })
        buyHold.push({ time: candles[i + 1].time, value: bh })
    }
    if (prevPos === 1) tradeReturns.push(tradeEq - 1)

    const n = daily.length || 1
    const mean = daily.reduce((a, b) => a + b, 0) / n
    const sd = Math.sqrt(daily.reduce((a, b) => a + (b - mean) ** 2, 0) / Math.max(1, n - 1))
    const years = n / ppy
    const wins = tradeReturns.filter((x) => x > 0)
    const losses = tradeReturns.filter((x) => x <= 0)
    const grossLoss = Math.abs(losses.reduce((a, b) => a + b, 0))

    return {
        strategy,
        label: STRATEGIES[strategy],
        start: candles[start].time,
        end: candles[candles.length - 1].time,
        totalReturn: eq - 1,
        cagr: years > 0 ? eq ** (1 / years) - 1 : 0,
        sharpe: sd ? (mean / sd) * Math.sqrt(ppy) : 0,
        maxDrawdown: maxDrawdown(equity.map((e) => e.value)),
        winRate: tradeReturns.length ? wins.length / tradeReturns.length : 0,
        profitFactor: grossLoss ? wins.reduce((a, b) => a + b, 0) / grossLoss : wins.length ? Infinity : 0,
        trades,
        exposure: exposed / n,
        buyHoldReturn: bh - 1,
        feeBps,
        equity,
        buyHold,
    }
}
