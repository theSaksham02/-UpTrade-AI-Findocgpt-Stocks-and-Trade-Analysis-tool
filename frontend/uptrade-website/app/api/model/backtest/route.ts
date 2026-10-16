import { getBars, MarketDataError } from '@/lib/market/yahoo'
import { errorResponse, json, readSymbol } from '@/lib/market/http'
import { isCrypto } from '@/lib/market/types'
import { backtest, STRATEGIES, type Strategy } from '@/lib/model/uptrade'

export const dynamic = 'force-dynamic'
export const maxDuration = 20

export async function GET(req: Request) {
    try {
        const params = new URL(req.url).searchParams
        const strategy = (params.get('strategy') || 'arima') as Strategy
        if (!(strategy in STRATEGIES)) throw new MarketDataError('Unknown strategy', 400)
        const feeBps = Math.min(100, Math.max(0, Number(params.get('feeBps') ?? 10) || 0))
        const { symbol, quote, candles } = await getBars(readSymbol(req), '1D')
        const result = backtest(candles, strategy, { crypto: isCrypto(quote.type), feeBps })
        return json({ symbol, result }, 600)
    } catch (err) {
        return errorResponse(err)
    }
}
