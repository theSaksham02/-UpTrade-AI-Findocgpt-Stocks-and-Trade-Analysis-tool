import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site-url'

// Only the pages we stand behind for launch. Keep in sync when pages are added or cut.
const ROUTES: { path: string; priority: number; changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly' }[] = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/markets', priority: 0.9, changeFrequency: 'daily' },
  { path: '/app', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/dashboard', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/pricing', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/about', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/docs', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.4, changeFrequency: 'yearly' },
  { path: '/login', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/signup', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/terms', priority: 0.2, changeFrequency: 'yearly' },
  { path: '/privacy', priority: 0.2, changeFrequency: 'yearly' },
  { path: '/cookies', priority: 0.2, changeFrequency: 'yearly' },
  { path: '/disclaimer', priority: 0.2, changeFrequency: 'yearly' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path === '/' ? '' : path}`,
    lastModified,
    changeFrequency,
    priority,
  }))
}
