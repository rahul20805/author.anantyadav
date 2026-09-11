import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { bookId, readerName, readerEmail, rating, comment } = await req.json();

    if (!readerName || !comment) {
      return NextResponse.json({ error: "Name and comment are required." }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        bookId: bookId || null,
        readerName: readerName.trim(),
        readerEmail: readerEmail?.trim() || null,
        rating: Math.min(5, Math.max(1, Number(rating) || 5)),
        comment: comment.trim(),
        isApproved: false, // Moderated by default
      },
    });

    return NextResponse.json({ success: true, reviewId: review.id });
  } catch (error) {
    console.error("Review submission error:", error);
    return NextResponse.json({ error: "Failed to submit review." }, { status: 500 });
  }
}
