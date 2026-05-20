/** @type {import('next').NextConfig} */
const { URL } = require("url");

function supabaseStorageRemotePattern() {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!raw) return null;
  try {
    const hostname = new URL(raw).hostname;
    return {
      protocol: "https",
      hostname,
      pathname: "/storage/v1/object/public/**",
    };
  } catch {
    return null;
  }
}

const supabasePattern = supabaseStorageRemotePattern();

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "github.com", pathname: "/**" },
      { protocol: "https", hostname: "avatars.githubusercontent.com", pathname: "/**" },
      ...(supabasePattern ? [supabasePattern] : []),
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ["undici", "@qdrant/js-client-rest"],
  },
};

module.exports = nextConfig;
