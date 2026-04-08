import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politica de Privacidade - Conde Semijoias",
  description:
    "Entenda como a Conde Semijoias coleta, usa e protege seus dados pessoais em conformidade com a LGPD.",
};

export default function PoliticaDePrivacidadePage() {
  return (
    <div className="min-h-screen bg-white px-4 py-12">
      <article className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-light text-black">
          Politica de Privacidade
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Ultima atualizacao: 07/04/2026
        </p>

        <div className="mt-8 space-y-8 text-gray-700">
          <section>
            <h2 className="text-xl font-medium text-black">
              1. Quais dados coletamos
            </h2>
            <p className="mt-2 leading-relaxed">
              Coletamos nome, e-mail, endereco e dados de navegacao para
              viabilizar a compra e melhorar sua experiencia. Pagamentos sao
              processados pela Nuvemshop e meios de pagamento integrados, e nao
              sao armazenados por nos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-black">
              2. Como usamos seus dados
            </h2>
            <p className="mt-2 leading-relaxed">
              Usamos seus dados para processar pedidos, enviar e-mails de
              confirmacao, calcular frete e melhorar a experiencia da loja. Nao
              vendemos dados pessoais para terceiros.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-black">
              3. Compartilhamento
            </h2>
            <p className="mt-2 leading-relaxed">
              Compartilhamos dados apenas com Nuvemshop (e-commerce),
              transportadoras (entrega) e Clerk (autenticacao), sempre conforme
              a LGPD e com parceiros que adotam medidas de seguranca.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-black">
              4. Seus direitos (LGPD)
            </h2>
            <p className="mt-2 leading-relaxed">
              Voce pode solicitar acesso, correcao, exclusao e portabilidade dos
              dados, alem de revogar consentimentos. Para exercer seus direitos,
              fale com: contato@condesemijoias.com.br.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-black">5. Cookies</h2>
            <p className="mt-2 leading-relaxed">
              Utilizamos cookies de sessao, carrinho e analise de trafego. Voce
              pode desativar cookies nas configuracoes do navegador, sabendo que
              algumas funcoes da loja podem ser afetadas.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-black">6. Contato</h2>
            <p className="mt-2 leading-relaxed">
              Em caso de duvidas sobre privacidade e protecao de dados, entre em
              contato: contato@condesemijoias.com.br.
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
