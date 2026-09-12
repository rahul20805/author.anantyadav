import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  outputFileTracingIncludes: {
    "/**": ["./prisma/**/*", "./prisma/dev.db"],
  },
  async redirects() {
    return [
      {
        source: '/(.*)',
        destination: 'https://authoranant.ezy1.site/$1',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
