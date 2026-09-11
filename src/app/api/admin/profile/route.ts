import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await prisma.authorProfile.findFirst({ where: { id: "default" } });
  return NextResponse.json({ profile });
}

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    const profile = await prisma.authorProfile.upsert({
      where: { id: "default" },
      update: {
        name: data.name,
        title: data.title,
        taglines: data.taglines,
        shortBio: data.shortBio,
        fullBio: data.fullBio,
        statement: data.statement,
        philosophy: data.philosophy,
        education: data.education || null,
        publications: data.publications || null,
        achievements: data.achievements || null,
        email: data.email,
        location: data.location || null,
        phone: data.phone || null,
        pressKitUrl: data.pressKitUrl || null,
        profileImage: data.profileImage || null,
        heroImage: data.heroImage || null,
        socialLinks: typeof data.socialLinks === "string" ? data.socialLinks : JSON.stringify(data.socialLinks || {}),
        isPublished: Boolean(data.isPublished),
      },
      create: {
        id: "default",
        name: data.name,
        title: data.title,
        taglines: data.taglines,
        shortBio: data.shortBio,
        fullBio: data.fullBio,
        statement: data.statement,
        philosophy: data.philosophy,
        education: data.education || null,
        publications: data.publications || null,
        achievements: data.achievements || null,
        email: data.email,
        location: data.location || null,
        phone: data.phone || null,
        pressKitUrl: data.pressKitUrl || null,
        profileImage: data.profileImage || null,
        heroImage: data.heroImage || null,
        socialLinks: typeof data.socialLinks === "string" ? data.socialLinks : JSON.stringify(data.socialLinks || {}),
        isPublished: Boolean(data.isPublished),
      },
    });

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error("Error updating author profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
