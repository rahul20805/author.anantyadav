import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (url && url.startsWith("libsql://")) {
    // ── Production / Vercel: use Turso hosted database ──────────────────────
    const libsql = createClient({ url, authToken });
    const adapter = new PrismaLibSQL(libsql);
    return new PrismaClient({ adapter, log: ["error"] });
  }

  // ── Local development: fall back to local SQLite file ───────────────────
  const { DATABASE_URL } = process.env;
  return new PrismaClient({
    datasources: {
      db: {
        url: DATABASE_URL || "file:./prisma/dev.db",
      },
    },
    log: ["error", "warn"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Cache globally to prevent connection exhaustion on hot-reload
globalForPrisma.prisma = prisma;
