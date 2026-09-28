import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { getBankDetails } from "@/lib/bankTransfer";

export const dynamic = "force-dynamic";

/**
 * Minimal order status lookup for the checkout confirmation screen.
 *
 * The confirmation page is a static shell that calls this, rather than a
 * server-rendered page: request-time page rendering currently fails on the
 * Railway deployment (see /checkout/success), while route handlers are unaffected.
 *
 * Deliberately returns only status, total, payment method and (for an unpaid
 * bank transfer) the bank details — no address, email or line items. Order
 * numbers travel in URLs and must not be a handle on customer data; the bank
 * details are the same for every order, not customer data, so they're safe here.
 */
export async function GET(request: Request) {
  const reference = new URL(request.url).searchParams.get("reference");

  if (!reference) {
    return NextResponse.json({ error: "Missing reference." }, { status: 400 });
  }

  try {
    const order = await db.query.orders.findFirst({
      where: eq(orders.orderNumber, reference),
      columns: { status: true, totalAmount: true, paymentMethod: true },
    });

    if (!order) {
      return NextResponse.json({ state: "unknown" }, { status: 404 });
    }

    const isBankTransferUnpaid = order.paymentMethod === "bank_transfer" && order.status !== "paid";

    return NextResponse.json(
      {
        state: order.status === "paid" ? "paid" : "pending",
        orderStatus: order.status,
        paymentMethod: order.paymentMethod,
        total: Number(order.totalAmount),
        bankDetails: isBankTransferUnpaid ? await getBankDetails() : undefined,
      },
      // Status changes the moment the webhook lands, so never cache it.
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("[orders/status] lookup failed:", error);
    return NextResponse.json({ error: "Could not check order status." }, { status: 500 });
  }
}
