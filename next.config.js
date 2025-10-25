/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  images: {
    domains: ['pbs.twimg.com', 'abs.twimg.com'],
  },
}

module.exports = nextConfig