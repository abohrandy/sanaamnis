import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders, transactions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyPaystackPayment } from "@/lib/paystack";
import { sendEmail } from "@/lib/resend";
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

    // Call Paystack Transaction Verification
    console.log(`Reconciling order status with reference ${order.paymentReference}...`);
    const paystackRes = await verifyPaystackPayment(order.paymentReference);

    if (paystackRes.status && paystackRes.data.status === "success") {
      const { reference, customer, amount } = paystackRes.data;
      const orderAmountInNaira = (amount / 100).toFixed(2);

      // Check if transaction was logged previously
      const existingTx = await db.query.transactions.findFirst({
        where: eq(transactions.reference, reference),
      });

      await db.transaction(async (tx) => {
        if (!existingTx) {
          await tx.insert(transactions).values({
            orderId: order.id,
            gateway: "paystack",
            reference: reference,
            amount: orderAmountInNaira,
            status: "success",
            rawResponse: paystackRes.data,
          });
        }

        await tx
          .update(orders)
          .set({ status: "paid" })
          .where(eq(orders.id, order.id));
      });

      // Send Confirmation Receipt
      await sendEmail({
        to: order.shippingAddress.includes("chika.obi@gmail.com")
          ? "chika.obi@gmail.com"
          : customer.email,
        subject: `Order Confirmation - ${order.orderNumber}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea;">
            <h2 style="font-family: serif; color: #1d4626;">SANA AMNIS</h2>
            <hr style="border: 0; border-top: 1px solid #eaeaea;" />
            <p>Hello,</p>
            <p>We verified your payment for order <strong>${order.orderNumber}</strong> via reconciliation.</p>
            <p>Thank you for choosing Sana Amnis.</p>
          </div>
        `,
      });

      return NextResponse.json({
        success: true,
        message: "Order reconciled successfully. Status updated to PAID.",
        status: "paid",
      });
    }

    return NextResponse.json({
      success: false,
      message: `Transaction verified but not successful. Current status: ${paystackRes.data.status}`,
      status: paystackRes.data.status,
    });
  } catch (error: any) {
    console.error("Reconciliation failed:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
