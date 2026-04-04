import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import NavbarWrapper from "@/components/NavbarWrapper";
import MainWrapper from "@/components/MainWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300"],
});

export const metadata: Metadata = {
  title: {
    default: "CONDE SEMIJOIAS",
    template: "%s | CONDE SEMIJOIAS",
  },
  description:
    "Loja online da CONDE SEMIJOIAS com colecoes exclusivas e pecas sofisticadas para todos os momentos.",
  openGraph: {
    title: "CONDE SEMIJOIAS",
    description:
      "Loja online da CONDE SEMIJOIAS com colecoes exclusivas e pecas sofisticadas para todos os momentos.",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "CONDE SEMIJOIAS",
    description:
      "Loja online da CONDE SEMIJOIAS com colecoes exclusivas e pecas sofisticadas para todos os momentos.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="light" style={{ colorScheme: "light" }}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased bg-white text-black [font-family:var(--font-poppins)] font-light`}
        style={{ background: "#ffffff", color: "#000000" }}
      >
        <ClerkProvider>
          <CartProvider>
            <NavbarWrapper />
            <MainWrapper>{children}</MainWrapper>
          </CartProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
