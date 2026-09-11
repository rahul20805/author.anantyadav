import { Metadata } from "next";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://anantyadav.vercel.app";

export function generateSeoMetadata({
  title,
  description,
  path = "",
  image,
  type = "website",
  publishedTime,
  authors = ["Anant Yadav"],
  keywords = ["Anant Yadav", "Author", "Poet", "Writer", "Thinker", "Indian Literature", "Poetry", "Philosophy", "Essays"],
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article" | "book" | "profile";
  publishedTime?: string;
  authors?: string[];
  keywords?: string[];
}): Metadata {
  const canonicalUrl = `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const ogImage = image || `${SITE_URL}/api/og?title=${encodeURIComponent(title)}`;

  return {
    title: {
      default: title,
      template: "%s | Anant Yadav",
    },
    description,
    keywords,
    authors: authors.map((name) => ({ name })),
    creator: "Anant Yadav",
    publisher: "Anant Yadav",
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Anant Yadav - Author, Poet, Thinker",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_US",
      type: type as "website" | "article",
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
      creator: "@anantyadav",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export function getAuthorSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Anant Yadav",
    jobTitle: ["Author", "Poet", "Writer", "Philosophical Essayist"],
    url: SITE_URL,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    sameAs: [
      "https://twitter.com/",
      "https://instagram.com/",
      "https://linkedin.com/in/",
      "https://goodreads.com/",
      "https://substack.com/",
    ],
    description:
      "Anant Yadav is an Indian author, poet, and contemplative essayist exploring human solitude, consciousness, and modern literary expression.",
    knowsAbout: [
      "Poetry",
      "Philosophy",
      "Literature",
      "Creative Writing",
      "Contemplative Philosophy",
      "Indian Literature",
    ],
  };
}

export function getBookSchema(book: {
  title: string;
  slug: string;
  description: string;
  isbn?: string | null;
  publisher?: string | null;
  publicationDate?: string | null;
  coverImage?: string | null;
  genre?: string | null;
  pageCount?: number | null;
  rating?: number | null;
  reviewCount?: number | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    url: `${SITE_URL}/books/${book.slug}`,
    description: book.description,
    author: {
      "@type": "Person",
      name: "Anant Yadav",
    },
    ...(book.isbn ? { isbn: book.isbn } : {}),
    ...(book.publisher ? { publisher: { "@type": "Organization", name: book.publisher } } : {}),
    ...(book.publicationDate ? { datePublished: book.publicationDate } : {}),
    ...(book.coverImage ? { image: book.coverImage } : {}),
    ...(book.genre ? { genre: book.genre } : {}),
    ...(book.pageCount ? { numberOfPages: book.pageCount } : {}),
    ...(book.rating && book.reviewCount
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: book.rating,
            reviewCount: book.reviewCount,
          },
        }
      : {}),
  };
}

export function getArticleSchema(article: {
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  coverImage?: string | null;
  publishDate?: string | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    url: `${SITE_URL}/writings/${article.slug}`,
    description: article.excerpt || article.title,
    author: {
      "@type": "Person",
      name: "Anant Yadav",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Person",
      name: "Anant Yadav",
    },
    datePublished: article.publishDate || article.createdAt.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    ...(article.coverImage ? { image: [article.coverImage] } : {}),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/writings/${article.slug}`,
    },
  };
}

export function getEventSchema(event: {
  title: string;
  description: string;
  date: string;
  venue: string;
  city: string;
  isOnline: boolean;
  rsvpUrl?: string | null;
  coverImage?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    startDate: event.date,
    eventAttendanceMode: event.isOnline
      ? "https://schema.org/OnlineEventAttendanceMode"
      : "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: event.isOnline
      ? {
          "@type": "VirtualLocation",
          url: event.rsvpUrl || SITE_URL,
        }
      : {
          "@type": "Place",
          name: event.venue,
          address: {
            "@type": "PostalAddress",
            addressLocality: event.city,
          },
        },
    performer: {
      "@type": "Person",
      name: "Anant Yadav",
    },
    ...(event.coverImage ? { image: [event.coverImage] } : {}),
  };
}

export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url.startsWith("/") ? item.url : `/${item.url}`}`,
    })),
  };
}
