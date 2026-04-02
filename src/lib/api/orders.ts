import { mockOrderItems, mockOrders } from "../mock-data";
import { getProducts } from "./products";
import type { Order, OrderItem, CreateOrderDTO } from "../types";
import { clearCart } from "./cart";

// ============================================
// PEDIDOS
// ============================================

/**
 * Busca todos os pedidos do usuário
 */
export async function getOrders(userId: string) {
  return mockOrders
    .filter((order) => order.user_id === userId)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

/**
 * Busca um pedido por ID
 */
export async function getOrderById(orderId: string, userId: string) {
  const order = mockOrders.find(
    (item) => item.id === orderId && item.user_id === userId,
  );

  if (!order) {
    throw new Error("Pedido nao encontrado");
  }

  const products = await getProducts();
  const orderItems = mockOrderItems
    .filter((item) => item.order_id === orderId)
    .map((item) => ({
      ...item,
      product: products.find((product) => product.id === item.product_id),
    }));

  return { ...order, order_items: orderItems as OrderItem[] };
}

/**
 * Cria um novo pedido
 */
export async function createOrder(userId: string, dto: CreateOrderDTO) {
  // Calcula o total
  const total = dto.items.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  const now = new Date().toISOString();
  const order: Order = {
    id: `order-${Date.now()}`,
    user_id: userId,
    total,
    status: "pending",
    shipping_address_street: dto.shipping_address.street,
    shipping_address_number: dto.shipping_address.number,
    shipping_address_complement: dto.shipping_address.complement,
    shipping_address_neighborhood: dto.shipping_address.neighborhood,
    shipping_address_city: dto.shipping_address.city,
    shipping_address_state: dto.shipping_address.state,
    shipping_address_zipcode: dto.shipping_address.zipcode,
    created_at: now,
    updated_at: now,
  };

  mockOrders.unshift(order);

  for (const item of dto.items) {
    mockOrderItems.push({
      id: `order-item-${Date.now()}-${item.product_id}`,
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
      created_at: now,
    });
  }

  // Limpa o carrinho
  await clearCart(userId);

  return order as Order;
}

/**
 * Atualiza o status de um pedido
 */
export async function updateOrderStatus(
  orderId: string,
  status: "pending" | "processing" | "completed" | "cancelled",
) {
  const order = mockOrders.find((item) => item.id === orderId);
  if (!order) {
    throw new Error("Pedido nao encontrado");
  }

  order.status = status;
  order.updated_at = new Date().toISOString();
  return order;
}

/**
 * Cancela um pedido
 */
export async function cancelOrder(orderId: string, userId: string) {
  const order = mockOrders.find(
    (item) => item.id === orderId && item.user_id === userId,
  );

  if (!order) {
    throw new Error("Pedido não encontrado");
  }

  if (order.status === "completed" || order.status === "cancelled") {
    throw new Error("Este pedido não pode ser cancelado");
  }

  return updateOrderStatus(orderId, "cancelled");
}
