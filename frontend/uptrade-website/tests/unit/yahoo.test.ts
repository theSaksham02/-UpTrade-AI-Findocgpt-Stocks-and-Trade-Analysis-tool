import { afterEach, describe, expect, it, vi } from 'vitest'
import { getBars, getQuote, MarketDataError, normalizeSymbol } from '@/lib/market/yahoo'

const DAY = 86400
const T0 = 1_792_000_000

// Minimal Yahoo v8 chart payload
function chart(meta: Record<string, unknown>, rows: (null | { o: number; h: number; l: number; c: number; v: number })[], times?: number[]) {
    const ts = times ?? rows.map((_, i) => T0 + i * DAY)
    const pick = (k: 'o' | 'h' | 'l' | 'c' | 'v') => rows.map((r) => (r ? r[k] : null))
    return {
        chart: {
            result: [{
                meta: { symbol: 'AAPL', longName: 'Apple Inc.', currency: 'USD', instrumentType: 'EQUITY', ...meta },
                timestamp: ts,
                indicators: { quote: [{ open: pick('o'), high: pick('h'), low: pick('l'), close: pick('c'), volume: pick('v') }] },
            }],
            error: null,
        },
    }
}
const bar = (c: number, v = 1000) => ({ o: c, h: c + 1, l: c - 1, c, v })
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

// Five daily closes as Yahoo returned them for AAPL; chartPreviousClose is the close *before the range*
const QUOTE_5D = chart({ regularMarketPrice: 343.865, chartPreviousClose: 336.64 }, [340.97, 341.27, 342.96, 342.0, 343.86].map((c) => bar(c)))

function mockFetch(handler: (url: string) => Response | Promise<Response>) {
    const fn = vi.fn(async (input: RequestInfo | URL) => handler(String(input)))
    vi.stubGlobal('fetch', fn)
    return fn
}

afterEach(() => vi.unstubAllGlobals())

describe('normalizeSymbol', () => {
    it('maps friendly aliases to Yahoo symbols', () => {
        expect(normalizeSymbol(' btc ')).toBe('BTC-USD')
        expect(normalizeSymbol('SPX')).toBe('^GSPC')
        expect(normalizeSymbol('nvda')).toBe('NVDA')
    })
})

describe('getQuote', () => {
    it('measures the daily change from the prior session close, not chartPreviousClose', async () => {
        mockFetch(() => json(QUOTE_5D))
        const q = await getQuote('AAPL')
        expect(q.previousClose).toBe(342.0)
        expect(q.changePercent).toBeCloseTo(((343.865 - 342) / 342) * 100, 6)
        expect(q.name).toBe('Apple Inc.')
    })

    it('falls back to query2 when query1 fails', async () => {
        const fn = mockFetch((url) => (url.startsWith('https://query1.') ? json({}, 503) : json(QUOTE_5D)))
        const q = await getQuote('AAPL')
        expect(q.price).toBe(343.865)
        expect(fn).toHaveBeenCalledTimes(2)
        expect(String(fn.mock.calls[1][0])).toMatch(/^https:\/\/query2\./)
    })

    it('reports an unknown symbol as 404 without retrying', async () => {
        const fn = mockFetch(() => json({ chart: { result: null, error: { description: 'Not found' } } }, 404))
        await expect(getQuote('ZZZZQX')).rejects.toMatchObject({ status: 404 })
        expect(fn).toHaveBeenCalledTimes(1)
    })

    it('returns a 503 MarketDataError when both hosts are unreachable', async () => {
        mockFetch(() => { throw new TypeError('fetch failed') })
        const err = await getQuote('AAPL').catch((e) => e)
        expect(err).toBeInstanceOf(MarketDataError)
        expect(err.status).toBe(503)
    })
})

describe('getBars', () => {
    it('drops null bars, de-duplicates the live bar and removes the empty after-hours bar', async () => {
        const times = [T0, T0 + DAY, T0 + 2 * DAY, T0 + 2 * DAY, T0 + 3 * DAY]
        const rows = [bar(100), null, bar(101), bar(102), { o: 102, h: 102, l: 102, c: 102, v: 0 }]
        mockFetch((url) => (url.includes('range=5d') ? json(QUOTE_5D) : json(chart({ regularMarketPrice: 102 }, rows, times))))
        const r = await getBars('AAPL', '1D')
        expect(r.candles.map((c) => c.close)).toEqual([100, 102])
        expect(r.candles.map((c) => c.time)).toEqual([T0, T0 + 2 * DAY])
        // the quote comes from the 5-day request, so its change is still day-over-day
        expect(r.quote.previousClose).toBe(342.0)
    })

    it('keeps a zero-volume last bar for crypto', async () => {
        const crypto = { instrumentType: 'CRYPTOCURRENCY', symbol: 'BTC-USD' }
        const rows = [bar(80000), { o: 80100, h: 80100, l: 80100, c: 80100, v: 0 }]
        mockFetch((url) => (url.includes('range=5d') ? json(chart(crypto, [bar(79000), bar(80100)])) : json(chart(crypto, rows))))
        const r = await getBars('BTC', '1D')
        expect(r.symbol).toBe('BTC-USD')
        expect(r.candles).toHaveLength(2)
    })
})
