/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['lh3.googleusercontent.com', 'platform-lookaside.fbsbx.com'],
  },
  async redirects() {
    return []
  },
}

module.exports = nextConfig
