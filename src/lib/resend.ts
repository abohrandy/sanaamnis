import { getSetting } from "@/lib/settings";

export interface SendEmailPayload {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  from = "Sana Amnis <orders@sanaamnis.com>",
}: SendEmailPayload) {
  // The admin Settings > Payments page lets staff set this without a redeploy;
  // it falls back to the env var for deployments that configure it that way.
  const RESEND_API_KEY = (await getSetting("resend-api-key")) || process.env.RESEND_API_KEY || "re_test_mockkey";

  // If we are in dev/test environment and key is not set, log it out
  if (RESEND_API_KEY === "re_test_mockkey") {
    console.log(`[Mock Email Sent] To: ${to}, Subject: ${subject}`);
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
      return { success: false, error: errorText };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error: any) {
    console.error("Failed to send email through Resend:", error);
    return { success: false, error: error.message };
  }
}
