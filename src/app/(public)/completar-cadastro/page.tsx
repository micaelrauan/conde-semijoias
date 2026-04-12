"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { formatWhatsapp, parseWhatsapp } from "@/lib/whatsapp";

export default function CompletarCadastroPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoaded, isSignedIn, user } = useUser();

  const initialWhatsapp = useMemo(() => {
    const metadataValue = user?.publicMetadata?.whatsapp;
    if (typeof metadataValue !== "string") return "";
    return formatWhatsapp(metadataValue);
  }, [user]);

  const [whatsapp, setWhatsapp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    const hasWhatsapp = typeof user?.publicMetadata?.whatsapp === "string";
    if (hasWhatsapp) {
      const next = searchParams.get("next");
      router.replace(next && next.startsWith("/") ? next : "/");
    }
  }, [isLoaded, isSignedIn, user, searchParams, router]);

  useEffect(() => {
    if (initialWhatsapp) {
      setWhatsapp(initialWhatsapp);
    }
  }, [initialWhatsapp]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const parsed = parseWhatsapp(whatsapp);
    if (!parsed.ok) {
      setError(parsed.error ?? "WhatsApp invalido.");
      return;
    }

    setIsSaving(true);

    try {
      const res = await fetch("/api/users/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ whatsapp }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Nao foi possivel salvar seu WhatsApp.");
      }

      await user?.reload();

      const next = searchParams.get("next");
      router.replace(next && next.startsWith("/") ? next : "/");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Nao foi possivel salvar seu WhatsApp.";
      setError(message);
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-12 pt-36">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h1 className="text-2xl font-light text-black">
          Complete seu cadastro
        </h1>
        <p className="mt-2 text-sm text-gray-600 font-light">
          Para continuar, informe seu WhatsApp para contato e atendimento.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="whatsapp"
              className="mb-2 block text-sm font-light text-gray-700"
            >
              WhatsApp
            </label>
            <input
              id="whatsapp"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="(85) 99999-9999"
              value={whatsapp}
              onChange={(event) => setWhatsapp(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-black outline-none transition-colors focus:border-black"
              required
            />
            <p className="mt-2 text-xs text-gray-500 font-light">
              Formato aceito: DDD + numero (com ou sem +55).
            </p>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={isSaving}
            className="w-full rounded-lg bg-black py-3 text-sm font-light text-white transition-colors hover:bg-gray-800 disabled:bg-gray-300"
          >
            {isSaving ? "Salvando..." : "Salvar e continuar"}
          </button>
        </form>
      </div>
    </div>
  );
}
