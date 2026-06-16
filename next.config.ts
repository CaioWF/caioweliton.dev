import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: ['@react-pdf/renderer'],
  turbopack: { root: import.meta.dirname },
  // Fontes do CV não são importadas (lidas via fs por @react-pdf), então o tracing
  // do standalone precisa incluí-las explicitamente.
  outputFileTracingIncludes: {
    '/[locale]/cv': ['./lib/cv/fonts/**'],
  },
}

export default nextConfig
