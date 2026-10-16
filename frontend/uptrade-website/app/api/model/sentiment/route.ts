import { getNews } from '@/lib/market/yahoo'
import { errorResponse, json, readSymbol } from '@/lib/market/http'
import { scoreHeadlines } from '@/lib/model/sentiment'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
    try {
        const symbol = readSymbol(req)
        const news = await getNews(symbol)
        const { model, results } = await scoreHeadlines(news.map((n) => n.title))
        const items = news.map((n, i) => ({ ...n, ...results[i] }))
        const overall = items.length ? items.reduce((a, b) => a + b.score, 0) / items.length : 0
        return json({ symbol, model, overall, items }, 900)
    } catch (err) {
        return errorResponse(err)
    }
}
