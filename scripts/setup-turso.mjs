import { createClient } from "@libsql/client";
import fs from "fs";
import path from "path";

function loadEnv() {
  try {
    const envPath = path.join(process.cwd(), ".env");
    const envContent = fs.readFileSync(envPath, "utf-8");
    for (const line of envContent.split("\n")) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*"(.*)"\s*$/) || line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
      if (match) {
        const [, key, value] = match;
        if (!process.env[key]) {
          process.env[key] = value.trim();
        }
      }
    }
  } catch (err) {
    console.warn("Could not load .env file:", err.message);
  }
}

loadEnv();

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error("TURSO_DATABASE_URL or TURSO_AUTH_TOKEN missing in .env");
  process.exit(1);
}

const client = createClient({ url, authToken });

async function main() {
  console.log("Connecting to Turso:", url);

  const sqlFile = fs.readFileSync(path.join(process.cwd(), "prisma", "schema.sql"), "utf-8");
  
  // Remove line comments and split by semicolon
  const cleanSql = sqlFile
    .split("\n")
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n");

  const statements = cleanSql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  console.log(`Executing ${statements.length} DDL statements on Turso...`);

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    try {
      await client.execute(stmt);
      console.log(`[${i + 1}/${statements.length}] Executed successfully.`);
    } catch (err) {
      console.warn(`[${i + 1}/${statements.length}] Statement note: ${err.message}`);
    }
  }

  console.log("Schema successfully created on Turso!");
}

main().catch(console.error);
