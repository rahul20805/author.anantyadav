import { generateSeoMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return generateSeoMetadata({
    title: "Terms of Use | Anant Yadav Official Website",
    description: "Terms and conditions of accessing and using the official literary website of Anant Yadav.",
    path: "/terms",
  });
}

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-8 font-sans-ui">
      <div className="space-y-2 border-b border-stone-800 pb-6">
        <h1 className="font-serif-literary text-3xl sm:text-5xl font-bold text-stone-100">
          Terms of Use
        </h1>
        <p className="text-xs font-mono text-stone-400">Last updated: January 2026</p>
      </div>

      <div className="space-y-6 text-sm text-stone-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif-literary text-xl font-bold text-stone-100">1. Intellectual Property &amp; Copyright</h2>
          <p>
            All original poems, essays, book excerpts, thoughts, prose, and literary materials on this website are the intellectual property of Anant Yadav and are protected by international copyright laws.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif-literary text-xl font-bold text-stone-100">2. Permitted Sharing</h2>
          <p>
            You are welcome to share short quotations and excerpts on social media or in academic reviews provided that clear and proper attribution to <strong>Anant Yadav</strong> and a link back to this website are included.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif-literary text-xl font-bold text-stone-100">3. Commercial Reproduction</h2>
          <p>
            Reproduction, publication, adaptation, or translation of entire poems, essays, or books for commercial purposes without prior written consent from the author or publisher is strictly prohibited.
          </p>
        </section>
      </div>
    </div>
  );
}
