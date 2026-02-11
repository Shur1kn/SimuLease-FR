import { MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-text py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <span className="text-white font-bold text-lg">SaaS Portfolio</span>
          </div>

          <div className="flex items-center gap-1 text-gray-400 text-sm">
            <MapPin size={14} />
            <span>Genève, Suisse</span>
          </div>

          <p className="text-gray-400 text-sm">
            &copy; {currentYear} SaaS Portfolio. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
