import Link from "next/link";
import { prisma } from "@/lib/db";
import { generateSeoMetadata } from "@/lib/seo";
import { Sparkles, Newspaper, Mic, Video, ExternalLink, Mail } from "lucide-react";

export const revalidate = 60;

export async function generateMetadata() {
  return generateSeoMetadata({
    title: "Media & Press | Interviews & Coverage for Anant Yadav",
    description:
      "Press releases, interviews, podcast appearances, and media mentions featuring author and poet Anant Yadav.",
    path: "/media",
  });
}

export default async function MediaPage() {
  const mediaItems = await prisma.mediaItem.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  const getMediaIcon = (type: string) => {
    switch (type) {
      case "podcast":
        return <Mic className="w-4 h-4 text-amber-400" />;
      case "video":
        return <Video className="w-4 h-4 text-rose-400" />;
      default:
        return <Newspaper className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-900 border border-stone-800 text-amber-400 text-xs font-mono tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5" /> Public Presence
        </div>
        <h1 className="font-serif-literary text-4xl sm:text-6xl font-bold text-stone-100 tracking-tight">
          Media &amp; Press
        </h1>
        <p className="text-stone-300 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
          Conversations, literary features, podcasts, and discussions on literature and philosophy.
        </p>
      </div>

      {/* Media Inquiries Box */}
      <div className="p-8 rounded-3xl bg-stone-900/60 border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h2 className="font-serif-literary text-xl font-bold text-stone-100">
            Press &amp; Interview Inquiries
          </h2>
          <p className="text-xs text-stone-400">
            For literary reviews, speaking opportunities, or broadcast interviews, contact our press liaison.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/contact?category=press"
            className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
          >
            <Mail className="w-3.5 h-3.5" /> Media Contact
          </Link>
        </div>
      </div>

      {/* Media Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {mediaItems.map((item) => (
          <div
            key={item.id}
            className="group p-8 rounded-3xl bg-stone-900/40 border border-stone-800 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between shadow-xl"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                  {getMediaIcon(item.mediaType)} {item.mediaType}
                </span>
                <span className="text-stone-400">{item.date}</span>
              </div>

              <div>
                <span className="text-xs font-mono text-stone-400 block mb-1">
                  {item.publication}
                </span>
                <h3 className="font-serif-literary text-2xl font-bold text-stone-100 group-hover:text-amber-200 transition-colors">
                  {item.title}
                </h3>
              </div>

              {item.excerpt && (
                <p className="text-sm text-stone-300 leading-relaxed">
                  {item.excerpt}
                </p>
              )}
            </div>

            {item.url && (
              <div className="pt-6 border-t border-stone-800/80">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1.5 uppercase tracking-wider font-semibold"
                >
                  <span>Read / Listen to Feature</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
