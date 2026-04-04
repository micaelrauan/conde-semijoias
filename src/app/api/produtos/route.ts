import { NextResponse } from "next/server";
import { NuvemshopApiError, getProdutos } from "@/lib/nuvemshop";

/**
 * Proxies Nuvemshop products with optional pagination and category filtering.
 */
export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const pageRaw = url.searchParams.get("page");
    const perPageRaw = url.searchParams.get("per_page");
    const categoryIdRaw = url.searchParams.get("category_id");

    const page = pageRaw ? Number(pageRaw) : undefined;
    const per_page = perPageRaw ? Number(perPageRaw) : undefined;
    const category_id = categoryIdRaw ? Number(categoryIdRaw) : undefined;

    const invalidNumber = [page, per_page, category_id].some(
      (value) =>
        typeof value === "number" && (!Number.isFinite(value) || value <= 0),
    );

    if (invalidNumber) {
      return NextResponse.json(
        { error: "Invalid query params. Use positive numeric values." },
        { status: 400 },
      );
    }

    const { products, total } = await getProdutos({
      page,
      per_page,
      category_id,
    });

    return NextResponse.json(
      { products, total },
      {
        status: 200,
        headers: {
          "Cache-Control": "s-maxage=60, stale-while-revalidate=30",
        },
      },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch products.";

    if (error instanceof NuvemshopApiError) {
      return NextResponse.json({ error: message }, { status: error.status });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
