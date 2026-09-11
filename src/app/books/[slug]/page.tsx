import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { generateSeoMetadata, getBookSchema, getBreadcrumbSchema } from "@/lib/seo";
import { ShareButtons } from "@/components/ShareButtons";
import { Star, ExternalLink, MessageSquare, Quote, ArrowLeft } from "lucide-react";
import { BookReviewForm } from "./BookReviewForm";

interface BookPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: BookPageProps) {
  const { slug } = await params;
  const book = await prisma.book.findUnique({
    where: { slug },
  });

  if (!book) return {};

  return generateSeoMetadata({
    title: book.seoTitle || `${book.title} | Book by Anant Yadav`,
    description: book.seoDescription || book.description,
    path: `/books/${book.slug}`,
    image: book.coverImage || undefined,
    type: "book",
  });
}

export default async function BookDetailsPage({ params }: BookPageProps) {
  const { slug } = await params;
  const book = await prisma.book.findUnique({
    where: { slug },
    include: {
      reviews: {
        where: { isApproved: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!book || !book.published) {
    notFound();
  }

  interface PurchaseLink {
    label: string;
    url: string;
    isPrimary?: boolean;
  }

  let purchaseLinks: PurchaseLink[] = [];
  try {
    purchaseLinks = JSON.parse(book.purchaseLinks);
  } catch {
    purchaseLinks = [];
  }

  const bookJsonLd = getBookSchema({
    title: book.title,
    slug: book.slug,
    description: book.description,
    isbn: book.isbn,
    publisher: book.publisher,
    publicationDate: book.publicationDate,
    coverImage: book.coverImage,
    genre: book.genre,
    pageCount: book.pageCount,
    rating: book.rating,
    reviewCount: book.reviewCount,
  });

  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Books", url: "/books" },
    { name: book.title, url: `/books/${book.slug}` },
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Back Navigation */}
      <div>
        <Link
          href="/books"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-400 hover:text-amber-300 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Books
        </Link>
      </div>

      {/* Hero Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Book Cover Column */}
        <div className="md:col-span-5 space-y-6">
          <div className="relative aspect-[2/3] rounded-3xl overflow-hidden border border-stone-700/80 shadow-2xl bg-stone-900">
            <Image
              src={book.coverImage || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"}
              alt={book.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 450px"
              priority
            />
          </div>

          {/* Quick Purchase Links */}
          {purchaseLinks.length > 0 && (
            <div className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-stone-400 block mb-2">
                Acquire / Read
              </span>
              <div className="flex flex-col gap-2.5">
                {purchaseLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-between px-5 py-3 rounded-xl text-sm font-medium transition-all ${
                      link.isPrimary
                        ? "bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold shadow-lg"
                        : "bg-stone-800/80 hover:bg-stone-700 text-stone-200 border border-stone-700"
                    }`}
                  >
                    <span>{link.label}</span>
                    <ExternalLink className="w-4 h-4 opacity-80" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Social Share */}
          <div className="pt-2">
            <ShareButtons title={book.title} url={`/books/${book.slug}`} category="Book" />
          </div>
        </div>

        {/* Details Column */}
        <div className="md:col-span-7 space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                {book.genre}
              </span>
              {book.rating > 0 && (
                <span className="flex items-center gap-1.5 text-xs font-bold text-amber-300 font-mono">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {book.rating.toFixed(1)} / 5.0
                </span>
              )}
            </div>

            <h1 className="font-serif-literary text-3xl sm:text-5xl font-bold text-stone-100 tracking-tight leading-tight">
              {book.title}
            </h1>
            {book.subtitle && (
              <p className="text-stone-400 text-lg italic font-serif-literary">{book.subtitle}</p>
            )}
            <p className="text-sm font-mono text-stone-400">By Anant Yadav</p>
          </div>

          {/* Overview & Synopsis */}
          <div className="space-y-4 text-stone-300 text-base leading-relaxed">
            <h2 className="font-serif-literary text-2xl font-bold text-stone-100">About the Book</h2>
            <p>{book.description}</p>
            {book.longDescription && (
              <div className="whitespace-pre-line space-y-4 pt-2 text-stone-300/90">
                {book.longDescription}
              </div>
            )}
          </div>

          {/* Author Note Box */}
          {book.authorNote && (
            <div className="p-6 rounded-2xl bg-stone-900/60 border border-amber-500/20 space-y-2 relative overflow-hidden">
              <Quote className="absolute top-3 right-3 w-10 h-10 text-amber-500/10 pointer-events-none" />
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400 block">
                Author&apos;s Note
              </span>
              <p className="font-serif-literary italic text-stone-200 text-base leading-relaxed">
                &ldquo;{book.authorNote}&rdquo;
              </p>
            </div>
          )}

          {/* Bibliographic Details Table */}
          <div className="p-6 rounded-2xl bg-stone-900/40 border border-stone-800 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-stone-400 mb-2">
              Bibliographic Information
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-sans-ui">
              {book.publisher && (
                <div>
                  <span className="text-stone-400 block">Publisher</span>
                  <span className="text-stone-200 font-medium">{book.publisher}</span>
                </div>
              )}
              {book.isbn && (
                <div>
                  <span className="text-stone-400 block">ISBN</span>
                  <span className="text-stone-200 font-medium">{book.isbn}</span>
                </div>
              )}
              {book.publicationDate && (
                <div>
                  <span className="text-stone-400 block">Release Date</span>
                  <span className="text-stone-200 font-medium">{book.publicationDate}</span>
                </div>
              )}
              {book.pageCount && (
                <div>
                  <span className="text-stone-400 block">Pages</span>
                  <span className="text-stone-200 font-medium">{book.pageCount} Pages</span>
                </div>
              )}
              <div>
                <span className="text-stone-400 block">Language</span>
                <span className="text-stone-200 font-medium">{book.language}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reader Reviews & Submission Section */}
      <section className="border-t border-stone-800 pt-16 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Reader Responses
            </span>
            <h2 className="font-serif-literary text-3xl font-bold text-stone-100 mt-1">
              Reviews &amp; Reflections
            </h2>
          </div>
        </div>

        {/* Existing Approved Reviews */}
        {book.reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {book.reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-6 rounded-2xl bg-stone-900/40 border border-stone-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-stone-200 text-sm">{rev.readerName}</span>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-stone-300 italic font-serif-literary leading-relaxed">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-stone-400 italic">
            No published reviews yet. Be the first to share your thoughts.
          </p>
        )}

        {/* Review Submission Form */}
        <div className="max-w-2xl bg-stone-900/50 border border-stone-800 p-8 rounded-3xl">
          <h3 className="font-serif-literary text-xl font-bold text-stone-100 mb-2">
            Leave a Reader Review
          </h3>
          <p className="text-xs text-stone-400 mb-6">
            Submitted reviews are moderated to protect against spam before appearing publicly.
          </p>
          <BookReviewForm bookId={book.id} />
        </div>
      </section>
    </div>
  );
}
