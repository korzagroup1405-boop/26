import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import AuthShell from '@/components/AuthShell';
import LoginForm from '@/components/auth/LoginForm';
import { getSession } from '@/lib/auth';
import { LOUNGE_IMAGE } from '@/lib/data';

export const metadata: Metadata = { title: 'Login' };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const session = await getSession();
  if (session) redirect(session.role === 'ADMIN' ? '/admin' : '/account');
  const { next } = await searchParams;

  return (
    <AuthShell
      image={LOUNGE_IMAGE}
      eyebrow="Welcome back"
      title="Sign in to your table"
      description="Manage your reservations and keep your details ready for the next evening."
      footer={
        <>
          New to MEKAN 76?{' '}
          <Link href="/signup" className="text-gold underline-offset-4 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <LoginForm next={next} />
    </AuthShell>
  );
}
