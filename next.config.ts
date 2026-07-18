import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Externalize packages that use Node.js native modules or workers
  // so Next.js doesn't bundle them through webpack
  serverExternalPackages: ["pdf-parse", "pdfjs-dist", "@prisma/client"],
};

export default nextConfig;
