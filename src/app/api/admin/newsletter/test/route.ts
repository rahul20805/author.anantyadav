import { NextRequest, NextResponse } from "next/server";
import { sendBrevoWelcomeEmail } from "@/lib/brevo";

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    const result = await sendBrevoWelcomeEmail({
      toEmail: email,
      recipientName: name || "Test Reader",
    });

    return NextResponse.json({
      success: result.success,
      messageId: result.messageId,
      provider: result.provider,
      error: result.error,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to send test email" }, { status: 500 });
  }
}
