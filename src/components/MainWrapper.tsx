"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

const Footer = dynamic(() => import("./Footer"), {
  loading: () => null,
});

export default function MainWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Rotas que usam a navbar simplificada (sem padding extra)
  const authRoutePrefixes = ["/conta", "/minha-conta", "/meus-pedidos"];
  const normalizedPath =
    pathname.endsWith("/") && pathname !== "/"
      ? pathname.slice(0, -1)
      : pathname;
  const isAuthPage = authRoutePrefixes.some(
    (route) =>
      normalizedPath === route || normalizedPath.startsWith(`${route}/`),
  );

  if (isAuthPage) {
    return <>{children}</>;
  }

  // Páginas normais têm top bar (40px) + navbar (80px) = 120px
  return (
    <>
      <main className="pt-30">{children}</main>
      <Footer />
    </>
  );
}
