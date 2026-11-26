'use client';

import { useEffect, useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, Check, ArrowRight, Loader2 } from 'lucide-react';
import { useCart } from './CartProvider';
import { formatPrice, reference } from '@/lib/format';

type CheckoutState = 'cart' | 'submitting' | 'done';

export default function CartDrawer() {
  const { items, open, setOpen, remove, setQty, subtotal, clear, count } = useCart();
  const [state, setState] = useState<CheckoutState>('cart');
  const [orderRef, setOrderRef] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ customerName: '', phone: '', email: '', note: '' });

  // The provider lives in the root layout, so a drawer left open would reappear
  // when the guest returns from a route that does not render it (e.g. /admin).
  useEffect(() => {
    setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!open) return null;

  const close = () => {
    setOpen(false);
    if (state === 'done') {
      setState('cart');
      setOrderRef(null);
    }
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!form.customerName.trim() || !form.phone.trim()) {
      setError('Please add your name and a phone number.');
      return;
    }
    if (items.length === 0) {
      setError('Your order is empty.');
      return;
    }
    setState('submitting');
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, items }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error ?? 'Order failed');
      setOrderRef(reference('MK76', data.order.id));
      setState('done');
      clear();
      setForm({ customerName: '', phone: '', email: '', note: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setState('cart');
    }
  };

  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label="Your order">
      <button
        type="button"
        aria-label="Close order panel"
        onClick={close}
        className="absolute inset-0 h-full w-full cursor-default bg-ink/80 backdrop-blur-sm"
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-[460px] flex-col border-l border-gold/20 bg-wine shadow-soft">
        <header className="flex items-center justify-between border-b border-gold/15 px-6 py-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold">Your Order</p>
            <h2 className="mt-1 font-display text-2xl text-cream">
              {state === 'done' ? 'Thank you' : `${count} ${count === 1 ? 'item' : 'items'}`}
            </h2>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 text-cream/80 transition hover:border-gold/60 hover:text-gold"
          >
            <X size={18} />
          </button>
        </header>

        {state === 'done' ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold">
              <Check size={30} />
            </span>
            <h3 className="mt-6 font-display text-3xl text-cream">Order received</h3>
            <p className="mt-3 text-sm leading-relaxed text-beige">
              Reference <span className="text-gold">{orderRef}</span>. Our team will call you to
              confirm and prepare your order.
            </p>
            <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-beige/60">
              Demo ordering — no payment is taken
            </p>
            <button type="button" onClick={close} className="btn-gold mt-8 w-full">
              Continue exploring
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <ShoppingBag size={34} className="text-gold/60" />
            <p className="mt-5 font-display text-2xl text-cream">Your tray is empty</p>
            <p className="mt-2 text-sm text-beige">
              Add a signature drink or a plate from the menu to begin.
            </p>
            <button type="button" onClick={close} className="btn-outline mt-8">
              Browse the menu
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-4 border-b border-cream/8 pb-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-20 shrink-0 rounded-xl object-cover"
                      loading="lazy"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-display text-lg leading-tight text-cream">{item.name}</p>
                        <button
                          type="button"
                          onClick={() => remove(item.id)}
                          aria-label={`Remove ${item.name}`}
                          className="text-beige/50 transition hover:text-gold"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <p className="mt-1 text-sm text-gold">{formatPrice(item.price)}</p>
                      <div className="mt-2 flex items-center gap-3">
                        <div className="flex items-center rounded-full border border-cream/15">
                          <button
                            type="button"
                            aria-label={`Decrease ${item.name}`}
                            onClick={() => setQty(item.id, item.qty - 1)}
                            className="flex h-8 w-8 items-center justify-center text-cream/70 transition hover:text-gold"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="w-6 text-center text-sm text-cream">{item.qty}</span>
                          <button
                            type="button"
                            aria-label={`Increase ${item.name}`}
                            onClick={() => setQty(item.id, item.qty + 1)}
                            className="flex h-8 w-8 items-center justify-center text-cream/70 transition hover:text-gold"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                        <span className="ml-auto text-sm text-cream/80">
                          {formatPrice(item.price * item.qty)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <form onSubmit={submit} className="mt-6 space-y-3">
                <p className="text-[10px] uppercase tracking-[0.28em] text-gold">Order details</p>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    required
                    value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    placeholder="Full name"
                    aria-label="Full name"
                    className="field"
                  />
                  <input
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="Phone"
                    aria-label="Phone"
                    className="field"
                  />
                </div>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Email (optional)"
                  aria-label="Email"
                  className="field"
                />
                <textarea
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  placeholder="Notes for the kitchen (optional)"
                  aria-label="Order notes"
                  rows={2}
                  className="field resize-none"
                />
                {error && (
                  <p className="flex items-start gap-2 rounded-lg border border-gold/40 bg-gold/10 px-3 py-2 text-xs text-cream">
                    <span aria-hidden="true">!</span>
                    {error}
                  </p>
                )}
              </form>
            </div>

            <footer className="border-t border-gold/15 px-6 py-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-beige">Subtotal</span>
                <span className="font-display text-2xl text-gold">{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-1 text-[11px] text-beige/60">
                Demo checkout · pay at the table
              </p>
              <button
                type="button"
                onClick={submit}
                disabled={state === 'submitting'}
                className="btn-gold mt-4 w-full disabled:opacity-60"
              >
                {state === 'submitting' ? (
                  <>
                    <Loader2 size={15} className="animate-spin" /> Sending
                  </>
                ) : (
                  <>
                    Place order <ArrowRight size={15} />
                  </>
                )}
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
