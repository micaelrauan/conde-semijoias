import type {
  NuvemshopCategory,
  NuvemshopProduct,
} from "../../../types/nuvemshop";
import { getMainImage } from "../nuvemshop";
import type { Category, Product } from "../types";

interface GetProductsParams {
  page?: number;
  per_page?: number;
  category_id?: number;
}

interface ProductsApiResponse {
  products: NuvemshopProduct[];
  total: number;
}

let productsCache: Product[] | null = null;
let categoriesCache: Category[] | null = null;
let productsCacheAt = 0;
let categoriesCacheAt = 0;

const CACHE_TTL_MS = 60_000;

function getApiUrl(path: string, params?: Record<string, string>): string {
  const url = new URL(path, window.location.origin);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  return url.toString();
}

function stripHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, "") // Remove tags HTML
    .replace(/&nbsp;/g, " ") // Substitui entidades
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ") // Remove espaços múltiplos
    .trim();
}

function normalizeBrokenEncoding(value: string): string {
  // Corrige textos UTF-8 interpretados como latin1 (ex: "AÃ§o" -> "Aço").
  if (!value || !/[ÃÂâ]/.test(value)) {
    return value;
  }

  try {
    const bytes = Uint8Array.from(
      value.split("").map((char) => char.charCodeAt(0) & 0xff),
    );
    return new TextDecoder("utf-8", { fatal: false }).decode(bytes);
  } catch {
    return value;
  }
}

function normalizeDescription(rawDescription: string): string {
  return normalizeBrokenEncoding(stripHtml(rawDescription));
}

