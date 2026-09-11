"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, BookOpen, ExternalLink, Loader2, Check, X, Star, Sparkles } from "lucide-react";
import { useToast } from "@/components/ToastContext";

interface Book {
  id: string;
  title: string;
  slug: string;
  subtitle?: string | null;
  description: string;
  longDescription?: string | null;
  authorNote?: string | null;
  publisher?: string | null;
  isbn?: string | null;
  genre: string;
  language: string;
  pageCount?: number | null;
  publicationDate?: string | null;
  coverImage?: string | null;
  purchaseLinks: string;
  rating: number;
  featured: boolean;
  published: boolean;
  tags: string;
}

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const { success, error } = useToast();

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [authorNote, setAuthorNote] = useState("");
  const [publisher, setPublisher] = useState("");
  const [isbn, setIsbn] = useState("");
  const [genre, setGenre] = useState("Literary Fiction");
  const [language, setLanguage] = useState("English");
  const [pageCount, setPageCount] = useState<string>("");
  const [publicationDate, setPublicationDate] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [purchaseLinks, setPurchaseLinks] = useState('[{"label":"Amazon","url":"https://amazon.com","isPrimary":true}]');
  const [rating, setRating] = useState("5.0");
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchBooks = async () => {
    try {
      const res = await fetch("/api/admin/books");
      const data = await res.json();
      setBooks(data.books || []);
    } catch (err) {
      console.error(err);
      error("Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const openAddModal = () => {
    setEditingBook(null);
    setTitle("");
    setSlug("");
    setSubtitle("");
    setDescription("");
    setLongDescription("");
    setAuthorNote("");
    setPublisher("");
    setIsbn("");
    setGenre("Literary Fiction");
    setLanguage("English");
    setPageCount("");
    setPublicationDate("");
    setCoverImage("");
    setPurchaseLinks('[{"label":"Amazon","url":"https://amazon.com","isPrimary":true}]');
    setRating("5.0");
    setFeatured(false);
    setPublished(true);
    setIsModalOpen(true);
  };

  const openEditModal = (b: Book) => {
    setEditingBook(b);
    setTitle(b.title);
    setSlug(b.slug);
    setSubtitle(b.subtitle || "");
    setDescription(b.description);
    setLongDescription(b.longDescription || "");
    setAuthorNote(b.authorNote || "");
    setPublisher(b.publisher || "");
    setIsbn(b.isbn || "");
    setGenre(b.genre);
    setLanguage(b.language);
    setPageCount(b.pageCount ? String(b.pageCount) : "");
    setPublicationDate(b.publicationDate || "");
    setCoverImage(b.coverImage || "");
    setPurchaseLinks(b.purchaseLinks);
    setRating(String(b.rating));
    setFeatured(b.featured);
    setPublished(b.published);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title,
      slug,
      subtitle,
      description,
      longDescription,
      authorNote,
      publisher,
      isbn,
      genre,
      language,
      pageCount: pageCount ? parseInt(pageCount) : null,
      publicationDate,
      coverImage,
      purchaseLinks,
      rating: parseFloat(rating) || 0,
      featured,
      published,
    };

    try {
      const url = editingBook ? `/api/admin/books/${editingBook.id}` : "/api/admin/books";
      const method = editingBook ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save book");

      success(editingBook ? "Book updated successfully" : "Book created successfully");
      setIsModalOpen(false);
      fetchBooks();
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
      const res = await fetch(`/api/admin/books/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      success("Book deleted");
      fetchBooks();
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
            Publishing System
          </span>
          <h1 className="font-serif-literary text-3xl font-bold text-stone-100">
            Books Management
          </h1>
        </div>
        <button
          onClick={openAddModal}
          className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md"
        >
          <Plus className="w-4 h-4" /> Add New Book
        </button>
      </div>

      {/* Books Table */}
      {loading ? (
        <div className="p-12 text-center text-stone-400">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-amber-400" />
        </div>
      ) : books.length > 0 ? (
        <div className="rounded-2xl border border-stone-800 bg-stone-900/40 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-950/80 text-stone-400 uppercase font-mono border-b border-stone-800">
                <tr>
                  <th className="p-4">Book Title</th>
                  <th className="p-4">Genre</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Featured</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60 text-stone-200">
                {books.map((b) => (
                  <tr key={b.id} className="hover:bg-stone-900/60 transition-colors">
                    <td className="p-4 font-medium">
                      <span className="font-serif-literary text-sm font-bold text-stone-100 block">
                        {b.title}
                      </span>
                      <span className="text-[11px] font-mono text-stone-400">/books/{b.slug}</span>
                    </td>
                    <td className="p-4 text-stone-300 font-mono">{b.genre}</td>
                    <td className="p-4">
                      <span className="flex items-center gap-1 font-mono font-bold text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400" /> {b.rating}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full font-mono text-[10px] ${
                          b.published
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : "bg-stone-800 text-stone-400"
                        }`}
                      >
                        {b.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="p-4 font-mono">
                      {b.featured ? (
                        <span className="text-amber-400 font-bold">★ Yes</span>
                      ) : (
                        <span className="text-stone-400">No</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(b)}
                          className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-amber-300 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(b.id, b.title)}
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
          <BookOpen className="w-8 h-8 text-stone-400 mx-auto mb-2" />
          <p>No books created yet. Click &ldquo;Add New Book&rdquo; above.</p>
        </div>
      )}

      {/* Add / Edit Modal Drawer */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-stone-950 border border-stone-800 rounded-3xl p-6 sm:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800">
              <h2 className="font-serif-literary text-2xl font-bold text-stone-100">
                {editingBook ? "Edit Book" : "Add New Book"}
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
                  <label className="block text-stone-300 uppercase font-mono mb-1">Book Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="e.g. Echoes of the Unspoken"
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 uppercase font-mono mb-1">URL Slug (Auto or custom)</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="echoes-of-the-unspoken"
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 uppercase font-mono mb-1">Subtitle</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. A Collection of Poems on Silence"
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div>
                <label className="block text-stone-300 uppercase font-mono mb-1">Short Description *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={3}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div>
                <label className="block text-stone-300 uppercase font-mono mb-1">Long Description / Synopsis</label>
                <textarea
                  value={longDescription}
                  onChange={(e) => setLongDescription(e.target.value)}
                  rows={4}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div>
                <label className="block text-stone-300 uppercase font-mono mb-1">Author&apos;s Note</label>
                <textarea
                  value={authorNote}
                  onChange={(e) => setAuthorNote(e.target.value)}
                  rows={2}
                  placeholder="Personal reflection or background on composing the book"
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-stone-300 uppercase font-mono mb-1">Genre</label>
                  <input
                    type="text"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    placeholder="Poetry / Philosophy"
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 uppercase font-mono mb-1">Language</label>
                  <input
                    type="text"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    placeholder="English"
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 uppercase font-mono mb-1">Page Count</label>
                  <input
                    type="number"
                    value={pageCount}
                    onChange={(e) => setPageCount(e.target.value)}
                    placeholder="168"
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-stone-300 uppercase font-mono mb-1">Publisher</label>
                  <input
                    type="text"
                    value={publisher}
                    onChange={(e) => setPublisher(e.target.value)}
                    placeholder="Publisher Name"
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 uppercase font-mono mb-1">ISBN</label>
                  <input
                    type="text"
                    value={isbn}
                    onChange={(e) => setIsbn(e.target.value)}
                    placeholder="978-..."
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 uppercase font-mono mb-1">Release Date</label>
                  <input
                    type="date"
                    value={publicationDate}
                    onChange={(e) => setPublicationDate(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 uppercase font-mono mb-1">Cover Image URL</label>
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div>
                <label className="block text-stone-300 uppercase font-mono mb-1">Purchase Links (JSON Array)</label>
                <input
                  type="text"
                  value={purchaseLinks}
                  onChange={(e) => setPurchaseLinks(e.target.value)}
                  placeholder='[{"label":"Amazon","url":"https://...","isPrimary":true}]'
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60 font-mono"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-stone-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-0"
                  />
                  <span>Published on Website</span>
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
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Book"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
