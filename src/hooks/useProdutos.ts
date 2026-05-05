"use client";

import { useEffect, useState } from "react";
import type {
  NuvemshopCategory,
  NuvemshopProduct,
} from "../../types/nuvemshop";

interface ProdutosResponse {
  products: NuvemshopProduct[];
  total: number;
}

interface UseProdutosResult {
  produtos: NuvemshopProduct[];
  isLoading: boolean;
  error: string | null;
}

interface UseCategoriasResult {
  categorias: NuvemshopCategory[];
  isLoading: boolean;
  error: string | null;
}

const produtosCache = new Map<
  string,
  { timestamp: number; data: NuvemshopProduct[] }
>();
let categoriasCache: { timestamp: number; data: NuvemshopCategory[] } | null =
  null;
const PRODUTOS_CACHE_TTL_MS = 5 * 60 * 1000;
const CATEGORIAS_CACHE_TTL_MS = 30 * 60 * 1000;

/**
 * Fetches products from the local proxy route with optional category filtering.
 */
export function useProdutos(categoryId?: number): UseProdutosResult {
  const [produtos, setProdutos] = useState<NuvemshopProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadProdutos() {
      try {
        setIsLoading(true);
        setError(null);

        const cacheKey = typeof categoryId === "number" ? `${categoryId}` : "all";
        const cached = produtosCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < PRODUTOS_CACHE_TTL_MS) {
          if (mounted) {
            setProdutos(cached.data);
            setIsLoading(false);
          }
          return;
        }

        const url = new URL("/api/produtos", window.location.origin);
        url.searchParams.set("page", "1");
        url.searchParams.set("per_page", "12");

        if (typeof categoryId === "number") {
          url.searchParams.set("category_id", String(categoryId));
        }

        const response = await fetch(url.toString());

        if (!response.ok) {
          const payload = (await response.json()) as { error?: string };
          throw new Error(payload.error || "Failed to load products.");
        }

        const data = (await response.json()) as ProdutosResponse;

        if (mounted) {
          produtosCache.set(cacheKey, {
            timestamp: Date.now(),
            data: data.products,
          });
          setProdutos(data.products);
        }
      } catch (err) {
        if (mounted) {
          const message =
            err instanceof Error ? err.message : "Failed to load products.";
          setError(message);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    void loadProdutos();

    return () => {
      mounted = false;
    };
  }, [categoryId]);

  return { produtos, isLoading, error };
}

/**
 * Fetches categories from the local proxy route.
 */
export function useCategorias(): UseCategoriasResult {
  const [categorias, setCategorias] = useState<NuvemshopCategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadCategorias() {
      try {
        setIsLoading(true);
        setError(null);

        if (
          categoriasCache &&
          Date.now() - categoriasCache.timestamp < CATEGORIAS_CACHE_TTL_MS
        ) {
          if (mounted) {
            setCategorias(categoriasCache.data);
            setIsLoading(false);
          }
          return;
        }

        const response = await fetch("/api/categorias");

        if (!response.ok) {
          const payload = (await response.json()) as { error?: string };
          throw new Error(payload.error || "Failed to load categories.");
        }

        const data = (await response.json()) as NuvemshopCategory[];

        if (mounted) {
          categoriasCache = {
            timestamp: Date.now(),
            data,
          };
          setCategorias(data);
        }
      } catch (err) {
        if (mounted) {
          const message =
            err instanceof Error ? err.message : "Failed to load categories.";
          setError(message);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    void loadCategorias();

    return () => {
      mounted = false;
    };
  }, []);

  return { categorias, isLoading, error };
}
