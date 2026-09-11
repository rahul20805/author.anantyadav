import { getCurrentUser } from "@/lib/auth";
import { AdminSidebar } from "./AdminSidebar";

export const metadata = {
  title: "Admin CMS | Anant Yadav",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // If not logged in, render children (e.g. login page) without sidebar
  if (!user) {
    return <div className="min-h-screen bg-stone-950">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col md:flex-row text-stone-100">
      <AdminSidebar />
      <main className="flex-1 p-6 sm:p-10 max-w-7xl mx-auto w-full overflow-y-auto min-h-screen">
        {children}
      </main>
    </div>
  );
}
