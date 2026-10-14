"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ExternalLink, ShoppingBag, BookOpen, Sparkles, ChevronRight } from "lucide-react";

const BOOK_IMAGES = [
  { url: "/images/books/jaa-rahi-ho/front-cover.jpg", label: "Front Cover" },
  { url: "/images/books/jaa-rahi-ho/back-cover.png", label: "Back Cover" },
  { url: "/images/books/jaa-rahi-ho/flipkart-edition.jpg", label: "Flipkart" },
  { url: "/images/books/jaa-rahi-ho/amazon-edition.png", label: "Amazon" },
  { url: "/images/books/jaa-rahi-ho/meesho-edition.png", label: "Meesho" },
];

export function BookLaunchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setHasMounted(true);
    // Check if dismissed in this session
    try {
      const dismissed = sessionStorage.getItem("ja_rahi_ho_popup_seen");
      if (!dismissed) {
        // Open automatically after 900ms delay for a smooth entry
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 900);
        return () => clearTimeout(timer);
      }
    } catch {
      // Fallback: show popup
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    try {
      sessionStorage.setItem("ja_rahi_ho_popup_seen", "true");
    } catch {}
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  if (!hasMounted) return null;

  return (
    <>
      {/* Floating Re-open Badge (always available in bottom-right corner) */}
      {!isOpen && (
        <button
          type="button"
          onClick={handleOpen}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-semibold shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 border border-amber-400/40 group"
          title="New Book: जा रही हो? by Anant Yadav"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-stone-950 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-stone-950"></span>
          </span>
          <BookOpen className="w-4 h-4 text-stone-950" />
          <span className="text-xs font-serif-literary tracking-wide">जा रही हो? (New Book)</span>
        </button>
      )}

      {/* POPUP MODAL */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-md transition-opacity duration-300 animate-fadeIn"
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto no-scrollbar rounded-3xl bg-stone-900 border border-amber-500/30 shadow-[0_25px_60px_-15px_rgba(217,119,6,0.3)] p-6 sm:p-8 space-y-6 text-stone-100 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close Button */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-stone-800/90 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors border border-stone-700/60 z-30"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Badge */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-mono uppercase tracking-widest font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                Featured Release • Book 2026
              </span>
              <span className="text-xs text-stone-400 font-mono hidden sm:inline">
                Shivija Publications
              </span>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
              {/* Left Column: Interactive Book Cover Display */}
              <div className="md:col-span-5 flex flex-col items-center space-y-3">
                <div className="relative w-48 sm:w-56 aspect-[3/4] rounded-2xl overflow-hidden border border-amber-500/40 shadow-2xl shadow-black/80 bg-stone-950">
                  <Image
                    src={BOOK_IMAGES[activeImageIndex].url}
                    alt="जा रही हो? by Anant Yadav"
                    fill
                    className="object-contain"
                    sizes="250px"
                    priority
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-stone-950/80 text-[10px] font-mono text-amber-300 border border-stone-800">
                    {BOOK_IMAGES[activeImageIndex].label}
                  </div>
                </div>

                {/* Amazon-style Scrollable / Clickable Image Thumbnails */}
                <div className="flex gap-1.5 overflow-x-auto max-w-full py-1 no-scrollbar justify-center">
                  {BOOK_IMAGES.map((img, idx) => {
                    const isSelected = idx === activeImageIndex;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageIndex(idx)}
                        onMouseEnter={() => setActiveImageIndex(idx)}
                        className={`relative w-11 aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                          isSelected
                            ? "border-amber-400 ring-2 ring-amber-400/40 scale-105"
                            : "border-stone-800 opacity-60 hover:opacity-100"
                        }`}
                        title={img.label}
                      >
                        <Image src={img.url} alt={img.label} fill className="object-cover" sizes="44px" />
                      </button>
                    );
                  })}
                </div>
                <span className="text-[10px] text-stone-400 font-mono">
                  Touch / Click thumbnails to preview
                </span>
              </div>

              {/* Right Column: Title, Poetic Quote & Order Links */}
              <div className="md:col-span-7 space-y-4">
                <div>
                  <h2 className="font-serif-literary text-3xl sm:text-4xl font-bold text-amber-200 tracking-tight">
                    जा रही हो?
                  </h2>
                  <p className="text-sm sm:text-base text-stone-300 font-serif-literary italic mt-1">
                    जा रही हो — रुक जाओ, अभी कुछ कहना बाकी है
                  </p>
                  <p className="text-xs font-mono text-amber-400 uppercase tracking-widest mt-1">
                    Anant Yadav • ₹249/-
                  </p>
                </div>

                {/* Poetry Quote snippet from back cover */}
                <div className="p-3.5 rounded-2xl bg-stone-950/60 border border-stone-800/80 text-stone-300 text-xs sm:text-sm font-serif-literary leading-relaxed space-y-1.5">
                  <p className="text-amber-300/90 font-medium">“ज़रुरी है क्या? थोड़ी देर ...”</p>
                  <p className="text-stone-300/90">
                    अभी मन भर तुम्हारा दीदार भी नहीं हुआ है। तुम्हारे जाने के बाद कहने को बहुत कुछ होगा, मगर सुनने को तुम नहीं होगी।
                  </p>
                  <p className="text-amber-400 font-serif italic text-xs pt-1">
                    — रुक जाओ, थोड़ी देर ही सही।
                  </p>
                </div>

                {/* Instant Order Buttons (Amazon, Flipkart, Google Play) */}
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-stone-400 block">
                    Available Online On:
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* Amazon Button */}
                    <a
                      href="https://amzn.in/d/0fRKiyZK"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-amber-500/20 transition-all group"
                    >
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-stone-950" />
                        <span>Order on Amazon</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 opacity-80 group-hover:translate-x-0.5 transition-transform" />
                    </a>

                    {/* Flipkart Button */}
                    <a
                      href="https://dl.flipkart.com/s/bipABbNNNN"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#2874F0] hover:bg-[#1f62cf] text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-sans font-black text-yellow-300 text-sm">fk</span>
                        <span>Order on Flipkart</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 opacity-80 group-hover:translate-x-0.5 transition-transform" />
                    </a>

                    {/* Google Play Book Button */}
                    <a
                      href="https://play.google.com/store/books/details?id=ZfAaEgAAQBAJ"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="col-span-1 sm:col-span-2 flex items-center justify-between px-4 py-2.5 rounded-xl bg-stone-800/90 hover:bg-stone-700 text-stone-200 border border-stone-700 font-medium text-xs transition-all group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-amber-400 font-mono">▶</span>
                        <span>Read on Google Play Books</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  </div>
                </div>

                {/* View Details Link */}
                <div className="pt-2 flex items-center justify-between border-t border-stone-800 text-xs font-mono">
                  <Link
                    href="/books/jaa-rahi-ho"
                    onClick={handleClose}
                    className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold transition-colors"
                  >
                    View Full Book Page &amp; Excerpts <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="text-stone-400 hover:text-stone-200 transition-colors"
                  >
                    Continue to website
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
