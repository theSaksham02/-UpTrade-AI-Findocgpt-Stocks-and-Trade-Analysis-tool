import type { BarsResponse, Candle, Interval, NewsItem, Quote, SearchResult } from './types'

// Yahoo Finance public endpoints (no API key). Responses are cached by Next's
// fetch cache so we stay well inside rate limits.

const BASE = 'https://query1.finance.yahoo.com'
const HEADERS = { 'User-Agent': 'Mozilla/5.0 (compatible; UpTrade/1.0)' }

// Friendly aliases → Yahoo symbols
const ALIASES: Record<string, string> = {
    BTC: 'BTC-USD', BTCUSD: 'BTC-USD', ETH: 'ETH-USD', ETHUSD: 'ETH-USD', SOL: 'SOL-USD',
    SPX: '^GSPC', NDX: '^NDX', DJI: '^DJI', VIX: '^VIX',
}

export function normalizeSymbol(raw: string) {
    const s = raw.trim().toUpperCase()
    return ALIASES[s] || s
}

const INTERVAL_MAP: Record<Interval, { interval: string; range: string; revalidate: number }> = {
    '5m': { interval: '5m', range: '5d', revalidate: 60 },
    '15m': { interval: '15m', range: '1mo', revalidate: 120 },
    '1h': { interval: '60m', range: '6mo', revalidate: 300 },
    '1D': { interval: '1d', range: '5y', revalidate: 600 },
    '1W': { interval: '1wk', range: '10y', revalidate: 3600 },
    '1M': { interval: '1mo', range: 'max', revalidate: 3600 },
}

export class MarketDataError extends Error {
    constructor(message: string, public status = 502) {
        super(message)
    }
}

async function yahooJson(path: string, revalidate: number) {
    const res = await fetch(`${BASE}${path}`, { headers: HEADERS, next: { revalidate } })
    if (res.status === 404) throw new MarketDataError('Symbol not found', 404)
    if (!res.ok) throw new MarketDataError(`Market data provider error (${res.status})`)
    return res.json()
}

// `prevClose` must be the prior session's close. Yahoo's `chartPreviousClose` is the close
// before the requested *range*, so it is only a last-resort fallback.
function toQuote(meta: any, candles: Candle[], prevClose?: number): Quote {
    const price = meta.regularMarketPrice ?? candles.at(-1)?.close ?? 0
    const prev = prevClose ?? meta.previousClose ?? meta.chartPreviousClose ?? price
    return {
        symbol: meta.symbol,
        name: meta.longName || meta.shortName || meta.symbol,
        price,
        previousClose: prev,
        change: price - prev,
        changePercent: prev ? ((price - prev) / prev) * 100 : 0,
        dayHigh: meta.regularMarketDayHigh ?? null,
        dayLow: meta.regularMarketDayLow ?? null,
        volume: meta.regularMarketVolume ?? null,
        fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh ?? null,
        fiftyTwoWeekLow: meta.fiftyTwoWeekLow ?? null,
        currency: meta.currency || 'USD',
        exchange: meta.fullExchangeName || meta.exchangeName || '',
        type: meta.instrumentType || 'EQUITY',
        time: meta.regularMarketTime ?? Math.floor(Date.now() / 1000),
    }
}

function parseCandles(result: any): Candle[] {
    const ts: number[] = result.timestamp || []
    const q = result.indicators?.quote?.[0] || {}
    const out: Candle[] = []
    for (let i = 0; i < ts.length; i++) {
        const o = q.open?.[i], h = q.high?.[i], l = q.low?.[i], c = q.close?.[i]
        if (o == null || h == null || l == null || c == null) continue
        const t = ts[i]
        if (out.length && out[out.length - 1].time === t) out.pop() // Yahoo sometimes repeats the live bar
        out.push({ time: t, open: o, high: h, low: l, close: c, volume: q.volume?.[i] ?? 0 })
    }
    return out
}

export async function getBars(rawSymbol: string, interval: Interval): Promise<BarsResponse> {
    const symbol = normalizeSymbol(rawSymbol)
    const cfg = INTERVAL_MAP[interval] ?? INTERVAL_MAP['1D']
    const [json, liveQuote] = await Promise.all([
        yahooJson(
            `/v8/finance/chart/${encodeURIComponent(symbol)}?interval=${cfg.interval}&range=${cfg.range}&includePrePost=false`,
            cfg.revalidate,
        ),
        getQuote(symbol).catch(() => null),
    ])
    const result = json?.chart?.result?.[0]
    if (!result) throw new MarketDataError(json?.chart?.error?.description || 'Symbol not found', 404)
    const candles = parseCandles(result)
    const quote = liveQuote ?? toQuote(result.meta, candles)
    // Yahoo appends an empty placeholder bar outside equity trading hours
    const lastBar = candles[candles.length - 1]
    if (quote.type !== 'CRYPTOCURRENCY' && lastBar && lastBar.volume === 0 && lastBar.high === lastBar.low && candles.length > 1) candles.pop()
    return { symbol, interval, quote, candles }
}

export async function getQuote(rawSymbol: string): Promise<Quote> {
    const symbol = normalizeSymbol(rawSymbol)
    const json = await yahooJson(`/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=5d`, 15)
    const result = json?.chart?.result?.[0]
    if (!result) throw new MarketDataError('Symbol not found', 404)
    const daily = parseCandles(result)
    return toQuote(result.meta, daily, daily.length >= 2 ? daily[daily.length - 2].close : undefined)
}

export async function search(query: string): Promise<{ quotes: SearchResult[]; news: NewsItem[] }> {
    const json = await yahooJson(
        `/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=10&newsCount=12&enableFuzzyQuery=false`,
        300,
    )
    const quotes: SearchResult[] = (json.quotes || [])
        .filter((q: any) => q.symbol && ['EQUITY', 'ETF', 'CRYPTOCURRENCY', 'INDEX', 'MUTUALFUND', 'CURRENCY', 'FUTURE'].includes(q.quoteType))
        .map((q: any) => ({
            symbol: q.symbol,
            name: q.longname || q.shortname || q.symbol,
            exchange: q.exchDisp || q.exchange || '',
            type: q.quoteType,
        }))
    const news: NewsItem[] = (json.news || []).map((n: any) => ({
        title: n.title,
        publisher: n.publisher,
        link: n.link,
        time: n.providerPublishTime,
    }))
    return { quotes, news }
}

const decode = (s: string) =>
    s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
        .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").trim()

export async function getNews(rawSymbol: string): Promise<NewsItem[]> {
    const symbol = normalizeSymbol(rawSymbol)
    const res = await fetch(
        `https://feeds.finance.yahoo.com/rss/2.0/headline?s=${encodeURIComponent(symbol)}&region=US&lang=en-US`,
        { headers: HEADERS, next: { revalidate: 900 } },
    )
    if (!res.ok) throw new MarketDataError(`News provider error (${res.status})`)
    const xml = await res.text()
    return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 15).map(([, item]) => {
        const tag = (t: string) => decode(item.match(new RegExp(`<${t}>([\\s\\S]*?)</${t}>`))?.[1] || '')
        const date = Date.parse(tag('pubDate'))
        return {
            title: tag('title'),
            publisher: tag('source') || 'Yahoo Finance',
            link: tag('link'),
            time: Number.isFinite(date) ? Math.floor(date / 1000) : 0,
        }
    }).filter((n) => n.title && /^https?:\/\//.test(n.link))
}
