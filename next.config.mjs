/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Server actions and long-running responses (analysis can take 30s+)
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
