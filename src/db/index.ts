import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl && process.env.NODE_ENV === "production") {
  console.warn("DATABASE_URL environment variable is missing. Database queries will fall back to local dev database url.");
}

// Fallback logic to avoid crashing during static build/compilation checks if environment variables are not loaded yet
const connectionString = databaseUrl || "postgresql://postgres:postgres@localhost:5432/sana-amnis";

export const pool = new Pool({
  connectionString,
  ssl: databaseUrl ? { rejectUnauthorized: false } : undefined,
});

export const db = drizzle(pool, { schema });
export type DatabaseType = typeof db;
