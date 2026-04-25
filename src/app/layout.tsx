import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
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

const CANONICAL_BASE = "https://condesemijoias.com.br";

function resolveSiteUrl(): URL {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!raw) {
    return new URL(CANONICAL_BASE);
  }

  const normalized = raw.replace(/\/$/, "");

  try {
    const parsed = new URL(normalized);

    if (parsed.hostname.endsWith("vercel.app")) {
      return new URL(CANONICAL_BASE);
    }

    return parsed;
  } catch {
    return new URL(CANONICAL_BASE);
  }
}

const SITE_URL = resolveSiteUrl();

export const metadata: Metadata = {
  metadataBase: SITE_URL,
  title: {
    default: "Conde Semijoias",
    template: "%s | Conde Semijoias",
  },
  applicationName: "Conde Semijoias",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "conde semijoias",
    "semijoias",
    "semijoias femininas",
    "acessorios femininos",
    "anel",
    "brinco",
    "colar",
    "pulseira",
    "loja de semijoias",
  ],
  description:
    "Loja online da Conde Semijoias com colecoes exclusivas, pecas sofisticadas e envio para todo o Brasil.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Conde Semijoias",
    description:
      "Loja online da Conde Semijoias com colecoes exclusivas, pecas sofisticadas e envio para todo o Brasil.",
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: "Conde Semijoias",
  },
  twitter: {
    card: "summary_large_image",
    title: "Conde Semijoias",
    description:
      "Loja online da Conde Semijoias com colecoes exclusivas, pecas sofisticadas e envio para todo o Brasil.",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL.origin}/#organization`,
      name: "Conde Semijoias",
      url: SITE_URL.origin,
      sameAs: ["https://instagram.com/condesemijoias"],
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer support",
          telephone: "+55-85-99999-9999",
          email: "contato@condesemijoias.com.br",
          areaServed: "BR",
          availableLanguage: ["pt-BR"],
        },
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL.origin}/#website`,
      name: "Conde Semijoias",
      url: SITE_URL.origin,
      inLanguage: "pt-BR",
      publisher: {
        "@id": `${SITE_URL.origin}/#organization`,
      },
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL.origin}/produtos?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "ItemList",
      "@id": `${SITE_URL.origin}/#sitelinks`,
      name: "Principais paginas",
      itemListElement: [
        {
          "@type": "SiteNavigationElement",
          position: 1,
          name: "Produtos",
          url: `${SITE_URL.origin}/produtos`,
        },
        {
          "@type": "SiteNavigationElement",
          position: 2,
          name: "Sobre",
          url: `${SITE_URL.origin}/sobre`,
        },
        {
          "@type": "SiteNavigationElement",
          position: 3,
          name: "Contato",
          url: `${SITE_URL.origin}/contato`,
        },
        {
          "@type": "SiteNavigationElement",
          position: 4,
          name: "Trocas e Devolucoes",
          url: `${SITE_URL.origin}/trocas-e-devolucoes`,
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="light" style={{ colorScheme: "light" }}>
      <head>
        <link rel="preconnect" href="https://accounts.dev" crossOrigin="" />
        <link
          rel="preconnect"
          href="https://clerk.accounts.dev"
          crossOrigin=""
        />
        <link
          rel="preconnect"
          href="https://api.nuvemshop.com.br"
          crossOrigin=""
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased bg-white text-black [font-family:var(--font-poppins)] font-light`}
        style={{ background: "#ffffff", color: "#000000" }}
      >
        <ClerkProvider>
          <CartProvider>
            <FavoritesProvider>
              <NavbarWrapper />
              <MainWrapper>{children}</MainWrapper>
            </FavoritesProvider>
          </CartProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
