import { createClient } from "@libsql/client";
import fs from "fs";
import path from "path";

const envContent = fs.readFileSync(path.join(process.cwd(), ".env"), "utf-8");
let url = "";
let authToken = "";

for (const line of envContent.split("\n")) {
  if (line.startsWith("TURSO_DATABASE_URL=")) {
    url = line.split("=")[1].replace(/"/g, "").trim();
  }
  if (line.startsWith("TURSO_AUTH_TOKEN=")) {
    authToken = line.split("=")[1].replace(/"/g, "").trim();
  }
}

console.log("Testing URL:", url);

const client = createClient({ url, authToken });

async function test() {
  const res = await client.execute("SELECT 1 AS num");
  console.log("Turso Connection Success! Result:", res.rows);
}

test().catch((err) => {
  console.error("Turso Connection Error:", err);
});
