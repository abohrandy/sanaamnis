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
    console.log("Seeding Coconut Categories...");
    const [organicWellness] = await db
      .insert(schema.categories)
      .values({
        name: "Organic Wellness",
        slug: "organic-wellness",
        imageUrl: "https://lh3.googleusercontent.com/aida/AP1WRLsnISaHCg5o21SrvBbZRdt8Qcl_tsL5caCWPyHPzlvMiBR7WZ5ltl4b6x8SXY7JoINwVeevisCReRMYVksaOuivD86v9Gd3sLH87Lekwd8eOJzsns4QOI3WRu2gIlhERvVW2nHQJG1wukkobTBbIcUviw8Y4_RBF6RIrCBnLg5Cb51z18bBhth15u82kTqhtDwxAPS-YjkJzyE6mYDYrLm7NIVKXYSAsOFHuC2U5ckPbXgKZHiQfLTm6VQ",
      })
      .onConflictDoNothing()
      .returning();

    const [premiumSkincare] = await db
      .insert(schema.categories)
      .values({
        name: "Premium Skincare",
        slug: "premium-skincare",
        imageUrl: "https://lh3.googleusercontent.com/aida/AP1WRLsnISaHCg5o21SrvBbZRdt8Qcl_tsL5caCWPyHPzlvMiBR7WZ5ltl4b6x8SXY7JoINwVeevisCReRMYVksaOuivD86v9Gd3sLH87Lekwd8eOJzsns4QOI3WRu2gIlhERvVW2nHQJG1wukkobTBbIcUviw8Y4_RBF6RIrCBnLg5Cb51z18bBhth15u82kTqhtDwxAPS-YjkJzyE6mYDYrLm7NIVKXYSAsOFHuC2U5ckPbXgKZHiQfLTm6VQ",
      })
      .onConflictDoNothing()
      .returning();

    const wellnessCatId = organicWellness?.id || "00000000-0000-0000-0000-000000000001";
    const skincareCatId = premiumSkincare?.id || "00000000-0000-0000-0000-000000000002";

    // 3. Products
    console.log("Seeding Coconut Products and Variants...");
    
    // Product 1: Extra Virgin Coconut Oil
    const [oilProduct] = await db
      .insert(schema.products)
      .values({
        title: "Extra Virgin Coconut Oil",
        slug: "extra-virgin-coconut-oil",
        description: "Cold-pressed from fresh organic coconuts in Nigeria, retaining all nutritional benefits and a delicate aroma.",
        categoryId: wellnessCatId,
        isActive: true,
      })
      .onConflictDoNothing()
      .returning();

    if (oilProduct) {
      await db
        .insert(schema.productVariants)
        .values([
          {
            productId: oilProduct.id,
            sku: "SA-COCO-OIL-250",
            name: "250ml Glass Jar",
            price: "15000.00",
            stock: 50,
            imageUrl: "https://lh3.googleusercontent.com/aida/AP1WRLtEqIT_GCpHNQ86QNj1d3bPOlvb9nkQc6svZvyYlyg1Hk3RZHwiIAPv9YCbyw1u0Rj0p73zt-Argu2A7GH5nvmHI045TzwWA2e9fL9omZXhv5idqLb76Wg3h89GyuMytVRKzJIsliofcN_BAcgsvJVHo8b5f8Q8aqeRAb1U7k9geoURsq168OaQUixCGl-WU2SRNk4SwilDr4UJkc83bAJamhtHfvfo0sh9qggUZS3nksvuQahllqEWWw",
          },
          {
            productId: oilProduct.id,
            sku: "SA-COCO-OIL-500",
            name: "500ml Glass Jar",
            price: "28000.00",
            stock: 35,
            imageUrl: "https://lh3.googleusercontent.com/aida/AP1WRLtEqIT_GCpHNQ86QNj1d3bPOlvb9nkQc6svZvyYlyg1Hk3RZHwiIAPv9YCbyw1u0Rj0p73zt-Argu2A7GH5nvmHI045TzwWA2e9fL9omZXhv5idqLb76Wg3h89GyuMytVRKzJIsliofcN_BAcgsvJVHo8b5f8Q8aqeRAb1U7k9geoURsq168OaQUixCGl-WU2SRNk4SwilDr4UJkc83bAJamhtHfvfo0sh9qggUZS3nksvuQahllqEWWw",
          },
        ])
        .onConflictDoNothing();
    }

    // Product 2: Organic Coconut Water
    const [waterProduct] = await db
      .insert(schema.products)
      .values({
        title: "Organic Coconut Water",
        slug: "organic-coconut-water",
        description: "100% natural, refreshing coconut water packed with electrolytes, sustainably bottled at the source.",
        categoryId: wellnessCatId,
        isActive: true,
      })
      .onConflictDoNothing()
      .returning();

    if (waterProduct) {
      await db
        .insert(schema.productVariants)
        .values([
          {
            productId: waterProduct.id,
            sku: "SA-COCO-WTR-330",
            name: "330ml Bottle",
            price: "4500.00",
            stock: 120,
            imageUrl: "https://lh3.googleusercontent.com/aida/AP1WRLsnISaHCg5o21SrvBbZRdt8Qcl_tsL5caCWPyHPzlvMiBR7WZ5ltl4b6x8SXY7JoINwVeevisCReRMYVksaOuivD86v9Gd3sLH87Lekwd8eOJzsns4QOI3WRu2gIlhERvVW2nHQJG1wukkobTBbIcUviw8Y4_RBF6RIrCBnLg5Cb51z18bBhth15u82kTqhtDwxAPS-YjkJzyE6mYDYrLm7NIVKXYSAsOFHuC2U5ckPbXgKZHiQfLTm6VQ",
          },
        ])
        .onConflictDoNothing();
    }

    // Product 3: Coconut Body Butter
    const [butterProduct] = await db
      .insert(schema.products)
      .values({
        title: "Nourishing Coconut Body Butter",
        slug: "coconut-body-butter",
        description: "Ultra-hydrating body moisturizer made with cold-pressed coconut butter and whipped natural oils.",
        categoryId: skincareCatId,
        isActive: true,
      })
      .onConflictDoNothing()
      .returning();

    if (butterProduct) {
      await db
        .insert(schema.productVariants)
        .values([
          {
            productId: butterProduct.id,
            sku: "SA-COCO-BTR-200",
            name: "200ml Premium Jar",
            price: "18000.00",
            stock: 40,
            imageUrl: "https://lh3.googleusercontent.com/aida/AP1WRLsnISaHCg5o21SrvBbZRdt8Qcl_tsL5caCWPyHPzlvMiBR7WZ5ltl4b6x8SXY7JoINwVeevisCReRMYVksaOuivD86v9Gd3sLH87Lekwd8eOJzsns4QOI3WRu2gIlhERvVW2nHQJG1wukkobTBbIcUviw8Y4_RBF6RIrCBnLg5Cb51z18bBhth15u82kTqhtDwxAPS-YjkJzyE6mYDYrLm7NIVKXYSAsOFHuC2U5ckPbXgKZHiQfLTm6VQ",
          },
        ])
        .onConflictDoNothing();
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
