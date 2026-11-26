import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { RESOURCES } from '@/lib/adminResources';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ resource: string; id: string }> },
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { resource: name, id } = await params;
  const resource = RESOURCES[name];
  if (!resource) return NextResponse.json({ error: 'Unknown resource' }, { status: 404 });

  const numericId = Number(id);
  if (!Number.isInteger(numericId)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const entries = Object.entries(body).filter(
      ([key, value]) => resource.fields.includes(key) && value !== undefined,
    );
    if (entries.length === 0) {
      return NextResponse.json({ error: 'Nothing to update.' }, { status: 400 });
    }

    const assignments = entries.map(([key], index) => `${key} = $${index + 1}`);
    const values = entries.map(([, value]) => value);

    const rows = await query(
      `UPDATE ${resource.table} SET ${assignments.join(', ')}
       WHERE id = $${entries.length + 1} RETURNING *`,
      [...values, numericId],
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Record not found.' }, { status: 404 });
    }

    return NextResponse.json({ item: rows[0] });
  } catch (error) {
    console.error('[admin:update]', error);
    return NextResponse.json({ error: 'Could not update the record.' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ resource: string; id: string }> },
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { resource: name, id } = await params;
  const resource = RESOURCES[name];
  if (!resource || !resource.canDelete) {
    return NextResponse.json({ error: 'Unknown resource' }, { status: 404 });
  }

  const numericId = Number(id);
  if (!Number.isInteger(numericId)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  try {
    await query(`DELETE FROM ${resource.table} WHERE id = $1`, [numericId]);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[admin:delete]', error);
    return NextResponse.json({ error: 'Could not delete the record.' }, { status: 500 });
  }
}
