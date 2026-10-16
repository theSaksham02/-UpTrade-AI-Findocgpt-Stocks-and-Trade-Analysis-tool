// Headline sentiment: Hugging Face FinBERT (ProsusAI/finbert) when
// HUGGINGFACE_API_KEY is set, otherwise a finance-specific lexicon.

export interface ScoredHeadline {
    score: number // -1 … 1
    label: 'positive' | 'negative' | 'neutral'
}

const POS = ['beat', 'beats', 'surge', 'surges', 'soar', 'soars', 'jump', 'jumps', 'rally', 'rallies', 'gain', 'gains', 'record', 'upgrade', 'upgraded', 'outperform', 'strong', 'growth', 'profit', 'profits', 'bullish', 'buy', 'raises', 'raised', 'boost', 'boosts', 'tops', 'rebound', 'rebounds', 'climb', 'climbs', 'higher', 'expands', 'wins', 'approval', 'approved', 'breakthrough', 'optimism', 'upbeat', 'accelerat', 'rise', 'rises', 'surging', 'soaring', 'flies', 'beats', 'outperforms']
const NEG = ['miss', 'misses', 'plunge', 'plunges', 'drop', 'drops', 'fall', 'falls', 'slump', 'slumps', 'tumble', 'tumbles', 'sink', 'sinks', 'downgrade', 'downgraded', 'underperform', 'weak', 'loss', 'losses', 'bearish', 'sell', 'sell-off', 'selloff', 'cuts', 'cut', 'lawsuit', 'probe', 'investigation', 'recall', 'warning', 'warns', 'lower', 'decline', 'declines', 'risk', 'fears', 'fear', 'layoffs', 'crash', 'bankruptcy', 'fraud', 'slows', 'slowdown', 'correction', 'gloom', 'slide', 'slides', 'pressure', 'sinks', 'tumbling', 'plunging', 'downturn']

function lexicon(text: string): ScoredHeadline {
    const words = text.toLowerCase().split(/[^a-z\-]+/)
    let p = 0, n = 0
    for (const w of words) {
        if (POS.some((x) => w === x || (x.endsWith('t') && x.length > 6 && w.startsWith(x)))) p++
        if (NEG.includes(w)) n++
    }
    const score = p + n === 0 ? 0 : (p - n) / (p + n)
    return { score, label: score > 0.15 ? 'positive' : score < -0.15 ? 'negative' : 'neutral' }
}

async function finbert(texts: string[], key: string): Promise<ScoredHeadline[] | null> {
    try {
        const res = await fetch('https://router.huggingface.co/hf-inference/models/ProsusAI/finbert', {
            method: 'POST',
            headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ inputs: texts }),
            next: { revalidate: 900 },
        })
        if (!res.ok) return null
        const out = (await res.json()) as { label: string; score: number }[][]
        return out.map((labels) => {
            const get = (l: string) => labels.find((x) => x.label.toLowerCase() === l)?.score ?? 0
            const score = get('positive') - get('negative')
            const top = labels.reduce((a, b) => (b.score > a.score ? b : a))
            return { score, label: top.label.toLowerCase() as ScoredHeadline['label'] }
        })
    } catch {
        return null
    }
}

export async function scoreHeadlines(texts: string[]): Promise<{ model: string; results: ScoredHeadline[] }> {
    const key = process.env.HUGGINGFACE_API_KEY
    if (key && texts.length) {
        const r = await finbert(texts, key)
        if (r && r.length === texts.length) return { model: 'FinBERT (Hugging Face)', results: r }
    }
    return { model: 'Finance lexicon', results: texts.map(lexicon) }
}
