import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Allow external images from any hostname during development.
    // Tighten to specific domains before production deployment.
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },
};

export default nextConfig;
