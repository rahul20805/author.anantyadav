import { generateSeoMetadata } from "@/lib/seo";
import { ContactForm } from "./ContactForm";
import { Mail, Sparkles, MapPin } from "lucide-react";
import { prisma } from "@/lib/db";

export async function generateMetadata() {
  return generateSeoMetadata({
    title: "Contact & Inquiries | Anant Yadav",
    description:
      "Get in touch with author and poet Anant Yadav for literary readings, press interviews, permissions, or reader queries.",
    path: "/contact",
  });
}

export default async function ContactPage() {
  const profile = await prisma.authorProfile.findFirst({ where: { id: "default" } });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-900 border border-stone-800 text-amber-400 text-xs font-mono tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5" /> Direct Correspondence
        </div>
        <h1 className="font-serif-literary text-4xl sm:text-6xl font-bold text-stone-100 tracking-tight">
          Contact &amp; Inquiries
        </h1>
        <p className="text-stone-300 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
          For literary inquiries, press requests, festival appearances, and reader letters.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
        {/* Info Column */}
        <div className="md:col-span-4 space-y-6">
          <div className="p-8 rounded-3xl bg-stone-900/60 border border-stone-800 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block">
                Office of the Author
              </span>
              <h2 className="font-serif-literary text-2xl font-bold text-stone-100">
                Anant Yadav
              </h2>
            </div>

            <div className="space-y-4 text-xs font-sans-ui text-stone-300">
              {profile?.email && (
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-stone-400 block font-mono">Literary Inbox</span>
                    <span className="text-stone-200">{profile.email}</span>
                  </div>
                </div>
              )}

              {profile?.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-stone-400 block font-mono">Location</span>
                    <span className="text-stone-200">{profile.location}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-stone-800/80 text-[11px] text-stone-400 leading-relaxed">
              All messages sent via this form are delivered directly to the author&apos;s administrative correspondence queue.
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="md:col-span-8 p-8 sm:p-10 rounded-3xl bg-stone-900/40 border border-stone-800 shadow-2xl">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
