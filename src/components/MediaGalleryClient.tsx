"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Newspaper,
  Mic,
  Video,
  ExternalLink,
  Tag,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  ArrowRight,
} from "lucide-react";

export interface MediaItemData {
  id: string;
  title: string;
  publication: string;
  date: string;
  url?: string | null;
  excerpt?: string | null;
  mediaType: string;
  coverImage?: string | null;
  featured?: boolean;
}

interface MediaGalleryClientProps {
  initialItems: MediaItemData[];
}

export function MediaGalleryClient({ initialItems }: MediaGalleryClientProps) {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filterTabs = [
    { id: "all", label: "All Media & Artifacts" },
    { id: "merchandise", label: "Merchandise & Artifacts" },
    { id: "bookmarks", label: "Collector Bookmarks" },
    { id: "press", label: "Press & Interviews" },
  ];

  const filteredItems = initialItems.filter((item) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "merchandise") {
      return (
        item.mediaType === "merchandise" ||
        item.title.toLowerCase().includes("keychain") ||
        item.title.toLowerCase().includes("artifact")
      );
    }
    if (activeFilter === "bookmarks") {
      return item.title.toLowerCase().includes("bookmark");
    }
    if (activeFilter === "press") {
      return (
        item.mediaType === "interview" ||
        item.mediaType === "article" ||
        item.mediaType === "press" ||
        item.mediaType === "podcast" ||
        item.mediaType === "video"
      );
    }
    return true;
  });

  const visualItems = filteredItems.filter((item) => !!item.coverImage);

  const getMediaIcon = (type: string) => {
    switch (type) {
      case "podcast":
        return <Mic className="w-4 h-4 text-amber-400" />;
      case "video":
        return <Video className="w-4 h-4 text-rose-400" />;
      case "merchandise":
        return <Tag className="w-4 h-4 text-emerald-400" />;
      default:
        return <Newspaper className="w-4 h-4 text-amber-400" />;
    }
  };

  const openLightbox = (item: MediaItemData) => {
    const idx = visualItems.findIndex((v) => v.id === item.id);
    if (idx !== -1) {
      setLightboxIndex(idx);
    }
  };

  const nextLightbox = () => {
    if (lightboxIndex !== null && visualItems.length > 0) {
      setLightboxIndex((lightboxIndex + 1) % visualItems.length);
    }
  };

  const prevLightbox = () => {
    if (lightboxIndex !== null && visualItems.length > 0) {
      setLightboxIndex(
        (lightboxIndex - 1 + visualItems.length) % visualItems.length
      );
    }
  };

  const activeLightboxItem =
    lightboxIndex !== null ? visualItems[lightboxIndex] : null;

  return (
    <div className="space-y-12">
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {filterTabs.map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all duration-300 ${
                isActive
                  ? "bg-amber-500 text-stone-950 font-bold shadow-lg shadow-amber-500/20 scale-105"
                  : "bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Visual Artifacts & Photos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredItems.map((item) => {
          const isMerch =
            item.mediaType === "merchandise" ||
            item.title.toLowerCase().includes("keychain") ||
            item.title.toLowerCase().includes("bookmark");

          return (
            <div
              key={item.id}
              className="group rounded-3xl bg-stone-900/50 border border-stone-800 hover:border-amber-500/40 transition-all duration-500 flex flex-col justify-between overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-amber-950/20"
            >
              {/* Media Image Showcase */}
              {item.coverImage && (
                <div
                  onClick={() => openLightbox(item)}
                  className="relative aspect-[4/5] w-full overflow-hidden bg-stone-950 cursor-pointer"
                >
                  <Image
                    src={item.coverImage}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Enlarge Badge */}
                  <div className="absolute top-4 right-4 bg-stone-950/80 backdrop-blur-md border border-stone-700/60 text-stone-200 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
                    <Maximize2 className="w-4 h-4 text-amber-300" />
                  </div>

                  {/* Type Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-stone-950/80 backdrop-blur-md border border-amber-500/30 text-amber-300 text-[10px] font-mono uppercase tracking-widest flex items-center gap-1.5 shadow-md">
                      {getMediaIcon(item.mediaType)}
                      {isMerch ? "Literary Collectible" : item.mediaType}
                    </span>
                  </div>
                </div>
              )}

              {/* Text Information Container */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-stone-400 font-medium truncate pr-2">
                      {item.publication}
                    </span>
                    <span className="text-amber-400 shrink-0">{item.date}</span>
                  </div>

                  <h3 className="font-serif-literary text-xl sm:text-2xl font-bold text-stone-100 group-hover:text-amber-200 transition-colors leading-snug">
                    {item.title}
                  </h3>

                  {item.excerpt && (
                    <p className="text-sm text-stone-300 leading-relaxed font-sans line-clamp-3">
                      {item.excerpt}
                    </p>
                  )}
                </div>

                {/* Footer Action Links */}
                <div className="pt-4 border-t border-stone-800/80 flex items-center justify-between">
                  {item.url ? (
                    item.url.startsWith("http") ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1.5 uppercase tracking-wider font-semibold group/link"
                      >
                        <span>View Publication</span>
                        <ExternalLink className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                      </a>
                    ) : (
                      <Link
                        href={item.url}
                        className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1.5 uppercase tracking-wider font-semibold group/link"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Explore Book</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                      </Link>
                    )
                  ) : (
                    <span className="text-xs font-mono text-stone-400">
                      Official Archive
                    </span>
                  )}

                  {item.coverImage && (
                    <button
                      onClick={() => openLightbox(item)}
                      className="text-xs font-mono text-stone-400 hover:text-stone-200 flex items-center gap-1 transition-colors"
                    >
                      <span>Preview</span>
                      <Maximize2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-16 p-8 rounded-3xl bg-stone-900/30 border border-stone-800 space-y-3">
          <p className="text-stone-300 font-serif-literary text-lg">
            No media items match the selected category.
          </p>
          <button
            onClick={() => setActiveFilter("all")}
            className="text-amber-400 text-xs font-mono uppercase tracking-wider hover:underline"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Lightbox Modal */}
      {activeLightboxItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-stone-950/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-5 right-5 sm:top-8 sm:right-8 p-3 rounded-full bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700 transition-colors z-50"
            aria-label="Close Preview"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Previous Button */}
          {visualItems.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevLightbox();
              }}
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700 transition-colors z-50"
              aria-label="Previous Image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Next Button */}
          {visualItems.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextLightbox();
              }}
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700 transition-colors z-50"
              aria-label="Next Image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Modal Content */}
          <div
            className="max-w-4xl w-full max-h-[90vh] flex flex-col items-center justify-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-[65vh] sm:h-[72vh] rounded-2xl overflow-hidden border border-stone-800 shadow-2xl bg-stone-950">
              <Image
                src={activeLightboxItem.coverImage!}
                alt={activeLightboxItem.title}
                fill
                className="object-contain"
                priority
              />
            </div>

            <div className="text-center max-w-2xl px-4 space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest">
                <span>{activeLightboxItem.publication}</span>
                <span>•</span>
                <span>{activeLightboxItem.date}</span>
              </div>
              <h4 className="font-serif-literary text-xl sm:text-2xl font-bold text-stone-100">
                {activeLightboxItem.title}
              </h4>
              {activeLightboxItem.excerpt && (
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
                  {activeLightboxItem.excerpt}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
