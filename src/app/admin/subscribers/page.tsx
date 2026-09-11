"use client";

import { useState, useEffect } from "react";
import { Users, Trash2, Download, Loader2 } from "lucide-react";
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

  return (
    <div className="space-y-8 font-sans-ui">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
            Reader Dispatch
          </span>
          <h1 className="font-serif-literary text-3xl font-bold text-stone-100">
            Newsletter Subscribers
          </h1>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={subscribers.length === 0}
          className="bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-200 font-semibold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all disabled:opacity-50"
        >
          <Download className="w-4 h-4 text-amber-400" /> Export CSV
        </button>
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
    </div>
  );
}
