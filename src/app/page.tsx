import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { QuoteCard } from "@/components/QuoteCard";
import { Feather, BookOpen, ArrowRight, Sparkles, Clock, Compass, Calendar, ChevronRight, Star } from "lucide-react";

export const revalidate = 60; // ISR 60s

export default async function HomePage() {
  const profile = await prisma.authorProfile.findFirst({ where: { id: "default" } });
  const featuredBooks = await prisma.book.findMany({
    where: { published: true, featured: true },
    take: 2,
    orderBy: { createdAt: "desc" },
  });
  const latestPoems = await prisma.poem.findMany({
    where: { published: true },
    take: 3,
    orderBy: { createdAt: "desc" },
  });
  const latestWritings = await prisma.writing.findMany({
    where: { published: true },
    take: 2,
    orderBy: { createdAt: "desc" },
  });
  const featuredThought = await prisma.thought.findFirst({
    where: { published: true, featured: true },
    orderBy: { createdAt: "desc" },
  });
  const upcomingEvents = await prisma.eventItem.findMany({
    where: { published: true, isPast: false },
    take: 2,
    orderBy: { date: "asc" },
  });

  return (
    <div className="space-y-28 sm:space-y-36 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[88vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 overflow-hidden">
        {/* Ambient atmospheric glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-amber-700/5 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Subtle Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-900/90 border border-stone-800 text-stone-300 text-xs font-mono tracking-widest uppercase animate-in fade-in slide-in-from-bottom-3 duration-700">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Official Literary Home
          </div>

          {/* Author Name Heading */}
          <div className="space-y-4">
            <h1 className="font-serif-literary text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-stone-100 leading-[1.08]">
              {profile?.name || "Anant Yadav"}
            </h1>
            <p className="text-amber-300/90 font-mono text-sm sm:text-base tracking-[0.25em] uppercase font-medium">
              {profile?.title || "Author • Poet • Writer • Thinker"}
            </p>
          </div>

          {/* Author Statement / Hook */}
          <p className="text-lg sm:text-2xl text-stone-300 font-serif-literary italic max-w-2xl mx-auto leading-relaxed text-balance">
            &ldquo;{profile?.statement || "To write is not merely to capture what exists, but to listen attentively to what silence has left unsaid."}&rdquo;
          </p>

          {/* Call-to-action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/books"
              className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-medium px-7 py-3.5 rounded-xl text-sm flex items-center gap-2.5 transition-all shadow-xl hover:shadow-amber-600/20 font-sans-ui"
            >
              <BookOpen className="w-4 h-4" />
              Explore Books
            </Link>
            <Link
              href="/poetry"
              className="bg-stone-900/80 hover:bg-stone-800 text-stone-200 border border-stone-800 hover:border-amber-500/40 font-medium px-7 py-3.5 rounded-xl text-sm flex items-center gap-2.5 transition-all font-sans-ui"
            >
              <Feather className="w-4 h-4 text-amber-400" />
              Read Poetry
            </Link>
            <Link
              href="/about"
              className="text-stone-400 hover:text-stone-100 text-sm flex items-center gap-1.5 px-4 py-3.5 transition-colors"
            >
              Author Journey <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. AUTHOR INTRO BRIEF & PHILOSOPHY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-stone-900/40 border border-stone-800/80 rounded-3xl p-8 sm:p-12 backdrop-blur-sm">
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-stone-800 shadow-2xl">
              <Image
                src={profile?.profileImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"}
                alt={profile?.name || "Anant Yadav"}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
                priority
              />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-stone-950 border border-amber-500/30 px-5 py-3 rounded-2xl shadow-xl">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" /> Est. Solitude
              </span>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400">
              <span className="w-6 h-px bg-amber-500/60" /> About the Author
            </div>
            <h2 className="font-serif-literary text-3xl sm:text-4xl font-bold text-stone-100 leading-snug">
              Investigating the intersections of memory, language, and quietude.
            </h2>
            <p className="text-stone-300 leading-relaxed text-base sm:text-lg">
              {profile?.shortBio || "Anant Yadav is an author, poet, and contemplative essayist whose writings investigate the architecture of human solitude and the weight of forgotten memories."}
            </p>
            <p className="text-stone-400 leading-relaxed text-sm">
              {profile?.philosophy}
            </p>
            <div className="pt-4 flex items-center gap-6">
              <Link
                href="/about"
                className="text-amber-300 hover:text-amber-200 font-medium text-sm flex items-center gap-2 group"
              >
                Read Full Biography <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="text-stone-400 hover:text-stone-200 text-sm"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED BOOKS SHOWCASE */}
      {featuredBooks.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-800 pb-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400 flex items-center gap-2">
                <span className="w-6 h-px bg-amber-500/60" /> Publications
              </span>
              <h2 className="font-serif-literary text-3xl sm:text-4xl font-bold text-stone-100 mt-2">
                Featured Books
              </h2>
            </div>
            <Link
              href="/books"
              className="text-sm font-medium text-stone-300 hover:text-amber-300 flex items-center gap-1.5 transition-colors"
            >
              View All Books <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredBooks.map((book) => (
              <div
                key={book.id}
                className="group p-8 rounded-3xl bg-stone-900/50 border border-stone-800 hover:border-amber-500/30 transition-all duration-300 flex flex-col sm:flex-row gap-6 items-start shadow-xl"
              >
                <div className="relative w-full sm:w-44 aspect-[2/3] shrink-0 rounded-xl overflow-hidden border border-stone-700/60 shadow-lg group-hover:scale-[1.02] transition-transform">
                  <Image
                    src={book.coverImage || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"}
                    alt={book.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 200px"
                  />
                </div>
                <div className="flex flex-col justify-between h-full space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest">
                      <span>{book.genre}</span>
                      {book.rating > 0 && (
                        <span className="flex items-center gap-1 text-amber-300 font-bold ml-auto">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {book.rating.toFixed(1)}
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif-literary text-2xl font-bold text-stone-100 group-hover:text-amber-200 transition-colors mt-1">
                      <Link href={`/books/${book.slug}`}>{book.title}</Link>
                    </h3>
                    {book.subtitle && (
                      <p className="text-xs text-stone-400 italic mt-1">{book.subtitle}</p>
                    )}
                    <p className="text-sm text-stone-300 line-clamp-3 mt-3 leading-relaxed">
                      {book.description}
                    </p>
                  </div>
                  <div className="pt-2">
                    <Link
                      href={`/books/${book.slug}`}
                      className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 hover:text-amber-300 font-semibold"
                    >
                      Book Details &amp; Ordering <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. LATEST POETRY ARCHIVE SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-800 pb-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 flex items-center gap-2">
              <span className="w-6 h-px bg-amber-500/60" /> Stanzas &amp; Verse
            </span>
            <h2 className="font-serif-literary text-3xl sm:text-4xl font-bold text-stone-100 mt-2">
              Selected Poetry
            </h2>
          </div>
          <Link
            href="/poetry"
            className="text-sm font-medium text-stone-300 hover:text-amber-300 flex items-center gap-1.5 transition-colors"
          >
            Explore All Poems <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestPoems.map((poem) => (
            <Link
              key={poem.id}
              href={`/poetry/${poem.slug}`}
              className="group p-8 rounded-3xl bg-stone-900/40 border border-stone-800 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between hover:shadow-xl relative overflow-hidden"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-stone-400 font-mono">
                  <span className="text-amber-400 uppercase tracking-widest">{poem.category}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {poem.readingTime} min read
                  </span>
                </div>
                <h3 className="font-serif-literary text-2xl font-bold text-stone-100 group-hover:text-amber-200 transition-colors">
                  {poem.title}
                </h3>
                {poem.subtitle && (
                  <p className="text-xs text-stone-400 italic">{poem.subtitle}</p>
                )}
                <div className="font-serif-literary text-sm text-stone-300/90 italic leading-relaxed line-clamp-5 border-l border-amber-500/30 pl-3.5 my-4">
                  {poem.content}
                </div>
              </div>
              <div className="pt-4 border-t border-stone-800/80 flex items-center justify-between text-xs font-mono text-amber-400 group-hover:text-amber-300">
                <span>Read Poem</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. THOUGHT OF THE DAY / APHORISM */}
      {featuredThought && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-8">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 flex items-center justify-center gap-2">
              <Sparkles className="w-3.5 h-3.5" /> Daily Reflection
            </span>
            <h2 className="font-serif-literary text-2xl sm:text-3xl font-bold text-stone-100">
              Thought of the Day
            </h2>
          </div>
          <QuoteCard
            quote={featuredThought.quote}
            context={featuredThought.context}
            source={featuredThought.source || "Anant Yadav"}
            category={featuredThought.category}
          />
        </section>
      )}

      {/* 6. LATEST ESSAYS & REFLECTIONS */}
      {latestWritings.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-800 pb-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400 flex items-center gap-2">
                <span className="w-6 h-px bg-amber-500/60" /> Long-form Prose
              </span>
              <h2 className="font-serif-literary text-3xl sm:text-4xl font-bold text-stone-100 mt-2">
                Essays &amp; Reflections
              </h2>
            </div>
            <Link
              href="/writings"
              className="text-sm font-medium text-stone-300 hover:text-amber-300 flex items-center gap-1.5 transition-colors"
            >
              Browse All Writings <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {latestWritings.map((writing) => (
              <article
                key={writing.id}
                className="group p-8 rounded-3xl bg-stone-900/50 border border-stone-800 hover:border-amber-500/30 transition-all duration-300 flex flex-col justify-between shadow-xl"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-stone-400 font-mono">
                    <span className="text-amber-400 uppercase tracking-widest">{writing.category}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {writing.readingTime} min read
                    </span>
                  </div>
                  <h3 className="font-serif-literary text-2xl sm:text-3xl font-bold text-stone-100 group-hover:text-amber-200 transition-colors">
                    <Link href={`/writings/${writing.slug}`}>{writing.title}</Link>
                  </h3>
                  {writing.subtitle && (
                    <p className="text-xs text-stone-400 italic">{writing.subtitle}</p>
                  )}
                  <p className="text-sm text-stone-300 line-clamp-3 leading-relaxed">
                    {writing.excerpt || writing.content.slice(0, 160)}
                  </p>
                </div>
                <div className="pt-6 border-t border-stone-800/80 flex items-center justify-between">
                  <span className="text-xs text-stone-400 font-mono">{writing.publishDate || "Recent Essay"}</span>
                  <Link
                    href={`/writings/${writing.slug}`}
                    className="text-xs font-mono uppercase tracking-wider text-amber-400 hover:text-amber-300 flex items-center gap-1.5 font-semibold"
                  >
                    Read Essay <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* 7. UPCOMING EVENTS BRIEF */}
      {upcomingEvents.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex items-center justify-between border-b border-stone-800 pb-4">
            <h2 className="font-serif-literary text-2xl font-bold text-stone-100 flex items-center gap-2.5">
              <Calendar className="w-5 h-5 text-amber-400" /> Upcoming Literary Events
            </h2>
            <Link href="/events" className="text-xs font-mono uppercase text-amber-400 hover:text-amber-300">
              All Events &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {upcomingEvents.map((evt) => (
              <div
                key={evt.id}
                className="p-6 rounded-2xl bg-stone-900/40 border border-stone-800 flex flex-col justify-between gap-4"
              >
                <div>
                  <span className="text-xs font-mono text-amber-400">{evt.date} • {evt.city}</span>
                  <h3 className="font-serif-literary text-xl font-bold text-stone-100 mt-1">{evt.title}</h3>
                  <p className="text-xs text-stone-300 mt-2 line-clamp-2">{evt.description}</p>
                </div>
                {evt.rsvpUrl && (
                  <a
                    href={evt.rsvpUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1"
                  >
                    RSVP / Register &rarr;
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
