import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { CAPACITY_PER_SLOT, TIME_SLOTS } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date') ?? '';

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'A valid date is required.' }, { status: 400 });
  }

  try {
    const rows = await query<{ time: string; booked: string }>(
      `SELECT time, COALESCE(SUM(guests), 0)::text AS booked
       FROM reservations
       WHERE date = $1 AND status <> 'CANCELLED'
       GROUP BY time`,
      [date],
    );

    const slots: Record<string, number> = {};
    for (const slot of TIME_SLOTS) slots[slot] = 0;
    for (const row of rows) slots[row.time] = Number(row.booked);

    return NextResponse.json({ date, capacity: CAPACITY_PER_SLOT, slots });
  } catch (error) {
    console.error('[availability]', error);
    return NextResponse.json({ date, capacity: CAPACITY_PER_SLOT, slots: {} });
  }
}
