import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const books = await prisma.book.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { reviews: true } } },
  });
  return NextResponse.json({ books });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    const slug = data.slug ? slugify(data.slug) : slugify(data.title);

    const book = await prisma.book.create({
      data: {
        title: data.title,
        slug,
        subtitle: data.subtitle || null,
        description: data.description,
        longDescription: data.longDescription || null,
        authorNote: data.authorNote || null,
        publisher: data.publisher || null,
        isbn: data.isbn || null,
        genre: data.genre || "Literary Fiction",
        language: data.language || "English",
        pageCount: data.pageCount ? parseInt(data.pageCount) : null,
        publicationDate: data.publicationDate || null,
        coverImage: data.coverImage || null,
        purchaseLinks: typeof data.purchaseLinks === "string" ? data.purchaseLinks : JSON.stringify(data.purchaseLinks || []),
        rating: data.rating ? parseFloat(data.rating) : 0,
        featured: Boolean(data.featured),
        published: Boolean(data.published),
        tags: typeof data.tags === "string" ? data.tags : JSON.stringify(data.tags || []),
        seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null,
      },
    });

    return NextResponse.json({ success: true, book });
  } catch (error) {
    console.error("Error creating book:", error);
    return NextResponse.json({ error: "Failed to create book" }, { status: 500 });
  }
}
