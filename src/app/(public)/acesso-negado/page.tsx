"use client";

import Link from "next/link";
import { SignInButton } from "@clerk/nextjs";

export default function AcessoNegado() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">⚠️</span>
          </div>

          <h1 className="text-3xl font-light text-black mb-4">Acesso Negado</h1>

          <p className="text-gray-600 mb-6">
            Você não tem permissão para acessar esta página.
          </p>

          <div className="space-y-3">
            <Link
              href="/home"
              className="block w-full px-6 py-3 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Voltar para Loja
            </Link>

            <SignInButton mode="modal">
              <button
                type="button"
                className="block w-full px-6 py-3 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Fazer Login com Outra Conta
              </button>
            </SignInButton>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Verifique se sua sessão está ativa e tente novamente.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Se o problema persistir, entre em contato com o suporte.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
