/**
 * Server-side distributor/pickup-location access — same DB-first-with-fallback
 * shape as src/lib/products.ts, src/lib/blog.ts, etc. Database rows win when
 * they exist; src/lib/content.ts's DISTRIBUTORS backstops an empty or
 * unreachable database.
 *
 * Server components only — this imports the database client.
 */
import { db } from "@/db";
import { DISTRIBUTORS, type Distributor } from "@/lib/content";

type DbDistributorRow = {
  slug: string;
  region: string;
  areasCovered: string | null;
  contactName: string | null;
  phone: string | null;
  whatsapp: string | null;
  address: string | null;
  notes: string | null;
};

function fromDb(row: DbDistributorRow): Distributor {
  return {
    slug: row.slug,
    region: row.region,
    areasCovered: row.areasCovered ?? undefined,
    contactName: row.contactName ?? undefined,
    phone: row.phone ?? undefined,
    whatsapp: row.whatsapp ?? undefined,
    address: row.address ?? undefined,
    notes: row.notes ?? undefined,
  };
}

export async function getDistributors(): Promise<Distributor[]> {
  try {
    const rows = await db.query.distributors.findMany({
      where: (distributors, { eq }) => eq(distributors.isPublished, true),
      orderBy: (distributors, { asc }) => [asc(distributors.sortOrder)],
    });
    if (rows.length > 0) {
      return (rows as unknown as DbDistributorRow[]).map(fromDb);
    }
  } catch (error) {
    console.error("[distributors] database unavailable, serving content fallback:", error);
  }
  return DISTRIBUTORS;
}
