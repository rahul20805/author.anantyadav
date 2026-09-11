import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const thoughts = await prisma.thought.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ thoughts });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    const thought = await prisma.thought.create({
      data: {
        quote: data.quote,
        context: data.context || null,
        source: data.source || "Anant Yadav",
        category: data.category || "Philosophy",
        featured: Boolean(data.featured),
        published: Boolean(data.published),
      },
    });

    return NextResponse.json({ success: true, thought });
  } catch (error) {
    console.error("Error creating thought:", error);
    return NextResponse.json({ error: "Failed to create thought" }, { status: 500 });
  }
}
