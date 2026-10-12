
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
      "Tecnologia para geração de energia térmica a partir de biomassa.",
    icone: Droplets,
  },
  {
    titulo: "Alta eficiência",
    descricao:
      "Soluções projetadas para otimizar o aproveitamento energético do processo de secagem.",
    icone: Flame,
  },
  {
    titulo: "Qualidade da combustão",
    descricao:
      "Tecnologia voltada ao controle da combustão e à preservação da qualidade dos grãos.",
    icone: ShieldCheck,
  },
  {
    titulo: "Economia circular",
    descricao:
      "Aproveitamento de resíduos vegetais como fonte de energia renovável.",
    icone: Recycle,
  },
  {
    titulo: "Engenharia nacional",
    descricao:
      "Desenvolvimento de soluções brasileiras para atender às necessidades do agronegócio.",
    icone: Settings,
  },
  {
    titulo: "Experiência industrial",
    descricao:
      "Mais de 17 anos de experiência no desenvolvimento de soluções energéticas.",
    icone: Award,
  },
];

export default function QueimadoresCavacos() {
  return (
    <section
      id="beneficios-queimadores"
      className="bg-[var(--kairos-black)] px-6 py-24 text-white md:py-32"
    >
      <div className="mx-auto max-w-7xl">
        {/* CABEÇALHO TÉCNICO */}
        <div className="grid gap-8 border-b border-white/10 pb-12 md:grid-cols-[1fr_auto] md:items-end md:pb-14">
          <div className="max-w-4xl">
            <span className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--kairos-orange)]">
              Tecnologia para o agronegócio
            </span>

            <h2 className="mt-6 text-4xl font-bold leading-tight md:text-6xl lg:text-7xl">
              Queimadores
              <span className="block text-[var(--kairos-orange)]">
                de cavaco.
              </span>
            </h2>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-300 md:text-xl">
              Soluções em energia térmica para processos de secagem de grãos,
              com foco no aproveitamento de biomassa e na eficiência operacional.
            </p>
          </div>

          {/* IDENTIFICAÇÃO VISUAL */}
          <div className="flex items-center gap-4 md:flex-col md:items-end md:gap-2">
            <Flame
              className="h-10 w-10 text-[var(--kairos-orange)] md:h-14 md:w-14"
              strokeWidth={1.2}
              aria-hidden="true"
            />

            <div className="md:text-right">
              <span className="block text-xs uppercase tracking-[0.2em] text-gray-500">
                Kairos Industrial
              </span>

              <span className="mt-1 block text-sm text-gray-300">
                Energia e engenharia
              </span>
            </div>
          </div>
        </div>

        {/* DESTAQUE */}
        <div className="mt-14 border-l-2 border-[var(--kairos-orange)] bg-[var(--kairos-dark)] px-6 py-7 md:px-9 md:py-8">
          <div className="flex items-start gap-5">
            <Flame
              className="mt-1 h-7 w-7 shrink-0 text-[var(--kairos-orange)]"
              strokeWidth={1.7}
              aria-hidden="true"
            />

            <div>
              <h3 className="text-xl font-semibold md:text-2xl">
                Energia térmica com aproveitamento de biomassa
              </h3>

              <p className="mt-3 max-w-3xl text-base leading-7 text-gray-400">
                O uso de cavacos de madeira e outros combustíveis de biomassa
                adequados pode contribuir para o aproveitamento de recursos
                renováveis e para a diversificação das fontes energéticas
                utilizadas na secagem agrícola.
              </p>
            </div>
          </div>
        </div>

        {/* BENEFÍCIOS */}
        <div className="mt-20">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <span className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--kairos-orange)]">
                Diferenciais
              </span>

              <h3 className="mt-4 text-3xl font-bold md:text-4xl">
                Tecnologia aplicada à geração de energia
              </h3>
            </div>

            <p className="max-w-md leading-7 text-gray-400">
              Engenharia e soluções desenvolvidas para atender às exigências
              dos processos industriais e do agronegócio.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((beneficio, index) => {
              const Icon = beneficio.icone;

              return (
                <article
                  key={beneficio.titulo}
                  className="group border border-white/10 bg-[var(--kairos-card)] p-7 transition duration-300 hover:-translate-y-1 hover:border-[var(--kairos-orange)]/60 md:p-8"
                >
                  {/* ÍCONE E NUMERAÇÃO */}
                  <div className="mb-7 flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center border border-[var(--kairos-orange)]/25 bg-[var(--kairos-dark)]">
                      <Icon
                        className="h-7 w-7 text-[var(--kairos-orange)]"
                        strokeWidth={1.7}
                        aria-hidden="true"
                      />
                    </div>

                    <span className="text-sm font-semibold tracking-widest text-gray-600">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="mb-5 h-1 w-10 bg-[var(--kairos-orange)] transition-all duration-300 group-hover:w-16" />

                  <h4 className="text-xl font-semibold">
                    {beneficio.titulo}
                  </h4>

                  <p className="mt-4 text-sm leading-7 text-gray-400 md:text-base">
                    {beneficio.descricao}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
