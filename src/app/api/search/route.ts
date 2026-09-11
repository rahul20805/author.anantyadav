import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.toLowerCase().trim() || "";
    const type = searchParams.get("type") || "all";

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    interface SearchResult {
      id: string;
      type: "book" | "poem" | "writing" | "thought" | "media" | "event";
      title: string;
      subtitle?: string | null;
      snippet: string;
      url: string;
      category?: string | null;
    }

    const results: SearchResult[] = [];

    // Search Books
    if (type === "all" || type === "book") {
      const books = await prisma.book.findMany({
        where: {
          published: true,
          OR: [
            { title: { contains: query } },
            { description: { contains: query } },
            { genre: { contains: query } },
          ],
        },
        take: 5,
      });

      for (const b of books) {
        results.push({
          id: b.id,
          type: "book",
          title: b.title,
          subtitle: b.subtitle,
          snippet: b.description,
          url: `/books/${b.slug}`,
          category: b.genre,
        });
      }
    }

    // Search Poetry
    if (type === "all" || type === "poem") {
      const poems = await prisma.poem.findMany({
        where: {
          published: true,
          OR: [
            { title: { contains: query } },
            { content: { contains: query } },
            { category: { contains: query } },
          ],
        },
        take: 5,
      });

      for (const p of poems) {
        results.push({
          id: p.id,
          type: "poem",
          title: p.title,
          subtitle: p.subtitle,
          snippet: p.excerpt || p.content.slice(0, 140),
          url: `/poetry/${p.slug}`,
          category: p.category,
        });
      }
    }

    // Search Writings
    if (type === "all" || type === "writing") {
      const writings = await prisma.writing.findMany({
        where: {
          published: true,
          OR: [
            { title: { contains: query } },
            { content: { contains: query } },
            { category: { contains: query } },
          ],
        },
        take: 5,
      });

      for (const w of writings) {
        results.push({
          id: w.id,
          type: "writing",
          title: w.title,
          subtitle: w.subtitle,
          snippet: w.excerpt || w.content.slice(0, 140),
          url: `/writings/${w.slug}`,
          category: w.category,
        });
      }
    }

    // Search Thoughts
    if (type === "all" || type === "thought") {
      const thoughts = await prisma.thought.findMany({
        where: {
          published: true,
          OR: [
            { quote: { contains: query } },
            { context: { contains: query } },
            { category: { contains: query } },
          ],
        },
        take: 5,
      });

      for (const t of thoughts) {
        results.push({
          id: t.id,
          type: "thought",
          title: `"${t.quote.slice(0, 60)}..."`,
          subtitle: t.context,
          snippet: t.quote,
          url: `/thoughts`,
          category: t.category,
        });
      }
    }

    // Search Media
    if (type === "all" || type === "media") {
      const media = await prisma.mediaItem.findMany({
        where: {
          published: true,
          OR: [
            { title: { contains: query } },
            { publication: { contains: query } },
            { excerpt: { contains: query } },
          ],
        },
        take: 5,
      });

      for (const m of media) {
        results.push({
          id: m.id,
          type: "media",
          title: m.title,
          subtitle: m.publication,
          snippet: m.excerpt || m.title,
          url: `/media`,
          category: m.mediaType,
        });
      }
    }

    // Search Events
    if (type === "all" || type === "event") {
      const events = await prisma.eventItem.findMany({
        where: {
          published: true,
          OR: [
            { title: { contains: query } },
            { description: { contains: query } },
            { city: { contains: query } },
          ],
        },
        take: 5,
      });

      for (const e of events) {
        results.push({
          id: e.id,
          type: "event",
          title: e.title,
          subtitle: `${e.date} • ${e.city}`,
          snippet: e.description,
          url: `/events`,
          category: e.isOnline ? "Virtual" : "In-Person",
        });
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json({ error: "Failed to execute search" }, { status: 500 });
  }
}
