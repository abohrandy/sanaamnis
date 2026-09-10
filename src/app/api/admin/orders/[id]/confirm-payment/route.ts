import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { orders, orderItems, transactions, productVariants } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";
import { sendEmail } from "@/lib/resend";
import { formatNaira } from "@/lib/catalog";
import { customerPaymentConfirmedEmail } from "@/lib/bankTransfer";
import { sendTikTokEvent } from "@/lib/tiktokEvents";
import { sendMetaEvent } from "@/lib/metaEvents";

export const dynamic = "force-dynamic";

/** Manual confirmation for a bank-transfer order, mirroring what the Paystack
 *  webhook does on charge.success: record the transaction, mark paid, decrement
 *  stock. There is no gateway here, so a human confirms it instead. */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { deny } = await requireAdmin("edit:orders");
  if (deny) return deny;

  const { id } = await params;

  try {
    const order = await db.query.orders.findFirst({ where: eq(orders.id, id) });
    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }
    if (order.status === "paid") {
      return NextResponse.json({ success: true, message: "Already confirmed." });
    }

    await db.transaction(async (tx) => {
      await tx.insert(transactions).values({
        orderId: order.id,
        gateway: "bank_transfer",
        reference: `bank-${order.orderNumber}`,
        amount: order.totalAmount,
        status: "success",
      });

      await tx.update(orders).set({ status: "paid" }).where(eq(orders.id, order.id));

      const lines = await tx.query.orderItems.findMany({ where: eq(orderItems.orderId, order.id) });
      for (const line of lines) {
        await tx
          .update(productVariants)
          .set({ stock: sql`GREATEST(0, ${productVariants.stock} - ${line.quantity})` })
          .where(eq(productVariants.id, line.variantId));
      }
    });

    if (order.customerEmail) {
      try {
        await sendEmail({
          to: order.customerEmail,
          subject: `Payment confirmed — ${order.orderNumber}`,
          html: customerPaymentConfirmedEmail({
            orderNumber: order.orderNumber,
            amountLabel: formatNaira(Number(order.totalAmount)),
          }),
        });
      } catch (emailError) {
        console.error(`[admin/orders/${id}/confirm-payment] confirmation email failed:`, emailError);
      }
    }

    // Same "Purchase" event the Paystack webhook sends for a card payment,
    // fired from the admin's manual confirmation instead since a bank
    // transfer has no webhook of its own.
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://sanaamniscoconut.com").replace(/\/$/, "");
    void sendTikTokEvent(
      "Purchase",
      `${order.orderNumber}-purchase`,
      {
        url: `${siteUrl}/checkout/success`,
        email: order.customerEmail,
        phone: order.customerPhone,
        externalId: order.id,
      },
      {
        value: Number(order.totalAmount),
        currency: "NGN",
        contentId: order.orderNumber,
        contentName: `Order ${order.orderNumber}`,
      }
    );

    void sendMetaEvent(
      "Purchase",
      `${order.orderNumber}-purchase`,
      {
        url: `${siteUrl}/checkout/success`,
        email: order.customerEmail,
        phone: order.customerPhone,
        externalId: order.id,
      },
      {
        value: Number(order.totalAmount),
        currency: "NGN",
        contentName: `Order ${order.orderNumber}`,
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[admin/orders/${id}/confirm-payment] failed:`, error);
    return NextResponse.json({ error: "Could not confirm the payment." }, { status: 500 });
  }
}
