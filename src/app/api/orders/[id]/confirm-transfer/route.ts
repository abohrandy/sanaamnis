import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { sendEmail } from "@/lib/resend";
import { formatNaira } from "@/lib/catalog";
import { CUSTOMER_CARE_RECIPIENTS, verifyOrderToken, staffPaymentClaimedEmail } from "@/lib/bankTransfer";

export const dynamic = "force-dynamic";

/** Plain email-link click from the customer, so this is a GET that redirects
 *  straight to the order confirmation screen — success or otherwise. */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = new URL(request.url).searchParams.get("token");

  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "sanaamniscoconut.com";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";
  const redirectTo = (reference?: string) =>
    NextResponse.redirect(
      `${protocol}://${host}/checkout/success${reference ? `?reference=${encodeURIComponent(reference)}` : ""}`
    );

  if (!verifyOrderToken(id, token)) {
    return NextResponse.json({ error: "Invalid or expired link." }, { status: 401 });
  }

  const order = await db.query.orders.findFirst({ where: eq(orders.id, id) });
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  // Idempotent — the customer may click the email link more than once, and an
  // order already paid or otherwise resolved should not regress.
  if (order.paymentMethod === "bank_transfer" && order.status === "pending") {
    await db.update(orders).set({ status: "awaiting_confirmation" }).where(eq(orders.id, id));

    try {
      await sendEmail({
        to: CUSTOMER_CARE_RECIPIENTS,
        subject: `Payment claimed — ${order.orderNumber}`,
        html: staffPaymentClaimedEmail({
          orderNumber: order.orderNumber,
          amountLabel: formatNaira(Number(order.totalAmount)),
          customerName: order.customerName ?? "Customer",
          customerEmail: order.customerEmail ?? "unknown",
        }),
      });
    } catch (emailError) {
      console.error(`[orders/${id}/confirm-transfer] staff notification failed:`, emailError);
    }
  }

  return redirectTo(order.orderNumber);
}
