import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { orders, orderItems, productVariants } from "@/db/schema";
import { auth } from "@/lib/auth";
import { initializePaystackPayment } from "@/lib/paystack";
import { computeTotals, type PricedLine } from "@/lib/pricing";
import { findVariant } from "@/lib/catalog";
import { BUNDLES as CATALOG_BUNDLES } from "@/lib/bundles";
import { findDeliveryZone } from "@/lib/deliveryZones";

export const dynamic = "force-dynamic";

const createOrderSchema = z
  .object({
    email: z.string().email(),
    name: z.string().min(2).max(120),
    deliveryMethod: z.enum(["pickup", "delivery"]),
    pickupLocation: z.string().max(160).optional(),
    shippingAddress: z.string().max(500).optional(),
    deliveryZoneSlug: z.string().max(80).optional(),
    items: z
      .array(
        z.object({
          variantId: z.string().uuid(),
          quantity: z.number().int().min(1).max(50),
        })
      )
      .max(40)
      .default([]),
    bundles: z
      .array(
        z.object({
          bundleId: z.string().uuid(),
          quantity: z.number().int().min(1).max(10),
        })
      )
      .max(10)
      .default([]),
  })
  .refine((data) => data.items.length > 0 || data.bundles.length > 0, {
    message: "Your cart is empty.",
    path: ["items"],
  })
  .refine((data) => data.deliveryMethod !== "pickup" || !!data.pickupLocation, {
    message: "Please choose a pickup location.",
    path: ["pickupLocation"],
  })
  .refine((data) => data.deliveryMethod !== "delivery" || !!data.shippingAddress, {
    message: "Please provide a delivery address.",
    path: ["shippingAddress"],
  });

interface RequestedComponent {
  variantId: string;
  quantity: number;
  bundleId: string | null;
}

/**
 * Resolves each requested bundle to its real DB price and expands it into its
 * component variants — one flat-priced line per bundle for the order subtotal
 * (so VAT is charged on what the customer actually pays, not the pre-discount
 * sum of parts), and one tagged RequestedComponent per component (for stock
 * checking and so the order records exactly what physical items shipped).
 * The bundle's price and contents are looked up here, never trusted from the
 * client, exactly like priceLines() below does for standalone items.
 */
async function priceBundles(bundleRequests: Array<{ bundleId: string; quantity: number }>) {
  const ids = bundleRequests.map((b) => b.bundleId);

  type Row = {
    id: string;
    price: string;
    items: Array<{ variantId: string; quantity: number }>;
  };
  let rows: Row[] = [];
  try {
    rows = (await db.query.bundles.findMany({
      where: (b, { inArray, and, eq }) => and(inArray(b.id, ids), eq(b.isPublished, true)),
      columns: { id: true, price: true },
      with: { items: { columns: { variantId: true, quantity: true } } },
    })) as unknown as Row[];
  } catch (error) {
    console.error("[orders] bundle lookup failed, pricing from catalog:", error);
  }

  const byId = new Map(rows.map((r) => [r.id, r]));
  const unknown: string[] = [];
  const components: RequestedComponent[] = [];
  const bundleLines: PricedLine[] = [];

  for (const req of bundleRequests) {
    const row = byId.get(req.bundleId);
    if (row) {
      for (const item of row.items) {
        components.push({ variantId: item.variantId, quantity: item.quantity * req.quantity, bundleId: req.bundleId });
      }
      bundleLines.push({ variantId: `bundle:${req.bundleId}`, quantity: req.quantity, unitPrice: Number(row.price) });
      continue;
    }

    // Same resilience as findVariant() below — if the database is briefly
    // unreachable, the bundle still prices correctly from its seed content.
    const fromCatalog = CATALOG_BUNDLES.find((b) => b.id === req.bundleId);
    if (fromCatalog) {
      for (const item of fromCatalog.items) {
        components.push({ variantId: item.variantId, quantity: item.quantity * req.quantity, bundleId: req.bundleId });
      }
      bundleLines.push({ variantId: `bundle:${req.bundleId}`, quantity: req.quantity, unitPrice: fromCatalog.price });
      continue;
    }

    unknown.push(req.bundleId);
  }

  return { components, bundleLines, unknownBundles: unknown };
}

