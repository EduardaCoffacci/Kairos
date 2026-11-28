
import {
  Droplets,
  Thermometer,
  Fuel,
  FlaskConical,
  AlertTriangle,
} from "lucide-react";

const challenges = [
  {
    icon: Droplets,
    title: "Excesso de umidade",
    description:
      "Pode acelerar a deterioração dos grãos e favorecer o desenvolvimento de fungos durante o armazenamento.",
  },
  {
    icon: Thermometer,
    title: "Controle da temperatura",
    description:
      "Variações inadequadas podem comprometer a qualidade e as características dos grãos.",
  },
  {
    icon: Fuel,
    title: "Eficiência energética",
    description:
      "O consumo elevado de combustível pode aumentar os custos operacionais do processo de secagem.",
  },
  {
    icon: FlaskConical,
    title: "Risco de contaminação",
    description:
      "A secagem com sistemas de aquecimento inadequados pode favorecer a contaminação por compostos indesejáveis, como hidrocarbonetos policíclicos aromáticos (HPAs).",
  },
];

export default function DryingChallenges() {
  return (
    <section
      id="desafios-secagem"
      aria-labelledby="drying-challenges-title"
      className="relative overflow-hidden bg-[var(--kairos-dark)] py-24 text-white md:py-32"
    >
      <div className="container-kairos">
        {/* CABEÇALHO */}
        <div className="mb-14">
          <div className="flex items-center gap-4">
            <span
              aria-hidden="true"
              className="text-5xl font-bold tracking-tighter text-[var(--kairos-orange)]/40 md:text-7xl"
            >
              01
            </span>

            <div
              aria-hidden="true"
              className="h-12 w-px bg-white/20"
            />

            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--kairos-orange)]">
                Pontos de atenção
              </span>

              <p className="mt-2 text-sm text-gray-300">
                Os fatores que exigem controle no processo
              </p>
            </div>
          </div>

          <h2
            id="drying-challenges-title"
            className="mt-8 w-full max-w-4xl text-4xl font-bold leading-tight md:text-6xl"
          >
            O que pode comprometer
            <span className="block text-[var(--kairos-orange)]">
              a secagem dos grãos?
            </span>
          </h2>

          <p className="mt-6 w-full max-w-2xl text-lg leading-8 text-gray-300">
            Umidade, temperatura, consumo energético e qualidade da combustão
            são fatores importantes para a eficiência do processo e a
            preservação da produção.
          </p>
        </div>

        {/* LISTA DE DESAFIOS */}
        <ul className="grid w-full min-w-0 list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {challenges.map((desafio, index) => {
            const Icon = desafio.icon;

            return (
              <li key={desafio.title} className="min-w-0">
                <article
                  className="group relative h-full border border-white/10 bg-[var(--kairos-card)] p-7 motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:border-[var(--kairos-orange)]/60 motion-reduce:transition-none md:p-8"
                >
                  {/* NÚMERO DO CARD */}
                  <div className="mb-7 flex items-center justify-between">
                    <span
                      aria-hidden="true"
                      className="text-sm font-semibold tracking-widest text-gray-300"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <Icon
                      className="h-7 w-7 text-[var(--kairos-orange)] motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-110"
                      strokeWidth={1.7}
                      aria-hidden="true"
                      focusable="false"
                    />
                  </div>

                  {/* DETALHE DECORATIVO */}
                  <div
                    aria-hidden="true"
                    className="mb-5 h-1 w-10 bg-[var(--kairos-orange)] motion-safe:transition-all motion-safe:duration-300 motion-safe:group-hover:w-16 motion-reduce:transition-none"
                  />

                  {/* TÍTULO */}
                  <h3 className="text-xl font-semibold leading-snug">
                    {desafio.title}
                  </h3>

                  {/* DESCRIÇÃO */}
                  <p className="mt-4 text-sm leading-7 text-gray-300">
                    {desafio.description}
                  </p>
                </article>
              </li>
            );
          })}
        </ul>

        {/* OBSERVAÇÃO */}
        <aside
          aria-labelledby="drying-planning-title"
          className="mt-10 flex min-w-0 items-start gap-4 border-l-2 border-[var(--kairos-orange)] bg-[var(--kairos-card)] p-6 md:p-8"
        >
          <AlertTriangle
            className="mt-1 h-6 w-6 shrink-0 text-[var(--kairos-orange)]"
            aria-hidden="true"
            focusable="false"
          />

          <div className="min-w-0">
            <h3
              id="drying-planning-title"
              className="font-semibold text-white"
            >
              Controle e planejamento
            </h3>

            <p className="mt-2 text-sm leading-7 text-gray-300 md:text-base">
              O dimensionamento adequado dos equipamentos e o controle das
              condições de operação são importantes para reduzir riscos,
              melhorar a eficiência e preservar a qualidade dos grãos.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
