import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "path";
import fs from "fs";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient;
};

// Heuristic to check database connection errors
export function isConnectionError(err: any): boolean {
  if (!err) return false;

  const code = String(err.code || "").toUpperCase();
  const msg = String(err.message || err).toUpperCase();
  const cause = err.cause ? String(err.cause.message || err.cause).toUpperCase() : "";
  const name = String(err.name || "").toUpperCase();

  return (
    code.includes("P1001") ||
    code.includes("P1002") ||
    code.includes("P1003") ||
    code.includes("P1008") ||
    code.includes("P1017") ||
    code.includes("ECONNREFUSED") ||
    code.includes("ENOTFOUND") ||
    code.includes("SQLITE_CANTOPEN") ||
    code.includes("SQLITE_BUSY") ||
    msg.includes("P1001") ||
    msg.includes("CAN'T REACH DATABASE") ||
    msg.includes("CONNECTION FAILED") ||
    msg.includes("DOES NOT EXIST") ||
    msg.includes("INITIALIZATION") ||
    msg.includes("SQLITE_CANTOPEN") ||
    cause.includes("CONNECTION REFUSED") ||
    name.includes("PrismaClientInitializationError")
  );
}

// Dynamically resolve connection string and handle SQLite file setup
let connectionString = process.env.DATABASE_URL || "file:./dev.db";

// Force SQLite file if a postgresql string was provided on Vercel project settings
if (connectionString.startsWith("postgres:") || connectionString.startsWith("postgresql:")) {
  console.log("[Prisma] Overriding PostgreSQL URL to SQLite file for local/offline runtime...");
  connectionString = "file:./dev.db";
}

// Determine if we are on Vercel (read-only filesystem, need to write to /tmp)
const isVercel = process.env.VERCEL === "1" || process.env.NOW_BUILDER === "1";
let finalUrl = connectionString;

if (finalUrl.startsWith("file:")) {
  let dbFilePath = finalUrl.slice(5); // Remove "file:" prefix
  
  if (isVercel) {
    const tmpDbPath = "/tmp/dev.db";
    const srcDbPath = path.resolve(process.cwd(), "dev.db");
    
    console.log(`[Prisma] Serverless environment detected. Initializing database copy from ${srcDbPath} to ${tmpDbPath}...`);
    try {
      // Create empty db file in /tmp if it doesn't exist
      if (!fs.existsSync(tmpDbPath)) {
        if (fs.existsSync(srcDbPath)) {
          fs.copyFileSync(srcDbPath, tmpDbPath);
          console.log("[Prisma] Successfully copied seeded database to /tmp/dev.db");
        } else {
          // Initialize a blank file
          fs.writeFileSync(tmpDbPath, "");
          console.log("[Prisma] Created blank database file at /tmp/dev.db");
        }
      } else {
        console.log("[Prisma] /tmp/dev.db already exists, reusing.");
      }
    } catch (e) {
      console.error("[Prisma] Failed to copy database to /tmp:", e);
    }
    
    finalUrl = `file:${tmpDbPath}`;
  } else {
    const absolutePath = path.isAbsolute(dbFilePath) ? dbFilePath : path.resolve(process.cwd(), dbFilePath);
    finalUrl = `file:${absolutePath.replace(/\\/g, "/")}`;
  }
}

let prisma: PrismaClient;

// Set back to environment variable so Prisma Client reads it natively
process.env.DATABASE_URL = finalUrl;

console.log(`[Prisma] Initializing native Prisma Client using Libsql adapter with: ${finalUrl}`);
const adapter = new PrismaLibSql({ url: finalUrl });

prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export { prisma };
export default prisma;


