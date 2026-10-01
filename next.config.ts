import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
  // mongoose must stay a native Node dependency on the server
  serverExternalPackages: ["mongoose"],
};

export default nextConfig;
