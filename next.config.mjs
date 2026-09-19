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
}

export default nextConfig
