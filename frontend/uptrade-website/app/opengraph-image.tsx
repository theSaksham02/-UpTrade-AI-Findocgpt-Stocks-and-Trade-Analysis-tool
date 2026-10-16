import { ImageResponse } from 'next/og'

export const alt = 'UpTrade — a trading terminal that shows its work'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const BG = '#0a0b0d'
const INK = '#ecebe6'
const AMBER = '#e8b04a'
const MUTED = '#8a8a85'

const WORDMARK = 'UpTrade'
const TAGLINE = 'A trading terminal that shows its work.'
const SUBLINE = 'Live charts · open ARIMA forecast with its error band · 5-year backtests · free beta'

// Instrument Serif to match the site's headlines. If Google Fonts can't be reached
// at build time the image still renders with the default sans.
async function loadDisplayFont(): Promise<ArrayBuffer | null> {
  try {
    const text = encodeURIComponent(WORDMARK + TAGLINE + SUBLINE)
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?family=Instrument+Serif&text=${text}`)
    ).text()
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1]
    if (!url) return null
    const res = await fetch(url)
    return res.ok ? await res.arrayBuffer() : null
  } catch {
    return null
  }
}

export default async function OpengraphImage() {
  const font = await loadDisplayFont()
  const display = font ? 'Instrument Serif' : 'sans-serif'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: BG,
          color: INK,
          padding: '72px 80px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 28, height: 28, background: AMBER }} />
          <div style={{ fontFamily: display, fontSize: 64, letterSpacing: -1 }}>{WORDMARK}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div style={{ fontFamily: display, fontSize: 92, lineHeight: 1.02, letterSpacing: -2, maxWidth: 840 }}>
            {TAGLINE}
          </div>
          <div style={{ display: 'flex', fontFamily: display, fontSize: 30, color: MUTED }}>{SUBLINE}</div>
        </div>

        <div style={{ display: 'flex', height: 4, width: 160, background: AMBER }} />
      </div>
    ),
    {
      ...size,
      fonts: font ? [{ name: 'Instrument Serif', data: font, style: 'normal', weight: 400 }] : undefined,
    },
  )
}
