"use client";

import { SignInButton, useUser } from "@clerk/nextjs";
import { useState } from "react";
import type { CartItem } from "@/context/CartContext";

interface CheckoutButtonProps {
  items: CartItem[];
  className: string;
}

export default function CheckoutButton({
  items,
  className,
}: CheckoutButtonProps) {
  const { isLoaded, isSignedIn, user } = useUser();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (items.length === 0 || isCheckingOut) return;

    setIsCheckingOut(true);
    setCheckoutError(null);

    try {
      const checkoutItems = items.map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
        price: item.price,
        name: item.name,
      }));

      const customer = isSignedIn
        ? {
            email: user?.primaryEmailAddress?.emailAddress,
            name: user?.fullName ?? undefined,
            firstName: user?.firstName ?? undefined,
            lastName: user?.lastName ?? undefined,
          }
        : undefined;

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: checkoutItems, customer }),
      });

      const data = await res
        .json()
        .catch(() => ({ error: "Falha inesperada ao iniciar checkout." }));

      if (!res.ok) {
        throw new Error(data.detail || data.error || "Erro ao iniciar checkout");
      }

      if (!data.checkoutUrl) {
        throw new Error("URL de checkout não recebida");
      }

      window.location.href = data.checkoutUrl;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Erro ao finalizar compra. Tente novamente.";
      setCheckoutError(message);
      setIsCheckingOut(false);
    }
  };

  if (!isLoaded) {
    return (
      <button type="button" disabled className={className}>
        Carregando...
      </button>
    );
  }

  if (items.length === 0) {
    return (
      <button type="button" disabled className={className}>
        Carrinho vazio
      </button>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="space-y-2">
        <SignInButton mode="modal">
          <button type="button" className={className}>
            Faça login para continuar
          </button>
        </SignInButton>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleCheckout}
        disabled={isCheckingOut || items.length === 0}
        className={className}
      >
        {isCheckingOut ? "Redirecionando..." : "Prosseguir para checkout"}
      </button>

      {checkoutError && (
        <p className="text-xs text-red-600 text-center">{checkoutError}</p>
      )}
    </div>
  );
}
