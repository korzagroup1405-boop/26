'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarDays,
  UtensilsCrossed,
  Images,
  Users,
  ShoppingBag,
  FileText,
  LogOut,
  ExternalLink,
  ArrowUpRight,
} from 'lucide-react';
import Logo from '@/components/Logo';
import MenuTab from './MenuTab';
import GalleryTab from './GalleryTab';
import ReservationsTab from './ReservationsTab';
import CustomersTab from './CustomersTab';
import OrdersTab from './OrdersTab';
import ContentTab from './ContentTab';
import { api } from './api';
import { EmptyState, Panel, Spinner, StatusPill } from './ui';
import { cx, formatDate, formatDateTime, formatPrice } from '@/lib/format';

const TABS = [
  { id: 'overview', label: 'Overview', Icon: LayoutDashboard },
  { id: 'reservations', label: 'Reservations', Icon: CalendarDays },
  { id: 'menu', label: 'Menu', Icon: UtensilsCrossed },
  { id: 'gallery', label: 'Gallery', Icon: Images },
  { id: 'orders', label: 'Orders', Icon: ShoppingBag },
  { id: 'customers', label: 'Customers', Icon: Users },
  { id: 'content', label: 'Content', Icon: FileText },
] as const;

type TabId = (typeof TABS)[number]['id'];

type Stats = {
  kpis: {
    today: number;
    pending: number;
    guestsToday: number;
    customers: number;
    menuItems: number;
    newOrders: number;
    revenue: number;
    subscribers: number;
  };
  density: { day: string; reservations: number; guests: number }[];
  popular: { name: string; qty: number }[];
  upcoming: {
    id: number;
    name: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    guests: number;
    status: string;
    requests: string | null;
  }[];
  recentOrders: {
    id: number;
    customer_name: string;
    phone: string;
    total: string;
    status: string;
    created_at: string;
  }[];
};

