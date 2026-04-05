/**
 * MANUAL STEPS REQUIRED IN NUVEMSHOP ADMIN:
 *
 * 1. WEBHOOK:
 *    Nuvemshop Admin -> Configuracoes -> API -> Webhooks
 *    Event: order/paid
 *    URL: https://your-domain.com/api/webhooks/nuvemshop
 *
 * 2. SUCCESS REDIRECT:
 *    Nuvemshop Admin -> Configuracoes -> Checkout
 *    URL de retorno apos compra:
 *    https://your-domain.com/pedido/sucesso?order_id={order_id}
 */

import { NextRequest } from "next/server";
import { saveOrder, StoredOrder } from "@/lib/orders-store";
import { sendOrderConfirmationEmail } from "@/lib/resend";

export async function POST(request: NextRequest) {
  console.log("=== Nuvemshop webhook received ===");

  try {
    const body = await request.json();
    console.log("Event:", body.event, "Order ID:", body.id);

    if (body.event !== "order/paid") {
      return Response.json({ received: true }, { status: 200 });
    }

    const order = body;

    const stored: StoredOrder = {
      id: order.id,
      token: order.token,
      customerEmail: order.contact_email,
      customerName: order.contact_name,
      total: order.total,
      subtotal: order.subtotal,
      status: "paid",
      createdAt: order.created_at,
      products: (order.products ?? []).map((p: any) => ({
        name: p.name,
        quantity: p.quantity,
        price: p.price,
        image: p.image?.src ?? undefined,
      })),
      shippingAddress: order.shipping_address
        ? {
            address:
              `${order.shipping_address} ${order.shipping_number ?? ""}`.trim(),
            city: order.shipping_city,
            province: order.shipping_province,
            zipcode: order.shipping_zipcode,
            country: order.shipping_country,
          }
        : undefined,
    };

    saveOrder(stored);
    console.log("Order saved:", stored.id);

    await sendOrderConfirmationEmail({
      to: stored.customerEmail,
      customerName: stored.customerName,
      orderId: stored.id,
      total: stored.total,
      products: stored.products,
      shippingAddress: stored.shippingAddress,
    });

    return Response.json(
      { received: true, orderId: stored.id },
      { status: 200 },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro inesperado";
    console.error("Webhook error:", message);
    return Response.json({ received: true, error: message }, { status: 200 });
  }
}
