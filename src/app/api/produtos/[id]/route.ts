import { NextResponse } from "next/server";
import { NuvemshopApiError, getProduto } from "@/lib/nuvemshop";

/**
 * Proxies a single Nuvemshop product by id.
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
): Promise<Response> {
  try {
    const { id } = await context.params;
    const numericId = Number(id);

    if (!Number.isFinite(numericId) || numericId <= 0) {
      return NextResponse.json(
        { error: "Invalid product id." },
        { status: 400 },
      );
    }

    const product = await getProduto(numericId);
    return NextResponse.json(product, {
      status: 200,
      headers: {
        "Cache-Control": "s-maxage=120, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    if (error instanceof NuvemshopApiError && error.status === 404) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 },
      );
    }

    const message =
      error instanceof Error ? error.message : "Failed to fetch product.";

    if (error instanceof NuvemshopApiError) {
      return NextResponse.json({ error: message }, { status: error.status });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