function toOptionalNumber(
  value: string | number | null | undefined,
): number | undefined {
  if (value === null || value === undefined || value === "") {
    return undefined;
  }

  const parsed =
    typeof value === "number"
      ? value
      : Number(String(value).replace(",", "."));

  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function mapCategory(category: NuvemshopCategory): Category {
  return {
    id: String(category.id),
    name: category.name.pt,
    description: undefined,
    slug: category.handle.pt,
    image_url: undefined,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

function mapProduct(product: NuvemshopProduct): Product {
  const firstVariant = product.variants[0];
  const firstCategory = product.categories[0];
  const category = firstCategory
    ? {
        id: String(firstCategory.id),
        name: firstCategory.name.pt,
        description: undefined,
        slug: String(firstCategory.id),
        image_url: undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    : undefined;

  // Converte preços para números, removendo strings vazias
  const rawPrice = Number(firstVariant?.price || 0);
  const compareAtPriceRaw = firstVariant?.compare_at_price;
  const compareAtPriceNum =
    compareAtPriceRaw && compareAtPriceRaw.trim()
      ? Number(compareAtPriceRaw)
      : null;
  const promotionalPriceRaw = firstVariant?.promotional_price;
  const promotionalPriceNum =
    typeof promotionalPriceRaw === "string" && promotionalPriceRaw.trim()
      ? Number(promotionalPriceRaw)
      : null;

  const basePrice = Number.isFinite(rawPrice) ? rawPrice : 0;
  const promotionalPrice =
    promotionalPriceNum && Number.isFinite(promotionalPriceNum)
      ? promotionalPriceNum
      : undefined;

  const hasPromotionalPrice =
    typeof promotionalPrice === "number" &&
    promotionalPrice > 0 &&
    promotionalPrice < basePrice;

  const price = hasPromotionalPrice ? promotionalPrice : basePrice;

  let compareAtPrice =
    compareAtPriceNum && Number.isFinite(compareAtPriceNum)
      ? compareAtPriceNum
      : undefined;

  if (hasPromotionalPrice) {
    compareAtPrice =
      typeof compareAtPrice === "number" && compareAtPrice > price
        ? compareAtPrice
        : basePrice;
  } else if (typeof compareAtPrice === "number" && compareAtPrice <= price) {
    compareAtPrice = undefined;
  }

  const weight = toOptionalNumber(firstVariant?.weight);
  const width = toOptionalNumber(firstVariant?.width);
  const height = toOptionalNumber(firstVariant?.height);
  const depth = toOptionalNumber(firstVariant?.depth);

  return {
    id: String(product.id),
    name: product.name.pt,
    description: normalizeDescription(product.description.pt),
    price,
    compare_at_price: compareAtPrice,
    weight,
    width,
    height,
    depth,
    stock: firstVariant?.stock ?? 0,
    variant_id: firstVariant?.id,
    category_id: firstCategory ? String(firstCategory.id) : undefined,
    image_url: getMainImage(product),
    images: product.images.map((img) => ({
      src: img.src,
      alt: img.alt || product.name.pt,
    })),
    slug: product.handle.pt,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category,
  };
}

async function fetchProductsFromApi(
  params?: GetProductsParams,
): Promise<Product[]> {
  const query: Record<string, string> = {
    page: String(params?.page ?? 1),
    per_page: String(params?.per_page ?? 100),
  };

  if (typeof params?.category_id === "number") {
    query.category_id = String(params.category_id);
  }

  const response = await fetch(getApiUrl("/api/produtos", query), {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Erro ao carregar produtos");
  }

  const data = (await response.json()) as ProductsApiResponse;
  return data.products.map(mapProduct);
}

async function fetchCategoriesFromApi(): Promise<Category[]> {
  const response = await fetch(getApiUrl("/api/categorias"), {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Erro ao carregar categorias");
  }

  const data = (await response.json()) as NuvemshopCategory[];
  return data.map(mapCategory).sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Replaces the local products cache.
 */
export function replaceProductsCache(nextProducts: Product[]): void {
  productsCache = nextProducts;
}

/**
 * Replaces the local categories cache.
 */
export function replaceCategoriesCache(nextCategories: Category[]): void {
  categoriesCache = nextCategories;
}

/**
 * Fetches all products or products filtered by query params.
 */
export async function getProducts(params?: GetProductsParams) {
  if (!params && productsCache && Date.now() - productsCacheAt < CACHE_TTL_MS) {
    return productsCache;
  }

  const products = await fetchProductsFromApi(params);

  if (!params) {
    productsCache = products;
    productsCacheAt = Date.now();
  }

  return products;
}

/**
 * Fetches a single product by slug.
 */
export async function getProductBySlug(slug: string) {
  const products = await getProducts();
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    throw new Error("Produto nao encontrado");
  }

  return product;
}

/**
 * Fetches a single product by id.
 */
export async function getProductById(id: string | number) {
  const numericId = Number(id);

  if (!Number.isFinite(numericId) || numericId <= 0) {
    throw new Error("ID de produto invalido");
  }

  const response = await fetch(getApiUrl(`/api/produtos/${numericId}`));

  if (!response.ok) {
    throw new Error("Produto nao encontrado");
  }

  const data = (await response.json()) as NuvemshopProduct;
  return mapProduct(data);
}

/**
 * Fetches products by category slug.
 */
export async function getProductsByCategory(categorySlug: string) {
  const categories = await getCategories();
  const category = categories.find((item) => item.slug === categorySlug);

  if (!category) {
    return [];
  }

  const products = await getProducts();
  return products.filter((product) => product.category_id === category.id);
}

/**
 * Searches products by name or description.
 */
export async function searchProducts(query: string) {
  const normalized = query.trim().toLowerCase();
  const products = await getProducts();

  return products.filter((product) => {
    return (
      product.name.toLowerCase().includes(normalized) ||
      (product.description || "").toLowerCase().includes(normalized)
    );
  });
}

/**
 * Fetches all categories.
 */
export async function getCategories() {
  if (
    categoriesCache &&
    Date.now() - categoriesCacheAt < CACHE_TTL_MS
  ) {
    return categoriesCache;
  }

  const categories = await fetchCategoriesFromApi();
  categoriesCache = categories;
  categoriesCacheAt = Date.now();
  return categories;
}

/**
 * Fetches a category by slug.
 */
export async function getCategoryBySlug(slug: string) {
  const categories = await getCategories();
  const category = categories.find((item) => item.slug === slug);

  if (!category) {
    throw new Error("Categoria nao encontrada");
  }

  return category;
}
