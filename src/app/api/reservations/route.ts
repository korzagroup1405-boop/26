import { NextResponse } from 'next/server';
import { one, query } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { CAPACITY_PER_SLOT, TIME_SLOTS } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name ?? '').trim();
    const email = String(body.email ?? '').trim().toLowerCase();
    const phone = String(body.phone ?? '').trim();
    const date = String(body.date ?? '').trim();
    const time = String(body.time ?? '').trim();
    const guests = Number(body.guests);
    const requests = String(body.requests ?? '').trim() || null;

    if (name.length < 2) {
      return NextResponse.json({ error: 'Please tell us your name.' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }
    if (phone.replace(/\D/g, '').length < 7) {
      return NextResponse.json({ error: 'Please enter a reachable phone number.' }, { status: 400 });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ error: 'Please choose a valid date.' }, { status: 400 });
    }
    const today = new Date().toISOString().slice(0, 10);
    if (date < today) {
      return NextResponse.json({ error: 'Please choose today or a future date.' }, { status: 400 });
    }
    if (!TIME_SLOTS.includes(time)) {
      return NextResponse.json({ error: 'Please choose a sitting time.' }, { status: 400 });
    }
    if (!Number.isInteger(guests) || guests < 1 || guests > 8) {
      return NextResponse.json(
        { error: 'Online reservations cover 1–8 guests. For larger parties please call us.' },
        { status: 400 },
      );
    }

    const booked = await one<{ total: string }>(
      `SELECT COALESCE(SUM(guests), 0)::text AS total
       FROM reservations
       WHERE date = $1 AND time = $2 AND status <> 'CANCELLED'`,
      [date, time],
    );
    if (Number(booked?.total ?? 0) + guests > CAPACITY_PER_SLOT) {
      return NextResponse.json(
        { error: 'That sitting is full. Please choose another time.' },
        { status: 409 },
      );
    }

    const session = await getSession();
    const reservation = await one<{
      id: number;
      name: string;
      email: string;
      date: string;
      time: string;
      guests: number;
      status: string;
    }>(
      `INSERT INTO reservations (name, email, phone, date, time, guests, requests, user_id, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'PENDING')
       RETURNING id, name, email, to_char(date, 'YYYY-MM-DD') AS date, time, guests, status`,
      [name, email, phone, date, time, guests, requests, session?.id ?? null],
    );

    return NextResponse.json({ reservation }, { status: 201 });
  } catch (error) {
    console.error('[reservations]', error);
    return NextResponse.json(
      { error: 'We could not save your reservation. Please try again.' },
      { status: 500 },
    );
  }
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const rows = await query(
    `SELECT id, name, email, phone, to_char(date, 'YYYY-MM-DD') AS date, time, guests,
            requests, status, created_at
     FROM reservations WHERE user_id = $1 ORDER BY date DESC, time DESC`,
    [session.id],
  );
  return NextResponse.json({ reservations: rows });
}
