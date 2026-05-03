import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Nossa Historia - Conde Semijoias",
  description:
    "Conheca a historia da Conde Semijoias e nossa paixao por elegancia, leveza e estilo.",
};

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Hero Banner */}
      <div className="relative h-[40vh] min-h-[300px] w-full bg-gray-100 flex items-center justify-center">
        <Image
          src="/hero/slide2.png"
          alt="Conde Semijoias Nossa Historia"
          fill
          className="object-cover object-[center_30%]"
          priority
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-light text-white tracking-wider mb-4 drop-shadow-md">
            Nossa História
          </h1>
          <p className="text-lg font-light text-white/90 max-w-2xl mx-auto drop-shadow-sm">
            Elegância e identidade em cada detalhe.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Texto Principal */}
          <div className="space-y-6 text-gray-700 leading-relaxed font-light text-lg">
            <h2 className="text-3xl font-light text-black mb-8 tracking-wide">
              A Essência da Conde
            </h2>
            <p>
              A Conde Semijoias nasceu da paixão por acessórios que expressam
              elegância e identidade brasileira. Cada coleção foi pensada para
              mulheres modernas que valorizam beleza, autenticidade e presença em
              cada detalhe da sua rotina.
            </p>
            <p>
              Nosso compromisso é com a qualidade premium. Trabalhamos com 
              banho de ouro 18k e uma curadoria minuciosa de peças selecionadas 
              para combinar com o seu dia a dia, ocasiões especiais e
              momentos inesquecíveis.
            </p>
            <p>
              Mais do que semijoias, entregamos estilo com leveza, cuidado e
              sofisticação para você se sentir única, poderosa e confiante todos os dias.
            </p>
          </div>

          {/* Imagem Secundária */}
          <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/hero/slide3.png"
              alt="Qualidade Conde Semijoias"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Citação */}
        <div className="mt-24 mb-24">
          <blockquote className="relative rounded-2xl bg-[#670006] px-8 py-12 md:py-16 text-center shadow-xl overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
            <div className="relative z-10">
              <span className="block text-4xl md:text-6xl text-white/20 font-serif mb-4 leading-none">"</span>
              <p className="text-2xl md:text-4xl font-light text-white tracking-wide italic">
                O luxo está na essência. Leveza e Estilo.
              </p>
            </div>
          </blockquote>
        </div>

        {/* Nossos Valores */}
        <div className="text-center mt-20">
          <h2 className="text-3xl font-light text-black mb-12 tracking-wide">
            Nossos Valores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-2xl hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#670006]/10 rounded-full flex items-center justify-center mx-auto mb-6 text-[#670006]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-black mb-3">Qualidade Premium</h3>
              <p className="text-gray-600 font-light text-sm">
                Acabamento impecável e banho de ouro 18k para garantir durabilidade e brilho intenso.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-2xl hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#670006]/10 rounded-full flex items-center justify-center mx-auto mb-6 text-[#670006]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-black mb-3">Autenticidade</h3>
              <p className="text-gray-600 font-light text-sm">
                Design pensado para valorizar a sua identidade única em todas as ocasiões.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#670006]/10 rounded-full flex items-center justify-center mx-auto mb-6 text-[#670006]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-black mb-3">Atemporalidade</h3>
              <p className="text-gray-600 font-light text-sm">
                Peças clássicas e versáteis que nunca saem de moda e compõem qualquer look.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
