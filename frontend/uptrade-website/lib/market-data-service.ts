// Market Data Service - Datafeed API Pattern
// This implements TradingView's Datafeed architecture

import { Time } from 'lightweight-charts'

export interface SymbolInfo {
    symbol: string
    name: string
    description: string
    type: 'stock' | 'crypto' | 'forex' | 'index'
    exchange: string
    timezone: string
    session: string
    minmov: number
    pricescale: number
    volume_precision: number
}

export interface Bar {
    time: Time
    open: number
    high: number
    low: number
    close: number
    volume?: number
}

export interface Quote {
    symbol: string
    price: number
    change: number
    changePercent: number
    high: number
    low: number
    open: number
    previousClose: number
    volume: number
    timestamp: number
}

// Supported resolutions
export const RESOLUTIONS = ['1', '5', '15', '30', '60', 'D', 'W', 'M'] as const
export type Resolution = typeof RESOLUTIONS[number]

// Symbol database (mock)
const SYMBOLS: Record<string, SymbolInfo> = {
    'AAPL': { symbol: 'AAPL', name: 'Apple Inc.', description: 'Apple Inc.', type: 'stock', exchange: 'NASDAQ', timezone: 'America/New_York', session: '0930-1600', minmov: 1, pricescale: 100, volume_precision: 0 },
    'MSFT': { symbol: 'MSFT', name: 'Microsoft Corporation', description: 'Microsoft Corporation', type: 'stock', exchange: 'NASDAQ', timezone: 'America/New_York', session: '0930-1600', minmov: 1, pricescale: 100, volume_precision: 0 },
    'GOOGL': { symbol: 'GOOGL', name: 'Alphabet Inc.', description: 'Alphabet Inc.', type: 'stock', exchange: 'NASDAQ', timezone: 'America/New_York', session: '0930-1600', minmov: 1, pricescale: 100, volume_precision: 0 },
    'AMZN': { symbol: 'AMZN', name: 'Amazon.com Inc.', description: 'Amazon.com Inc.', type: 'stock', exchange: 'NASDAQ', timezone: 'America/New_York', session: '0930-1600', minmov: 1, pricescale: 100, volume_precision: 0 },
    'NVDA': { symbol: 'NVDA', name: 'NVIDIA Corporation', description: 'NVIDIA Corporation', type: 'stock', exchange: 'NASDAQ', timezone: 'America/New_York', session: '0930-1600', minmov: 1, pricescale: 100, volume_precision: 0 },
    'TSLA': { symbol: 'TSLA', name: 'Tesla Inc.', description: 'Tesla Inc.', type: 'stock', exchange: 'NASDAQ', timezone: 'America/New_York', session: '0930-1600', minmov: 1, pricescale: 100, volume_precision: 0 },
    'META': { symbol: 'META', name: 'Meta Platforms Inc.', description: 'Meta Platforms Inc.', type: 'stock', exchange: 'NASDAQ', timezone: 'America/New_York', session: '0930-1600', minmov: 1, pricescale: 100, volume_precision: 0 },
    'BTC': { symbol: 'BTC', name: 'Bitcoin', description: 'Bitcoin/USD', type: 'crypto', exchange: 'Crypto', timezone: 'Etc/UTC', session: '24x7', minmov: 1, pricescale: 100, volume_precision: 2 },
    'ETH': { symbol: 'ETH', name: 'Ethereum', description: 'Ethereum/USD', type: 'crypto', exchange: 'Crypto', timezone: 'Etc/UTC', session: '24x7', minmov: 1, pricescale: 100, volume_precision: 4 },
    'SPY': { symbol: 'SPY', name: 'SPDR S&P 500 ETF', description: 'S&P 500 ETF', type: 'index', exchange: 'NYSE', timezone: 'America/New_York', session: '0930-1600', minmov: 1, pricescale: 100, volume_precision: 0 },
}

// Base prices for simulation
const BASE_PRICES: Record<string, number> = {
    'AAPL': 189.50,
    'MSFT': 378.90,
    'GOOGL': 141.80,
    'AMZN': 178.25,
    'NVDA': 721.33,
    'TSLA': 248.50,
    'META': 474.99,
    'BTC': 43250.00,
    'ETH': 2285.50,
    'SPY': 478.50,
}

class MarketDataService {
    private subscribers: Map<string, Set<(bar: Bar) => void>> = new Map()
    private lastPrices: Map<string, number> = new Map()
    private updateInterval: NodeJS.Timeout | null = null

    constructor() {
        // Initialize with base prices
        Object.entries(BASE_PRICES).forEach(([symbol, price]) => {
            this.lastPrices.set(symbol, price)
        })
    }

    // 1. Configuration
    getConfig() {
        return {
            supported_resolutions: RESOLUTIONS,
            supports_marks: true,
            supports_timescale_marks: true,
            supports_time: true,
        }
    }

    // 2. Symbol search
    searchSymbols(query: string): SymbolInfo[] {
        const q = query.toUpperCase()
        return Object.values(SYMBOLS).filter(s =>
            s.symbol.includes(q) || s.name.toUpperCase().includes(q)
        )
    }

