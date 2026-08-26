import { NextResponse } from "next/server";
import { z } from "zod";
import { sendEmail } from "@/lib/resend";

export const dynamic = "force-dynamic";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().email().max(254),
  message: z.string().trim().min(10).max(4000),
  /**
   * Honeypot: a real visitor never fills a field they cannot see.
   * Deliberately unconstrained — `max(0)` would make Zod reject a filled-in
   * honeypot before the handler below ever saw it, so bots got a validation
   * error instead of the silent fake-success that is supposed to give them away.
   */
  company: z.string().optional(),
});

const CONTACT_INBOX = process.env.CONTACT_EMAIL || "info@sanaamniscoconut.com";

/**
 * Delivers the contact form to the team inbox.
 *
 * The page previously called setSuccess(true) directly in the submit handler and
 * sent the message nowhere — every enquiry the site claimed to receive was
 * silently discarded.
 */
export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please fill in your name, a valid email and a short message." },
      { status: 400 }
    );
  }

  if (parsed.data.company) {
    // Honeypot hit — report success so bots get no signal they were caught.
    return NextResponse.json({ success: true });
  }

  const { name, email, message } = parsed.data;

  const escape = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const result = await sendEmail({
    to: CONTACT_INBOX,
    subject: `Website enquiry from ${name}`,
    html: `
      <p><strong>From:</strong> ${escape(name)} (${escape(email)})</p>
      <p style="white-space: pre-wrap;">${escape(message)}</p>
    `,
  });

  if (!result.success) {
    console.error("[contact] could not send enquiry email:", result.error);
    return NextResponse.json(
      { error: "We could not send your message just now. Please try again shortly." },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true });
}
