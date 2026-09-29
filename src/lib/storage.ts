import fs from "fs";
import path from "path";
import { promisify } from "util";

const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);
const exists = promisify(fs.exists);

import { formatFileSize } from "./utils";

// Max allowed PDF upload size in Megabytes (default: 25 MB)
export const MAX_PDF_SIZE_MB = parseInt(process.env.MAX_PDF_SIZE_MB || "25", 10);
export const MAX_PDF_SIZE_BYTES = MAX_PDF_SIZE_MB * 1024 * 1024;


export function sanitizeFilename(originalName: string): string {
  const baseName = path.basename(originalName, path.extname(originalName));
  const cleanBase = baseName
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return cleanBase || "document";
}

export function validatePdfBuffer(buffer: Buffer): { valid: boolean; error?: string } {
  if (buffer.length === 0) {
    return { valid: false, error: "The uploaded file is empty." };
  }

  if (buffer.length > MAX_PDF_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size exceeds the maximum limit of ${MAX_PDF_SIZE_MB}MB (received ${formatFileSize(buffer.length)}).`,
    };
  }

  // Check magic number for PDF: '%PDF-'
  const header = buffer.subarray(0, 5).toString("utf-8");
  if (!header.startsWith("%PDF-")) {
    return { valid: false, error: "Invalid PDF file format. The file header does not match PDF standards." };
  }

  return { valid: true };
}

export interface StoredPdfResult {
  url: string;
  filename: string;
  size: number;
  originalName: string;
}

export async function storePdfLocally(
  buffer: Buffer,
  originalFilename: string
): Promise<StoredPdfResult> {
  const validation = validatePdfBuffer(buffer);
  if (!validation.valid) {
    throw new Error(validation.error || "Invalid PDF file");
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads", "pdfs");
  if (!fs.existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  const cleanName = sanitizeFilename(originalFilename);
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 7);
  const targetFilename = `${cleanName}-${timestamp}-${randomSuffix}.pdf`;
  const targetPath = path.join(uploadDir, targetFilename);

  await writeFile(targetPath, buffer);

  const publicUrl = `/uploads/pdfs/${targetFilename}`;

  return {
    url: publicUrl,
    filename: targetFilename,
    size: buffer.length,
    originalName: originalFilename,
  };
}

export async function deleteStoredPdf(fileUrlOrFilename?: string | null): Promise<boolean> {
  if (!fileUrlOrFilename) return false;

  try {
    const filename = path.basename(fileUrlOrFilename);
    const targetPath = path.join(process.cwd(), "public", "uploads", "pdfs", filename);

    if (fs.existsSync(targetPath)) {
      await unlink(targetPath);
      return true;
    }
    return false;
  } catch (err) {
    console.warn("Could not delete stored PDF file:", err);
    return false;
  }
}
