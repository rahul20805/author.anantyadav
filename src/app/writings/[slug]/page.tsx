import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { generateSeoMetadata, getArticleSchema, getBreadcrumbSchema } from "@/lib/seo";
import { EssayReader } from "./EssayReader";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface WritingPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: WritingPageProps) {
  const { slug } = await params;
  const writing = await prisma.writing.findUnique({
    where: { slug },
  });

  if (!writing) return {};

  return generateSeoMetadata({
    title: writing.seoTitle || `${writing.title} | ${writing.category} by ${writing.author || "Anant Yadav"}`,
    description:
      writing.seoDescription ||
      writing.excerpt ||
      (writing.content ? writing.content.slice(0, 160) : writing.title),
    path: `/writings/${writing.slug}`,
    image: writing.coverImage || undefined,
    type: "article",
    publishedTime: writing.publishDate || writing.createdAt.toISOString(),
    authors: [writing.author || "Anant Yadav"],
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
    select: { title: true, slug: true, category: true },
  });

  const nextWriting = await prisma.writing.findFirst({
    where: { published: true, createdAt: { gt: writing.createdAt } },
    orderBy: { createdAt: "asc" },
    select: { title: true, slug: true, category: true },
  });

  const articleJsonLd = getArticleSchema({
    title: writing.title,
    slug: writing.slug,
    excerpt: writing.excerpt || writing.subtitle,
    content: writing.content || writing.excerpt || writing.title,
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Back Button */}
      <div className="max-w-5xl mx-auto">
        <Link
          href="/writings"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-400 hover:text-amber-300 transition-colors py-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Writings
        </Link>
      </div>

      {/* Main Essay & PDF Reader */}
      <EssayReader
        title={writing.title}
        subtitle={writing.subtitle}
        content={writing.content}
        excerpt={writing.excerpt}
        category={writing.category}
        author={writing.author || profile?.name || "Anant Yadav"}
        readingTime={writing.readingTime}
        publishDate={writing.publishDate}
        slug={writing.slug}
        pdfUrl={writing.pdfUrl}
        pdfFilename={writing.pdfFilename}
        pdfSize={writing.pdfSize}
        authorBio={profile?.shortBio}
      />

      {/* Next / Previous Essay Navigation */}
      <div className="max-w-5xl mx-auto pt-10 border-t border-stone-800/80 grid grid-cols-1 sm:grid-cols-2 gap-6 font-sans-ui">
        {previousWriting ? (
          <Link
            href={`/writings/${previousWriting.slug}`}
            className="p-5 rounded-2xl bg-stone-900/40 border border-stone-800 hover:border-amber-500/30 transition-all text-left space-y-1 group shadow-md"
          >
            <span className="text-[11px] font-mono uppercase tracking-widest text-stone-400 flex items-center gap-1 group-hover:text-amber-400">
              <ArrowLeft className="w-3 h-3" /> Previous {previousWriting.category || "Essay"}
            </span>
            <p className="font-serif-literary text-base sm:text-lg font-bold text-stone-200 group-hover:text-amber-200 line-clamp-1">
              {previousWriting.title}
            </p>
          </Link>
        ) : (
          <div />
        )}

        {nextWriting && (
          <Link
            href={`/writings/${nextWriting.slug}`}
            className="p-5 rounded-2xl bg-stone-900/40 border border-stone-800 hover:border-amber-500/30 transition-all text-right space-y-1 group ml-auto w-full shadow-md"
          >
            <span className="text-[11px] font-mono uppercase tracking-widest text-stone-400 flex items-center justify-end gap-1 group-hover:text-amber-400">
              Next {nextWriting.category || "Essay"} <ArrowRight className="w-3 h-3" />
            </span>
            <p className="font-serif-literary text-base sm:text-lg font-bold text-stone-200 group-hover:text-amber-200 line-clamp-1">
              {nextWriting.title}
            </p>
          </Link>
        )}
      </div>
    </div>
  );
}
