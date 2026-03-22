import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export async function runMigrations() {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const pool = new Pool({
    connectionString,
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

  const db = drizzle(pool);

  try {
    // Run migrations from the migrations folder
    const migrationsFolder = process.env.MIGRATIONS_FOLDER || './drizzle';
    await migrate(db, { migrationsFolder });
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration error:', error);
    // If migrations fail, we continue - tables might be created manually
    console.log('Continuing without migrations...');
  } finally {
    await pool.end();
  }
}