export default function AdminDashboard({
  user,
}: {
  user: { id: number; name: string; email: string; role: string };
}) {
  const [tab, setTab] = useState<TabId>('overview');
  const router = useRouter();

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-ink">
      <div className="flex">
        {/* Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-gold/15 bg-wine/30 px-4 py-6 lg:flex">
          <div className="px-2">
            <Logo size="sm" variant="inline" />
          </div>

          <p className="mt-8 px-3 text-[9px] uppercase tracking-[0.28em] text-beige/40">
            Owner’s ledger
          </p>

          <nav aria-label="Dashboard" className="mt-3 flex flex-1 flex-col gap-1">
            {TABS.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                aria-current={tab === id ? 'page' : undefined}
                className={cx(
                  'flex min-h-[44px] items-center gap-3 rounded-xl px-3 text-left text-[12px] transition',
                  tab === id
                    ? 'bg-gold/12 text-gold'
                    : 'text-beige hover:bg-cream/5 hover:text-cream',
                )}
              >
                <Icon size={16} strokeWidth={1.6} />
                {label}
              </button>
            ))}
          </nav>

          <div className="mt-6 border-t border-cream/8 pt-4">
            <Link
              href="/"
              className="flex min-h-[40px] items-center gap-2 rounded-xl px-3 text-[11px] uppercase tracking-[0.16em] text-beige transition hover:text-gold"
            >
              <ExternalLink size={14} /> View website
            </Link>
            <button
              type="button"
              onClick={logout}
              className="flex min-h-[40px] w-full items-center gap-2 rounded-xl px-3 text-[11px] uppercase tracking-[0.16em] text-beige transition hover:text-gold"
            >
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-gold/15 bg-ink/90 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
              <div className="flex items-center gap-3 lg:hidden">
                <Logo size="sm" asLink={false} />
              </div>
              <div className="hidden lg:block">
                <p className="text-[9px] uppercase tracking-[0.26em] text-gold/70">
                  MEKAN 76 · KAFE NARGILE
                </p>
                <p className="font-display text-lg leading-tight text-cream">
                  {TABS.find((entry) => entry.id === tab)?.label}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/"
                  className="hidden min-h-[38px] items-center gap-2 rounded-full border border-cream/15 px-4 text-[9px] uppercase tracking-[0.18em] text-beige transition hover:border-gold/50 hover:text-gold sm:inline-flex"
                >
                  View site <ArrowUpRight size={12} />
                </Link>
                <div className="flex items-center gap-2 rounded-full border border-gold/25 bg-gold/5 py-1 pl-1 pr-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold/15 font-display text-xs text-gold">
                    {user.name.slice(0, 1).toUpperCase()}
                  </span>
                  <span className="hidden text-[10px] uppercase tracking-[0.14em] text-cream sm:block">
                    {user.name.split(' ')[0]}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  aria-label="Sign out"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/15 text-beige transition hover:border-gold/50 hover:text-gold lg:hidden"
                >
                  <LogOut size={14} />
                </button>
              </div>
            </div>

            <div className="no-scrollbar flex gap-1 overflow-x-auto border-t border-cream/8 px-3 py-2 lg:hidden">
              {TABS.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  aria-pressed={tab === id}
                  className={cx(
                    'shrink-0 rounded-full px-3 py-2 text-[10px] uppercase tracking-[0.14em] transition',
                    tab === id ? 'bg-gold text-ink' : 'text-beige hover:text-cream',
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </header>

          <main className="px-4 py-6 sm:px-6 sm:py-8">
            {tab === 'overview' && <Overview />}
            {tab === 'reservations' && <ReservationsTab />}
            {tab === 'menu' && <MenuTab />}
            {tab === 'gallery' && <GalleryTab />}
            {tab === 'orders' && <OrdersTab />}
            {tab === 'customers' && <CustomersTab currentUserId={user.id} />}
            {tab === 'content' && <ContentTab />}
          </main>
        </div>
      </div>
    </div>
  );
}

function Overview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<Stats>('/api/admin/stats')
      .then(setStats)
      .catch((err) => setError(err instanceof Error ? err.message : 'Could not load statistics.'));
  }, []);

  if (error) return <EmptyState message={error} />;
  if (!stats) return <Spinner label="Reading the ledger" />;

  const { kpis, density, popular, upcoming, recentOrders } = stats;
  const maxGuests = Math.max(1, ...density.map((entry) => entry.guests));
  const maxPopular = Math.max(1, ...popular.map((entry) => entry.qty));

  const cards = [
    { label: 'Reservations today', value: kpis.today, note: `${kpis.guestsToday} guests expected` },
    { label: 'Awaiting confirmation', value: kpis.pending, note: 'Pending requests' },
    { label: 'Order revenue', value: formatPrice(kpis.revenue), note: `${kpis.newOrders} new orders` },
    { label: 'Guests on file', value: kpis.customers, note: `${kpis.subscribers} newsletter sign-ups` },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-3xl text-cream">Good evening</h1>
        <p className="mt-1 text-sm text-beige">
          {formatDate(new Date())} · {kpis.menuItems} menu items live
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article key={card.label} className="rounded-xl2 border border-gold/15 bg-wine/40 p-5">
            <p className="text-[9px] uppercase tracking-[0.22em] text-beige/60">{card.label}</p>
            <p className="mt-2 font-display text-[34px] leading-none text-cream">{card.value}</p>
            <p className="mt-2 text-[11px] text-gold/70">{card.note}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <Panel title="Reservation density · next 7 days">
          <div className="flex h-44 items-end gap-2 sm:gap-3">
            {density.map((entry) => {
              const height = Math.max(4, Math.round((entry.guests / maxGuests) * 100));
              return (
                <div key={entry.day} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-[10px] text-beige/60">{entry.guests}</span>
                  <div
                    className="w-full rounded-t-lg border border-gold/25 bg-gradient-to-t from-gold/10 to-gold/60 transition-all"
                    style={{ height: `${height}%` }}
                    role="img"
                    aria-label={`${entry.guests} guests on ${entry.day}`}
                  />
                  <span className="text-[9px] uppercase tracking-[0.1em] text-beige/50">
                    {new Date(`${entry.day}T00:00:00Z`).toLocaleDateString('en-GB', {
                      weekday: 'short',
                      timeZone: 'UTC',
                    })}
                  </span>
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel title="Menu popularity">
          {popular.length === 0 ? (
            <EmptyState message="No orders yet — popularity will appear here." />
          ) : (
            <ul className="space-y-3">
              {popular.map((entry, index) => (
                <li key={`${entry.name}-${index}`}>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="truncate text-cream/90">{entry.name}</span>
                    <span className="text-[11px] text-gold">{entry.qty}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-cream/8">
                    <div
                      className="h-full rounded-full bg-gold/70"
                      style={{ width: `${Math.round((entry.qty / maxPopular) * 100)}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <Panel title="Upcoming tables">
          {upcoming.length === 0 ? (
            <EmptyState message="No upcoming reservations." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead className="text-[9px] uppercase tracking-[0.16em] text-beige/50">
                  <tr>
                    <th className="pb-2 font-medium">Guest</th>
                    <th className="pb-2 font-medium">When</th>
                    <th className="pb-2 font-medium">Party</th>
                    <th className="pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream/8">
                  {upcoming.map((entry) => (
                    <tr key={entry.id}>
                      <td className="py-2.5 pr-3">
                        <p className="truncate text-cream/90">{entry.name}</p>
                        <p className="text-[11px] text-beige/50">{entry.phone}</p>
                      </td>
                      <td className="py-2.5 pr-3 text-xs text-beige">
                        {formatDate(entry.date)}
                        <span className="ml-1 text-gold/70">{entry.time}</span>
                      </td>
                      <td className="py-2.5 pr-3 text-beige">{entry.guests}</td>
                      <td className="py-2.5">
                        <StatusPill status={entry.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>

        <Panel title="Recent orders">
          {recentOrders.length === 0 ? (
            <EmptyState message="No online orders yet." />
          ) : (
            <ul className="divide-y divide-cream/8">
              {recentOrders.map((order) => (
                <li key={order.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-cream/90">{order.customer_name}</p>
                    <p className="text-[11px] text-beige/50">
                      {formatDateTime(order.created_at)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-sm text-gold">{formatPrice(order.total)}</span>
                    <StatusPill status={order.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}
