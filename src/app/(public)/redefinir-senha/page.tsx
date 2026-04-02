"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedefinirSenhaPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      console.error("Password update error:", err);
      setError("Erro ao redefinir senha. O link pode ter expirado.");
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
            NOVA SENHA
          </h1>
          <p className="text-gray-600 font-light">Digite sua nova senha</p>
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
              Senha redefinida!
            </h2>
            <p className="text-green-700 font-light mb-4">
              Sua senha foi alterada com sucesso. Redirecionando para login...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-light">
                {error}
              </div>
            )}

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-light text-gray-700 mb-2"
              >
                Nova senha
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-900 font-light transition-all"
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-light text-gray-700 mb-2"
              >
                Confirmar nova senha
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-900 font-light transition-all"
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-all font-light tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "REDEFININDO..." : "REDEFINIR SENHA"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
