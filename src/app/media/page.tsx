import Link from "next/link";
import { prisma } from "@/lib/db";
import { generateSeoMetadata, DEFAULT_SITE_KEYWORDS } from "@/lib/seo";
import { Sparkles, Mail, Bookmark, Award } from "lucide-react";
import { MediaGalleryClient, MediaItemData } from "@/components/MediaGalleryClient";

export const dynamic = "force-dynamic";
export const revalidate = 0; // Always serve fresh media items

export async function generateMetadata() {
  return generateSeoMetadata({
    title: "Media & Press | Visual Archive, Bookmarks & Interviews — Anant Yadav",
    description:
      "Explore official media, physical literary merchandise, collector bookmarks, keychains for 'जा रही हो?' (Jaa Rahi Ho) and 'चुप मत रहा करो', plus interviews and press features by author Anant Yadav.",
    path: "/media",
    keywords: [
      ...DEFAULT_SITE_KEYWORDS,
      "Anant Yadav media",
      "Anant Yadav press",
      "Jaa Rahi Ho keychain",
      "Jaa Rahi Ho bookmark",
      "Shivija Publications merchandise",
      "Anant Yadav interviews",
      "Hindi literature merchandise",
    ],
  });
}

export default async function MediaPage() {
  const mediaItemsRaw = await prisma.mediaItem.findMany({
    where: { published: true },
    orderBy: [
      { featured: "desc" },
      { createdAt: "desc" },
    ],
  });

  const mediaItems: MediaItemData[] = mediaItemsRaw.map((item) => ({
    id: item.id,
    title: item.title,
    publication: item.publication,
    date: item.date,
    url: item.url,
    excerpt: item.excerpt,
    mediaType: item.mediaType,
    coverImage: item.coverImage,
    featured: item.featured,
  }));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-900 border border-stone-800 text-amber-400 text-xs font-mono tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5" /> Public Presence &amp; Visual Archive
        </div>
        <h1 className="font-serif-literary text-4xl sm:text-6xl font-bold text-stone-100 tracking-tight">
          Media, Press &amp; Artifacts
        </h1>
        <p className="text-stone-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Official literary collectibles, collector bookmarks, handcrafted keepsakes for <em>&ldquo;जा रही हो?&rdquo;</em>, press features, and author conversations.
        </p>
      </div>

      {/* Featured Literary Merchandise Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-stone-900/90 via-stone-900/60 to-amber-950/20 border border-amber-500/20 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 text-[11px] font-mono text-amber-400 uppercase tracking-widest">
            <Bookmark className="w-3.5 h-3.5" /> Official Collector Editions
          </div>
          <h2 className="font-serif-literary text-2xl sm:text-3xl font-bold text-stone-100">
            Physical Keepsakes &amp; Book Merchandise
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 max-w-xl leading-relaxed">
            Crafted in collaboration with Shivija Publications — explore the miniature book keychains with complete ISBN &amp; author imprint, and commemorative Varanasi Ghat poetry bookmarks.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            href="/books/jaa-rahi-ho"
            className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md"
          >
            <Award className="w-3.5 h-3.5" /> Order Book &amp; Collectibles
          </Link>
          <Link
            href="/contact?category=press"
            className="bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-700 px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
          >
            <Mail className="w-3.5 h-3.5" /> Press Inquiries
          </Link>
        </div>
      </div>

      {/* Interactive Gallery & Filterable Media Grid */}
      <MediaGalleryClient initialItems={mediaItems} />
    </div>
  );
}
