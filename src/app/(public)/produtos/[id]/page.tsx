"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { getProductById } from "@/lib/api";
import type { Product } from "@/lib/types";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default function ProdutoDetalhePage() {
  const params = useParams<{ id: string }>();
  const productId = params?.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { addItem } = useCart();

  useEffect(() => {
    let mounted = true;

    async function loadProduct() {
      if (!productId) {
        setError("Produto invalido.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getProductById(productId);

        if (!mounted) {
          return;
        }

        setProduct(data);
      } catch (err) {
        if (!mounted) {
          return;
        }

        const message =
          err instanceof Error ? err.message : "Nao foi possivel carregar o produto.";
        setError(message);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      mounted = false;
    };
  }, [productId]);

  const gallery = useMemo(() => {
    if (!product?.image_url) {
      return [];
    }

    return [product.image_url];
  }, [product]);

  const canAddToCart = Boolean(product && (product.stock ?? 0) > 0);
  const maxQuantity = Math.max(1, product?.stock ?? 1);

  const handleAddToCart = () => {
    if (!product || !canAddToCart) {
      return;
    }

    const variantId = product.variant_id ?? Number(product.id);

    for (let i = 0; i < selectedQuantity; i += 1) {
      addItem(product, variantId);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-amber-100 border-t-amber-700 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-light">Carregando produto...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white px-4 py-16">
        <div className="max-w-3xl mx-auto text-center border border-amber-100 rounded-3xl p-10 bg-linear-to-b from-amber-50/70 to-white">
          <h1 className="text-3xl font-light text-black mb-3">Produto nao encontrado</h1>
          <p className="text-gray-600 font-light mb-8">{error || "Este produto nao esta disponivel."}</p>
          <Link
            href="/produtos"
            className="inline-flex items-center justify-center bg-black text-white px-8 py-3 rounded-xl hover:bg-gray-800 transition-colors"
          >
            Voltar para produtos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <nav className="mb-8 flex items-center gap-2 text-sm">
          <Link href="/" className="font-light text-gray-500 transition-colors hover:text-black">
            Inicio
          </Link>
          <span className="text-gray-400">/</span>
          <Link
            href="/produtos"
            className="font-light text-gray-500 transition-colors hover:text-black"
          >
            Produtos
          </Link>
          <span className="text-gray-400">/</span>
          <span className="truncate font-light text-black">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <div className="relative overflow-hidden rounded-3xl border border-amber-100 bg-linear-to-br from-amber-50 via-white to-zinc-100">
              <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-amber-200/25 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-zinc-300/20 blur-2xl" />

              <div className="relative aspect-4/5 w-full">
                {gallery.length > 0 ? (
                  <Image
                    src={gallery[selectedImageIndex]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-cover transition-transform duration-500 hover:scale-[1.03]"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-400">
                    Sem imagem
                  </div>
                )}
              </div>

              <div className="absolute bottom-4 left-4 rounded-full border border-white/60 bg-white/80 px-4 py-2 text-xs font-medium uppercase tracking-widest text-zinc-700 backdrop-blur-sm">
                Curadoria Conde
              </div>
            </div>

            {gallery.length > 1 && (
              <div className="mt-4 grid grid-cols-5 gap-3">
                {gallery.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-square overflow-hidden rounded-xl border transition-colors ${
                      selectedImageIndex === index
                        ? "border-amber-500"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                    aria-label={`Selecionar imagem ${index + 1}`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                <p className="text-[11px] uppercase tracking-widest text-zinc-500">Frete</p>
                <p className="mt-1 text-sm font-medium text-zinc-800">Rapido para todo Brasil</p>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                <p className="text-[11px] uppercase tracking-widest text-zinc-500">Troca</p>
                <p className="mt-1 text-sm font-medium text-zinc-800">Facil em ate 7 dias</p>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                <p className="text-[11px] uppercase tracking-widest text-zinc-500">Pagamento</p>
                <p className="mt-1 text-sm font-medium text-zinc-800">Pix, cartao e boleto</p>
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-[0_18px_50px_-30px_rgba(0,0,0,0.35)] sm:p-8">
              {product.category?.name && (
                <p className="mb-3 text-xs uppercase tracking-[0.22em] text-zinc-500">{product.category.name}</p>
              )}

              <h1 className="mb-4 text-3xl font-light tracking-tight text-black sm:text-4xl lg:text-5xl">
                {product.name}
              </h1>

              <div className="mb-6 flex flex-wrap items-center gap-3">
                <span className="text-3xl font-light text-black sm:text-4xl">
                  {formatCurrency(product.price)}
                </span>
                {typeof product.stock === "number" && (
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide ${
                      product.stock > 0
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {product.stock > 0 ? `${product.stock} em estoque` : "Esgotado"}
                  </span>
                )}
              </div>

              {product.description && (
                <div className="mb-7 border-l-2 border-amber-200 pl-4">
                  <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-zinc-700">
                    {product.description}
                  </p>
                </div>
              )}

              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-zinc-700">Quantidade</label>
                <div className="inline-flex items-center overflow-hidden rounded-xl border border-zinc-300 bg-white">
                  <button
                    onClick={() => setSelectedQuantity((q) => Math.max(1, q - 1))}
                    className="px-4 py-2 text-lg leading-none transition-colors hover:bg-zinc-50"
                    aria-label="Diminuir quantidade"
                    disabled={selectedQuantity <= 1}
                  >
                    -
                  </button>
                  <span className="min-w-14 px-5 py-2 text-center text-sm font-medium">{selectedQuantity}</span>
                  <button
                    onClick={() => setSelectedQuantity((q) => Math.min(maxQuantity, q + 1))}
                    className="px-4 py-2 text-lg leading-none transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:text-zinc-300"
                    aria-label="Aumentar quantidade"
                    disabled={selectedQuantity >= maxQuantity || !canAddToCart}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mb-7 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleAddToCart}
                  disabled={!canAddToCart}
                  className="group flex-1 rounded-xl bg-black px-6 py-4 text-sm font-medium uppercase tracking-wider text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
                >
                  <span className="inline-flex items-center gap-2">
                    {canAddToCart ? "Adicionar ao carrinho" : "Produto esgotado"}
                  </span>
                </button>
                <Link
                  href="/carrinho"
                  className="rounded-xl border border-black px-6 py-4 text-center text-sm font-medium uppercase tracking-wider text-black transition-colors hover:bg-zinc-50"
                >
                  Ver carrinho
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                  <p className="text-[11px] uppercase tracking-wider text-zinc-500">Codigo do produto</p>
                  <p className="mt-1 font-medium text-zinc-800">{product.id}</p>
                </div>
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                  <p className="text-[11px] uppercase tracking-wider text-zinc-500">Slug</p>
                  <p className="mt-1 truncate font-medium text-zinc-800">{product.slug}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
