import { NextResponse } from 'next/server';
import { one } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const customerName = String(body.customerName ?? '').trim();
    const phone = String(body.phone ?? '').trim();
    const email = String(body.email ?? '').trim() || null;
    const note = String(body.note ?? '').trim() || null;
    const rawItems: { id?: unknown; qty?: unknown }[] = Array.isArray(body.items)
      ? body.items
      : [];

    if (customerName.length < 2) {
      return NextResponse.json({ error: 'Please add your name.' }, { status: 400 });
    }
    if (phone.replace(/\D/g, '').length < 7) {
      return NextResponse.json({ error: 'Please add a reachable phone number.' }, { status: 400 });
    }
    if (rawItems.length === 0) {
      return NextResponse.json({ error: 'Your order is empty.' }, { status: 400 });
    }

    const requested = rawItems
      .map((item) => ({
        id: Number(item.id),
        qty: Math.max(1, Math.min(20, Number(item.qty) || 1)),
      }))
      .filter((item) => Number.isInteger(item.id) && item.id > 0)
      .slice(0, 30);

    if (requested.length === 0) {
      return NextResponse.json({ error: 'Your order is empty.' }, { status: 400 });
    }

    const ids = requested.map((item) => item.id);
    const rows = await one<{ items: { id: number; name: string; price: string }[] }>(
      `SELECT json_agg(json_build_object('id', id, 'name', name, 'price', price)) AS items
       FROM menu_items WHERE id = ANY($1::int[]) AND is_available = true`,
      [ids],
    );

    const priced: { id: number; name: string; price: string }[] = rows?.items ?? [];
    if (priced.length === 0) {
      return NextResponse.json(
        { error: 'These items are no longer available. Please refresh the menu.' },
        { status: 409 },
      );
    }

    const items = requested
      .map((item) => {
        const found = priced.find((entry) => entry.id === item.id);
        if (!found) return null;
        return {
          id: found.id,
          name: found.name,
          price: Number(found.price),
          qty: item.qty,
        };
      })
      .filter(Boolean) as { id: number; name: string; price: number; qty: number }[];

    if (items.length === 0) {
      return NextResponse.json({ error: 'Your order is empty.' }, { status: 400 });
    }

    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

    const session = await getSession();
    const order = await one<{ id: number; total: string; status: string }>(
      `INSERT INTO orders (customer_name, phone, email, items, total, note)
       VALUES ($1, $2, $3, $4::jsonb, $5, $6)
       RETURNING id, total, status`,
      [customerName, phone, email ?? session?.email ?? null, JSON.stringify(items), total, note],
    );

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error('[orders]', error);
    return NextResponse.json({ error: 'We could not place your order.' }, { status: 500 });
  }
}
