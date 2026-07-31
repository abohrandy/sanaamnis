/**
 * Server-side journal/blog access — same DB-first-with-fallback shape as
 * src/lib/products.ts. Database rows win when they exist; src/lib/content.ts's
 * ARTICLES backstops an empty or unreachable database.
 *
 * Server components only — this imports the database client.
 */
import { db } from "@/db";
import { ARTICLES, type Article } from "@/lib/content";

const WORDS_PER_MINUTE = 200;

/**
 * Body copy is stored as a single text column: paragraphs separated by a blank
 * line, a line starting with "## " becomes a subheading. Turns that into the
 * same { heading?, paragraphs }[] shape the article page already renders, so the
 * page's JSX didn't need to change when the source of truth moved to the database.
 */
export function parseArticleBody(content: string): Article["body"] {
  const blocks = content
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  const body: Article["body"] = [];
  let current: Article["body"][number] | null = null;

  for (const block of blocks) {
    if (block.startsWith("## ")) {
      current = { heading: block.slice(3).trim(), paragraphs: [] };
      body.push(current);
    } else if (current) {
      current.paragraphs.push(block);
    } else {
      current = { paragraphs: [block] };
      body.push(current);
    }
  }

  return body;
}

function readingMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

type DbBlogRow = {
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  category: string;
  imageUrl: string | null;
  publishedAt: Date | null;
  createdAt: Date;
};

function fromDb(row: DbBlogRow): Article {
  const content = row.content ?? "";
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? "",
    category: row.category,
    date: (row.publishedAt ?? row.createdAt).toISOString(),
    readingMinutes: readingMinutes(content),
    image: row.imageUrl || "/products/placeholder.jpg",
    body: parseArticleBody(content),
  };
}

export async function getArticles(): Promise<Article[]> {
  try {
    const rows = await db.query.blogPosts.findMany({
      where: (posts, { eq }) => eq(posts.isPublished, true),
      orderBy: (posts, { desc }) => [desc(posts.publishedAt), desc(posts.createdAt)],
    });
    if (rows.length > 0) {
      return (rows as unknown as DbBlogRow[]).map(fromDb);
    }
  } catch (error) {
    console.error("[blog] database unavailable, serving content fallback:", error);
  }
  return ARTICLES;
}

export async function getArticle(slug: string): Promise<Article | undefined> {
  try {
    const row = await db.query.blogPosts.findFirst({
      where: (posts, { eq, and }) => and(eq(posts.slug, slug), eq(posts.isPublished, true)),
    });
    if (row) return fromDb(row as unknown as DbBlogRow);
  } catch (error) {
    console.error(`[blog] database unavailable for "${slug}", serving content fallback:`, error);
  }
  return ARTICLES.find((a) => a.slug === slug);
}
