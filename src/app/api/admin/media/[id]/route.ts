import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const data = await req.json();
    const item = await prisma.mediaItem.update({
      where: { id },
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
    console.error("Error updating media:", error);
    return NextResponse.json({ error: "Failed to update media item" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    await prisma.mediaItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting media:", error);
    return NextResponse.json({ error: "Failed to delete media item" }, { status: 500 });
  }
}
