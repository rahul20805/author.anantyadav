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
  const poem = await prisma.poem.findUnique({ where: { id } });

  if (!poem) return NextResponse.json({ error: "Poem not found" }, { status: 404 });
  return NextResponse.json({ poem });
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const data = await req.json();
    const slug = data.slug ? slugify(data.slug) : slugify(data.title);
    const readingTime = calculateReadingTime(data.content);

    const poem = await prisma.poem.update({
      where: { id },
      data: {
        title: data.title,
        slug,
        subtitle: data.subtitle || null,
        content: data.content,
        excerpt: data.excerpt || data.content.slice(0, 160),
        category: data.category || "Contemporary",
        tags: typeof data.tags === "string" ? data.tags : JSON.stringify(data.tags || []),
        coverImage: data.coverImage || null,
        audioUrl: data.audioUrl || null,
        readingTime,
        featured: Boolean(data.featured),
        published: Boolean(data.published),
        publishDate: data.publishDate || null,
        seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null,
      },
    });

    return NextResponse.json({ success: true, poem });
  } catch (error) {
    console.error("Error updating poem:", error);
    return NextResponse.json({ error: "Failed to update poem" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    await prisma.poem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting poem:", error);
    return NextResponse.json({ error: "Failed to delete poem" }, { status: 500 });
  }
}
