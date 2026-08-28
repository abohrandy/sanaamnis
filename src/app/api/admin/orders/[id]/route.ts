import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

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
  const { deny } = await requireAdmin("edit:orders");
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
    const [updated] = await db
      .update(orders)
      .set({ status: parsed.data.status })
      .where(eq(orders.id, id))
      .returning({ id: orders.id });

    if (!updated) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[admin/orders/${id}] status update failed:`, error);
    return NextResponse.json({ error: "Could not update the order." }, { status: 500 });
  }
}
