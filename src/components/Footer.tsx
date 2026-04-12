import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1a1a1a] text-white pt-16 pb-8 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Logo e Descrição */}
          <div className="flex flex-col items-start gap-6">
            <div className="relative w-48 h-24 sm:w-56 sm:h-28 md:w-60 md:h-32 lg:w-72 lg:h-40 shrink-0">
              <Image
                src="/logo/conde-semijoias.png"
                alt="Conde Semijoias"
                fill
                className="object-contain"
                loading="lazy"
                quality={95}
                sizes="(max-width: 640px) 192px, (max-width: 768px) 224px, (max-width: 1024px) 240px, 288px"
              />
            </div>
            <p className="text-gray-400 font-light text-sm leading-relaxed max-w-xs">
              Semijoias de qualidade, design exclusivo e entrega rápida para
              você brilhar sempre.
            </p>
          </div>

          {/* Links Úteis */}
          <div>
            <h3 className="text-lg font-light mb-6 tracking-wide border-b border-gray-700 pb-3">
              Links Úteis
            </h3>
            <ul className="space-y-3 text-gray-400">
              <li>
                <Link
                  href="/produtos"
                  prefetch
                  className="hover:text-white transition-colors font-light text-sm"
                >
                  Produtos
                </Link>
              </li>
              <li>
                <Link
                  href="/sobre"
                  className="hover:text-white transition-colors font-light text-sm"
                >
                  Nossa Historia
                </Link>
              </li>
              <li>
                <Link
                  href="/contato"
                  className="hover:text-white transition-colors font-light text-sm"
                >
                  Contato
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-white transition-colors font-light text-sm"
                >
                  Perguntas Frequentes
                </Link>
              </li>
              <li>
                <Link
                  href="/devolucoes"
                  className="hover:text-white transition-colors font-light text-sm"
                >
                  Política de Devoluções
                </Link>
              </li>
              <li>
                <Link
                  href="/garantia"
                  className="hover:text-white transition-colors font-light text-sm"
                >
                  Garantia
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-lg font-light mb-6 tracking-wide border-b border-gray-700 pb-3">
              Contato
            </h3>
            <ul className="space-y-4 text-gray-400">
              <li className="font-light text-sm">
                <a
                  href="mailto: condesemijoias.site@gmail.com"
                  className="hover:text-white transition-colors flex items-start gap-2"
                >
                  <svg
                    className="w-4 h-4 mt-0.5 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  condesemijoias.site@gmail.com
                </a>
              </li>
              <li className="font-light text-sm">
                <a
                  href="https://wa.me/5585998395280"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-start gap-2"
                >
                  <svg
                    className="w-4 h-4 mt-0.5 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-9.746 9.798c0 2.734.75 5.404 2.177 7.707l-2.313 6.179 6.38-2.289c2.26 1.214 4.8 1.86 7.502 1.86 9.696 0 17.578-7.886 17.578-17.59 0-4.701-1.925-9.109-5.423-12.231-3.497-3.122-8.15-4.84-13.055-4.84" />
                  </svg>
                  +55 (85) 9 9839-5280
                </a>
              </li>
              <li className="font-light text-sm">
                <div className="flex items-start gap-2">
                  <svg
                    className="w-4 h-4 mt-0.5 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>
                    Rua são josé, 3312 / 3316 - Setor roxo centro fashion -
                    Fortaleza, CE
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="border-t border-gray-700 pt-8 mb-8">
          <div className="flex justify-center items-center gap-3 mb-8">
            <a
              href="https://instagram.com/condesemijoias"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
              aria-label="Instagram"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.322a1.44 1.44 0 110-2.881 1.44 1.44 0 010 2.881z" />
              </svg>
              <span className="text-sm font-light">@condesemijoias</span>
            </a>
          </div>
        </div>

        {/* Bottom Links e Copyright */}
        <div className="border-t border-gray-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4 mb-6">
            <div className="space-x-6 text-sm font-light text-gray-400">
              <Link
                href="/politica-de-privacidade"
                className="hover:text-white transition-colors"
              >
                Politica de Privacidade
              </Link>
              <Link
                href="/termos-de-uso"
                className="hover:text-white transition-colors"
              >
                Termos de Uso
              </Link>
              <Link
                href="/trocas-e-devolucoes"
                className="hover:text-white transition-colors"
              >
                Trocas e Devolucoes
              </Link>
              <Link
                href="/sobre"
                className="hover:text-white transition-colors"
              >
                Nossa Historia
              </Link>
              <Link
                href="/contato"
                className="hover:text-white transition-colors"
              >
                Contato
              </Link>
            </div>
            <div className="text-sm font-light text-gray-400">
              <p>
                © {currentYear}{" "}
                <span className="text-white">Conde Semijoias</span>. Todos os
                direitos reservados.
              </p>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-3 font-light">
              Formas de Pagamento
            </p>
            <div className="flex justify-center items-center gap-4 flex-wrap">
              <span className="text-gray-400 text-xs">Cartão</span>
              <span className="text-gray-400 text-xs">Parcelado</span>
              <span className="text-gray-400 text-xs">Pix</span>
              <span className="text-gray-400 text-xs">Transferência</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
