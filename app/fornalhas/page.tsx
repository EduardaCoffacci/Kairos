import Image from "next/image";
import Header from "@/componentes/Header/Header";
import Footer from "@/componentes/Footer/Footer";

const applications = [
  {
    title: "Caldeiras",
    description:
      "Soluções desenvolvidas para aplicações de geração de vapor e processos térmicos industriais.",
  },
  {
    title: "Secadores",
    description:
      "Aplicações que exigem fornecimento contínuo e controlado de energia térmica.",
  },
  {
    title: "Processos industriais",
    description:
      "Equipamentos pensados para diferentes necessidades de aquecimento e processos térmicos.",
  },
];

const differentials = [
  {
    number: "01",
    title: "Projeto personalizado",
    description:
      "Soluções desenvolvidas de acordo com as características e necessidades de cada aplicação.",
  },
  {
    number: "02",
    title: "Eficiência térmica",
    description:
      "Projetos pensados para proporcionar um aproveitamento adequado da energia no processo.",
  },
  {
    number: "03",
    title: "Robustez",
    description:
      "Equipamentos preparados para atender às exigências dos ambientes industriais.",
  },
  {
    number: "04",
    title: "Suporte técnico",
    description:
      "Acompanhamento especializado durante as etapas do projeto e implantação.",
  },
];

