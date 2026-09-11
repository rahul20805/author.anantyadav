"use client";

import { useState } from "react";
import { ReadingControls } from "@/components/ReadingControls";
import { ShareButtons } from "@/components/ShareButtons";
import { Feather, Clock, Calendar, Volume2 } from "lucide-react";

interface PoemReaderViewProps {
  title: string;
  subtitle?: string | null;
  content: string;
  category: string;
  readingTime: number;
  publishDate?: string | null;
  audioUrl?: string | null;
  slug: string;
}

export function PoemReaderView({
  title,
  subtitle,
  content,
  category,
  readingTime,
  publishDate,
  audioUrl,
  slug,
}: PoemReaderViewProps) {
  const [theme, setTheme] = useState<"dark" | "sepia" | "light">("dark");
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg" | "xl">("base");

  const fontSizeClasses = {
    sm: "text-base sm:text-lg leading-loose",
    base: "text-lg sm:text-xl leading-[2.1]",
    lg: "text-xl sm:text-2xl leading-[2.3]",
    xl: "text-2xl sm:text-3xl leading-[2.5]",
  };

  const themeClasses = {
    dark: "bg-stone-900/40 text-stone-100 border-stone-800",
    sepia: "bg-[#f4efe4] text-[#2c2419] border-[#dfd6c5] shadow-2xl",
    light: "bg-white text-stone-900 border-stone-200 shadow-2xl",
  };

  return (
    <div className="space-y-8">
      {/* Interactive Controls */}
      <ReadingControls
        onThemeChange={(t) => setTheme(t)}
        onFontSizeChange={(s) => setFontSize(s)}
      />

      {/* Reader Container */}
      <div
        className={`p-8 sm:p-14 md:p-20 rounded-3xl border transition-all duration-300 max-w-3xl mx-auto ${themeClasses[theme]}`}
      >
        {/* Header inside canvas */}
        <div className="text-center space-y-3 pb-10 border-b border-current/15 mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase opacity-75">
            <Feather className="w-3.5 h-3.5 text-amber-500" />
            {category}
          </div>
          <h1 className="font-serif-literary text-3xl sm:text-5xl font-bold tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm sm:text-base italic font-serif-literary opacity-80">
              {subtitle}
            </p>
          )}
          <div className="flex items-center justify-center gap-4 text-xs font-mono opacity-65 pt-2">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {readingTime} min read
            </span>
            {publishDate && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {publishDate}
              </span>
            )}
          </div>
        </div>

        {/* Audio Player if available */}
        {audioUrl && (
          <div className="mb-10 p-4 rounded-2xl bg-current/5 border border-current/10 flex items-center gap-4">
            <Volume2 className="w-5 h-5 text-amber-500" />
            <div className="flex-1">
              <span className="text-xs font-mono block mb-1">Poet&apos;s Voice Recitation</span>
              <audio controls className="w-full h-8" src={audioUrl}>
                Your browser does not support audio.
              </audio>
            </div>
          </div>
        )}

        {/* Poem Stanzas Body */}
        <div className={`poetry-stanza text-center whitespace-pre-line ${fontSizeClasses[fontSize]}`}>
          {content}
        </div>

        {/* Poet Signature */}
        <div className="mt-16 pt-8 border-t border-current/15 text-center space-y-1">
          <p className="font-serif-literary italic text-base sm:text-lg opacity-85">— Anant Yadav</p>
        </div>
      </div>

      {/* Share Section */}
      <div className="max-w-3xl mx-auto flex items-center justify-center pt-4">
        <ShareButtons title={title} url={`/poetry/${slug}`} category="Poem" />
      </div>
    </div>
  );
}
