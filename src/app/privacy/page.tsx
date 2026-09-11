import { generateSeoMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return generateSeoMetadata({
    title: "Privacy Policy | Anant Yadav Official Website",
    description: "Privacy policy regarding newsletter subscription, correspondence, and reader data.",
    path: "/privacy",
  });
}

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-8 font-sans-ui">
      <div className="space-y-2 border-b border-stone-800 pb-6">
        <h1 className="font-serif-literary text-3xl sm:text-5xl font-bold text-stone-100">
          Privacy Policy
        </h1>
        <p className="text-xs font-mono text-stone-400">Last updated: January 2026</p>
      </div>

      <div className="space-y-6 text-sm text-stone-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif-literary text-xl font-bold text-stone-100">1. Overview</h2>
          <p>
            This website is the official digital publication of author and poet Anant Yadav. We respect your privacy and are committed to protecting any personal information you choose to share with us.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif-literary text-xl font-bold text-stone-100">2. Information Collection</h2>
          <p>
            We only collect personal information that you voluntarily provide, such as:
          </p>
          <ul className="list-disc list-inside space-y-1 text-stone-400">
            <li>Your email address when subscribing to the newsletter</li>
            <li>Your name and message when submitting the contact form</li>
            <li>Your name and review when leaving a book reflection</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif-literary text-xl font-bold text-stone-100">3. Use of Information</h2>
          <p>
            Your information is used strictly to communicate with you regarding literary dispatches, book releases, or responding to your direct inquiries. We will never sell, rent, or trade your personal information with third parties.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif-literary text-xl font-bold text-stone-100">4. Unsubscribing</h2>
          <p>
            You may unsubscribe from the newsletter at any time by contacting us or clicking the unsubscribe link in any dispatched email.
          </p>
        </section>
      </div>
    </div>
  );
}
