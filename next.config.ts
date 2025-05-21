import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "stagingbackend.heyjinie.com",
      },
      {
        protocol: "http",
        hostname: "5.9.147.58",
        port: "3333",
        pathname: "/public/**",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://stagingbackend.heyjinie.com/api/v1/:path*", // Proxy to API
      },
      {
        source: "/api/payfast/:path*",
        destination: "https://ipguat.apps.net.pk/Ecommerce/api/:path*",
      },
    ];
  },
};

export default nextConfig;