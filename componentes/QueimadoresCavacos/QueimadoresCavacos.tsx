import React from "react";
import {
  Droplets,
  Flame,
  ShieldCheck,
  Recycle,
  Settings,
  Award,
} from "lucide-react";

const benefits = [
  {
    titulo: "Sustentabilidade",
    descricao:
      "Tecnologoia sustentável na geração de energia térmica para secagem de grãos.",
    icone: Droplets,
  },
  {
    titulo: "Alta Eficiência",
    descricao:
      "Queimadores com até 80% de eficiência energética e tecnologia de ponta.",
    icone: Flame,
  },
  {
    titulo: "Sem contaminação",
    descricao:
      "Secagem de grãos sem contaminação por fumaça ou HPAs, preservando a qualidade.",
    icone: ShieldCheck,
  },
  {
    titulo: "Economia circular",
    descricao:
      "Aproveitamento de resíduos vegetais como fonte energética renovável. ",
    icone: Recycle,
  },
  {
    titulo: "Tecnologia Nacional",
    descricao: "Engenharia brasileira a serviço do agronegócio. ",
    icone: Settings,
  },
  {
    titulo: "Eficiência Energética",
    descricao:
      "Mais de 17 anos transformando desafios em soluçoes energéticas sustentáveis.",
    icone: Award,
  },
];

const queimadoresCavacos = () => {
  return (
    <section className="bg-[var(--kairos-dark)] px-4 py-16 sm:px-6 md:py-20 lg:px-8">
      <div className="mx-auto max-w-5xl text-center">
        {/* Pequena etiqueta */}
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--kairos-orange)]/30 bg-[#1a100c] px-4 py-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--kairos-orange)]"></span>

          <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--kairos-orange)] sm:text-xs">
            Tecnologia para o campo
          </span>
        </div>

        {/* Título */}
        <h2 className="text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl">
          Queimadores de cavaco Kairos:
        </h2>

        <h3 className="mt-1 text-2xl font-bold leading-tight text-[var(--kairos-orange)] sm:text-3xl md:text-4xl">
          A escolha inteligente para secagem de grãos
        </h3>

        {/* Linha decorativa */}
        <div className="mx-auto mt-4 flex items-center justify-center gap-2">
          <span className="h-[2px] w-10 bg-[var(--kairos-orange)]"></span>
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--kairos-orange)]"></span>
          <span className="h-[2px] w-10 bg-[var(--kairos-orange)]"></span>
        </div>

        {/* Texto */}
        <p className="mx-auto mt-6 max-w-3xl text-sm leading-relaxed text-gray-300 sm:text-base">
          Transforme resíduos de biomassa em energia limpa e eficiente.
        </p>

        <p className="mx-auto mt-2 max-w-2xl text-xs leading-relaxed text-gray-400 sm:text-sm">
          Somos conhecidos como os desenvolvedores dos queimadores de biomassa
          mais tecnológicos e de melhor qualidade de combustão do mercado.
        </p>

        {/* Cards */}
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((beneficio) => {
            const Icon = beneficio.icone;

            return (
              <div
                key={beneficio.titulo}
                className="group flex min-h-[180px] flex-col items-center rounded-md border-t-2 border-[var(--kairos-orange)]/70 bg-[var(--kairos-card)] px-6 py-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                {/* Ícone */}
                <div className="flex h-13 w-13 items-center justify-center rounded-xl bg-[var(--kairos-orange)] shadow-[0_5px_20px_rgba(224,79,17,0.25)]">
                  <Icon size={22} strokeWidth={1.8} className="text-white" />
                </div>

                {/* Título */}
                <h4 className="mt-4 text-sm font-bold text-white">
                  {beneficio.titulo}
                </h4>

                {/* Descrição */}
                <p className="mt-3 max-w-[250px] text-xs leading-relaxed text-gray-400">
                  {beneficio.descricao}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default queimadoresCavacos;