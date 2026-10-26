// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  // No custom Cache-Control for /_next/static: Next.js already caches hashed production
  // files for a year by itself. Forcing "immutable" here also applied in development,
  // where file names don't change on edit → browsers kept showing old code and colours.
};

export default nextConfig;