import crypto from "crypto";
import { getSetting } from "@/lib/settings";
import { wrapEmailHtml, emailEyebrow, EMAIL_FOOTER, escapeHtml, SANS_STACK, CONTACT_EMAIL } from "@/lib/emailTemplate";

const TOKEN_SECRET =
  process.env.BANK_TRANSFER_TOKEN_SECRET || "fallback_default_secret_minimum_32_characters_for_sana_amnis";

// Single inbox for all customer-care notifications — see CONTACT_EMAIL.
export const CUSTOMER_CARE_RECIPIENTS = [CONTACT_EMAIL];

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
  return wrapEmailHtml(`
    ${emailEyebrow("Bank transfer details")}
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
    ${EMAIL_FOOTER}
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
  return wrapEmailHtml(`
    ${emailEyebrow("New bank transfer order")}
    <p>Order <strong>${opts.orderNumber}</strong> from <strong>${opts.customerName}</strong> (${opts.customerEmail}) chose bank transfer for <strong>${opts.amountLabel}</strong>.</p>
    <p style="color: #676E6A; margin: 0 0 6px;">Items ordered:</p>
    ${itemsTableHtml(opts.items)}
    <p style="color: #676E6A; margin: 0 0 20px;">${escapeHtml(opts.deliveryLabel)}</p>
    <p>It is awaiting payment. No action is needed until the customer confirms they have paid.</p>
    ${EMAIL_FOOTER}
  `);
}

export function staffPaymentClaimedEmail(opts: {
  orderNumber: string;
  amountLabel: string;
  customerName: string;
  customerEmail: string;
}) {
  return wrapEmailHtml(`
    ${emailEyebrow("Payment claimed — please verify")}
    <p><strong>${opts.customerName}</strong> (${opts.customerEmail}) says they have paid by bank transfer for order <strong>${opts.orderNumber}</strong> (${opts.amountLabel}).</p>
    <p>Please check the bank account, then confirm the payment in the admin orders panel.</p>
    ${EMAIL_FOOTER}
  `);
}

export function customerPaymentConfirmedEmail(opts: { orderNumber: string; amountLabel: string }) {
  return wrapEmailHtml(`
    ${emailEyebrow("Payment confirmed")}
    <p>Thank you — we have confirmed your bank transfer of <strong>${opts.amountLabel}</strong> for order <strong>${opts.orderNumber}</strong>. We are packing your order now.</p>
    ${EMAIL_FOOTER}
  `);
}

/** The delivery fee and a human label were only ever recorded as free text inside
 * orders.shippingAddress at checkout time (see the three formats orders/route.ts
 * writes: pickup, a known delivery zone, or an out-of-zone address quoted
 * separately) — there is no dedicated column to read instead. Parsing it back
 * out here is what lets the delivery email show a delivery line that is
 * guaranteed to reconcile with the amount actually charged, rather than a
 * second, independently computed number that could drift from it. */
export function parseShippingAddress(raw: string): { deliveryFee: number; deliveryLabel: string } {
  const pickupMatch = raw.match(/PICKUP:\s*(.+)/);
  if (pickupMatch) {
    return { deliveryFee: 0, deliveryLabel: `Pickup — ${pickupMatch[1].trim()}` };
  }

  const zoneMatch = raw.match(/Delivery zone:\s*(.+?)\s*—\s*₦([\d,]+)\s*paid at checkout/);
  if (zoneMatch) {
    return { deliveryFee: Number(zoneMatch[2].replace(/,/g, "")), deliveryLabel: `Delivery — ${zoneMatch[1].trim()}` };
  }

  if (/cost to be communicated separately/.test(raw)) {
    return { deliveryFee: 0, deliveryLabel: "Delivery — cost communicated separately" };
  }

  return { deliveryFee: 0, deliveryLabel: "Delivery" };
}

export function customerDeliveryEmail(opts: {
  orderNumber: string;
  items: OrderLine[];
  subtotal: number;
  deliveryFee: number;
  deliveryLabel: string;
  total: number;
}) {
  const money = (n: number) => `₦${Math.round(n).toLocaleString("en-NG")}`;

  return wrapEmailHtml(`
    ${emailEyebrow("Order delivered")}
    <p>Your order <strong>${opts.orderNumber}</strong> has been delivered. We hope you enjoy it!</p>
    <p style="color: #676E6A; margin: 20px 0 6px;">What was delivered:</p>
    ${itemsTableHtml(opts.items)}
    <table style="width: 100%; border-collapse: collapse; margin: 4px 0 0;">
      <tr>
        <td style="padding: 6px 0; color: #676E6A;">Items subtotal</td>
        <td style="padding: 6px 0; text-align: right;">${money(opts.subtotal)}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #676E6A;">${escapeHtml(opts.deliveryLabel)}</td>
        <td style="padding: 6px 0; text-align: right;">${opts.deliveryFee > 0 ? money(opts.deliveryFee) : "₦0"}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0 0; font-weight: bold; border-top: 1px solid #E2E6E3;">Total paid</td>
        <td style="padding: 10px 0 0; font-weight: bold; text-align: right; border-top: 1px solid #E2E6E3;">${money(opts.total)}</td>
      </tr>
    </table>
    ${EMAIL_FOOTER}
  `);
}
