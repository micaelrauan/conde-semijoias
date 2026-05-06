"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { NuvemshopProduct } from "../../types/nuvemshop";

type CartProductSource =
  | NuvemshopProduct
  | {
      id: string | number;
      name: string;
      price: number;
      image_url?: string;
      slug: string;
      variants?: Array<{ id: number; price: string | number; name?: string }>;
    };

export interface CartItem {
  id: number;
  variantId: number;
  name: string;
  variantName?: string;
  price: number;
  image: string;
  quantity: number;
  slug: string;
}

interface CartContextType {
  items: CartItem[];
  isLoading: boolean;
  isCheckingOut: boolean;
  checkoutError: string | null;
  totalItems: number;
  totalPrice: number;
  totalFormatted: string;
  itemCount: number;
  total: number;
  lastAddedItem: CartItem | null;
  lastAddedAt: number;
  addItem: (product: CartProductSource, variantId: number) => void;
  removeItem: (variantId: number) => void;
  updateQuantity: (variantId: number, quantity: number) => void;
  clearCart: () => void;
  clearAllItems: () => void;
  refreshCart: () => void;
  clearLastAdded: () => void;
}

const CART_STORAGE_KEY = "cart";

const CartContext = createContext<CartContextType | undefined>(undefined);

function parsePriceToCents(value: string | number): number {
  return Math.round(Number(value) * 100);
}

function isNuvemshopProduct(
  product: CartProductSource,
): product is NuvemshopProduct {
  return typeof (product as NuvemshopProduct).name === "object";
}

function readVariantText(
  value: string | { pt?: string; es?: string; en?: string } | undefined,
): string | undefined {
  if (!value) {
    return undefined;
  }

  if (typeof value === "string") {
    return value.trim() || undefined;
  }

  return value.pt || value.es || value.en || undefined;
}

function getNuvemshopVariantLabel(
  variant: NuvemshopProduct["variants"][number] | undefined,
): string | undefined {
  if (!variant) {
    return undefined;
  }

  const possibleGroups = [
    variant.values,
    variant.option_values,
    variant.attributes,
  ];

  for (const group of possibleGroups) {
    if (!Array.isArray(group) || group.length === 0) {
      continue;
    }

    const label = group
      .map((entry) => readVariantText(entry))
      .filter((entry): entry is string => Boolean(entry))
      .join(" / ");

    if (label) {
      return label;
    }
  }

  return readVariantText(variant.name) || variant.sku || undefined;
}

function mapCartItem(product: CartProductSource, variantId: number): CartItem {
  const productId = Number(product.id);

  if (isNuvemshopProduct(product)) {
    const variant =
      product.variants.find((item) => item.id === variantId) ||
      product.variants[0];

    return {
      id: productId,
      variantId,
      name: product.name.pt,
      variantName: getNuvemshopVariantLabel(variant),
      price: parsePriceToCents(variant?.price || 0),
      image: product.images[0]?.src || "",
      quantity: 1,
      slug: product.handle.pt,
    };
  }

  const selectedVariant = product.variants?.find(
    (item) => item.id === variantId,
  );
  const selectedVariantName = selectedVariant?.name?.trim();

  return {
    id: productId,
    variantId,
    name: product.name,
    variantName:
      selectedVariantName && selectedVariantName !== "Padrão"
        ? selectedVariantName
        : undefined,
    price: parsePriceToCents(selectedVariant?.price ?? product.price),
    image: product.image_url || "",
    quantity: 1,
    slug: product.slug,
  };
}

function formatCurrency(valueInCents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valueInCents / 100);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingOut] = useState(false);
  const [checkoutError] = useState<string | null>(null);
  const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);
  const [lastAddedAt, setLastAddedAt] = useState(0);

  useEffect(() => {
    try {
      const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        const parsed = JSON.parse(storedCart) as CartItem[];
        setItems(Array.isArray(parsed) ? parsed : []);
      }
    } catch {
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoading) return;
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items, isLoading]);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const totalFormatted = useMemo(
    () => formatCurrency(totalPrice),
    [totalPrice],
  );

  const addItem = (product: CartProductSource, variantId: number) => {
    const nextItem = mapCartItem(product, variantId);
    setLastAddedItem(nextItem);
    setLastAddedAt(Date.now());

    setItems((currentItems) => {
      const existingIndex = currentItems.findIndex(
        (item) => item.variantId === variantId,
      );

      if (existingIndex >= 0) {
        const nextItems = [...currentItems];
        nextItems[existingIndex] = {
          ...nextItems[existingIndex],
          quantity: nextItems[existingIndex].quantity + 1,
        };
        return nextItems;
      }

      return [...currentItems, nextItem];
    });
  };

  const removeItem = (variantId: number) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.variantId !== variantId),
    );
  };

  const updateQuantity = (variantId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(variantId);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.variantId === variantId ? { ...item, quantity } : item,
      ),
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const clearLastAdded = () => {
    setLastAddedItem(null);
    setLastAddedAt(0);
  };

  const refreshCart = () => {
    try {
      const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        const parsed = JSON.parse(storedCart) as CartItem[];
        setItems(Array.isArray(parsed) ? parsed : []);
      } else {
        setItems([]);
      }
    } catch {
      setItems([]);
    }
  };

  const value = useMemo<CartContextType>(
    () => ({
      items,
      isLoading,
      isCheckingOut,
      checkoutError,
      totalItems,
      totalPrice,
      totalFormatted,
      itemCount: totalItems,
      total: totalPrice,
      lastAddedItem,
      lastAddedAt,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      clearAllItems: clearCart,
      refreshCart,
      clearLastAdded,
    }),
    [
      items,
      isLoading,
      isCheckingOut,
      checkoutError,
      totalItems,
      totalPrice,
      totalFormatted,
      lastAddedItem,
      lastAddedAt,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart deve ser usado dentro de um CartProvider");
  }

  return context;
}
