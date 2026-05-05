import type { Metadata } from "next";
import ProdutoDetalheClient from "./ProdutoDetalheClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const res = await fetch(
      `https://api.nuvemshop.com.br/2025-03/${process.env.NUVEMSHOP_STORE_ID}/products/${resolvedParams.id}`,
      {
        headers: {
          Authentication: `bearer ${process.env.NUVEMSHOP_TOKEN}`,
          "User-Agent": "CondeJoias (contato@condesemijoias.com.br)",
        },
        next: { revalidate: 120 },
      },
    );

    if (!res.ok) {
      return { title: "Produto - Conde Semijoias" };
    }

    const p = await res.json();
    const name = p.name?.pt ?? p.name ?? "Produto";
    const description = (p.description?.pt ?? "")
      .replace(/<[^>]+>/g, "")
      .slice(0, 160);
    const image = p.images?.[0]?.src ?? "";

    return {
      title: `${name} - Conde Semijoias`,
      description,
      openGraph: {
        title: name,
        description,
        images: image
          ? [{ url: image, width: 800, height: 800, alt: name }]
          : [],
        type: "website",
      },
    };
  } catch {
    return { title: "Produto - Conde Semijoias" };
  }
}

export default function ProdutoDetalhePage() {
  return <ProdutoDetalheClient />;
}
