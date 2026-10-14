import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const email = searchParams.get("email");

  if (!email) {
    return new Response("Missing email parameter", { status: 400 });
  }

  const cleanEmail = email.toLowerCase().trim();

  try {
    await prisma.newsletterSubscriber.updateMany({
      where: { email: cleanEmail },
      data: { status: "unsubscribed" },
    });
  } catch (err) {
    console.error("Unsubscribe error:", err);
  }

  // Return a beautiful, polite unsubscribe confirmation page
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Unsubscribed — The Solitude Dispatch</title>
  <style>
    body {
      background-color: #0c0a09;
      color: #e7e5e4;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 24px;
      box-sizing: border-box;
    }
    .card {
      max-width: 480px;
      background-color: #171513;
      border: 1px solid #2e2a25;
      border-radius: 20px;
      padding: 40px 32px;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0,0,0,0.8);
    }
    h1 {
      font-family: Georgia, serif;
      font-size: 24px;
      color: #fef3c7;
      margin-top: 12px;
    }
    p {
      color: #a8a29e;
      font-size: 14px;
      line-height: 1.6;
    }
    .btn {
      display: inline-block;
      margin-top: 24px;
      padding: 12px 24px;
      background-color: #d97706;
      color: #0c0a09;
      font-size: 12px;
      font-family: monospace;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      text-decoration: none;
      border-radius: 8px;
    }
  </style>
</head>
<body>
  <div class="card">
    <div style="font-size: 32px;">🕊️</div>
    <h1>You have been unsubscribed</h1>
    <p>
      Your email (<strong style="color: #e7e5e4;">${cleanEmail}</strong>) has been removed from <em>The Solitude Dispatch</em>.
    </p>
    <p>
      Thank you for having spent time in our quiet reading circle. You are always welcome back.
    </p>
    <a href="https://authoranant.in" class="btn">Return to Website</a>
  </div>
</body>
</html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
