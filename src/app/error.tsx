"use client";

import Link from "next/link";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="min-h-screen bg-white px-4 py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-light text-black">Algo deu errado</h1>
        <p className="mx-auto mt-4 max-w-xl text-gray-600">
          Ocorreu um erro inesperado. Tente novamente ou volte para a home.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            TENTAR NOVAMENTE
          </button>
          <Link
            href="/"
            className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-gray-50"
          >
            VOLTAR PARA HOME
          </Link>
        </div>
      </div>
    </div>
  );
}
