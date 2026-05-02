"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";

const HomePageLowerContent = dynamic(
  () => import("@/components/home/HomePageLowerContent"),
  {
    ssr: false,
    loading: () => <section className="py-24" aria-hidden="true" />,
  },
);

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentSlideMobile, setCurrentSlideMobile] = useState(0);
  const [showLowerContent, setShowLowerContent] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const lowerContentAnchorRef = useRef<HTMLDivElement | null>(null);

  const heroSlides = [
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
      image: "/hero/slide3.png",
      textColor: "text-white",
    },
    {
      title: "O luxo está na essência",
      subtitle: "Leveza e Estilo",
      cta: "Comprar Agora",
      link: "/produtos?categoria=verao",
      image: "/hero/slide3.png",
      textColor: "text-white",
    },
  ];

  const heroSlidesMobile = [
    {
      title: "Clássicos Reinventados",
      subtitle: "Sofisticação Atemporal",
      cta: "Ver Detalhes",
      link: "/produtos?categoria=classicos",
      image: "/hero/mobile/slide1.jpg",
      textColor: "text-white",
    },
    {
      title: "Luxo Minimalista",
      subtitle: "A Beleza nos Detalhes",
      cta: "Explorar",
      link: "/produtos?categoria=minimalista",
      image: "/hero/mobile/slide2.jpg",
      textColor: "text-white",
    },
    {
      title: "O luxo está na essência",
      subtitle: "Leveza e Estilo",
      cta: "Comprar Agora",
      link: "/produtos?categoria=verao",
      image: "/hero/mobile/slide3.png",
      textColor: "text-white",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      setCurrentSlideMobile((prev) => (prev + 1) % heroSlidesMobile.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length, heroSlidesMobile.length]);

  useEffect(() => {
    const anchor = lowerContentAnchorRef.current;
    if (!anchor) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShowLowerContent(true);
          observer.disconnect();
        }
      },
      { rootMargin: "700px 0px" },
    );

    observer.observe(anchor);

    return () => observer.disconnect();
  }, []);

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
      {/* Hero Carousel - Desktop */}
      <section
        className="relative h-[65vh] min-h-115 max-h-195 overflow-hidden hidden md:block"
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
                  fetchPriority={index === 0 ? "high" : "auto"}
                  className={`object-cover ${
                    index === 0
                      ? "object-[0%_center] md:object-[70%_center]"
                      : index === 1
                        ? "object-[100%_center] md:object-[30%_center]"
                        : "object-[0%_center] md:object-center"
                  }`}
                  priority={index === 0}
                  loading={index === 0 ? undefined : "lazy"}
                />
              </div>

              {/* Overlay for text readability */}
              <div
                className={`absolute inset-0 hidden md:block ${
                  index === 1
                    ? "bg-linear-to-l from-black/55 via-black/25 to-transparent"
                    : slide.textColor === "text-white"
                      ? "bg-linear-to-r from-black/50 via-black/30 to-transparent"
                      : "bg-linear-to-r from-white/40 via-white/20 to-transparent"
                }`}
              ></div>

              {/* Content */}
              <div
                className={`absolute inset-0 hidden md:flex items-center justify-center ${
                  index === 1 ? "md:justify-end" : "md:justify-start"
                }`}
              >
                <div
                  className={`relative z-20 px-6 md:px-16 max-w-2xl ${slide.textColor} ${
                    index === 1 ? "md:text-right" : "md:text-left"
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
        <div className="absolute bottom-4 md:bottom-8 left-0 right-0 z-30 flex justify-center gap-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault();
                setCurrentSlide(index);
              }}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide
                  ? "w-8 md:w-12 h-3 bg-white"
                  : "w-2 md:w-3 h-2 md:h-3 bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Hero Carousel - Mobile */}
      <section
        className="relative h-[65vh] min-h-115 overflow-hidden md:hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slides Container */}
        <div className="relative h-full">
          {heroSlidesMobile.map((slide, index) => (
            <Link
              key={index}
              href={slide.link}
              className={`absolute inset-0 block transition-all duration-1000 ease-in-out ${
                index === currentSlideMobile
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
                  fetchPriority={index === 0 ? "high" : "auto"}
                  className="object-cover object-center"
                  priority={index === 0}
                  loading={index === 0 ? undefined : "lazy"}
                  quality={100}
                />
              </div>

              {/* Overlay for text readability */}
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/30 to-transparent"></div>

              {/* Content */}
              <div className="absolute inset-0 flex items-end justify-center">
                <div className="relative z-20 px-4 pb-8 text-center w-full">
                  <h1 className="text-3xl font-light mb-2 tracking-tight animate-fade-in drop-shadow-lg text-white">
                    {slide.title}
                  </h1>
                  <p
                    className="text-lg font-light mb-4 tracking-wide animate-fade-in drop-shadow-lg text-white"
                    style={{ animationDelay: "200ms" }}
                  >
                    {slide.subtitle}
                  </p>
                  <span
                    className="inline-block px-8 py-3 text-xs font-medium tracking-widest uppercase transition-all duration-300 animate-fade-in drop-shadow-lg bg-white text-black hover:bg-gray-100"
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
        <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center gap-2">
          {heroSlidesMobile.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault();
                setCurrentSlideMobile(index);
              }}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlideMobile
                  ? "w-6 h-2 bg-white"
                  : "w-2 h-2 bg-white/50 hover:bg-white/75"
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
            href="/produtos?categoria=ofertas"
            className="group relative h-125 bg-gray-100 overflow-hidden"
          >
            <Image
              src="/assets/home/outlet-mobile.jpg"
              alt="Ofertas"
              fill
              className="object-cover"
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={100}
            />
            <div className="absolute inset-0 bg-linear-to-t from-gray-900/70 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h2 className="text-4xl font-light mb-2">Ofertas</h2>
              <p className="text-lg font-light mb-4">Seleção de produtos com promoções imperdíveis</p>
              <span className="inline-block border-b-2 border-white pb-1 text-sm font-medium tracking-widest uppercase group-hover:tracking-wider transition-all">
                Ver Tudo
              </span>
            </div>
          </Link>

          <Link
            href="/produtos?categoria=novidades"
            className="group relative h-125 bg-gray-100 overflow-hidden"
          >
            <Image
              src="/assets/home/novidades.jpg"
              alt="Novidades"
              fill
              className="object-cover"
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-gray-900/70 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h2 className="text-4xl font-light mb-2">Novidades</h2>
              <p className="text-lg font-light mb-4">Recém Chegados</p>
              <span className="inline-block border-b-2 border-white pb-1 text-sm font-medium tracking-widest uppercase group-hover:tracking-wider transition-all">
                Comprar Agora
              </span>
            </div>
          </Link>
        </div>
      </section>

      <div ref={lowerContentAnchorRef} className="h-px" aria-hidden="true" />
      {showLowerContent ? (
        <HomePageLowerContent />
      ) : (
        <section className="py-24" aria-hidden="true" />
      )}
    </div>
  );
}
