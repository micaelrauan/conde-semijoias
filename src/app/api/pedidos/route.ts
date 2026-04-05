import { auth, currentUser } from "@clerk/nextjs/server";
import { getOrdersByEmail } from "@/lib/orders-store";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Nao autorizado" }, { status: 401 });
  }

  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;

  if (!email) {
    return Response.json({ error: "Email nao encontrado" }, { status: 400 });
  }

  const orders = getOrdersByEmail(email);
  return Response.json({ orders });
}