    // 3. Resolve symbol
    resolveSymbol(symbolName: string): SymbolInfo | null {
        return SYMBOLS[symbolName.toUpperCase()] || null
    }

    // 4. Get historical bars
    async getBars(
        symbol: string,
        resolution: Resolution,
        from: number,
        to: number
    ): Promise<{ bars: Bar[], noData: boolean }> {
        const basePrice = BASE_PRICES[symbol.toUpperCase()] || 100
        const bars: Bar[] = []

        // Calculate bar interval in milliseconds
        const intervalMs = this.getIntervalMs(resolution)

        // Generate historical data
        let price = basePrice * (0.85 + Math.random() * 0.1) // Start 85-95% of current
        let currentTime = from * 1000
        const endTime = to * 1000

        while (currentTime <= endTime) {
            const volatility = 0.015
            const trend = 0.0002 // Slight upward bias
            const change = price * volatility * (Math.random() - 0.5 + trend)

            const open = price
            const close = price + change
            const high = Math.max(open, close) * (1 + Math.random() * volatility * 0.5)
            const low = Math.min(open, close) * (1 - Math.random() * volatility * 0.5)
            const volume = Math.floor(Math.random() * 5000000) + 500000

            // Convert to date string for daily bars, timestamp for intraday
            const time = resolution === 'D' || resolution === 'W' || resolution === 'M'
                ? new Date(currentTime).toISOString().split('T')[0] as Time
                : Math.floor(currentTime / 1000) as Time

            bars.push({
                time,
                open: parseFloat(open.toFixed(2)),
                high: parseFloat(high.toFixed(2)),
                low: parseFloat(low.toFixed(2)),
                close: parseFloat(close.toFixed(2)),
                volume,
            })

            price = close
            currentTime += intervalMs
        }

        // Update last price
        if (bars.length > 0) {
            this.lastPrices.set(symbol.toUpperCase(), bars[bars.length - 1].close)
        }

        return { bars, noData: bars.length === 0 }
    }

    // 5. Subscribe to real-time updates
    subscribeBars(
        symbol: string,
        resolution: Resolution,
        callback: (bar: Bar) => void
    ): string {
        const key = `${symbol}_${resolution}`

        if (!this.subscribers.has(key)) {
            this.subscribers.set(key, new Set())
        }
        this.subscribers.get(key)!.add(callback)

        // Start update loop if not running
        if (!this.updateInterval) {
            this.startRealtimeUpdates()
        }

        return key
    }

    // 6. Unsubscribe
    unsubscribeBars(subscriberUID: string) {
        this.subscribers.delete(subscriberUID)

        // Stop updates if no subscribers
        if (this.subscribers.size === 0 && this.updateInterval) {
            clearInterval(this.updateInterval)
            this.updateInterval = null
        }
    }

    // 7. Get current quote
    getQuote(symbol: string): Quote {
        const s = symbol.toUpperCase()
        const price = this.lastPrices.get(s) || BASE_PRICES[s] || 100
        const basePrice = BASE_PRICES[s] || 100
        const change = price - basePrice
        const changePercent = (change / basePrice) * 100

        return {
            symbol: s,
            price,
            change: parseFloat(change.toFixed(2)),
            changePercent: parseFloat(changePercent.toFixed(2)),
            high: price * 1.02,
            low: price * 0.98,
            open: basePrice,
            previousClose: basePrice,
            volume: Math.floor(Math.random() * 10000000),
            timestamp: Date.now(),
        }
    }

    // Helper: Get interval in milliseconds
    private getIntervalMs(resolution: Resolution): number {
        switch (resolution) {
            case '1': return 60 * 1000
            case '5': return 5 * 60 * 1000
            case '15': return 15 * 60 * 1000
            case '30': return 30 * 60 * 1000
            case '60': return 60 * 60 * 1000
            case 'D': return 24 * 60 * 60 * 1000
            case 'W': return 7 * 24 * 60 * 60 * 1000
            case 'M': return 30 * 24 * 60 * 60 * 1000
            default: return 24 * 60 * 60 * 1000
        }
    }

    // Simulate real-time updates
    private startRealtimeUpdates() {
        this.updateInterval = setInterval(() => {
            this.subscribers.forEach((callbacks, key) => {
                const [symbol] = key.split('_')
                const lastPrice = this.lastPrices.get(symbol) || BASE_PRICES[symbol] || 100

                // Simulate tick
                const volatility = 0.002
                const change = lastPrice * volatility * (Math.random() - 0.5)
                const newPrice = parseFloat((lastPrice + change).toFixed(2))

                this.lastPrices.set(symbol, newPrice)

                const bar: Bar = {
                    time: Math.floor(Date.now() / 1000) as Time,
                    open: lastPrice,
                    high: Math.max(lastPrice, newPrice),
                    low: Math.min(lastPrice, newPrice),
                    close: newPrice,
                    volume: Math.floor(Math.random() * 50000),
                }

                callbacks.forEach(cb => cb(bar))
            })
        }, 2000) // Update every 2 seconds
    }
}

// Singleton instance
export const marketDataService = new MarketDataService()

// React hook for using market data
export function useMarketDataService() {
    return marketDataService
}
