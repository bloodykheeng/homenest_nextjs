import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    // // Remove all console logs
    // removeConsole: true

    // // Remove all console logs, excluding error logs
    // removeConsole: { exclude: ["error"] },

    // Remove console logs only in production
    removeConsole: process.env.NODE_ENV === "production"

    // // Remove console logs only in production, excluding error logs
    // removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false
  },

  images: {
    unoptimized: process.env.NODE_ENV === 'development',
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fonts.googleapis.com"
      },
      {
        protocol: "http",
        hostname: "127.0.0.1"
      },
      {
        protocol: "http",
        hostname: "localhost"
      },
      {
        protocol: "https",
        hostname: "ppdaacmsapi.nwtdemos.com"
      },
      {
        protocol: "https",
        hostname: "api.ppdacms.net"
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com"
      }
    ]
  },
  /* config options here */
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js"
      }
    }
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            icon: true
          }
        }
      ]
    });
    return config;
  },


};

export default nextConfig;
