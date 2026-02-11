"use client";

import { useState } from "react";
import AppCard from "./AppCard";
import AppModal from "./AppModal";

interface Application {
  id: string;
  name: string;
  logo: string | null;
  summary: string;
  descriptionBut: string;
  descriptionHow: string;
  screenshots: string;
  url: string;
  marketCH: boolean;
  marketFR: boolean;
  category: string;
  displayOrder: number;
  isActive: boolean;
}

interface AppGridProps {
  applications: Application[];
}

export default function AppGrid({ applications }: AppGridProps) {
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  return (
    <section id="applications" className="py-20 sm:py-28 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-text mb-4">
            Mes applications
          </h2>
          <p className="text-text-light text-lg max-w-2xl mx-auto">
            Des solutions SaaS conçues pour répondre aux besoins spécifiques
            des entreprises suisses et françaises
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {applications.map((app, index) => (
            <AppCard
              key={app.id}
              app={app}
              index={index}
              onClick={() => setSelectedApp(app)}
            />
          ))}
        </div>
      </div>

      {selectedApp && (
        <AppModal app={selectedApp} onClose={() => setSelectedApp(null)} />
      )}
    </section>
  );
}
