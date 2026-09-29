import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
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
    const readingTime = data.content ? calculateReadingTime(data.content) : 5;

    const writing = await prisma.writing.create({
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
    console.error("Error creating writing:", error);
    return NextResponse.json({ error: "Failed to create writing" }, { status: 500 });
  }
}
