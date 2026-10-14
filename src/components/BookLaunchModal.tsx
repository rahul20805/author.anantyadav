"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ExternalLink, ShoppingBag, BookOpen, Sparkles, ChevronRight } from "lucide-react";

interface BookData {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  price: string;
  releaseTag: string;
  badge: string;
  publisher: string;
  quoteTitle: string;
  quoteBody: string;
  quoteAuthor: string;
  images: { url: string; label: string }[];
  buttons: {
    label: string;
    url: string;
    isPrimary?: boolean;
    brand?: "kathaankan" | "amazon" | "flipkart" | "google";
    badgeText?: string;
  }[];
}

const FEATURED_BOOKS: BookData[] = [
  {
    id: "chup-mat-raha-karo",
    slug: "chup-mat-raha-karo",
    title: "चुप मत रहा करो",
    subtitle: "ये किताब उन खामोशियों की है, जो बोलना चाहती थीं...",
    price: "₹199/-",
    releaseTag: "Pre-Order Available • Launching November 2026",
    badge: "Upcoming Release • Nov 2026",
    publisher: "Kathaankan Publications",
    quoteTitle: "“कुछ बातें जो कभी कह नहीं पाए...”",
    quoteBody:
      "वो शब्द बनकर इस किताब में चले आए हैं। ये किताब उन खामोशियों की है, जो बोलना चाहती थीं, उन लम्हों की है जो ठहर गए थे कहीं, और उन एहसासों की है जो अब शब्द बनकर तुम तक पहुँच रहे हैं।",
    quoteAuthor: "— जो दिल में है, कभी-कभी उसे कह देना चाहिए।",
    images: [
      { url: "/images/books/chup-mat-raha-karo/front-cover.jpg", label: "Front Cover" },
      { url: "/images/books/chup-mat-raha-karo/special-edition.png", label: "Illustrated" },
      { url: "/images/books/chup-mat-raha-karo/back-cover.jpg", label: "Back Cover" },
      { url: "/images/books/chup-mat-raha-karo/angle-view.jpg", label: "3D Angle" },
      { url: "/images/books/chup-mat-raha-karo/book-mockup.jpg", label: "Showcase" },
    ],
    buttons: [
      {
        label: "Pre-Order Paperback (₹199)",
        url: "https://kathaankanpublicationhouse.com/book_detail.php?id=104&type=prebooking&utm_source=ig&utm_medium=social&utm_content=link_in_bio",
        isPrimary: true,
        brand: "kathaankan",
        badgeText: "Paperback ₹199",
      },
      {
        label: "Pre-Order on Amazon",
        url: "https://kathaankanpublicationhouse.com/book_detail.php?id=104&type=prebooking&utm_source=ig&utm_medium=social&utm_content=link_in_bio",
        isPrimary: false,
        brand: "amazon",
        badgeText: "Pre-Booking",
      },
    ],
  },
  {
    id: "jaa-rahi-ho",
    slug: "jaa-rahi-ho",
    title: "जा रही हो?",
    subtitle: "जा रही हो — रुक जाओ, अभी कुछ कहना बाकी है",
    price: "₹249/-",
    releaseTag: "Featured Release • In Stock Now",
    badge: "Official Release • Book 2026",
    publisher: "Shivija Publications",
    quoteTitle: "“ज़रुरी है क्या? थोड़ी देर ...”",
    quoteBody:
      "अभी मन भर तुम्हारा दीदार भी नहीं हुआ है। तुम्हारे जाने के बाद कहने को बहुत कुछ होगा, मगर सुनने को तुम नहीं होगी।",
    quoteAuthor: "— रुक जाओ, थोड़ी देर ही सही।",
    images: [
      { url: "/images/books/jaa-rahi-ho/front-cover.jpg", label: "Front Cover" },
      { url: "/images/books/jaa-rahi-ho/back-cover.png", label: "Back Cover" },
      { url: "/images/books/jaa-rahi-ho/amazon-edition.png", label: "Amazon" },
      { url: "/images/books/jaa-rahi-ho/flipkart-edition.jpg", label: "Flipkart" },
      { url: "/images/books/jaa-rahi-ho/meesho-edition.png", label: "Meesho" },
    ],
    buttons: [
      {
        label: "Order on Amazon",
        url: "https://amzn.in/d/0fRKiyZK",
        brand: "amazon",
        badgeText: "Paperback",
      },
      {
        label: "Order on Flipkart",
        url: "https://dl.flipkart.com/s/bipABbNNNN",
        brand: "flipkart",
        badgeText: "Fast Delivery",
      },
      {
        label: "Read on Google Play Books",
        url: "https://play.google.com/store/books/details?id=ZfAaEgAAQBAJ",
        brand: "google",
        badgeText: "E-Book",
      },
    ],
  },
];

