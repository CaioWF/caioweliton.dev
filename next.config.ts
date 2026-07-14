import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: ['@react-pdf/renderer'],
  turbopack: { root: import.meta.dirname },
}

export default nextConfig
