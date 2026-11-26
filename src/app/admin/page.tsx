import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { requireAdmin } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Owner Dashboard',
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const admin = await requireAdmin();
  if (!admin) redirect('/login?next=/admin');

  return (
    <AdminDashboard
      user={{ id: admin.id, name: admin.name, email: admin.email, role: admin.role }}
    />
  );
}
