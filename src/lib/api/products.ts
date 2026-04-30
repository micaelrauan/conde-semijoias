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

  const normalizedBreaks = html
    .replace(/<\s*br\s*\/?\s*>/gi, "\n")
    .replace(/<\s*\/p\s*>/gi, "\n")
    .replace(/<\s*p[^>]*>/gi, "");

  const decoded = decodeHtmlEntities(normalizedBreaks);

  return decoded
    .replace(/<[^>]*>/g, "") // Remove tags HTML
    .replace(/&nbsp;/gi, " ")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ") // Remove espaços múltiplos
    .trim();
}

function decodeHtmlEntities(value: string): string {
  if (typeof window === "undefined") {
    return value;
  }

  const textarea = document.createElement("textarea");
  textarea.innerHTML = value;
  return textarea.value;
}

function countMojibakeMarkers(value: string): number {
  const matches = value.match(/Ã.|Â.|â€|â€™|â€œ|â€\u009d|â€“|â€”|â€¦/g);
  return matches ? matches.length : 0;
}

function normalizeBrokenEncoding(value: string): string {
  // Corrige textos UTF-8 interpretados como latin1 (ex: "AÃ§o" -> "Aço").
  const hasLikelyMojibake = /Ã.|Â.|â€|â€™|â€œ|â€\u009d|â€“|â€”|â€¦/.test(value);

  if (!value || !hasLikelyMojibake) {
    return value;
  }

  try {
    const bytes = Uint8Array.from(
      value.split("").map((char) => char.charCodeAt(0) & 0xff),
    );
    const decoded = new TextDecoder("utf-8", { fatal: false }).decode(bytes);

    // Mantém o texto original quando a tentativa de correção piora o resultado.
    return countMojibakeMarkers(decoded) <= countMojibakeMarkers(value)
      ? decoded
      : value;
  } catch {
    return value;
  }
}

function normalizeDescription(rawDescription: string): string {
  return normalizeBrokenEncoding(stripHtml(rawDescription));
}

function readLocalizedValue(
  value: string | { pt?: string; es?: string; en?: string } | undefined,
): string | undefined {
  if (!value) {
    return undefined;
  }

  if (typeof value === "string") {
    return value.trim() || undefined;
  }

  return value.pt || value.es || value.en || undefined;
}

function getVariantLabel(variant: NuvemshopProduct["variants"][number]): string {
  const possibleGroups = [variant.values, variant.option_values, variant.attributes];

  for (const group of possibleGroups) {
    if (!Array.isArray(group) || group.length === 0) {
      continue;
    }

    const label = group
      .map((entry) => readLocalizedValue(entry))
      .filter((entry): entry is string => Boolean(entry && entry.trim()))
      .join(" / ");

    if (label) {
      return label;
    }
  }

  const variantName = readLocalizedValue(variant.name);
  if (variantName) {
    return variantName;
  }

  return variant.sku || `Opção ${variant.id}`;
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

  const variants = product.variants.map((variant) => {
    const variantBasePrice = Number(variant.price || 0);
    const variantPromotionalRaw = variant.promotional_price;
    const variantPromotionalPrice =
      typeof variantPromotionalRaw === "string" && variantPromotionalRaw.trim()
        ? Number(variantPromotionalRaw)
        : null;

    const variantPrice =
      variantPromotionalPrice &&
      Number.isFinite(variantPromotionalPrice) &&
      variantPromotionalPrice > 0 &&
      variantPromotionalPrice < variantBasePrice
        ? variantPromotionalPrice
        : variantBasePrice;

    const variantCompareAtRaw =
      typeof variant.compare_at_price === "string" && variant.compare_at_price.trim()
        ? Number(variant.compare_at_price)
        : null;

    const variantCompareAt =
      variantCompareAtRaw && Number.isFinite(variantCompareAtRaw) && variantCompareAtRaw > variantPrice
        ? variantCompareAtRaw
        : undefined;

    return {
      id: variant.id,
      name: getVariantLabel(variant),
      price: Number.isFinite(variantPrice) ? variantPrice : 0,
      compare_at_price: variantCompareAt,
      stock: Math.max(0, variant.stock ?? 0),
    };
  });

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
    variants,
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
