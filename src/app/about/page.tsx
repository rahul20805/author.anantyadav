import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { generateSeoMetadata, getAuthorSchema } from "@/lib/seo";
import { Feather, Mail, MapPin, Sparkles, Award, GraduationCap, Quote } from "lucide-react";

export const revalidate = 60;

export async function generateMetadata() {
  return generateSeoMetadata({
    title: "About Anant Yadav | Author, Poet & Thinker",
    description:
      "Learn about Indian author, poet, and philosopher Anant Yadav: biography, literary philosophy, publications, and artistic statement.",
    path: "/about",
  });
}

export default async function AboutPage() {
  const profile = await prisma.authorProfile.findFirst({ where: { id: "default" } });
  const booksCount = await prisma.book.count({ where: { published: true } });
  const poemsCount = await prisma.poem.count({ where: { published: true } });
  const writingsCount = await prisma.writing.count({ where: { published: true } });

  const authorJsonLd = getAuthorSchema();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(authorJsonLd) }}
      />

      {/* Header / Intro */}
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-900 border border-stone-800 text-amber-400 text-xs font-mono tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5" /> Author Profile
        </div>
        <h1 className="font-serif-literary text-4xl sm:text-6xl font-bold text-stone-100 tracking-tight">
          {profile?.name || "Anant Yadav"}
        </h1>
        <p className="text-amber-300 font-mono text-sm tracking-widest uppercase">
          {profile?.title || "Author • Poet • Writer • Thinker"}
        </p>
      </div>

      {/* Author Showcase: Photo & Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-5 space-y-6">
          <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border border-stone-800 shadow-2xl">
            <Image
              src={profile?.profileImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"}
              alt={profile?.name || "Anant Yadav"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
              priority
            />
          </div>

          {/* Quick Details Box */}
          <div className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-3.5 text-xs text-stone-300 font-sans-ui">
            {profile?.location && (
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Based in {profile.location}</span>
              </div>
            )}
            {profile?.email && (
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{profile.email}</span>
              </div>
            )}
            <div className="flex items-center gap-2.5 pt-2 border-t border-stone-800 text-stone-400 font-mono">
              <span>{booksCount} Books</span> • <span>{poemsCount} Poems</span> • <span>{writingsCount} Essays</span>
            </div>
          </div>
        </div>

        {/* Biography Content */}
        <div className="md:col-span-7 space-y-8">
          {/* Author Statement Box */}
          {profile?.statement && (
            <div className="p-8 rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900/80 to-amber-950/20 border border-amber-500/20 shadow-xl relative overflow-hidden">
              <Quote className="absolute top-4 right-4 w-16 h-16 text-amber-500/10 pointer-events-none" />
              <p className="font-serif-literary text-xl text-stone-100 italic leading-relaxed">
                &ldquo;{profile.statement}&rdquo;
              </p>
            </div>
          )}

          {/* Biography paragraphs */}
          <div className="space-y-6 text-stone-300 text-base sm:text-lg leading-relaxed font-sans-ui">
            <h2 className="font-serif-literary text-2xl sm:text-3xl font-bold text-stone-100">
              Biography &amp; Journey
            </h2>
            <div className="whitespace-pre-line space-y-4">
              {profile?.fullBio || profile?.shortBio}
            </div>
          </div>

          {/* Writing Philosophy */}
          {profile?.philosophy && (
            <div className="p-8 rounded-3xl bg-stone-900/40 border border-stone-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400">
                <Feather className="w-4 h-4" /> Philosophy of Craft
              </div>
              <p className="text-stone-300 leading-relaxed italic font-serif-literary text-lg">
                {profile.philosophy}
              </p>
            </div>
          )}

          {/* Education & Achievements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {profile?.education && (
              <div className="p-5 rounded-2xl bg-stone-900/40 border border-stone-800 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase">
                  <GraduationCap className="w-4 h-4" /> Education
                </div>
                <p className="text-xs text-stone-200">{profile.education}</p>
              </div>
            )}
            {profile?.achievements && (
              <div className="p-5 rounded-2xl bg-stone-900/40 border border-stone-800 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase">
                  <Award className="w-4 h-4" /> Recognition
                </div>
                <p className="text-xs text-stone-200">{profile.achievements}</p>
              </div>
            )}
          </div>

          {/* Actions & Links */}
          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Link
              href="/contact"
              className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-medium px-6 py-3 rounded-xl text-sm transition-all"
            >
              Get in Touch
            </Link>
            <Link
              href="/books"
              className="bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-800 px-6 py-3 rounded-xl text-sm transition-all"
            >
              View Works
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
