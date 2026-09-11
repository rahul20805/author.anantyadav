import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { generateSeoMetadata, getArticleSchema, getBreadcrumbSchema } from "@/lib/seo";
import { EssayReader } from "./EssayReader";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface WritingPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: WritingPageProps) {
  const { slug } = await params;
  const writing = await prisma.writing.findUnique({
    where: { slug },
  });

  if (!writing) return {};

  return generateSeoMetadata({
    title: writing.seoTitle || `${writing.title} | Essay by Anant Yadav`,
    description: writing.seoDescription || writing.excerpt || writing.content.slice(0, 150),
    path: `/writings/${writing.slug}`,
    image: writing.coverImage || undefined,
    type: "article",
  });
}

export default async function WritingDetailsPage({ params }: WritingPageProps) {
  const { slug } = await params;
  const writing = await prisma.writing.findUnique({
    where: { slug },
  });

  if (!writing || !writing.published) {
    notFound();
  }

  const profile = await prisma.authorProfile.findFirst({ where: { id: "default" } });

  const previousWriting = await prisma.writing.findFirst({
    where: { published: true, createdAt: { lt: writing.createdAt } },
    orderBy: { createdAt: "desc" },
    select: { title: true, slug: true },
  });

  const nextWriting = await prisma.writing.findFirst({
    where: { published: true, createdAt: { gt: writing.createdAt } },
    orderBy: { createdAt: "asc" },
    select: { title: true, slug: true },
  });

  const articleJsonLd = getArticleSchema({
    title: writing.title,
    slug: writing.slug,
    excerpt: writing.excerpt,
    content: writing.content,
    coverImage: writing.coverImage,
    publishDate: writing.publishDate,
    createdAt: writing.createdAt,
    updatedAt: writing.updatedAt,
  });

  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Writings", url: "/writings" },
    { name: writing.title, url: `/writings/${writing.slug}` },
  ]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Back Button */}
      <div className="max-w-3xl mx-auto">
        <Link
          href="/writings"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-400 hover:text-amber-300 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Writings
        </Link>
      </div>

      {/* Essay Reader */}
      <EssayReader
        title={writing.title}
        subtitle={writing.subtitle}
        content={writing.content}
        category={writing.category}
        readingTime={writing.readingTime}
        publishDate={writing.publishDate}
        slug={writing.slug}
        authorName={profile?.name || "Anant Yadav"}
        authorBio={profile?.shortBio}
      />

      {/* Next / Previous Essay Navigation */}
      <div className="max-w-3xl mx-auto pt-10 border-t border-stone-800/80 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {previousWriting ? (
          <Link
            href={`/writings/${previousWriting.slug}`}
            className="p-5 rounded-2xl bg-stone-900/40 border border-stone-800 hover:border-amber-500/30 transition-all text-left space-y-1 group"
          >
            <span className="text-[11px] font-mono uppercase tracking-widest text-stone-400 flex items-center gap-1 group-hover:text-amber-400">
              <ArrowLeft className="w-3 h-3" /> Previous Essay
            </span>
            <p className="font-serif-literary text-lg font-bold text-stone-200 group-hover:text-amber-200">
              {previousWriting.title}
            </p>
          </Link>
        ) : (
          <div />
        )}

        {nextWriting && (
          <Link
            href={`/writings/${nextWriting.slug}`}
            className="p-5 rounded-2xl bg-stone-900/40 border border-stone-800 hover:border-amber-500/30 transition-all text-right space-y-1 group ml-auto w-full"
          >
            <span className="text-[11px] font-mono uppercase tracking-widest text-stone-400 flex items-center justify-end gap-1 group-hover:text-amber-400">
              Next Essay <ArrowRight className="w-3 h-3" />
            </span>
            <p className="font-serif-literary text-lg font-bold text-stone-200 group-hover:text-amber-200">
              {nextWriting.title}
            </p>
          </Link>
        )}
      </div>
    </div>
  );
}
