import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { generateSeoMetadata } from "@/lib/seo";
import { Star, ArrowRight, Sparkles } from "lucide-react";

export const revalidate = 60;

export async function generateMetadata() {
  return generateSeoMetadata({
    title: "Books by Anant Yadav | Poetry Collections & Philosophical Works",
    description:
      "Explore the published books and collections by Anant Yadav, including 'Echoes of the Unspoken' and 'The Architecture of Silence'.",
    path: "/books",
  });
}

export default async function BooksPage() {
  const books = await prisma.book.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-900 border border-stone-800 text-amber-400 text-xs font-mono tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5" /> Bibliography
        </div>
        <h1 className="font-serif-literary text-4xl sm:text-6xl font-bold text-stone-100 tracking-tight">
          Published Books
        </h1>
        <p className="text-stone-300 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
          Poetic compilations, philosophical treatises, and meditative reflections exploring the human spirit.
        </p>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {books.map((book) => {
          return (
            <article
              key={book.id}
              className="group p-8 rounded-3xl bg-stone-900/40 border border-stone-800 hover:border-amber-500/40 transition-all duration-300 flex flex-col sm:flex-row gap-8 items-start shadow-xl"
            >
              {/* Cover Image */}
              <div className="relative w-full sm:w-52 aspect-[2/3] shrink-0 rounded-2xl overflow-hidden border border-stone-700/80 shadow-2xl group-hover:scale-[1.02] transition-transform">
                <Image
                  src={book.coverImage || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"}
                  alt={book.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 240px"
                />
              </div>

              {/* Book Details */}
              <div className="flex flex-col justify-between h-full space-y-5 flex-1">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-mono text-amber-400 uppercase tracking-widest">
                    <span>{book.genre}</span>
                    {book.rating > 0 && (
                      <span className="flex items-center gap-1 font-bold text-amber-300">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {book.rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                  <h2 className="font-serif-literary text-2xl sm:text-3xl font-bold text-stone-100 group-hover:text-amber-200 transition-colors">
                    <Link href={`/books/${book.slug}`}>{book.title}</Link>
                  </h2>
                  {book.subtitle && (
                    <p className="text-xs text-stone-400 italic">{book.subtitle}</p>
                  )}
                  <p className="text-sm text-stone-300 line-clamp-4 leading-relaxed mt-2">
                    {book.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-800/80 flex flex-wrap items-center justify-between gap-4">
                  {book.pageCount && (
                    <span className="text-xs text-stone-400 font-mono">
                      {book.pageCount} pages • {book.language}
                    </span>
                  )}
                  <Link
                    href={`/books/${book.slug}`}
                    className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold px-4 py-2 rounded-xl text-xs uppercase tracking-wider transition-colors"
                  >
                    View Book <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
