import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { coupons } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const createCouponSchema = z.object({
  code: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9]{3,20}$/, "3-20 letters/numbers, no spaces"),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.number().positive().max(1_000_000),
  expiresAt: z.string().datetime().nullable().optional(),
}).refine(
  (v) => v.discountType !== "percentage" || v.discountValue <= 100,
  { message: "A percentage discount can't exceed 100.", path: ["discountValue"] }
);

export async function GET() {
  const { deny } = await requireAdmin("edit:coupons");
  if (deny) return deny;

  try {
    const rows = await db.query.coupons.findMany();
    return NextResponse.json({ coupons: rows });
  } catch (error) {
    console.error("[admin/coupons] list failed:", error);
    return NextResponse.json({ error: "Could not load coupons." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { deny } = await requireAdmin("edit:coupons");
  if (deny) return deny;

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request body." }, { status: 400 });
  }

  const parsed = createCouponSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the coupon details.", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const input = parsed.data;

  try {
    const [created] = await db
      .insert(coupons)
      .values({
        code: input.code,
        discountType: input.discountType,
        discountValue: input.discountValue.toFixed(2),
        expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
        isActive: true,
      })
      .returning({ id: coupons.id });

    return NextResponse.json({ id: created.id }, { status: 201 });
  } catch (error) {
    console.error("[admin/coupons] create failed:", error);
    const message =
      error instanceof Error && error.message.includes("unique")
        ? "That coupon code already exists."
        : "Could not create the coupon.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
