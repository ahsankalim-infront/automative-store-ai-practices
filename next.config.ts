import type { NextConfig } from "next";
import { buildNextImageConfig } from "./src/lib/images/config";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  images: buildNextImageConfig(),
};

export default nextConfig;
