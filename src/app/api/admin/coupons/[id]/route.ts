import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { coupons } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const updateCouponSchema = z.object({
  discountValue: z.number().positive().max(1_000_000).optional(),
  expiresAt: z.string().datetime().nullable().optional(),
  isActive: z.boolean().optional(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { deny } = await requireAdmin("edit:coupons");
  if (deny) return deny;

  const { id } = await params;

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request body." }, { status: 400 });
  }

  const parsed = updateCouponSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the coupon details.", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { discountValue, expiresAt, ...rest } = parsed.data;
  const patch: Record<string, unknown> = { ...rest };
  if (discountValue !== undefined) patch.discountValue = discountValue.toFixed(2);
  if (expiresAt !== undefined) patch.expiresAt = expiresAt ? new Date(expiresAt) : null;

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  try {
    await db.update(coupons).set(patch).where(eq(coupons.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[admin/coupons/${id}] update failed:`, error);
    return NextResponse.json({ error: "Could not update the coupon." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { deny } = await requireAdmin("edit:coupons");
  if (deny) return deny;

  const { id } = await params;

  try {
    await db.delete(coupons).where(eq(coupons.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[admin/coupons/${id}] delete failed:`, error);
    return NextResponse.json({ error: "Could not delete the coupon." }, { status: 500 });
  }
}
