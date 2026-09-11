import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser, hashPassword } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const settings = await prisma.siteSetting.findFirst({ where: { id: "default" } });
  return NextResponse.json({ settings });
}

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();

    // If updating admin password
    if (data.newPassword) {
      const passwordHash = await hashPassword(data.newPassword);
      await prisma.adminUser.update({
        where: { id: user.userId },
        data: { passwordHash },
      });
    }

    const settings = await prisma.siteSetting.upsert({
      where: { id: "default" },
      update: {
        siteTitle: data.siteTitle,
        tagline: data.tagline,
        metaDescription: data.metaDescription,
        keywords: data.keywords,
        authorName: data.authorName,
        googleAnalyticsId: data.googleAnalyticsId || null,
        googleSearchConsoleToken: data.googleSearchConsoleToken || null,
        announcementActive: Boolean(data.announcementActive),
        announcementText: data.announcementText || null,
        announcementUrl: data.announcementUrl || null,
        footerAbout: data.footerAbout,
        copyrightText: data.copyrightText,
      },
      create: {
        id: "default",
        siteTitle: data.siteTitle,
        tagline: data.tagline,
        metaDescription: data.metaDescription,
        keywords: data.keywords,
        authorName: data.authorName,
        googleAnalyticsId: data.googleAnalyticsId || null,
        googleSearchConsoleToken: data.googleSearchConsoleToken || null,
        announcementActive: Boolean(data.announcementActive),
        announcementText: data.announcementText || null,
        announcementUrl: data.announcementUrl || null,
        footerAbout: data.footerAbout,
        copyrightText: data.copyrightText,
      },
    });

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
