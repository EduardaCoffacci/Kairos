import Header from "@/componentes/Header/Header";
import Footer from "@/componentes/Footer/Footer";

const segmentos = [
  {
    numero: "01",
    titulo: "Agronegócio",
    descricao:
      "Soluções desenvolvidas para atender às necessidades do agronegócio brasileiro.",
  },
  {
    numero: "02",
    titulo: "Secagem de grãos",
    descricao:
      "Tecnologia aplicada para processos de secagem mais eficientes e controlados.",
  },
  {
    numero: "03",
    titulo: "Processos industriais",
    descricao:
      "Soluções térmicas para diferentes aplicações e necessidades industriais.",
  },
  {
    numero: "04",
    titulo: "Energia térmica",
    descricao:
      "Tecnologia para geração e utilização eficiente de energia em processos produtivos.",
  },
];

const state = [
  "Santa Catarina",
  "Paraná",
  "Rio Grande do Sul",
  "São Paulo",
  "Minas Gerais",
  "Goiás",
  "Mato Grosso",
  "Mato Grosso do Sul",
];

export default function ClientesPage() {
  return (
    <>
      <Header />

      <main className="overflow-hidden bg-[var(--kairos-black)] text-white">
        {/* HERO */}
        <section className="relative min-h-[680px] overflow-hidden">
          {/* Elementos decorativos */}
          <div className="absolute -right-40 top-20 h-[500px] w-[500px] rounded-full bg-[var(--kairos-orange)]/5 blur-3xl" />

          <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[var(--kairos-orange)]/40 to-transparent" />

          <div className="relative z-10 mx-auto flex min-h-[680px] max-w-7xl items-center px-6 pb-24 pt-40 lg:px-8">
            <div className="grid w-full items-center gap-16 lg:grid-cols-[1.3fr_0.7fr]">
              <div>
                <div className="mb-7 flex items-center gap-4">
                  <span className="h-px w-12 bg-[var(--kairos-orange)]" />

                  <span className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--kairos-orange)]">
                    Parcerias que fazem a diferença
                  </span>
                </div>

                <h1 className="max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                  Relações que
                  <span className="block text-[var(--kairos-orange)]">
                    geram resultados.
                  </span>
                </h1>

                <p className="mt-8 max-w-2xl text-lg leading-8 text-gray-400 sm:text-xl">
                  Ao longo dos anos, construímos parcerias com empresas que
                  buscam tecnologia, eficiência e soluções confiáveis para seus
                  processos.
                </p>

                <div className="mt-10 flex items-center gap-4">
                  <div className="h-12 w-1 rounded-full bg-[var(--kairos-orange)]" />

                  <p className="text-sm font-medium uppercase tracking-wider text-gray-300">
                    Experiência que se transforma em confiança
                  </p>
                </div>
              </div>

              {/* NÚMERO DE DESTAQUE */}
              <div className="relative">
                <div className="absolute -inset-5 rounded-3xl border border-[var(--kairos-orange)]/10" />

                <div className="relative rounded-3xl border border-white/10 bg-[var(--kairos-card)] p-10 shadow-2xl sm:p-12">
                  <span className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-500">
                    Nossa rede
                  </span>

                  <div className="mt-5">
                    <span className="text-7xl font-bold tracking-tight text-[var(--kairos-orange)] sm:text-8xl">
                      +123
                    </span>
                  </div>

                  <p className="mt-3 text-xl font-semibold text-white">
                    clientes atendidos
                  </p>

                  <div className="mt-8 h-px w-full bg-white/10" />

                  <p className="mt-6 text-sm leading-6 text-gray-400">
                    Empresas que confiaram na Kairos para desenvolver soluções
                    voltadas às suas necessidades.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* INTRODUÇÃO */}
        <section className="border-y border-white/5 bg-[var(--kairos-dark)] px-6 py-24 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <span className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--kairos-orange)]">
                Muito além de clientes
              </span>

              <h2 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl">
                Construímos
                <span className="block text-[var(--kairos-orange)]">
                  parcerias.
                </span>
              </h2>
            </div>

            <div>
              <p className="text-lg leading-8 text-gray-300">
                Para a Kairos, cada projeto representa uma oportunidade de
                desenvolver uma relação duradoura. Entendemos as necessidades
                de cada operação e buscamos entregar soluções que façam sentido
                para a realidade de nossos clientes.
              </p>

              <p className="mt-6 leading-8 text-gray-500">
                Essa proximidade é parte importante da nossa trajetória e
                contribui para que nossas soluções estejam presentes em
                diferentes operações do agronegócio e da indústria brasileira.
              </p>
            </div>
          </div>
        </section>

        {/* NÚMEROS */}
        <section className="bg-[var(--kairos-black)] px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid border-y border-white/10 md:grid-cols-3">
              <div className="border-b border-white/10 px-6 py-12 md:border-b-0 md:border-r md:px-10">
                <span className="text-sm uppercase tracking-[0.2em] text-gray-500">
                  Experiência
                </span>

                <div className="mt-5 text-6xl font-bold text-white">
                  +17
                </div>

                <p className="mt-3 text-gray-400">
                  anos de atuação
                </p>
              </div>

              <div className="border-b border-white/10 px-6 py-12 md:border-b-0 md:border-r md:px-10">
                <span className="text-sm uppercase tracking-[0.2em] text-gray-500">
                  Alcance
                </span>

                <div className="mt-5 text-6xl font-bold text-[var(--kairos-orange)]">
                  +15
                </div>

                <p className="mt-3 text-gray-400">
                  estados atendidos
                </p>
              </div>

              <div className="px-6 py-12 md:px-10">
                <span className="text-sm uppercase tracking-[0.2em] text-gray-500">
                  Projetos
                </span>

                <div className="mt-5 text-6xl font-bold text-white">
                  +310
                </div>

                <p className="mt-3 text-gray-400">
                  projetos realizados
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SEGMENTOS */}
        <section className="bg-[var(--kairos-dark)] px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <span className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--kairos-orange)]">
                Nossa atuação
              </span>

              <h2 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl">
                Soluções presentes em
                <span className="text-[var(--kairos-orange)]">
                  {" "}
                  diferentes segmentos.
                </span>
              </h2>

              <p className="mt-6 max-w-2xl leading-8 text-gray-400">
                Nossa experiência permite atender diferentes operações que
                dependem de soluções eficientes em energia térmica.
              </p>
            </div>

            <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2">
              {segmentos.map((segmento) => (
                <article
                  key={segmento.numero}
                  className="group relative bg-[var(--kairos-card)] p-8 transition duration-300 hover:bg-[#111111] sm:p-10"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-sm font-bold text-[var(--kairos-orange)]">
                      {segmento.numero}
                    </span>

                    <span className="h-2 w-2 rounded-full bg-white/20 transition group-hover:bg-[var(--kairos-orange)]" />
                  </div>

                  <h3 className="mt-14 text-2xl font-bold">
                    {segmento.titulo}
                  </h3>

                  <p className="mt-4 max-w-md leading-7 text-gray-500">
                    {segmento.descricao}
                  </p>

                  <div className="mt-8 h-px w-10 bg-[var(--kairos-orange)] transition-all duration-300 group-hover:w-20" />
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ESTADOS */}
        <section className="bg-[var(--kairos-black)] px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-16 lg:grid-cols-[0.7fr_1.3fr]">
              <div>
                <span className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--kairos-orange)]">
                  Presença nacional
                </span>

                <h2 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl">
                  Onde nossas
                  <span className="block text-[var(--kairos-orange)]">
                    soluções chegam.
                  </span>
                </h2>

                <p className="mt-6 leading-8 text-gray-500">
                  Nossa atuação alcança diferentes regiões do Brasil,
                  conectando tecnologia e experiência às necessidades de cada
                  operação.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {state.map((estado, index) => (
                  <div
                    key={estado}
                    className="group flex items-center justify-between border-b border-white/10 px-2 py-5 transition hover:border-[var(--kairos-orange)]"
                  >
                    <span className="text-gray-300 transition group-hover:text-white">
                      {estado}
                    </span>

                    <span className="text-xs font-semibold text-gray-600 transition group-hover:text-[var(--kairos-orange)]">
                      0{index + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FRASE FINAL */}
        <section className="relative overflow-hidden bg-[var(--kairos-dark)] px-6 py-28 lg:px-8">
          <div className="absolute -bottom-48 -right-48 h-[500px] w-[500px] rounded-full bg-[var(--kairos-orange)]/5 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-5xl text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--kairos-orange)]">
              Próxima parceria
            </span>

            <h2 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Sua empresa pode fazer parte
              <span className="block text-[var(--kairos-orange)]">
                dessa história.
              </span>
            </h2>

            <p className="mx-auto mt-7 max-w-2xl leading-8 text-gray-400">
              Entre em contato com a equipe Kairos e conheça nossas soluções
              para sua operação.
            </p>

            <a
              href="/contato"
              className="mt-10 inline-flex items-center rounded-md bg-[var(--kairos-orange)] px-8 py-4 font-semibold text-white transition hover:bg-[#f15f20]"
            >
              Fale com nossa equipe
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}