import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? '').trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    await pool.query('INSERT INTO subscribers (email) VALUES ($1) ON CONFLICT (email) DO NOTHING', [
      email,
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[newsletter]', error);
    return NextResponse.json({ error: 'Could not subscribe right now.' }, { status: 500 });
  }
}
