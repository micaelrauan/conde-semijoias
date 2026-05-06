"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import CartToast from "./CartToast";

const Footer = dynamic(() => import("./Footer"), {
  loading: () => null,
});

const CookieConsent = dynamic(() => import("./CookieConsent"), {
  loading: () => null,
});

export default function MainWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Rotas que usam a navbar simplificada (sem padding extra)
  const authRoutePrefixes = ["/conta", "/meus-pedidos"];
  const normalizedPath =
    pathname.endsWith("/") && pathname !== "/"
      ? pathname.slice(0, -1)
      : pathname;
  const isAuthPage = authRoutePrefixes.some(
    (route) =>
      normalizedPath === route || normalizedPath.startsWith(`${route}/`),
  );

  if (isAuthPage) {
    return (
      <>
        {children}
        <CartToast />
        <CookieConsent />
      </>
    );
  }

  // Páginas normais têm top bar (40px) + navbar (80px) = 120px
  return (
    <>
      <main className="pt-30">{children}</main>
      <CartToast />
      <Footer />
      <CookieConsent />
    </>
  );
}
