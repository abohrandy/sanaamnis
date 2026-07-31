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
 *
 * The actual hashing lives in deterministic-id.mjs, imported (not redefined)
 * here, and also imported directly by src/db/seed.ts — that file has no
 * top-level await, unlike this one, which src/db/seed.ts (run via `tsx`, in
 * CJS mode) can't pull in without tripping esbuild's "top-level await isn't
 * supported in cjs" transform error.
 */
export { deterministicId } from "./deterministic-id.mjs";
import { deterministicId } from "./deterministic-id.mjs";

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
