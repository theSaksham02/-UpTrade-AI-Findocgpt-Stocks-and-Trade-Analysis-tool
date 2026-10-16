/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    // Legacy prototype pages (mock data / localhost backend) now live in the terminal
    return [
      { source: '/charts', destination: '/app', permanent: false },
      // These pages described press coverage and live infrastructure metrics that don't exist
      { source: '/press', destination: '/about', permanent: false },
      { source: '/performance', destination: '/about', permanent: false },
      { source: '/terminal', destination: '/app', permanent: false },
      { source: '/engine', destination: '/app', permanent: false },
      { source: '/tradex/tool', destination: '/app/tradex', permanent: false },
      { source: '/visualx/tool', destination: '/app/visualx', permanent: false },
    ]
  },
}

export default nextConfig