/**
 * Server-side price for each requested component (standalone item or bundle
 * component). The client's price is never trusted; stock is checked against
 * the *combined* quantity needed per variant, since the same variant can show
 * up both as a standalone add-on and inside one or more bundles.
 */
async function priceComponents(requests: RequestedComponent[]) {
  const ids = [...new Set(requests.map((r) => r.variantId))];

  let rows: Array<{ id: string; price: string; stock: number; sku: string }> = [];
  try {
    rows = await db
      .select({
        id: productVariants.id,
        price: productVariants.price,
        stock: productVariants.stock,
        sku: productVariants.sku,
      })
      .from(productVariants)
      .where(inArray(productVariants.id, ids));
  } catch (error) {
    console.error("[orders] variant lookup failed, pricing from catalog:", error);
  }

  const byId = new Map(rows.map((r) => [r.id, r]));

  const priced = [];
  const unknown = new Set<string>();
  const neededByVariant = new Map<string, number>();
  const skuByVariant = new Map<string, string>();

  for (const req of requests) {
    const row = byId.get(req.variantId);

    if (row) {
      neededByVariant.set(req.variantId, (neededByVariant.get(req.variantId) ?? 0) + req.quantity);
      skuByVariant.set(req.variantId, row.sku);
      priced.push({ ...req, unitPrice: Number(row.price), sku: row.sku, persistable: true });
      continue;
    }

    // Catalog ids are the same ids we seed, so this still prices correctly if the
    // database is briefly unreachable. It will not be written as an order line.
    const fromCatalog = findVariant(req.variantId);
    if (fromCatalog) {
      neededByVariant.set(req.variantId, (neededByVariant.get(req.variantId) ?? 0) + req.quantity);
      skuByVariant.set(req.variantId, fromCatalog.variant.sku);
      priced.push({ ...req, unitPrice: fromCatalog.variant.price, sku: fromCatalog.variant.sku, persistable: false });
      continue;
    }

    unknown.add(req.variantId);
  }

  const outOfStock: string[] = [];
  for (const [variantId, needed] of neededByVariant) {
    const row = byId.get(variantId);
    if (row && row.stock < needed) outOfStock.push(skuByVariant.get(variantId) ?? variantId);
  }

  return { priced, unknown: [...unknown], outOfStock };
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request body." }, { status: 400 });
  }

  const parsed = createOrderSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check your details and try again.", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const input = parsed.data;

  // --- Price the order ourselves -------------------------------------------
  const { components, bundleLines, unknownBundles } = await priceBundles(input.bundles);

  if (unknownBundles.length > 0) {
    return NextResponse.json(
      {
        error: "Some bundles in your cart are no longer available. Please refresh the page and try again.",
        unknownBundles,
      },
      { status: 409 }
    );
  }

  const requests: RequestedComponent[] = [
    ...input.items.map((i) => ({ variantId: i.variantId, quantity: i.quantity, bundleId: null as string | null })),
    ...components,
  ];
  const { priced, unknown, outOfStock } = await priceComponents(requests);

  // Previously an unrecognised variant silently fell back to ₦3,000 per unit, so a
  // ₦28,000 bottle could be billed at ₦3,000. Refuse the order instead.
  if (unknown.length > 0) {
    return NextResponse.json(
      {
        error:
          "Some items in your cart are no longer available. Please refresh the page and try again.",
        unknownVariants: unknown,
      },
      { status: 409 }
    );
  }

  if (outOfStock.length > 0) {
    return NextResponse.json(
      {
        error: `Not enough stock for: ${outOfStock.join(", ")}. Please reduce the quantity.`,
        outOfStock,
      },
      { status: 409 }
    );
  }

  // A delivery fee is only ever charged for a zone on the known list — the
  // client never gets to name their own price, the slug just looks one up.
  const deliveryZone = input.deliveryMethod === "delivery" && input.deliveryZoneSlug
    ? findDeliveryZone(input.deliveryZoneSlug)
    : undefined;

  // Standalone items price the subtotal directly; each bundle contributes one
  // flat-priced line instead of its components, so VAT is charged on the
  // discounted bundle price rather than the pre-discount sum of its parts.
  const totals = computeTotals(
    [
      ...priced.filter((l) => l.bundleId === null).map(({ variantId, quantity, unitPrice }) => ({ variantId, quantity, unitPrice })),
      ...bundleLines,
    ],
    deliveryZone?.fee ?? 0
  );

  if (totals.total <= 0) {
    return NextResponse.json({ error: "Order total must be greater than zero." }, { status: 400 });
  }

  // --- Payment must be configured ------------------------------------------
  const paystackKey = process.env.PAYSTACK_SECRET_KEY;
  if (!paystackKey || paystackKey === "sk_test_mockkey") {
    // This used to fall through to /checkout/success, which showed the customer a
    // "Payment Confirmed" page for an order that was never paid for.
    console.error("[orders] PAYSTACK_SECRET_KEY is not configured — refusing checkout.");
    return NextResponse.json(
      { error: "Payments are temporarily unavailable. Please try again shortly." },
      { status: 503 }
    );
  }

  const orderNumber = `SA-${Date.now().toString(36).toUpperCase()}-${Math.floor(
    1000 + Math.random() * 9000
  )}`;

  // Attach the order to the signed-in customer when there is one, so it shows up
  // in their order history.
  let userId: string | null = null;
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    userId = session?.user?.id ?? null;
  } catch {
    // Guest checkout is fine.
  }

  // --- Persist ---------------------------------------------------------------
  const persistableLines = priced.filter((l) => l.persistable);
  let orderId: string | null = null;

  try {
    orderId = await db.transaction(async (tx) => {
      const [created] = await tx
        .insert(orders)
        .values({
          userId,
          orderNumber,
          totalAmount: totals.total.toFixed(2),
          status: "pending",
          shippingAddress:
            input.deliveryMethod === "pickup"
              ? `${input.name}\nPICKUP: ${input.pickupLocation}\n${input.email}`
              : deliveryZone
              ? `${input.name}\n${input.shippingAddress}\nDelivery zone: ${deliveryZone.area}, ${deliveryZone.city} — ₦${deliveryZone.fee.toLocaleString()} paid at checkout\n${input.email}`
              : `${input.name}\n${input.shippingAddress}\nDelivery — cost to be communicated separately\n${input.email}`,
        })
        .returning({ id: orders.id });

      for (const line of persistableLines) {
        await tx.insert(orderItems).values({
          orderId: created.id,
          variantId: line.variantId,
          quantity: line.quantity,
          priceAtPurchase: line.unitPrice.toFixed(2),
          bundleId: line.bundleId,
        });
      }

      return created.id;
    });
  } catch (error) {
    console.error("[orders] could not record order:", error);
    return NextResponse.json(
      { error: "We could not record your order. Please try again." },
      { status: 500 }
    );
  }

  // --- Hand off to Paystack --------------------------------------------------
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "sanaamniscoconut.com";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";
  const callbackUrl = `${protocol}://${host}/checkout/success?reference=${encodeURIComponent(orderNumber)}`;

  try {
    const session = await initializePaystackPayment(input.email, totals.total, callbackUrl, {
      orderId,
      orderNumber,
      customerName: input.name,
    });

    await db
      .update(orders)
      .set({ paymentReference: session.data.reference })
      .where(eq(orders.id, orderId));

    return NextResponse.json({
      success: true,
      authorizationUrl: session.data.authorization_url,
      orderNumber,
      total: totals.total,
    });
  } catch (error) {
    console.error("[orders] Paystack initialisation failed:", error);

    await db
      .update(orders)
      .set({ status: "payment_failed" })
      .where(eq(orders.id, orderId))
      .catch(() => undefined);

    return NextResponse.json(
      { error: "We could not start the payment. No money has been taken — please try again." },
      { status: 502 }
    );
  }
}
