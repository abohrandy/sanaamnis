import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;

export async function GET(request: Request) {
  const { deny } = await requireAdmin("view:orders");
  if (deny) return deny;

  const page = Math.max(1, Number(new URL(request.url).searchParams.get("page")) || 1);

  try {
    const rows = await db.query.orders.findMany({
      orderBy: (orders) => [desc(orders.createdAt)],
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
      with: {
        items: {
          with: {
            variant: { with: { product: { columns: { title: true, slug: true } } } },
          },
        },
      },
    });

    const totalResult = await db.$count(orders);

    return NextResponse.json({
      orders: rows.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        paymentMethod: order.paymentMethod,
        totalAmount: Number(order.totalAmount),
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        shippingAddress: order.shippingAddress,
        createdAt: order.createdAt,
        items: order.items.map((item) => ({
          quantity: item.quantity,
          priceAtPurchase: Number(item.priceAtPurchase),
          productTitle: item.variant?.product?.title ?? "Item",
          productSlug: item.variant?.product?.slug ?? null,
          variantName: item.variant?.name ?? "",
        })),
      })),
      page,
      pageSize: PAGE_SIZE,
      totalPages: Math.max(1, Math.ceil(totalResult / PAGE_SIZE)),
    });
  } catch (error) {
    console.error("[admin/orders] list failed:", error);
    return NextResponse.json({ error: "Could not load orders." }, { status: 500 });
  }
}
