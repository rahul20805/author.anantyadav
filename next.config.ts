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
};

export default nextConfig;
