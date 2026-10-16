'use client'

import { useEffect } from 'react'

// Loads the Sentry browser SDK only when a DSN is configured, so it adds nothing
// to the bundle that ships by default. Next 14 doesn't load sentry.client.config.ts
// on its own without withSentryConfig, so we import it here.
export function SentryClientInit() {
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return
    import('../../sentry.client.config').catch(() => {})
  }, [])
  return null
}
