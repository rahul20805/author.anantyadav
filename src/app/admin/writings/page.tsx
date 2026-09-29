"use client";

import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  FileText,
  Loader2,
  X,
  Sparkles,
  Clock,
  Eye,
  Upload,
  Download,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  FileCheck,
} from "lucide-react";
import { useToast } from "@/components/ToastContext";
import { formatFileSize } from "@/lib/utils";

interface Writing {
  id: string;
  title: string;
  slug: string;
  subtitle?: string | null;
  content: string;
  excerpt?: string | null;
  category: string;
  author: string;
  tags: string;
  coverImage?: string | null;
  pdfUrl?: string | null;
  pdfFilename?: string | null;
  pdfSize?: number | null;
  readingTime: number;
  featured: boolean;
  published: boolean;
  publishDate?: string | null;
}

export default function AdminWritingsPage() {
  const [writings, setWritings] = useState<Writing[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWriting, setEditingWriting] = useState<Writing | null>(null);
  const { success, error } = useToast();

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("Article");
  const [author, setAuthor] = useState("Anant Yadav");
  const [tags, setTags] = useState('["philosophy", "solitude"]');
  const [coverImage, setCoverImage] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(true);
  const [saving, setSaving] = useState(false);

  // PDF states
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfFilename, setPdfFilename] = useState<string | null>(null);
  const [pdfSize, setPdfSize] = useState<number | null>(null);
  const [pdfUploading, setPdfUploading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchWritings = async () => {
    try {
      const res = await fetch("/api/admin/writings");
      const data = await res.json();
      setWritings(data.writings || []);
    } catch (err) {
      console.error(err);
      error("Failed to fetch writings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWritings();
  }, []);

  const openAddModal = () => {
    setEditingWriting(null);
    setTitle("");
    setSlug("");
    setSubtitle("");
    setContent("");
    setExcerpt("");
    setCategory("Article");
    setAuthor("Anant Yadav");
    setTags('["philosophy", "essay"]');
    setCoverImage("");
    setPublishDate(new Date().toISOString().split("T")[0]);
    setFeatured(false);
    setPublished(true);
    setPdfUrl(null);
    setPdfFilename(null);
    setPdfSize(null);
    setPdfError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (w: Writing) => {
    setEditingWriting(w);
    setTitle(w.title);
    setSlug(w.slug);
    setSubtitle(w.subtitle || "");
    setContent(w.content || "");
    setExcerpt(w.excerpt || "");
    setCategory(w.category || "Article");
    setAuthor(w.author || "Anant Yadav");
    setTags(w.tags || "[]");
    setCoverImage(w.coverImage || "");
    setPublishDate(w.publishDate || "");
    setFeatured(w.featured);
    setPublished(w.published);
    setPdfUrl(w.pdfUrl || null);
    setPdfFilename(w.pdfFilename || null);
    setPdfSize(w.pdfSize || null);
    setPdfError(null);
    setIsModalOpen(true);
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setPdfError("Only .pdf files are accepted. Please select a valid PDF document.");
      error("Invalid file type: .pdf only");
      return;
    }

    setPdfUploading(true);
    setPdfError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/writings/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload PDF");
      }

      setPdfUrl(data.url);
      setPdfFilename(data.originalName || file.name);
      setPdfSize(data.size);
      success("PDF uploaded successfully!");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to upload PDF";
      setPdfError(msg);
      error(msg);
    } finally {
      setPdfUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemovePdf = async () => {
    if (!confirm("Are you sure you want to remove this PDF attachment?")) return;
    setPdfUrl(null);
    setPdfFilename(null);
    setPdfSize(null);
    setPdfError(null);
    success("PDF removed from writing draft.");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      error("Please provide an essay title.");
      return;
    }

    setSaving(true);

    const payload = {
      title,
      slug,
      subtitle,
      content,
      excerpt,
      category,
      author,
      tags,
      coverImage,
      publishDate,
      featured,
      published,
      pdfUrl,
      pdfFilename,
      pdfSize,
    };

    try {
      const url = editingWriting ? `/api/admin/writings/${editingWriting.id}` : "/api/admin/writings";
      const method = editingWriting ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save writing");

      success(editingWriting ? "Writing updated successfully" : "Writing published successfully");
      setIsModalOpen(false);
      fetchWritings();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving writing";
      error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This will also remove any attached PDF.`))
      return;
    try {
      const res = await fetch(`/api/admin/writings/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      success("Writing and attached PDF deleted successfully");
      fetchWritings();
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
            Prose, Essays &amp; PDF Library
          </span>
          <h1 className="font-serif-literary text-3xl font-bold text-stone-100">
            Writings &amp; Essays Management
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Manage literary writings, essays, articles, and attached downloadable PDF documents.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create New Writing
        </button>
      </div>

      {/* Writings Table */}
      {loading ? (
        <div className="p-12 text-center text-stone-400">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-amber-400" />
        </div>
      ) : writings.length > 0 ? (
        <div className="rounded-2xl border border-stone-800 bg-stone-900/40 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-950/80 text-stone-400 uppercase font-mono border-b border-stone-800">
                <tr>
                  <th className="p-4">Title &amp; Author</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">PDF Document</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Featured</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60 text-stone-200">
                {writings.map((w) => (
                  <tr key={w.id} className="hover:bg-stone-900/60 transition-colors">
                    <td className="p-4 font-medium max-w-xs">
                      <span className="font-serif-literary text-sm font-bold text-stone-100 block">
                        {w.title}
                      </span>
                      <div className="text-[11px] font-mono text-stone-400 flex items-center gap-2 mt-0.5">
                        <span>By {w.author || "Anant Yadav"}</span>
                        <span>•</span>
                        <span>/writings/{w.slug}</span>
                      </div>
                    </td>
                    <td className="p-4 text-stone-300 font-mono">{w.category}</td>
                    <td className="p-4 font-mono">
                      {w.pdfUrl ? (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">
                            <FileText className="w-3 h-3" /> PDF
                          </span>
                          <span className="text-stone-300 text-[11px] truncate max-w-[140px]" title={w.pdfFilename || "document.pdf"}>
                            {w.pdfFilename || "document.pdf"}
                          </span>
                          <span className="text-stone-400 text-[10px]">
                            ({formatFileSize(w.pdfSize)})
                          </span>
                          <a
                            href={w.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-stone-400 hover:text-amber-300"
                            title="Open PDF"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      ) : (
                        <span className="text-stone-400 italic">No PDF</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-semibold uppercase tracking-wider ${
                          w.published
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {w.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="p-4 font-mono">
                      {w.featured ? (
                        <span className="text-amber-400 font-bold">★ Yes</span>
                      ) : (
                        <span className="text-stone-400">No</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/writings/${w.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-amber-300 transition-colors"
                          title="Preview Public Page"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => openEditModal(w)}
                          className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-amber-300 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(w.id, w.title)}
                          className="p-1.5 rounded-lg bg-stone-800 hover:bg-rose-950 text-stone-300 hover:text-rose-400 transition-colors cursor-pointer"
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
          <FileText className="w-8 h-8 text-stone-400 mx-auto mb-2" />
          <p>No writings created yet. Click &ldquo;Create New Writing&rdquo; above.</p>
        </div>
      )}

      {/* Compose / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-stone-950 border border-stone-800 rounded-3xl p-6 sm:p-8 max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <FileText className="w-4 h-4" />
                </span>
                <div>
                  <h2 className="font-serif-literary text-2xl font-bold text-stone-100">
                    {editingWriting ? "Edit Writing & Essay" : "Create New Writing & Essay"}
                  </h2>
                  <p className="text-[11px] font-mono text-stone-400">
                    {editingWriting ? `ID: ${editingWriting.id}` : "Draft a new article or upload a PDF"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-100 cursor-pointer rounded-lg hover:bg-stone-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5 text-xs font-sans-ui">
              {/* Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-300 uppercase font-mono mb-1">Essay Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="e.g. Don't Make Women Goddesses, Treat Them Like Humans"
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60 font-serif-literary text-sm"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 uppercase font-mono mb-1">
                    URL Slug <span className="text-stone-400 lowercase">(auto-generated if empty)</span>
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="dont-make-women-goddesses-treat-them-like-humans"
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60 font-mono"
                  />
                </div>
              </div>

              {/* Subtitle / Hook */}
              <div>
                <label className="block text-stone-300 uppercase font-mono mb-1">Subtitle / Subheading</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. Calling a woman Devi costs nothing. Giving her the rights a man already has costs a great deal more."
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60"
                />
              </div>

              {/* Short Excerpt */}
              <div>
                <label className="block text-stone-300 uppercase font-mono mb-1">
                  Short Description / Excerpt <span className="text-stone-400 lowercase">(Card &amp; SEO summary)</span>
                </label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={2}
                  placeholder="Summary shown on the cards and in search results..."
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60 leading-relaxed"
                />
              </div>

              {/* Category, Author, Publication Date */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-stone-300 uppercase font-mono mb-1">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Article / Essay / Philosophy"
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 uppercase font-mono mb-1">Author</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Anant Yadav"
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

              {/* PDF UPLOAD SECTION */}
              <div className="rounded-2xl bg-stone-900/60 border border-stone-800 p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-400" />
                    <span className="font-mono text-xs uppercase tracking-widest text-stone-200 font-bold">
                      PDF Document Attachment
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-stone-400">
                    Accepted: .pdf only (Max 25MB)
                  </span>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".pdf,application/pdf"
                  onChange={handlePdfUpload}
                  className="hidden"
                />

                {pdfError && (
                  <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{pdfError}</span>
                  </div>
                )}

                {pdfUrl ? (
                  /* Current PDF State */
                  <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                        <FileCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-medium text-stone-100 flex items-center gap-2">
                          <span className="truncate max-w-xs">{pdfFilename || "document.pdf"}</span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-semibold">
                            Uploaded
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-stone-400 mt-0.5">
                          Size: {formatFileSize(pdfSize)} • Ready for online reader &amp; download
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-mono flex items-center gap-1.5 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </a>
                      <a
                        href={pdfUrl}
                        download={pdfFilename || "essay.pdf"}
                        className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-mono flex items-center gap-1.5 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" /> Download
                      </a>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={pdfUploading}
                        className="px-3 py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${pdfUploading ? "animate-spin" : ""}`} /> Replace
                      </button>
                      <button
                        type="button"
                        onClick={handleRemovePdf}
                        className="px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-950/80 text-rose-300 border border-rose-800/40 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Empty PDF Upload Dropzone */
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-stone-800 hover:border-amber-500/40 rounded-2xl p-6 text-center cursor-pointer transition-all hover:bg-stone-900/40 flex flex-col items-center justify-center gap-2 group"
                  >
                    {pdfUploading ? (
                      <div className="py-4 space-y-2">
                        <Loader2 className="w-7 h-7 text-amber-400 animate-spin mx-auto" />
                        <p className="text-stone-300 font-mono text-xs">Uploading and validating PDF document...</p>
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-2xl bg-stone-800 group-hover:bg-amber-500/10 group-hover:text-amber-400 flex items-center justify-center text-stone-400 transition-colors">
                          <Upload className="w-6 h-6" />
                        </div>
                        <p className="text-stone-200 font-medium text-xs">
                          Click or drag and drop to upload PDF
                        </p>
                        <p className="text-[11px] font-mono text-stone-400">
                          Supports .pdf documents up to 25MB
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Essay Prose Content (Markdown) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-stone-300 uppercase font-mono">
                    Article Text / Prose <span className="text-stone-400 lowercase">(Optional if PDF is attached)</span>
                  </label>
                  <span className="text-[11px] font-mono text-stone-400">
                    Markdown supported (## Headings, &gt; Blockquotes, * Lists)
                  </span>
                </div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={8}
                  placeholder="Paste or write the essay text here. Readers will be able to read this directly or browse the PDF document..."
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl p-4 text-stone-100 font-serif-literary text-sm leading-relaxed focus:outline-none focus:border-amber-500/60"
                />
              </div>

              {/* Cover Image URL */}
              <div>
                <label className="block text-stone-300 uppercase font-mono mb-1">Cover Image URL (Optional)</label>
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60"
                />
              </div>

              {/* Publishing & Feature toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-stone-800/80">
                <label className="flex items-center gap-2 text-stone-200 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-0 w-4 h-4 bg-stone-900 border-stone-800"
                  />
                  <span className="font-mono text-xs">
                    Status: <strong className={published ? "text-emerald-400" : "text-amber-400"}>{published ? "PUBLISHED" : "DRAFT"}</strong> (Publicly visible)
                  </span>
                </label>
                <label className="flex items-center gap-2 text-stone-200 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-0 w-4 h-4 bg-stone-900 border-stone-800"
                  />
                  <span className="font-mono text-xs">Feature on Homepage</span>
                </label>
              </div>

              {/* Action buttons */}
              <div className="pt-6 border-t border-stone-800 flex items-center justify-between">
                <div>
                  {slug && (
                    <a
                      href={`/writings/${slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-400 hover:text-amber-300"
                    >
                      <Eye className="w-3.5 h-3.5" /> Preview Public Page
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-stone-800 hover:bg-stone-900 text-stone-300 text-xs uppercase tracking-wider cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving || pdfUploading}
                    className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-stone-950 font-semibold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md cursor-pointer"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Essay"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
