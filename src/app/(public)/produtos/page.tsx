"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { getCategories, getProducts } from "@/lib/api/products";
import type { Product } from "@/lib/types";

interface Category {
  id: string;
  name: string;
}

type ViewMode = "grid" | "list";

export default function ProdutosPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showFilters, setShowFilters] = useState(false);
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    const q = (searchParams.get("q") || "").trim();
    setSearchQuery(q);

    const cat = searchParams.get("categoria");
    setSelectedCategory(cat || "all");
  }, [searchParams]);

  useEffect(() => {
    loadData();
  }, [selectedCategory]);

  const loadCategories = async () => {
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const params =
        selectedCategory !== "all"
          ? { category_id: Number(selectedCategory) }
          : undefined;

      const productsData = await getProducts(params);
      setProducts(productsData);
      setFilteredProducts(productsData);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar e ordenar produtos
  useEffect(() => {
    let filtered = [...products];

    // Filtro de preço
    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1],
    );

    // Filtro de busca
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.description &&
            p.description.toLowerCase().includes(searchQuery.toLowerCase())),
      );
    }

    // Ordenação
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, priceRange, searchQuery, sortBy]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatProductMeta = (product: Product) => {
    const pieces: string[] = [];

    if (typeof product.weight === "number") {
      pieces.push(`Peso: ${product.weight}g`);
    }

    if (
      typeof product.width === "number" &&
      typeof product.height === "number" &&
      typeof product.depth === "number"
    ) {
      pieces.push(
        `Dimensões: ${product.width}x${product.height}x${product.depth} cm`,
      );
    }

    return pieces.join(" • ");
  };

  const handleAddToCart = async (product: Product) => {
    try {
      addItem(product, product.variant_id ?? Number(product.id));
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error);
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setPriceRange([0, 10000]);
    setSortBy("name");
  };

  const filtersContent = (
    <>
      {/* Busca */}
      <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
        <h3 className="text-sm font-medium text-black mb-3 uppercase tracking-wider">
          Buscar
        </h3>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar produtos..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black font-light text-sm transition-all"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Categorias */}
      <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
        <h3 className="text-sm font-medium text-black mb-4 uppercase tracking-wider">
          Categorias
        </h3>
        <div className="space-y-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
              selectedCategory === "all"
                ? "bg-black text-white"
                : "text-gray-700 hover:bg-gray-100"
            } font-light text-sm`}
          >
            Todas as categorias
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                selectedCategory === cat.id
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-gray-100"
              } font-light text-sm`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Filtro de Preço */}
      <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
        <h3 className="text-sm font-medium text-black mb-4 uppercase tracking-wider">
          Faixa de Preço
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 font-light">
              {formatCurrency(priceRange[0])}
            </span>
            <span className="text-gray-600 font-light">
              {formatCurrency(priceRange[1])}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="10000"
            step="50"
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([priceRange[0], Number(e.target.value)])
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
          />
        </div>
      </div>

      {/* Ordenação */}
      <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
        <h3 className="text-sm font-medium text-black mb-4 uppercase tracking-wider">
          Ordenar Por
        </h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black font-light text-sm transition-all"
        >
          <option value="name">Nome (A-Z)</option>
          <option value="price-asc">Menor Preço</option>
          <option value="price-desc">Maior Preço</option>
        </select>
      </div>

      {/* Limpar Filtros */}
      <button
        onClick={resetFilters}
        className="w-full py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-light text-sm"
      >
        Limpar Filtros
      </button>
    </>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm mb-8">
          <Link
            href="/"
            prefetch
            className="text-gray-500 hover:text-black transition-colors font-light"
          >
            Início
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-black font-light">Produtos</span>
        </nav>

        {/* Header com Filtros Toggle */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b border-gray-200">
          <div className="mb-4 md:mb-0">
            <h1 className="text-4xl font-light tracking-tight text-black mb-2">
              Produtos
            </h1>
            <p className="text-gray-600 font-light">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "produto" : "produtos"}{" "}
              disponíveis
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "grid"
                    ? "bg-white shadow-sm text-black"
                    : "text-gray-400 hover:text-gray-600"
                }`}
                title="Visualização em grade"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "list"
                    ? "bg-white shadow-sm text-black"
                    : "text-gray-400 hover:text-gray-600"
                }`}
                title="Visualização em lista"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>

            {/* Filtros Toggle (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
              Filtros
            </button>
          </div>
        </div>

        {/* Drawer de filtros (Mobile) */}
        {showFilters && (
          <div className="lg:hidden fixed inset-0 z-50">
            <button
              type="button"
              aria-label="Fechar filtros"
              className="absolute inset-0 bg-black/40"
              onClick={() => setShowFilters(false)}
            />

            <div className="absolute right-0 top-0 h-full w-[88%] max-w-sm bg-white shadow-2xl overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                <h2 className="text-base font-medium text-black">Filtros</h2>
                <button
                  type="button"
                  className="p-2 rounded-md hover:bg-gray-100"
                  onClick={() => setShowFilters(false)}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="p-4 space-y-5">{filtersContent}</div>

              <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
                <button
                  type="button"
                  onClick={() => setShowFilters(false)}
                  className="w-full py-3 bg-black text-white rounded-lg font-light"
                >
                  Ver {filteredProducts.length} produtos
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar de Filtros */}
          <aside className="hidden lg:block lg:w-64 space-y-6">
            {filtersContent}
          </aside>

          {/* Grid/Lista de Produtos */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex justify-center items-center h-96">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
                  <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin absolute top-0"></div>
                </div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-xl">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                  <svg
                    className="w-10 h-10 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-light text-gray-900 mb-2">
                  Nenhum produto encontrado
                </h3>
                <p className="text-gray-600 font-light mb-8 max-w-md mx-auto">
                  Não encontramos produtos que correspondam aos seus critérios.
                  Tente ajustar os filtros.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                    setPriceRange([0, 10000]);
                  }}
                  className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-light hover:bg-gray-800 transition-all duration-300 hover:scale-105"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Limpar Filtros
                </button>
              </div>
            ) : (
              <div
                className={`${
                  viewMode === "grid"
                    ? "grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6"
                    : "space-y-4"
                }`}
              >
                {filteredProducts.map((product, index) =>
                  viewMode === "grid" ? (
                    /* Grid View */
                    <div
                      key={product.id}
                      className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-500 flex flex-col h-full"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <Link href={`/produtos/${product.id}`} className="block">
                        <div className="relative aspect-square bg-gray-50 overflow-hidden">
                          {product.image_url ? (
                            <Image
                              src={product.image_url}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg
                                className="w-24 h-24 text-gray-200"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                          )}
                          {product.stock !== undefined &&
                            product.stock < 10 &&
                            product.stock > 0 && (
                              <span className="absolute top-3 right-3 bg-amber-500 text-white text-xs px-3 py-1 rounded-full font-light shadow-lg">
                                Últimas unidades
                              </span>
                            )}
                          {product.stock !== undefined &&
                            product.stock === 0 && (
                              <span className="absolute top-3 right-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-light shadow-lg">
                                Esgotado
                              </span>
                            )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              toggleFavorite(product);
                            }}
                            className="absolute top-3 left-3 bg-white/90 hover:bg-white rounded-full p-2 shadow transition-all"
                            aria-label={
                              isFavorite(product.id)
                                ? "Remover dos favoritos"
                                : "Adicionar aos favoritos"
                            }
                          >
                            <svg
                              className={`w-5 h-5 ${
                                isFavorite(product.id)
                                  ? "fill-red-500 text-red-500"
                                  : "text-gray-500"
                              }`}
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                          </button>
                          <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                      </Link>

                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex-1">
                          {product.category?.name && (
                            <span className="inline-block text-xs text-gray-500 font-light uppercase tracking-wider mb-2">
                              {product.category.name}
                            </span>
                          )}
                          <Link href={`/produtos/${product.id}`}>
                            <h3 className="text-sm sm:text-lg font-bold text-black mb-2 group-hover:text-gray-600 transition-colors line-clamp-2 min-h-10 sm:min-h-14">
                              {product.name}
                            </h3>
                          </Link>
                          {formatProductMeta(product) && (
                            <p className="text-[11px] sm:text-xs text-gray-500 font-light mb-4 line-clamp-1">
                              {formatProductMeta(product)}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div>
                            {product.compare_at_price &&
                            product.compare_at_price > product.price ? (
                              <>
                                <p className="text-xs sm:text-sm text-gray-500 line-through">
                                  {formatCurrency(product.compare_at_price)}
                                </p>
                                <span className="text-lg sm:text-2xl font-bold text-black leading-none">
                                  {formatCurrency(product.price)}
                                </span>
                              </>
                            ) : (
                              <span className="text-lg sm:text-2xl font-bold text-black leading-none">
                                {formatCurrency(product.price)}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => handleAddToCart(product)}
                            disabled={product.stock === 0}
                            className="group/btn bg-black text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium hover:bg-gray-800 transition-all duration-300 hover:scale-105 active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
                          >
                            <span>
                              {product.stock === 0 ? "Esgotado" : "Adicionar"}
                            </span>
                            {product.stock !== 0 && (
                              <svg
                                className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:-translate-y-px transition-transform"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 8h12l-1 12H7L6 8zM9 8V6a3 3 0 016 0v2"
                                />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* List View */
                    <div
                      key={product.id}
                      className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-300 flex flex-col sm:flex-row"
                    >
                      <Link
                        href={`/produtos/${product.id}`}
                        className="sm:w-64 shrink-0"
                      >
                        <div className="relative aspect-square sm:h-full bg-gray-50 overflow-hidden">
                          {product.image_url ? (
                            <Image
                              src={product.image_url}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg
                                className="w-20 h-20 text-gray-200"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                          )}
                          {product.stock !== undefined &&
                            product.stock < 10 &&
                            product.stock > 0 && (
                              <span className="absolute top-3 right-3 bg-amber-500 text-white text-xs px-3 py-1 rounded-full font-light shadow-lg">
                                Últimas unidades
                              </span>
                            )}
                          {product.stock !== undefined &&
                            product.stock === 0 && (
                              <span className="absolute top-3 right-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-light shadow-lg">
                                Esgotado
                              </span>
                            )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              toggleFavorite(product);
                            }}
                            className="absolute top-3 left-3 bg-white/90 hover:bg-white rounded-full p-2 shadow transition-all"
                            aria-label={
                              isFavorite(product.id)
                                ? "Remover dos favoritos"
                                : "Adicionar aos favoritos"
                            }
                          >
                            <svg
                              className={`w-5 h-5 ${
                                isFavorite(product.id)
                                  ? "fill-red-500 text-red-500"
                                  : "text-gray-500"
                              }`}
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                          </button>
                        </div>
                      </Link>

                      <div className="flex-1 p-6 flex flex-col justify-between">
                        <div>
                          {product.category?.name && (
                            <span className="inline-block text-xs text-gray-500 font-light uppercase tracking-wider mb-2">
                              {product.category.name}
                            </span>
                          )}
                          <Link href={`/produtos/${product.id}`}>
                            <h3 className="text-xl font-bold text-black mb-2 group-hover:text-gray-600 transition-colors">
                              {product.name}
                            </h3>
                          </Link>
                          {formatProductMeta(product) && (
                            <p className="text-xs text-gray-500 font-light mb-4 line-clamp-1">
                              {formatProductMeta(product)}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div>
                            {product.compare_at_price &&
                            product.compare_at_price > product.price ? (
                              <>
                                <p className="text-sm text-gray-500 line-through">
                                  {formatCurrency(product.compare_at_price)}
                                </p>
                                <span className="text-3xl font-bold text-black leading-none">
                                  {formatCurrency(product.price)}
                                </span>
                              </>
                            ) : (
                              <span className="text-3xl font-bold text-black leading-none">
                                {formatCurrency(product.price)}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => handleAddToCart(product)}
                            disabled={product.stock === 0}
                            className="group/btn bg-black text-white px-7 py-3.5 rounded-lg text-base font-medium hover:bg-gray-800 transition-all duration-300 hover:scale-105 active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
                          >
                            <span>
                              {product.stock === 0
                                ? "Esgotado"
                                : "Adicionar ao Carrinho"}
                            </span>
                            {product.stock !== 0 && (
                              <svg
                                className="w-5 h-5 group-hover/btn:-translate-y-px transition-transform"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 8h12l-1 12H7L6 8zM9 8V6a3 3 0 016 0v2"
                                />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
