"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getCartItems,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
  getCartTotal,
} from "@/lib/api/cart";
import type { CartItem } from "@/lib/types";

interface CartContextType {
  items: CartItem[];
  isLoading: boolean;
  isOpen: boolean;
  itemCount: number;
  total: number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearAllItems: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const user = { id: "demo-user" };
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [total, setTotal] = useState(0);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const loadCart = async () => {
    try {
      setIsLoading(true);
      const cartItems = await getCartItems(user.id);
      setItems(cartItems);
      const cartTotal = await getCartTotal(user.id);
      setTotal(cartTotal.total);
    } catch (error) {
      console.error("Erro ao carregar carrinho:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen(!isOpen);

  const addItem = async (productId: string, quantity: number = 1) => {
    try {
      await addToCart(user.id, { product_id: productId, quantity });
      await loadCart();
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error);
      throw error;
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      await updateCartItemQuantity(itemId, quantity);
      await loadCart();
    } catch (error) {
      console.error("Erro ao atualizar quantidade:", error);
      throw error;
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await removeFromCart(itemId);
      await loadCart();
    } catch (error) {
      console.error("Erro ao remover item:", error);
      throw error;
    }
  };

  const clearAllItems = async () => {
    try {
      await clearCart(user.id);
      await loadCart();
    } catch (error) {
      console.error("Erro ao limpar carrinho:", error);
      throw error;
    }
  };

  const refreshCart = async () => {
    await loadCart();
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isLoading,
        isOpen,
        itemCount,
        total,
        openCart,
        closeCart,
        toggleCart,
        addItem,
        updateQuantity,
        removeItem,
        clearAllItems,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart deve ser usado dentro de um CartProvider");
  }
  return context;
}
