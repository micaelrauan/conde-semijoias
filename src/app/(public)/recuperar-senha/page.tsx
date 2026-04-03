"use client";

import { useState } from "react";
import Link from "next/link";
import { SignInButton } from "@clerk/nextjs";

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setSuccess(true);
    } catch (err: any) {
      console.error("Password reset error:", err);
      setError("Erro ao enviar email. Verifique o endereço e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light tracking-wider text-black mb-2">
            RECUPERAR SENHA
          </h1>
          <p className="text-gray-600 font-light">
            Digite seu email para receber o link de recuperação
          </p>
        </div>

        {success ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <svg
              className="w-16 h-16 text-green-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-xl font-light text-green-900 mb-2">
              Email enviado!
            </h2>
            <p className="text-green-700 font-light mb-6">
              Verifique sua caixa de entrada e siga as instruções para redefinir
              sua senha.
            </p>
            <SignInButton mode="modal">
              <button
                type="button"
                className="inline-block text-black font-light hover:underline"
              >
                ← Voltar para login
              </button>
            </SignInButton>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-light">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-light text-gray-700 mb-2"
              >
                E-mail
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-900 font-light transition-all"
                placeholder="seu@email.com"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-all font-light tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "ENVIANDO..." : "ENVIAR LINK"}
            </button>

            {/* Back to Login */}
            <div className="text-center">
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="text-sm font-light text-gray-600 hover:text-black transition-colors"
                >
                  ← Voltar para login
                </button>
              </SignInButton>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
