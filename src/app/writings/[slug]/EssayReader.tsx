"use client";

import { useEffect, useState } from "react";
import { ShareButtons } from "@/components/ShareButtons";
import { Clock, Calendar, Feather, Download, ExternalLink, FileText, BookOpen } from "lucide-react";
import Link from "next/link";
import { PdfViewer } from "./PdfViewer";

interface EssayReaderProps {
  title: string;
  subtitle?: string | null;
  content?: string | null;
  excerpt?: string | null;
  category: string;
  author: string;
  readingTime: number;
  publishDate?: string | null;
  slug: string;
  pdfUrl?: string | null;
  pdfFilename?: string | null;
  pdfSize?: number | null;
  authorBio?: string;
}

export function EssayReader({
  title,
  subtitle,
  content,
  excerpt,
  category,
  author = "Anant Yadav",
  readingTime,
  publishDate,
  slug,
  pdfUrl,
  pdfFilename,
  pdfSize,
  authorBio,
}: EssayReaderProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<"pdf" | "prose">(pdfUrl ? "pdf" : "prose");

  const hasPdf = Boolean(pdfUrl);
  const hasProse = Boolean(content && content.trim().length > 0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const downloadFilename =
    pdfFilename || `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.pdf`;

  return (
    <div className="space-y-12">
      {/* Sticky Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-stone-900 z-50">
        <div
          className="h-full bg-amber-500 transition-all duration-100 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Header Section */}
      <header className="max-w-4xl mx-auto space-y-6 text-center pb-8 border-b border-stone-800/80">
        {/* Category Pill */}
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3.5 py-1 rounded-full border border-amber-500/20">
          {category}
        </div>

        {/* Essay Title */}
        <h1 className="font-serif-literary text-3xl sm:text-5xl lg:text-6xl font-bold text-stone-100 leading-tight">
          {title}
        </h1>

        {/* Subtitle / Excerpt */}
        {(subtitle || excerpt) && (
          <p className="font-serif-literary text-lg sm:text-xl text-stone-300 italic max-w-2xl mx-auto leading-relaxed">
            {subtitle || excerpt}
          </p>
        )}

        {/* Metadata: Author & Published Date */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-mono text-stone-400 pt-2">
          <span className="text-stone-300 font-semibold">By {author}</span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
            {publishDate || "Recent Essay"}
          </span>
          {hasProse && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                {readingTime} min read
              </span>
            </>
          )}
        </div>

        {/* Direct Action Buttons for PDF if present */}
        {hasPdf && pdfUrl && (
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <a
              href={pdfUrl}
              download={downloadFilename}
              className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold px-6 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg hover:shadow-amber-600/20"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </a>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-stone-900/80 hover:bg-stone-800 text-stone-200 border border-stone-800 hover:border-amber-500/40 font-medium px-5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all"
            >
              <ExternalLink className="w-4 h-4 text-amber-400" />
              Open in New Tab
            </a>
          </div>
        )}

        {/* View Switcher Tab (if both PDF and Prose exist) */}
        {hasPdf && hasProse && (
          <div className="inline-flex items-center bg-stone-900/80 border border-stone-800 p-1 rounded-2xl gap-1 pt-2">
            <button
              onClick={() => setActiveTab("pdf")}
              className={`px-4 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "pdf"
                  ? "bg-amber-600 text-stone-950 font-bold shadow-md"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> PDF Document
            </button>
            <button
              onClick={() => setActiveTab("prose")}
              className={`px-4 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "prose"
                  ? "bg-amber-600 text-stone-950 font-bold shadow-md"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" /> Prose Version
            </button>
          </div>
        )}
      </header>

      {/* Main Reader Container */}
      <main className="max-w-5xl mx-auto">
        {hasPdf && activeTab === "pdf" && pdfUrl ? (
          <PdfViewer
            pdfUrl={pdfUrl}
            pdfFilename={pdfFilename}
            pdfSize={pdfSize}
            title={title}
          />
        ) : hasProse && content ? (
          /* Prose Reader */
          <div className="max-w-3xl mx-auto editorial-prose text-stone-200">
            {content.split("\n\n").map((para, i) => {
              if (para.startsWith("## ")) {
                return (
                  <h2
                    key={i}
                    className="font-serif-literary text-2xl sm:text-3xl font-bold text-stone-100 mt-10 mb-4"
                  >
                    {para.replace("## ", "")}
                  </h2>
                );
              }
              if (para.startsWith("### ")) {
                return (
                  <h3
                    key={i}
                    className="font-serif-literary text-xl sm:text-2xl font-bold text-stone-200 mt-8 mb-3"
                  >
                    {para.replace("### ", "")}
                  </h3>
                );
              }
              if (para.startsWith("> ")) {
                return (
                  <blockquote
                    key={i}
                    className="border-l-2 border-amber-500/60 pl-5 my-6 italic text-stone-100 font-serif-literary text-lg"
                  >
                    {para.replace("> ", "")}
                  </blockquote>
                );
              }
              if (para.startsWith("* ")) {
                const items = para.split("\n* ");
                return (
                  <ul
                    key={i}
                    className="list-disc list-inside space-y-2 my-4 text-stone-300 font-sans-ui text-base"
                  >
                    {items.map((item, j) => (
                      <li key={j}>{item.replace("* ", "")}</li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={i} className="mb-6 leading-relaxed text-base sm:text-lg">
                  {para}
                </p>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 p-8 rounded-3xl bg-stone-900/30 border border-stone-800 text-stone-400 font-mono text-sm">
            <FileText className="w-8 h-8 mx-auto mb-2 text-stone-400" />
            <p>Sorry, this writing content is not currently available.</p>
          </div>
        )}
      </main>

      {/* Share Section */}
      <div className="max-w-4xl mx-auto pt-8 border-t border-stone-800/80 flex items-center justify-between">
        <ShareButtons title={title} url={`/writings/${slug}`} category={category || "Essay"} />
      </div>

      {/* Author Bio Box */}
      <div className="max-w-4xl mx-auto p-8 rounded-3xl bg-stone-900/60 border border-stone-800 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
          <Feather className="w-7 h-7 text-amber-400" />
        </div>
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="font-serif-literary text-xl font-bold text-stone-100">
            Written by {author}
          </h3>
          <p className="text-xs text-stone-400 leading-relaxed max-w-xl">
            {authorBio ||
              "Anant Yadav is an author, poet, and philosopher investigating the intersections of memory, solitude, ethical responsibility, and contemporary literary craft."}
          </p>
          <div className="pt-2">
            <Link
              href="/about"
              className="text-xs font-mono text-amber-400 hover:text-amber-300 inline-flex items-center gap-1"
            >
              Read full author biography &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
