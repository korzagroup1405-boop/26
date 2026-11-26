'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { api, useResource } from './api';
import { EmptyState, Spinner, StatusPill } from './ui';
import type { Customer } from '@/lib/types';
import { formatDateTime } from '@/lib/format';

export default function CustomersTab({ currentUserId }: { currentUserId: number }) {
  const { items, loading, error, reload, setItems } = useResource<Customer>('customers');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return items;
    return items.filter(
      (customer) =>
        customer.name.toLowerCase().includes(term) ||
        customer.email.toLowerCase().includes(term) ||
        (customer.phone ?? '').toLowerCase().includes(term),
    );
  }, [items, query]);

  const changeRole = async (customer: Customer, role: string) => {
    setItems((current) =>
      current.map((entry) => (entry.id === customer.id ? { ...entry, role } : entry)),
    );
    try {
      await api(`/api/admin/customers/${customer.id}`, { method: 'PATCH', body: { role } });
    } catch {
      reload();
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-cream">Customers</h1>
          <p className="mt-1 text-sm text-beige">
            {items.length} accounts · guests who book online are added automatically.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-beige/50" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search guests"
            aria-label="Search customers"
            className="field h-11 rounded-full pl-10 text-sm"
          />
        </div>
      </div>

      {loading ? (
        <Spinner label="Loading guests" />
      ) : error ? (
        <EmptyState message={error} />
      ) : filtered.length === 0 ? (
        <EmptyState message="No guests match that search." />
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl2 border border-gold/15">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-ink/60 text-[9px] uppercase tracking-[0.18em] text-beige/70">
              <tr>
                <th className="px-4 py-3 font-medium">Guest</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Reservations</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream/8">
              {filtered.map((customer) => (
                <tr key={customer.id} className="bg-wine/20 transition-colors hover:bg-wine/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/10 font-display text-sm text-gold">
                        {customer.name.slice(0, 1).toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-cream">{customer.name}</p>
                        <p className="truncate text-xs text-beige/70">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-beige">{customer.phone || '—'}</td>
                  <td className="px-4 py-3 text-cream/90">{customer.reservation_count ?? 0}</td>
                  <td className="px-4 py-3 text-xs text-beige/70">
                    {formatDateTime(customer.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    {customer.id === currentUserId ? (
                      <div className="flex items-center gap-2">
                        <StatusPill status={customer.role} />
                        <span className="text-[10px] text-beige/50">(you)</span>
                      </div>
                    ) : (
                      <select
                        value={customer.role}
                        onChange={(event) => changeRole(customer, event.target.value)}
                        aria-label={`Role for ${customer.name}`}
                        className="rounded-full border border-cream/15 bg-ink/60 px-3 py-1.5 text-xs text-cream"
                      >
                        <option value="CUSTOMER">Customer</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
