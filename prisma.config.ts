import { defineConfig } from "prisma/config";

// Load environment variables from .env file natively in Node.js
try {
  // @ts-ignore
  if (typeof process.loadEnvFile === "function") {
    // @ts-ignore
    process.loadEnvFile();
  }
} catch (e) {
  // Silence if file doesn't exist
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL || "file:./dev.db",
  },
});
