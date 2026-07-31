/**
 * Server-side FAQ access — same DB-first-with-fallback shape as
 * src/lib/products.ts. Database rows win when they exist; src/lib/content.ts's
 * FAQS backstops an empty or unreachable database.
 *
 * Server components only — this imports the database client.
 */
import { db } from "@/db";
import { FAQS, type Faq } from "@/lib/content";

export async function getFaqs(): Promise<Faq[]> {
  try {
    const rows = await db.query.faqs.findMany({
      orderBy: (faqs, { asc }) => [asc(faqs.sortOrder)],
    });
    if (rows.length > 0) {
      return rows.map((r) => ({ question: r.question, answer: r.answer, category: r.category }));
    }
  } catch (error) {
    console.error("[faqs] database unavailable, serving content fallback:", error);
  }
  return FAQS;
}

export interface AnswerSegment {
  text: string;
  href?: string;
}

/**
 * Splits a single `[label](/path)` markdown-style link out of a plain-text
 * answer, if there is one — the FAQ page renders the result as a real
 * <Link>. FAQ answers are stored as plain text (the `faqs` table has no rich
 * content column), but a handful of the original answers pointed readers at
 * another page, and that was worth keeping rather than flattening to dead text.
 */
export function parseFaqAnswer(answer: string): AnswerSegment[] {
  const match = answer.match(/\[([^\]]+)\]\(([^)]+)\)/);
  if (!match || match.index === undefined) return [{ text: answer }];

  const [full, label, href] = match;
  const before = answer.slice(0, match.index);
  const after = answer.slice(match.index + full.length);

  return [{ text: before }, { text: label, href }, { text: after }].filter((s) => s.text !== "");
}
