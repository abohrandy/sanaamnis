import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/db";

export const dynamic = "force-dynamic";

/**
 * Liveness probe for Railway. Read-only by design.
 *
 * This endpoint previously ran CREATE TABLE / ALTER TABLE on every unauthenticated
 * request and executed `UPDATE "user" SET role='admin', email_verified=true` for two
 * hardcoded addresses — a public endpoint that granted privileges and force-verified
 * emails, and one that let anyone trigger repeated DDL locks.
 *
 * Schema creation now belongs to scripts/migrate.mjs, which runs once at container
 * start. Granting admin belongs to the seed.
 */
export async function GET() {
  try {
    await db.execute(sql`SELECT 1`);
    return NextResponse.json({
      status: "healthy",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[health] database check failed:", error);
    // Still 200 so a database blip does not make Railway kill a serving container;
    // the body carries the real state for monitoring.
    return NextResponse.json({
      status: "degraded",
      database: "disconnected",
      timestamp: new Date().toISOString(),
    });
  }
}
