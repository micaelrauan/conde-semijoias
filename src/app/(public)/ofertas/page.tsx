import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getProdutos } from "@/lib/nuvemshop";

export const metadata: Metadata = {
  title: "Ofertas - Conde Semijoias",
  description:
    "Veja os produtos da Conde Semijoias com desconto ativo e aproveite as melhores ofertas.",
};

type OfertaItem = {
  id: number;
  nome: string;
  slug: string;
  imagem: string;
  precoAtual: number;
  precoOriginal: number;
  desconto: number;
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

function mapToOfertaItems(
  products: Awaited<ReturnType<typeof getProdutos>>,
): OfertaItem[] {
  const ofertas: OfertaItem[] = [];

  for (const product of products) {
    const variant = product.variants?.[0];
    if (!variant) continue;

    const basePrice = toNumber(variant.price);
    if (!basePrice || basePrice <= 0) continue;

    const promotionalPrice = toNumber(variant.promotional_price);
    const compareAtPrice = toNumber(variant.compare_at_price);

    let precoAtual = basePrice;
    let precoOriginal: number | null = null;

    if (
      promotionalPrice &&
      promotionalPrice > 0 &&
      promotionalPrice < basePrice
    ) {
      precoAtual = promotionalPrice;
      precoOriginal = basePrice;
    } else if (compareAtPrice && compareAtPrice > basePrice) {
      precoAtual = basePrice;
      precoOriginal = compareAtPrice;
    }

    if (!precoOriginal || precoOriginal <= precoAtual) {
      continue;
    }

    const desconto = Math.round(
      ((precoOriginal - precoAtual) / precoOriginal) * 100,
    );
    if (desconto <= 0) continue;

    ofertas.push({
      id: product.id,
      nome: product.name.pt,
      slug: product.handle.pt,
      imagem: product.images?.[0]?.src || "/placeholder.jpg",
      precoAtual,
      precoOriginal,
      desconto,
    });
  }

  return ofertas.sort(
    (a, b) => b.desconto - a.desconto || a.precoAtual - b.precoAtual,
  );
}

export default async function OfertasPage() {
  const { products } = await getProdutos({ page: 1, per_page: 200 });
  const ofertas = mapToOfertaItems(products);

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
          <span className="font-light text-black">Ofertas</span>
        </nav>

        <header className="mb-8 rounded-2xl border border-[#670006]/15 bg-linear-to-r from-[#670006] to-[#8A121A] p-6 text-white">
          <p className="text-xs uppercase tracking-[0.25em] text-white/80">
            Conde Semijoias
          </p>
          <h1 className="mt-2 text-3xl font-light sm:text-4xl">
            Ofertas ativas
          </h1>
          <p className="mt-3 max-w-2xl text-sm font-light text-white/90 sm:text-base">
            Selecionamos os itens com desconto real para voce aproveitar
            enquanto durarem as condicoes promocionais.
          </p>
        </header>

        {ofertas.length === 0 ? (
          <section className="rounded-2xl border border-gray-200 bg-gray-50 p-10 text-center">
            <h2 className="text-2xl font-light text-black">
              Nenhuma oferta no momento
            </h2>
            <p className="mt-3 text-gray-600">
              Assim que novos itens entrarem em promocao, eles aparecem aqui
              automaticamente.
            </p>
            <Link
              href="/produtos"
              className="mt-6 inline-flex items-center rounded-lg bg-black px-6 py-3 text-sm font-light text-white transition-colors hover:bg-gray-800"
            >
              Ver todos os produtos
            </Link>
          </section>
        ) : (
          <section>
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm font-light text-gray-600">
                {ofertas.length}{" "}
                {ofertas.length === 1 ? "item em oferta" : "itens em oferta"}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {ofertas.map((item) => (
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
                      <span className="absolute left-3 top-3 rounded-full bg-[#670006] px-3 py-1 text-xs font-medium text-white">
                        -{item.desconto}%
                      </span>
                    </div>

                    <div className="space-y-2 p-4">
                      <h2 className="line-clamp-2 min-h-12 text-sm font-light text-black">
                        {item.nome}
                      </h2>

                      <div className="flex items-end gap-2">
                        <span className="text-lg font-medium text-[#670006]">
                          {formatCurrency(item.precoAtual)}
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                          {formatCurrency(item.precoOriginal)}
                        </span>
                      </div>

                      <p className="text-xs text-gray-500">
                        Economia de{" "}
                        {formatCurrency(item.precoOriginal - item.precoAtual)}
                      </p>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
