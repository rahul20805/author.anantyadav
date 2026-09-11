import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { generateSeoMetadata, getArticleSchema, getBreadcrumbSchema } from "@/lib/seo";
import { PoemReaderView } from "./PoemReaderView";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface PoemPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: PoemPageProps) {
  const { slug } = await params;
  const poem = await prisma.poem.findUnique({
    where: { slug },
  });

  if (!poem) return {};

  return generateSeoMetadata({
    title: poem.seoTitle || `${poem.title} | Poem by Anant Yadav`,
    description: poem.seoDescription || poem.excerpt || poem.content.slice(0, 150),
    path: `/poetry/${poem.slug}`,
    type: "article",
  });
}

export default async function PoemDetailsPage({ params }: PoemPageProps) {
  const { slug } = await params;
  const poem = await prisma.poem.findUnique({
    where: { slug },
  });

  if (!poem || !poem.published) {
    notFound();
  }

  // Fetch adjacent poems for previous/next navigation
  const previousPoem = await prisma.poem.findFirst({
    where: { published: true, createdAt: { lt: poem.createdAt } },
    orderBy: { createdAt: "desc" },
    select: { title: true, slug: true },
  });

  const nextPoem = await prisma.poem.findFirst({
    where: { published: true, createdAt: { gt: poem.createdAt } },
    orderBy: { createdAt: "asc" },
    select: { title: true, slug: true },
  });

  const poemJsonLd = getArticleSchema({
    title: poem.title,
    slug: poem.slug,
    excerpt: poem.excerpt,
    content: poem.content,
    coverImage: poem.coverImage,
    publishDate: poem.publishDate,
    createdAt: poem.createdAt,
    updatedAt: poem.updatedAt,
  });

  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Poetry", url: "/poetry" },
    { name: poem.title, url: `/poetry/${poem.slug}` },
  ]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(poemJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Back Button */}
      <div className="max-w-3xl mx-auto">
        <Link
          href="/poetry"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-400 hover:text-amber-300 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Poetry Archive
        </Link>
      </div>

      {/* Interactive Reader View */}
      <PoemReaderView
        title={poem.title}
        subtitle={poem.subtitle}
        content={poem.content}
        category={poem.category}
        readingTime={poem.readingTime}
        publishDate={poem.publishDate}
        audioUrl={poem.audioUrl}
        slug={poem.slug}
      />

      {/* Next / Previous Navigation */}
      <div className="max-w-3xl mx-auto pt-10 border-t border-stone-800/80 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {previousPoem ? (
          <Link
            href={`/poetry/${previousPoem.slug}`}
            className="p-5 rounded-2xl bg-stone-900/40 border border-stone-800 hover:border-amber-500/30 transition-all text-left space-y-1 group"
          >
            <span className="text-[11px] font-mono uppercase tracking-widest text-stone-400 flex items-center gap-1 group-hover:text-amber-400">
              <ArrowLeft className="w-3 h-3" /> Previous Poem
            </span>
            <p className="font-serif-literary text-lg font-bold text-stone-200 group-hover:text-amber-200">
              {previousPoem.title}
            </p>
          </Link>
        ) : (
          <div />
        )}

        {nextPoem && (
          <Link
            href={`/poetry/${nextPoem.slug}`}
            className="p-5 rounded-2xl bg-stone-900/40 border border-stone-800 hover:border-amber-500/30 transition-all text-right space-y-1 group ml-auto w-full"
          >
            <span className="text-[11px] font-mono uppercase tracking-widest text-stone-400 flex items-center justify-end gap-1 group-hover:text-amber-400">
              Next Poem <ArrowRight className="w-3 h-3" />
            </span>
            <p className="font-serif-literary text-lg font-bold text-stone-200 group-hover:text-amber-200">
              {nextPoem.title}
            </p>
          </Link>
        )}
      </div>
    </div>
  );
}
