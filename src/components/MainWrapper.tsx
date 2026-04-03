"use client";

import { usePathname } from "next/navigation";

export default function MainWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Rotas que usam a navbar simplificada (sem padding extra)
  const authRoutes = ["/conta"];
  const isAuthPage = authRoutes.includes(pathname);

  if (isAuthPage) {
    return <>{children}</>;
  }

  // Páginas normais têm top bar (40px) + navbar (80px) = 120px
  return <main className="pt-30">{children}</main>;
}
