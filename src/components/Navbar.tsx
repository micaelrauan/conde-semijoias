"use client";

import { useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useCart } from "@/contexts/CartContext";

const UserMenu = dynamic(() => import("@/components/header/UserMenu"), {
  ssr: false,
  loading: () => <div className="w-44 h-11" />,
});

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [currentPromo, setCurrentPromo] = useState(0);
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount } = useCart();
  const closeMobileMenu = () => setIsMenuOpen(false);

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const term = String(formData.get("q") || "").trim();
    closeMobileMenu();
    router.push(term ? `/produtos?q=${encodeURIComponent(term)}` : "/produtos");
  };

  const promos = [
    "Parcele em ate 3x sem juros no cartao de credito",
    "Garantia de 6 meses em peças selecionadas!",
    "Semijoias com qualidade e design exclusivo",
  ];

  // Rotacao automatica das promocoes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromo((prev) => (prev + 1) % promos.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let ticking = false;

    const controlNavbar = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(controlNavbar);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [lastScrollY]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Top Bar - Carousel de Promocoes */}
      <div
        className={`bg-[#670006] text-white py-2 fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        } [font-family:var(--font-poppins)] font-light`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative h-5 md:h-6 overflow-hidden flex-1 max-w-md text-xs md:text-sm">
                {promos.map((promo, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 flex items-center font-light transition-all duration-300 ease-in-out ${
                      index === currentPromo
                        ? "opacity-100 translate-x-0"
                        : index < currentPromo
                          ? "opacity-0 -translate-x-full"
                          : "opacity-0 translate-x-full"
                    }`}
                  >
                    {promo}
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden md:flex items-center gap-6 text-sm font-light">
              <Link
                href="/contato"
                className="text-white/80 hover:text-white transition-colors"
              >
                Contato
              </Link>
              <Link
                href="/faq"
                className="text-white/80 hover:text-white transition-colors"
              >
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navbar Principal */}
      <nav
        className={`bg-white shadow-md fixed left-0 right-0 z-40 transition-all duration-300 ease-out ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        } [font-family:var(--font-poppins)] font-light top-9 md:top-10`}
      >
        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 gap-8">
            {/* Logo */}
            <Link href="/" prefetch className="shrink-0">
              <h1 className="text-2xl font-light tracking-wider text-black">
                CONDE SEMIJOIAS
              </h1>
            </Link>

            {/* Categorias - Centro */}
            <div className="hidden lg:flex items-center gap-6 flex-1 justify-center">
              <Link
                href="/produtos"
                prefetch
                className="text-gray-600 hover:text-black font-light transition-colors whitespace-nowrap"
              >
                Produtos
              </Link>

              <Link
                href="/ofertas"
                className="text-gray-600 hover:text-black font-light transition-colors whitespace-nowrap"
              >
                Ofertas
              </Link>
              <Link
                href="/lancamentos"
                className="text-gray-600 hover:text-black font-light transition-colors whitespace-nowrap"
              >
                Lançamentos
              </Link>
            </div>

            {/* Search Bar + Icons - Desktop */}
            <div className="hidden md:flex items-center gap-6">
              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="relative w-64">
                {/* Ícone de busca */}
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>

                <input
                  name="q"
                  type="text"
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-black text-gray-900 placeholder:text-gray-400 font-light transition-all"
                />

                {/* Botão limpar */}
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Limpar busca"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </form>

              {/* Icons */}
              <div className="flex items-center gap-5">
                {/* Wishlist */}
                <Link
                  href="/favoritos"
                  className="relative text-gray-600 hover:text-black transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </Link>

                <UserMenu />

                {/* Shopping Cart */}
                <Link
                  href="/carrinho"
                  className="relative text-gray-600 hover:text-black transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 4 0 014 0z"
                    />
                  </svg>
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-light">
                      {itemCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 max-h-[calc(100vh-120px)] overflow-y-auto overscroll-contain">
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearchSubmit} className="relative">
                {/* Ícone de busca */}
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>

                <input
                  name="q"
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-black text-gray-900 placeholder:text-gray-400 font-light transition-all"
                />

                {/* Botão limpar */}
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Limpar busca"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </form>

              {/* Mobile Navigation Links */}
              <div className="flex flex-col space-y-2">
                <Link
                  href="/"
                  prefetch
                  onClick={closeMobileMenu}
                  className="py-2 text-gray-600 hover:text-black font-light"
                >
                  Início
                </Link>
                <Link
                  href="/produtos"
                  prefetch
                  onClick={closeMobileMenu}
                  className="py-2 text-gray-600 hover:text-black font-light"
                >
                  Produtos
                </Link>

                <Link
                  href="/ofertas"
                  onClick={closeMobileMenu}
                  className="py-2 text-gray-600 hover:text-black font-light"
                >
                  Ofertas
                </Link>
                <Link
                  href="/lancamentos"
                  onClick={closeMobileMenu}
                  className="py-2 text-gray-600 hover:text-black font-light"
                >
                  Lançamentos
                </Link>
                <Link
                  href="/sobre"
                  onClick={closeMobileMenu}
                  className="py-2 text-gray-600 hover:text-black font-light"
                >
                  Sobre Nós
                </Link>
              </div>

              {/* Mobile Icons */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200">
                <UserMenu iconOnly />

                <Link
                  href="/favoritos"
                  onClick={closeMobileMenu}
                  className="flex min-h-11 flex-col items-center justify-center rounded-xl text-gray-600 transition-colors hover:bg-gray-50 hover:text-black"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <span className="text-xs mt-1 font-light">Favoritos</span>
                </Link>
                <Link
                  href="/carrinho"
                  onClick={closeMobileMenu}
                  className="flex min-h-11 flex-col items-center justify-center relative rounded-xl text-gray-600 transition-colors hover:bg-gray-50 hover:text-black"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 4 0 014 0z"
                    />
                  </svg>
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-light">
                      {itemCount}
                    </span>
                  )}
                  <span className="text-xs mt-1 font-light">Carrinho</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mini Search Bar Fixa - Aparece quando navbar principal desaparece */}
      <div
        className={`fixed top-0 left-0 right-0 z-40 bg-white shadow-lg transition-transform duration-500 ease-in-out ${
          !isVisible ? "translate-y-0" : "-translate-y-full"
        } [font-family:var(--font-poppins)] font-light`}
      >
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center gap-8">
            {/* Logo compacta */}
            <Link href="/" prefetch className="shrink-0">
              <h1 className="text-lg font-light tracking-wider text-black whitespace-nowrap">
                CONDE SEMIJOIAS
              </h1>
            </Link>

            {/* Categorias - Centro */}
            <div className="hidden lg:flex items-center gap-5 flex-1 justify-center">
              <Link
                href="/produtos"
                prefetch
                className="text-gray-600 hover:text-black font-light transition-colors whitespace-nowrap text-sm"
              >
                Produtos
              </Link>

              <Link
                href="/ofertas"
                className="text-gray-600 hover:text-black font-light transition-colors whitespace-nowrap text-sm"
              >
                Ofertas
              </Link>
              <Link
                href="/lancamentos"
                className="text-gray-600 hover:text-black font-light transition-colors whitespace-nowrap text-sm"
              >
                Lançamentos
              </Link>
            </div>

            {/* Search Bar + Icons - Direita */}
            <div className="hidden md:flex items-center gap-4">
              {/* Search Bar Compacta */}
              <form onSubmit={handleSearchSubmit} className="relative w-56">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>

                <input
                  name="q"
                  type="text"
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-black text-gray-900 placeholder:text-gray-400 text-sm font-light transition-all"
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Limpar busca"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </form>

              {/* Ícones Compactos */}
              <div className="flex items-center gap-4">
                <Link
                  href="/favoritos"
                  className="text-gray-600 hover:text-black transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </Link>

                <UserMenu compact />

                <Link
                  href="/carrinho"
                  className="relative text-gray-600 hover:text-black transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 4 0 014 0z"
                    />
                  </svg>
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-light">
                      {itemCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
