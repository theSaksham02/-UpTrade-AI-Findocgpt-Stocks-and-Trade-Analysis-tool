// Canonical origin for metadata, sitemap and robots. Set NEXT_PUBLIC_SITE_URL once a custom domain exists.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://up-trade-ai-findocgpt-stocks-and-tr.vercel.app'
).replace(/\/$/, '')
