import { prisma } from "@/lib/db";
import { generateSeoMetadata } from "@/lib/seo";
import { QuoteCard } from "@/components/QuoteCard";
import { Sparkles } from "lucide-react";

export const revalidate = 60;

export async function generateMetadata() {
  return generateSeoMetadata({
    title: "Thoughts & Quotes | Philosophical Aphorisms by Anant Yadav",
    description:
      "Curated literary thoughts, philosophical aphorisms, and reflections on stillness, literature, and human consciousness by Anant Yadav.",
    path: "/thoughts",
  });
}

export default async function ThoughtsPage() {
  const thoughts = await prisma.thought.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-900 border border-stone-800 text-amber-400 text-xs font-mono tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5" /> Aphorisms &amp; Epigrams
        </div>
        <h1 className="font-serif-literary text-4xl sm:text-6xl font-bold text-stone-100 tracking-tight">
          Thoughts &amp; Reflections
        </h1>
        <p className="text-stone-300 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
          Short contemplative fragments and literary aphorisms crafted in quiet moments.
        </p>
      </div>

      {/* Thoughts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {thoughts.map((item) => (
          <QuoteCard
            key={item.id}
            quote={item.quote}
            context={item.context}
            source={item.source || "Anant Yadav"}
            category={item.category}
          />
        ))}
      </div>
    </div>
  );
}
