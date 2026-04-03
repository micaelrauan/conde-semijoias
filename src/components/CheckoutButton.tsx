"use client";

import { SignInButton, useUser } from "@clerk/nextjs";
import type { CartItem } from "@/context/CartContext";

interface CheckoutButtonProps {
  items: CartItem[];
  className: string;
}

export default function CheckoutButton({
  items,
  className,
}: CheckoutButtonProps) {
  const { isLoaded, isSignedIn } = useUser();

  const handleCheckout = () => {
    // TODO: implement checkout
    alert("Checkout em breve!");
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
      <SignInButton mode="modal">
        <button type="button" className={className}>
          Faça login para continuar
        </button>
      </SignInButton>
    );
  }

  return (
    <button type="button" onClick={handleCheckout} className={className}>
      Finalizar Compra
    </button>
  );
}
