import type {
  NuvemshopCategory,
  NuvemshopProduct,
} from "../../types/nuvemshop";

const API_VERSION = "2025-03";

interface GetProdutosParams {
  page?: number;
  per_page?: number;
  category_id?: number;
}

interface GetProdutosResponse {
  products: NuvemshopProduct[];
  total: number;
}

interface NuvemshopOrderImage {
  src?: string | null;
}

interface NuvemshopOrderProduct {
  name?: string;
  quantity?: number;
  price?: string;
  image?: NuvemshopOrderImage | null;
}

export interface NuvemshopOrder {
  id: number;
  token?: string;
  status?: string;
  contact_email?: string;
  contact_name?: string;
  total?: string;
  subtotal?: string;
  created_at?: string;
  products?: NuvemshopOrderProduct[];
  shipping_address?:
    | string
    | {
        address?: string;
        address1?: string;
        number?: string | number | null;
        street_number?: string | number | null;
        locality?: string;
        city?: string;
        province?: string;
        state?: string;
        zipcode?: string;
        zip?: string;
        country?: string;
      };
  shipping_number?: string | number | null;
  shipping_city?: string;
  shipping_province?: string;
  shipping_zipcode?: string;
  shipping_country?: string;
}

class NuvemshopApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "NuvemshopApiError";
    this.status = status;
  }
}

function getBaseUrl(): string {
  const token = process.env.NUVEMSHOP_TOKEN;
  const storeId = process.env.NUVEMSHOP_STORE_ID;

  if (!token || !storeId) {
    throw new Error(
      "Missing Nuvemshop env vars. Set NUVEMSHOP_TOKEN and NUVEMSHOP_STORE_ID in .env.local.",
    );
  }

  return `https://api.nuvemshop.com.br/${API_VERSION}/${storeId}`;
}

function getHeaders(): HeadersInit {
  const token = process.env.NUVEMSHOP_TOKEN;

  if (!token) {
    throw new Error(
      "Missing NUVEMSHOP_TOKEN. Set NUVEMSHOP_TOKEN in .env.local.",
    );
  }

  return {
    Authentication: `bearer ${token}`,
    "User-Agent": "MinhaLoja (contato@minhaloja.com.br)",
    "Content-Type": "application/json",
  };
}

async function requestNuvemshop<T>(
  path: string,
  query?: Record<string, string>,
): Promise<{ data: T; total: number | null }> {
  const baseUrl = getBaseUrl();
  const url = new URL(`${baseUrl}${path}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  const revalidate = path.startsWith("/categories")
    ? 300
    : path.startsWith("/products/")
      ? 120
      : path.startsWith("/products")
        ? 60
        : 60;

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: getHeaders(),
    next: { revalidate },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new NuvemshopApiError(
      `Nuvemshop request failed (${response.status}) for ${path}: ${body || response.statusText}`,
      response.status,
    );
  }

  const totalHeader = response.headers.get("x-total-count");
  const total = totalHeader ? Number(totalHeader) : null;
  const data = (await response.json()) as T;

  return { data, total: Number.isNaN(total) ? null : total };
}

/**
 * Fetches a paginated products list from Nuvemshop.
 */
export async function getProdutos(
  params?: GetProdutosParams,
): Promise<GetProdutosResponse> {
  const query: Record<string, string> = {};

  if (typeof params?.page === "number") {
    query.page = String(params.page);
  }

  if (typeof params?.per_page === "number") {
    query.per_page = String(params.per_page);
  }

  if (typeof params?.category_id === "number") {
    query.category_id = String(params.category_id);
  }

  const { data, total } = await requestNuvemshop<NuvemshopProduct[]>(
    "/products",
    query,
  );

  return {
    products: data,
    total: total ?? data.length,
  };
}

/**
 * Fetches a single product by id from Nuvemshop.
 */
export async function getProduto(id: number): Promise<NuvemshopProduct> {
  const { data } = await requestNuvemshop<NuvemshopProduct>(`/products/${id}`);
  return data;
}

/**
 * Fetches categories from Nuvemshop.
 */
export async function getCategorias(): Promise<NuvemshopCategory[]> {
  const { data } = await requestNuvemshop<NuvemshopCategory[]>("/categories");
  return data;
}

/**
 * Fetches orders filtered by contact email from Nuvemshop.
 */
export async function getPedidosByEmail(
  email: string,
): Promise<NuvemshopOrder[]> {
  const query: Record<string, string> = {
    contact_email: email,
    per_page: "50",
    page: "1",
  };

  const { data } = await requestNuvemshop<NuvemshopOrder[]>("/orders", query);

  return data;
}

/**
 * Formats a decimal string price to BRL currency format.
 */
export function formatPrice(price: string): string {
  const value = Number(price);

  if (Number.isNaN(value)) {
    return "R$ 0,00";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

/**
 * Builds a local product route using product handle.
 */
export function getProductUrl(handle: string): string {
  return `/produto/${handle}`;
}

/**
 * Gets the first product image URL or a placeholder fallback.
 */
export function getMainImage(product: NuvemshopProduct): string {
  return product.images[0]?.src || "/placeholder.jpg";
}

export { NuvemshopApiError };
