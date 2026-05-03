import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso - Conde Semijoias",
  description:
    "Regras de uso da loja Conde Semijoias, incluindo pedidos, pagamentos e responsabilidades.",
};

export default function TermosDeUsoPage() {
  return (
    <div className="min-h-screen bg-white px-4 py-12">
      <article className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-light text-black">Termos de Uso</h1>

        <div className="mt-8 space-y-8 text-gray-700">
          <section>
            <h2 className="text-xl font-medium text-black">
              1. Aceitacao dos termos
            </h2>
            <p className="mt-2 leading-relaxed">
              Ao navegar e comprar em nossa loja, voce declara estar ciente e de
              acordo com estes Termos de Uso.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-black">2. Uso da loja</h2>
            <p className="mt-2 leading-relaxed">
              O uso da loja deve ocorrer para fins licitos, sendo vedada a
              realizacao de pedidos fraudulentos ou qualquer pratica que
              comprometa a seguranca da plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-black">
              3. Produtos e precos
            </h2>
            <p className="mt-2 leading-relaxed">
              Produtos, disponibilidade e precos podem ser alterados sem aviso
              previo, respeitando-se os pedidos ja confirmados.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-black">
              4. Pedidos e pagamentos
            </h2>
            <p className="mt-2 leading-relaxed">
              O pedido somente e considerado confirmado apos a aprovacao do
              pagamento pelo meio escolhido.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-black">
              5. Propriedade intelectual
            </h2>
            <p className="mt-2 leading-relaxed">
              Conteudos da loja, como textos, imagens, marcas e identidade
              visual, sao protegidos por direitos de propriedade intelectual.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-black">
              6. Limitacao de responsabilidade
            </h2>
            <p className="mt-2 leading-relaxed">
              Nao nos responsabilizamos por indisponibilidades temporarias de
              terceiros, erros causados por uso indevido da plataforma ou
              eventos de forca maior.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-black">7. Contato</h2>
            <p className="mt-2 leading-relaxed">
              Para suporte e duvidas: condesemijoias.site@gmail.com.
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
