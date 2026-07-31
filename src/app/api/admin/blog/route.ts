import { NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const createPostSchema = z.object({
  title: z.string().trim().min(2).max(200),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only"),
  excerpt: z.string().trim().max(400).optional(),
  // Blank-line-separated paragraphs; a line starting with "## " is a subheading.
  // See parseArticleBody() in src/lib/blog.ts for the reader.
  content: z.string().trim().min(20).max(20_000),
  category: z.string().trim().min(2).max(60).default("Guides"),
  imageUrl: z.string().trim().url().optional().or(z.literal("")),
  isPublished: z.boolean().default(true),
});

export async function GET() {
  const { deny } = await requireAdmin("edit:blog");
  if (deny) return deny;

  try {
    const rows = await db.query.blogPosts.findMany({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });
    return NextResponse.json({ posts: rows });
  } catch (error) {
    console.error("[admin/blog] list failed:", error);
    return NextResponse.json({ error: "Could not load articles." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { deny } = await requireAdmin("edit:blog");
  if (deny) return deny;

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request body." }, { status: 400 });
  }

  const parsed = createPostSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the article details.", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const input = parsed.data;

  try {
    const [created] = await db
      .insert(blogPosts)
      .values({
        title: input.title,
        slug: input.slug,
        excerpt: input.excerpt || null,
        content: input.content,
        category: input.category,
        imageUrl: input.imageUrl || null,
        isPublished: input.isPublished,
        publishedAt: input.isPublished ? new Date() : null,
      })
      .returning({ id: blogPosts.id });

    revalidatePath("/blog");
    revalidatePath(`/blog/${input.slug}`);

    return NextResponse.json({ id: created.id }, { status: 201 });
  } catch (error) {
    console.error("[admin/blog] create failed:", error);
    const message =
      error instanceof Error && error.message.includes("unique")
        ? "That slug is already in use."
        : "Could not create the article.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
