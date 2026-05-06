import type { Metadata } from "next";
import FaqClient from "./FaqClient";

export const metadata: Metadata = {
  title: "Duvidas Frequentes - Conde Semijoias",
  description:
    "Encontre respostas rapidas sobre compras, pagamento, entrega e cuidados com semijoias.",
};

export default function FaqPage() {
  return <FaqClient />;
}
