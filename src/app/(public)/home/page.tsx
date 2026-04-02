"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const { addItem } = useCart();

  const heroSlides = [
    {
      title: "Essência da Elegância",
      subtitle: "Coleção Exclusiva 2026",
      cta: "Descobrir Coleção",
      link: "/produtos?categoria=novidades",
      image: "/hero/slide1.png",
      textColor: "text-white",
    },
    {
      title: "Clássicos Reinventados",
      subtitle: "Sofisticação Atemporal",
      cta: "Ver Detalhes",
      link: "/produtos?categoria=classicos",
      image: "/hero/slide2.png",
      textColor: "text-white",
    },
    {
      title: "Luxo Minimalista",
      subtitle: "A Beleza nos Detalhes",
      cta: "Explorar",
      link: "/produtos?categoria=minimalista",
      image:
        "https://images.unsplash.com/photo-1496217590455-aa63a8350eea?q=80&w=1920&auto=format&fit=crop",
      textColor: "text-white",
    },
    {
      title: "O luxo está na essência",
      subtitle: "Leveza e Estilo",
      cta: "Comprar Agora",
      link: "/produtos?categoria=verao",
      image:
        "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?q=80&w=1920&auto=format&fit=crop",
      textColor: "text-white",
    },
    {
      title: "Noites Inesquecíveis",
      subtitle: "Looks para Brilhar",
      cta: "Ver Vestidos",
      link: "/produtos?categoria=festa",
      image:
        "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?q=80&w=1920&auto=format&fit=crop",
      textColor: "text-white",
    },
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data.slice(0, 8)); // Apenas 8 produtos na home
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Cadastro realizado! Você ganhou 15% OFF na primeira compra!");
    setEmail("");
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const goToPreviousSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length,
    );
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLElement>) => {
    setTouchStartX(e.changedTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLElement>) => {
    if (touchStartX === null) return;

    const distance = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) > 50) {
      if (distance < 0) {
        goToNextSlide();
      } else {
        goToPreviousSlide();
      }
    }

    setTouchStartX(null);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Carousel */}
      <section
        className="relative h-[65vh] min-h-115 max-h-195 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slides Container */}
        <div className="relative h-full">
          {heroSlides.map((slide, index) => (
            <Link
              key={index}
              href={slide.link}
              className={`absolute inset-0 block transition-all duration-1000 ease-in-out ${
                index === currentSlide
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-105 pointer-events-none"
              }`}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  sizes="100vw"
                  className="object-cover object-top"
                  priority={index === 0}
                />
              </div>

              {/* Overlay for text readability */}
              <div
                className={`absolute inset-0 ${
                  index === 0
                    ? "bg-linear-to-l from-black/55 via-black/25 to-transparent"
                    : slide.textColor === "text-white"
                      ? "bg-linear-to-r from-black/50 via-black/30 to-transparent"
                      : "bg-linear-to-r from-white/40 via-white/20 to-transparent"
                }`}
              ></div>

              {/* Content */}
              <div
                className={`absolute inset-0 flex items-center justify-center ${
                  index === 0 ? "md:justify-end" : "md:justify-start"
                }`}
              >
                <div
                  className={`relative z-20 px-6 md:px-16 max-w-2xl ${slide.textColor} ${
                    index === 0 ? "md:text-right" : "md:text-left"
                  }`}
                >
                  <h1 className="text-5xl md:text-7xl font-light mb-6 tracking-tight animate-fade-in drop-shadow-lg">
                    {slide.title}
                  </h1>
                  <p
                    className="text-xl md:text-2xl font-light mb-8 tracking-wide animate-fade-in drop-shadow-lg"
                    style={{ animationDelay: "200ms" }}
                  >
                    {slide.subtitle}
                  </p>
                  <span
                    className={`inline-block px-10 py-4 text-sm font-medium tracking-widest uppercase transition-all duration-300 animate-fade-in drop-shadow-lg ${
                      slide.textColor === "text-white"
                        ? "bg-white text-black hover:bg-gray-100"
                        : "bg-black text-white hover:bg-gray-800"
                    }`}
                    style={{ animationDelay: "400ms" }}
                  >
                    {slide.cta}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Navigation Dots */}
        <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center gap-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault();
                setCurrentSlide(index);
              }}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide
                  ? "w-12 h-3 bg-white"
                  : "w-3 h-3 bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Promotional Banners */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link
            href="/produtos?categoria=outlet"
            className="group relative h-125 bg-gray-100 overflow-hidden"
          >
            <div className="absolute inset-0 bg-linear-to-t from-gray-200 to-gray-100"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8 text-black">
              <h2 className="text-4xl font-light mb-2">Outlet</h2>
              <p className="text-lg font-light mb-4">Até 70% OFF</p>
              <span className="inline-block border-b-2 border-black pb-1 text-sm font-medium tracking-widest uppercase group-hover:tracking-wider transition-all">
                Ver Tudo
              </span>
            </div>
          </Link>

          <Link
            href="/produtos?categoria=novidades"
            className="group relative h-125 bg-gray-100 overflow-hidden"
          >
            <div className="absolute inset-0 bg-linear-to-t from-gray-200 to-gray-100"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8 text-black">
              <h2 className="text-4xl font-light mb-2">Novidades</h2>
              <p className="text-lg font-light mb-4">Recém Chegados</p>
              <span className="inline-block border-b-2 border-black pb-1 text-sm font-medium tracking-widest uppercase group-hover:tracking-wider transition-all">
                Comprar Agora
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 px-4 md:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-light mb-4 tracking-tight">
              Produtos em Destaque
            </h2>
            <p className="text-gray-600 font-light">
              Selecionamos o melhor para você
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-16 h-16 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="group bg-white"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Link href={`/produtos/${product.id}`} className="block">
                    <div className="relative aspect-3/4 bg-gray-100 overflow-hidden mb-4">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                          <span className="text-gray-400 text-5xl">📦</span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-sm font-light mb-2 text-black group-hover:text-gray-600 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-lg font-medium text-black mb-3">
                      R$ {product.price.toFixed(2)}
                    </p>
                  </Link>
                  <button
                    onClick={() => addItem(product)}
                    className="w-full py-3 bg-black text-white text-xs font-medium tracking-widest uppercase hover:bg-gray-800 transition-colors"
                  >
                    Adicionar
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/produtos"
              className="inline-block bg-black text-white px-12 py-4 text-sm font-medium tracking-widest uppercase hover:bg-gray-800 transition-all"
            >
              Ver Todos os Produtos
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 md:px-8 bg-white border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl mb-4">🚚</div>
            <h3 className="text-lg font-medium mb-2 tracking-wide">
              FRETE GRÁTIS
            </h3>
            <p className="text-sm text-gray-600 font-light">
              Para compras acima de R$ 799
            </p>
          </div>
          <div>
            <div className="text-4xl mb-4">💳</div>
            <h3 className="text-lg font-medium mb-2 tracking-wide">
              5% OFF NO PIX
            </h3>
            <p className="text-sm text-gray-600 font-light">
              Ganhe desconto pagando com PIX
            </p>
          </div>
          <div>
            <div className="text-4xl mb-4">🔄</div>
            <h3 className="text-lg font-medium mb-2 tracking-wide">
              TROCA GRÁTIS
            </h3>
            <p className="text-sm text-gray-600 font-light">
              Primeira troca por nossa conta
            </p>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-4 md:px-8 bg-gray-50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-4 tracking-tight">
            Cadastre-se e Ganhe
          </h2>
          <p className="text-xl font-medium mb-8">15% OFF na Primeira Compra</p>
          <form
            onSubmit={handleNewsletter}
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Seu melhor e-mail"
              required
              className="flex-1 px-6 py-4 border border-gray-300 text-sm focus:outline-none focus:border-black transition-colors"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-black text-white text-sm font-medium tracking-widest uppercase hover:bg-gray-800 transition-colors whitespace-nowrap"
            >
              Cadastrar
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-4 font-light">
            *Desconto não cumulativo com outras promoções
          </p>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-20 px-4 md:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-light mb-8 tracking-tight">
            Apaixone-se por Você Mesma
          </h2>
          <div className="space-y-6 text-gray-700 font-light leading-relaxed">
            <p className="text-lg">
              Uma das principais marcas de e-commerce do Brasil, somos sinônimo
              de uma moda que traduz as tendências mais atuais de forma
              criativa, moderna e com identidade brasileira.
            </p>
            <p className="text-lg">
              Apostamos em looks e acessórios que representam o estilo de vida
              de pessoas modernas e sofisticadas que refletem a essência
              vibrante do brasileiro.
            </p>
            <p className="text-lg">
              Produtos perfeitos para momentos casuais, formais ou noturnos.
              Você é sempre o protagonista.
            </p>
          </div>
          <div className="mt-12">
            <Link
              href="/sobre"
              className="inline-block border-2 border-black px-12 py-4 text-sm font-medium tracking-widest uppercase hover:bg-black hover:text-white transition-all duration-300"
            >
              Conheça Nossa História
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
