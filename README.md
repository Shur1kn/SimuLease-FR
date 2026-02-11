# Portfolio - Développeur SaaS Genève

Site portfolio professionnel présentant un catalogue de logiciels SaaS, destiné aux marchés suisse et français.

## Stack technique

- **Framework** : Next.js 16 (App Router, TypeScript)
- **Styling** : Tailwind CSS v4
- **Base de données** : SQLite via Prisma ORM
- **Authentification** : JWT (cookies httpOnly)
- **Icônes** : Lucide React

## Installation

```bash
# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env

# Créer la base de données et appliquer les migrations
npx prisma migrate dev

# Peupler la base avec les données initiales (6 applications + admin)
npx tsx prisma/seed.ts

# Lancer le serveur de développement
npm run dev
```

## Accès admin

- **URL** : `/admin/login`
- **Identifiant** : `admin`
- **Mot de passe** : `admin123`

> Modifier le mot de passe en production via le seed ou directement en base.

## Structure du projet

```
src/
├── app/
│   ├── page.tsx              # Page d'accueil (landing page)
│   ├── layout.tsx            # Layout racine (SEO, metadata)
│   ├── globals.css           # Styles globaux et animations
│   ├── admin/
│   │   ├── page.tsx          # Dashboard admin (CRUD, contenu, messages)
│   │   └── login/page.tsx    # Page de connexion admin
│   └── api/
│       ├── auth/             # Login, logout, session
│       ├── applications/     # CRUD applications
│       ├── contact/          # Formulaire de contact
│       ├── messages/         # Gestion messages
│       └── site-content/     # Contenu du site
├── components/
│   ├── Header.tsx            # Navigation fixe
│   ├── Hero.tsx              # Section hero
│   ├── AppGrid.tsx           # Grille des applications
│   ├── AppCard.tsx           # Carte d'application
│   ├── AppModal.tsx          # Modale de détail
│   ├── About.tsx             # Section à propos
│   ├── Contact.tsx           # Formulaire de contact
│   └── Footer.tsx            # Pied de page
└── lib/
    ├── prisma.ts             # Client Prisma singleton
    └── auth.ts               # Utilitaires JWT/bcrypt
```

## Applications intégrées

| Application | Marché | Secteur |
|---|---|---|
| FactuRide | Suisse | Facturation |
| SkiFlow | Suisse & France | Sports d'hiver |
| Scan'Immo | Suisse | Immobilier |
| Composely | Suisse & France | Communication / IA |
| SimuLease | France | Financement |
| CostLab IA | Suisse & France | Finance / IA |
