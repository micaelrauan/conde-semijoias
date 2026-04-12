import { auth, clerkClient } from "@clerk/nextjs/server";
import { parseWhatsapp } from "@/lib/whatsapp";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json({ error: "Nao autenticado." }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const rawWhatsapp =
      typeof body?.whatsapp === "string" ? body.whatsapp.trim() : "";

    const parsed = parseWhatsapp(rawWhatsapp);
    if (!parsed.ok || !parsed.normalized) {
      return Response.json(
        { error: parsed.error ?? "WhatsApp invalido." },
        { status: 400 },
      );
    }

    const client = await clerkClient();

    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        whatsapp: parsed.normalized,
      },
    });

    return Response.json({ whatsapp: parsed.normalized }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro inesperado.";
    return Response.json({ error: message }, { status: 500 });
  }
}
