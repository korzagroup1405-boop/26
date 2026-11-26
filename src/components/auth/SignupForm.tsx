'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function SignupForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (form.password !== form.confirm) {
      setError('Your passwords do not match.');
      return;
    }
    if (form.password.length < 8) {
      setError('Your password needs at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error ?? 'Could not create your account.');
      router.push('/account');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create your account.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="signup-name" className="label">
          Full name
        </label>
        <input
          id="signup-name"
          autoComplete="name"
          required
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
          className="field"
          placeholder="Your name"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="signup-email" className="label">
            Email
          </label>
          <input
            id="signup-email"
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
          <label htmlFor="signup-phone" className="label">
            Phone <span className="normal-case tracking-normal text-beige/40">(optional)</span>
          </label>
          <input
            id="signup-phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={(event) => setForm({ ...form, phone: event.target.value })}
            className="field"
            placeholder="+90 5xx xxx xx xx"
          />
        </div>
      </div>
      <div>
        <label htmlFor="signup-password" className="label">
          Password
        </label>
        <div className="relative">
          <input
            id="signup-password"
            type={show ? 'text' : 'password'}
            autoComplete="new-password"
            required
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            className="field pr-12"
            placeholder="At least 8 characters"
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
      <div>
        <label htmlFor="signup-confirm" className="label">
          Confirm password
        </label>
        <input
          id="signup-confirm"
          type={show ? 'text' : 'password'}
          autoComplete="new-password"
          required
          value={form.confirm}
          onChange={(event) => setForm({ ...form, confirm: event.target.value })}
          className="field"
          placeholder="Repeat your password"
        />
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
            <Loader2 size={15} className="animate-spin" /> Creating account
          </>
        ) : (
          <>
            Create account <ArrowRight size={15} />
          </>
        )}
      </button>
    </form>
  );
}
