import type * as Sentry from '@sentry/nextjs'

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN

// Shared by the client, server and edge configs. Without a DSN every init is skipped.
// Collection is kept to what the Privacy Policy describes: no user fields, cookies,
// request bodies or local variables, and only the user agent from request headers.
export const sentryOptions: Sentry.BrowserOptions & Sentry.NodeOptions = {
  dsn,
  enabled: Boolean(dsn),
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.VERCEL_ENV ?? process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  dataCollection: {
    userInfo: false,
    cookies: false,
    httpHeaders: { request: { allow: ['user-agent'] }, response: false },
    httpBodies: [],
    stackFrameVariables: false,
    databaseQueryData: false,
  },
}
