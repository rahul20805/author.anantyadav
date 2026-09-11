import path from "path";
import fs from "fs";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getDatabaseUrl(): string {
  const bundledDb = path.join(process.cwd(), "prisma", "dev.db");
  const tmpDb = "/tmp/dev.db";

  // On Vercel (and similar serverless platforms), /var/task is read-only at runtime.
  // We must copy the seeded DB to /tmp (writable) before Prisma can write to it.
  const isServerless =
    !!process.env.VERCEL ||
    !!process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.NODE_ENV === "production";

  if (isServerless) {
    try {
      // Copy bundled seeded DB → /tmp on every cold start for write access
      if (fs.existsSync(bundledDb)) {
        fs.copyFileSync(bundledDb, tmpDb);
        return `file:${tmpDb}`;
      }
    } catch (e) {
      console.error("[db] Failed to copy DB to /tmp:", e);
    }
    // Fallback: use bundled path (reads work, writes will fail — last resort)
    return `file:${bundledDb}`;
  }

  // ── Local development ──────────────────────────────────────────
  const envUrl = process.env.DATABASE_URL;
  if (envUrl && !envUrl.match(/^file:\.\//)) {
    return envUrl;
  }

  // Scan for the dev.db file relative to cwd
  const candidates = [
    path.join(process.cwd(), "prisma", "dev.db"),
    path.join(process.cwd(), "dev.db"),
  ];
  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate)) return `file:${candidate}`;
    } catch {
      // ignore
    }
  }
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

// Cache globally — prevents a new PrismaClient on every hot-reload/warm invocation
globalForPrisma.prisma = prisma;
