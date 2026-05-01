"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

const POPUP_CONFIG = {
  enabled: true,
  storageKey: "conde_store_opening_popup",
  showDelayMs: 900,
  showAgainAfterDays: 2,
  topLabel: "Conde Semijoias",
  headline: "Inauguracao da loja online",
  subheadline: "Uma nova forma de viver a experiencia Conde",
  message:
    "Nossa loja online foi aberta para levar as colecoes da Conde Semijoias ate voce, com novidades selecionadas, compra facilitada e atendimento personalizado.",
  highlights: ["Novidades exclusivas", "Compra segura", "Atendimento no WhatsApp"],
  ctaText: "Conhecer a loja",
  ctaHref: "/lancamentos",
  closeText: "Agora nao",
  footerImageSrc: "/assets/home/novidades.png",
  footerImageAlt: "Novidades da Conde Semijoias",
  accentColorClass: "bg-[#670006]",
  ctaColorClass: "bg-black hover:bg-[#670006]",
};

const HIDDEN_PREFIXES = ["/admin", "/sign-in", "/sign-up", "/acesso-negado"];

export default function StoreOpeningPopup() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  const shouldHideByRoute = useMemo(() => {
    if (!pathname) return false;
    return HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  }, [pathname]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !POPUP_CONFIG.enabled || shouldHideByRoute) {
      return;
    }

    const now = Date.now();
    const saved = window.localStorage.getItem(POPUP_CONFIG.storageKey);
    const nextAllowedAt = saved ? Number(saved) : 0;

    if (Number.isFinite(nextAllowedAt) && now < nextAllowedAt) {
      return;
    }

    const timer = window.setTimeout(() => {
      setOpen(true);
    }, POPUP_CONFIG.showDelayMs);

    return () => window.clearTimeout(timer);
  }, [mounted, shouldHideByRoute]);

  useEffect(() => {
    if (!open) return;

    const onEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open]);

  const handleClose = () => {
    const msUntilNextOpen = POPUP_CONFIG.showAgainAfterDays * 24 * 60 * 60 * 1000;
    const nextAllowedAt = Date.now() + msUntilNextOpen;
    window.localStorage.setItem(POPUP_CONFIG.storageKey, String(nextAllowedAt));
    setOpen(false);
  };

  if (!mounted || !open || shouldHideByRoute) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-80 flex items-center justify-center bg-black/55 p-3 sm:p-4 animate-fadeIn"
      onClick={handleClose}
      aria-hidden="true"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label="Aviso de inauguracao"
        className="relative w-full max-w-[calc(100vw-1.5rem)] sm:max-w-md max-h-[calc(100dvh-1.5rem)] overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className={`h-2 w-full ${POPUP_CONFIG.accentColorClass}`} />

        <button
          type="button"
          aria-label="Fechar popup"
          onClick={handleClose}
          className="absolute right-3 top-3 text-xl leading-none text-gray-500 transition hover:text-black sm:right-4 sm:top-4 sm:text-2xl"
        >
          x
        </button>

        <div className="px-5 pt-7 text-center [font-family:var(--font-poppins)] sm:px-7 sm:pt-8">
          <p className="text-[10px] font-light tracking-[0.22em] uppercase text-gray-500 sm:text-xs sm:tracking-[0.25em]">{POPUP_CONFIG.topLabel}</p>

          <h2 className="mt-3 text-2xl font-light tracking-tight text-black sm:mt-4 sm:text-3xl">{POPUP_CONFIG.headline}</h2>

          <p className="mt-2 text-[11px] font-light uppercase tracking-[0.16em] text-[#670006] sm:text-sm sm:tracking-[0.2em]">{POPUP_CONFIG.subheadline}</p>

          <p className="mx-auto mt-3 max-w-sm text-[13px] font-light leading-relaxed text-gray-700 sm:mt-4 sm:text-sm">{POPUP_CONFIG.message}</p>

          <div className="mt-4 flex flex-wrap justify-center gap-2 sm:mt-5">
            {POPUP_CONFIG.highlights.map((item) => (
              <span
                key={item}
                className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[10px] font-light tracking-wide text-gray-700 sm:px-3 sm:text-xs"
              >
                {item}
              </span>
            ))}
          </div>

          <Link
            href={POPUP_CONFIG.ctaHref}
            className={`mt-5 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-xs font-medium uppercase tracking-[0.16em] text-white transition sm:mt-6 sm:text-sm sm:tracking-[0.2em] ${POPUP_CONFIG.ctaColorClass}`}
            onClick={handleClose}
          >
            {POPUP_CONFIG.ctaText}
          </Link>

          <button
            type="button"
            onClick={handleClose}
            className="mt-3 text-xs font-light text-gray-500 transition hover:text-black sm:mt-4 sm:text-sm"
          >
            {POPUP_CONFIG.closeText}
          </button>
        </div>

        <div className="relative mt-5 h-28 w-full border-t border-gray-200 bg-gray-50 sm:mt-6 sm:h-44">
          <Image
            src={POPUP_CONFIG.footerImageSrc}
            alt={POPUP_CONFIG.footerImageAlt}
            fill
            sizes="(max-width: 640px) 96vw, 420px"
            className="object-cover object-center"
            priority
          />
        </div>
      </section>
    </div>
  );
}
