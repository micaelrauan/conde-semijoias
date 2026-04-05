"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";

export default function PedidoSucessoPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const { clearCart } = useCart();
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    if (!cleared) {
      clearCart();
      setCleared(true);
    }
  }, [cleared, clearCart]);

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl border border-gray-200 p-8 text-center space-y-5">
        <div className="mx-auto w-14 h-14 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-2xl">
          ✓
        </div>

        <h1 className="text-3xl font-light text-black">Pedido confirmado!</h1>

        <p className="text-gray-600 font-light">
          Obrigada pela sua compra. Um email de confirmacao foi enviado para o
          seu endereco.
        </p>

        {orderId && (
          <p className="text-sm text-gray-500 font-light">Pedido #{orderId}</p>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/meus-pedidos"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-black text-white px-6 hover:bg-gray-800 transition-colors"
          >
            VER MEUS PEDIDOS
          </Link>
          <Link
            href="/produtos"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-gray-300 text-gray-700 px-6 hover:border-gray-400 hover:text-black transition-colors"
          >
            CONTINUAR COMPRANDO
          </Link>
        </div>
      </div>
    </main>
  );
}
