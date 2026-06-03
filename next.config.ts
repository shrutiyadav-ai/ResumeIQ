import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Externalize packages that use Node.js native modules or workers
  // so Next.js doesn't bundle them through webpack (which breaks pdfjs worker resolution)
  serverExternalPackages: ["pdf-parse", "pdfjs-dist", "better-sqlite3"],
};

export default nextConfig;
