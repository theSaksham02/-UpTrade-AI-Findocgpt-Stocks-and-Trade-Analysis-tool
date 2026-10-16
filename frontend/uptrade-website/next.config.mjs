/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Loads instrumentation.ts so server-side Sentry runs (Next 14)
    instrumentationHook: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    // Pages removed for the MVP (prototype tools, or content describing infrastructure
    // we don't run). Old links land on the nearest real page.
    const to = (destination) => (source) => ({ source, destination, permanent: false })
    return [
      ...['/charts', '/terminal', '/engine', '/tradesphere', '/ai-analysis'].map(to('/app')),
      ...['/tradex', '/tradex/:path*'].map(to('/app/tradex')),
      ...['/visualx', '/visualx/:path*'].map(to('/app/visualx')),
      ...['/features', '/research', '/blog', '/blog/:path*', '/community', '/api-page', '/api-dev', '/performance'].map(to('/')),
      ...['/press', '/careers'].map(to('/about')),
      ...['/support'].map(to('/contact')),
      ...['/legal'].map(to('/terms')),
    ]
  },
}

export default nextConfig
