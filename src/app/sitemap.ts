import type { MetadataRoute } from "next";

const CANONICAL_BASE = "https://condesemijoias.com.br";

function resolveBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return CANONICAL_BASE;

  return raw.replace(/\/$/, "");
}

const BASE = resolveBaseUrl();

type NuvemshopProduct = {
  id: string | number;
  updated_at?: string;
};

async function getProducts(): Promise<
  Array<{ id: string | number; updatedAt?: string }>
> {
  try {
    const res = await fetch(
      `https://api.nuvemshop.com.br/2025-03/${process.env.NUVEMSHOP_STORE_ID}/products?per_page=200&fields=id,updated_at`,
      {
        headers: {
          Authentication: `bearer ${process.env.NUVEMSHOP_TOKEN}`,
          "User-Agent": "CondeJoias (contato@condesemijoias.com.br)",
        },
        next: { revalidate: 300 },
      },
    );

    if (!res.ok) {
      return [];
    }

    const data = (await res.json()) as NuvemshopProduct[];
    return data.map((p) => ({ id: p.id, updatedAt: p.updated_at }));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();

  const statics: MetadataRoute.Sitemap = [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE}/produtos`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE}/ofertas`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${BASE}/lancamentos`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${BASE}/sobre`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE}/contato`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE}/politica-de-privacidade`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE}/termos-de-uso`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE}/trocas-e-devolucoes`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE}/produtos/${p.id}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...statics, ...productPages];
}
