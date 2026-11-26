import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import AuthShell from '@/components/AuthShell';
import SignupForm from '@/components/auth/SignupForm';
import { getSession } from '@/lib/auth';
import { ABOUT_IMAGE } from '@/lib/data';

export const metadata: Metadata = { title: 'Create an Account' };

export default async function SignupPage() {
  const session = await getSession();
  if (session) redirect(session.role === 'ADMIN' ? '/admin' : '/account');

  return (
    <AuthShell
      image={ABOUT_IMAGE}
      eyebrow="Join the house"
      title="Create your account"
      description="Save your details once and reserve in a few seconds — your table history stays in one place."
      footer={
        <>
          Already have an account?{' '}
          <Link href="/login" className="text-gold underline-offset-4 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <SignupForm />
    </AuthShell>
  );
}
