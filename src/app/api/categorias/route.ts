import { NextResponse } from "next/server";
import { NuvemshopApiError, getCategorias } from "@/lib/nuvemshop";

/**
 * Proxies Nuvemshop categories list.
 */
export async function GET(): Promise<Response> {
  try {
    const categories = await getCategorias();

    return NextResponse.json(categories, {
      status: 200,
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch categories.";

    if (error instanceof NuvemshopApiError) {
      return NextResponse.json({ error: message }, { status: error.status });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
