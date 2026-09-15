import { getSetting } from "@/lib/settings";
import { db } from "@/db";
import { emailFailures } from "@/db/schema";

export interface SendEmailPayload {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

/** Records a send that didn't actually reach the customer/staff inbox, so it
 * shows up in the admin dashboard instead of only a server console log nobody
 * reads. Never throws — a logging failure must not fail the caller's request. */
async function logEmailFailure(to: string | string[], subject: string, error: string) {
  try {
    await db.insert(emailFailures).values({
      to: Array.isArray(to) ? to.join(", ") : to,
      subject,
      error,
    });
  } catch (logError) {
    console.error("[resend] failed to record email failure:", logError);
  }
}

export async function sendEmail({
  to,
  subject,
  html,
  from = "Sana Amnis <orders@sanaamniscoconut.com>",
}: SendEmailPayload) {
  // The admin Settings > Payments page lets staff set this without a redeploy;
  // it falls back to the env var for deployments that configure it that way.
  const RESEND_API_KEY = (await getSetting("resend-api-key")) || process.env.RESEND_API_KEY || "re_test_mockkey";

  // If we are in dev/test environment and key is not set, log it out
  if (RESEND_API_KEY === "re_test_mockkey") {
    console.log(`[Mock Email Sent] To: ${to}, Subject: ${subject}`);
    // A missing key is expected in local dev, but in a deployed environment it
    // means every "sent" email is actually going nowhere — surface it either way.
    if (process.env.NODE_ENV === "production") {
      await logEmailFailure(to, subject, "No Resend API key configured — email was not actually sent (mock mode).");
    }
    return { success: true, id: "mock_id_" + Math.random().toString(36).substring(7) };
  }

  const recipients = Array.isArray(to) ? to : [to];

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: recipients,
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Resend API error:", errorText);
      await logEmailFailure(to, subject, errorText);
      return { success: false, error: errorText };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error: any) {
    console.error("Failed to send email through Resend:", error);
    await logEmailFailure(to, subject, error.message);
    return { success: false, error: error.message };
  }
}
