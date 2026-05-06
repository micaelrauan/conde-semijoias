"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type FaqItem = {
  id: string;
  category: string;
  question: string;
  answer: string;
};

const FAQS: FaqItem[] = [
  {
    id: "compras-1",
    category: "Compras",
    question: "Como faco um pedido?",
    answer:
      "Escolha a peca, selecione a variacao (se houver) e clique em Adicionar ao carrinho. Depois finalize o pedido no carrinho.",
  },
  {
    id: "compras-2",
    category: "Compras",
    question: "Preciso ter conta para comprar?",
    answer:
      "Nao. Voce pode finalizar como visitante, mas criar uma conta facilita acompanhar pedidos.",
  },
  {
    id: "compras-3",
    category: "Compras",
    question: "Posso alterar ou cancelar meu pedido?",
    answer:
      "Entre em contato o quanto antes pelo WhatsApp. Se o pedido ainda nao foi enviado, fazemos o ajuste.",
  },
  {
    id: "pagamento-1",
    category: "Pagamento",
    question: "Quais formas de pagamento aceitam?",
    answer:
      "Aceitamos cartao de credito, pix e outras opcoes exibidas no checkout.",
  },
  {
    id: "pagamento-2",
    category: "Pagamento",
    question: "Posso parcelar? Em quantas vezes?",
    answer:
      "Sim. O parcelamento aparece no checkout e pode variar conforme o valor do pedido.",
  },
  {
    id: "pagamento-3",
    category: "Pagamento",
    question: "Meu pagamento nao foi aprovado. O que fazer?",
    answer:
      "Verifique os dados do cartao ou tente outra forma de pagamento. Se persistir, fale com a gente.",
  },
  {
    id: "entrega-1",
    category: "Entrega",
    question: "Qual o prazo de entrega?",
    answer:
      "O prazo depende do seu CEP e aparece no checkout antes da confirmacao da compra.",
  },
  {
    id: "entrega-2",
    category: "Entrega",
    question: "Como acompanho meu pedido?",
    answer:
      "Voce recebera o codigo de rastreio por e-mail assim que o pedido for enviado.",
  },
  {
    id: "entrega-3",
    category: "Entrega",
    question: "Entregam para todo o Brasil?",
    answer: "Sim, enviamos para todo o Brasil.",
  },
  {
    id: "trocas-1",
    category: "Trocas",
    question: "Qual o prazo para troca/devolucao?",
    answer:
      "Voce pode solicitar troca ou devolucao em ate 7 dias corridos apos o recebimento.",
  },
  {
    id: "trocas-2",
    category: "Trocas",
    question: "Como solicitar a troca?",
    answer:
      "Fale com nosso atendimento informando o numero do pedido e o motivo da troca.",
  },
  {
    id: "trocas-3",
    category: "Trocas",
    question: "Posso trocar por outro produto?",
    answer:
      "Sim. A troca pode ser feita por outro item de valor igual ou mediante ajuste.",
  },
  {
    id: "produtos-1",
    category: "Produtos",
    question: "O que e semijoia? Qual a diferenca para bijuteria?",
    answer:
      "Semijoias recebem banho de metais nobres e tem maior durabilidade e acabamento superior.",
  },
  {
    id: "produtos-2",
    category: "Produtos",
    question: "As pecas tem garantia?",
    answer:
      "Sim, temos garantia contra defeitos de fabricacao dentro do prazo informado na compra.",
  },
  {
    id: "produtos-3",
    category: "Produtos",
    question: "As pecas escurecem? Como evitar?",
    answer:
      "Evite contato com agua, perfumes e cremes. Guarde em local seco para preservar o brilho.",
  },
  {
    id: "cuidados-1",
    category: "Cuidados",
    question: "Como limpar minhas semijoias?",
    answer:
      "Use pano macio e seco. Evite produtos abrasivos ou umidade excessiva.",
  },
  {
    id: "cuidados-2",
    category: "Cuidados",
    question: "Posso usar no banho ou praia?",
    answer:
      "Nao recomendamos. Agua e sal podem reduzir o brilho e a durabilidade da peca.",
  },
  {
    id: "cuidados-3",
    category: "Cuidados",
    question: "Como guardar corretamente?",
    answer:
      "Guarde separadamente em saquinhos ou porta-joias para evitar riscos.",
  },
  {
    id: "suporte-1",
    category: "Suporte",
    question: "Como falar com a equipe?",
    answer:
      "Chame no WhatsApp ou envie um e-mail. Estamos prontos para ajudar.",
  },
  {
    id: "suporte-2",
    category: "Suporte",
    question: "Qual o horario de atendimento?",
    answer: "Segunda a sexta, das 9h as 18h.",
  },
];

