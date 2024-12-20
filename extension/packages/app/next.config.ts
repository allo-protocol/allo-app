import type { NextConfig } from "next";

import path from "path";
const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      // Temporary fix to resolve these in nextjs package correctly (it works with next dev --turbopack)
      "~~": path.resolve("../nextjs/"),
    };
    return config;
  },
};

export default nextConfig;
