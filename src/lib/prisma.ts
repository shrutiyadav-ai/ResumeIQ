import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import path from "path";

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

// Dynamically resolve connection string and switch adapters based on database protocol
const connectionString = process.env.DATABASE_URL || "file:./dev.db";
const isPostgres = connectionString.startsWith("postgres:") || connectionString.startsWith("postgresql:");

let prisma: PrismaClient;

if (isPostgres) {
  console.log("[Prisma] Initializing Prisma Client using PostgreSQL database with pg adapter...");
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  prisma = globalForPrisma.prisma || new PrismaClient({ adapter });
} else {
  let url = connectionString;
  if (url.startsWith("file:")) {
    const filePath = url.slice(5); // Remove "file:" prefix
    const absolutePath = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
    url = `file:${absolutePath.replace(/\\/g, "/")}`;
  } else {
    url = `file:${path.resolve(process.cwd(), url).replace(/\\/g, "/")}`;
  }

  console.log(`[Prisma] Initializing Prisma Client using SQLite adapter with: ${url}`);
  const adapter = new PrismaBetterSqlite3({ url });
  prisma = globalForPrisma.prisma || new PrismaClient({ adapter });
}

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export { prisma };
export default prisma;
