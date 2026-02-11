import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AppGrid from "@/components/AppGrid";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [applications, siteContent] = await Promise.all([
    prisma.application.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
    }),
    prisma.siteContent.findFirst({ where: { id: "main" } }),
  ]);

  return (
    <main className="min-h-screen">
      <Header />
      <Hero
        title={siteContent?.heroTitle || "Développeur de solutions SaaS"}
        subtitle={
          siteContent?.heroSubtitle || "Pour la Suisse et la France"
        }
      />
      <AppGrid applications={applications} />
      <About text={siteContent?.aboutText || ""} />
      <Contact />
      <Footer />
    </main>
  );
}
