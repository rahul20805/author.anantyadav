import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const events = await prisma.eventItem.findMany({
    orderBy: { date: "desc" },
  });
  return NextResponse.json({ events });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    const event = await prisma.eventItem.create({
      data: {
        title: data.title,
        date: data.date,
        time: data.time || null,
        venue: data.venue,
        city: data.city,
        description: data.description,
        rsvpUrl: data.rsvpUrl || null,
        coverImage: data.coverImage || null,
        isPast: Boolean(data.isPast),
        isOnline: Boolean(data.isOnline),
        featured: Boolean(data.featured),
        published: Boolean(data.published),
      },
    });

    return NextResponse.json({ success: true, event });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
