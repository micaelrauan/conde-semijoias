"use client";

import { useEffect, useState } from "react";
import { SignInButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import type { StoredOrder } from "@/lib/orders-store";

export default function MeusPedidosPage() {
  const { isSignedIn } = useUser();
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSignedIn) {
      setLoading(false);
      return;
    }

    fetch("/api/pedidos")
      .then((r) => r.json())
      .then((data) => setOrders(data.orders ?? []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [isSignedIn]);

  if (!isSignedIn) {
    return (
      <main className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-xl border border-gray-200 p-8 text-center space-y-4">
          <h1 className="text-2xl font-light tracking-wider text-black">
            Meus Pedidos
          </h1>
          <p className="text-gray-600 font-light">
            Faça login para ver seus pedidos.
          </p>
          <SignInButton mode="modal">
            <button
              type="button"
              className="bg-black text-white rounded-lg px-6 py-3 hover:bg-gray-800 transition-colors"
            >
              ENTRAR
            </button>
          </SignInButton>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-gray-700 font-light">Carregando pedidos...</p>
        </div>
      </main>
    );
  }

  if (orders.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-xl border border-gray-200 p-8 text-center space-y-4">
          <h1 className="text-2xl font-light tracking-wider text-black">
            Meus Pedidos
          </h1>
          <p className="text-gray-600 font-light">
            Você ainda não fez nenhum pedido.
          </p>
          <Link
            href="/produtos"
            className="inline-flex bg-black text-white rounded-lg px-6 py-3 hover:bg-gray-800 transition-colors"
          >
            Explorar produtos
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <h1 className="text-2xl font-light tracking-wider text-black">
          Meus Pedidos
        </h1>

        {orders.map((order) => (
          <article
            key={order.id}
            className="bg-white rounded-xl border border-gray-200 p-6 space-y-4"
          >
            <header className="flex flex-wrap justify-between gap-4">
              <div>
                <h2 className="text-lg text-black font-light">
                  Pedido #{order.id}
                </h2>
                <p className="text-sm text-gray-500 font-light">
                  {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center rounded-full px-3 py-1 text-xs bg-green-50 text-green-700 border border-green-200">
                  Pago
                </span>
                <p className="text-lg text-black font-light mt-2">
                  R$ {order.total}
                </p>
              </div>
            </header>

            <ul className="space-y-2">
              {order.products.map((item, i) => (
                <li
                  key={`${order.id}-${i}`}
                  className="text-sm text-gray-700 font-light"
                >
                  {item.name} · x{item.quantity} · R$ {item.price}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </main>
  );
}
