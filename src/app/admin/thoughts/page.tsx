"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Quote, Loader2, X, Sparkles } from "lucide-react";
import { useToast } from "@/components/ToastContext";

interface Thought {
  id: string;
  quote: string;
  context?: string | null;
  source: string;
  category: string;
  featured: boolean;
  published: boolean;
}

export default function AdminThoughtsPage() {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingThought, setEditingThought] = useState<Thought | null>(null);
  const { success, error } = useToast();

  const [quote, setQuote] = useState("");
  const [context, setContext] = useState("");
  const [source, setSource] = useState("Anant Yadav");
  const [category, setCategory] = useState("Philosophy");
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchThoughts = async () => {
    try {
      const res = await fetch("/api/admin/thoughts");
      const data = await res.json();
      setThoughts(data.thoughts || []);
    } catch (err) {
      console.error(err);
      error("Failed to fetch thoughts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThoughts();
  }, []);

  const openAddModal = () => {
    setEditingThought(null);
    setQuote("");
    setContext("");
    setSource("Anant Yadav");
    setCategory("Philosophy");
    setFeatured(false);
    setPublished(true);
    setIsModalOpen(true);
  };

  const openEditModal = (t: Thought) => {
    setEditingThought(t);
    setQuote(t.quote);
    setContext(t.context || "");
    setSource(t.source || "Anant Yadav");
    setCategory(t.category);
    setFeatured(t.featured);
    setPublished(t.published);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      quote,
      context,
      source,
      category,
      featured,
      published,
    };

    try {
      const url = editingThought ? `/api/admin/thoughts/${editingThought.id}` : "/api/admin/thoughts";
      const method = editingThought ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save thought");

      success(editingThought ? "Thought updated" : "Thought recorded");
      setIsModalOpen(false);
      fetchThoughts();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving";
      error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this thought?")) return;
    try {
      const res = await fetch(`/api/admin/thoughts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      success("Thought deleted");
      fetchThoughts();
    } catch (err) {
      error("Delete failed");
    }
  };

  return (
    <div className="space-y-8 font-sans-ui">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
            Aphorisms &amp; Reflections
          </span>
          <h1 className="font-serif-literary text-3xl font-bold text-stone-100">
            Thoughts &amp; Quotes
          </h1>
        </div>
        <button
          onClick={openAddModal}
          className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md"
        >
          <Plus className="w-4 h-4" /> Add Thought
        </button>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="p-12 text-center text-stone-400">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-amber-400" />
        </div>
      ) : thoughts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {thoughts.map((t) => (
            <div
              key={t.id}
              className="p-6 rounded-2xl bg-stone-900/40 border border-stone-800 flex flex-col justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-amber-400 uppercase tracking-widest">{t.category}</span>
                  {t.featured && <span className="text-amber-400 font-bold">★ Featured</span>}
                </div>
                <blockquote className="font-serif-literary text-lg text-stone-100 italic">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                {t.context && <p className="text-xs text-stone-400">Source: {t.context}</p>}
              </div>

              <div className="pt-4 border-t border-stone-800/80 flex items-center justify-between">
                <span className="text-xs text-stone-400 font-mono">— {t.source}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(t)}
                    className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-amber-300"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="p-1.5 rounded-lg bg-stone-800 hover:bg-rose-950 text-stone-300 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-stone-900/30 border border-stone-800 text-stone-400">
          <Quote className="w-8 h-8 text-stone-400 mx-auto mb-2" />
          <p>No thoughts recorded yet. Click &ldquo;Add Thought&rdquo; above.</p>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-stone-950 border border-stone-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800">
              <h2 className="font-serif-literary text-2xl font-bold text-stone-100">
                {editingThought ? "Edit Thought" : "Add Thought"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-sans-ui">
              <div>
                <label className="block text-stone-300 uppercase font-mono mb-1">Quote / Fragment *</label>
                <textarea
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  required
                  rows={4}
                  placeholder="Silence is not the absence of sound..."
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60 font-serif-literary text-base"
                />
              </div>

              <div>
                <label className="block text-stone-300 uppercase font-mono mb-1">Context / Origin</label>
                <input
                  type="text"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="e.g. From Notes on Contemplative Living"
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-300 uppercase font-mono mb-1">Source / Attribution</label>
                  <input
                    type="text"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 uppercase font-mono mb-1">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Philosophy / Silence"
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-stone-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-0"
                  />
                  <span>Published</span>
                </label>
                <label className="flex items-center gap-2 text-stone-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-0"
                  />
                  <span>Feature on Homepage</span>
                </label>
              </div>

              <div className="pt-6 border-t border-stone-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-stone-800 hover:bg-stone-900 text-stone-300 text-xs uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-stone-950 font-semibold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Thought"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