export default function FornalhasPage() {
  return (
    <>
      <Header />

      <main className="bg-black text-white">
        {/* HERO */}
        <section className="relative min-h-[700px] overflow-hidden">
          {/* Imagem de fundo */}

          {/*  <Image
          src={}
          alt="Fornalha industrial"
          fill
          priority
          className="object-cover"
        />*/}

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/70" />

          {/* Gradiente */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />

          <div className="relative z-10 mx-auto flex min-h-[700px] max-w-7xl items-center pt-50 px-6 py-24 lg:px-8">
            <div className="max-w-3xl">
              <span className="mb-5 inline-block border-l-4 border-[var(--kairos-orange)] pl-4 text-sm font-semibold uppercase tracking-[0.25em] text-[var(--kairos-orange)]">
                Soluções térmicas industriais
              </span>

              <h1 className="text-4xl font-bold leading-tight md:text-5xl">
                FORNALHAS
                <span className="block text-[var(--kairos-orange)]">
                  INDUSTRIAIS
                </span>
              </h1>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-300 md:text-xl">
                Soluções robustas e eficientes para processos industriais que
                exigem desempenho, confiabilidade e controle térmico.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="/contato"
                  className="rounded-md bg-[var(--kairos-orange)] px-7 py-4 font-semibold transition hover:bg-[#f15f20]"
                >
                  Solicitar orçamento
                </a>

                <a
                  href="#solucoes"
                  className="rounded-md border border-white/30 px-7 py-4 font-semibold transition hover:border-[var(--kairos-orange)] hover:text-[var(--kairos-orange)]"
                >
                  Conheça nossas soluções
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* INTRODUÇÃO */}
        <section className="bg-[var(--kairos-black)] px-6 py-24 lg:px-8">
          <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
            <div>
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--kairos-orange)]">
                Engenharia e desempenho
              </span>

              <h2 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
                Fornalhas desenvolvidas para
                <span className="text-[var(--kairos-orange)]">
                  {" "}
                  sua operação
                </span>
              </h2>

              <p className="mt-6 leading-8 text-gray-400">
                Cada processo industrial possui necessidades específicas. Por
                isso, as soluções em fornalhas devem considerar fatores como
                combustível, capacidade térmica, processo produtivo e condições
                de operação.
              </p>

              <p className="mt-5 leading-8 text-gray-400">
                A Kairos trabalha com soluções voltadas às necessidades de cada
                aplicação, buscando unir desempenho, segurança e confiabilidade.
              </p>
            </div>

            <div className="relative h-[450px] overflow-hidden rounded-2xl">
              <Image
                src=""
                alt="Equipamento industrial"
                fill
                className="object-cover transition duration-700 hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

              <div className="absolute bottom-6 left-6">
                <p className="text-sm uppercase tracking-widest text-[var(--kairos-orange)]">
                  Kairos Indústria
                </p>

                <p className="mt-1 text-xl font-semibold">
                  Soluções para processos térmicos
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SOLUÇÕES */}
        <section id="solucoes" className="bg-[#080808] px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--kairos-orange)]">
                Nossas soluções
              </span>

              <h2 className="mt-4 text-4xl font-bold md:text-5xl">
                Aplicações das nossas
                <span className="text-[var(--kairos-orange)]">
                  {" "}
                  fornalhas
                </span>
              </h2>

              <p className="mt-5 leading-8 text-gray-400">
                Soluções destinadas a diferentes processos que dependem de
                geração e transferência de energia térmica.
              </p>
            </div>

            <div className="mt-14 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {applications.map((application) => (
                <article
                  key={application.title}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-[#101010] transition duration-300 hover:-translate-y-2 hover:border-[var(--kairos-orange)]/60"
                >
                  <div className="relative h-64 overflow-hidden">
                    {/*   <Image
                    src={}
                    alt={}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-110"
                  /> Placeholder for image */}

                    <div className="absolute inset-0 bg-black/30 transition group-hover:bg-black/10" />
                  </div>

                  <div className="p-7">
                    <h3 className="text-2xl font-bold">
                      {application.title}
                    </h3>

                    <p className="mt-4 leading-7 text-gray-400">
                      {application.description}
                    </p>

                    <div className="mt-6 h-[2px] w-12 bg-[var(--kairos-orange)] transition-all duration-300 group-hover:w-20" />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* DESTAQUE VISUAL */}
        <section className="relative overflow-hidden py-28">
          {/* <Image
          src=""
          alt="Processo industrial"
          fill
          className="object-cover"
        /> Imagem de fundo */}

          <div className="absolute inset-0 bg-black/75" />

          <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--kairos-orange)]">
                Desempenho industrial
              </span>

              <h2 className="mt-5 text-4xl font-bold md:text-6xl">
                Potência que transforma
                <span className="block text-[var(--kairos-orange)]">
                  processos
                </span>
              </h2>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-300">
                Uma solução térmica precisa entregar muito mais do que
                temperatura. Ela precisa fazer parte de um processo confiável,
                seguro e eficiente.
              </p>
            </div>

            <div className="mt-14 grid gap-5 sm:grid-cols-3">
              <div className="border border-white/20 bg-black/40 p-7 backdrop-blur-sm">
                <p className="text-4xl font-bold text-[var(--kairos-orange)]">
                  +
                </p>
                <p className="mt-2 text-lg font-semibold">Eficiência</p>
              </div>

              <div className="border border-white/20 bg-black/40 p-7 backdrop-blur-sm">
                <p className="text-4xl font-bold text-[var(--kairos-orange)]">
                  +
                </p>
                <p className="mt-2 text-lg font-semibold">Segurança</p>
              </div>

              <div className="border border-white/20 bg-black/40 p-7 backdrop-blur-sm">
                <p className="text-4xl font-bold text-[var(--kairos-orange)]">
                  +
                </p>
                <p className="mt-2 text-lg font-semibold">Confiabilidade</p>
              </div>
            </div>
          </div>
        </section>

        {/* DIFERENCIAIS */}
        <section className="bg-black px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--kairos-orange)]">
                  Diferenciais
                </span>

                <h2 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
                  Uma solução pensada para o seu processo
                </h2>

                <p className="mt-6 leading-8 text-gray-400">
                  Do projeto à aplicação, cada detalhe pode fazer diferença no
                  desempenho de uma solução industrial.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {differentials.map((item) => (
                  <div
                    key={item.number}
                    className="rounded-xl border border-white/10 bg-[var(--kairos-card)] p-7 transition hover:border-[var(--kairos-orange)]/60"
                  >
                    <span className="text-sm font-bold text-[var(--kairos-orange)]">
                      {item.number}
                    </span>

                    <h3 className="mt-4 text-xl font-bold">{item.title}</h3>

                    <p className="mt-3 leading-7 text-gray-400">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden bg-[var(--kairos-dark)] px-6 py-24 lg:px-8">
          <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-[var(--kairos-orange)]/10 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-5xl text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--kairos-orange)]">
              Fale com a Kairos
            </span>

            <h2 className="mt-5 text-4xl font-bold md:text-6xl">
              Precisa de uma solução
              <span className="block text-[var(--kairos-orange)]">
                em fornalhas?
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl leading-8 text-gray-400">
              Nossa equipe está pronta para entender sua necessidade e encontrar
              uma solução adequada para o seu processo industrial.
            </p>

            <a
              href="/contato"
              className="mt-9 inline-block rounded-md bg-[var(--kairos-orange)] px-8 py-4 font-semibold transition hover:bg-[#f15f20]"
            >
              Solicitar orçamento
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}