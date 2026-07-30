/**
 * Applies pending SQL migrations, then exits.
 *
 * Run before the server starts (see the Dockerfile CMD). Previously nothing ever
 * applied src/db/migrations to the deployed database, so only the auth tables
 * existed — created ad hoc by /api/health — and every product query failed,
 * which is why the storefront silently served hardcoded fallback data.
 *
 * Deliberately depends on `pg` alone. The production image contains Next's
 * standalone output, which traces `pg` but not drizzle-kit, so this reads the
 * journal and the .sql files directly instead of using drizzle's migrator.
 */
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const MIGRATIONS_DIR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "src",
  "db",
  "migrations"
);

const LEDGER = "__migrations";

/** Postgres error codes meaning "this object is already there". */
const ALREADY_EXISTS = new Set([
  "42P07", // duplicate_table
  "42710", // duplicate_object (constraints, indexes, types)
  "42701", // duplicate_column
  "42P06", // duplicate_schema
]);

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("[migrate] DATABASE_URL is not set — refusing to start.");
    process.exit(1);
  }

  const pool = new pg.Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    // A migration that cannot connect should fail the deploy quickly rather than
    // hang the container's start-up.
    connectionTimeoutMillis: 15_000,
  });

  const client = await pool.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS "${LEDGER}" (
        "tag" text PRIMARY KEY,
        "applied_at" timestamptz NOT NULL DEFAULT now()
      );
    `);

    const { rows } = await client.query(`SELECT tag FROM "${LEDGER}"`);
    const applied = new Set(rows.map((r) => r.tag));

    const files = (await readdir(MIGRATIONS_DIR))
      .filter((f) => f.endsWith(".sql"))
      .sort();

    let ran = 0;

    for (const file of files) {
      const tag = file.replace(/\.sql$/, "");
      if (applied.has(tag)) continue;

      const sql = await readFile(path.join(MIGRATIONS_DIR, file), "utf8");
      // drizzle-kit separates statements with this marker.
      const statements = sql
        .split("--> statement-breakpoint")
        .map((s) => s.trim())
        .filter(Boolean);

      console.log(`[migrate] applying ${tag} (${statements.length} statements)`);

      await client.query("BEGIN");
      try {
        let skipped = 0;
        for (const [i, statement] of statements.entries()) {
          // Each statement gets a savepoint so that tolerating one duplicate
          // object does not abort the surrounding transaction.
          await client.query(`SAVEPOINT s${i}`);
          try {
            await client.query(statement);
            await client.query(`RELEASE SAVEPOINT s${i}`);
          } catch (error) {
            if (ALREADY_EXISTS.has(error.code)) {
              // The deployed database was partially built by hand before this
              // migrator existed (/api/health used to CREATE TABLE on request),
              // so the baseline migration meets objects that already exist.
              await client.query(`ROLLBACK TO SAVEPOINT s${i}`);
              await client.query(`RELEASE SAVEPOINT s${i}`);
              skipped += 1;
              continue;
            }
            throw error;
          }
        }
        await client.query(`INSERT INTO "${LEDGER}" (tag) VALUES ($1)`, [tag]);
        await client.query("COMMIT");
        ran += 1;
        if (skipped > 0) {
          console.log(`[migrate]   ${skipped} statement(s) skipped — object already existed`);
        }
      } catch (error) {
        await client.query("ROLLBACK");
        throw new Error(`Migration ${tag} failed: ${error.message}`, { cause: error });
      }
    }

    console.log(
      ran === 0
        ? `[migrate] database already up to date (${files.length} migrations)`
        : `[migrate] applied ${ran} migration(s)`
    );
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error("[migrate]", error);
  process.exit(1);
});
