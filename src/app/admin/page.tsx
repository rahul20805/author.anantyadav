import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  BookOpen,
  Feather,
  FileText,
  Quote,
  Newspaper,
  Calendar,
  Users,
  Mail,
  Plus,
  ArrowRight,
  Sparkles,
  MessageSquare,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/admin/login");
  }

  const [
    booksCount,
    poemsCount,
    writingsCount,
    thoughtsCount,
    mediaCount,
    eventsCount,
    unreadMessagesCount,
    pendingReviewsCount,
    subscribersCount,
    recentMessages,
    recentBooks,
  ] = await Promise.all([
    prisma.book.count(),
    prisma.poem.count(),
    prisma.writing.count(),
    prisma.thought.count(),
    prisma.mediaItem.count(),
    prisma.eventItem.count(),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.review.count({ where: { isApproved: false } }),
    prisma.newsletterSubscriber.count(),
    prisma.contactMessage.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
    }),
    prisma.book.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const metricCards = [
    { label: "Published Books", count: booksCount, href: "/admin/books", icon: BookOpen, color: "text-amber-400" },
    { label: "Poetry Collection", count: poemsCount, href: "/admin/poetry", icon: Feather, color: "text-emerald-400" },
    { label: "Essays & Articles", count: writingsCount, href: "/admin/writings", icon: FileText, color: "text-sky-400" },
    { label: "Thoughts & Quotes", count: thoughtsCount, href: "/admin/thoughts", icon: Quote, color: "text-purple-400" },
    { label: "Media & Press", count: mediaCount, href: "/admin/media", icon: Newspaper, color: "text-orange-400" },
    { label: "Events & Readings", count: eventsCount, href: "/admin/events", icon: Calendar, color: "text-rose-400" },
    { label: "Newsletter Readers", count: subscribersCount, href: "/admin/subscribers", icon: Users, color: "text-blue-400" },
    { label: "Unread Messages", count: unreadMessagesCount, href: "/admin/messages", icon: Mail, color: "text-emerald-400", alert: unreadMessagesCount > 0 },
    { label: "Pending Reviews", count: pendingReviewsCount, href: "/admin/reviews", icon: MessageSquare, color: "text-amber-400", alert: pendingReviewsCount > 0 },
  ];

  return (
    <div className="space-y-10 font-sans-ui">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Editorial Overview
          </span>
          <h1 className="font-serif-literary text-3xl sm:text-4xl font-bold text-stone-100 mt-1">
            Welcome, {user.name || "Anant"}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/poetry"
            className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold px-4 py-2 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md"
          >
            <Plus className="w-3.5 h-3.5" /> Add Poem
          </Link>
          <Link
            href="/admin/books"
            className="bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-200 font-semibold px-4 py-2 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" /> Add Book
          </Link>
          <Link
            href="/admin/writings"
            className="bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-200 font-semibold px-4 py-2 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-sky-400" /> Add Essay
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {metricCards.map((m) => {
          const Icon = m.icon;
          return (
            <Link
              key={m.label}
              href={m.href}
              className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800 hover:border-amber-500/40 transition-all duration-200 flex items-center justify-between group shadow-lg"
            >
              <div className="space-y-1">
                <span className="text-xs font-mono text-stone-400 uppercase tracking-wider">
                  {m.label}
                </span>
                <p className="text-3xl font-bold text-stone-100 font-serif-literary">
                  {m.count}
                </p>
                {m.alert && (
                  <span className="inline-block text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    Action required
                  </span>
                )}
              </div>
              <div className={`p-3.5 rounded-xl bg-stone-950 border border-stone-800 ${m.color} group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Two-Column Activity Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Reader Inquiries */}
        <div className="p-6 rounded-3xl bg-stone-900/40 border border-stone-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <h2 className="font-serif-literary text-xl font-bold text-stone-100 flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-400" /> Recent Inquiries
            </h2>
            <Link href="/admin/messages" className="text-xs font-mono text-amber-400 hover:text-amber-300">
              View All &rarr;
            </Link>
          </div>

          {recentMessages.length > 0 ? (
            <div className="space-y-3">
              {recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-4 rounded-xl border text-xs space-y-1 ${
                    !msg.isRead
                      ? "bg-stone-900/90 border-amber-500/30 text-stone-200"
                      : "bg-stone-950/40 border-stone-800/80 text-stone-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-200">{msg.name}</span>
                    <span className="font-mono text-[10px] uppercase text-amber-400">{msg.category}</span>
                  </div>
                  <p className="text-stone-300 font-medium">{msg.subject}</p>
                  <p className="line-clamp-1 text-stone-400">{msg.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-stone-400 py-4 text-center">No messages in inbox.</p>
          )}
        </div>

        {/* Current Books */}
        <div className="p-6 rounded-3xl bg-stone-900/40 border border-stone-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <h2 className="font-serif-literary text-xl font-bold text-stone-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" /> Active Books
            </h2>
            <Link href="/admin/books" className="text-xs font-mono text-amber-400 hover:text-amber-300">
              Manage &rarr;
            </Link>
          </div>

          {recentBooks.length > 0 ? (
            <div className="space-y-3">
              {recentBooks.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-xl bg-stone-950/40 border border-stone-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-stone-200 block text-sm font-serif-literary">{b.title}</span>
                    <span className="text-stone-400">{b.genre} • {b.pageCount || 0} pages</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] ${
                    b.published ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : "bg-stone-800 text-stone-400"
                  }`}>
                    {b.published ? "Published" : "Draft"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-stone-400 py-4 text-center">No books created yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
