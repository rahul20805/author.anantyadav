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
        destination: 'https://authoranant.ezy1.site/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
