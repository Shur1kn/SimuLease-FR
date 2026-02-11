import { Code2, Globe, Lightbulb, MapPin } from "lucide-react";

interface AboutProps {
  text: string;
}

export default function About({ text }: AboutProps) {
  const skills = [
    { icon: Code2, label: "Développement Full-Stack", desc: "React, Next.js, Node.js, TypeScript" },
    { icon: Globe, label: "Applications SaaS", desc: "Solutions cloud sur mesure" },
    { icon: Lightbulb, label: "Intelligence Artificielle", desc: "Intégration IA et automatisation" },
    { icon: MapPin, label: "Marché Local", desc: "Suisse & France" },
  ];

  return (
    <section id="about" className="py-20 sm:py-28 px-4 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-text mb-4">
            À propos
          </h2>
          <p className="text-text-light text-lg max-w-2xl mx-auto">
            Un développeur passionné par la création de solutions logicielles innovantes
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <p className="text-text-light leading-relaxed text-lg mb-8">
              {text}
            </p>
            <div className="flex items-center gap-2 text-primary font-medium">
              <MapPin size={18} />
              <span>Genève, Suisse</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {skills.map((skill) => (
              <div
                key={skill.label}
                className="bg-white rounded-xl p-5 border border-border hover:border-primary/20 hover:shadow-md transition-all"
              >
                <skill.icon size={24} className="text-primary mb-3" />
                <h3 className="font-semibold text-text mb-1">{skill.label}</h3>
                <p className="text-text-light text-sm">{skill.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
