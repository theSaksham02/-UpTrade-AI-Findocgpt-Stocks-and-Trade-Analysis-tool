// Shared market data types (used by API routes and the client)

export type Interval = '5m' | '15m' | '1h' | '1D' | '1W' | '1M'

export const INTERVALS: Interval[] = ['5m', '15m', '1h', '1D', '1W', '1M']

export interface Candle {
    time: number // UTC seconds
    open: number
    high: number
    low: number
    close: number
    volume: number
}

export interface Quote {
    symbol: string
    name: string
    price: number
    previousClose: number
    change: number
    changePercent: number
    dayHigh: number | null
    dayLow: number | null
    volume: number | null
    fiftyTwoWeekHigh: number | null
    fiftyTwoWeekLow: number | null
    currency: string
    exchange: string
    type: string // EQUITY | ETF | CRYPTOCURRENCY | INDEX | ...
    time: number
}

export interface BarsResponse {
    symbol: string
    interval: Interval
    quote: Quote
    candles: Candle[]
}

export interface SearchResult {
    symbol: string
    name: string
    exchange: string
    type: string
}

export interface NewsItem {
    title: string
    publisher: string
    link: string
    time: number
}

export function isCrypto(type: string) {
    return type === 'CRYPTOCURRENCY'
}
