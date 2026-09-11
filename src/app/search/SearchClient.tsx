"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Loader2, BookOpen, Feather, FileText, Quote, Newspaper, Calendar } from "lucide-react";

interface SearchResultItem {
  id: string;
  type: "book" | "poem" | "writing" | "thought" | "media" | "event";
  title: string;
  subtitle?: string | null;
  snippet: string;
  url: string;
  category?: string | null;
}

export function SearchClient() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      const timer = setTimeout(() => {
        setResults([]);
        setSearched(false);
      }, 0);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}&type=${filter}`);
        const data = await res.json();
        setResults(data.results || []);
        setSearched(true);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, filter]);

  const getIcon = (type: string) => {
    switch (type) {
      case "book":
        return <BookOpen className="w-4 h-4 text-amber-400" />;
      case "poem":
        return <Feather className="w-4 h-4 text-emerald-400" />;
      case "writing":
        return <FileText className="w-4 h-4 text-sky-400" />;
      case "thought":
        return <Quote className="w-4 h-4 text-purple-400" />;
      case "media":
        return <Newspaper className="w-4 h-4 text-orange-400" />;
      case "event":
        return <Calendar className="w-4 h-4 text-rose-400" />;
      default:
        return <Search className="w-4 h-4 text-stone-400" />;
    }
  };

  return (
    <div className="space-y-8 font-sans-ui">
      {/* Search Bar Input */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for poems, books, essays, themes (e.g. silence, memory, solitude)..."
          className="w-full bg-stone-900/90 border border-stone-800 focus:border-amber-500/60 rounded-2xl pl-12 pr-12 py-4 text-stone-100 placeholder-stone-400 text-base focus:outline-none transition-colors shadow-2xl"
          autoFocus
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
        {loading && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400 animate-spin" />
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {["all", "book", "poem", "writing", "thought", "media", "event"].map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${
              filter === t
                ? "bg-amber-600 text-stone-950 font-bold"
                : "bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-200"
            }`}
          >
            {t === "all" ? "All Content" : t}
          </button>
        ))}
      </div>

      {/* Results Listing */}
      {searched && (
        <div className="space-y-4 pt-4">
          <p className="text-xs font-mono text-stone-400">
            Found {results.length} results for &ldquo;{query}&rdquo;
          </p>

          {results.length > 0 ? (
            <div className="divide-y divide-stone-800/80 rounded-2xl bg-stone-900/40 border border-stone-800 overflow-hidden">
              {results.map((item) => (
                <Link
                  key={`${item.type}-${item.id}`}
                  href={item.url}
                  className="block p-6 hover:bg-stone-900/90 transition-colors group"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-amber-400/90">
                      {getIcon(item.type)} {item.type}
                    </span>
                    {item.category && (
                      <span className="text-[11px] font-mono text-stone-400 bg-stone-950 px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif-literary text-xl font-bold text-stone-100 group-hover:text-amber-200 transition-colors">
                    {item.title}
                  </h3>
                  {item.subtitle && (
                    <p className="text-xs text-stone-400 italic mb-1">{item.subtitle}</p>
                  )}

                  <p className="text-xs text-stone-300 line-clamp-2 mt-2 leading-relaxed">
                    {item.snippet}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-stone-900/30 border border-stone-800 text-stone-400 space-y-2">
              <p className="font-serif-literary text-lg text-stone-300">No results found.</p>
              <p className="text-xs">
                Try searching for alternative keywords like &ldquo;solitude&rdquo;, &ldquo;verse&rdquo;, or &ldquo;silence&rdquo;.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
