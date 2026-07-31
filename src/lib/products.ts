/**
 * Server-side product access.
 *
 * Every storefront page goes through here rather than querying Postgres directly,
 * so there is exactly one place that decides what a product looks like and exactly
 * one fallback path. Previously each page carried its own hardcoded mock array and
 * they disagreed with each other — the same coconut water was ₦3,000 on the
 * homepage and ₦4,500 on /shop.
 *
 * Database rows win when they exist. When the database is empty or unreachable we
 * fall back to src/lib/catalog.ts, which uses the same ids, so prices and cart
 * contents stay consistent either way.
 *
 * Server components only — this imports the database client.
 */
import { db } from "@/db";
import {
  CATALOG,
  CATEGORIES,
  PLACEHOLDER_IMAGE,
  type CatalogProduct,
  type CategorySlug,
} from "@/lib/catalog";

/** Categories that actually have at least one product, in catalog order. */
export function categoriesInUse(products: CatalogProduct[]) {
  const counts = new Map<CategorySlug, number>();
  for (const product of products) {
    counts.set(product.categorySlug, (counts.get(product.categorySlug) ?? 0) + 1);
  }
  return (Object.keys(CATEGORIES) as CategorySlug[])
    .filter((slug) => counts.has(slug))
    .map((slug) => ({ ...CATEGORIES[slug], count: counts.get(slug) ?? 0 }));
}

type DbProductRow = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  category: { id: string; name: string; slug: string; imageUrl: string | null } | null;
  variants: Array<{
    id: string;
    sku: string;
    name: string;
    price: string;
    stock: number;
    imageUrl: string | null;
    isActive: boolean;
  }>;
};

/**
 * Shape a database row like a catalog entry.
 *
 * Copy that lives only in the catalog (tagline, long description, the image list)
 * is merged back in by slug, because the products table has no column for it.
 */
function fromDb(row: DbProductRow): CatalogProduct {
  const seed = CATALOG.find((p) => p.slug === row.slug);
  const categorySlug = (row.category?.slug as CategorySlug) || seed?.categorySlug || "culinary";

  const variants = row.variants
    // A discontinued variant (isActive: false) stays in the database — order
    // history references it (FK restrict) — but stops appearing for sale.
    .filter((v) => v.isActive)
    .map((v) => ({
      id: v.id,
      sku: v.sku,
      name: v.name,
      price: Number(v.price),
      stock: v.stock,
      imageUrl: v.imageUrl || undefined,
    }))
    .sort((a, b) => a.price - b.price);

  const images =
    seed?.images ??
    (variants.map((v) => v.imageUrl).filter(Boolean) as string[]);

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    tagline: seed?.tagline ?? "",
    description: row.description || seed?.description || "",
    categorySlug,
    images: images.length > 0 ? images : [PLACEHOLDER_IMAGE],
    variants: variants.length > 0 ? variants : (seed?.variants ?? []),
    badge: seed?.badge,
    photographyPending: seed?.photographyPending,
  };
}

/**
 * All purchasable products.
 *
 * Never throws: a database outage degrades to the catalog rather than taking the
 * storefront down with it.
 */
export async function getProducts(): Promise<CatalogProduct[]> {
  try {
    const rows = await db.query.products.findMany({
      where: (products, { eq }) => eq(products.isActive, true),
      with: { category: true, variants: true },
    });

    if (rows.length > 0) {
      return (rows as unknown as DbProductRow[])
        .map(fromDb)
        .filter((p) => p.variants.length > 0);
    }
  } catch (error) {
    console.error("[products] database unavailable, serving catalog fallback:", error);
  }

  return CATALOG;
}

/** A single product, or undefined when the slug does not exist anywhere. */
export async function getProduct(slug: string): Promise<CatalogProduct | undefined> {
  try {
    const row = await db.query.products.findFirst({
      where: (products, { eq }) => eq(products.slug, slug),
      with: { category: true, variants: true },
    });

    if (row && (row as unknown as DbProductRow).variants.length > 0) {
      return fromDb(row as unknown as DbProductRow);
    }
  } catch (error) {
    console.error(`[products] database unavailable for "${slug}", serving catalog fallback:`, error);
  }

  return CATALOG.find((p) => p.slug === slug);
}

/** Products for the homepage grid, in the order FEATURED_SLUGS defines. */
export async function getFeaturedProducts(slugs: readonly string[]): Promise<CatalogProduct[]> {
  const all = await getProducts();
  const bySlug = new Map(all.map((p) => [p.slug, p]));
  const featured = slugs.map((slug) => bySlug.get(slug)).filter(Boolean) as CatalogProduct[];
  // If the featured slugs have drifted from the catalog, fall back to the first few.
  return featured.length > 0 ? featured : all.slice(0, 4);
}

/**
 * Published reviews for a product, newest first.
 *
 * Returns an empty list when there are none — the product page shows an honest
 * empty state rather than the hardcoded testimonials that used to sit here.
 */
export async function getReviews(productId: string) {
  try {
    const rows = await db.query.reviews.findMany({
      where: (reviews, { eq }) => eq(reviews.productId, productId),
      orderBy: (reviews, { desc }) => [desc(reviews.createdAt)],
      limit: 12,
      with: { user: true },
    });

    return rows.map((row) => ({
      id: row.id,
      author: (row as { user?: { name?: string } }).user?.name || "Verified customer",
      rating: row.rating,
      comment: row.comment || "",
      date: row.createdAt.toLocaleDateString("en-NG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    }));
  } catch (error) {
    console.error(`[products] could not load reviews for ${productId}:`, error);
    return [];
  }
}

/** Products in the same category, excluding the one being viewed. */
export async function getRelatedProducts(
  product: CatalogProduct,
  limit = 4
): Promise<CatalogProduct[]> {
  const all = await getProducts();
  return all
    .filter((p) => p.slug !== product.slug && p.categorySlug === product.categorySlug)
    .slice(0, limit);
}
