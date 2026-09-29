import fs from "fs";
import path from "path";
import { createClient } from "@libsql/client";

// Load .env
try {
  const envPath = path.join(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf-8");
    for (const line of envContent.split("\n")) {
      const match =
        line.match(/^\s*([\w.-]+)\s*=\s*"(.*)"\s*$/) ||
        line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
      if (match) {
        const [, key, value] = match;
        if (!process.env[key]) {
          process.env[key] = value.trim();
        }
      }
    }
  }
} catch (e) {}

async function migrateTurso() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !url.startsWith("libsql://")) {
    console.log("No Turso URL detected, skipping Turso migration.");
    return;
  }

  console.log("Connecting to Turso database:", url);
  const client = createClient({ url, authToken });

  const migrations = [
    "ALTER TABLE Writing ADD COLUMN author TEXT DEFAULT 'Anant Yadav'",
    "ALTER TABLE Writing ADD COLUMN pdfUrl TEXT",
    "ALTER TABLE Writing ADD COLUMN pdfFilename TEXT",
    "ALTER TABLE Writing ADD COLUMN pdfSize INTEGER",
  ];

  for (const sql of migrations) {
    try {
      console.log("Executing:", sql);
      await client.execute(sql);
      console.log("✓ Success");
    } catch (err: any) {
      if (err.message && err.message.includes("duplicate column name")) {
        console.log("ℹ Column already exists, skipping.");
      } else {
        console.error("Migration warning:", err.message);
      }
    }
  }

  console.log("Turso database schema updated successfully!");
}

migrateTurso().catch(console.error);
