"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import CheckoutButton from "@/components/CheckoutButton";

export default function CarrinhoPage() {
  const {
    items,
    totalFormatted,
    itemCount,
    updateQuantity,
    removeItem,
    clearCart,
    isLoading,
  } = useCart();

  const formatCurrency = (valueInCents: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valueInCents / 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-light">Carregando carrinho...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-light tracking-wider text-black mb-1">
              MEU CARRINHO
            </h1>
            <p className="text-sm text-gray-500 font-light">
              {itemCount} {itemCount === 1 ? "item" : "itens"}
            </p>
          </div>
          <Link
            href="/"
            prefetch
            className="text-gray-600 hover:text-black transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Link>
        </div>

        {items.length === 0 ? (
          /* Carrinho Vazio */
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <svg
              className="w-32 h-32 text-gray-300 mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h2 className="text-xl font-light text-gray-900 mb-3">
              Seu carrinho está vazio
            </h2>
            <p className="text-gray-500 font-light mb-8">
              Adicione produtos para continuar comprando
            </p>
            <Link
              href="/"
              prefetch
              className="bg-black text-white px-8 py-3 rounded-lg font-light hover:bg-gray-800 transition-colors"
            >
              Explorar Produtos
            </Link>
          </div>
        ) : (
          <>
            {/* Lista de Itens */}
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div
                  key={item.variantId}
                  className="bg-white rounded-lg p-4 flex gap-4"
                >
                  {/* Imagem */}
                  <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg
                          className="w-10 h-10 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Detalhes */}
                  <div className="flex-1">
                    <h3 className="text-base font-light text-gray-900 mb-2">
                      {item.name}
                    </h3>
                    <p className="text-lg font-light text-black mb-4">
                      {formatCurrency(item.price)}
                    </p>

                    {/* Controles */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.variantId,
                              Math.max(1, item.quantity - 1),
                            )
                          }
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                        >
                          -
                        </button>
                        <span className="text-base font-light w-10 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.variantId, item.quantity + 1)
                          }
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.variantId)}
                        className="text-red-500 hover:text-red-700 transition-colors p-2"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Limpar Carrinho */}
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-red-500 text-sm font-light hover:text-red-700 transition-colors mb-6"
              >
                Limpar Carrinho
              </button>
            )}

            {/* Total e Checkout - Fixo no bottom em mobile */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 space-y-3 md:hidden">
              <div className="flex justify-between items-center text-lg">
                <span className="font-light text-gray-700">Total</span>
                <span className="font-light text-black text-xl">
                  {totalFormatted}
                </span>
              </div>
              <CheckoutButton
                items={items}
                className="w-full bg-black text-white py-3 rounded-lg font-light hover:bg-gray-800 transition-colors disabled:bg-gray-300"
              />
              <p className="text-xs text-gray-500 font-light text-center">
                Frete e impostos calculados no checkout
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
