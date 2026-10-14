"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X, ZoomIn } from "lucide-react";

interface BookImageGalleryProps {
  title: string;
  images: string[];
}

export function BookImageGallery({ title, images }: BookImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const mainImageRef = useRef<HTMLDivElement>(null);

  const safeImages = images && images.length > 0
    ? images
    : ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"];

  const activeImage = safeImages[selectedIndex] || safeImages[0];

  const getImageLabel = (url: string, index: number) => {
    const lower = url.toLowerCase();
    if (lower.includes("front-cover") || lower.includes("front")) return "Front Cover";
    if (lower.includes("back-cover") || lower.includes("back")) return "Back Cover";
    if (lower.includes("special") || lower.includes("illustrated") || lower.includes("sketch")) return "Special Illustrated Edition";
    if (lower.includes("mockup") || lower.includes("3d")) return "3D Book Showcase";
    if (lower.includes("angle") || lower.includes("perspective")) return "Angle View";
    if (lower.includes("amazon")) return "Amazon Edition";
    if (lower.includes("flipkart")) return "Flipkart Edition";
    if (lower.includes("meesho")) return "Meesho Edition";
    return `View ${index + 1}`;
  };

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : safeImages.length - 1));
  }, [safeImages.length]);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => (prev < safeImages.length - 1 ? prev + 1 : 0));
  }, [safeImages.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") setIsLightboxOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, handlePrev, handleNext]);

  // Sync mobile scroll position when selectedIndex changes
  useEffect(() => {
    if (mobileScrollRef.current) {
      const container = mobileScrollRef.current;
      const target = container.children[selectedIndex] as HTMLElement;
      if (target) {
        container.scrollTo({
          left: target.offsetLeft,
          behavior: "smooth",
        });
      }
    }
  }, [selectedIndex]);

  // Handle zoom lens movement on desktop
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mainImageRef.current) return;
    const rect = mainImageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  return (
    <div className="w-full space-y-4">
      {/* DESKTOP VIEW (md+): Amazon-style Layout (Thumbnails on Left + Main Viewer + Zoom Lens) */}
      <div className="hidden md:flex gap-4 items-start select-none">
        {/* Amazon-style Vertical Thumbnail Strip */}
        {safeImages.length > 1 && (
          <div className="flex flex-col gap-2.5 w-20 shrink-0 max-h-[560px] overflow-y-auto no-scrollbar py-1">
            {safeImages.map((img, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onMouseEnter={() => setSelectedIndex(idx)}
                  onClick={() => setSelectedIndex(idx)}
                  className={`relative aspect-[3/4] w-20 rounded-xl overflow-hidden border-2 transition-all duration-200 group bg-stone-900 ${
                    isSelected
                      ? "border-amber-400 ring-2 ring-amber-400/40 shadow-md shadow-amber-500/20 scale-[1.03]"
                      : "border-stone-800 hover:border-amber-500/50 opacity-70 hover:opacity-100"
                  }`}
                  aria-label={`View image ${idx + 1}`}
                >
                  <Image
                    src={img}
                    alt={`${title} - Thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                  <span className="absolute bottom-0 inset-x-0 bg-stone-950/85 text-[9px] font-mono text-stone-300 py-0.5 px-1 text-center truncate">
                    {getImageLabel(img, idx)}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Main Image Showcase with Amazon-style Zoom & Pan */}
        <div className="flex-1 relative space-y-2">
          <div
            ref={mainImageRef}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onMouseMove={handleMouseMove}
            onClick={() => setIsLightboxOpen(true)}
            className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-stone-700/80 shadow-2xl bg-stone-900/90 cursor-zoom-in group"
          >
            {/* Standard Image */}
            <Image
              src={activeImage}
              alt={`${title} - Image ${selectedIndex + 1}`}
              fill
              className={`object-contain transition-transform duration-150 ${
                isHovering ? "scale-105" : "scale-100"
              }`}
              sizes="(max-width: 1024px) 500px, 600px"
              priority
            />

            {/* Hover Magnifier Zoom Lens Viewport */}
            {isHovering && (
              <div
                className="absolute inset-0 pointer-events-none z-10 hidden lg:block overflow-hidden rounded-2xl bg-stone-950/40"
                style={{
                  backgroundImage: `url(${activeImage})`,
                  backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                  backgroundSize: "220%",
                  backgroundRepeat: "no-repeat",
                }}
              />
            )}

            {/* Next / Prev Navigation Overlays */}
            {safeImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-stone-900/80 hover:bg-amber-600 text-stone-200 hover:text-stone-950 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-xl border border-stone-700/60 z-20"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-stone-900/80 hover:bg-amber-600 text-stone-200 hover:text-stone-950 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-xl border border-stone-700/60 z-20"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Top Right Click to Expand Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsLightboxOpen(true);
              }}
              className="absolute top-3 right-3 p-2 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-amber-300 border border-stone-700/70 shadow-lg transition-all z-20"
              title="Click to expand fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Bottom Label Bar */}
            <div className="absolute bottom-3 inset-x-3 flex items-center justify-between pointer-events-none z-20">
              <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-stone-950/80 text-amber-300 border border-stone-700/80 backdrop-blur-sm">
                {getImageLabel(activeImage, selectedIndex)}
              </span>
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-stone-950/80 text-stone-300 border border-stone-700/80 backdrop-blur-sm">
                {selectedIndex + 1} / {safeImages.length}
              </span>
            </div>
          </div>

          {/* Amazon-style Roll-over hint */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-stone-400 font-mono pt-1">
            <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
            <span>Roll over image to zoom in • Click to expand</span>
          </div>
        </div>
      </div>

      {/* MOBILE / TABLET VIEW (<md): Horizontal Swipeable Carousel like Amazon App */}
      <div className="block md:hidden space-y-3">
        {/* Swipeable Container */}
        <div
          ref={mobileScrollRef}
          onScroll={(e) => {
            const target = e.currentTarget;
            const scrollLeft = target.scrollLeft;
            const itemWidth = target.clientWidth;
            const newIndex = Math.round(scrollLeft / itemWidth);
            if (newIndex !== selectedIndex && newIndex >= 0 && newIndex < safeImages.length) {
              setSelectedIndex(newIndex);
            }
          }}
          className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar rounded-2xl border border-stone-800 bg-stone-900 shadow-xl"
        >
          {safeImages.map((img, idx) => (
            <div
              key={idx}
              onClick={() => setIsLightboxOpen(true)}
              className="w-full shrink-0 snap-center relative aspect-[3/4] cursor-pointer"
            >
              <Image
                src={img}
                alt={`${title} - View ${idx + 1}`}
                fill
                className="object-contain p-2"
                sizes="(max-width: 768px) 100vw, 400px"
                priority={idx === 0}
              />
              <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-stone-950/80 text-[10px] font-mono text-amber-300 border border-stone-700/60">
                {getImageLabel(img, idx)}
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Dots & Controls */}
        {safeImages.length > 1 && (
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-1.5">
              {safeImages.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === selectedIndex
                      ? "w-6 bg-amber-400"
                      : "w-2 bg-stone-700 hover:bg-stone-500"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            <span className="text-xs font-mono text-stone-400">
              {selectedIndex + 1} / {safeImages.length} (Swipe to view)
            </span>
          </div>
        )}

        {/* Mobile Horizontal Thumbnail Scroller */}
        {safeImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto py-1 no-scrollbar">
            {safeImages.map((img, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedIndex(idx)}
                  className={`relative w-14 aspect-[3/4] shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                    isSelected
                      ? "border-amber-400 ring-2 ring-amber-400/40"
                      : "border-stone-800 opacity-60"
                  }`}
                >
                  <Image src={img} alt={`Thumb ${idx + 1}`} fill className="object-cover" sizes="56px" />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/95 backdrop-blur-md p-4 animate-fadeIn"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Modal Header */}
          <div className="absolute top-4 inset-x-4 flex items-center justify-between text-stone-200 z-50">
            <div className="flex items-center gap-3">
              <span className="font-serif-literary text-lg font-semibold text-amber-200">
                {title}
              </span>
              <span className="text-xs font-mono text-stone-400 border-l border-stone-700 pl-3">
                {getImageLabel(activeImage, selectedIndex)} ({selectedIndex + 1} of {safeImages.length})
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="p-2.5 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
              aria-label="Close fullscreen"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Large Image Container */}
          <div
            className="relative w-full max-w-4xl h-[80vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={activeImage}
              alt={`${title} - Zoomed`}
              fill
              className="object-contain"
              sizes="90vw"
              priority
            />

            {/* Nav Arrows */}
            {safeImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-stone-900/80 hover:bg-amber-600 text-stone-200 hover:text-stone-950 transition-colors shadow-2xl"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-stone-900/80 hover:bg-amber-600 text-stone-200 hover:text-stone-950 transition-colors shadow-2xl"
                  aria-label="Next"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails in Lightbox */}
          {safeImages.length > 1 && (
            <div
              className="absolute bottom-4 inset-x-4 flex justify-center gap-3 overflow-x-auto py-2"
              onClick={(e) => e.stopPropagation()}
            >
              {safeImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedIndex(idx)}
                  className={`relative w-14 aspect-[3/4] shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                    idx === selectedIndex
                      ? "border-amber-400 ring-2 ring-amber-400/50 scale-105"
                      : "border-stone-700 opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt={`Thumb ${idx + 1}`} fill className="object-cover" sizes="56px" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
