import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) {
    return NextResponse.json({ error: 'Invalid reservation.' }, { status: 400 });
  }

  const rows = await query(
    `UPDATE reservations SET status = 'CANCELLED'
     WHERE id = $1 AND user_id = $2 AND status <> 'CANCELLED'
     RETURNING id, status`,
    [numericId, session.id],
  );

  if (rows.length === 0) {
    return NextResponse.json({ error: 'Reservation not found.' }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
