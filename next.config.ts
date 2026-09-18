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
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'authoranantyadav.vercel.app',
          },
        ],
        destination: 'https://authoranant.in/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'authoranant.ezy1.site',
          },
        ],
        destination: 'https://authoranant.in/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.authoranant.in',
          },
        ],
        destination: 'https://authoranant.in/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
