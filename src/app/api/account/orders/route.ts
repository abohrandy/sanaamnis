import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * The signed-in customer's own orders.
 *
 * The account page previously rendered two hardcoded orders — complete with
 * courier names and tracking numbers — to every visitor, signed in or not.
 *
 * Scoped strictly to the session user id. There is no way to request someone
 * else's orders through this endpoint.
 */
export async function GET() {
  let userId: string | null = null;
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    userId = session?.user?.id ?? null;
  } catch (error) {
    console.error("[account/orders] session lookup failed:", error);
  }

  if (!userId) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  try {
    const rows = await db.query.orders.findMany({
      where: eq(orders.userId, userId),
      orderBy: [desc(orders.createdAt)],
      limit: 25,
      with: {
        items: { with: { variant: { with: { product: true } } } },
      },
    });

    return NextResponse.json({
      orders: rows.map((order) => ({
        id: order.id,
        reference: order.orderNumber,
        status: order.status,
        total: Number(order.totalAmount),
        date: order.createdAt.toISOString(),
        items: (order.items ?? []).map((item) => ({
          title: item.variant?.product?.title ?? "Item",
          name: item.variant?.name ?? "",
          quantity: item.quantity,
          price: Number(item.priceAtPurchase),
          imageUrl: item.variant?.imageUrl ?? "/products/placeholder.jpg",
        })),
      })),
    });
  } catch (error) {
    console.error("[account/orders] query failed:", error);
    return NextResponse.json({ error: "Could not load your orders." }, { status: 500 });
  }
}
