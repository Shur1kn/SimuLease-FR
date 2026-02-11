import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portfolio | Développeur SaaS - Genève, Suisse",
  description:
    "Développeur indépendant basé à Genève, spécialisé dans la création d'applications SaaS pour les entreprises suisses et françaises. Facturation, immobilier, sports d'hiver, IA et plus.",
  keywords: [
    "SaaS",
    "développeur",
    "Genève",
    "Suisse",
    "France",
    "applications",
    "logiciels",
  ],
  openGraph: {
    title: "Portfolio | Développeur SaaS - Genève, Suisse",
    description:
      "Applications SaaS innovantes pour les entreprises suisses et françaises",
    type: "website",
    locale: "fr_CH",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
