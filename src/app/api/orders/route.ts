import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems, productVariants } from "@/db/schema";
import { eq } from "drizzle-orm";
import { initializePaystackPayment } from "@/lib/paystack";
import { z } from "zod";

const createOrderSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  shippingAddress: z.string().min(5),
  shippingState: z.string().min(2), // Lagos vs Other regions
  items: z.array(
    z.object({
      variantId: z.string(),
      quantity: z.number().min(1),
    })
  ),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = createOrderSchema.parse(body);

    let subtotal = 0;
    const itemsWithDetails: { variantId: string; quantity: number; priceAtPurchase: string }[] = [];

    // Begin Stock Check & Total Pricing Calculation
    for (const item of validated.items) {
      const variant = await db.query.productVariants.findFirst({
        where: eq(productVariants.id, item.variantId),
      });

      if (!variant) {
        return NextResponse.json(
          { error: `Product variant with ID ${item.variantId} not found.` },
          { status: 404 }
        );
      }

      if (variant.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for variant ${variant.name}. Available: ${variant.stock}` },
          { status: 400 }
        );
      }

      const itemPrice = Number(variant.price);
      subtotal += itemPrice * item.quantity;
      itemsWithDetails.push({
        variantId: variant.id,
        quantity: item.quantity,
        priceAtPurchase: variant.price,
      });
    }

    const shippingFee = validated.shippingState === "Lagos" ? 2500 : 5000;
    const vat = subtotal * 0.075;
    const grandTotal = subtotal + vat + shippingFee;

    const orderNumber = `SA-${Math.floor(100000 + Math.random() * 900000)}`;

    // Database transaction to write order and decrement variant stock
    const result = await db.transaction(async (tx) => {
      const [newOrder] = await tx
        .insert(orders)
        .values({
          orderNumber,
          totalAmount: grandTotal.toString(),
          status: "pending",
          shippingAddress: `${validated.shippingAddress}, State: ${validated.shippingState}`,
        })
        .returning();

      for (const item of itemsWithDetails) {
        // Create order item
        await tx.insert(orderItems).values({
          orderId: newOrder.id,
          variantId: item.variantId,
          quantity: item.quantity,
          priceAtPurchase: item.priceAtPurchase,
        });

        // Decrement product variant stock
        const currentVariant = await tx.query.productVariants.findFirst({
          where: eq(productVariants.id, item.variantId),
        });

        if (currentVariant) {
          await tx
            .update(productVariants)
            .set({ stock: currentVariant.stock - item.quantity })
            .where(eq(productVariants.id, item.variantId));
        }
      }

      return newOrder;
    });

    // Initialize Paystack Payment
    const host = request.headers.get("host") || "localhost:3000";
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    const callbackUrl = `${protocol}://${host}/api/webhooks/paystack/callback?reference=${orderNumber}`;

    const paystackSession = await initializePaystackPayment(
      validated.email,
      grandTotal,
      callbackUrl,
      { orderId: result.id, orderNumber }
    );

    // Save Paystack reference in order
    await db
      .update(orders)
      .set({ paymentReference: paystackSession.data.reference })
      .where(eq(orders.id, result.id));

    return NextResponse.json({
      success: true,
      authorizationUrl: paystackSession.data.authorization_url,
      orderNumber,
    });
  } catch (error: any) {
    console.error("Order creation failed:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || "Failed to create order." }, { status: 500 });
  }
}
