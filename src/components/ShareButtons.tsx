"use client";

import { Share2, MessageCircle, Copy, Check } from "lucide-react";
import { TwitterIcon, LinkedInIcon } from "./BrandIcons";
import { useState } from "react";
import { useToast } from "./ToastContext";

interface ShareButtonsProps {
  title: string;
  url?: string;
  category?: string;
}

export function ShareButtons({ title, url, category = "work" }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const { success } = useToast();

  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return url ? (url.startsWith("http") ? url : `${window.location.origin}${url}`) : window.location.href;
    }
    return url || "";
  };

  const handleCopy = () => {
    const fullUrl = getShareUrl();
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  const shareToTwitter = () => {
    const fullUrl = getShareUrl();
    const text = `Read "${title}" by Anant Yadav:`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(fullUrl)}`, "_blank");
  };

  const shareToLinkedIn = () => {
    const fullUrl = getShareUrl();
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`, "_blank");
  };

  const shareToWhatsApp = () => {
    const fullUrl = getShareUrl();
    const text = `Read "${title}" by Anant Yadav: ${fullUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-stone-400 flex items-center gap-1.5 uppercase tracking-wider font-mono mr-1">
        <Share2 className="w-3.5 h-3.5 text-amber-500/80" /> Share {category}:
      </span>
      <button
        onClick={shareToTwitter}
        className="p-2 rounded-lg bg-stone-900/80 border border-stone-800 hover:border-amber-500/40 text-stone-300 hover:text-amber-300 transition-colors"
        title="Share on X / Twitter"
        aria-label="Share on X / Twitter"
      >
        <TwitterIcon className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={shareToLinkedIn}
        className="p-2 rounded-lg bg-stone-900/80 border border-stone-800 hover:border-amber-500/40 text-stone-300 hover:text-amber-300 transition-colors"
        title="Share on LinkedIn"
        aria-label="Share on LinkedIn"
      >
        <LinkedInIcon className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={shareToWhatsApp}
        className="p-2 rounded-lg bg-stone-900/80 border border-stone-800 hover:border-amber-500/40 text-stone-300 hover:text-emerald-400 transition-colors"
        title="Share on WhatsApp"
        aria-label="Share on WhatsApp"
      >
        <MessageCircle className="w-4 h-4" />
      </button>
      <button
        onClick={handleCopy}
        className="p-2 rounded-lg bg-stone-900/80 border border-stone-800 hover:border-amber-500/40 text-stone-300 hover:text-amber-300 transition-colors"
        title="Copy Link"
        aria-label="Copy Link"
      >
        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
}
