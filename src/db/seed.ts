/**
 * Seeds reference data into Postgres from src/lib/catalog.ts.
 *
 * The catalog is the single source of truth: this script only copies it into the
 * database. Because catalog ids are deterministic, re-running the seed updates
 * existing rows in place rather than creating duplicates, and never invalidates a
 * variant id that a customer already has sitting in their cart.
 *
 * Usage: DATABASE_URL=... npm run db:seed
 * Safe to run repeatedly. Run migrations first (npm run db:migrate).
 */
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { eq, inArray } from "drizzle-orm";
import * as schema from "./schema";
import { CATALOG, CATEGORIES } from "../lib/catalog";
import { ARTICLES, RECIPES, FAQS, DISTRIBUTORS } from "../lib/content";
import { deterministicId } from "../../scripts/deterministic-id.mjs";

const ADMIN_EMAILS = (process.env.SEED_ADMIN_EMAILS || "abohrandy@gmail.com,me@randyaboh.com")
  .split(",")
  .map((e) => e.trim())
  .filter(Boolean);

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("[seed] DATABASE_URL is not set.");
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15_000,
  });
  const db = drizzle(pool, { schema });

  try {
    // --- Roles & permissions -------------------------------------------------
    console.log("[seed] roles and permissions");
    await db
      .insert(schema.roles)
      .values([
        { name: "admin", description: "Full administrative access." },
        { name: "editor", description: "Can edit catalog and content." },
        { name: "customer", description: "Registered shopper." },
      ])
      .onConflictDoNothing({ target: schema.roles.name });

    await db
      .insert(schema.permissions)
      .values([
        { action: "manage:all", description: "Superuser action" },
        { action: "edit:content", description: "Modify CMS blocks" },
        { action: "edit:catalog", description: "Modify products and pricing" },
      ])
      .onConflictDoNothing({ target: schema.permissions.action });

    const adminRole = await db.query.roles.findFirst({ where: eq(schema.roles.name, "admin") });
    const allPermissions = await db.query.permissions.findMany();
    if (adminRole && allPermissions.length > 0) {
      await db
        .insert(schema.rolePermissions)
        .values(allPermissions.map((p) => ({ roleId: adminRole.id, permissionId: p.id })))
        .onConflictDoNothing();
    }

    // --- Categories ----------------------------------------------------------
    const categories = Object.values(CATEGORIES);
    console.log(`[seed] ${categories.length} categories`);
    for (const category of categories) {
      await db
        .insert(schema.categories)
        .values({ id: category.id, name: category.name, slug: category.slug })
        .onConflictDoUpdate({
          target: schema.categories.id,
          set: { name: category.name, slug: category.slug },
        });
    }

    // --- Products & variants -------------------------------------------------
    console.log(`[seed] ${CATALOG.length} products`);
    for (const product of CATALOG) {
      await db
        .insert(schema.products)
        .values({
          id: product.id,
          title: product.title,
          slug: product.slug,
          description: product.description,
          categoryId: CATEGORIES[product.categorySlug].id,
          isActive: true,
        })
        .onConflictDoUpdate({
          target: schema.products.id,
          set: {
            title: product.title,
            slug: product.slug,
            description: product.description,
            categoryId: CATEGORIES[product.categorySlug].id,
            isActive: true,
          },
        });

      for (const variant of product.variants) {
        await db
          .insert(schema.productVariants)
          .values({
            id: variant.id,
            productId: product.id,
            sku: variant.sku,
            name: variant.name,
            price: variant.price.toFixed(2),
            stock: variant.stock,
            imageUrl: variant.imageUrl || product.images[0],
          })
          .onConflictDoUpdate({
            target: schema.productVariants.id,
            set: {
              productId: product.id,
              sku: variant.sku,
              name: variant.name,
              price: variant.price.toFixed(2),
              imageUrl: variant.imageUrl || product.images[0],
            },
          });
      }
    }

    // Retire anything in the database that the catalog no longer lists. Kept as a
    // soft delete because order_items references variants with ON DELETE RESTRICT,
    // so historic orders must stay readable.
    const catalogIds = CATALOG.map((p) => p.id);
    const stale = await db.query.products.findMany({
      where: (products, { notInArray }) => notInArray(products.id, catalogIds),
    });
    if (stale.length > 0) {
      await db
        .update(schema.products)
        .set({ isActive: false })
        .where(inArray(schema.products.id, stale.map((p) => p.id)));
      console.log(`[seed] deactivated ${stale.length} product(s) no longer in the catalog`);
    }

    // Same for variants — e.g. a size that's been replaced (250g swapped for
    // 100g) leaves its old row in place, referenced by any historical orders,
    // but it must stop being sold.
    const catalogVariantIds = CATALOG.flatMap((p) => p.variants.map((v) => v.id));
    const staleVariants = await db.query.productVariants.findMany({
      where: (variants, { notInArray }) => notInArray(variants.id, catalogVariantIds),
    });
    if (staleVariants.length > 0) {
      await db
        .update(schema.productVariants)
        .set({ isActive: false })
        .where(inArray(schema.productVariants.id, staleVariants.map((v) => v.id)));
      console.log(`[seed] deactivated ${staleVariants.length} variant(s) no longer in the catalog`);
    }

    // --- Journal, recipes & FAQs ----------------------------------------------
    // Seeds src/lib/content.ts's fallback data as the starting rows, using the
    // same deterministic-id + onConflictDoUpdate pattern as products above, so
    // re-running this never duplicates what an admin has since edited by hand —
    // it only touches rows whose id still matches the original seed content.
    console.log(`[seed] ${ARTICLES.length} journal articles`);
    for (const article of ARTICLES) {
      const content = article.body
        .map((section) => (section.heading ? `## ${section.heading}\n\n${section.paragraphs.join("\n\n")}` : section.paragraphs.join("\n\n")))
        .join("\n\n");

      await db
        .insert(schema.blogPosts)
        .values({
          id: deterministicId("blog-post", article.slug),
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          content,
          category: article.category,
          imageUrl: article.image,
          isPublished: true,
          publishedAt: new Date(article.date),
        })
        .onConflictDoUpdate({
          target: schema.blogPosts.id,
          set: { title: article.title, slug: article.slug, excerpt: article.excerpt, content, category: article.category, imageUrl: article.image },
        });
    }

    console.log(`[seed] ${RECIPES.length} recipes`);
    for (const recipe of RECIPES) {
      await db
        .insert(schema.recipes)
        .values({
          id: deterministicId("recipe", recipe.slug),
          title: recipe.title,
          slug: recipe.slug,
          excerpt: recipe.excerpt,
          imageUrl: recipe.image,
          difficulty: recipe.difficulty,
          durationLabel: recipe.duration,
          servingsLabel: recipe.serves,
          ingredients: recipe.ingredients,
          instructions: recipe.steps.join("\n"),
          tip: recipe.tip ?? null,
          usesProductSlugs: recipe.usesProducts,
          isPublished: true,
        })
        .onConflictDoUpdate({
          target: schema.recipes.id,
          set: {
            title: recipe.title,
            slug: recipe.slug,
            excerpt: recipe.excerpt,
            imageUrl: recipe.image,
            difficulty: recipe.difficulty,
            durationLabel: recipe.duration,
            servingsLabel: recipe.serves,
            ingredients: recipe.ingredients,
            instructions: recipe.steps.join("\n"),
            tip: recipe.tip ?? null,
            usesProductSlugs: recipe.usesProducts,
          },
        });
    }

    console.log(`[seed] ${FAQS.length} FAQs`);
    for (const [index, faq] of FAQS.entries()) {
      await db
        .insert(schema.faqs)
        .values({
          id: deterministicId("faq", faq.question),
          question: faq.question,
          answer: faq.answer,
          category: faq.category,
          sortOrder: index,
        })
        .onConflictDoUpdate({
          target: schema.faqs.id,
          set: { question: faq.question, answer: faq.answer, category: faq.category, sortOrder: index },
        });
    }

    console.log(`[seed] ${DISTRIBUTORS.length} distributor/pickup locations`);
    for (const [index, entry] of DISTRIBUTORS.entries()) {
      const values = {
        region: entry.region,
        slug: entry.slug,
        areasCovered: entry.areasCovered ?? null,
        contactName: entry.contactName ?? null,
        phone: entry.phone ?? null,
        whatsapp: entry.whatsapp ?? null,
        address: entry.address ?? null,
        notes: entry.notes ?? null,
        sortOrder: index,
      };
      await db
        .insert(schema.distributors)
        .values({ id: deterministicId("distributor", entry.slug), ...values })
        .onConflictDoUpdate({ target: schema.distributors.id, set: values });
    }

    // --- Store settings ------------------------------------------------------
    console.log("[seed] settings and coupons");
    await db
      .insert(schema.coupons)
      .values([
        { code: "AMNISVIP", discountValue: "20.00", discountType: "percentage", isActive: true },
      ])
      .onConflictDoNothing({ target: schema.coupons.code });

    for (const [id, value] of Object.entries({
      "site-name": "Sana Amnis",
      "contact-email": "concierge@sanaamnis.com",
      "contact-phone": "+234 812 345 6789",
    })) {
      await db
        .insert(schema.settings)
        .values({ id, value })
        .onConflictDoUpdate({ target: schema.settings.id, set: { value } });
    }

    // --- Admin bootstrap -----------------------------------------------------
    if (ADMIN_EMAILS.length > 0) {
      const promoted = await db
        .update(schema.user)
        .set({ role: "admin" })
        .where(inArray(schema.user.email, ADMIN_EMAILS))
        .returning({ email: schema.user.email });
      console.log(
        promoted.length > 0
          ? `[seed] promoted to admin: ${promoted.map((u) => u.email).join(", ")}`
          : "[seed] no registered users matched SEED_ADMIN_EMAILS"
      );
    }

    const variantCount = CATALOG.reduce((n, p) => n + p.variants.length, 0);
    console.log(
      `[seed] done — ${CATALOG.length} products, ${variantCount} variants, ${ARTICLES.length} articles, ${RECIPES.length} recipes, ${FAQS.length} FAQs, ${DISTRIBUTORS.length} distributors`
    );
  } catch (error) {
    console.error("[seed] failed:", error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
