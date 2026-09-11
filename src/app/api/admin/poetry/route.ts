import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { slugify, calculateReadingTime } from "@/lib/utils";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const poems = await prisma.poem.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ poems });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    const slug = data.slug ? slugify(data.slug) : slugify(data.title);
    const readingTime = calculateReadingTime(data.content);

    const poem = await prisma.poem.create({
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
    console.error("Error creating poem:", error);
    return NextResponse.json({ error: "Failed to create poem" }, { status: 500 });
  }
}
