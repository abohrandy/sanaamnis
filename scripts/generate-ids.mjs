/**
 * Regenerates the deterministic UUIDs used in src/lib/catalog.ts.
 *
 * Catalog ids must be stable: they are written into Postgres by the seed, and a
 * cart in a customer's browser stores variant ids directly. Deriving them from
 * the slug/SKU means the same product always gets the same id, on any machine,
 * so re-seeding never orphans an existing cart or order.
 *
 * Usage: node scripts/generate-ids.mjs [slug-or-sku ...]
 * With no arguments it prints ids for everything currently in the catalog.
 */
import { createHash } from "node:crypto";

/** UUIDv5-shaped id derived from a namespace and a name. */
export function deterministicId(namespace, name) {
  const hash = createHash("sha1").update(`sanaamnis:${namespace}:${name}`).digest();
  const bytes = Buffer.from(hash.subarray(0, 16));
  bytes[6] = (bytes[6] & 0x0f) | 0x50; // version 5
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // RFC 4122 variant
  const hex = bytes.toString("hex");
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join("-");
}

const args = process.argv.slice(2);

if (args.length > 0) {
  for (const name of args) {
    console.log(`${name}`);
    for (const ns of ["category", "product", "variant"]) {
      console.log(`  ${ns.padEnd(8)} ${deterministicId(ns, name)}`);
    }
  }
} else {
  const { CATALOG, CATEGORIES } = await import("../src/lib/catalog.ts");
  for (const category of Object.values(CATEGORIES)) {
    console.log(`category ${category.slug.padEnd(30)} ${deterministicId("category", category.slug)}`);
  }
  for (const product of CATALOG) {
    console.log(`product  ${product.slug.padEnd(30)} ${deterministicId("product", product.slug)}`);
    for (const variant of product.variants) {
      console.log(`variant  ${variant.sku.padEnd(30)} ${deterministicId("variant", variant.sku)}`);
    }
  }
}
