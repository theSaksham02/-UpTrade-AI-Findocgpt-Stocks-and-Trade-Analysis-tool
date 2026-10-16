import { search } from '@/lib/market/yahoo'
import { errorResponse, json } from '@/lib/market/http'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
    try {
        const q = (new URL(req.url).searchParams.get('q') || '').trim().slice(0, 50)
        if (!q) return json({ quotes: [], news: [] })
        return json(await search(q), 300)
    } catch (err) {
        return errorResponse(err)
    }
}
