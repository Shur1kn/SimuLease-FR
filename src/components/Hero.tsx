import { ArrowDown } from "lucide-react";

interface HeroProps {
  title: string;
  subtitle: string;
}

export default function Hero({ title, subtitle }: HeroProps) {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-white to-accent/5" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in-up">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          Basé à Genève, Suisse
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-text leading-tight mb-6 animate-fade-in-up stagger-1">
          {title}
        </h1>

        <p className="text-xl sm:text-2xl text-text-light max-w-2xl mx-auto mb-10 animate-fade-in-up stagger-2">
          {subtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up stagger-3">
          <a
            href="#applications"
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5"
          >
            Découvrir mes applications
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-surface text-text border border-border px-8 py-4 rounded-xl font-semibold transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            Me contacter
          </a>
        </div>
      </div>

      <a
        href="#applications"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-text-light hover:text-primary transition-colors animate-bounce"
      >
        <ArrowDown size={24} />
      </a>
    </section>
  );
}
