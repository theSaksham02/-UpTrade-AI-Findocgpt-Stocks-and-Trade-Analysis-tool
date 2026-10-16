import { getBars } from '@/lib/market/yahoo'
import { errorResponse, json, readSymbol } from '@/lib/market/http'
import { INTERVALS, type Interval } from '@/lib/market/types'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
    try {
        const symbol = readSymbol(req)
        const raw = new URL(req.url).searchParams.get('interval') as Interval
        const interval = INTERVALS.includes(raw) ? raw : '1D'
        return json(await getBars(symbol, interval), interval === '5m' || interval === '15m' ? 30 : 120)
    } catch (err) {
        return errorResponse(err)
    }
}
