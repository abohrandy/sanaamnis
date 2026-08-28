// Shared branding for every outbound email (order, payment, delivery, contact
// form). Keeping this in one place means the logo, fonts and footer only need
// updating once for every email the app sends to stay in sync.

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://sanaamniscoconut.com").replace(/\/$/, "");
export const LOGO_URL = `${SITE_URL}/logo3.png`;

// Only one inbox going forward — see CUSTOMER_CARE_EMAIL in bankTransfer.ts.
export const CONTACT_EMAIL = "communitymart@gmail.com";

// Same faces as the website (src/app/layout.tsx: Outfit for body/UI text,
// Playfair Display for headings) — loaded via Google Fonts' CSS endpoint since
// email clients can't use next/font. Most webmail/Apple Mail/Outlook-on-the-web
// render it; clients that ignore @import (older desktop Outlook) fall back
// cleanly to the serif/sans-serif stacks listed alongside each font name.
const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');`;
export const SANS_STACK = "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
export const SERIF_STACK = "'Playfair Display', Georgia, serif";

export function wrapEmailHtml(bodyHtml: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>${FONT_IMPORT}</style>
      </head>
      <body style="margin: 0; background: #FAF8F5;">
        <div style="font-family: ${SANS_STACK}; padding: 28px; max-width: 600px; margin: 0 auto; background: #FAF8F5; color: #161A17;">
          <img src="${LOGO_URL}" alt="Sana Amnis" width="120" style="width: 120px; height: auto; display: block; margin: 0 0 20px;" />
          ${bodyHtml}
        </div>
      </body>
    </html>
  `;
}

export const emailEyebrow = (text: string) =>
  `<p style="font-family: ${SANS_STACK}; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #C9A227; margin: 0 0 20px;">${text}</p>
   <hr style="border: 0; border-top: 1px solid #E2E6E3;" />`;

export const EMAIL_FOOTER = `
  <p style="margin-top: 24px; font-size: 13px; color: #676E6A;">
    Questions? Write to ${CONTACT_EMAIL}.
  </p>
  <p style="margin-top: 20px; font-family: ${SERIF_STACK}; color: #1C3322;">Sana Amnis</p>
`;

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
