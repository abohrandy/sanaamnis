import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import { eq } from "drizzle-orm";

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("DATABASE_URL is missing. Skipping database seeding.");
    return;
  }

  console.log("Connecting to database for seeding...");
  const pool = new Pool({ connectionString: databaseUrl });
  const db = drizzle(pool, { schema });

  try {
    console.log("Initializing database seed...");

    // 1. Roles & Permissions
    console.log("Seeding Roles and Permissions...");
    const [adminRole] = await db
      .insert(schema.roles)
      .values({
        name: "admin",
        description: "Concierge executive dashboard admin.",
      })
      .onConflictDoNothing()
      .returning();

    const [customerRole] = await db
      .insert(schema.roles)
      .values({
        name: "customer",
        description: "Registered shopper.",
      })
      .onConflictDoNothing()
      .returning();

    const roleToUse = adminRole || { id: "00000000-0000-0000-0000-000000000000" };

    const seededPermissions = await db
      .insert(schema.permissions)
      .values([
        { action: "manage:all", description: "Superuser action" },
        { action: "edit:content", description: "Modify CMS blocks" },
      ])
      .onConflictDoNothing()
      .returning();

    if (seededPermissions.length > 0 && adminRole) {
      await db
        .insert(schema.rolePermissions)
        .values(
          seededPermissions.map((p) => ({
            roleId: adminRole.id,
            permissionId: p.id,
          }))
        )
        .onConflictDoNothing();
    }

    // 2. Categories
    console.log("Seeding Categories...");
    const [coatsCat] = await db
      .insert(schema.categories)
      .values({
        name: "Outerwear & Coats",
        slug: "coats",
        imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600",
      })
      .onConflictDoNothing()
      .returning();

    const [knitwearCat] = await db
      .insert(schema.categories)
      .values({
        name: "Premium Knitwear",
        slug: "knitwear",
        imageUrl: "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?q=80&w=600",
      })
      .onConflictDoNothing()
      .returning();

    // 3. Products
    console.log("Seeding Products and Variants...");
    if (coatsCat) {
      const [overcoat] = await db
        .insert(schema.products)
        .values({
          title: "Amnis Cashmere Overcoat",
          slug: "amnis-cashmere-overcoat",
          description: "Tailored with clean minimalist lines and lined with ultra-soft Mongolian cashmere.",
          categoryId: coatsCat.id,
          isActive: true,
        })
        .onConflictDoNothing()
        .returning();

      if (overcoat) {
        await db
          .insert(schema.productVariants)
          .values([
            {
              productId: overcoat.id,
              sku: "AM-CASH-OCT-M",
              name: "Medium / Camel",
              price: "185000.00",
              stock: 8,
              imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600",
            },
            {
              productId: overcoat.id,
              sku: "AM-CASH-OCT-L",
              name: "Large / Camel",
              price: "185000.00",
              stock: 4,
              imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600",
            },
          ])
          .onConflictDoNothing();
      }
    }

    // 4. Coupons
    console.log("Seeding Vouchers...");
    await db
      .insert(schema.coupons)
      .values([
        {
          code: "AMNISVIP",
          discountValue: "20.00",
          discountType: "percentage",
          isActive: true,
        },
      ])
      .onConflictDoNothing();

    // 5. Site Settings
    console.log("Seeding Corporate Site Settings...");
    await db
      .insert(schema.settings)
      .values([
        { id: "site-name", value: "Sana Amnis" },
        { id: "contact-email", value: "concierge@sanaamnis.com" },
        { id: "contact-phone", value: "+234 812 345 6789" },
      ])
      .onConflictDoNothing();

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Database seeding failed:", error);
  } finally {
    await pool.end();
  }
}

main();
