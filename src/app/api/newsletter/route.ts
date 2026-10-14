import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "A valid email address is required" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    await prisma.newsletterSubscriber.upsert({
      where: { email: cleanEmail },
      update: { status: "active", name: name || undefined },
      create: {
        email: cleanEmail,
        name: name || null,
        status: "active",
      },
    });

    // Send automated notification/confirmation email from newsletter@author.in
    try {
      const { sendNewsletterWelcomeEmail } = await import("@/lib/email");
      await sendNewsletterWelcomeEmail({
        toEmail: cleanEmail,
        recipientName: name || null,
      });
    } catch (mailError) {
      console.warn("Could not send newsletter welcome email:", mailError);
    }

    return NextResponse.json({ success: true, message: "Subscribed successfully! Confirmation email sent." });
  } catch (error) {
    console.error("Newsletter error:", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
