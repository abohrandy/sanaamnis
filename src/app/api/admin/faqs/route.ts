import { NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { faqs } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const createFaqSchema = z.object({
  question: z.string().trim().min(5).max(300),
  // Plain text; a single [label](/path) markdown-style link is rendered as a
  // real link on the storefront — see src/lib/faqs.ts's parseFaqAnswer().
  answer: z.string().trim().min(5).max(2000),
  category: z.string().trim().min(2).max(60).default("general"),
});

export async function GET() {
  const { deny } = await requireAdmin("edit:pages");
  if (deny) return deny;

  try {
    const rows = await db.query.faqs.findMany({ orderBy: (faqs, { asc }) => [asc(faqs.sortOrder)] });
    return NextResponse.json({ faqs: rows });
  } catch (error) {
    console.error("[admin/faqs] list failed:", error);
    return NextResponse.json({ error: "Could not load FAQs." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { deny } = await requireAdmin("edit:pages");
  if (deny) return deny;

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request body." }, { status: 400 });
  }

  const parsed = createFaqSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the FAQ details.", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const input = parsed.data;

  try {
    // New FAQs go to the end of the list by default; sortOrder can be changed
    // later via PATCH.
    const count = await db.$count(faqs);

    const [created] = await db
      .insert(faqs)
      .values({ question: input.question, answer: input.answer, category: input.category, sortOrder: count })
      .returning({ id: faqs.id });

    revalidatePath("/faq");
    return NextResponse.json({ id: created.id }, { status: 201 });
  } catch (error) {
    console.error("[admin/faqs] create failed:", error);
    return NextResponse.json({ error: "Could not create the FAQ." }, { status: 500 });
  }
}
