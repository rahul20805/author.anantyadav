import path from "path";
import fs from "fs";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getDatabaseUrl(): string {
  const envUrl = process.env.DATABASE_URL;

  // If a DATABASE_URL is explicitly set and is NOT a bare relative file: URI, use it as-is.
  // A bare relative path like "file:./dev.db" is not usable in serverless — resolve it.
  if (envUrl && !envUrl.match(/^file:\.[\/\\]/)) {
    return envUrl;
  }

  // Resolve the absolute path to the bundled SQLite file.
  // Vercel bundles the prisma/ directory under /var/task (= process.cwd()).
  const candidates = [
    path.join(process.cwd(), "prisma", "dev.db"),
    path.join(process.cwd(), "dev.db"),
    // __dirname-relative paths for edge cases
    path.join(path.dirname(new URL(import.meta.url).pathname), "..", "..", "prisma", "dev.db"),
  ];

  for (const candidate of candidates) {
    try {
      if (fs.existsSync(/*turbopackIgnore: true*/ candidate)) {
        return `file:${candidate}`;
      }
    } catch {
      // ignore
    }
  }

  // Final fallback — Vercel standard path
  return `file:${path.join(process.cwd(), "prisma", "dev.db")}`;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
    log: ["error"],
  });

// Cache the client globally to prevent connection exhaustion across hot-reloads
globalForPrisma.prisma = prisma;

