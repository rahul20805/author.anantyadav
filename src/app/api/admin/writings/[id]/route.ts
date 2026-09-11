import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { slugify, calculateReadingTime } from "@/lib/utils";

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
    const data = await req.json();
    const slug = data.slug ? slugify(data.slug) : slugify(data.title);
    const readingTime = calculateReadingTime(data.content);

    const writing = await prisma.writing.update({
      where: { id },
      data: {
        title: data.title,
        slug,
        subtitle: data.subtitle || null,
        content: data.content,
        excerpt: data.excerpt || data.content.slice(0, 180),
        category: data.category || "Essay",
        tags: typeof data.tags === "string" ? data.tags : JSON.stringify(data.tags || []),
        coverImage: data.coverImage || null,
        canonicalUrl: data.canonicalUrl || null,
        readingTime,
        featured: Boolean(data.featured),
        published: Boolean(data.published),
        publishDate: data.publishDate || null,
        seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null,
      },
    });

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
    await prisma.writing.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting writing:", error);
    return NextResponse.json({ error: "Failed to delete writing" }, { status: 500 });
  }
}
