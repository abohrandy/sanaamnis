import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";
import { sendEmail } from "@/lib/resend";
import { customerDeliveryEmail } from "@/lib/bankTransfer";

export const dynamic = "force-dynamic";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { deny } = await requireAdmin("edit:orders");
  if (deny) return deny;

  const { id } = await params;

  try {
    const order = await db.query.orders.findFirst({ where: eq(orders.id, id) });
    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    await db.update(orders).set({ status: "delivered" }).where(eq(orders.id, id));

    if (order.customerEmail) {
      try {
        await sendEmail({
          to: order.customerEmail,
          subject: `Order delivered — ${order.orderNumber}`,
          html: customerDeliveryEmail({ orderNumber: order.orderNumber }),
        });
      } catch (emailError) {
        console.error(`[admin/orders/${id}/notify-delivery] delivery email failed:`, emailError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[admin/orders/${id}/notify-delivery] failed:`, error);
    return NextResponse.json({ error: "Could not notify the customer." }, { status: 500 });
  }
}