export function BookLaunchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [activeBookIndex, setActiveBookIndex] = useState(0); // 0: Chup Mat Raha Karo, 1: Jaa Rahi Ho
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const currentBook = FEATURED_BOOKS[activeBookIndex];

  useEffect(() => {
    setHasMounted(true);
    try {
      const dismissed = sessionStorage.getItem("book_launch_popup_seen_nov");
      if (!dismissed) {
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 900);
        return () => clearTimeout(timer);
      }
    } catch {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    try {
      sessionStorage.setItem("book_launch_popup_seen_nov", "true");
    } catch {}
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const switchBook = (index: number) => {
    setActiveBookIndex(index);
    setActiveImageIndex(0);
  };

  if (!hasMounted) return null;

  return (
    <>
      {/* Floating Re-open Badge (always available in bottom-right corner) */}
      {!isOpen && (
        <button
          type="button"
          onClick={handleOpen}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-semibold shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 border border-amber-400/50 group"
          title="Featured Books by Anant Yadav"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-stone-950 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-stone-950"></span>
          </span>
          <BookOpen className="w-4 h-4 text-stone-950" />
          <span className="text-xs font-serif-literary tracking-wide font-bold">
            चुप मत रहा करो (Pre-Order Available)
          </span>
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

            {/* Header Tabs to switch between the 2 books */}
            <div className="flex flex-wrap items-center justify-between gap-3 pr-10">
              <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-stone-950/70 border border-stone-800">
                {FEATURED_BOOKS.map((b, idx) => {
                  const isActive = idx === activeBookIndex;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => switchBook(idx)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 ${
                        isActive
                          ? "bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/30"
                          : "text-stone-400 hover:text-stone-200"
                      }`}
                    >
                      {idx === 0 && <span className="w-1.5 h-1.5 rounded-full bg-stone-950 animate-pulse"></span>}
                      <span>{b.title}</span>
                      {idx === 0 && <span className="text-[10px] uppercase font-bold opacity-80">(Pre-Order)</span>}
                    </button>
                  );
                })}
              </div>

              <span className="text-xs text-amber-400/90 font-mono hidden sm:inline">
                {currentBook.publisher}
              </span>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
              {/* Left Column: Interactive Book Cover Display */}
              <div className="md:col-span-5 flex flex-col items-center space-y-3">
                <div className="relative w-48 sm:w-56 aspect-[3/4] rounded-2xl overflow-hidden border border-amber-500/40 shadow-2xl shadow-black/80 bg-stone-950">
                  <Image
                    src={currentBook.images[activeImageIndex]?.url || currentBook.images[0].url}
                    alt={`${currentBook.title} by Anant Yadav`}
                    fill
                    className="object-contain"
                    sizes="250px"
                    priority
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-stone-950/80 text-[10px] font-mono text-amber-300 border border-stone-800">
                    {currentBook.images[activeImageIndex]?.label || "Preview"}
                  </div>
                </div>

                {/* Amazon-style Scrollable / Clickable Image Thumbnails */}
                <div className="flex gap-1.5 overflow-x-auto max-w-full py-1 no-scrollbar justify-center">
                  {currentBook.images.map((img, idx) => {
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
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-mono uppercase tracking-widest font-semibold mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    {currentBook.badge}
                  </div>
                  <h2 className="font-serif-literary text-3xl sm:text-4xl font-bold text-amber-200 tracking-tight">
                    {currentBook.title}
                  </h2>
                  <p className="text-sm sm:text-base text-stone-300 font-serif-literary italic mt-1">
                    {currentBook.subtitle}
                  </p>
                  <p className="text-xs font-mono text-amber-400 uppercase tracking-widest mt-1 font-semibold">
                    Anant Yadav • {currentBook.price} • {currentBook.releaseTag}
                  </p>
                </div>

                {/* Poetry Quote snippet from back cover */}
                <div className="p-3.5 rounded-2xl bg-stone-950/60 border border-stone-800/80 text-stone-300 text-xs sm:text-sm font-serif-literary leading-relaxed space-y-1.5">
                  <p className="text-amber-300/90 font-medium">{currentBook.quoteTitle}</p>
                  <p className="text-stone-300/90">{currentBook.quoteBody}</p>
                  <p className="text-amber-400 font-serif italic text-xs pt-1">
                    {currentBook.quoteAuthor}
                  </p>
                </div>

                {/* Instant Order / Pre-order Buttons */}
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-stone-400 block">
                    {activeBookIndex === 0 ? "Pre-Booking Links:" : "Available Online On:"}
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {currentBook.buttons.map((btn, idx) => {
                      const isAmazon = btn.brand === "amazon";
                      const isFlipkart = btn.brand === "flipkart";
                      const isGoogle = btn.brand === "google";
                      const isKathaankan = btn.brand === "kathaankan";

                      let btnStyle = "bg-stone-800/90 hover:bg-stone-700 text-stone-200 border border-stone-700 font-medium text-xs";
                      if (isKathaankan || btn.isPrimary) {
                        btnStyle = "bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-950/30";
                      } else if (isAmazon) {
                        btnStyle = "bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-amber-500/20";
                      } else if (isFlipkart) {
                        btnStyle = "bg-[#2874F0] hover:bg-[#1f62cf] text-white font-bold text-xs uppercase tracking-wider shadow-lg";
                      }

                      return (
                        <a
                          key={idx}
                          href={btn.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center justify-between px-4 py-2.5 rounded-xl transition-all group ${btnStyle}`}
                        >
                          <div className="flex items-center gap-2">
                            {(isAmazon || isKathaankan) && <ShoppingBag className="w-4 h-4 text-stone-950" />}
                            {isFlipkart && <span className="font-sans font-black text-yellow-300 text-sm">fk</span>}
                            {isGoogle && <span className="text-amber-400 font-mono">▶</span>}
                            <span>{btn.label}</span>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 opacity-80 group-hover:translate-x-0.5 transition-transform" />
                        </a>
                      );
                    })}
                  </div>
                </div>

                {/* View Details Link */}
                <div className="pt-2 flex items-center justify-between border-t border-stone-800 text-xs font-mono">
                  <Link
                    href={`/books/${currentBook.slug}`}
                    onClick={handleClose}
                    className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold transition-colors"
                  >
                    View Full Page &amp; Excerpts <ChevronRight className="w-3.5 h-3.5" />
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
