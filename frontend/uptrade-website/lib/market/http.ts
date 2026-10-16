import { NextResponse } from 'next/server'
import { MarketDataError } from './yahoo'

export function errorResponse(err: unknown) {
    const status = err instanceof MarketDataError ? err.status : 500
    const message = err instanceof Error ? err.message : 'Unexpected error'
    return NextResponse.json({ error: message }, { status })
}

export function json(data: unknown, sMaxAge = 30) {
    return NextResponse.json(data, {
        headers: { 'Cache-Control': `public, s-maxage=${sMaxAge}, stale-while-revalidate=${sMaxAge * 4}` },
    })
}

const SYMBOL_RE = /^[\^A-Za-z0-9.=\-]{1,20}$/

export function readSymbol(req: Request, key = 'symbol') {
    const v = new URL(req.url).searchParams.get(key)?.trim() || ''
    if (!SYMBOL_RE.test(v)) throw new MarketDataError('Invalid symbol', 400)
    return v
}
