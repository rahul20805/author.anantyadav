import Link from "next/link";
import { prisma } from "@/lib/db";
import { generateSeoMetadata } from "@/lib/seo";
import { Clock, ArrowRight, Sparkles, Tag, Calendar } from "lucide-react";

export const revalidate = 60;

export async function generateMetadata() {
  return generateSeoMetadata({
    title: "Writings & Essays | Anant Yadav",
    description:
      "Essays, philosophical reflections, and literary commentary by author Anant Yadav exploring solitude, consciousness, art, and language.",
    path: "/writings",
  });
}

export default async function WritingsPage() {
  const writings = await prisma.writing.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  const categories = Array.from(new Set(writings.map((w) => w.category)));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-900 border border-stone-800 text-amber-400 text-xs font-mono tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5" /> Prose &amp; Inquiry
        </div>
        <h1 className="font-serif-literary text-4xl sm:text-6xl font-bold text-stone-100 tracking-tight">
          Writings &amp; Essays
        </h1>
        <p className="text-stone-300 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
          Meditations on philosophy, the ethical weight of words, and navigating modern consciousness.
        </p>
      </div>

      {/* Category Filter Pills */}
      {categories.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
          <span className="text-xs font-mono text-stone-400 mr-2 flex items-center gap-1">
            <Tag className="w-3 h-3 text-amber-400" /> Categories:
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

      {/* Writings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {writings.map((writing) => (
          <article
            key={writing.id}
            className="group p-8 sm:p-10 rounded-3xl bg-stone-900/40 border border-stone-800 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between hover:shadow-2xl shadow-xl"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-stone-400 font-mono">
                <span className="text-amber-400 uppercase tracking-widest">{writing.category}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {writing.readingTime} min read
                </span>
              </div>

              <h2 className="font-serif-literary text-2xl sm:text-3xl font-bold text-stone-100 group-hover:text-amber-200 transition-colors">
                <Link href={`/writings/${writing.slug}`}>{writing.title}</Link>
              </h2>
              {writing.subtitle && (
                <p className="text-xs text-stone-400 italic">{writing.subtitle}</p>
              )}

              <p className="text-sm text-stone-300 leading-relaxed line-clamp-4">
                {writing.excerpt || writing.content.slice(0, 180)}
              </p>
            </div>

            <div className="pt-6 border-t border-stone-800/80 flex items-center justify-between text-xs font-mono">
              <span className="text-stone-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> {writing.publishDate || "Recent"}
              </span>
              <Link
                href={`/writings/${writing.slug}`}
                className="text-amber-400 group-hover:text-amber-300 flex items-center gap-1.5 uppercase tracking-wider font-semibold"
              >
                <span>Read Essay</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
