import Link from "next/link";
import { Feather, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center font-sans-ui">
      <div className="max-w-md w-full space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
          <Feather className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
            Error 404
          </span>
          <h1 className="font-serif-literary text-3xl sm:text-4xl font-bold text-stone-100">
            A Page Left Unwritten
          </h1>
          <p className="text-sm text-stone-400 leading-relaxed font-serif-literary italic">
            &ldquo;The path you followed leads to an unmapped silence.&rdquo;
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Link
            href="/"
            className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return Home
          </Link>
          <Link
            href="/search"
            className="bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-200 font-semibold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
          >
            <Search className="w-3.5 h-3.5 text-amber-400" /> Search Content
          </Link>
        </div>
      </div>
    </div>
  );
}
