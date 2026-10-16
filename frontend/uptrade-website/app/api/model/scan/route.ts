import { getBars, MarketDataError } from '@/lib/market/yahoo'
import { errorResponse, json } from '@/lib/market/http'
import { isCrypto } from '@/lib/market/types'
import { analyze } from '@/lib/model/uptrade'

export const dynamic = 'force-dynamic'
export const maxDuration = 20

// Runs the UpTrade model over a list of symbols and returns a compact ranking
export async function GET(req: Request) {
    try {
        const symbols = (new URL(req.url).searchParams.get('symbols') || '')
            .split(',').map((s) => s.trim()).filter((s) => /^[\^A-Za-z0-9.=\-]{1,20}$/.test(s))
            .slice(0, 16)
        if (!symbols.length) throw new MarketDataError('No symbols', 400)
        const results = await Promise.allSettled(symbols.map(async (s) => {
            const { quote, candles } = await getBars(s, '1D')
            const a = analyze(candles, { crypto: isCrypto(quote.type) })
            return {
                symbol: s.toUpperCase(),
                name: quote.name,
                price: quote.price,
                changePercent: quote.changePercent,
                score: a.scores.composite,
                stance: a.stance,
                signal: a.recommendation.signal,
                projectedChangePct: a.recommendation.projectedChangePct,
                return3M: a.stats.return3M,
                rsi: a.stats.rsi,
            }
        }))
        // Partial results beat a 500: drop the symbols that failed and say which ones
        const items = results.flatMap((r) => (r.status === 'fulfilled' ? [r.value] : []))
            .sort((a, b) => b.score - a.score)
        const failed = symbols.filter((_, i) => results[i].status === 'rejected').map((s) => s.toUpperCase())
        if (!items.length) {
            const first = results.find((r): r is PromiseRejectedResult => r.status === 'rejected')
            throw first?.reason ?? new MarketDataError('Market data unavailable', 503)
        }
        // Cache a partial scan briefly so a transient failure isn't pinned at the edge for ten minutes
        return json({ items, failed, disclaimer: 'Model output for research only. Not financial advice.' }, failed.length ? 60 : 600)
    } catch (err) {
        return errorResponse(err)
    }
}
