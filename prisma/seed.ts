import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 12);
  await prisma.adminUser.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: hashedPassword,
    },
  });

  // Create site content
  await prisma.siteContent.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      heroTitle: "Développeur de solutions SaaS",
      heroSubtitle: "Pour la Suisse et la France",
      aboutText:
        "Développeur indépendant basé à Genève, je conçois et développe des applications SaaS sur mesure pour les entreprises suisses et françaises. Spécialisé dans la création de solutions métier innovantes, je couvre plusieurs secteurs : transport, sports d'hiver, immobilier, communication, financement d'entreprise et optimisation de coûts. Chaque application est pensée pour répondre aux besoins spécifiques du marché local, avec une attention particulière portée à l'expérience utilisateur et à la performance.",
      contactEmail: "contact@portfolio.ch",
      contactPhone: "+41 XX XXX XX XX",
      contactAddress: "Genève, Suisse",
      linkedinUrl: "https://linkedin.com/in/",
    },
  });

  // Delete existing applications to avoid duplicates on re-seed
  await prisma.application.deleteMany({});

  const applications = [
    {
      name: "FactuRide",
      summary: "Plateforme de facturation et gestion clients pour les professionnels.",
      descriptionBut:
        "Simplifier la facturation et la gestion de clients pour les professionnels du transport et des services. Permet de créer des factures rapidement, suivre les paiements et gérer les opérations commerciales de manière fluide.",
      descriptionHow: JSON.stringify([
        "Création et envoi de factures professionnelles",
        "Gestion de la base clients",
        "Suivi des paiements et relances",
        "Tableau de bord des opérations commerciales",
      ]),
      url: "https://facturide.base44.app/",
      marketCH: true,
      marketFR: false,
      category: "Facturation & Gestion commerciale",
      displayOrder: 1,
      isActive: true,
    },
    {
      name: "SkiFlow",
      summary: "Gestion tout-en-un de la location de matériel de sports d'hiver.",
      descriptionBut:
        "Plateforme tout-en-un dédiée aux magasins de sports d'hiver pour gérer la location de matériel de ski et snowboard. Optimisée pour le marché suisse et français.",
      descriptionHow: JSON.stringify([
        "Gestion du parc de matériel de location",
        "Réservations et planning",
        "Suivi clients et contrats de location",
        "Adapté aux spécificités suisses et françaises",
      ]),
      url: "https://skiflow.base44.app/",
      marketCH: true,
      marketFR: true,
      category: "Sports d'hiver / Location de matériel",
      displayOrder: 2,
      isActive: true,
    },
    {
      name: "Scan'Immo",
      summary: "Assistant intelligent pour simuler vos investissements immobiliers.",
      descriptionBut:
        "Assistant intelligent conçu pour simuler et optimiser les investissements immobiliers en Suisse. Aide les investisseurs à prendre des décisions éclairées grâce à l'analyse de données.",
      descriptionHow: JSON.stringify([
        "Simulation d'investissement immobilier",
        "Calcul de rentabilité et de plus-value potentielle",
        "Analyse du marché immobilier suisse",
        "Comparaison de biens et alertes personnalisées",
      ]),
      url: "https://scanimmov2.base44.app/",
      marketCH: true,
      marketFR: false,
      category: "Immobilier / Investissement",
      displayOrder: 3,
      isActive: true,
    },
    {
      name: "Composely",
      summary: "Rédigez des emails professionnels en quelques secondes grâce à l'IA.",
      descriptionBut:
        "Permettre à quiconque de rédiger des emails professionnels et personnalisés en quelques secondes grâce à l'intelligence artificielle. Simplifie la communication écrite au quotidien.",
      descriptionHow: JSON.stringify([
        "Rédaction d'emails assistée par IA",
        "Bibliothèque de templates prêts à l'emploi",
        "Analyse et ajustement du ton (formel, amical, commercial)",
        "Options de personnalisation avancées",
      ]),
      url: "https://composely.base44.app/",
      marketCH: true,
      marketFR: true,
      category: "Communication / Intelligence Artificielle",
      displayOrder: 4,
      isActive: true,
    },
    {
      name: "SimuLease",
      summary: "Simulation et optimisation de financements d'équipements pour entreprises.",
      descriptionBut:
        "Outil intuitif de simulation de financements d'équipements à destination des entreprises françaises. Permet de comparer les offres de leasing et de choisir la solution la plus avantageuse.",
      descriptionHow: JSON.stringify([
        "Simulation de financements locatifs (leasing)",
        "Comparaison multi-offres",
        "Optimisation du coût total de financement",
        "Aide à la décision pour les investissements d'équipements",
      ]),
      url: "https://simulease-fr.base44.app/",
      marketCH: false,
      marketFR: true,
      category: "Financement / Gestion commerciale",
      displayOrder: 5,
      isActive: true,
    },
    {
      name: "CostLab IA",
      summary: "Optimisez vos coûts et marges grâce à l'intelligence artificielle.",
      descriptionBut:
        "Optimiser les coûts et les marges des entreprises grâce à un outil intelligent alimenté par l'IA. Analyse avancée pour améliorer la rentabilité.",
      descriptionHow: JSON.stringify([
        "Analyse automatisée des coûts et des marges",
        "Recommandations IA pour l'optimisation",
        "Tableaux de bord et rapports de rentabilité",
        "Suivi en temps réel des indicateurs de performance",
      ]),
      url: "https://costlabv2.base44.app/",
      marketCH: true,
      marketFR: true,
      category: "Finance / Intelligence Artificielle",
      displayOrder: 6,
      isActive: true,
    },
  ];

  for (const app of applications) {
    await prisma.application.create({ data: app });
  }

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
