const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || "sk_test_mockkey";

export interface PaystackInitResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    domain: string;
    status: string; // "success", "failed", etc.
    reference: string;
    amount: number;
    gateway_response: string;
    paid_at: string;
    channel: string;
    currency: string;
    metadata: any;
    customer: {
      email: string;
    };
  };
}

export async function initializePaystackPayment(
  email: string,
  amountInNaira: number,
  callbackUrl: string,
  metadata?: any
): Promise<PaystackInitResponse> {
  const amountInKobo = Math.round(amountInNaira * 100);

  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount: amountInKobo,
      callback_url: callbackUrl,
      metadata,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Paystack initialization failed: ${errorText}`);
  }

  return response.json();
}

export async function verifyPaystackPayment(reference: string): Promise<PaystackVerifyResponse> {
  const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Paystack verification failed: ${errorText}`);
  }

  return response.json();
}

export async function refundPaystackPayment(
  transactionReference: string,
  amountInNaira?: number
): Promise<any> {
  const body: any = { transaction: transactionReference };
  if (amountInNaira) {
    body.amount = Math.round(amountInNaira * 100);
  }

  const response = await fetch("https://api.paystack.co/refund", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Paystack refund failed: ${errorText}`);
  }

  return response.json();
}
