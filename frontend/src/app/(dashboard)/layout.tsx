import { Shell } from '@/components/layout/Shell';
import { redirect } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Add session check and redirect to /login if not authenticated
  const isAuthenticated = true; // Placeholder

  if (!isAuthenticated) {
    redirect('/login');
  }

  return <Shell>{children}</Shell>;
}
