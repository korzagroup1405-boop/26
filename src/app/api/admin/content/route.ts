import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { CONTENT_DEFAULTS } from '@/lib/content';

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const rows = await query<{ key: string; value: string }>('SELECT key, value FROM site_content');
  const content: Record<string, string> = { ...CONTENT_DEFAULTS };
  for (const row of rows) content[row.key] = row.value;
  return NextResponse.json({ content });
}

export async function PUT(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const entries = Object.entries(body).filter(
      ([key, value]) =>
        typeof value === 'string' && (key in CONTENT_DEFAULTS || key.startsWith('custom_')),
    );
    if (entries.length === 0) {
      return NextResponse.json({ error: 'Nothing to save.' }, { status: 400 });
    }

    for (const [key, value] of entries) {
      await query(
        `INSERT INTO site_content (key, value, updated_at) VALUES ($1, $2, now())
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
        [key, value],
      );
    }

    return NextResponse.json({ ok: true, saved: entries.length });
  } catch (error) {
    console.error('[admin:content]', error);
    return NextResponse.json({ error: 'Could not save the content.' }, { status: 500 });
  }
}
