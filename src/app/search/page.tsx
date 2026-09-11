import { generateSeoMetadata } from "@/lib/seo";
import { SearchClient } from "./SearchClient";

export async function generateMetadata() {
  return generateSeoMetadata({
    title: "Search | Anant Yadav Official Website",
    description: "Search across published books, poetry archive, essays, philosophical thoughts, media, and events.",
    path: "/search",
  });
}

export default function SearchPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-10">
      <div className="text-center space-y-3">
        <h1 className="font-serif-literary text-3xl sm:text-5xl font-bold text-stone-100 tracking-tight">
          Site-Wide Search
        </h1>
        <p className="text-stone-400 text-sm max-w-md mx-auto">
          Explore books, verses, essays, philosophical fragments, press, and appearances.
        </p>
      </div>

      <SearchClient />
    </div>
  );
}
