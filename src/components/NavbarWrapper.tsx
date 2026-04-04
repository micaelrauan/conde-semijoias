"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import AuthNavbar from "./AuthNavbar";

export default function NavbarWrapper() {
  const pathname = usePathname();

  // Rotas que usam a navbar simplificada
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
    return <AuthNavbar />;
  }

  return <Navbar />;
}
