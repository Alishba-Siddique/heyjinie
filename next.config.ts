// next.config.js
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["images.pexels.com"],
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://stagingbackend.heyjinie.com/api/v1/:path*", // Proxy to API
      },
      {
        source: '/api/payfast/:path*',
        destination: 'https://ipguat.apps.net.pk/Ecommerce/api/:path*',
      },
    ];
  },


};

export default nextConfig;