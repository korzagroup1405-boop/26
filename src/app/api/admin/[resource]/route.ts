import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { RESOURCES } from '@/lib/adminResources';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ resource: string }> },
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { resource: name } = await params;
  const resource = RESOURCES[name];
  if (!resource) return NextResponse.json({ error: 'Unknown resource' }, { status: 404 });

  try {
    const rows = await query(
      `SELECT ${resource.listSelect ?? '*'} FROM ${resource.table} ORDER BY ${resource.order}`,
    );
    return NextResponse.json({ items: rows });
  } catch (error) {
    console.error('[admin:list]', error);
    return NextResponse.json({ error: 'Could not load records.' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ resource: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { resource: name } = await params;
  const resource = RESOURCES[name];
  if (!resource || !resource.canCreate) {
    return NextResponse.json({ error: 'Unknown resource' }, { status: 404 });
  }

  try {
    const body = await request.json();
    const entries = Object.entries(body).filter(
      ([key, value]) => resource.fields.includes(key) && value !== undefined,
    );
    if (entries.length === 0) {
      return NextResponse.json({ error: 'Nothing to save.' }, { status: 400 });
    }

    const columns = entries.map(([key]) => key);
    const placeholders = entries.map((_, index) => `$${index + 1}`);
    const values = entries.map(([, value]) => value);

    const rows = await query(
      `INSERT INTO ${resource.table} (${columns.join(', ')})
       VALUES (${placeholders.join(', ')})
       RETURNING *`,
      values,
    );

    return NextResponse.json({ item: rows[0] }, { status: 201 });
  } catch (error) {
    console.error('[admin:create]', error);
    return NextResponse.json({ error: 'Could not create the record.' }, { status: 500 });
  }
}
