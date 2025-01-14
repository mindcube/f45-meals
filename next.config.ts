import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "s3.us-west-1.amazonaws.com",
      "cdn.f45training.com",
      "s3-ap-southeast-2.amazonaws.com",
    ],
  },
};

export default nextConfig;
