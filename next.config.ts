import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Optimization */
  swcMinify: true,
  compress: true,

  /* Image optimization */
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "**.cloudinary.com",
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  /* Development environment variables */
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_STRIPE_KEY: process.env.NEXT_PUBLIC_STRIPE_KEY,
  },

  /* Headers and security */
  headers: async () => {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "geolocation=(), microphone=(), camera=()",
          },
        ],
      },
    ];
  },

  /* Redirects */
  redirects: async () => {
    return [
      {
        source: "/products",
        destination: "/shop",
        permanent: true,
      },
      {
        source: "/blog",
        destination: "/journal",
        permanent: true,
      },
    ];
  },

  /* Rewrites */
  rewrites: async () => {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [],
    };
  },

  /* Webpack config */
  webpack: (config, { isServer }) => {
    return config;
  },

  /* Experimental features */
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },

  /* Production settings */
  productionBrowserSourceMaps: false,

  /* Build output */
  output: "standalone",

  /* TypeScript strict mode */
  typescript: {
    tsconfigPath: "./tsconfig.json",
  },

  /* ESLint configuration */
  eslint: {
    dirs: ["src"],
  },

  /* Locale configuration (optional) */
  i18n: undefined,

  /* Trailing slash configuration */
  trailingSlash: false,

  /* React strict mode */
  reactStrictMode: true,
};

export default nextConfig;
