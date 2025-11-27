import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '@shared/schema';

// Use only DATABASE_URL for Railway compatibility
const databaseUrl = process.env.DATABASE_URL;

let pool: Pool;
let db: any;

try {
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  pool = new Pool({
    connectionString: databaseUrl,
    // Reduce connection timeout for quicker failure detection
    connectionTimeoutMillis: 5000,
  });

  db = drizzle(pool, { schema });

  pool.on('error', (err) => {
    console.warn('⚠️  PostgreSQL connection error:', err.message);
  });

  pool.on('connect', () => {
    console.log('✅ PostgreSQL connected successfully');
  });
} catch (error: any) {
  console.warn('⚠️  Database initialization warning:', error.message);
  console.warn('⚠️  Running in limited mode - frontend will work, but API requests will fail.');
  // Create a mock database object for development
  pool = null as any;
  db = null;
}

export { pool, db };