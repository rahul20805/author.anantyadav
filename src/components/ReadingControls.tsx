"use client";

import { useState } from "react";
import { Type, Sparkles } from "lucide-react";

interface ReadingControlsProps {
  onThemeChange?: (theme: "dark" | "sepia" | "light") => void;
  onFontSizeChange?: (size: "sm" | "base" | "lg" | "xl") => void;
}

export function ReadingControls({ onThemeChange, onFontSizeChange }: ReadingControlsProps) {
  const [activeTheme, setActiveTheme] = useState<"dark" | "sepia" | "light">("dark");
  const [activeSize, setActiveSize] = useState<"sm" | "base" | "lg" | "xl">("base");

  const handleTheme = (theme: "dark" | "sepia" | "light") => {
    setActiveTheme(theme);
    onThemeChange?.(theme);
  };

  const handleSize = (size: "sm" | "base" | "lg" | "xl") => {
    setActiveSize(size);
    onFontSizeChange?.(size);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 rounded-2xl bg-stone-900/90 border border-stone-800/80 backdrop-blur-md shadow-xl max-w-lg mx-auto mb-8">
      {/* Font Size Selector */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-stone-400 mr-1 flex items-center gap-1">
          <Type className="w-3.5 h-3.5 text-amber-400" /> Size:
        </span>
        {(["sm", "base", "lg", "xl"] as const).map((s) => (
          <button
            key={s}
            onClick={() => handleSize(s)}
            className={`px-2.5 py-1 rounded-md text-xs font-mono transition-all ${
              activeSize === s
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                : "text-stone-400 hover:text-stone-200 hover:bg-stone-800"
            }`}
          >
            {s.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Reading Canvas Tone */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-stone-400 mr-1 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Tone:
        </span>
        <button
          onClick={() => handleTheme("dark")}
          className={`px-2.5 py-1 rounded-md text-xs transition-all ${
            activeTheme === "dark"
              ? "bg-stone-800 text-stone-100 border border-stone-600 font-medium"
              : "text-stone-400 hover:text-stone-200"
          }`}
        >
          Dark
        </button>
        <button
          onClick={() => handleTheme("sepia")}
          className={`px-2.5 py-1 rounded-md text-xs transition-all ${
            activeTheme === "sepia"
              ? "bg-[#e8dec8] text-[#3d3222] border border-[#c2b291] font-medium"
              : "text-stone-400 hover:text-stone-200"
          }`}
        >
          Sepia
        </button>
        <button
          onClick={() => handleTheme("light")}
          className={`px-2.5 py-1 rounded-md text-xs transition-all ${
            activeTheme === "light"
              ? "bg-white text-stone-900 border border-stone-300 font-medium"
              : "text-stone-400 hover:text-stone-200"
          }`}
        >
          Light
        </button>
      </div>
    </div>
  );
}
