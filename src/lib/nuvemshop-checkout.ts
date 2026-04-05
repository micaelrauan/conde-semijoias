/**
 * IMPORTANT - MANUAL STEP REQUIRED BEFORE THIS WORKS:
 * The Nuvemshop app must have the "write_draft_orders" scope enabled.
 *
 * To enable it:
 * 1. Go to your Nuvemshop Partners Portal
 * 2. Open your app -> "Dados Basicos"
 * 3. Add scopes: write_draft_orders, read_draft_orders
 * 4. Save and REINSTALL the app in your demo store
 * 5. Get a new access token and update NUVEMSHOP_TOKEN in .env.local
 *
 * Without this scope, POST /draft_orders will return 403 Forbidden.
 */

const BASE_URL = `https://api.nuvemshop.com.br/2025-03/${process.env.NUVEMSHOP_STORE_ID}`;
const HEADERS = {
  Authentication: `bearer ${process.env.NUVEMSHOP_TOKEN}`,
  "User-Agent": "CondeJoias (contato@condesemijoias.com.br)",
  "Content-Type": "application/json",
};

export class CheckoutIntegrationError extends Error {
  status: number;
  detail?: string;

  constructor(message: string, status = 500, detail?: string) {
    super(message);
    this.name = "CheckoutIntegrationError";
    this.status = status;
    this.detail = detail;
  }
}

export interface CheckoutItem {
  variantId: number;
  quantity: number;
  price: number; // in cents
  name: string;
}

export interface DraftOrderResult {
  id: number;
  checkoutUrl: string;
  token: string;
}

export async function createDraftOrder(
  items: CheckoutItem[],
  customer?: {
    name?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  },
): Promise<DraftOrderResult> {
  if (!process.env.NUVEMSHOP_STORE_ID || !process.env.NUVEMSHOP_TOKEN) {
    throw new CheckoutIntegrationError(
      "Configuracao da Nuvemshop ausente no servidor.",
      500,
      "Defina NUVEMSHOP_STORE_ID e NUVEMSHOP_TOKEN no .env.local.",
    );
  }

  const products = items.map((item) => ({
    variant_id: item.variantId,
    quantity: item.quantity,
  }));

  const body: Record<string, unknown> = { products };
  if (customer?.email) body.contact_email = customer.email;

  const trimmedFirstName = customer?.firstName?.trim();
  const trimmedLastName = customer?.lastName?.trim();
  const trimmedFullName = customer?.name?.trim();

  const fallbackFirstName = trimmedFullName?.split(/\s+/)[0];
  const fallbackLastName = trimmedFullName
    ?.split(/\s+/)
    .slice(1)
    .join(" ")
    .trim();

  const contactName = trimmedFirstName || fallbackFirstName;
  const contactLastname = trimmedLastName || fallbackLastName || "Cliente";

  if (contactName) body.contact_name = contactName;
  body.contact_lastname = contactLastname;

  const res = await fetch(`${BASE_URL}/draft_orders`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({} as Record<string, unknown>));
    const payload = JSON.stringify(error);
    console.error(
      "Nuvemshop createDraftOrder failed:",
      res.status,
      payload,
    );

    if (res.status === 401) {
      throw new CheckoutIntegrationError(
        "Token da Nuvemshop invalido ou expirado.",
        401,
        payload,
      );
    }

    if (res.status === 403) {
      throw new CheckoutIntegrationError(
        "Permissao negada na Nuvemshop. Habilite write_draft_orders e reinstale o app.",
        403,
        payload,
      );
    }

    if (res.status === 422) {
      throw new CheckoutIntegrationError(
        "Dados invalidos para criar o checkout na Nuvemshop.",
        422,
        payload,
      );
    }

    throw new CheckoutIntegrationError(
      "Falha ao criar checkout na Nuvemshop.",
      res.status,
      payload,
    );
  }

  const data = await res.json();
  console.log("Draft order created:", data.id, data.abandoned_checkout_url);

  if (!data.abandoned_checkout_url) {
    throw new CheckoutIntegrationError(
      "Nuvemshop did not return a checkout URL. Make sure checkout is enabled in store settings.",
      502,
    );
  }

  return {
    id: data.id,
    checkoutUrl: data.abandoned_checkout_url,
    token: data.token,
  };
}
