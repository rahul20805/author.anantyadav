"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Check, X, Trash2, Star, Loader2 } from "lucide-react";
import { useToast } from "@/components/ToastContext";

interface Review {
  id: string;
  readerName: string;
  readerEmail?: string | null;
  rating: number;
  comment: string;
  isApproved: boolean;
  isFeatured: boolean;
  createdAt: string;
  book?: {
    title: string;
    slug: string;
  } | null;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { success, error } = useToast();

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/admin/reviews");
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (err) {
      console.error(err);
      error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleApprove = async (id: string, isApproved: boolean) => {
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isApproved }),
      });
      if (!res.ok) throw new Error("Update failed");
      success(isApproved ? "Review published" : "Review hidden");
      fetchReviews();
    } catch (err) {
      error("Action failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      const res = await fetch(`/api/admin/reviews?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      success("Review deleted");
      fetchReviews();
    } catch (err) {
      error("Delete failed");
    }
  };

  return (
    <div className="space-y-8 font-sans-ui">
      <div className="border-b border-stone-800 pb-6">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
          Reader Community
        </span>
        <h1 className="font-serif-literary text-3xl font-bold text-stone-100">
          Reviews &amp; Moderation
        </h1>
      </div>

      {loading ? (
        <div className="p-12 text-center text-stone-400">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-amber-400" />
        </div>
      ) : reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className={`p-6 rounded-2xl border flex flex-col justify-between gap-4 ${
                rev.isApproved
                  ? "bg-stone-900/40 border-stone-800"
                  : "bg-amber-950/20 border-amber-500/40"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-stone-200 text-sm block">
                      {rev.readerName}
                    </span>
                    {rev.book && (
                      <span className="text-[11px] font-mono text-stone-400">
                        Book: {rev.book.title}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>

                <blockquote className="font-serif-literary text-sm text-stone-300 italic">
                  &ldquo;{rev.comment}&rdquo;
                </blockquote>
              </div>

              <div className="pt-4 border-t border-stone-800/80 flex items-center justify-between">
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    rev.isApproved
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                      : "bg-amber-500/10 text-amber-300 border border-amber-500/30"
                  }`}
                >
                  {rev.isApproved ? "Approved / Live" : "Pending Moderation"}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleApprove(rev.id, !rev.isApproved)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-colors ${
                      rev.isApproved
                        ? "bg-stone-800 hover:bg-stone-700 text-stone-300"
                        : "bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold"
                    }`}
                  >
                    {rev.isApproved ? "Unpublish" : "Approve"}
                  </button>
                  <button
                    onClick={() => handleDelete(rev.id)}
                    className="p-1.5 rounded-lg bg-stone-800 hover:bg-rose-950 text-stone-300 hover:text-rose-400"
                    title="Delete"
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
          <MessageSquare className="w-8 h-8 text-stone-400 mx-auto mb-2" />
          <p>No reader reviews submitted yet.</p>
        </div>
      )}
    </div>
  );
}
