import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    // Perform simple query to verify database connection healthiness
    await db.execute(sql`SELECT 1`);

    // Ensure role column exists in user table (safe idempotent migration)
    await db.execute(
      sql`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer'`
    );

    // Auto-promote executive admin user if registered
    await db.execute(
      sql`UPDATE "user" SET role = 'admin' WHERE email IN ('abohrandy@gmail.com', 'me@randyaboh.com')`
    );
    
    return NextResponse.json(
      {
        status: "healthy",
        timestamp: new Date().toISOString(),
        database: "connected",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "degraded",
        timestamp: new Date().toISOString(),
        database: "disconnected",
      },
      { status: 200 }
    );
  }
}
