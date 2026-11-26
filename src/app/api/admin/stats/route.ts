import { NextResponse } from 'next/server';
import { one, query } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const [kpis, density, popular, upcoming, recentOrders] = await Promise.all([
      one<{
        today: number;
        pending: number;
        guests_today: string;
        customers: number;
        menu_items: number;
        new_orders: number;
        revenue: string;
        subscribers: number;
      }>(`
        SELECT
          (SELECT count(*)::int FROM reservations WHERE date = CURRENT_DATE) AS today,
          (SELECT count(*)::int FROM reservations WHERE status = 'PENDING') AS pending,
          (SELECT COALESCE(SUM(guests), 0)::text FROM reservations WHERE date = CURRENT_DATE AND status <> 'CANCELLED') AS guests_today,
          (SELECT count(*)::int FROM users WHERE role = 'CUSTOMER') AS customers,
          (SELECT count(*)::int FROM menu_items) AS menu_items,
          (SELECT count(*)::int FROM orders WHERE status = 'NEW') AS new_orders,
          (SELECT COALESCE(SUM(total), 0)::text FROM orders WHERE status <> 'CANCELLED') AS revenue,
          (SELECT count(*)::int FROM subscribers) AS subscribers
      `),
      query<{ day: string; reservations: number; guests: number }>(`
        SELECT to_char(d.day, 'YYYY-MM-DD') AS day,
               (SELECT count(*)::int FROM reservations r WHERE r.date = d.day AND r.status <> 'CANCELLED') AS reservations,
               (SELECT COALESCE(SUM(guests), 0)::int FROM reservations r WHERE r.date = d.day AND r.status <> 'CANCELLED') AS guests
        FROM generate_series(CURRENT_DATE, CURRENT_DATE + 6, interval '1 day') AS d(day)
      `),
      query<{ name: string; qty: number }>(`
        SELECT item->>'name' AS name, SUM((item->>'qty')::int)::int AS qty
        FROM orders, jsonb_array_elements(items) AS item
        WHERE status <> 'CANCELLED'
        GROUP BY 1 ORDER BY qty DESC LIMIT 5
      `),
      query(`
        SELECT id, name, email, phone, to_char(date, 'YYYY-MM-DD') AS date, time, guests, status, requests
        FROM reservations
        WHERE date >= CURRENT_DATE AND status <> 'CANCELLED'
        ORDER BY date ASC, time ASC LIMIT 6
      `),
      query(`
        SELECT id, customer_name, phone, total, status, created_at
        FROM orders ORDER BY created_at DESC LIMIT 5
      `),
    ]);

    return NextResponse.json({
      kpis: {
        today: kpis?.today ?? 0,
        pending: kpis?.pending ?? 0,
        guestsToday: Number(kpis?.guests_today ?? 0),
        customers: kpis?.customers ?? 0,
        menuItems: kpis?.menu_items ?? 0,
        newOrders: kpis?.new_orders ?? 0,
        revenue: Number(kpis?.revenue ?? 0),
        subscribers: kpis?.subscribers ?? 0,
      },
      density,
      popular,
      upcoming,
      recentOrders,
    });
  } catch (error) {
    console.error('[admin:stats]', error);
    return NextResponse.json({ error: 'Could not load statistics.' }, { status: 500 });
  }
}
