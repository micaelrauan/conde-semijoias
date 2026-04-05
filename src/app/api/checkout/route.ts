import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  CheckoutIntegrationError,
  CheckoutItem,
  createDraftOrder,
} from "@/lib/nuvemshop-checkout";

export async function POST(request: NextRequest) {
  console.log("=== POST /api/checkout called ===");

  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json(
        { error: "Voce precisa estar logado para finalizar a compra" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { items, customer } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return Response.json({ error: "Carrinho esta vazio" }, { status: 400 });
    }

    for (const item of items) {
      if (!item.variantId || !item.quantity || item.quantity < 1) {
        return Response.json(
          { error: "Item do carrinho invalido" },
          { status: 400 },
        );
      }
    }

    console.log(
      "Creating draft order for user:",
      userId,
      "items:",
      items.length,
    );

    const draftOrder = await createDraftOrder(
      items as CheckoutItem[],
      customer,
    );

    console.log("Checkout URL generated:", draftOrder.checkoutUrl);

    return Response.json({
      checkoutUrl: draftOrder.checkoutUrl,
      orderId: draftOrder.id,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro inesperado";
    console.error("=== /api/checkout ERROR ===", message);

    if (err instanceof CheckoutIntegrationError) {
      return Response.json(
        {
          error: err.message,
          detail: err.detail,
        },
        { status: err.status || 500 },
      );
    }

    return Response.json(
      {
        error: "Erro ao processar checkout. Tente novamente.",
        detail: message,
      },
      { status: 500 },
    );
  }
}
