"use client";

import { useState, useRef } from "react";
import {
  Download,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  FileText,
  BookOpen,
  Eye,
  FileCheck,
} from "lucide-react";
import { formatFileSize } from "@/lib/utils";

interface PdfViewerProps {
  pdfUrl: string;
  pdfFilename?: string | null;
  pdfSize?: number | null;
  title: string;
}

export function PdfViewer({
  pdfUrl,
  pdfFilename,
  pdfSize,
  title,
}: PdfViewerProps) {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 15, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 15, 75));
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.warn("Fullscreen request failed:", err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => {
        console.warn("Exit fullscreen failed:", err);
      });
      setIsFullscreen(false);
    }
  };

  const downloadFilename = pdfFilename || `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.pdf`;

  return (
    <div
      ref={containerRef}
      className={`rounded-3xl bg-stone-900/50 border border-stone-800 shadow-2xl overflow-hidden transition-all duration-300 ${
        isFullscreen ? "p-4 bg-stone-950 h-screen flex flex-col justify-between" : "p-4 sm:p-6"
      }`}
    >
      {/* Reader Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-stone-800/80 font-sans-ui text-xs">
        {/* Left: Document Info */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <span className="font-mono text-[11px] uppercase tracking-wider text-amber-400 font-bold block">
              PDF Document
            </span>
            <span className="text-stone-300 text-xs font-mono">
              {pdfFilename || "Article Publication"} {pdfSize ? `• ${formatFileSize(pdfSize)}` : ""}
            </span>
          </div>
        </div>

        {/* Center/Right: Zoom & Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Zoom controls (visible on sm+) */}
          <div className="hidden sm:flex items-center bg-stone-950/90 border border-stone-800 rounded-xl p-1 gap-1">
            <button
              onClick={handleZoomOut}
              disabled={zoomLevel <= 75}
              title="Zoom Out"
              className="p-1.5 rounded-lg text-stone-300 hover:text-stone-100 hover:bg-stone-800 disabled:opacity-40 transition-colors cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono text-[11px] text-stone-300 min-w-[44px] text-center select-none">
              {zoomLevel}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={zoomLevel >= 200}
              title="Zoom In"
              className="p-1.5 rounded-lg text-stone-300 hover:text-stone-100 hover:bg-stone-800 disabled:opacity-40 transition-colors cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            {zoomLevel !== 100 && (
              <button
                onClick={handleResetZoom}
                title="Reset Zoom"
                className="p-1.5 rounded-lg text-amber-400 hover:bg-stone-800 transition-colors cursor-pointer text-[10px] font-mono px-1.5"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Reader"}
            className="p-2 rounded-xl bg-stone-950/80 border border-stone-800 hover:border-amber-500/30 text-stone-300 hover:text-amber-300 transition-all cursor-pointer hidden md:flex items-center"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {/* Open in New Tab Button */}
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open PDF in a new browser tab"
            className="px-3.5 py-2 rounded-xl bg-stone-950/80 border border-stone-800 hover:border-amber-500/40 text-stone-200 hover:text-amber-300 text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            <span>Open in Tab</span>
          </a>

          {/* Download PDF Button */}
          <a
            href={pdfUrl}
            download={downloadFilename}
            title="Download PDF to your device"
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md hover:shadow-amber-600/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </a>
        </div>
      </div>

      {/* PDF Viewer Canvas Frame */}
      <div
        className={`relative w-full rounded-2xl bg-stone-950 border border-stone-800/80 overflow-auto ${
          isFullscreen ? "flex-1 min-h-0" : "h-[72vh] sm:h-[80vh] min-h-[500px]"
        }`}
      >
        <div
          className="w-full h-full transition-transform duration-150 origin-top flex items-center justify-center"
          style={{
            transform: zoomLevel !== 100 ? `scale(${zoomLevel / 100})` : "none",
            transformOrigin: "top center",
          }}
        >
          <iframe
            src={`${pdfUrl}#view=FitH&toolbar=1&navpanes=0`}
            title={`PDF: ${title}`}
            onLoad={() => setHasLoaded(true)}
            className="w-full h-full border-0 rounded-2xl bg-stone-950"
          />
        </div>
      </div>

      {/* Mobile Reader Helper Hint */}
      <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-stone-400">
        <span className="flex items-center gap-1.5">
          <FileCheck className="w-3.5 h-3.5 text-amber-400" />
          Interactive digital PDF view. Scroll to browse all pages.
        </span>
        <div className="flex items-center gap-3">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-400 hover:underline inline-flex items-center gap-1"
          >
            Having trouble viewing? Open full PDF &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
