import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

// See the matching comment in ../route.ts — local /public paths must stay valid, not just full URLs.
const imageUrlSchema = z
  .string()
  .trim()
  .refine((v) => v === "" || v.startsWith("/") || /^https?:\/\//i.test(v), {
    message: "Enter a path starting with / or a full https:// URL",
  });

const updatePostSchema = z.object({
  title: z.string().trim().min(2).max(200).optional(),
  excerpt: z.string().trim().max(400).nullable().optional(),
  content: z.string().trim().min(20).max(20_000).optional(),
  category: z.string().trim().min(2).max(60).optional(),
  imageUrl: imageUrlSchema.nullable().optional(),
  isPublished: z.boolean().optional(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { deny } = await requireAdmin("edit:blog");
  if (deny) return deny;

  const { id } = await params;

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request body." }, { status: 400 });
  }

  const parsed = updatePostSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the article details.", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const patch: Record<string, unknown> = { ...parsed.data };
  if (patch.imageUrl === "") patch.imageUrl = null;
  if (parsed.data.isPublished === true) patch.publishedAt = new Date();

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  try {
    const existing = await db.query.blogPosts.findFirst({ where: eq(blogPosts.id, id), columns: { slug: true } });
    if (!existing) {
      return NextResponse.json({ error: "Article not found." }, { status: 404 });
    }

    await db.update(blogPosts).set(patch).where(eq(blogPosts.id, id));

    revalidatePath("/blog");
    revalidatePath(`/blog/${existing.slug}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[admin/blog/${id}] update failed:`, error);
    return NextResponse.json({ error: "Could not update the article." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { deny } = await requireAdmin("edit:blog");
  if (deny) return deny;

  const { id } = await params;

  try {
    const [deleted] = await db.delete(blogPosts).where(eq(blogPosts.id, id)).returning({ slug: blogPosts.slug });
    if (!deleted) {
      return NextResponse.json({ error: "Article not found." }, { status: 404 });
    }

    revalidatePath("/blog");
    revalidatePath(`/blog/${deleted.slug}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[admin/blog/${id}] delete failed:`, error);
    return NextResponse.json({ error: "Could not delete the article." }, { status: 500 });
  }
}
