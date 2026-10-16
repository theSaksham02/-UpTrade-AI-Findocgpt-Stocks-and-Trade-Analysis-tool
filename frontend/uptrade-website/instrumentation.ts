import * as Sentry from '@sentry/nextjs'

// Server and edge Sentry init. Each config is a no-op when NEXT_PUBLIC_SENTRY_DSN is unset.
// On Next 14 this file only runs with experimental.instrumentationHook enabled in next.config.mjs.
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config')
  }
  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config')
  }
}

// Used by Next 15+; ignored on Next 14.
export const onRequestError = Sentry.captureRequestError
