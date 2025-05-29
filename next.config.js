/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // fuck it, permit all of them
      { protocol: 'https', hostname: '**' },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
