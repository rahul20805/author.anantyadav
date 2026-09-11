"use client";

import { useState, useEffect } from "react";
import { User, Loader2, Save } from "lucide-react";
import { useToast } from "@/components/ToastContext";

export default function AdminProfilePage() {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [taglines, setTaglines] = useState("");
  const [shortBio, setShortBio] = useState("");
  const [fullBio, setFullBio] = useState("");
  const [statement, setStatement] = useState("");
  const [philosophy, setPhilosophy] = useState("");
  const [education, setEducation] = useState("");
  const [publications, setPublications] = useState("");
  const [achievements, setAchievements] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [socialLinks, setSocialLinks] = useState("{}");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { success, error } = useToast();

  useEffect(() => {
    fetch("/api/admin/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.profile) {
          const p = data.profile;
          setName(p.name || "Anant Yadav");
          setTitle(p.title || "");
          setTaglines(p.taglines || "");
          setShortBio(p.shortBio || "");
          setFullBio(p.fullBio || "");
          setStatement(p.statement || "");
          setPhilosophy(p.philosophy || "");
          setEducation(p.education || "");
          setPublications(p.publications || "");
          setAchievements(p.achievements || "");
          setEmail(p.email || "");
          setLocation(p.location || "");
          setProfileImage(p.profileImage || "");
          setSocialLinks(p.socialLinks || "{}");
        }
      })
      .catch(() => error("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          title,
          taglines,
          shortBio,
          fullBio,
          statement,
          philosophy,
          education,
          publications,
          achievements,
          email,
          location,
          profileImage,
          socialLinks,
        }),
      });

      if (!res.ok) throw new Error("Update failed");
      success("Author profile updated successfully!");
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
          Identity &amp; Biography
        </span>
        <h1 className="font-serif-literary text-3xl font-bold text-stone-100">
          Author Profile Management
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        <div className="p-8 rounded-3xl bg-stone-900/40 border border-stone-800 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-300 uppercase font-mono mb-1">Author Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60"
              />
            </div>
            <div>
              <label className="block text-stone-300 uppercase font-mono mb-1">Professional Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Author • Poet • Writer • Thinker"
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-300 uppercase font-mono mb-1">Hero Tagline / Punchline</label>
            <input
              type="text"
              value={taglines}
              onChange={(e) => setTaglines(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60"
            />
          </div>

          <div>
            <label className="block text-stone-300 uppercase font-mono mb-1">Short Bio (Card &amp; Search)</label>
            <textarea
              value={shortBio}
              onChange={(e) => setShortBio(e.target.value)}
              rows={3}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60"
            />
          </div>

          <div>
            <label className="block text-stone-300 uppercase font-mono mb-1">Full Biography (About Page)</label>
            <textarea
              value={fullBio}
              onChange={(e) => setFullBio(e.target.value)}
              rows={7}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60"
            />
          </div>

          <div>
            <label className="block text-stone-300 uppercase font-mono mb-1">Author Artistic Statement</label>
            <textarea
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              rows={2}
              placeholder="To write is not merely to capture what exists..."
              className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60"
            />
          </div>

          <div>
            <label className="block text-stone-300 uppercase font-mono mb-1">Philosophy of Craft</label>
            <textarea
              value={philosophy}
              onChange={(e) => setPhilosophy(e.target.value)}
              rows={3}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-300 uppercase font-mono mb-1">Education</label>
              <input
                type="text"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60"
              />
            </div>
            <div>
              <label className="block text-stone-300 uppercase font-mono mb-1">Recognition / Honors</label>
              <input
                type="text"
                value={achievements}
                onChange={(e) => setAchievements(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-300 uppercase font-mono mb-1">Public Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60"
              />
            </div>
            <div>
              <label className="block text-stone-300 uppercase font-mono mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="India"
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-300 uppercase font-mono mb-1">Author Profile Photo URL</label>
            <input
              type="text"
              value={profileImage}
              onChange={(e) => setProfileImage(e.target.value)}
              placeholder="https://..."
              className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60"
            />
          </div>

          <div>
            <label className="block text-stone-300 uppercase font-mono mb-1">Social Links (JSON)</label>
            <input
              type="text"
              value={socialLinks}
              onChange={(e) => setSocialLinks(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500/60 font-mono"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-stone-950 font-semibold px-8 py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Save Profile Changes</>}
        </button>
      </form>
    </div>
  );
}
