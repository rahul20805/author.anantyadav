"use client";

import { useState } from "react";
import { Star, Send, Loader2, Check } from "lucide-react";
import { useToast } from "@/components/ToastContext";

export function BookReviewForm({ bookId }: { bookId: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { success, error } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      error("Please fill in both your name and your review.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, readerName: name, readerEmail: email, rating, comment }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit review.");
      }

      setSubmitted(true);
      success("Review submitted! It will appear once approved by the author.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-center space-y-2">
        <Check className="w-8 h-8 text-emerald-400 mx-auto" />
        <p className="font-serif-literary text-lg">Thank you for your reflections.</p>
        <p className="text-xs text-emerald-400/80">
          Your review has been safely recorded and sent for moderation.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-sans-ui text-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono text-stone-300 uppercase mb-1.5">
            Your Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g. Maya Roy"
            className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-stone-200 placeholder-stone-400 focus:outline-none focus:border-amber-500/60"
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-stone-300 uppercase mb-1.5">
            Email (Optional &amp; Private)
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@domain.com"
            className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-stone-200 placeholder-stone-400 focus:outline-none focus:border-amber-500/60"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-mono text-stone-300 uppercase mb-1.5">
          Rating
        </label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => setRating(star)}
              className="p-1 hover:scale-110 transition-transform"
              aria-label={`${star} star`}
            >
              <Star
                className={`w-6 h-6 ${
                  star <= rating ? "fill-amber-400 text-amber-400" : "text-stone-700"
                }`}
              />
            </button>
          ))}
          <span className="text-xs text-stone-400 font-mono ml-2">{rating} of 5 stars</span>
        </div>
      </div>

      <div>
        <label className="block text-xs font-mono text-stone-300 uppercase mb-1.5">
          Your Review / Response *
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          rows={4}
          placeholder="Share your thoughts on the themes, poems, or prose..."
          className="w-full bg-stone-950 border border-stone-800 rounded-xl p-4 text-stone-200 placeholder-stone-400 focus:outline-none focus:border-amber-500/60"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-stone-950 font-semibold px-6 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            Submit Review <Send className="w-3.5 h-3.5" />
          </>
        )}
      </button>
    </form>
  );
}
