import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trocas e Devolucoes - Conde Semijoias",
  description:
    "Politica de trocas, devolucoes e reembolsos da Conde Semijoias conforme o CDC.",
};

export default function TrocasEDevolucoesPage() {
  return (
    <div className="min-h-screen bg-white px-4 py-12">
      <article className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-light text-black">Trocas e Devolucoes</h1>

        <div className="mt-8 space-y-8 text-gray-700">
          <section>
            <h2 className="text-xl font-medium text-black">1. Prazo</h2>
            <p className="mt-2 leading-relaxed">
              Voce tem ate 7 dias corridos para arrependimento (CDC Art. 49) e
              30 dias para defeitos aparentes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-black">
              2. Como solicitar
            </h2>
            <p className="mt-2 leading-relaxed">
              Envie e-mail para contato@condesemijoias.com.br com numero do
              pedido e fotos do produto.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-black">3. Condicoes</h2>
            <p className="mt-2 leading-relaxed">
              O produto deve estar sem uso, em embalagem original e com todos os
              itens enviados.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-black">4. Frete</h2>
            <p className="mt-2 leading-relaxed">
              O frete e por nossa conta em caso de defeito. Em arrependimento, o
              frete de retorno e por conta do cliente. A primeira troca e
              gratuita.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-black">5. Reembolso</h2>
            <p className="mt-2 leading-relaxed">
              Reembolsos sao processados em ate 10 dias uteis apos analise, no
              mesmo meio de pagamento usado na compra.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-black">6. Defeitos</h2>
            <p className="mt-2 leading-relaxed">
              Produtos com defeito confirmado podem ser trocados ou reembolsados
              integralmente, sem custo adicional.
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
