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

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

function QuantitySelector({ value, onChange, min = 1, max = 99, disabled }: QuantitySelectorProps) {
  const handleDecrement = () => {
    if (value > min) onChange(value - 1);
  };

  const handleIncrement = () => {
    if (value < max) onChange(value + 1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseInt(e.target.value, 10);
    if (!isNaN(num) && num >= min && num <= max) {
      onChange(num);
    }
  };

  return (
    <div className="inline-flex items-center border border-gray-300 rounded-lg overflow-hidden">
      <button
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        className="px-4 py-3 text-gray-600 hover:bg-gray-50 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
        aria-label="Diminuir quantidade"
      >
        −
      </button>
      <input
        type="number"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        min={min}
        max={max}
        className="w-16 py-3 text-center font-medium border-l border-r border-gray-300 focus:outline-none focus:bg-gray-50 disabled:bg-gray-50"
        aria-label="Quantidade"
      />
      <button
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        className="px-4 py-3 text-gray-600 hover:bg-gray-50 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
        aria-label="Aumentar quantidade"
      >
        +
      </button>
    </div>
  );
}

export default function ProdutoDetalhePage() {
  const params = useParams<{ id: string }>();
  const productId = params?.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [expandedFrete, setExpandedFrete] = useState(false);
  const [cepInput, setCepInput] = useState("");
  const { addItem } = useCart();

  useEffect(() => {
    let mounted = true;

    async function loadProduct() {
      if (!productId) {
        setError("Produto inválido.");
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
          err instanceof Error
            ? err.message
            : "Não foi possível carregar o produto.";
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
    if (!product?.images || product.images.length === 0) {
      if (product?.image_url) {
        return [{ src: product.image_url, alt: product.name }];
      }
      return [];
    }
    return product.images;
  }, [product]);

  const canAddToCart = Boolean(product && (product.stock ?? 0) > 0);
  const maxQuantity = Math.max(1, product?.stock ?? 1);

  // Usando os preços diretos do Nuvemshop
  const discountPrice = product?.price ?? 0;
  const originalPrice = product?.compare_at_price ?? discountPrice;
  const hasDiscount = originalPrice > discountPrice;
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - discountPrice) / originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!product || !canAddToCart) {
      return;
    }

    const variantId = product.variant_id ?? Number(product.id);

    for (let i = 0; i < selectedQuantity; i += 1) {
      addItem(product, variantId);
    }

    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 2000);
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleCepCheck = () => {
    // Simulando verificação de CEP
    if (cepInput.length === 8 || cepInput.length === 9) {
      console.log("CEP verificado:", cepInput);
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
          <h1 className="text-3xl font-bold text-black mb-3">Produto não encontrado</h1>
          <p className="text-gray-600 font-light mb-8">{error || "Este produto não está disponível."}</p>
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
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm font-light">
          <Link href="/" className="text-gray-500 hover:text-black transition-colors">
            Início
          </Link>
          <span className="text-gray-400">/</span>
          <Link href="/produtos" className="text-gray-500 hover:text-black transition-colors">
            Joias
          </Link>
          <span className="text-gray-400">/</span>
          {product.category?.name && (
            <>
              <span className="text-gray-500">{product.category.name}</span>
              <span className="text-gray-400">/</span>
            </>
          )}
          <span className="truncate text-black font-medium">{product.name}</span>
        </nav>

        {/* Grid Principal */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
          {/* Seção Esquerda - Imagem */}
          <div className="flex flex-col gap-6">
            {/* Imagem Principal */}
            <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-lg">
              <div className="relative aspect-square w-full bg-gradient-to-br from-gray-50 to-white">
                {gallery.length > 0 ? (
                  <Image
                    src={gallery[selectedImageIndex].src}
                    alt={gallery[selectedImageIndex].alt || product.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-contain p-4 hover:scale-105 transition-transform duration-300"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                    Sem imagem disponível
                  </div>
                )}
              </div>

              {/* Ícone Favorito */}
              <button
                onClick={handleFavorite}
                className="absolute top-4 right-4 bg-white rounded-full p-3 shadow-md hover:shadow-lg transition-all"
                aria-label={isFavorite ? "Remover favorito" : "Adicionar favorito"}
              >
                <svg
                  className={`w-6 h-6 transition-colors ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>

            {/* Thumbnails - Carousel de imagens */}
            {gallery.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {gallery.map((image, index) => (
                  <button
                    key={`${image.src}-${index}`}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative flex-shrink-0 w-24 h-24 rounded-lg border-2 overflow-hidden transition-colors ${
                      selectedImageIndex === index
                        ? "border-amber-500"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                    aria-label={`Selecionar imagem ${index + 1}`}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt || `${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Seção Direita - Detalhes */}
          <div className="flex flex-col gap-6">
            {/* Badge de Desconto */}
            {hasDiscount && (
              <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full w-fit">
                <span className="text-sm font-bold">{discountPercentage}% OFF</span>
              </div>
            )}

            {/* Link Coleção */}
            {product.category?.name && (
              <Link
                href={`/produtos?categoria=${product.category.name.toLowerCase()}`}
                className="text-blue-600 font-medium hover:underline text-sm"
              >
                ← Coleção {product.category.name}
              </Link>
            )}

            {/* Título */}
            <h1 className="text-3xl md:text-4xl font-bold text-black leading-tight">
              {product.name}
            </h1>

            {/* Preço */}
            <div className="flex flex-col gap-3">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold text-black">
                  {formatCurrency(discountPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-lg text-gray-500 line-through">
                    {formatCurrency(originalPrice)}
                  </span>
                )}
              </div>

              {/* Parcelamento */}
              <p className="text-gray-600 text-sm font-light">
                4x sem juros de <span className="font-semibold">{formatCurrency(discountPrice / 4)}</span>
              </p>
            </div>

            {/* Badge CashBack */}
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">
              <span className="text-emerald-700 font-medium text-sm">
                Ganhe {formatCurrency(discountPrice * 0.1)} em GIFTBACK
              </span>
              <button className="text-emerald-600 hover:text-emerald-700">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {/* Status Estoque */}
            <div>
              {typeof product.stock === "number" && (
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                  product.stock > 0
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700"
                }`}>
                  {product.stock > 0 ? `${product.stock} em estoque` : "Esgotado"}
                </span>
              )}
            </div>

            {/* Descrição Produto */}
            {product.description && (
              <div className="border-l-4 border-amber-400 pl-4 py-2">
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            )}

            {/* Seletor de Quantidade */}
            <div className="flex flex-col gap-3">
              <label className="text-sm font-semibold text-gray-700">Quantidade</label>
              <QuantitySelector
                value={selectedQuantity}
                onChange={setSelectedQuantity}
                max={maxQuantity}
                disabled={!canAddToCart}
              />
            </div>

            {/* Botão Adicionar à Sacola */}
            <button
              onClick={handleAddToCart}
              disabled={!canAddToCart}
              className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg uppercase tracking-wider hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors relative overflow-hidden"
            >
              {showFeedback ? "✓ Adicionado à Sacola!" : "Adicionar à Sacola"}
            </button>

            {/* Frete e Prazo - Expansível */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedFrete(!expandedFrete)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900">Frete e Prazo de Entrega</span>
                <svg
                  className={`w-5 h-5 text-gray-600 transition-transform ${expandedFrete ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>

              {expandedFrete && (
                <div className="border-t border-gray-200 p-4 bg-gray-50 flex flex-col gap-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="00000-000"
                      value={cepInput}
                      onChange={(e) => setCepInput(e.target.value.replace(/\D/g, "").slice(0, 8))}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      aria-label="CEP"
                    />
                    <button
                      onClick={handleCepCheck}
                      className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                    >
                      OK
                    </button>
                  </div>
                  <Link href="#" className="text-blue-600 text-sm font-medium hover:underline">
                    NÃO SEI MEU CEP
                  </Link>
                  <p className="text-gray-600 text-sm">Prazo estimado: 5-7 dias úteis</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
