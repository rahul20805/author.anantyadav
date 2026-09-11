"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Feather,
  FileText,
  Quote,
  Newspaper,
  Calendar,
  User,
  Settings,
  Mail,
  Users,
  MessageSquare,
  LogOut,
  ExternalLink,
  Shield,
} from "lucide-react";
import { useToast } from "@/components/ToastContext";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Books", href: "/admin/books", icon: BookOpen },
  { label: "Poetry", href: "/admin/poetry", icon: Feather },
  { label: "Writings", href: "/admin/writings", icon: FileText },
  { label: "Thoughts", href: "/admin/thoughts", icon: Quote },
  { label: "Media / Press", href: "/admin/media", icon: Newspaper },
  { label: "Events", href: "/admin/events", icon: Calendar },
  { label: "Reviews", href: "/admin/reviews", icon: MessageSquare },
  { label: "Messages", href: "/admin/messages", icon: Mail },
  { label: "Subscribers", href: "/admin/subscribers", icon: Users },
  { label: "Author Profile", href: "/admin/profile", icon: User },
  { label: "Site Settings & SEO", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { success } = useToast();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      success("Logged out successfully");
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <aside className="w-64 bg-stone-950 border-r border-stone-800/80 flex flex-col justify-between shrink-0 font-sans-ui min-h-screen">
      {/* Top Brand */}
      <div>
        <div className="p-6 border-b border-stone-800/80">
          <div className="flex items-center gap-2 text-stone-100 font-serif-literary text-lg font-bold">
            <span className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Shield className="w-4 h-4" />
            </span>
            ANANT CMS
          </div>
          <p className="text-[11px] font-mono text-stone-400 mt-1">Editorial Management</p>
        </div>

        {/* Navigation items */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-amber-600 text-stone-950 font-semibold shadow-md"
                    : "text-stone-300 hover:bg-stone-900 hover:text-stone-100"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-stone-950" : "text-amber-400/80"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Controls */}
      <div className="p-4 border-t border-stone-800/80 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-stone-400 hover:text-stone-200 hover:bg-stone-900 transition-colors"
        >
          <span>View Public Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-950/30 transition-colors font-medium"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </aside>
  );
}
