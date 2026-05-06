"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

const AUTO_CLOSE_MS = 4000;

export default function CartToast() {
  const { lastAddedItem, lastAddedAt, clearLastAdded } = useCart();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!lastAddedItem || !lastAddedAt) {
      return;
    }

    setIsVisible(true);
    const timer = window.setTimeout(() => {
      setIsVisible(false);
      clearLastAdded();
    }, AUTO_CLOSE_MS);

    return () => window.clearTimeout(timer);
  }, [lastAddedItem, lastAddedAt, clearLastAdded]);

  if (!lastAddedItem || !isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 z-[60]">
      <div className="max-w-md ml-auto bg-white border border-gray-200 shadow-lg rounded-xl px-4 py-3 flex items-center gap-3 animate-fade-in">
        <div className="h-9 w-9 rounded-full bg-black text-white flex items-center justify-center shrink-0">
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900">
            Produto adicionado
          </p>
          <p className="text-xs text-gray-600 truncate">{lastAddedItem.name}</p>
        </div>
        <Link
          href="/carrinho"
          className="text-xs font-semibold text-black hover:text-gray-700 transition-colors"
        >
          Ver carrinho
        </Link>
        <button
          type="button"
          onClick={() => {
            setIsVisible(false);
            clearLastAdded();
          }}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Fechar aviso"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
