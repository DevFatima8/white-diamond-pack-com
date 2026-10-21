import { redirect } from 'next/navigation';
import db from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import AdminShell from '@/components/admin/AdminShell';

// Admin pages always show live data, never a cached copy.
export const dynamic = 'force-dynamic';

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  // Second line of defence: proxy.ts already redirects logged-out visitors,
  // but checking here too means a mistake in the proxy can't expose admin data.
  const admin = await getAdminSession();
  if (!admin) redirect('/admin/login');

  // Numbers for the red badges in the sidebar.
  const [pendingOrders, unreadMessages] = await Promise.all([
    db.order.count({ where: { status: 'PENDING' } }),
    db.message.count({ where: { isRead: false } }),
  ]);

  return (
    <AdminShell adminLabel={admin.username || admin.email || 'Admin'} pendingOrders={pendingOrders} unreadMessages={unreadMessages}>
      {children}
    </AdminShell>
  );
}
