import Link from 'next/link';
import { Package, LayoutDashboard, PlusCircle, Settings, LogOut } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#12102E] border-r border-slate-800 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[#E63946] flex items-center justify-center font-black text-white text-lg shadow-md">
              WD
            </div>
            <div>
              <h2 className="font-bold text-white text-base leading-tight font-heading">White Diamond</h2>
              <span className="text-[11px] text-[#818CF8] uppercase tracking-wider font-semibold">
                Admin Panel
              </span>
            </div>
          </div>

          <nav className="space-y-1">
            <Link
              href="/admin/products"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-[#1E1B4B] text-white hover:bg-[#2E2A72] transition"
            >
              <Package className="w-4 h-4 text-[#818CF8]" />
              Products Management
            </Link>

            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
            >
              <LayoutDashboard className="w-4 h-4" />
              View Customer Store
            </Link>
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800">
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-slate-900 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
