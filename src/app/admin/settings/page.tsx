"use client";

import { useState, useEffect } from "react";
import { Settings, Loader2, Save, KeyRound, Globe, Shield } from "lucide-react";
import { useToast } from "@/components/ToastContext";

export default function AdminSettingsPage() {
  const [siteTitle, setSiteTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [authorName, setAuthorName] = useState("Anant Yadav");
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState("");
  const [googleSearchConsoleToken, setGoogleSearchConsoleToken] = useState("");
  const [announcementText, setAnnouncementText] = useState("");
  const [announcementUrl, setAnnouncementUrl] = useState("");
  const [announcementActive, setAnnouncementActive] = useState(false);
  const [footerAbout, setFooterAbout] = useState("");
  const [copyrightText, setCopyrightText] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { success, error } = useToast();

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          const s = data.settings;
          setSiteTitle(s.siteTitle || "");
          setTagline(s.tagline || "");
          setMetaDescription(s.metaDescription || "");
          setKeywords(s.keywords || "");
          setAuthorName(s.authorName || "Anant Yadav");
          setGoogleAnalyticsId(s.googleAnalyticsId || "");
          setGoogleSearchConsoleToken(s.googleSearchConsoleToken || "");
          setAnnouncementText(s.announcementText || "");
          setAnnouncementUrl(s.announcementUrl || "");
          setAnnouncementActive(s.announcementActive || false);
          setFooterAbout(s.footerAbout || "");
          setCopyrightText(s.copyrightText || "");
        }
      })
      .catch(() => error("Failed to load settings"))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteTitle,
          tagline,
          metaDescription,
          keywords,
          authorName,
          googleAnalyticsId,
          googleSearchConsoleToken,
          announcementText,
          announcementUrl,
          announcementActive,
          footerAbout,
          copyrightText,
          newPassword: newPassword.trim() || undefined,
        }),
      });

      if (!res.ok) throw new Error("Update failed");
      success("Settings saved successfully!");
      setNewPassword("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving";
      error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-stone-400">
        <Loader2 className="w-6 h-6 animate-spin mx-auto text-amber-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans-ui max-w-4xl">
      <div className="border-b border-stone-800 pb-6">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
          Global Configurations
        </span>
        <h1 className="font-serif-literary text-3xl font-bold text-stone-100">
          Site Settings &amp; SEO
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 text-xs">
        {/* SEO & Meta Defaults */}
        <div className="p-8 rounded-3xl bg-stone-900/40 border border-stone-800 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400 pb-2 border-b border-stone-800">
            <Globe className="w-4 h-4" /> Search Engine Optimization &amp; Metadata
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-300 uppercase font-mono mb-1">Global Site Title *</label>
              <input
                type="text"
                value={siteTitle}
                onChange={(e) => setSiteTitle(e.target.value)}
                required
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60"
              />
            </div>
            <div>
              <label className="block text-stone-300 uppercase font-mono mb-1">Author Brand Name</label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-300 uppercase font-mono mb-1">Site Tagline</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60"
            />
          </div>

          <div>
            <label className="block text-stone-300 uppercase font-mono mb-1">Default Meta Description</label>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              rows={3}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60"
            />
          </div>

          <div>
            <label className="block text-stone-300 uppercase font-mono mb-1">SEO Keywords (Comma-separated)</label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-300 uppercase font-mono mb-1">Google Analytics ID (e.g. G-XXXXX)</label>
              <input
                type="text"
                value={googleAnalyticsId}
                onChange={(e) => setGoogleAnalyticsId(e.target.value)}
                placeholder="G-..."
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60"
              />
            </div>
            <div>
              <label className="block text-stone-300 uppercase font-mono mb-1">Google Search Console Verification Token</label>
              <input
                type="text"
                value={googleSearchConsoleToken}
                onChange={(e) => setGoogleSearchConsoleToken(e.target.value)}
                placeholder="google-site-verification token..."
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60"
              />
            </div>
          </div>
        </div>

        {/* Footer & Announcement Settings */}
        <div className="p-8 rounded-3xl bg-stone-900/40 border border-stone-800 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400 pb-2 border-b border-stone-800">
            <Settings className="w-4 h-4" /> Footer &amp; Announcement Banner
          </div>

          <div>
            <label className="block text-stone-300 uppercase font-mono mb-1">Footer About Text</label>
            <textarea
              value={footerAbout}
              onChange={(e) => setFooterAbout(e.target.value)}
              rows={2}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60"
            />
          </div>

          <div>
            <label className="block text-stone-300 uppercase font-mono mb-1">Copyright Line</label>
            <input
              type="text"
              value={copyrightText}
              onChange={(e) => setCopyrightText(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60"
            />
          </div>
        </div>

        {/* Security & Password */}
        <div className="p-8 rounded-3xl bg-stone-900/40 border border-stone-800 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400 pb-2 border-b border-stone-800">
            <KeyRound className="w-4 h-4" /> Admin Security &amp; Password
          </div>

          <div>
            <label className="block text-stone-300 uppercase font-mono mb-1">Change Admin Password (Leave blank to keep unchanged)</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password (minimum 8 characters)"
              className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-stone-950 font-semibold px-8 py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Save Settings</>}
        </button>
      </form>
    </div>
  );
}
