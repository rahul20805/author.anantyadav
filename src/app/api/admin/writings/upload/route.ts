import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { storePdfLocally, deleteStoredPdf, MAX_PDF_SIZE_MB } from "@/lib/storage";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized access. Admin privileges required." }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file was uploaded." }, { status: 400 });
    }

    const filename = file.name || "document.pdf";
    if (!filename.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json(
        { error: "Invalid file type. Only .pdf files are accepted." },
        { status: 400 }
      );
    }

    if (file.type && file.type !== "application/pdf" && file.type !== "application/x-pdf") {
      return NextResponse.json(
        { error: "Invalid MIME type. Uploaded file must be an authentic PDF document." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await storePdfLocally(buffer, filename);

    return NextResponse.json({
      success: true,
      url: result.url,
      filename: result.filename,
      originalName: result.originalName,
      size: result.size,
    });
  } catch (error) {
    console.error("PDF upload error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred while saving the PDF document.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { url } = body;
    if (!url) {
      return NextResponse.json({ error: "File URL is required" }, { status: 400 });
    }

    await deleteStoredPdf(url);
    return NextResponse.json({ success: true, message: "PDF removed from storage." });
  } catch (error) {
    console.error("PDF deletion error:", error);
    return NextResponse.json({ error: "Failed to delete PDF from storage." }, { status: 500 });
  }
}
