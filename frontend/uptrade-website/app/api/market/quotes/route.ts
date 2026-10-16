import { getQuote, MarketDataError } from '@/lib/market/yahoo'
import { errorResponse, json } from '@/lib/market/http'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
    try {
        const symbols = (new URL(req.url).searchParams.get('symbols') || '')
            .split(',').map((s) => s.trim()).filter((s) => /^[\^A-Za-z0-9.=\-]{1,20}$/.test(s))
            .slice(0, 40)
        if (!symbols.length) throw new MarketDataError('No symbols', 400)
        const results = await Promise.allSettled(symbols.map((s) => getQuote(s)))
        const quotes: Record<string, unknown> = {}
        results.forEach((r, i) => {
            if (r.status === 'fulfilled') quotes[symbols[i].toUpperCase()] = r.value
        })
        return json({ quotes }, 15)
    } catch (err) {
        return errorResponse(err)
    }
}