const CATEGORY_ORDER = [
  "Compras",
  "Pagamento",
  "Entrega",
  "Trocas",
  "Produtos",
  "Cuidados",
  "Suporte",
];

export default function FaqClient() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todas");
  const [openId, setOpenId] = useState<string | null>(null);

  const categories = useMemo(
    () => ["Todas", ...CATEGORY_ORDER],
    [],
  );

  const filteredFaqs = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return FAQS.filter((faq) => {
      const matchesCategory =
        activeCategory === "Todas" || faq.category === activeCategory;
      const matchesSearch =
        !normalizedSearch ||
        faq.question.toLowerCase().includes(normalizedSearch) ||
        faq.answer.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  useEffect(() => {
    if (!openId) {
      return;
    }

    if (!filteredFaqs.some((item) => item.id === openId)) {
      setOpenId(null);
    }
  }, [filteredFaqs, openId]);

  return (
    <div className="min-h-screen bg-white px-4 py-12">
      <section className="mx-auto max-w-5xl">
        <div className="rounded-2xl border border-gray-200 bg-gray-50 px-6 py-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-light text-black">
            Duvidas frequentes
          </h1>
          <p className="mt-3 text-sm sm:text-base text-gray-600">
            Respostas rapidas sobre compras, pagamento, entrega e cuidados.
          </p>
          <div className="mt-6 flex justify-center">
            <div className="w-full max-w-xl">
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Busque pela sua duvida..."
                  className="w-full rounded-full border border-gray-300 bg-white px-5 py-3 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-black"
                />
                <svg
                  className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-colors ${
                activeCategory === category
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mt-8 space-y-4">
          {filteredFaqs.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-600">
              Nenhuma pergunta encontrada. Tente outro termo ou categoria.
            </div>
          )}

          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-xl border border-gray-200 bg-white"
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4"
                  aria-expanded={isOpen}
                  aria-controls={`${faq.id}-content`}
                >
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-400">
                      {faq.category}
                    </p>
                    <h3 className="text-base sm:text-lg font-medium text-black">
                      {faq.question}
                    </h3>
                  </div>
                  <span
                    className={`h-8 w-8 shrink-0 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 transition-transform ${
                      isOpen ? "rotate-45" : "rotate-0"
                    }`}
                  >
                    +
                  </span>
                </button>
                {isOpen && (
                  <div
                    id={`${faq.id}-content`}
                    className="px-5 pb-5 text-sm sm:text-base text-gray-600"
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 rounded-2xl border border-gray-200 bg-black px-6 py-10 text-center text-white">
          <h2 className="text-2xl font-light">Nao encontrou?</h2>
          <p className="mt-2 text-sm sm:text-base text-white/80">
            Fale com a gente no WhatsApp e respondemos rapidinho.
          </p>
          <Link
            href="https://wa.me/5585998395280?text=Oi%2C%20preciso%20de%20ajuda%20com%20meu%20pedido"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-gray-100 transition-colors"
          >
            Falar no WhatsApp
          </Link>
        </div>
      </section>
    </div>
  );
}
