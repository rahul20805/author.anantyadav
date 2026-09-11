"use client";

import { useEffect, useState } from "react";
import { ShareButtons } from "@/components/ShareButtons";
import { Clock, Calendar, Feather } from "lucide-react";
import Link from "next/link";

interface EssayReaderProps {
  title: string;
  subtitle?: string | null;
  content: string;
  category: string;
  readingTime: number;
  publishDate?: string | null;
  slug: string;
  authorName?: string;
  authorBio?: string;
}

export function EssayReader({
  title,
  subtitle,
  content,
  category,
  readingTime,
  publishDate,
  slug,
  authorName = "Anant Yadav",
  authorBio,
}: EssayReaderProps) {
  const [scrollProgress, setScrollProgress] = useState(0);

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

  return (
    <div>
      {/* Sticky Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-stone-900 z-50">
        <div
          className="h-full bg-amber-500 transition-all duration-100 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Essay Content Area */}
      <article className="max-w-3xl mx-auto space-y-10">
        {/* Header */}
        <header className="space-y-4 text-center pb-8 border-b border-stone-800/80">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            {category}
          </div>
          <h1 className="font-serif-literary text-3xl sm:text-5xl font-bold text-stone-100 leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="font-serif-literary text-lg sm:text-xl text-stone-300 italic max-w-xl mx-auto">
              {subtitle}
            </p>
          )}
          <div className="flex items-center justify-center gap-4 text-xs font-mono text-stone-400 pt-3">
            <span>By {authorName}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-500" /> {readingTime} min read
            </span>
            {publishDate && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" /> {publishDate}
                </span>
              </>
            )}
          </div>
        </header>

        {/* Essay Body Prose */}
        <div className="editorial-prose text-stone-200">
          {content.split("\n\n").map((para, i) => {
            if (para.startsWith("## ")) {
              return (
                <h2 key={i} className="font-serif-literary text-2xl sm:text-3xl font-bold text-stone-100 mt-10 mb-4">
                  {para.replace("## ", "")}
                </h2>
              );
            }
            if (para.startsWith("### ")) {
              return (
                <h3 key={i} className="font-serif-literary text-xl sm:text-2xl font-bold text-stone-200 mt-8 mb-3">
                  {para.replace("### ", "")}
                </h3>
              );
            }
            if (para.startsWith("> ")) {
              return (
                <blockquote key={i} className="border-l-2 border-amber-500/60 pl-5 my-6 italic text-stone-100 font-serif-literary text-lg">
                  {para.replace("> ", "")}
                </blockquote>
              );
            }
            if (para.startsWith("* ")) {
              const items = para.split("\n* ");
              return (
                <ul key={i} className="list-disc list-inside space-y-2 my-4 text-stone-300 font-sans-ui text-base">
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

        {/* Share Section */}
        <div className="pt-8 border-t border-stone-800/80 flex items-center justify-between">
          <ShareButtons title={title} url={`/writings/${slug}`} category="Essay" />
        </div>

        {/* Author Bio Box */}
        <div className="p-8 rounded-3xl bg-stone-900/60 border border-stone-800 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Feather className="w-7 h-7 text-amber-400" />
          </div>
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="font-serif-literary text-xl font-bold text-stone-100">
              Written by {authorName}
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed max-w-lg">
              {authorBio || "Anant Yadav is an author, poet, and philosopher investigating the intersections of memory, solitude, and contemporary literary craft."}
            </p>
            <div className="pt-2">
              <Link href="/about" className="text-xs font-mono text-amber-400 hover:text-amber-300">
                Read full author biography &rarr;
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
