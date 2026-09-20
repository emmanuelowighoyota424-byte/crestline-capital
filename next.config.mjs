/** @type {import('next').NextConfig} */
const nextConfig = {
  // Support both Cloud Run container deployment (standalone) and Vercel native deployment
  ...(process.env.VERCEL ? {} : { output: 'standalone' }),
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Next.js blocks cross-origin requests to dev-only assets (/_next/static/**,
  // /_next/webpack-hmr) by default. Behind the preview proxy the browser's origin is
  // the proxy hostname, so those requests were 403'd, the client bundle never loaded,
  // and the app stayed stuck on its server-rendered loading screen.
  allowedDevOrigins: ['*.daytonaproxy01.net', '**.daytonaproxy01.net'],
}

export default nextConfig
