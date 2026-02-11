"use client";

import { useEffect } from "react";
import { X, ExternalLink } from "lucide-react";

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
}

interface AppModalProps {
  app: Application;
  onClose: () => void;
}

const categoryIcons: Record<string, string> = {
  "Facturation & Gestion commerciale": "📄",
  "Sports d'hiver / Location de matériel": "⛷️",
  "Immobilier / Investissement": "🏠",
  "Communication / Intelligence Artificielle": "✉️",
  "Financement / Gestion commerciale": "💰",
  "Finance / Intelligence Artificielle": "🤖",
};

export default function AppModal({ app, onClose }: AppModalProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const features: string[] = (() => {
    try {
      return JSON.parse(app.descriptionHow);
    } catch {
      return [app.descriptionHow];
    }
  })();

  const icon = categoryIcons[app.category] || "💻";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-gray-100 transition-colors"
          aria-label="Fermer"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-8 pb-6 rounded-t-2xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-3xl">
              {icon}
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-text">
                {app.name}
              </h2>
              <p className="text-text-light">{app.category}</p>
            </div>
          </div>

          <div className="flex gap-2">
            {app.marketCH && (
              <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-3 py-1.5 rounded-full text-sm font-medium">
                🇨🇭 Suisse
              </span>
            )}
            {app.marketFR && (
              <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium">
                🇫🇷 France
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* But */}
          <div>
            <h3 className="text-lg font-semibold text-text mb-2">Objectif</h3>
            <p className="text-text-light leading-relaxed">
              {app.descriptionBut}
            </p>
          </div>

          {/* Fonctionnement */}
          <div>
            <h3 className="text-lg font-semibold text-text mb-3">
              Fonctionnalités clés
            </h3>
            <ul className="space-y-2">
              {features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-2 h-2 bg-primary rounded-full" />
                  </span>
                  <span className="text-text-light">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="pt-4 border-t border-border">
            <a
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-primary/25"
            >
              <span>Tester l&apos;application</span>
              <ExternalLink size={18} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
