import fs from "fs";
import path from "path";
import { signSessionToken } from "../src/lib/auth";
import { prisma } from "../src/lib/db";
import { validatePdfBuffer, sanitizeFilename } from "../src/lib/storage";

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

async function runVerificationTests() {
  console.log("=== STARTING COMPREHENSIVE PDF & WRITINGS TEST SUITE ===\n");

  // 1. Verify Database Schema & Writing Entry
  console.log("1. Checking Database Model & Seeded Article...");
  const article = await prisma.writing.findUnique({
    where: { slug: "dont-make-women-goddesses-treat-them-like-humans" },
  });

  if (!article) {
    throw new Error("Seeded article not found in database!");
  }
  console.log("  ✓ Title:", article.title);
  console.log("  ✓ Author:", article.author);
  console.log("  ✓ Category:", article.category);
  console.log("  ✓ Published Date:", article.publishDate);
  console.log("  ✓ PDF URL:", article.pdfUrl);
  console.log("  ✓ PDF Filename:", article.pdfFilename);
  console.log("  ✓ PDF Size:", article.pdfSize, "bytes");
  console.log("  ✓ Status:", article.published ? "PUBLISHED" : "DRAFT");

  // 2. Verify PDF file on disk
  console.log("\n2. Checking PDF file on disk...");
  const diskPath = path.join(process.cwd(), "public", article.pdfUrl!.replace(/^\//, ""));
  if (!fs.existsSync(diskPath)) {
    throw new Error(`PDF file does not exist on disk at: ${diskPath}`);
  }
  const fileStat = fs.statSync(diskPath);
  console.log("  ✓ File exists at:", diskPath);
  console.log("  ✓ File size:", fileStat.size, "bytes");

  // 3. Test PDF Buffer validation
  console.log("\n3. Testing PDF Buffer validation...");
  const validBuffer = fs.readFileSync(diskPath);
  const validRes = validatePdfBuffer(validBuffer);
  if (!validRes.valid) throw new Error("Valid PDF was rejected by validator");
  console.log("  ✓ Valid PDF recognized successfully");

  const invalidBuffer = Buffer.from("Not a real PDF file content");
  const invalidRes = validatePdfBuffer(invalidBuffer);
  if (invalidRes.valid) throw new Error("Corrupt/fake PDF was incorrectly accepted!");
  console.log("  ✓ Fake/Non-PDF header correctly rejected:", invalidRes.error);

  // 4. Test Filename sanitization
  console.log("\n4. Testing filename sanitization...");
  const clean = sanitizeFilename("My Essay / Dangerous..Name (2026).pdf");
  console.log("  ✓ Sanitized 'My Essay / Dangerous..Name (2026).pdf' ->", clean);
  if (clean.includes("/") || clean.includes("..")) {
    throw new Error("Sanitization failed to remove hazardous characters");
  }

  // 5. Test Auth token generation
  console.log("\n5. Testing Admin Auth Token...");
  const admin = await prisma.adminUser.findFirst();
  if (!admin) throw new Error("No admin user found in database");
  const token = await signSessionToken({
    userId: admin.id,
    email: admin.email,
    role: admin.role,
    name: admin.name,
  });
  console.log("  ✓ Generated valid JWT session token for:", admin.email);

  console.log("\n=== ALL TEST CHECKS PASSED PERFECTLY ===");
}

runVerificationTests()
  .catch((err) => {
    console.error("\n❌ TEST FAILED:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
