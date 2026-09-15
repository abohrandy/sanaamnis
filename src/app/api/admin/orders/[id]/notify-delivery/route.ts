import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";
import { sendEmail } from "@/lib/resend";
import { customerDeliveryEmail, parseShippingAddress, type OrderLine } from "@/lib/bankTransfer";
import { PLACEHOLDER_IMAGE } from "@/lib/catalog";

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
        const lines = await db.query.orderItems.findMany({
          where: eq(orderItems.orderId, id),
          with: { variant: { with: { product: true } }, bundle: true },
        });

        const requestHeaders = await headers();
        const host = requestHeaders.get("host") ?? "sanaamniscoconut.com";
        const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";
        const siteOrigin = `${protocol}://${host}`;

        const items: OrderLine[] = lines.map((line) => {
          const productTitle = line.variant?.product?.title ?? "Item";
          const variantName = line.variant?.name;
          const label = line.bundle
            ? `${productTitle}${variantName ? ` (${variantName})` : ""} — part of ${line.bundle.title}`
            : `${productTitle}${variantName ? ` (${variantName})` : ""}`;
          const imageUrl = line.variant?.imageUrl || PLACEHOLDER_IMAGE;
          return {
            label,
            quantity: line.quantity,
            imageUrl: imageUrl.startsWith("http") ? imageUrl : `${siteOrigin}${imageUrl}`,
          };
        });

        // The delivery fee actually charged only survives in shippingAddress's free
        // text (see parseShippingAddress) — subtotal is derived from the
        // authoritative order total minus that fee, rather than re-summing item
        // prices, so the breakdown always reconciles with what was actually paid
        // even for bundle orders (where a component's persisted priceAtPurchase is
        // its pre-bundle-discount unit price, not what the bundle actually charged).
        const total = Number(order.totalAmount);
        const { deliveryFee, deliveryLabel } = parseShippingAddress(order.shippingAddress);
        const subtotal = total - deliveryFee;

        await sendEmail({
          to: order.customerEmail,
          subject: `Order delivered — ${order.orderNumber}`,
          html: customerDeliveryEmail({
            orderNumber: order.orderNumber,
            items,
            subtotal,
            deliveryFee,
            deliveryLabel,
            total,
          }),
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
