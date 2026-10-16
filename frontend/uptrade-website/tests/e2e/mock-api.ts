import type { Page, Route } from '@playwright/test'
import type { Candle, Quote } from '../../lib/market/types'
import { analyze, backtest, type Strategy } from '../../lib/model/uptrade'

// Deterministic market data so smoke tests never depend on Yahoo
const DAY = 86400
const START = 1_700_000_000

function seed(symbol: string) {
    let h = 0
    for (const ch of symbol) h = (h * 31 + ch.charCodeAt(0)) >>> 0
    return h
}

function candlesFor(symbol: string, n = 400): Candle[] {
    const s = seed(symbol)
    const base = 20 + (s % 500)
    return Array.from({ length: n }, (_, i) => {
        const c = base * (1 + 0.0005 * i) * (1 + 0.02 * Math.sin(i / 5 + s) + 0.006 * Math.sin(i * 1.3))
        return { time: START + i * DAY, open: c * 0.997, high: c * 1.01, low: c * 0.99, close: c, volume: 1_000_000 + (i % 9) * 50_000 }
    })
}

function quoteFor(symbol: string, candles = candlesFor(symbol)): Quote {
    const last = candles[candles.length - 1], prev = candles[candles.length - 2]
    const crypto = symbol.endsWith('-USD')
    return {
        symbol, name: `${symbol} Test Co.`, price: last.close, previousClose: prev.close,
        change: last.close - prev.close, changePercent: ((last.close - prev.close) / prev.close) * 100,
        dayHigh: last.high, dayLow: last.low, volume: last.volume,
        fiftyTwoWeekHigh: Math.max(...candles.map((c) => c.high)), fiftyTwoWeekLow: Math.min(...candles.map((c) => c.low)),
        currency: 'USD', exchange: crypto ? 'CCC' : 'NasdaqGS', type: crypto ? 'CRYPTOCURRENCY' : symbol.startsWith('^') ? 'INDEX' : 'EQUITY', time: last.time,
    }
}

const symbolsParam = (url: URL) => (url.searchParams.get('symbols') || '').split(',').filter(Boolean).map((s) => s.toUpperCase())

function respond(route: Route, body: unknown) {
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) })
}

export async function mockApi(page: Page) {
    await page.route('**/api/**', async (route) => {
        const url = new URL(route.request().url())
        const p = url.pathname
        const symbol = (url.searchParams.get('symbol') || 'AAPL').toUpperCase()

        if (p === '/api/market/quotes') return respond(route, { quotes: Object.fromEntries(symbolsParam(url).map((s) => [s, quoteFor(s)])) })
        if (p === '/api/market/bars') {
            const candles = candlesFor(symbol)
            return respond(route, { symbol, interval: url.searchParams.get('interval') || '1D', quote: quoteFor(symbol, candles), candles })
        }
        if (p === '/api/market/overview') {
            return respond(route, { items: symbolsParam(url).map((s) => { const c = candlesFor(s); return { symbol: s, quote: quoteFor(s, c), spark: c.slice(-66).map((x) => ({ time: x.time, value: x.close })) } }) })
        }
        if (p === '/api/market/search') {
            return respond(route, { quotes: [{ symbol: 'TSLA', name: 'Tesla, Inc.', exchange: 'NASDAQ', type: 'EQUITY' }], news: [] })
        }
        if (p === '/api/model/analyze') {
            const candles = candlesFor(symbol)
            return respond(route, { symbol, quote: quoteFor(symbol, candles), analysis: analyze(candles), disclaimer: 'Test data.' })
        }
        if (p === '/api/model/scan') {
            return respond(route, {
                items: symbolsParam(url).map((s) => {
                    const c = candlesFor(s), a = analyze(c), q = quoteFor(s, c)
                    return { symbol: s, name: q.name, price: q.price, changePercent: q.changePercent, score: a.scores.composite, stance: a.stance, signal: a.recommendation.signal, projectedChangePct: a.recommendation.projectedChangePct, return3M: a.stats.return3M, rsi: a.stats.rsi }
                }),
                disclaimer: 'Test data.',
            })
        }
        if (p === '/api/model/backtest') {
            const strategy = (url.searchParams.get('strategy') || 'sma_cross') as Strategy
            return respond(route, { symbol, result: backtest(candlesFor(symbol, 900), strategy) })
        }
        if (p === '/api/model/sentiment') {
            const now = Math.floor(Date.now() / 1000)
            return respond(route, {
                symbol, model: 'Finance lexicon', overall: 0.2,
                items: [
                    { title: `${symbol} shares rise after results`, publisher: 'Test Wire', link: 'https://example.com/a', time: now - 3600, score: 1, label: 'positive' },
                    { title: `${symbol} faces probe`, publisher: 'Test Wire', link: 'https://example.com/b', time: now - 7200, score: -1, label: 'negative' },
                ],
            })
        }
        return route.continue()
    })
}
