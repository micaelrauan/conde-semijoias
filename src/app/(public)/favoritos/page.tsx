import { redirect } from "next/navigation";

export default function FavoritosPage() {
  redirect("/conta?tab=favoritos");
}
