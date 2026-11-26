'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function LoginForm({ next }: { next?: string }) {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error ?? 'Could not sign in.');
      const target = next || (data.user?.role === 'ADMIN' ? '/admin' : '/account');
      router.push(target);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign in.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="login-email" className="label">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          className="field"
          placeholder="you@email.com"
        />
      </div>

      <div>
        <label htmlFor="login-password" className="label">
          Password
        </label>
        <div className="relative">
          <input
            id="login-password"
            type={show ? 'text' : 'password'}
            autoComplete="current-password"
            required
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            className="field pr-12"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShow((value) => !value)}
            aria-label={show ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-beige/60 transition hover:text-gold"
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="flex items-start gap-2 rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-cream">
          <AlertCircle size={16} className="mt-0.5 shrink-0 text-gold" />
          {error}
        </p>
      )}

      <button type="submit" disabled={loading} className="btn-gold w-full disabled:opacity-60">
        {loading ? (
          <>
            <Loader2 size={15} className="animate-spin" /> Signing in
          </>
        ) : (
          <>
            Sign in <ArrowRight size={15} />
          </>
        )}
      </button>
    </form>
  );
}
