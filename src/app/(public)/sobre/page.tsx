import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nossa Historia - Conde Semijoias",
  description:
    "Conheca a historia da Conde Semijoias e nossa paixao por elegancia, leveza e estilo.",
};

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-white px-4 py-12">
      <article className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-light text-black">Nossa Historia</h1>

        <div className="mt-8 space-y-5 text-gray-700 leading-relaxed">
          <p>
            A Conde Semijoias nasceu da paixao por acessorios que expressam
            elegancia e identidade brasileira. Cada colecao foi pensada para
            mulheres modernas que valorizam beleza, autenticidade e presenca em
            cada detalhe.
          </p>
          <p>
            Trabalhamos com qualidade premium, banho de ouro 18k e curadoria de
            pecas selecionadas para combinar com rotina, ocasioes especiais e
            momentos inesqueciveis.
          </p>
          <p>
            Mais do que semijoias, entregamos estilo com leveza, cuidado e
            sofisticacao para voce se sentir unica todos os dias.
          </p>
        </div>

        <blockquote className="mt-10 rounded-xl border border-[#6B0000] bg-[#6B0000] px-6 py-5 text-center text-lg font-light text-white">
          "O luxo esta na essencia. Leveza e Estilo."
        </blockquote>
      </article>
    </div>
  );
}
