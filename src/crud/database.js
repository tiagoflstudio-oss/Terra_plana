import { neon } from '@neondatabase/serverless';

const databaseUrl = import.meta.env.NEON_DATABASE_URL;

export const sql = databaseUrl ? neon(databaseUrl) : null;

export const isConfigured = () => !!sql;

export const testConnection = async () => {
  if (!sql) return { success: false, error: 'Database not configured' };
  
  try {
    const result = await sql`SELECT 1 as test`;
    return { success: true, result };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export default sql;
