import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '@shared/schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

pool.on('error', (err) => {
  console.error('PostgreSQL error:', err);
});

pool.on('connect', () => {
  console.log('✅ PostgreSQL connected successfully');
});
