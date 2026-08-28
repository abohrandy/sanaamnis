import crypto from "crypto";
import { getSetting } from "@/lib/settings";

const TOKEN_SECRET =
  process.env.BANK_TRANSFER_TOKEN_SECRET || "fallback_default_secret_minimum_32_characters_for_sana_amnis";

export const CUSTOMER_CARE_RECIPIENTS = ["info@sanaamniscoconut.com", "communitymart@gmail.com"];

export interface OrderLine {
  label: string;
  quantity: number;
  imageUrl: string;
}

export function signOrderToken(orderId: string): string {
  return crypto.createHmac("sha256", TOKEN_SECRET).update(orderId).digest("hex");
}

/** Constant-time comparison so the token cannot be probed by timing. */
export function verifyOrderToken(orderId: string, token: string | null): boolean {
  if (!token) return false;
  const expected = signOrderToken(orderId);
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(token, "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/** Admin Settings > Payments lets staff set these without a redeploy; falls
 * back to env vars, then a placeholder so the email still sends. */
export async function getBankDetails() {
  const [bankName, accountName, accountNumber] = await Promise.all([
    getSetting("bank-transfer-bank-name"),
    getSetting("bank-transfer-account-name"),
    getSetting("bank-transfer-account-number"),
  ]);

  return {
    bankName: bankName || process.env.BANK_TRANSFER_BANK_NAME || "[Bank name to be provided]",
    accountName: accountName || process.env.BANK_TRANSFER_ACCOUNT_NAME || "[Account name to be provided]",
    accountNumber: accountNumber || process.env.BANK_TRANSFER_ACCOUNT_NUMBER || "[Account number to be provided]",
  };
}

// Same faces as the website (src/app/layout.tsx: Outfit for body/UI text,
// Playfair Display for headings) — loaded via Google Fonts' CSS endpoint since
// email clients can't use next/font. Most webmail/Apple Mail/Outlook-on-the-web
// render it; clients that ignore @import (older desktop Outlook) fall back
// cleanly to the serif/sans-serif stacks listed alongside each font name.
const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');`;
const SANS_STACK = "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const SERIF_STACK = "'Playfair Display', Georgia, serif";

function wrapEmail(bodyHtml: string): string {
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
          <h2 style="font-family: ${SERIF_STACK}; color: #1C3322; margin: 0 0 6px; font-size: 24px;">Sana Amnis</h2>
          ${bodyHtml}
        </div>
      </body>
    </html>
  `;
}

const EYEBROW = (text: string) =>
  `<p style="font-family: ${SANS_STACK}; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #C9A227; margin: 0 0 20px;">${text}</p>
   <hr style="border: 0; border-top: 1px solid #E2E6E3;" />`;

const FOOTER = `
  <p style="margin-top: 24px; font-size: 13px; color: #676E6A;">
    Questions? Write to info@sanaamniscoconut.com or communitymart@gmail.com.
  </p>
  <p style="margin-top: 20px; font-family: ${SERIF_STACK}; color: #1C3322;">Sana Amnis</p>
`;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function itemsTableHtml(items: OrderLine[]): string {
  if (items.length === 0) return "";
  const rows = items
    .map(
      (item) => `
        <tr>
          <td style="padding: 8px 0; width: 56px;">
            <img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.label)}" width="48" height="48" style="width: 48px; height: 48px; object-fit: cover; border-radius: 8px; border: 1px solid #E2E6E3; display: block;" />
          </td>
          <td style="padding: 8px 0 8px 12px; font-size: 13px; color: #161A17;">${escapeHtml(item.label)} × ${item.quantity}</td>
        </tr>
      `
    )
    .join("");

  return `<table style="width: 100%; border-collapse: collapse; margin: 0 0 20px;">${rows}</table>`;
}

export async function customerBankDetailsEmail(opts: {
  orderNumber: string;
  amountLabel: string;
  confirmUrl: string;
  items: OrderLine[];
  deliveryLabel: string;
}) {
  const { bankName, accountName, accountNumber } = await getBankDetails();
  return wrapEmail(`
    ${EYEBROW("Bank transfer details")}
    <p>Thank you for your order <strong>${opts.orderNumber}</strong>. Please pay <strong>${opts.amountLabel}</strong> by bank transfer using the details below:</p>
    <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
      <tr><td style="padding: 6px 0; color: #676E6A;">Bank</td><td style="padding: 6px 0; font-weight: bold;">${bankName}</td></tr>
      <tr><td style="padding: 6px 0; color: #676E6A;">Account name</td><td style="padding: 6px 0; font-weight: bold;">${accountName}</td></tr>
      <tr><td style="padding: 6px 0; color: #676E6A;">Account number</td><td style="padding: 6px 0; font-weight: bold;">${accountNumber}</td></tr>
    </table>
    <p style="color: #676E6A; margin: 0 0 6px;">Order summary:</p>
    ${itemsTableHtml(opts.items)}
    <p style="color: #676E6A; margin: 0 0 20px;">${escapeHtml(opts.deliveryLabel)}</p>
    <p>Once you have made the transfer, click the button below to let us know so we can confirm it.</p>
    <p style="text-align: center; margin: 28px 0;">
      <a href="${opts.confirmUrl}" style="font-family: ${SANS_STACK}; background: #1C3322; color: #C9A227; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
        I've Made This Payment
      </a>
    </p>
    ${FOOTER}
  `);
}

export function staffNewBankTransferEmail(opts: {
  orderNumber: string;
  amountLabel: string;
  customerName: string;
  customerEmail: string;
  items: OrderLine[];
  deliveryLabel: string;
}) {
  return wrapEmail(`
    ${EYEBROW("New bank transfer order")}
    <p>Order <strong>${opts.orderNumber}</strong> from <strong>${opts.customerName}</strong> (${opts.customerEmail}) chose bank transfer for <strong>${opts.amountLabel}</strong>.</p>
    <p style="color: #676E6A; margin: 0 0 6px;">Items ordered:</p>
    ${itemsTableHtml(opts.items)}
    <p style="color: #676E6A; margin: 0 0 20px;">${escapeHtml(opts.deliveryLabel)}</p>
    <p>It is awaiting payment. No action is needed until the customer confirms they have paid.</p>
    ${FOOTER}
  `);
}

export function staffPaymentClaimedEmail(opts: {
  orderNumber: string;
  amountLabel: string;
  customerName: string;
  customerEmail: string;
}) {
  return wrapEmail(`
    ${EYEBROW("Payment claimed — please verify")}
    <p><strong>${opts.customerName}</strong> (${opts.customerEmail}) says they have paid by bank transfer for order <strong>${opts.orderNumber}</strong> (${opts.amountLabel}).</p>
    <p>Please check the bank account, then confirm the payment in the admin orders panel.</p>
    ${FOOTER}
  `);
}

export function customerPaymentConfirmedEmail(opts: { orderNumber: string; amountLabel: string }) {
  return wrapEmail(`
    ${EYEBROW("Payment confirmed")}
    <p>Thank you — we have confirmed your bank transfer of <strong>${opts.amountLabel}</strong> for order <strong>${opts.orderNumber}</strong>. We are packing your order now.</p>
    ${FOOTER}
  `);
}

export function customerDeliveryEmail(opts: { orderNumber: string }) {
  return wrapEmail(`
    ${EYEBROW("Order delivered")}
    <p>Your order <strong>${opts.orderNumber}</strong> has been delivered. We hope you enjoy it!</p>
    ${FOOTER}
  `);
}
