import type { NextConfig } from 'next'

const config: NextConfig = {
  serverExternalPackages: ['winston'],
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'image.tmdb.org' }]
  }
}
export default config
