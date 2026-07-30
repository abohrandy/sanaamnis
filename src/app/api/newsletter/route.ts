import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { newsletterSubscribers } from "@/db/schema";

export const dynamic = "force-dynamic";

const subscribeSchema = z.object({
  email: z.string().email().max(254),
  /**
   * Honeypot: a real person never fills a field they cannot see.
   * Deliberately unconstrained — `max(0)` made Zod reject a filled-in honeypot
   * before the handler below ever ran, so a bot got a validation error instead
   * of the silent fake-success that is supposed to give it away.
   */
  company: z.string().optional(),
});

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const parsed = subscribeSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  // Silently accept honeypot hits so bots get no signal that they were caught.
  if (parsed.data.company) {
    return NextResponse.json({ success: true });
  }

  const email = parsed.data.email.trim().toLowerCase();

  try {
    await db
      .insert(newsletterSubscribers)
      .values({ email, isActive: true })
      // Re-subscribing after unsubscribing should just work, and a duplicate
      // signup should not look like an error to the person doing it.
      .onConflictDoUpdate({
        target: newsletterSubscribers.email,
        set: { isActive: true },
      });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[newsletter] could not record subscriber:", error);
    return NextResponse.json(
      { error: "We could not save your details just now. Please try again shortly." },
      { status: 500 }
    );
  }
}
