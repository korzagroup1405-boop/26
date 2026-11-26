'use client';

import { useState } from 'react';
import { ChevronDown, Trash2 } from 'lucide-react';
import { api, useResource } from './api';
import { EmptyState, Spinner, StatusPill } from './ui';
import type { Order } from '@/lib/types';
import { formatDateTime, formatPrice, reference } from '@/lib/format';

export default function OrdersTab() {
  const { items, loading, error, reload, setItems } = useResource<Order>('orders');
  const [expanded, setExpanded] = useState<number | null>(null);

  const changeStatus = async (order: Order, status: string) => {
    setItems((current) =>
      current.map((entry) => (entry.id === order.id ? { ...entry, status } : entry)),
    );
    try {
      await api(`/api/admin/orders/${order.id}`, { method: 'PATCH', body: { status } });
    } catch {
      reload();
    }
  };

  const remove = async (order: Order) => {
    if (!window.confirm(`Delete order ${reference('MK76', order.id)}?`)) return;
    setItems((current) => current.filter((entry) => entry.id !== order.id));
    try {
      await api(`/api/admin/orders/${order.id}`, { method: 'DELETE' });
    } catch {
      reload();
    }
  };

  return (
    <div>
      <div>
        <h1 className="font-display text-3xl text-cream">Orders</h1>
        <p className="mt-1 text-sm text-beige">
          {items.length} food & drink orders placed from the website.
        </p>
      </div>

      {loading ? (
        <Spinner label="Loading orders" />
      ) : error ? (
        <EmptyState message={error} />
      ) : items.length === 0 ? (
        <EmptyState message="No online orders yet." />
      ) : (
        <div className="mt-6 space-y-3">
          {items.map((order) => {
            const isOpen = expanded === order.id;
            const totalQty = (order.items ?? []).reduce((sum, item) => sum + item.qty, 0);
            return (
              <article key={order.id} className="rounded-xl2 border border-gold/15 bg-wine/30">
                <div className="flex flex-wrap items-center gap-3 px-4 py-4 sm:px-5">
                  <button
                    type="button"
                    onClick={() => setExpanded(isOpen ? null : order.id)}
                    aria-expanded={isOpen}
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/30 text-gold">
                      <ChevronDown
                        size={15}
                        className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-cream">
                        {order.customer_name}
                        <span className="ml-2 text-[10px] uppercase tracking-[0.16em] text-gold/60">
                          {reference('MK76', order.id)}
                        </span>
                      </span>
                      <span className="block truncate text-xs text-beige/70">
                        {totalQty} items · {order.phone} · {formatDateTime(order.created_at)}
                      </span>
                    </span>
                  </button>

                  <span className="font-display text-lg text-gold">{formatPrice(order.total)}</span>

                  <select
                    value={order.status}
                    onChange={(event) => changeStatus(order, event.target.value)}
                    aria-label={`Status for order ${reference('MK76', order.id)}`}
                    className="rounded-full border border-cream/15 bg-ink/60 px-3 py-1.5 text-xs text-cream"
                  >
                    <option value="NEW">New</option>
                    <option value="PREPARING">Preparing</option>
                    <option value="SERVED">Served</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>

                  <StatusPill status={order.status} />

                  <button
                    type="button"
                    onClick={() => remove(order)}
                    aria-label={`Delete order ${reference('MK76', order.id)}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/12 text-beige transition hover:border-red-300/50 hover:text-red-200"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                {isOpen && (
                  <div className="border-t border-cream/8 px-4 py-4 sm:px-5">
                    <ul className="space-y-2 text-sm">
                      {(order.items ?? []).map((item) => (
                        <li key={item.id} className="flex items-center justify-between gap-3 text-beige">
                          <span>
                            <span className="text-cream/90">{item.qty}×</span> {item.name}
                          </span>
                          <span className="text-cream/80">{formatPrice(item.price * item.qty)}</span>
                        </li>
                      ))}
                    </ul>
                    {order.note && (
                      <p className="mt-3 rounded-xl border border-cream/8 bg-ink/40 px-4 py-3 text-xs text-beige">
                        <span className="text-[9px] uppercase tracking-[0.2em] text-gold/60">Note · </span>
                        {order.note}
                      </p>
                    )}
                    {order.email && (
                      <p className="mt-2 text-xs text-beige/60">Email · {order.email}</p>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
