import type { Metadata } from "next";
import { Newsreader, Plus_Jakarta_Sans, Cinzel } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ToastProvider } from "@/components/ToastContext";
import { getAuthorSchema, SITE_URL } from "@/lib/seo";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  style: ["normal", "italic"],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Anant Yadav | Author, Poet & Thinker",
    template: "%s | Anant Yadav",
  },
  description:
    "The official website of Anant Yadav: Explore published books, contemporary poetry, philosophical essays, thoughts, and literary events.",
  keywords: [
    "Anant Yadav",
    "Author",
    "Poet",
    "Writer",
    "Thinker",
    "Indian literature",
    "Contemporary poetry",
    "Philosophical essays",
    "Books",
    "Echoes of the Unspoken",
    "The Architecture of Silence",
  ],
  authors: [{ name: "Anant Yadav", url: SITE_URL }],
  creator: "Anant Yadav",
  publisher: "Anant Yadav",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: "Anant Yadav | Author, Poet & Thinker",
    description:
      "Official digital home of author and poet Anant Yadav. Explore poetry collections, philosophical essays, books, and thoughts.",
    siteName: "Anant Yadav",
    images: [
      {
        url: `${SITE_URL}/api/og?title=Anant+Yadav&subtitle=Author+•+Poet+•+Writer+•+Thinker`,
        width: 1200,
        height: 630,
        alt: "Anant Yadav - Author, Poet & Thinker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Anant Yadav | Author, Poet & Thinker",
    description: "Official digital home of author and poet Anant Yadav.",
    creator: "@anantyadav",
    images: [`${SITE_URL}/api/og?title=Anant+Yadav&subtitle=Author+•+Poet+•+Writer+•+Thinker`],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authorJsonLd = getAuthorSchema();

  return (
    <html
      lang="en"
      className={`dark ${newsreader.variable} ${plusJakarta.variable} ${cinzel.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(authorJsonLd) }}
        />
      </head>
      <body className="antialiased selection:bg-amber-500/30 selection:text-amber-200">
        <ToastProvider>
          <Navbar />
          <main className="min-h-screen pt-20">{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
