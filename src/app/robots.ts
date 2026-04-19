import type { MetadataRoute } from "next";

const CANONICAL_BASE = "https://condesemijoias.com.br";

function resolveBaseUrl(): string {
  if (process.env.VERCEL_ENV === "production") return CANONICAL_BASE;

  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return CANONICAL_BASE;

  try {
    const parsed = new URL(raw);

    if (parsed.hostname.endsWith("vercel.app")) {
      return CANONICAL_BASE;
    }

    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return CANONICAL_BASE;
  }
}

export default function robots(): MetadataRoute.Robots {
  const base = resolveBaseUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/sign-in",
          "/sign-up",
          "/meus-pedidos",
          "/pedido/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/api/",
          "/sign-in",
          "/sign-up",
          "/meus-pedidos",
          "/pedido/",
        ],
      },
    ],
    host: base,
    sitemap: `${base}/sitemap.xml`,
  };
}
