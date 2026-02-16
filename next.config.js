/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['github.com'],
  },
  experimental: {
    serverComponentsExternalPackages: ["undici", "@qdrant/js-client-rest"],
  },
};



module.exports = nextConfig;

