"use client";

import { useState, useEffect } from "react";
import { Users, Trash2, Download, Loader2, Send, Mail, X } from "lucide-react";
import { useToast } from "@/components/ToastContext";

interface Subscriber {
  id: string;
  email: string;
  name?: string | null;
  status: string;
  createdAt: string;
}

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [testName, setTestName] = useState("");
  const [isSendingTest, setIsSendingTest] = useState(false);
  const { success, error } = useToast();

  const fetchSubscribers = async () => {
    try {
      const res = await fetch("/api/admin/subscribers");
      const data = await res.json();
      setSubscribers(data.subscribers || []);
    } catch (err) {
      console.error(err);
      error("Failed to load subscribers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this subscriber?")) return;
    try {
      const res = await fetch(`/api/admin/subscribers?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      success("Subscriber removed");
      fetchSubscribers();
    } catch (err) {
      error("Delete failed");
    }
  };

  const handleExportCSV = () => {
    if (subscribers.length === 0) return;
    const header = "Email,Name,Status,SubscribedDate\n";
    const rows = subscribers
      .map((s) => `"${s.email}","${s.name || ""}","${s.status}","${s.createdAt}"`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `anant-yadav-subscribers-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    success("Subscribers exported to CSV");
  };

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail || !testEmail.includes("@")) {
      error("Please enter a valid email address");
      return;
    }

    setIsSendingTest(true);
    try {
      const res = await fetch("/api/admin/newsletter/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: testEmail, name: testName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to dispatch test email");

      success(`Test email dispatched via ${data.provider}!`);
      setIsTestModalOpen(false);
      setTestEmail("");
      setTestName("");
    } catch (err: any) {
      error(err.message || "Could not dispatch test email");
    } finally {
      setIsSendingTest(false);
    }
  };

  return (
    <div className="space-y-8 font-sans-ui">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
            Reader Dispatch &amp; Brevo Automation
          </span>
          <h1 className="font-serif-literary text-3xl font-bold text-stone-100">
            Newsletter Subscribers
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsTestModalOpen(true)}
            className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md"
          >
            <Send className="w-4 h-4" /> Test Brevo Email
          </button>
          <button
            onClick={handleExportCSV}
            disabled={subscribers.length === 0}
            className="bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-200 font-semibold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-amber-400" /> Export CSV
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-stone-400">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-amber-400" />
        </div>
      ) : subscribers.length > 0 ? (
        <div className="rounded-2xl border border-stone-800 bg-stone-900/40 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-950/80 text-stone-400 uppercase font-mono border-b border-stone-800">
                <tr>
                  <th className="p-4">Subscriber Email</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date Joined</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60 text-stone-200 font-mono">
                {subscribers.map((s) => (
                  <tr key={s.id} className="hover:bg-stone-900/60 transition-colors">
                    <td className="p-4 font-medium text-stone-100">{s.email}</td>
                    <td className="p-4 text-stone-400">{s.name || "—"}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {s.status}
                      </span>
                    </td>
                    <td className="p-4 text-stone-400">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="p-1.5 rounded-lg bg-stone-800 hover:bg-rose-950 text-stone-300 hover:text-rose-400"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-stone-900/30 border border-stone-800 text-stone-400">
          <Users className="w-8 h-8 text-stone-400 mx-auto mb-2" />
          <p>No newsletter subscribers yet.</p>
        </div>
      )}

      {/* Test Brevo Email Modal */}
      {isTestModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
        >
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <div className="flex items-center gap-2 text-stone-100 font-serif-literary text-xl font-bold">
                <Mail className="w-5 h-5 text-amber-400" />
                <span>Test Brevo Email</span>
              </div>
              <button
                onClick={() => setIsTestModalOpen(false)}
                className="text-stone-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              Send the full, production-grade <strong>The Solitude Dispatch</strong> welcome email to your own address to preview how it looks in Gmail, Apple Mail, and Outlook.
            </p>

            <form onSubmit={handleSendTestEmail} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-stone-400 mb-1.5">
                  Recipient Name (Optional)
                </label>
                <input
                  type="text"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  placeholder="Anant Yadav"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-stone-400 mb-1.5">
                  Target Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="your-email@gmail.com"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsTestModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-stone-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSendingTest}
                  className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold px-5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {isSendingTest ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" /> Dispatch Test Email
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
