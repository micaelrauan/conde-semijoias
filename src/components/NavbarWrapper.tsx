"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import AuthNavbar from "./AuthNavbar";

export default function NavbarWrapper() {
  const pathname = usePathname();

  // Rotas que usam a navbar simplificada
  const authRoutes = ["/conta"];
  const isAuthPage = authRoutes.includes(pathname);

  if (isAuthPage) {
    return <AuthNavbar />;
  }

  return <Navbar />;
}
