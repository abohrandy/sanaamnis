import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/db";
import { orders, orderItems, transactions, productVariants } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { sendEmail } from "@/lib/resend";
import { formatNaira } from "@/lib/catalog";
import { wrapEmailHtml, emailEyebrow, EMAIL_FOOTER } from "@/lib/emailTemplate";

export const dynamic = "force-dynamic";

/** Constant-time comparison so the signature check cannot be probed by timing. */
function signatureMatches(expected: string, received: string | null): boolean {
  if (!received) return false;
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(received, "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  try {
    const payload = await request.text();
    const signature = request.headers.get("x-paystack-signature");
    const secret = process.env.PAYSTACK_SECRET_KEY;

    if (!secret) {
      console.error("[paystack-webhook] PAYSTACK_SECRET_KEY is not configured.");
      return NextResponse.json({ error: "Not configured" }, { status: 500 });
    }

    const expected = crypto.createHmac("sha512", secret).update(payload).digest("hex");
    if (!signatureMatches(expected, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(payload);
    if (event.event !== "charge.success") {
      return NextResponse.json({ status: "ignored" });
    }

    const { reference, customer, metadata, amount } = event.data;
    const orderNumber = metadata?.orderNumber || reference;

    // Paystack retries on non-2xx, so this must be safe to receive twice.
    const existingTx = await db.query.transactions.findFirst({
      where: eq(transactions.reference, reference),
    });
    if (existingTx) {
      return NextResponse.json({ status: "success", message: "Already processed." });
    }

    const order = await db.query.orders.findFirst({
      where: eq(orders.orderNumber, orderNumber),
    });
    if (!order) {
      console.error(`[paystack-webhook] no order for ${orderNumber}`);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const paidNaira = amount / 100;
    const expectedNaira = Number(order.totalAmount);

    // Flag rather than reject: the payment is real and already taken, so it must be
    // recorded, but a mismatch needs a human to look at it.
    const amountMismatch = Math.abs(paidNaira - expectedNaira) > 0.01;
    if (amountMismatch) {
      console.error(
        `[paystack-webhook] amount mismatch on ${orderNumber}: paid ${paidNaira}, expected ${expectedNaira}`
      );
    }

    await db.transaction(async (tx) => {
      await tx.insert(transactions).values({
        orderId: order.id,
        gateway: "paystack",
        reference,
        amount: paidNaira.toFixed(2),
        status: "success",
        rawResponse: event.data,
      });

      await tx
        .update(orders)
        .set({ status: amountMismatch ? "needs_review" : "paid" })
        .where(eq(orders.id, order.id));

      // Stock comes down when money actually arrives, not when a bag is filled.
      const lines = await tx.query.orderItems.findMany({
        where: eq(orderItems.orderId, order.id),
      });
      for (const line of lines) {
        await tx
          .update(productVariants)
          .set({ stock: sql`GREATEST(0, ${productVariants.stock} - ${line.quantity})` })
          .where(eq(productVariants.id, line.variantId));
      }
    });

    // A failed email must not fail the webhook — Paystack would retry a settled payment.
    try {
      await sendEmail({
        to: customer.email,
        subject: `Order confirmed — ${orderNumber}`,
        html: wrapEmailHtml(`
          ${emailEyebrow("Order confirmed")}
          <p>Thank you — we have received your payment of <strong>${formatNaira(paidNaira)}</strong> for order <strong>${orderNumber}</strong>.</p>
          ${EMAIL_FOOTER}
        `),
      });
    } catch (emailError) {
      console.error(`[paystack-webhook] confirmation email failed for ${orderNumber}:`, emailError);
    }

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("[paystack-webhook] processing failed:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
