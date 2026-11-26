import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { one } from './db';
import type { SessionUser } from './types';

const COOKIE_NAME = 'mkn_session';
const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || 'mekan76-development-only-secret-please-rotate',
);

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(user: SessionUser) {
  const token = await new SignJWT({
    sub: String(user.id),
    name: user.name,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(secret);

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    secure: process.env.NODE_ENV === 'production',
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return {
      id: Number(payload.sub),
      name: String(payload.name ?? ''),
      email: String(payload.email ?? ''),
      role: String(payload.role ?? 'CUSTOMER'),
    };
  } catch {
    return null;
  }
}

/** Reads the session and confirms the user still exists in the database. */
export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;
  const row = await one<{
    id: number;
    name: string;
    email: string;
    role: string;
    phone: string | null;
    created_at: Date;
  }>('SELECT id, name, email, role, phone, created_at FROM users WHERE id = $1', [session.id]);
  return row;
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') return null;
  return user;
}
