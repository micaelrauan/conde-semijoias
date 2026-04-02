import { mockCartByUser } from "../mock-data";
import { getProducts } from "./products";
import type { CartItem, AddToCartDTO } from "../types";

// ============================================
// CARRINHO
// ============================================

/**
 * Busca todos os itens do carrinho do usuário
 */
export async function getCartItems(userId: string) {
  const items = mockCartByUser[userId] || [];
  const products = await getProducts();

  return items.map((item) => {
    const product = products.find((entry) => entry.id === item.product_id);
    return {
      ...item,
      product,
    };
  });
}

/**
 * Adiciona item ao carrinho
 */
export async function addToCart(userId: string, dto: AddToCartDTO) {
  const now = new Date().toISOString();
  const items = mockCartByUser[userId] || [];
  const existing = items.find((item) => item.product_id === dto.product_id);

  if (existing) {
    existing.quantity += dto.quantity;
    existing.updated_at = now;
    return existing;
  }

  const newItem: CartItem = {
    id: `cart-${Date.now()}`,
    user_id: userId,
    product_id: dto.product_id,
    quantity: dto.quantity,
    created_at: now,
    updated_at: now,
  };

  mockCartByUser[userId] = [newItem, ...items];
  return newItem;
}

/**
 * Atualiza quantidade de um item no carrinho
 */
export async function updateCartItemQuantity(
  cartItemId: string,
  quantity: number,
) {
  if (quantity <= 0) {
    return removeFromCart(cartItemId);
  }

  for (const [userId, items] of Object.entries(mockCartByUser)) {
    const target = items.find((item) => item.id === cartItemId);
    if (target) {
      target.quantity = quantity;
      target.updated_at = new Date().toISOString();
      mockCartByUser[userId] = [...items];
      return target;
    }
  }

  throw new Error("Item do carrinho nao encontrado");
}

/**
 * Remove item do carrinho
 */
export async function removeFromCart(cartItemId: string) {
  for (const [userId, items] of Object.entries(mockCartByUser)) {
    const filtered = items.filter((item) => item.id !== cartItemId);
    if (filtered.length !== items.length) {
      mockCartByUser[userId] = filtered;
      break;
    }
  }

  return { success: true };
}

/**
 * Limpa todo o carrinho do usuário
 */
export async function clearCart(userId: string) {
  mockCartByUser[userId] = [];
  return { success: true };
}

/**
 * Calcula o total do carrinho
 */
export async function getCartTotal(userId: string) {
  const items = await getCartItems(userId);

  const total = items.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  return {
    items: items.length,
    total,
  };
}
