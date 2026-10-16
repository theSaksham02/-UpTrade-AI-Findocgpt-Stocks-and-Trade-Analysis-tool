import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupabaseServer } from '@/lib/supabase/server'
import { isAuthConfigured } from '@/lib/supabase/config'

export const dynamic = 'force-dynamic'

const Body = z.object({
    email: z.string().trim().email().max(254),
    topic: z.enum(['general', 'bug', 'data', 'account']).default('general'),
    message: z.string().trim().min(5, 'Message is too short').max(5000),
    website: z.string().optional(), // honeypot: real users never fill this
})

export async function POST(req: Request) {
    if (!isAuthConfigured) return NextResponse.json({ error: 'Messages are not enabled on this deployment.' }, { status: 503 })
    let parsed
    try {
        parsed = Body.safeParse(await req.json())
    } catch {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
    const { website, ...msg } = parsed.data
    if (website) return NextResponse.json({ ok: true }) // silently drop bots

    const supabase = getSupabaseServer()
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('contact_messages').insert({ ...msg, user_id: user?.id ?? null })
    if (error) return NextResponse.json({ error: 'Couldn’t send your message. Please try again.' }, { status: 500 })
    return NextResponse.json({ ok: true })
}
