"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const COOKIE_CONSENT_KEY = "conde_cookie_consent_accepted";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    if (consent !== "true") {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, "true");
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="text-sm text-gray-700">
          Usamos cookies para melhorar sua experiencia no site. Ao continuar,
          voce concorda com nossa politica de cookies.
          <Link
            href="/cookie-policy"
            className="ml-1 font-medium text-black underline underline-offset-2"
          >
            Saiba mais
          </Link>
          .
        </p>

        <button
          type="button"
          onClick={handleAccept}
          className="inline-flex min-h-10 items-center justify-center rounded-md bg-black px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          Aceitar cookies
        </button>
      </div>
    </div>
  );
}
