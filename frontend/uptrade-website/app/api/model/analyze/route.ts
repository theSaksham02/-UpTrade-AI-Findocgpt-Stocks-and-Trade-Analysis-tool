import { getBars } from '@/lib/market/yahoo'
import { errorResponse, json, readSymbol } from '@/lib/market/http'
import { isCrypto } from '@/lib/market/types'
import { analyze } from '@/lib/model/uptrade'

export const dynamic = 'force-dynamic'
export const maxDuration = 20

export async function GET(req: Request) {
    try {
        const { symbol, quote, candles } = await getBars(readSymbol(req), '1D')
        const analysis = analyze(candles, { crypto: isCrypto(quote.type) })
        return json({ symbol, quote, analysis, disclaimer: 'Model output for research only. Not financial advice.' }, 600)
    } catch (err) {
        return errorResponse(err)
    }
}
