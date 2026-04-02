"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      router.push("/conta");
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.message?.includes("Invalid login credentials")) {
        setError("Email ou senha incorretos");
      } else if (err.message?.includes("Email not confirmed")) {
        setError("Por favor, confirme seu email antes de fazer login");
      } else {
        setError("Erro ao fazer login. Tente novamente.");
      }
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
            ENTRAR
          </h1>
          <p className="text-gray-600 font-light">
            Entre na sua conta para continuar
          </p>
        </div>

        {/* Form */}
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-gray-900 font-light transition-all"
              placeholder="seu@email.com"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-light text-gray-700 mb-2"
            >
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-gray-900 font-light transition-all"
              placeholder="••••••••"
            />
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <Link
              href="/recuperar-senha"
              className="text-sm font-light text-gray-600 hover:text-black transition-colors"
            >
              Esqueceu a senha?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-3 rounded-lg font-light hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 font-light">
            Não tem uma conta?{" "}
            <Link
              href="/cadastro"
              className="text-black hover:underline font-normal"
            >
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
