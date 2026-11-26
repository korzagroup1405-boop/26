'use client';

import { useState } from 'react';
import { Check, ArrowRight, Loader2 } from 'lucide-react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState('error');
      setMessage('Please enter a valid email address.');
      return;
    }
    setState('loading');
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) throw new Error('failed');
      setState('done');
      setMessage('You are on the list. Look out for our seasonal invitations.');
      setEmail('');
    } catch {
      setState('error');
      setMessage('We could not add you right now. Please try again.');
    }
  };

  return (
    <form onSubmit={submit} className="mt-5">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <div className="flex items-center gap-2 rounded-full border border-cream/15 bg-ink/50 p-1.5 pl-5 transition focus-within:border-gold/60">
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (state !== 'idle') setState('idle');
          }}
          placeholder="your@email.com"
          className="min-w-0 flex-1 bg-transparent text-sm text-cream placeholder:text-beige/40 focus:outline-none"
          aria-describedby="newsletter-status"
        />
        <button
          type="submit"
          disabled={state === 'loading'}
          aria-label="Subscribe to the newsletter"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold text-ink transition hover:bg-goldSoft disabled:opacity-60"
        >
          {state === 'loading' ? (
            <Loader2 size={16} className="animate-spin" />
          ) : state === 'done' ? (
            <Check size={16} />
          ) : (
            <ArrowRight size={16} />
          )}
        </button>
      </div>
      <p
        id="newsletter-status"
        aria-live="polite"
        className={`mt-2 min-h-[18px] text-[11px] ${
          state === 'error' ? 'text-gold' : 'text-beige/70'
        }`}
      >
        {message}
      </p>
    </form>
  );
}
