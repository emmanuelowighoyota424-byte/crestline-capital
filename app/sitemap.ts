import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://chasecapital.vercel.app'
  const currentDate = new Date().toISOString()

  const routes = [
    '',
    '/features',
    '/accounts',
    '/savings',
    '/cards',
    '/investments',
    '/loans',
    '/transfers',
    '/security',
    '/pricing',
    '/about',
    '/contact',
    '/faq',
    '/login',
    '/register',
    '/terms',
    '/privacy',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }))
}
