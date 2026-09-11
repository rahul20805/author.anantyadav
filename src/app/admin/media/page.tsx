"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Newspaper, Loader2, X, ExternalLink } from "lucide-react";
import { useToast } from "@/components/ToastContext";

interface MediaItem {
  id: string;
  title: string;
  publication: string;
  date: string;
  url?: string | null;
  excerpt?: string | null;
  mediaType: string;
  featured: boolean;
  published: boolean;
}

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const { success, error } = useToast();

  const [title, setTitle] = useState("");
  const [publication, setPublication] = useState("");
  const [date, setDate] = useState("");
  const [url, setUrl] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [mediaType, setMediaType] = useState("interview");
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchMedia = async () => {
    try {
      const res = await fetch("/api/admin/media");
      const data = await res.json();
      setMedia(data.media || []);
    } catch (err) {
      console.error(err);
      error("Failed to fetch media");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setTitle("");
    setPublication("");
    setDate(new Date().toISOString().split("T")[0]);
    setUrl("");
    setExcerpt("");
    setMediaType("interview");
    setFeatured(false);
    setPublished(true);
    setIsModalOpen(true);
  };

  const openEditModal = (item: MediaItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setPublication(item.publication);
    setDate(item.date);
    setUrl(item.url || "");
    setExcerpt(item.excerpt || "");
    setMediaType(item.mediaType);
    setFeatured(item.featured);
    setPublished(item.published);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title,
      publication,
      date,
      url,
      excerpt,
      mediaType,
      featured,
      published,
    };

    try {
      const apiUrl = editingItem ? `/api/admin/media/${editingItem.id}` : "/api/admin/media";
      const method = editingItem ? "PUT" : "POST";

      const res = await fetch(apiUrl, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save media entry");

      success(editingItem ? "Media entry updated" : "Media entry published");
      setIsModalOpen(false);
      fetchMedia();
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
      const res = await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      success("Media entry deleted");
      fetchMedia();
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
            Public Relations
          </span>
          <h1 className="font-serif-literary text-3xl font-bold text-stone-100">
            Media &amp; Press Management
          </h1>
        </div>
        <button
          onClick={openAddModal}
          className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md"
        >
          <Plus className="w-4 h-4" /> Add Media Entry
        </button>
      </div>

      {/* Media Table */}
      {loading ? (
        <div className="p-12 text-center text-stone-400">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-amber-400" />
        </div>
      ) : media.length > 0 ? (
        <div className="rounded-2xl border border-stone-800 bg-stone-900/40 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-950/80 text-stone-400 uppercase font-mono border-b border-stone-800">
                <tr>
                  <th className="p-4">Headline / Feature</th>
                  <th className="p-4">Publication</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60 text-stone-200">
                {media.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-900/60 transition-colors">
                    <td className="p-4 font-medium">
                      <span className="font-serif-literary text-sm font-bold text-stone-100 block">
                        {item.title}
                      </span>
                    </td>
                    <td className="p-4 text-stone-300 font-mono">{item.publication}</td>
                    <td className="p-4 uppercase font-mono text-[10px] text-amber-400">{item.mediaType}</td>
                    <td className="p-4 font-mono text-stone-400">{item.date}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-amber-300"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          className="p-1.5 rounded-lg bg-stone-800 hover:bg-rose-950 text-stone-300 hover:text-rose-400"
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
          <Newspaper className="w-8 h-8 text-stone-400 mx-auto mb-2" />
          <p>No media features recorded yet.</p>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-stone-950 border border-stone-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800">
              <h2 className="font-serif-literary text-2xl font-bold text-stone-100">
                {editingItem ? "Edit Media Entry" : "Add Media Entry"}
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
                <label className="block text-stone-300 uppercase font-mono mb-1">Feature Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. The Poetry of Stillness in an Accelerated World"
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-300 uppercase font-mono mb-1">Publication Name *</label>
                  <input
                    type="text"
                    value={publication}
                    onChange={(e) => setPublication(e.target.value)}
                    required
                    placeholder="e.g. Literary Review"
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 uppercase font-mono mb-1">Media Format</label>
                  <select
                    value={mediaType}
                    onChange={(e) => setMediaType(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60"
                  >
                    <option value="interview">Interview</option>
                    <option value="article">Article / Profile</option>
                    <option value="podcast">Podcast</option>
                    <option value="video">Broadcast / Video</option>
                    <option value="press">Press Release</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-300 uppercase font-mono mb-1">Date Published</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 uppercase font-mono mb-1">Feature URL</label>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 uppercase font-mono mb-1">Excerpt / Summary</label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={3}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60"
                />
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
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Entry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
