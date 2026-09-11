"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Feather, Loader2, X, Sparkles, Clock } from "lucide-react";
import { useToast } from "@/components/ToastContext";

interface Poem {
  id: string;
  title: string;
  slug: string;
  subtitle?: string | null;
  content: string;
  excerpt?: string | null;
  category: string;
  tags: string;
  coverImage?: string | null;
  readingTime: number;
  featured: boolean;
  published: boolean;
  audioUrl?: string | null;
  publishDate?: string | null;
}

export default function AdminPoetryPage() {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPoem, setEditingPoem] = useState<Poem | null>(null);
  const { success, error } = useToast();

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Contemporary");
  const [tags, setTags] = useState('["solitude", "memory"]');
  const [coverImage, setCoverImage] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchPoems = async () => {
    try {
      const res = await fetch("/api/admin/poetry");
      const data = await res.json();
      setPoems(data.poems || []);
    } catch (err) {
      console.error(err);
      error("Failed to fetch poetry");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoems();
  }, []);

  const openAddModal = () => {
    setEditingPoem(null);
    setTitle("");
    setSlug("");
    setSubtitle("");
    setContent("");
    setCategory("Contemporary");
    setTags('["solitude", "memory"]');
    setCoverImage("");
    setAudioUrl("");
    setPublishDate(new Date().toISOString().split("T")[0]);
    setFeatured(false);
    setPublished(true);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Poem) => {
    setEditingPoem(p);
    setTitle(p.title);
    setSlug(p.slug);
    setSubtitle(p.subtitle || "");
    setContent(p.content);
    setCategory(p.category);
    setTags(p.tags);
    setCoverImage(p.coverImage || "");
    setAudioUrl(p.audioUrl || "");
    setPublishDate(p.publishDate || "");
    setFeatured(p.featured);
    setPublished(p.published);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title,
      slug,
      subtitle,
      content,
      category,
      tags,
      coverImage,
      audioUrl,
      publishDate,
      featured,
      published,
    };

    try {
      const url = editingPoem ? `/api/admin/poetry/${editingPoem.id}` : "/api/admin/poetry";
      const method = editingPoem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save poem");

      success(editingPoem ? "Poem updated successfully" : "Poem published successfully");
      setIsModalOpen(false);
      fetchPoems();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving";
      error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/poetry/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      success("Poem deleted");
      fetchPoems();
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
            Poetics &amp; Stanzas
          </span>
          <h1 className="font-serif-literary text-3xl font-bold text-stone-100">
            Poetry Management
          </h1>
        </div>
        <button
          onClick={openAddModal}
          className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md"
        >
          <Plus className="w-4 h-4" /> Compose New Poem
        </button>
      </div>

      {/* Poetry Table */}
      {loading ? (
        <div className="p-12 text-center text-stone-400">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-amber-400" />
        </div>
      ) : poems.length > 0 ? (
        <div className="rounded-2xl border border-stone-800 bg-stone-900/40 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-950/80 text-stone-400 uppercase font-mono border-b border-stone-800">
                <tr>
                  <th className="p-4">Poem Title</th>
                  <th className="p-4">Theme / Category</th>
                  <th className="p-4">Reading Time</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Featured</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60 text-stone-200">
                {poems.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-900/60 transition-colors">
                    <td className="p-4 font-medium">
                      <span className="font-serif-literary text-sm font-bold text-stone-100 block">
                        {p.title}
                      </span>
                      <span className="text-[11px] font-mono text-stone-400">/poetry/{p.slug}</span>
                    </td>
                    <td className="p-4 text-stone-300 font-mono">{p.category}</td>
                    <td className="p-4 font-mono">{p.readingTime} min</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full font-mono text-[10px] ${
                          p.published
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : "bg-stone-800 text-stone-400"
                        }`}
                      >
                        {p.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="p-4 font-mono">
                      {p.featured ? (
                        <span className="text-amber-400 font-bold">★ Yes</span>
                      ) : (
                        <span className="text-stone-400">No</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-amber-300 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.title)}
                          className="p-1.5 rounded-lg bg-stone-800 hover:bg-rose-950 text-stone-300 hover:text-rose-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-stone-900/30 border border-stone-800 text-stone-400">
          <Feather className="w-8 h-8 text-stone-400 mx-auto mb-2" />
          <p>No poems composed yet. Click &ldquo;Compose New Poem&rdquo; above.</p>
        </div>
      )}

      {/* Compose / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-stone-950 border border-stone-800 rounded-3xl p-6 sm:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800">
              <h2 className="font-serif-literary text-2xl font-bold text-stone-100">
                {editingPoem ? "Edit Poem" : "Compose Poem"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-sans-ui">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-300 uppercase font-mono mb-1">Poem Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="e.g. The Geometry of Memory"
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 uppercase font-mono mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="the-geometry-of-memory"
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 uppercase font-mono mb-1">Subtitle / Epigraph</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. On angles of forgotten light"
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div>
                <label className="block text-stone-300 uppercase font-mono mb-1">Poem Stanzas / Content *</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  rows={10}
                  placeholder="Write poem stanzas here with line breaks..."
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl p-4 text-stone-100 font-serif-literary text-base leading-relaxed focus:outline-none focus:border-amber-500/60 whitespace-pre-wrap"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-300 uppercase font-mono mb-1">Theme / Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Contemporary / Philosophical"
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 uppercase font-mono mb-1">Publication Date</label>
                  <input
                    type="date"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-300 uppercase font-mono mb-1">Cover Image URL (Optional)</label>
                  <input
                    type="text"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 uppercase font-mono mb-1">Audio Recording URL (Optional)</label>
                  <input
                    type="text"
                    value={audioUrl}
                    onChange={(e) => setAudioUrl(e.target.value)}
                    placeholder="https://.../poem-recitation.mp3"
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
                  <span>Published in Archive</span>
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
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Poem"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
