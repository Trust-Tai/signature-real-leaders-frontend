import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'verified.real-leaders.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'real-leaders.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
