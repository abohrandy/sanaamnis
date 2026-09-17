import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";
import { logActivity } from "@/lib/audit";

export const dynamic = "force-dynamic";

// The vocabulary actually used in code today (pending/paid/payment_failed, set by
// checkout and the Paystack webhook) plus the fulfilment states the original
// schema comment always intended but nothing has ever set (shipped/delivered),
// plus cancelled for manual admin use.
const updateOrderSchema = z.object({
  status: z.enum([
    "pending",
    "awaiting_confirmation",
    "paid",
    "payment_failed",
    "shipped",
    "delivered",
    "cancelled",
  ]),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, deny } = await requireAdmin("edit:orders");
  if (deny) return deny;

  const { id } = await params;

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request body." }, { status: 400 });
  }

  const parsed = updateOrderSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  try {
    const existing = await db.query.orders.findFirst({
      where: eq(orders.id, id),
      columns: { orderNumber: true, status: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    const [updated] = await db
      .update(orders)
      .set({ status: parsed.data.status })
      .where(eq(orders.id, id))
      .returning({ id: orders.id });

    if (!updated) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    void logActivity({
      userId: session?.userId ?? null,
      action: "update:order_status",
      entityName: "orders",
      entityId: id,
      details: { orderNumber: existing.orderNumber, from: existing.status, to: parsed.data.status },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[admin/orders/${id}] status update failed:`, error);
    return NextResponse.json({ error: "Could not update the order." }, { status: 500 });
  }
}

/**
 * Permanently removes an order and its items/transactions (both cascade on
 * orders.id — see src/db/schema/index.ts). Gated on "delete:orders", which
 * only super_admin's wildcard permission grants — admin, sales and
 * store_manager can all manage orders but none of them can delete one.
 */
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, deny } = await requireAdmin("delete:orders");
  if (deny) return deny;

  const { id } = await params;

  try {
    const [deleted] = await db
      .delete(orders)
      .where(eq(orders.id, id))
      .returning({ id: orders.id, orderNumber: orders.orderNumber, totalAmount: orders.totalAmount });

    if (!deleted) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    void logActivity({
      userId: session?.userId ?? null,
      action: "delete:order",
      entityName: "orders",
      entityId: id,
      details: { orderNumber: deleted.orderNumber, totalAmount: deleted.totalAmount },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[admin/orders/${id}] delete failed:`, error);
    return NextResponse.json({ error: "Could not delete the order." }, { status: 500 });
  }
}
