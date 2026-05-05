"use client";

import { useEffect, useMemo, useState } from "react";
import { SignInButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
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

function getStatusIcon(status: string) {
  switch (status) {
    case "paid":
    case "completed":
      return (
        <svg
          viewBox="0 0 16 16"
          aria-hidden="true"
          className="h-3.5 w-3.5"
        >
          <path
            d="M3.5 8.5l3 3 6-7"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "processing":
    case "pending":
      return (
        <svg
          viewBox="0 0 16 16"
          aria-hidden="true"
          className="h-3.5 w-3.5"
        >
          <circle
            cx="8"
            cy="8"
            r="6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M8 4.5v3.8l2.4 1.6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "cancelled":
      return (
        <svg
          viewBox="0 0 16 16"
          aria-hidden="true"
          className="h-3.5 w-3.5"
        >
          <path
            d="M8 2.3l6 10.4H2L8 2.3z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M8 6v3.2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="8" cy="11.6" r="0.8" fill="currentColor" />
        </svg>
      );
    default:
      return (
        <svg
          viewBox="0 0 16 16"
          aria-hidden="true"
          className="h-3.5 w-3.5"
        >
          <circle cx="8" cy="8" r="6" fill="currentColor" />
        </svg>
      );
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
  const [expandedOrders, setExpandedOrders] = useState<number[]>([]);

  const expandedSet = useMemo(
    () => new Set(expandedOrders),
    [expandedOrders],
  );

  const toggleExpanded = (orderId: number) => {
    setExpandedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId],
    );
  };

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
        <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-gray-200 p-8 sm:p-10 text-center space-y-5 shadow-sm">
          <div className="mx-auto w-28 h-28 rounded-full bg-gradient-to-br from-gray-50 via-white to-gray-100 border border-gray-200/70 flex items-center justify-center">
            <Image
              src="/assets/home/novidades.jpg"
              alt="Produtos em destaque"
              width={88}
              height={88}
              className="h-20 w-20 rounded-full object-cover"
              priority
            />
          </div>
          <h1 className="text-2xl font-light tracking-[0.2em] text-black">
            Meus Pedidos
          </h1>
          <p className="text-gray-600 font-light">
            Você ainda não fez nenhum pedido.
          </p>
          <Link
            href="/produtos"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-black text-white px-8 py-3 text-sm uppercase tracking-[0.2em] hover:bg-gray-800 transition-colors"
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
        <h1 className="text-2xl font-light tracking-[0.2em] text-black">
          Meus Pedidos
        </h1>

        {orders.map((order) => (
          <div key={order.id} className="group">
          <article
            className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-9 space-y-6 shadow-sm transition-shadow duration-300 group-hover:shadow-md"
          >
            <header className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                  Pedido
                </p>
                <h2 className="text-base text-gray-500 font-light">
                  #{order.id}
                </h2>
                <p className="text-sm text-gray-500 font-light mt-2">
                  {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="text-right space-y-3">
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs border ${getStatusClasses(order.status)}`}
                >
                  {getStatusIcon(order.status)}
                  {getStatusLabel(order.status)}
                </span>
                <p className="text-xl text-black font-light">
                  {formatMoney(order.total)}
                </p>
              </div>
            </header>

            <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600">
              <div>
                <p className="font-medium text-black">Cliente</p>
                <p>{order.customerName}</p>
                <p className="truncate">{order.customerEmail}</p>
              </div>

              <button
                type="button"
                onClick={() => toggleExpanded(order.id)}
                className="text-sm text-gray-700 hover:text-black transition-colors"
                aria-expanded={expandedSet.has(order.id)}
              >
                {expandedSet.has(order.id)
                  ? "Ocultar detalhes"
                  : "Ver detalhes"}
              </button>
            </div>

            <div
              className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-out ${
                expandedSet.has(order.id)
                  ? "max-h-[1000px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="pt-6 space-y-5">
                <div className="space-y-2 border-b border-gray-100 pb-4">
                  {order.products.map((item, i) => (
                    <div
                      key={`${order.id}-${i}`}
                      className="flex items-center justify-between gap-4 text-sm text-gray-700 font-light"
                    >
                      <span>
                        {item.name} · x{item.quantity}
                      </span>
                      <span className="whitespace-nowrap">
                        {formatMoney(item.price)}
                      </span>
                    </div>
                  ))}
                </div>

                {order.shippingAddress && (
                  <div className="rounded-xl border border-gray-200/70 bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 text-sm text-gray-700 space-y-1">
                    <div className="flex items-center gap-2 text-black font-medium">
                      <svg
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                        className="h-4 w-4 text-gray-500"
                      >
                        <path
                          d="M10 2.5c-2.8 0-5 2.2-5 5 0 3.7 5 9 5 9s5-5.3 5-9c0-2.8-2.2-5-5-5z"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.4"
                        />
                        <circle
                          cx="10"
                          cy="7.5"
                          r="2"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.4"
                        />
                      </svg>
                      Endereço de entrega
                    </div>
                    <p>{order.shippingAddress.address}</p>
                    <p>
                      {order.shippingAddress.city} -{" "}
                      {order.shippingAddress.province}
                    </p>
                    <p>CEP {order.shippingAddress.zipcode}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={buildWhatsAppLink(buildOrderSummary(order))}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#670006] text-white px-6 text-sm uppercase tracking-[0.2em] hover:bg-black transition-colors"
              >
                Falar no WhatsApp com este pedido
              </a>

              <Link
                href="/contato"
                className="inline-flex min-h-11 items-center justify-center text-sm text-gray-600 hover:text-black transition-colors"
              >
                Ver contato da loja
              </Link>
            </div>
          </article>
          </div>
        ))}
      </div>
    </main>
  );
}
