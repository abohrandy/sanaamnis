const SQUAD_SECRET_KEY = process.env.SQUAD_SECRET_KEY || "sandbox_sk_mockkey";

// Squad uses separate hosts for sandbox and live keys rather than one host
// that reads the key's mode, so the key prefix picks the base URL.
const SQUAD_BASE_URL = SQUAD_SECRET_KEY.startsWith("sandbox_")
  ? "https://sandbox-api-d.squadco.com"
  : "https://api-d.squadco.com";

export interface SquadInitResponse {
  status: number;
  message: string;
  data: {
    checkout_url: string;
    transaction_ref: string;
    transaction_amount: number;
    currency: string;
  };
}

export interface SquadVerifyResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    transaction_amount: number;
    transaction_ref: string;
    email: string;
    transaction_status: string; // "Success", "Failed", "Abandoned", "Pending"
    transaction_currency_id: string;
  };
}

export async function initializeSquadPayment(
  email: string,
  amountInNaira: number,
  callbackUrl: string,
  transactionRef: string,
  customerName?: string,
  metadata?: any
): Promise<SquadInitResponse> {
  const amountInKobo = Math.round(amountInNaira * 100);

  const response = await fetch(`${SQUAD_BASE_URL}/transaction/initiate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SQUAD_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount: amountInKobo,
      currency: "NGN",
      initiate_type: "inline",
      transaction_ref: transactionRef,
      callback_url: callbackUrl,
      customer_name: customerName,
      metadata,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Squad initialization failed: ${errorText}`);
  }

  return response.json();
}

export async function verifySquadPayment(transactionRef: string): Promise<SquadVerifyResponse> {
  const response = await fetch(`${SQUAD_BASE_URL}/transaction/verify/${encodeURIComponent(transactionRef)}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${SQUAD_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Squad verification failed: ${errorText}`);
  }

  return response.json();
}
