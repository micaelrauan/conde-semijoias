import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getProdutos } from "@/lib/nuvemshop";

export const metadata: Metadata = {
  title: "Lancamentos - Conde Semijoias",
  description:
    "Conheca os lancamentos da Conde Semijoias e descubra as pecas mais recentes da nossa colecao.",
};

type LancamentoItem = {
  id: number;
  nome: string;
  slug: string;
  imagem: string;
  preco: number;
  precoAnterior?: number;
  categoria?: string;
};

function toNumber(value?: string | null): number | null {
  if (!value || !value.trim()) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function mapLancamentos(
  products: Awaited<ReturnType<typeof getProdutos>>,
): LancamentoItem[] {
  return products
    .slice()
    .sort((a, b) => b.id - a.id)
    .map((product) => {
      const variant = product.variants?.[0];

      const basePrice = toNumber(variant?.price) ?? 0;
      const promotionalPrice = toNumber(variant?.promotional_price);
      const compareAtPrice = toNumber(variant?.compare_at_price);

      const hasPromo =
        typeof promotionalPrice === "number" &&
        promotionalPrice > 0 &&
        promotionalPrice < basePrice;

      const preco = hasPromo ? promotionalPrice : basePrice;

      let precoAnterior: number | undefined;
      if (hasPromo) {
        precoAnterior = basePrice;
      } else if (
        typeof compareAtPrice === "number" &&
        compareAtPrice > basePrice
      ) {
        precoAnterior = compareAtPrice;
      }

      return {
        id: product.id,
        nome: product.name.pt,
        slug: product.handle.pt,
        imagem: product.images?.[0]?.src || "/placeholder.jpg",
        preco,
        precoAnterior,
        categoria: product.categories?.[0]?.name?.pt,
      };
    })
    .slice(0, 24);
}

export default async function LancamentosPage() {
  const { products } = await getProdutos({ page: 1, per_page: 200 });
  const lancamentos = mapLancamentos(products);
  const destaque = lancamentos[0];

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-6 flex items-center gap-2 text-sm">
          <Link
            href="/"
            className="font-light text-gray-500 transition-colors hover:text-black"
          >
            Inicio
          </Link>
          <span className="text-gray-400">/</span>
          <span className="font-light text-black">Lancamentos</span>
        </nav>

        <header className="relative overflow-hidden rounded-3xl border border-[#670006]/20 bg-linear-to-r from-[#3A0005] via-[#670006] to-[#8E1420] p-7 text-white sm:p-10">
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/15 blur-3xl" />
          <div className="absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-[#D5A980]/30 blur-2xl" />

          <p className="relative text-xs uppercase tracking-[0.3em] text-white/75">
            Nova Colecao
          </p>
          <h1 className="relative mt-2 text-3xl font-light leading-tight sm:text-5xl">
            Lancamentos que traduzem
            <span className="block text-[#F3D8BE]">
              elegancia contemporanea
            </span>
          </h1>
          <p className="relative mt-4 max-w-2xl text-sm font-light text-white/90 sm:text-base">
            Selecao das pecas mais recentes da Conde Semijoias, com acabamento
            premium e estilo para cada momento.
          </p>

          <div className="relative mt-6 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-white/35 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/90">
              {lancamentos.length} novidades
            </span>
            <Link
              href="/produtos"
              className="rounded-full bg-white px-5 py-2 text-xs uppercase tracking-[0.2em] text-[#670006] transition-colors hover:bg-[#F8ECE0]"
            >
              Ver catalogo completo
            </Link>
          </div>
        </header>

        {destaque && (
          <section className="mt-8 grid gap-6 rounded-3xl border border-[#670006]/10 bg-[#FFF9F5] p-4 sm:grid-cols-[1.1fr_1fr] sm:p-6">
            <Link
              href={`/produtos/${destaque.id}`}
              className="group relative block overflow-hidden rounded-2xl"
            >
              <div className="relative aspect-4/3">
                <Image
                  src={destaque.imagem}
                  alt={destaque.nome}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 60vw"
                />
                <span className="absolute left-4 top-4 rounded-full bg-[#670006] px-3 py-1 text-xs tracking-wider text-white">
                  DESTAQUE
                </span>
              </div>
            </Link>

            <div className="flex flex-col justify-center">
              <p className="text-xs uppercase tracking-[0.2em] text-[#670006]/70">
                {destaque.categoria || "Colecao exclusiva"}
              </p>
              <h2 className="mt-3 text-2xl font-light text-[#2A1510] sm:text-3xl">
                {destaque.nome}
              </h2>
              <div className="mt-5 flex items-end gap-3">
                <span className="text-2xl text-[#670006]">
                  {formatCurrency(destaque.preco)}
                </span>
                {typeof destaque.precoAnterior === "number" && (
                  <span className="pb-1 text-sm text-gray-400 line-through">
                    {formatCurrency(destaque.precoAnterior)}
                  </span>
                )}
              </div>
              <Link
                href={`/produtos/${destaque.id}`}
                className="mt-6 inline-flex w-fit items-center rounded-lg bg-black px-5 py-3 text-sm font-light text-white transition-colors hover:bg-gray-800"
              >
                Ver detalhes
              </Link>
            </div>
          </section>
        )}

        <section className="mt-8">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-xl font-light text-black">
              Ultimos lancamentos
            </h3>
          </div>

          {lancamentos.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-10 text-center">
              <p className="text-gray-600">
                Ainda nao ha lancamentos disponiveis.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {lancamentos.map((item, index) => (
                <article
                  key={item.id}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <Link href={`/produtos/${item.id}`} className="block">
                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                      <Image
                        src={item.imagem}
                        alt={item.nome}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                      {index < 8 && (
                        <span className="absolute left-3 top-3 rounded-full bg-[#670006] px-3 py-1 text-[10px] tracking-[0.15em] text-white">
                          NOVO
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 p-4">
                      <p className="text-[11px] uppercase tracking-[0.12em] text-[#670006]/60">
                        {item.categoria || "Semijoias"}
                      </p>
                      <h4 className="line-clamp-2 min-h-12 text-sm font-light text-black">
                        {item.nome}
                      </h4>

                      <div className="flex items-end gap-2">
                        <span className="text-lg text-[#670006]">
                          {formatCurrency(item.preco)}
                        </span>
                        {typeof item.precoAnterior === "number" && (
                          <span className="text-sm text-gray-400 line-through">
                            {formatCurrency(item.precoAnterior)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
