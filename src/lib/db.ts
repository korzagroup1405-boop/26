import { Pool, type QueryResultRow } from 'pg';

const globalForDb = globalThis as unknown as { __mknPool?: Pool };

export const pool =
  globalForDb.__mknPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL ?? 'postgres://mekan76:mekan76@db:5432/mekan76',
    max: 10,
  });

globalForDb.__mknPool = pool;

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  const result = await pool.query<T>(text, params);
  return result.rows;
}

export async function one<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = [],
): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}
