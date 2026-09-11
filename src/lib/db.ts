import path from "path";
import fs from "fs";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getDatabaseUrl() {
  const envUrl = process.env.DATABASE_URL;
  if (!envUrl || envUrl.startsWith("file:")) {
    const candidates = [
      path.join(process.cwd(), "prisma", "dev.db"),
      path.join(process.cwd(), "dev.db"),
      path.resolve("prisma", "dev.db"),
      path.resolve("dev.db"),
    ];

    for (const candidate of candidates) {
      if (fs.existsSync(candidate)) {
        return `file:${candidate}`;
      }
    }
    return `file:${path.join(process.cwd(), "prisma", "dev.db")}`;
  }
  return envUrl;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

