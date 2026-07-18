// Load environment variables from .env file natively in Node.js
try {
  if (typeof process.loadEnvFile === "function") {
    process.loadEnvFile();
  }
} catch (e) {
  // Silence if file doesn't exist
}

// Ensure the connection URL matches SQLite if we are using the sqlite provider
const envUrl = process.env.DATABASE_URL || "";
const isSQLiteUrl = envUrl.startsWith("file:") || envUrl.includes(".db");
const finalUrl = isSQLiteUrl ? envUrl : "file:./dev.db";

module.exports = {
  schema: "prisma/schema.prisma",
  datasource: {
    url: finalUrl,
  },
};
