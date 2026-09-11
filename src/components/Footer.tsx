import Link from "next/link";
import { Feather, BookOpen, Mail, Shield, FileText } from "lucide-react";
import { TwitterIcon, InstagramIcon, LinkedInIcon } from "./BrandIcons";
import { NewsletterForm } from "./NewsletterForm";

export function Footer() {
  return (
    <footer className="bg-stone-950 border-t border-stone-800/80 pt-16 pb-12 text-stone-400 font-sans-ui">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Dispatch Section */}
        <div className="mb-16 p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-stone-900/90 via-stone-900/60 to-amber-950/20 border border-stone-800 text-center max-w-4xl mx-auto shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-4 text-amber-400">
            <Mail className="w-6 h-6" />
          </div>
          <h3 className="font-serif-literary text-2xl sm:text-3xl font-bold text-stone-100 tracking-tight">
            The Solitude Dispatch
          </h3>
          <p className="text-sm text-stone-400 max-w-md mx-auto mt-2 mb-8 leading-relaxed">
            Letters on literature, new poems, philosophical inquiries, and book updates directly from the author&apos;s desk.
          </p>
          <NewsletterForm />
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-stone-800/80">
          {/* Col 1: Author Intro */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2 text-stone-100 font-serif-literary text-xl font-bold">
              <span className="w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                <Feather className="w-3.5 h-3.5 text-amber-400" />
              </span>
              ANANT YADAV
            </Link>
            <p className="text-xs text-stone-400 leading-relaxed">
              Author, poet, and philosophical essayist exploring the contours of solitude, human consciousness, and contemporary literary craft.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-amber-400 hover:border-amber-500/40 transition-colors"
                aria-label="Twitter Profile"
              >
                <TwitterIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-amber-400 hover:border-amber-500/40 transition-colors"
                aria-label="Instagram Profile"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://linkedin.com/in/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-amber-400 hover:border-amber-500/40 transition-colors"
                aria-label="LinkedIn Profile"
              >
                <LinkedInIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://goodreads.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-amber-400 hover:border-amber-500/40 transition-colors"
                aria-label="Goodreads Profile"
              >
                <BookOpen className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Col 2: Literary Works */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-stone-200 font-semibold mb-4">
              Literary Works
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/books" className="hover:text-amber-300 transition-colors">
                  Published Books
                </Link>
              </li>
              <li>
                <Link href="/poetry" className="hover:text-amber-300 transition-colors">
                  Poetry Archive
                </Link>
              </li>
              <li>
                <Link href="/writings" className="hover:text-amber-300 transition-colors">
                  Essays &amp; Articles
                </Link>
              </li>
              <li>
                <Link href="/thoughts" className="hover:text-amber-300 transition-colors">
                  Curated Thoughts
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Engagement */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-stone-200 font-semibold mb-4">
              Engagement
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-amber-300 transition-colors">
                  Author Profile &amp; Bio
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-amber-300 transition-colors">
                  Readings &amp; Events
                </Link>
              </li>
              <li>
                <Link href="/media" className="hover:text-amber-300 transition-colors">
                  Media &amp; Press
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-300 transition-colors">
                  Contact &amp; Inquiries
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform & Legal */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-stone-200 font-semibold mb-4">
              Information
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/search" className="hover:text-amber-300 transition-colors">
                  Site Search
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-stone-400" /> Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-stone-400" /> Terms of Use
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-stone-400 hover:text-amber-400 transition-colors">
                  Portal Login (CMS)
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>© {new Date().getFullYear()} Anant Yadav. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with literary precision &amp; modern web standards.
          </p>
        </div>
      </div>
    </footer>
  );
}
