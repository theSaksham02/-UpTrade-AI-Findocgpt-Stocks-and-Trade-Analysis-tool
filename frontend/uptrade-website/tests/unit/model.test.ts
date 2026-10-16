import { describe, expect, it } from 'vitest'
import type { Candle } from '@/lib/market/types'
import { analyze, backtest, detectAnomalies, forecastARIMA, recommend, STRATEGIES, type Strategy } from '@/lib/model/uptrade'
import fixture from '../fixtures/btc-arima.json'

const DAY = 86400

function candlesFromCloses(closes: number[], start = 1_600_000_000, volume = 1_000_000): Candle[] {
    return closes.map((c, i) => ({ time: start + i * DAY, open: c, high: c, low: c, close: c, volume }))
}

// Deterministic, gently trending series with small wiggles (no randomness in tests)
function wavy(n: number, start = 100) {
    return Array.from({ length: n }, (_, i) => start * (1 + 0.0004 * i) * (1 + 0.01 * Math.sin(i / 3) + 0.004 * Math.sin(i * 1.7)))
}

describe('forecastARIMA', () => {
    const candles = fixture.times.map((t, i) => ({ time: t, open: fixture.closes[i], high: fixture.closes[i], low: fixture.closes[i], close: fixture.closes[i], volume: 0 }))

    it('matches statsmodels ARIMA(5,1,0) on real BTC closes within 0.5%', () => {
        const fc = forecastARIMA(candles, 30, { crypto: true })
        const end = fc.points[fc.points.length - 1].value
        expect(Math.abs(end / fixture.statsmodels.forecastEnd - 1)).toBeLessThan(0.005)
        expect(fc.points).toHaveLength(30)
        expect(fc.order).toEqual([5, 1, 0])
    })

    it('has a 95% band that contains the forecast and widens with the horizon', () => {
        const pts = forecastARIMA(candles, 30, { crypto: true }).points
        for (const p of pts) expect(p.lower).toBeLessThanOrEqual(p.value)
        for (const p of pts) expect(p.upper).toBeGreaterThanOrEqual(p.value)
        expect(pts[29].upper - pts[29].lower).toBeGreaterThan(pts[0].upper - pts[0].lower)
    })

    it('skips weekends for equities but not for crypto', () => {
        const eq = forecastARIMA(candles, 10, { crypto: false }).points
        for (const p of eq) expect([0, 6]).not.toContain(new Date(p.time * 1000).getUTCDay())
        const cr = forecastARIMA(candles, 10, { crypto: true }).points
        expect(cr[1].time - cr[0].time).toBe(DAY)
    })
})

describe('recommend (investment_strategy.py thresholds)', () => {
    it.each([
        [105.1, 'Strong Buy'],
        [105, 'Buy'],
        [101.6, 'Buy'],
        [101.5, 'Hold'],
        [100, 'Hold'],
        [98.5, 'Hold'],
        [98.4, 'Sell'],
        [95, 'Sell'],
        [94.9, 'Strong Sell'],
    ])('end price %s from 100 → %s', (end, signal) => {
        expect(recommend(100, end, 30).signal).toBe(signal)
    })
})

describe('detectAnomalies', () => {
    it('flags a sudden price jump and a volume spike, and nothing on quiet days', () => {
        // A one-off 15% level shift on day 100
        const closes = wavy(120).map((c, i) => (i >= 100 ? c * 1.15 : c))
        const candles = candlesFromCloses(closes)
        candles[80].volume = 10_000_000
        // give volumes a little variance so the rolling std isn't zero
        candles.forEach((c, i) => { if (i !== 80) c.volume = 1_000_000 + (i % 7) * 10_000 })
        const found = detectAnomalies(candles)
        expect(found.some((a) => a.kind === 'return' && a.time === candles[100].time && a.value > 3)).toBe(true)
        expect(found.some((a) => a.kind === 'volume' && a.time === candles[80].time)).toBe(true)
        expect(found.every((a) => a.time === candles[100].time || a.time === candles[80].time)).toBe(true)
    })
})

describe('backtest', () => {
    const candles = candlesFromCloses(wavy(900))

    it.each(Object.keys(STRATEGIES) as Strategy[])('%s never looks ahead', (strategy) => {
        // Results up to bar N must not change when later bars are added
        const n = 760
        const short = backtest(candles.slice(0, n), strategy)
        const full = backtest(candles, strategy)
        const fullByTime = new Map(full.equity.map((p) => [p.time, p.value]))
        for (const p of short.equity) expect(fullByTime.get(p.time)).toBeCloseTo(p.value, 10)
    })

    it('earns nothing on a flat price', () => {
        const flat = candlesFromCloses(Array(400).fill(50))
        for (const s of Object.keys(STRATEGIES) as Strategy[]) {
            const r = backtest(flat, s, { feeBps: 0 })
            expect(r.totalReturn).toBeCloseTo(0, 10)
            expect(r.buyHoldReturn).toBeCloseTo(0, 10)
        }
    })

    it('charges fees on each position change', () => {
        const free = backtest(candles, 'macd', { feeBps: 0 })
        const costly = backtest(candles, 'macd', { feeBps: 50 })
        expect(free.trades).toBeGreaterThan(0)
        expect(costly.totalReturn).toBeLessThan(free.totalReturn)
    })
})

describe('analyze', () => {
    it('returns bounded scores and a consistent stance', () => {
        const a = analyze(candlesFromCloses(wavy(400)))
        for (const v of Object.values(a.scores)) {
            expect(v).toBeGreaterThanOrEqual(0)
            expect(v).toBeLessThanOrEqual(100)
        }
        expect(a.stance).toBe(a.scores.composite >= 65 ? 'Bullish' : a.scores.composite <= 35 ? 'Bearish' : 'Neutral')
        expect(a.forecast).toHaveLength(30)
    })

    it('refuses too little history', () => {
        expect(() => analyze(candlesFromCloses(wavy(30)))).toThrow()
    })
})
