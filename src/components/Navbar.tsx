"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search, Feather, BookOpen } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { label: "About", href: "/about" },
  { label: "Books", href: "/books" },
  { label: "Poetry", href: "/poetry" },
  { label: "Writings", href: "/writings" },
  { label: "Thoughts", href: "/thoughts" },
  { label: "Media", href: "/media" },
  { label: "Events", href: "/events" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-stone-950/85 backdrop-blur-md border-b border-stone-800/60 shadow-lg py-3.5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand / Author Name */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-stone-100 font-serif-literary tracking-wider text-xl font-bold transition-all"
        >
          <span className="w-8 h-8 rounded-full border border-amber-500/30 flex items-center justify-center bg-stone-900 group-hover:border-amber-400/80 transition-colors">
            <Feather className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </span>
          <span className="bg-gradient-to-r from-stone-100 via-stone-200 to-amber-200/90 bg-clip-text text-transparent">
            ANANT YADAV
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3.5 py-1.5 rounded-full text-xs lg:text-sm font-medium transition-all ${
                  isActive
                    ? "bg-amber-500/10 text-amber-300 border border-amber-500/30"
                    : "text-stone-300 hover:text-stone-100 hover:bg-stone-900/60"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Tools: Search, Theme, Admin Link */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/search"
            className="p-2 rounded-full text-stone-400 hover:text-amber-300 hover:bg-stone-900/80 transition-colors border border-transparent hover:border-stone-800"
            aria-label="Search content"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </Link>
          <ThemeToggle />
          <Link
            href="/admin"
            className="text-xs text-stone-400 hover:text-amber-400 px-2.5 py-1 rounded-md border border-stone-800/80 hover:border-amber-500/40 transition-colors ml-1"
          >
            CMS
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/search"
            className="p-2 text-stone-400 hover:text-stone-100"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </Link>
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg text-stone-300 hover:text-white hover:bg-stone-900 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="md:hidden bg-stone-950/98 backdrop-blur-xl border-b border-stone-800 px-6 py-6 transition-all animate-in slide-in-from-top-4">
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className={`px-4 py-2.5 rounded-lg text-base font-medium flex items-center gap-3 ${
                pathname === "/"
                  ? "bg-amber-500/10 text-amber-300 border border-amber-500/30"
                  : "text-stone-300 hover:bg-stone-900"
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              Home
            </Link>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-2.5 rounded-lg text-base font-medium ${
                    isActive
                      ? "bg-amber-500/10 text-amber-300 border border-amber-500/30"
                      : "text-stone-300 hover:bg-stone-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-4 border-t border-stone-800/80 flex items-center justify-between">
              <span className="text-xs text-stone-400 tracking-wider">PORTAL ACCESS</span>
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-md"
              >
                Admin CMS
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
