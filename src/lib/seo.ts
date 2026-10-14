import { Metadata } from "next";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined) ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ||
  "https://authoranant.in";


export const DEFAULT_SITE_KEYWORDS = [
  "Anant Yadav",
  "Author Anant Yadav",
  "Poet Anant Yadav",
  "Writer Anant Yadav",
  "Thinker Anant Yadav",
  "author",
  "poet",
  "writer",
  "thinker",
  "Indian literature",
  "contemporary poetry",
  "essays",
  "books",
  "philosophy",
  "jaa rahi ho",
  "जा रही हो",
  "chup mat raha karo",
  "चुप मत रहा करो",
  "apni jhalak ye zindagi",
  "अपनी झलक ये ज़िंदगी",
  "The Solitude Dispatch",
  "Hindi poetry",
  "contemporary Indian literature",
  "philosophical essays",
  "Hindi literature",
  "Anant Yadav books",
  "Anant Yadav poems",
  "Shivija Publications",
  "Kathaankan Publications",
];

export function generateSeoMetadata({
  title,
  description,
  path = "",
  image,
  type = "website",
  publishedTime,
  authors = ["Anant Yadav"],
  keywords = DEFAULT_SITE_KEYWORDS,
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
    verification: {
      google: process.env.NEXT_PUBLIC_GSC_TOKEN || "google-site-verification=authoranant-search-console",
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

export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Anant Yadav | Author, Poet & Thinker Official Site",
    alternateName: ["Anant Yadav Official", "Author Anant Yadav", "अनंत यादव"],
    url: SITE_URL,
    description:
      "Official website of Anant Yadav: Celebrated Indian author, poet, and contemplative thinker. Explore published books including 'Jaa Rahi Ho' and 'Chup Mat Raha Karo', contemporary poetry, philosophical essays, and literary thoughts.",
    author: {
      "@type": "Person",
      name: "Anant Yadav",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function getAuthorSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Anant Yadav",
    alternateName: ["अनंत यादव", "Author Anant Yadav", "Anant Yadav Poet", "Anant Yadav Writer"],
    jobTitle: ["Author", "Poet", "Writer", "Thinker", "Philosophical Essayist"],
    url: SITE_URL,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    sameAs: [
      "https://twitter.com/",
      "https://instagram.com/",
      "https://linkedin.com/in/",
      "https://goodreads.com/",
      "https://substack.com/@authoranant/",
    ],
    description:
      "Anant Yadav is a celebrated Indian author, poet, and contemplative thinker whose works explore human solitude, love, memory, and existential philosophy. His published works include 'Jaa Rahi Ho' (जा रही हो?), 'Chup Mat Raha Karo' (चुप मत रहा करो), and 'Apni Jhalak Ye Zindagi' (अपनी झलक ये ज़िंदगी).",
    knowsAbout: [
      "Poetry",
      "Philosophy",
      "Indian Literature",
      "Creative Writing",
      "Contemplative Philosophy",
      "Contemporary Hindi Poetry",
      "Essays",
      "Jaa Rahi Ho",
      "Chup Mat Raha Karo",
      "The Solitude Dispatch",
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
