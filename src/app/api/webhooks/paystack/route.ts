import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/db";
import { orders, transactions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sendEmail } from "@/lib/resend";

export async function POST(request: Request) {
  try {
    const payload = await request.text();
    const signature = request.headers.get("x-paystack-signature");
    const secret = process.env.PAYSTACK_SECRET_KEY || "sk_test_mockkey";

    if (!signature && process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Missing verification signature" }, { status: 400 });
    }

    // Verify signature using HMAC SHA512
    const hash = crypto
      .createHmac("sha512", secret)
      .update(payload)
      .digest("hex");

    if (hash !== signature && process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Signature verification failed" }, { status: 400 });
    }

    const event = JSON.parse(payload);

    if (event.event === "charge.success") {
      const { reference, customer, metadata, amount } = event.data;
      const orderNumber = metadata?.orderNumber || reference;

      // 1. Idempotency Check: Verify if this transaction was already processed
      const existingTx = await db.query.transactions.findFirst({
        where: eq(transactions.reference, reference),
      });

      if (existingTx) {
        return NextResponse.json({ status: "success", message: "Transaction already processed." });
      }

      // 2. Fetch the corresponding Order
      const order = await db.query.orders.findFirst({
        where: eq(orders.orderNumber, orderNumber),
      });

      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      const orderAmountInNaira = (amount / 100).toFixed(2);

      // 3. Update DB state atomically using transaction
      await db.transaction(async (tx) => {
        // Log transaction details
        await tx.insert(transactions).values({
          orderId: order.id,
          gateway: "paystack",
          reference: reference,
          amount: orderAmountInNaira,
          status: "success",
          rawResponse: event.data,
        });

        // Set order status to paid
        await tx
          .update(orders)
          .set({ status: "paid" })
          .where(eq(orders.id, order.id));
      });

      // 4. Send Confirmation Email via Resend
      await sendEmail({
        to: customer.email,
        subject: `Order Confirmation - ${orderNumber}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea;">
            <h2 style="font-family: serif; color: #1d4626;">SANA AMNIS</h2>
            <hr style="border: 0; border-top: 1px solid #eaeaea;" />
            <p>Hello,</p>
            <p>We are pleased to confirm your payment of <strong>₦${parseFloat(orderAmountInNaira).toLocaleString()}</strong> for order <strong>${orderNumber}</strong>.</p>
            <p>Our packaging department is already inspecting and styling your garments to prepare for shipment.</p>
            <br />
            <p>Client Services Division,<br />Sana Amnis</p>
          </div>
        `,
      });
    }

    return NextResponse.json({ status: "success" });
  } catch (error: any) {
    console.error("Webhook processing failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
