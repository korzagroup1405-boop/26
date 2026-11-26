import { NextResponse } from 'next/server';
import { one } from '@/lib/db';
import { createSession, hashPassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name ?? '').trim();
    const email = String(body.email ?? '').trim().toLowerCase();
    const phone = String(body.phone ?? '').trim();
    const password = String(body.password ?? '');

    if (name.length < 2) {
      return NextResponse.json({ error: 'Please enter your full name.' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Your password needs at least 8 characters.' },
        { status: 400 },
      );
    }

    const existing = await one('SELECT id FROM users WHERE email = $1', [email]);
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Try signing in.' },
        { status: 409 },
      );
    }

    const passwordHash = await hashPassword(password);
    const user = await one<{ id: number; name: string; email: string; role: string }>(
      `INSERT INTO users (name, email, phone, password_hash, role)
       VALUES ($1, $2, $3, $4, 'CUSTOMER')
       RETURNING id, name, email, role`,
      [name, email, phone || null, passwordHash],
    );

    if (!user) {
      return NextResponse.json({ error: 'Could not create your account.' }, { status: 500 });
    }

    await createSession(user);
    return NextResponse.json({ user });
  } catch (error) {
    console.error('[signup]', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
