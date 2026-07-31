import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { redirectRules } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const createRedirectSchema = z.object({
  fromPath: z.string().trim().regex(/^\//, "Must start with /"),
  toPath: z.string().trim().min(1),
  statusCode: z.union([z.literal(301), z.literal(302)]).default(301),
});

export async function GET() {
  const { deny } = await requireAdmin("edit:settings");
  if (deny) return deny;

  try {
    const rows = await db.query.redirectRules.findMany();
    return NextResponse.json({ redirects: rows });
  } catch (error) {
    console.error("[admin/redirects] list failed:", error);
    return NextResponse.json({ error: "Could not load redirects." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { deny } = await requireAdmin("edit:settings");
  if (deny) return deny;

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request body." }, { status: 400 });
  }

  const parsed = createRedirectSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the redirect details.", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const input = parsed.data;

  if (input.fromPath === input.toPath) {
    return NextResponse.json({ error: "A redirect can't point to itself." }, { status: 400 });
  }

  try {
    const [created] = await db.insert(redirectRules).values(input).returning({ id: redirectRules.id });
    return NextResponse.json({ id: created.id }, { status: 201 });
  } catch (error) {
    console.error("[admin/redirects] create failed:", error);
    const message =
      error instanceof Error && error.message.includes("unique")
        ? "A redirect from that path already exists."
        : "Could not create the redirect.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
