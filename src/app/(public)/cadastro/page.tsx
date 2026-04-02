"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CadastroPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validações
    if (name.trim().length < 3) {
      setError("Nome deve ter pelo menos 3 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      router.push("/conta");
    } catch (err: any) {
      console.error("Register error:", err);
      if (err.message?.includes("already registered")) {
        setError("Este email já está cadastrado");
      } else if (err.message?.includes("invalid email")) {
        setError("Email inválido");
      } else {
        setError("Erro ao criar conta. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-20">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light tracking-wider text-black mb-2">
            CRIAR CONTA
          </h1>
          <p className="text-gray-600 font-light">
            Preencha os dados para criar sua conta
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-light">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-light text-gray-700 mb-2"
            >
              Nome completo
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-gray-900 font-light transition-all"
              placeholder="Seu nome"
            />
          </div>

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
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-light text-gray-700 mb-2"
            >
              Confirmar senha
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-gray-900 font-light transition-all"
              placeholder="Digite a senha novamente"
            />
          </div>

          {/* Terms */}
          <div className="flex items-start">
            <input type="checkbox" id="terms" required className="mt-1 mr-2" />
            <label htmlFor="terms" className="text-sm font-light text-gray-600">
              Aceito os{" "}
              <Link href="/termos" className="text-black hover:underline">
                termos de uso
              </Link>{" "}
              e a{" "}
              <Link href="/privacidade" className="text-black hover:underline">
                política de privacidade
              </Link>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-3 rounded-lg font-light hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "Criando conta..." : "Criar conta"}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 font-light">
            Já tem uma conta?{" "}
            <Link
              href="/login"
              className="text-black hover:underline font-normal"
            >
              Entre aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
