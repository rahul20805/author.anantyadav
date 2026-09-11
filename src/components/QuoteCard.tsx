"use client";

import { useState } from "react";
import { Quote, Copy, Check } from "lucide-react";
import { TwitterIcon } from "./BrandIcons";
import { useToast } from "./ToastContext";

interface QuoteCardProps {
  quote: string;
  context?: string | null;
  source?: string | null;
  category?: string | null;
}

export function QuoteCard({ quote, context, source = "Anant Yadav", category }: QuoteCardProps) {
  const [copied, setCopied] = useState(false);
  const { success } = useToast();

  const handleCopy = () => {
    const textToCopy = `"${quote}" — ${source}${context ? ` (${context})` : ""}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    success("Thought copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleTwitterShare = () => {
    const text = `"${quote}" — ${source}`;
    const url = typeof window !== "undefined" ? window.location.href : "";
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank");
  };

  return (
    <div className="relative group p-8 rounded-3xl bg-stone-900/60 border border-stone-800/80 hover:border-amber-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-950/20 flex flex-col justify-between overflow-hidden">
      {/* Background subtle watermark */}
      <Quote className="absolute top-4 right-4 w-20 h-20 text-stone-800/30 -z-0 pointer-events-none group-hover:text-amber-500/10 transition-colors" />

      <div>
        {category && (
          <div className="flex items-center gap-1.5 mb-4">
            <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400/90 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
              {category}
            </span>
          </div>
        )}

        <blockquote className="font-serif-literary text-xl sm:text-2xl text-stone-100 leading-relaxed italic relative z-10">
          &ldquo;{quote}&rdquo;
        </blockquote>
      </div>

      <div className="mt-8 pt-6 border-t border-stone-800/80 flex flex-wrap items-center justify-between gap-4 relative z-10">
        <div>
          <cite className="not-italic font-sans-ui text-sm font-semibold text-amber-300/90 tracking-wide block">
            {source}
          </cite>
          {context && <p className="text-xs text-stone-400 mt-0.5">{context}</p>}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTwitterShare}
            className="p-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-amber-300 transition-colors"
            title="Share on X / Twitter"
            aria-label="Share on X / Twitter"
          >
            <TwitterIcon className="w-4 h-4" />
          </button>
          <button
            onClick={handleCopy}
            className="p-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-amber-300 transition-colors flex items-center gap-1.5 text-xs font-mono"
            title="Copy thought"
            aria-label="Copy thought"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
