import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { slugify } from "@/lib/utils";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const book = await prisma.book.findUnique({
    where: { id },
    include: { reviews: true },
  });

  if (!book) return NextResponse.json({ error: "Book not found" }, { status: 404 });
  return NextResponse.json({ book });
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const data = await req.json();
    const slug = data.slug ? slugify(data.slug) : slugify(data.title);

    const book = await prisma.book.update({
      where: { id },
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
    console.error("Error updating book:", error);
    return NextResponse.json({ error: "Failed to update book" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    await prisma.book.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting book:", error);
    return NextResponse.json({ error: "Failed to delete book" }, { status: 500 });
  }
}
