import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { slugify, calculateReadingTime } from "@/lib/utils";
import { deleteStoredPdf } from "@/lib/storage";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const writing = await prisma.writing.findUnique({ where: { id } });

  if (!writing) return NextResponse.json({ error: "Writing not found" }, { status: 404 });
  return NextResponse.json({ writing });
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const existing = await prisma.writing.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Writing not found" }, { status: 404 });
    }

    const data = await req.json();
    const slug = data.slug ? slugify(data.slug) : slugify(data.title);
    const readingTime = data.content ? calculateReadingTime(data.content) : 5;

    // If PDF URL changed or removed, clean up previous PDF if it was a local upload
    if (existing.pdfUrl && data.pdfUrl !== existing.pdfUrl) {
      await deleteStoredPdf(existing.pdfUrl);
    }

    const writing = await prisma.writing.update({
      where: { id },
      data: {
        title: data.title,
        slug,
        subtitle: data.subtitle || null,
        content: data.content || "",
        excerpt: data.excerpt || (data.content ? data.content.slice(0, 180) : null),
        category: data.category || "Essay",
        author: data.author || "Anant Yadav",
        tags: typeof data.tags === "string" ? data.tags : JSON.stringify(data.tags || []),
        coverImage: data.coverImage || null,
        pdfUrl: data.pdfUrl || null,
        pdfFilename: data.pdfFilename || null,
        pdfSize: data.pdfSize ? Number(data.pdfSize) : null,
        canonicalUrl: data.canonicalUrl || null,
        readingTime,
        featured: Boolean(data.featured),
        published: Boolean(data.published),
        publishDate: data.publishDate || null,
        seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null,
      },
    });

    revalidatePath("/writings");
    revalidatePath(`/writings/${writing.slug}`);
    revalidatePath("/");

    return NextResponse.json({ success: true, writing });
  } catch (error) {
    console.error("Error updating writing:", error);
    return NextResponse.json({ error: "Failed to update writing" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const existing = await prisma.writing.findUnique({ where: { id } });
    if (existing?.pdfUrl) {
      await deleteStoredPdf(existing.pdfUrl);
    }

    await prisma.writing.delete({ where: { id } });

    revalidatePath("/writings");
    if (existing?.slug) {
      revalidatePath(`/writings/${existing.slug}`);
    }
    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting writing:", error);
    return NextResponse.json({ error: "Failed to delete writing" }, { status: 500 });
  }
}
