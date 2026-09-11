import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { slugify, calculateReadingTime } from "@/lib/utils";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const writings = await prisma.writing.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ writings });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    const slug = data.slug ? slugify(data.slug) : slugify(data.title);
    const readingTime = calculateReadingTime(data.content);

    const writing = await prisma.writing.create({
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
    console.error("Error creating writing:", error);
    return NextResponse.json({ error: "Failed to create writing" }, { status: 500 });
  }
}
