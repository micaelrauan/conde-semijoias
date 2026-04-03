import { redirect } from "next/navigation";

export default function MeusPedidosPage() {
  redirect("/conta?tab=pedidos");
}
