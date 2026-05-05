"use client";

import { useEffect, useState } from "react";
import { SignInButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import type { StoredOrder } from "@/lib/orders-store";
import { buildWhatsAppLink } from "@/lib/store-contact";

function formatMoney(value: string) {
  const numericValue = Number(
    value.replace(/[^0-9,.-]/g, "").replace(",", "."),
  );
  if (Number.isNaN(numericValue)) return `R$ ${value}`;

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numericValue);
}

function getStatusLabel(status: string) {
  switch (status) {
    case "paid":
      return "Pago";
    case "pending":
      return "Pendente";
    case "processing":
      return "Em preparo";
    case "completed":
      return "Concluído";
    case "cancelled":
      return "Cancelado";
    default:
      return status;
  }
}

function getStatusClasses(status: string) {
  switch (status) {
    case "paid":
    case "completed":
      return "bg-green-50 text-green-700 border-green-200";
    case "processing":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "cancelled":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
}

function buildOrderSummary(order: StoredOrder) {
  const items = order.products
    .map((item) => `• ${item.name} x${item.quantity} - R$ ${item.price}`)
    .join("\n");

  const address = order.shippingAddress
    ? `\nEndereço: ${order.shippingAddress.address} - ${order.shippingAddress.city}/${order.shippingAddress.province} - CEP ${order.shippingAddress.zipcode}`
    : "";

  return [
    `Olá, quero falar sobre o pedido #${order.id}.`,
    `Status: ${getStatusLabel(order.status)}`,
    `Cliente: ${order.customerName}`,
    `Email: ${order.customerEmail}`,
    `Total: ${formatMoney(order.total)}`,
    `Produtos:\n${items}`,
    address,
  ]
    .filter(Boolean)
    .join("\n\n");
}

export default function MeusPedidosPage() {
  const { isSignedIn } = useUser();
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isSignedIn) {
      setLoading(false);
      return;
    }

    fetch("/api/pedidos")
      .then(async (response) => {
        const data = await response
          .json()
          .catch(() => ({ error: "Falha ao ler resposta do servidor." }));

        if (!response.ok) {
          throw new Error(
            data?.error || "Nao foi possivel carregar seus pedidos.",
          );
        }

        return data;
      })
      .then((data) => {
        setOrders(data.orders ?? []);
        setErrorMessage(null);
      })
      .catch((err) => {
        const message =
          err instanceof Error
            ? err.message
            : "Nao foi possivel carregar seus pedidos.";
        setOrders([]);
        setErrorMessage(message);
      })
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

  if (errorMessage) {
    return (
      <main className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-xl border border-red-200 p-8 text-center space-y-4">
          <h1 className="text-2xl font-light tracking-wider text-black">
            Meus Pedidos
          </h1>
          <p className="text-red-700 font-light">{errorMessage}</p>
          <p className="text-gray-600 font-light">
            Tente novamente em alguns instantes ou fale com a nossa equipe.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-black text-white px-6 hover:bg-gray-800 transition-colors"
            >
              Tentar novamente
            </button>
            <Link
              href="/contato"
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-gray-300 text-gray-700 px-6 hover:border-gray-400 hover:text-black transition-colors"
            >
              Falar com a loja
            </Link>
          </div>
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
            className="bg-white rounded-xl border border-gray-200 p-6 space-y-5 shadow-sm"
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
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs border ${getStatusClasses(order.status)}`}
                >
                  {getStatusLabel(order.status)}
                </span>
                <p className="text-lg text-black font-light mt-2">
                  {formatMoney(order.total)}
                </p>
              </div>
            </header>

            <div className="grid gap-3 text-sm text-gray-600 sm:grid-cols-2">
              <div>
                <p className="font-medium text-black">Criado em</p>
                <p>
                  {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <div>
                <p className="font-medium text-black">Cliente</p>
                <p>{order.customerName}</p>
                <p className="truncate">{order.customerEmail}</p>
              </div>
            </div>

            <ul className="space-y-2">
              {order.products.map((item, i) => (
                <li
                  key={`${order.id}-${i}`}
                  className="text-sm text-gray-700 font-light flex items-center justify-between gap-4 border-b border-gray-100 pb-2"
                >
                  <span>
                    {item.name} · x{item.quantity}
                  </span>
                  <span className="whitespace-nowrap">
                    {formatMoney(item.price)}
                  </span>
                </li>
              ))}
            </ul>

            {order.shippingAddress && (
              <div className="rounded-lg bg-gray-50 border border-gray-200 p-4 text-sm text-gray-700 space-y-1">
                <p className="font-medium text-black">Endereço de entrega</p>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city} -{" "}
                  {order.shippingAddress.province}
                </p>
                <p>CEP {order.shippingAddress.zipcode}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={buildWhatsAppLink(buildOrderSummary(order))}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#670006] text-white px-5 hover:bg-black transition-colors"
              >
                Falar no WhatsApp com este pedido
              </a>

              <Link
                href="/contato"
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-gray-300 text-gray-700 px-5 hover:border-gray-400 hover:text-black transition-colors"
              >
                Ver contato da loja
              </Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
