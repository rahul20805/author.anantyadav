import Link from "next/link";
import { prisma } from "@/lib/db";
import { generateSeoMetadata } from "@/lib/seo";
import { Clock, ArrowRight, Sparkles, Tag } from "lucide-react";

export const revalidate = 60;

export async function generateMetadata() {
  return generateSeoMetadata({
    title: "Poetry Archive | Verses by Anant Yadav",
    description:
      "A curated archive of contemporary, contemplative, and philosophical poems by Anant Yadav. Explore themes of solitude, silence, and memory.",
    path: "/poetry",
  });
}

export default async function PoetryPage() {
  const poems = await prisma.poem.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  const categories = Array.from(new Set(poems.map((p) => p.category)));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-900 border border-stone-800 text-amber-400 text-xs font-mono tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5" /> Poetics &amp; Stanzas
        </div>
        <h1 className="font-serif-literary text-4xl sm:text-6xl font-bold text-stone-100 tracking-tight">
          Poetry Archive
        </h1>
        <p className="text-stone-300 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
          Verses written in the quiet hours, exploring the geography of silence, time, and human vulnerability.
        </p>
      </div>

      {/* Category Pills */}
      {categories.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
          <span className="text-xs font-mono text-stone-400 mr-2 flex items-center gap-1">
            <Tag className="w-3 h-3 text-amber-400" /> Themes:
          </span>
          {categories.map((cat) => (
            <span
              key={cat}
              className="text-xs font-mono px-3 py-1 rounded-full bg-stone-900 border border-stone-800 text-stone-300 hover:border-amber-500/40 cursor-default"
            >
              {cat}
            </span>
          ))}
        </div>
      )}

      {/* Poetry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {poems.map((poem) => (
          <article
            key={poem.id}
            className="group p-8 rounded-3xl bg-stone-900/40 border border-stone-800 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between hover:shadow-2xl relative overflow-hidden"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-stone-400 font-mono">
                <span className="text-amber-400 uppercase tracking-widest">{poem.category}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {poem.readingTime} min
                </span>
              </div>

              <h2 className="font-serif-literary text-2xl font-bold text-stone-100 group-hover:text-amber-200 transition-colors">
                <Link href={`/poetry/${poem.slug}`}>{poem.title}</Link>
              </h2>
              {poem.subtitle && (
                <p className="text-xs text-stone-400 italic">{poem.subtitle}</p>
              )}

              {/* Stanza Excerpt */}
              <div className="font-serif-literary text-sm text-stone-300/90 italic leading-relaxed line-clamp-6 border-l-2 border-amber-500/40 pl-4 my-4">
                {poem.content}
              </div>
            </div>

            <div className="pt-4 border-t border-stone-800/80 flex items-center justify-between text-xs font-mono text-amber-400 group-hover:text-amber-300">
              <span>Read Full Poem</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
