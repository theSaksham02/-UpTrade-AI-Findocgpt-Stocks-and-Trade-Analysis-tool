import { getBars, MarketDataError } from '@/lib/market/yahoo'
import { errorResponse, json } from '@/lib/market/http'

export const dynamic = 'force-dynamic'

// Quotes plus a ~3-month daily sparkline per symbol, for market summary cards
export async function GET(req: Request) {
    try {
        const symbols = (new URL(req.url).searchParams.get('symbols') || '')
            .split(',').map((s) => s.trim()).filter((s) => /^[\^A-Za-z0-9.=\-]{1,20}$/.test(s))
            .slice(0, 12)
        if (!symbols.length) throw new MarketDataError('No symbols', 400)
        const results = await Promise.allSettled(symbols.map((s) => getBars(s, '1D')))
        const items = results.flatMap((r, i) => {
            if (r.status !== 'fulfilled') return []
            const closes = r.value.candles.slice(-66)
            return [{
                symbol: symbols[i].toUpperCase(),
                quote: r.value.quote,
                spark: closes.map((c) => ({ time: c.time, value: c.close })),
            }]
        })
        return json({ items }, 60)
    } catch (err) {
        return errorResponse(err)
    }
}
