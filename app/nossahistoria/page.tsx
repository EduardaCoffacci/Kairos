import Header from "@/componentes/Header/Header";
import Footer from "@/componentes/Footer/Footer";
import Image from "next/image";

export default function NossaHistoriaPage() {
  return (
    <>
    <Header/>
    <section
      id="nossa-historia"
      className="bg-[var(--kairos-black)] pt-32 pb-24 text-white md:pt-50 md:pb-32"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* CABEÇALHO */}
        <div className="max-w-3xl">
          <span className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--kairos-orange)]">
            Nossa História
          </span>

          <h2 className="mt-5 text-4xl font-bold leading-tight md:text-6xl">
            Experiência técnica.
            <span className="block text-[var(--kairos-orange)]">
              Soluções para a indústria.
            </span>
          </h2>

          <div className="mt-7 h-1 w-20 bg-[var(--kairos-orange)]" />

          <p className="mt-8 text-lg leading-8 text-gray-300">
            Uma trajetória construída através de experiência prática,
            conhecimento técnico e desenvolvimento de soluções para diferentes
            necessidades da indústria.
          </p>
        </div>

        {/* HISTÓRIA + IMAGEM */}
        <div className="mt-20 grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* TEXTO */}
          <div>
            <h3 className="text-2xl font-semibold md:text-3xl">
              Conhecimento que vai do projeto à fabricação
            </h3>

            <p className="mt-7 text-base leading-8 text-gray-300">
              A Kairos Industrial possui mais de 15 anos de experiência na área
              industrial, desenvolvendo projetos mecânicos, máquinas,
              equipamentos e sistemas industriais para diferentes aplicações.
              Ao longo dessa trajetória, construímos uma atuação baseada na
              integração entre conhecimento técnico de engenharia e experiência
              prática de chão de fábrica, acompanhando projetos desde a
              concepção e desenvolvimento até a fabricação, montagem e
              implementação.
            </p>

            <p className="mt-5 text-base leading-8 text-gray-300">
              Nossa experiência abrange diferentes áreas da indústria, incluindo
              projetos mecânicos, modelagem 3D, detalhamento técnico,
              dimensionamento e especificação de componentes, usinagem,
              caldeiraria, corte e dobra de chapas, pneumática, hidráulica,
              elétrica e automação industrial. Também atuamos no desenvolvimento
              de sistemas de movimentação e transporte de materiais,
              dispositivos, mecanismos, máquinas e soluções especiais, sempre
              buscando adequar cada projeto às necessidades específicas de sua
              aplicação.
            </p>

            <p className="mt-5 text-base leading-8 text-gray-300">
              Essa visão multidisciplinar permite considerar, desde as primeiras
              etapas do projeto, aspectos como fabricação, montagem, manutenção,
              segurança, custos e viabilidade industrial. Dessa forma, buscamos
              desenvolver soluções que não sejam apenas tecnicamente funcionais,
              mas também práticas e adequadas à realidade do processo produtivo.
              Mais do que desenvolver projetos, a Kairos busca transformar
              necessidades industriais em soluções eficientes, fabricáveis e
              economicamente viáveis, unindo experiência, conhecimento técnico e
              compreensão dos desafios encontrados no ambiente industrial.
            </p>

            {/* INDICADORES */}
            <div className="mt-10 grid grid-cols-2 gap-6 border-t border-white/10 pt-8">
              <div>
                <span className="text-4xl font-bold text-[var(--kairos-orange)]">
                  15+
                </span>

                <p className="mt-2 text-sm text-gray-400">
                  Anos de experiência industrial
                </p>
              </div>

              <div>
                <span className="text-4xl font-bold text-[var(--kairos-orange)]">
                  360°
                </span>

                <p className="mt-2 text-sm text-gray-400">
                  Visão do projeto à execução
                </p>
              </div>
            </div>
          </div>

          {/* IMAGEM */}
          <div className="relative">
            <div className="absolute -right-4 -top-4 h-36 w-36 border-r-2 border-t-2 border-[var(--kairos-orange)]" />

            <div className="relative h-[460px] overflow-hidden md:h-[580px]">
              <Image
                src="/images/nossahistoria/nossahistoria.jpg"
                alt="Projetos e equipamentos industriais"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition duration-700 hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute bottom-0 left-0 p-8">
                <p className="text-sm uppercase tracking-[0.2em] text-[var(--kairos-orange)]">
                  Experiência
                </p>

                <h3 className="mt-2 text-2xl font-bold md:text-3xl">
                  Engenharia aplicada à realidade industrial
                </h3>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 h-28 w-28 border-b-2 border-l-2 border-[var(--kairos-orange)]" />
          </div>
        </div>

        {/* EXPERIÊNCIA MULTIDISCIPLINAR */}
        <div className="mt-28 border-t border-white/10 pt-20">
          <div className="max-w-3xl">
            <span className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--kairos-orange)]">
              Experiência multidisciplinar
            </span>

            <h3 className="mt-4 text-3xl font-bold md:text-4xl">
              Diferentes áreas integradas em um único projeto
            </h3>

            <p className="mt-5 leading-8 text-gray-400">
              A experiência acumulada permite atuar de maneira multidisciplinar,
              conectando diferentes conhecimentos técnicos para desenvolver
              soluções completas e adequadas aos processos de fabricação e
              montagem.
            </p>
          </div>

          {/* CARDS */}
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Projeto Mecânico",
                description:
                  "Desenvolvimento de máquinas, equipamentos, mecanismos e dispositivos industriais.",
              },
              {
                title: "Modelagem 3D",
                description:
                  "Modelagem, detalhamento técnico e documentação para fabricação.",
              },
              {
                title: "Fabricação",
                description:
                  "Experiência em usinagem, caldeiraria, corte, dobra e conformação de chapas.",
              },
              {
                title: "Automação",
                description:
                  "Integração de sistemas elétricos, pneumáticos e hidráulicos.",
              },
              {
                title: "Movimentação",
                description:
                  "Desenvolvimento de sistemas para movimentação e transporte de materiais.",
              },
              {
                title: "Dimensionamento",
                description:
                  "Especificação de componentes e soluções adequadas a cada aplicação.",
              },
              {
                title: "Otimização",
                description:
                  "Busca por soluções eficientes considerando custos e processos produtivos.",
              },
              {
                title: "Soluções Especiais",
                description:
                  "Desenvolvimento de equipamentos e soluções personalizadas para necessidades específicas.",
              },
            ].map((item) => (
              <article
                key={item.title}
                className="group border border-white/10 bg-[var(--kairos-card)] p-7 transition duration-300 hover:-translate-y-1 hover:border-[var(--kairos-orange)]/60 hover:bg-white/[0.06]"
              >
                <div className="mb-6 h-1 w-10 bg-[var(--kairos-orange)] transition-all duration-300 group-hover:w-16" />

                <h4 className="text-lg font-semibold">{item.title}</h4>

                <p className="mt-4 text-sm leading-7 text-gray-400">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>

        {/* DIFERENCIAL */}
        <div className="mt-28 grid gap-10 border-t border-white/10 pt-20 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--kairos-orange)]">
              Nosso diferencial
            </span>

            <h3 className="mt-4 text-3xl font-bold md:text-4xl">
              Do desenho à execução
            </h3>
          </div>

          <div>
            <p className="text-base leading-8 text-gray-300">
              Um dos principais diferenciais está na capacidade de visualizar o
              projeto desde o desenho até sua execução física, antecipando
              possíveis problemas de fabricação, montagem, funcionamento e
              manutenção ainda durante a etapa de desenvolvimento.
            </p>

            <p className="mt-5 text-base leading-8 text-gray-300">
              O objetivo é desenvolver soluções técnicas eficientes, fabricáveis
              e economicamente viáveis, considerando a realidade do processo
              industrial desde o início do projeto.
            </p>
          </div>
        </div>

        {/* FRASE FINAL */}
        <div className="mt-28 border-l-4 border-[var(--kairos-orange)] bg-[var(--kairos-dark)] px-8 py-12 md:px-12 md:py-16">
          <p className="max-w-4xl text-2xl font-medium leading-relaxed md:text-4xl">
            “Transformar necessidades industriais em soluções técnicas
            eficientes, fabricáveis e economicamente viáveis.”
          </p>

          <div className="mt-8 h-1 w-16 bg-[var(--kairos-orange)]" />

          <p className="mt-5 text-sm uppercase tracking-[0.2em] text-gray-500">
            Kairos Industrial
          </p>
        </div>
      </div>
    </section>
    <Footer />
    </>
  );
}
