import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const media = await prisma.mediaItem.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ media });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    const item = await prisma.mediaItem.create({
      data: {
        title: data.title,
        publication: data.publication,
        date: data.date,
        url: data.url || null,
        excerpt: data.excerpt || null,
        mediaType: data.mediaType || "interview",
        coverImage: data.coverImage || null,
        featured: Boolean(data.featured),
        published: Boolean(data.published),
      },
    });

    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error("Error creating media:", error);
    return NextResponse.json({ error: "Failed to create media entry" }, { status: 500 });
  }
}
