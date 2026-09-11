"use client";

import { useState, useEffect } from "react";
import { Mail, Trash2, CheckCircle2, Loader2, MessageSquare } from "lucide-react";
import { useToast } from "@/components/ToastContext";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  category: string;
  isRead: boolean;
  isReplied: boolean;
  notes?: string | null;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { success, error } = useToast();

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/admin/messages");
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (err) {
      console.error(err);
      error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const toggleRead = async (id: string, isRead: boolean) => {
    try {
      const res = await fetch("/api/admin/messages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isRead }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      success(isRead ? "Marked as read" : "Marked as unread");
      fetchMessages();
    } catch (err) {
      error("Action failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      const res = await fetch(`/api/admin/messages?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      success("Message deleted");
      fetchMessages();
    } catch (err) {
      error("Delete failed");
    }
  };

  return (
    <div className="space-y-8 font-sans-ui">
      <div className="border-b border-stone-800 pb-6">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
          Inquiries &amp; Letters
        </span>
        <h1 className="font-serif-literary text-3xl font-bold text-stone-100">
          Contact Message Inbox
        </h1>
      </div>

      {loading ? (
        <div className="p-12 text-center text-stone-400">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-amber-400" />
        </div>
      ) : messages.length > 0 ? (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-6 rounded-2xl border transition-all ${
                !msg.isRead
                  ? "bg-stone-900/90 border-amber-500/40 shadow-xl"
                  : "bg-stone-950/40 border-stone-800 text-stone-300"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-800/80">
                <div>
                  <span className="font-bold text-stone-100 text-base">{msg.name}</span>
                  <span className="text-stone-400 text-xs font-mono ml-2">&lt;{msg.email}&gt;</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 uppercase">
                    {msg.category}
                  </span>
                  <span className="text-xs text-stone-400 font-mono">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="py-4 space-y-2">
                <h3 className="font-serif-literary text-lg font-bold text-stone-200">
                  {msg.subject}
                </h3>
                <p className="text-sm text-stone-300 whitespace-pre-line leading-relaxed">
                  {msg.message}
                </p>
              </div>

              <div className="pt-4 border-t border-stone-800/80 flex items-center justify-between">
                <button
                  onClick={() => toggleRead(msg.id, !msg.isRead)}
                  className={`text-xs font-mono px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                    msg.isRead
                      ? "bg-stone-800 hover:bg-stone-700 text-stone-300"
                      : "bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {msg.isRead ? "Mark as Unread" : "Mark as Read"}
                </button>

                <div className="flex items-center gap-3">
                  <a
                    href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                    className="text-xs font-mono text-amber-400 hover:text-amber-300"
                  >
                    Reply via Email &rarr;
                  </a>
                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="p-1.5 rounded-lg bg-stone-800 hover:bg-rose-950 text-stone-400 hover:text-rose-400"
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
          <Mail className="w-8 h-8 text-stone-400 mx-auto mb-2" />
          <p>No messages in inbox.</p>
        </div>
      )}
    </div>
  );
}
