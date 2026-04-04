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
  const price = Number(firstVariant?.price || 0);
  const compareAtPriceRaw = firstVariant?.compare_at_price;
  const compareAtPriceNum =
    compareAtPriceRaw && compareAtPriceRaw.trim()
      ? Number(compareAtPriceRaw)
      : null;

  return {
    id: String(product.id),
    name: product.name.pt,
    description: stripHtml(product.description.pt),
    price,
    compare_at_price: compareAtPriceNum ?? undefined,
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

  const response = await fetch(getApiUrl("/api/produtos", query));
  if (!response.ok) {
    throw new Error("Erro ao carregar produtos");
  }

  const data = (await response.json()) as ProductsApiResponse;
  return data.products.map(mapProduct);
}

async function fetchCategoriesFromApi(): Promise<Category[]> {
  const response = await fetch(getApiUrl("/api/categorias"));
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
  if (!params && productsCache) {
    return productsCache;
  }

  const products = await fetchProductsFromApi(params);

  if (!params) {
    productsCache = products;
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
  if (categoriesCache) {
    return categoriesCache;
  }

  const categories = await fetchCategoriesFromApi();
  categoriesCache = categories;
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
