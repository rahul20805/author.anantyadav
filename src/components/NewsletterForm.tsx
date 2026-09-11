"use client";

import { useState } from "react";
import { useToast } from "./ToastContext";
import { Send, Check, Loader2 } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const { success, error } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      error("Please provide a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to subscribe.");
      }

      setSubscribed(true);
      success("Thank you for subscribing to Anant Yadav's literary dispatch.");
      setEmail("");
      setName("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (subscribed) {
    return (
      <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-6 text-center text-emerald-300">
        <Check className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
        <p className="font-serif-literary text-lg text-emerald-200">You are on the dispatch list.</p>
        <p className="text-xs text-emerald-400/80 mt-1">
          Occasional letters, new poems, and literary musings will arrive directly in your inbox.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-lg mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email address..."
        required
        className="flex-1 bg-stone-900/90 border border-stone-800 focus:border-amber-500/60 rounded-xl px-4 py-3.5 text-stone-200 placeholder-stone-400 text-sm focus:outline-none transition-colors"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-stone-950 font-medium px-6 py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-amber-600/20 shrink-0 font-sans-ui"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            Subscribe
            <Send className="w-3.5 h-3.5" />
          </>
        )}
      </button>
    </form>
  );
}
