import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    // Prevent Next from inferring a workspace root outside this repo when it detects multiple lockfiles.
    root: __dirname,
  },
};

export default nextConfig;

