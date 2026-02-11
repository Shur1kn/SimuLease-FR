"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink } from "lucide-react";

interface Application {
  id: string;
  name: string;
  logo: string | null;
  summary: string;
  url: string;
  marketCH: boolean;
  marketFR: boolean;
  category: string;
}

interface AppCardProps {
  app: Application;
  index: number;
  onClick: () => void;
}

const categoryIcons: Record<string, string> = {
  "Facturation & Gestion commerciale": "📄",
  "Sports d'hiver / Location de matériel": "⛷️",
  "Immobilier / Investissement": "🏠",
  "Communication / Intelligence Artificielle": "✉️",
  "Financement / Gestion commerciale": "💰",
  "Finance / Intelligence Artificielle": "🤖",
};

export default function AppCard({ app, index, onClick }: AppCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const icon = categoryIcons[app.category] || "💻";

  return (
    <div
      ref={ref}
      className={`group cursor-pointer bg-white rounded-2xl border border-border p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/20 ${
        isVisible ? "animate-fade-in-up" : "opacity-0"
      }`}
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-2xl">
          {icon}
        </div>
        <ExternalLink
          size={18}
          className="text-text-light opacity-0 group-hover:opacity-100 transition-opacity"
        />
      </div>

      <h3 className="text-xl font-bold text-text mb-2 group-hover:text-primary transition-colors">
        {app.name}
      </h3>

      <p className="text-text-light text-sm mb-4 line-clamp-2">
        {app.summary}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          {app.marketCH && (
            <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-2.5 py-1 rounded-full text-xs font-medium">
              🇨🇭 Suisse
            </span>
          )}
          {app.marketFR && (
            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-medium">
              🇫🇷 France
            </span>
          )}
        </div>
        <span className="text-xs text-text-light">{app.category}</span>
      </div>
    </div>
  );
}
