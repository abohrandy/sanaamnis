import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders, transactions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifySquadPayment } from "@/lib/squad";
import { sendEmail } from "@/lib/resend";
import { wrapEmailHtml, emailEyebrow, EMAIL_FOOTER } from "@/lib/emailTemplate";
import { z } from "zod";

const reconcileSchema = z.object({
  orderNumber: z.string(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = reconcileSchema.parse(body);

    const order = await db.query.orders.findFirst({
      where: eq(orders.orderNumber, validated.orderNumber),
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status === "paid") {
      return NextResponse.json({
        success: true,
        message: "Order is already paid.",
        status: order.status,
      });
    }

    if (!order.paymentReference) {
      return NextResponse.json(
        { error: "No payment reference generated for this order." },
        { status: 400 }
      );
    }

    // Call Squad Transaction Verification
    console.log(`Reconciling order status with reference ${order.paymentReference}...`);
    const squadRes = await verifySquadPayment(order.paymentReference);

    if (squadRes.success && squadRes.data.transaction_status.toLowerCase() === "success") {
      const { transaction_ref: reference, email, transaction_amount } = squadRes.data;
      const orderAmountInNaira = (transaction_amount / 100).toFixed(2);

      // Check if transaction was logged previously
      const existingTx = await db.query.transactions.findFirst({
        where: eq(transactions.reference, reference),
      });

      await db.transaction(async (tx) => {
        if (!existingTx) {
          await tx.insert(transactions).values({
            orderId: order.id,
            gateway: "squad",
            reference: reference,
            amount: orderAmountInNaira,
            status: "success",
            rawResponse: squadRes.data,
          });
        }

        await tx
          .update(orders)
          .set({ status: "paid" })
          .where(eq(orders.id, order.id));
      });

      // Send Confirmation Receipt
      await sendEmail({
        to: order.customerEmail || email,
        subject: `Order confirmed — ${order.orderNumber}`,
        html: wrapEmailHtml(`
          ${emailEyebrow("Order confirmed")}
          <p>We have verified your payment for order <strong>${order.orderNumber}</strong>. Thank you for choosing Sana Amnis.</p>
          ${EMAIL_FOOTER}
        `),
      });

      return NextResponse.json({
        success: true,
        message: "Order reconciled successfully. Status updated to PAID.",
        status: "paid",
      });
    }

    return NextResponse.json({
      success: false,
      message: `Transaction verified but not successful. Current status: ${squadRes.data.transaction_status}`,
      status: squadRes.data.transaction_status,
    });
  } catch (error: any) {
    console.error("Reconciliation failed:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
