import { auth, currentUser } from "@clerk/nextjs/server";
import { getPedidosByEmail } from "@/lib/nuvemshop";
import type { StoredOrder } from "@/lib/orders-store";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Nao autorizado" }, { status: 401 });
  }

  const user = await currentUser();
  const email =
    user?.primaryEmailAddress?.emailAddress ||
    user?.emailAddresses?.[0]?.emailAddress;

  if (!email) {
    return Response.json({ error: "Email nao encontrado" }, { status: 400 });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const remoteOrders = await getPedidosByEmail(email);
    const filteredOrders = remoteOrders.filter(
      (order) =>
        (order.contact_email ?? "").trim().toLowerCase() === normalizedEmail,
    );
    const orders: StoredOrder[] = filteredOrders.map((order) => ({
      id: order.id,
      token: order.token ?? String(order.id),
      customerEmail: order.contact_email ?? email,
      customerName: order.contact_name ?? "Cliente",
      total: String(order.total ?? "0"),
      subtotal: String(order.subtotal ?? "0"),
      status: order.status ?? "pending",
      createdAt: order.created_at ?? new Date().toISOString(),
      products: (order.products ?? []).map((product) => ({
        name: product.name ?? "Produto",
        quantity: Number(product.quantity ?? 1),
        price: String(product.price ?? "0"),
        image: product.image?.src ?? undefined,
      })),
      shippingAddress: order.shipping_address
        ? {
            address:
              `${order.shipping_address} ${order.shipping_number ?? ""}`.trim(),
            city: order.shipping_city ?? "",
            province: order.shipping_province ?? "",
            zipcode: order.shipping_zipcode ?? "",
            country: order.shipping_country ?? "",
          }
        : undefined,
    }));

    return Response.json({ orders });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro inesperado";
    return Response.json({ error: message, orders: [] }, { status: 500 });
  }
}
