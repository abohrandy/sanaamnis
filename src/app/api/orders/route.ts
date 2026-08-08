import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { orders, orderItems, productVariants } from "@/db/schema";
import { auth } from "@/lib/auth";
import { initializePaystackPayment } from "@/lib/paystack";
import { computeTotals, type DeliverySpeed } from "@/lib/pricing";
import { findVariant } from "@/lib/catalog";

export const dynamic = "force-dynamic";

const createOrderSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(120),
  shippingAddress: z.string().min(5).max(500),
  shippingState: z.string().min(2).max(80),
  deliverySpeed: z.enum(["standard", "express"]).default("standard"),
  items: z
    .array(
      z.object({
        variantId: z.string().uuid(),
        quantity: z.number().int().min(1).max(50),
      })
    )
    .min(1)
    .max(40),
});

/** Server-side price for a variant. The client's number is never trusted. */
async function priceLines(items: Array<{ variantId: string; quantity: number }>) {
  const ids = items.map((i) => i.variantId);

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
  const unknown: string[] = [];
  const outOfStock: string[] = [];

  for (const item of items) {
    const row = byId.get(item.variantId);

    if (row) {
      if (row.stock < item.quantity) outOfStock.push(row.sku);
      priced.push({
        variantId: item.variantId,
        quantity: item.quantity,
        unitPrice: Number(row.price),
        sku: row.sku,
        persistable: true,
      });
      continue;
    }

    // Catalog ids are the same ids we seed, so this still prices correctly if the
    // database is briefly unreachable. It will not be written as an order line.
    const fromCatalog = findVariant(item.variantId);
    if (fromCatalog) {
      priced.push({
        variantId: item.variantId,
        quantity: item.quantity,
        unitPrice: fromCatalog.variant.price,
        sku: fromCatalog.variant.sku,
        persistable: false,
      });
      continue;
    }

    unknown.push(item.variantId);
  }

  return { priced, unknown, outOfStock };
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
  const { priced, unknown, outOfStock } = await priceLines(input.items);

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

  const totals = computeTotals(
    priced.map(({ variantId, quantity, unitPrice }) => ({ variantId, quantity, unitPrice })),
    input.shippingState,
    input.deliverySpeed as DeliverySpeed
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
          shippingAddress: `${input.name}\n${input.shippingAddress}\n${input.shippingState}\n${input.email}`,
        })
        .returning({ id: orders.id });

      for (const line of persistableLines) {
        await tx.insert(orderItems).values({
          orderId: created.id,
          variantId: line.variantId,
          quantity: line.quantity,
          priceAtPurchase: line.unitPrice.toFixed(2),
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
