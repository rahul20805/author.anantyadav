"use client";

import { useState } from "react";
import { Send, Loader2, Check } from "lucide-react";
import { useToast } from "@/components/ToastContext";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("general");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState(""); // Bot spam trap
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { success, error } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) {
      // Silent discard for bots
      setSubmitted(true);
      return;
    }

    if (!name || !email || !message) {
      error("Please complete all required fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, category, subject, message }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to transmit message.");
      }

      setSubmitted(true);
      success("Your message has been sent successfully.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-10 rounded-3xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-center space-y-3">
        <Check className="w-10 h-10 text-emerald-400 mx-auto" />
        <h3 className="font-serif-literary text-2xl text-emerald-200">Message Delivered</h3>
        <p className="text-xs text-emerald-400/90 max-w-md mx-auto leading-relaxed">
          Thank you for reaching out. Your inquiry has been dispatched to the author&apos;s literary inbox.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 font-sans-ui text-sm">
      {/* Honeypot hidden input */}
      <input
        type="text"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-mono text-stone-300 uppercase mb-2">
            Your Full Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g. Maya Roy"
            className="w-full bg-stone-900/90 border border-stone-800 rounded-xl px-4 py-3 text-stone-200 placeholder-stone-400 focus:outline-none focus:border-amber-500/60"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-stone-300 uppercase mb-2">
            Your Email Address *
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="name@domain.com"
            className="w-full bg-stone-900/90 border border-stone-800 rounded-xl px-4 py-3 text-stone-200 placeholder-stone-400 focus:outline-none focus:border-amber-500/60"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-mono text-stone-300 uppercase mb-2">
            Inquiry Nature
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-stone-900/90 border border-stone-800 rounded-xl px-4 py-3 text-stone-200 focus:outline-none focus:border-amber-500/60"
          >
            <option value="general">General Reader Query</option>
            <option value="press">Press &amp; Media Interview</option>
            <option value="speaking">Speaking &amp; Readings</option>
            <option value="rights">Literary Rights &amp; Translation</option>
            <option value="reader">Personal Reflection on a Poem/Book</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono text-stone-300 uppercase mb-2">
            Subject
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject of your message..."
            className="w-full bg-stone-900/90 border border-stone-800 rounded-xl px-4 py-3 text-stone-200 placeholder-stone-400 focus:outline-none focus:border-amber-500/60"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-mono text-stone-300 uppercase mb-2">
          Message *
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={6}
          placeholder="Write your note here..."
          className="w-full bg-stone-900/90 border border-stone-800 rounded-xl p-4 text-stone-200 placeholder-stone-400 focus:outline-none focus:border-amber-500/60"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-stone-950 font-semibold px-7 py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-amber-600/20 w-full sm:w-auto"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            Send Message <Send className="w-3.5 h-3.5" />
          </>
        )}
      </button>
    </form>
  );
}
