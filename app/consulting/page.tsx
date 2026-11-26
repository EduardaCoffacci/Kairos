import Link from "next/link";
import {
  ArrowRight,
  ClipboardCheck,
  Factory,
  Wrench,
  Package,
  Flame,
  Wheat,
  CheckCircle2,
  Search,
  FileText,
  Settings,
} from "lucide-react";

import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";

const servicos = [
  {
    icon: ClipboardCheck,
    titulo: "Consultoria técnica",
    descricao:
      "Visita presencial para conhecer a operação, avaliar os equipamentos e identificar oportunidades de melhoria.",
  },
  {
    icon: Wrench,
    titulo: "Reformas industriais",
    descricao:
      "Realização de reformas e adequações nos equipamentos conforme as necessidades identificadas e aprovadas.",
  },
  {
    icon: Package,
    titulo: "Peças e reposição",
    descricao:
      "Fornecimento de peças e componentes para manutenção e reposição dos equipamentos.",
  },
];

const avaliacoes = [
  {
    icon: Flame,
    titulo: "Sistemas de queima",
    descricao:
      "Avaliação de fornalhas, sistemas de combustão e equipamentos utilizados na queima de biomassa.",
  },
  {
    icon: Wheat,
    titulo: "Secagem de grãos",
    descricao:
      "Análise dos equipamentos e das condições de funcionamento dos sistemas de secagem.",
  },
  {
    icon: Settings,
    titulo: "Equipamentos industriais",
    descricao:
      "Verificação das condições dos equipamentos, componentes e sistemas relacionados à operação.",
  },
];

const etapas = [
  {
    numero: "01",
    icon: Factory,
    titulo: "Contato com a empresa",
    descricao:
      "Você apresenta sua empresa, explica como funciona a operação e informa quais dificuldades ou necessidades deseja avaliar.",
  },
  {
    numero: "02",
    icon: Search,
    titulo: "Visita e avaliação presencial",
    descricao:
      "Nossa equipe vai até a indústria para conhecer os equipamentos, entender o processo e avaliar as condições de funcionamento.",
  },
  {
    numero: "03",
    icon: FileText,
    titulo: "Diagnóstico e proposta",
    descricao:
      "Após a avaliação, identificamos os pontos que precisam de atenção e apresentamos as melhorias, reformas ou peças recomendadas.",
  },
  {
    numero: "04",
    icon: Wrench,
    titulo: "Execução dos serviços",
    descricao:
      "Com a aprovação da proposta, realizamos os serviços contratados e fornecemos os componentes necessários.",
  },
];

export default function ConsultoriaPage() {
  return (
    <>
      <Header />

      <main className="bg-white text-[#222222]">
        {/* APRESENTAÇÃO */}
        <section className="border-b border-gray-200">
          <div className="container-kairos py-20 md:py-24">
            <div className="max-w-4xl">
              <span className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--kairos-orange)]">
                Consultoria industrial
              </span>

              <h1 className="mt-5 text-4xl font-bold leading-tight text-[#171717] md:text-6xl">
                Avaliação técnica, reformas e soluções para sua indústria.
              </h1>

              <p className="mt-7 max-w-3xl text-base leading-8 text-gray-600 md:text-lg">
                A Kairos atende empresas que utilizam sistemas de queima de
                biomassa e secagem de grãos. Realizamos visitas presenciais para
                avaliar equipamentos, identificar necessidades e apresentar
                soluções para melhorar a operação industrial.
              </p>

              <div className="mt-9 flex flex-wrap gap-4">
                <Link
                  href="/contato"
                  className="inline-flex items-center gap-3 rounded bg-[var(--kairos-orange)] px-6 py-4 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Solicitar avaliação
                  <ArrowRight size={18} />
                </Link>

                <a
                  href="#como-funciona"
                  className="inline-flex items-center border border-gray-300 px-6 py-4 text-sm font-semibold text-gray-800 transition hover:border-[var(--kairos-orange)] hover:text-[var(--kairos-orange)]"
                >
                  Conhecer o processo
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* PARA QUEM É */}
        <section className="py-16 md:py-20">
          <div className="container-kairos">
            <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-20">
              <div>
                <span className="text-sm font-semibold uppercase tracking-wider text-[var(--kairos-orange)]">
                  Para quem trabalhamos
                </span>

                <h2 className="mt-4 text-3xl font-bold leading-tight text-[#171717]">
                  Soluções voltadas para quem utiliza biomassa na indústria.
                </h2>
              </div>

              <div className="space-y-5 text-base leading-8 text-gray-600">
                <p>
                  Nosso atendimento é direcionado a indústrias que utilizam
                  fornalhas, caldeiras e sistemas térmicos alimentados por
                  biomassa, como cavaco de madeira e resíduos de milho.
                </p>

                <p>
                  Também atendemos operações que utilizam sistemas de
                  aquecimento em processos de secagem de grãos.
                </p>

                <p>
                  O objetivo é conhecer a realidade de cada empresa, identificar
                  as necessidades dos equipamentos e propor soluções compatíveis
                  com a operação.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* O QUE AVALIAMOS */}
        <section className="border-y border-gray-200 bg-gray-50 py-16 md:py-20">
          <div className="container-kairos">
            <div className="max-w-3xl">
              <span className="text-sm font-semibold uppercase tracking-wider text-[var(--kairos-orange)]">
                Avaliação técnica
              </span>

              <h2 className="mt-4 text-3xl font-bold text-[#171717] md:text-4xl">
                O que avaliamos durante a visita?
              </h2>

              <p className="mt-5 leading-7 text-gray-600">
                Conhecemos o funcionamento da operação e analisamos os
                equipamentos envolvidos no processo.
              </p>
            </div>

            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {avaliacoes.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.titulo}
                    className="border-t border-gray-300 pt-6"
                  >
                    <Icon
                      size={30}
                      className="text-[var(--kairos-orange)]"
                      strokeWidth={1.7}
                    />

                    <h3 className="mt-5 text-xl font-bold text-[#222222]">
                      {item.titulo}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-gray-600">
                      {item.descricao}
                    </p>
                  </article>
                );
              })}
            </div>

            <div className="mt-10 rounded border border-gray-200 bg-white p-6">
              <p className="text-sm leading-7 text-gray-600">
                <strong className="text-[#222222]">Importante:</strong> cada
                avaliação considera as características da empresa, os
                equipamentos utilizados e as necessidades específicas do
                processo.
              </p>
            </div>
          </div>
        </section>

        {/* SERVIÇOS */}
        <section className="py-16 md:py-20">
          <div className="container-kairos">
            <div className="max-w-3xl">
              <span className="text-sm font-semibold uppercase tracking-wider text-[var(--kairos-orange)]">
                Nossos serviços
              </span>

              <h2 className="mt-4 text-3xl font-bold text-[#171717] md:text-4xl">
                Da identificação do problema à solução.
              </h2>

              <p className="mt-5 leading-7 text-gray-600">
                Depois da avaliação, apresentamos as soluções necessárias. A
                Kairos também pode executar as reformas aprovadas e fornecer os
                componentes para reposição.
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {servicos.map((servico) => {
                const Icon = servico.icon;

                return (
                  <article
                    key={servico.titulo}
                    className="rounded border border-gray-200 bg-gray-50 p-7 transition hover:border-[var(--kairos-orange)]"
                  >
                    <Icon
                      size={30}
                      strokeWidth={1.7}
                      className="text-[var(--kairos-orange)]"
                    />

                    <h3 className="mt-5 text-xl font-bold text-[#222222]">
                      {servico.titulo}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-gray-600">
                      {servico.descricao}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* COMO FUNCIONA */}
        <section
          id="como-funciona"
          className="scroll-mt-24 border-y border-gray-200 bg-gray-50 py-16 md:py-24"
        >
          <div className="container-kairos">
            <div className="max-w-3xl">
              <span className="text-sm font-semibold uppercase tracking-wider text-[var(--kairos-orange)]">
                Etapas do atendimento
              </span>

              <h2 className="mt-4 text-3xl font-bold text-[#171717] md:text-4xl">
                Como funciona nosso trabalho?
              </h2>

              <p className="mt-5 leading-7 text-gray-600">
                O atendimento segue quatro etapas, desde o primeiro contato até
                a execução dos serviços aprovados.
              </p>
            </div>

            <div className="mt-12 space-y-0">
              {etapas.map((etapa) => {
                const Icon = etapa.icon;

                return (
                  <article
                    key={etapa.numero}
                    className="grid gap-5 border-t border-gray-300 py-8 md:grid-cols-[70px_65px_1fr] md:items-start md:gap-8"
                  >
                    <span className="text-2xl font-bold text-[var(--kairos-orange)]">
                      {etapa.numero}
                    </span>

                    <div className="flex h-12 w-12 items-center justify-center rounded bg-orange-100 text-[var(--kairos-orange)]">
                      <Icon size={24} />
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-[#222222]">
                        {etapa.titulo}
                      </h3>

                      <p className="mt-3 max-w-3xl leading-7 text-gray-600">
                        {etapa.descricao}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* DIFERENCIAL */}
        <section className="py-16 md:py-20">
          <div className="container-kairos">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <span className="text-sm font-semibold uppercase tracking-wider text-[var(--kairos-orange)]">
                  Nosso compromisso
                </span>

                <h2 className="mt-4 text-3xl font-bold leading-tight text-[#171717] md:text-4xl">
                  Primeiro entendemos a necessidade. Depois apresentamos a
                  solução.
                </h2>
              </div>

              <div>
                <p className="leading-8 text-gray-600">
                  A proposta da Kairos é avaliar cada situação antes de
                  recomendar qualquer intervenção. Assim, a empresa conhece os
                  pontos identificados, as melhorias sugeridas e os serviços
                  propostos antes de aprovar a execução.
                </p>

                <div className="mt-6 space-y-3">
                  {[
                    "Visita presencial à empresa",
                    "Avaliação dos equipamentos",
                    "Apresentação das soluções recomendadas",
                    "Execução mediante aprovação",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <CheckCircle2
                        size={19}
                        className="shrink-0 text-[var(--kairos-orange)]"
                      />
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTATO */}
        <section className="border-t border-gray-200 bg-gray-50 py-16 md:py-20">
          <div className="container-kairos text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-[var(--kairos-orange)]">
              Fale com a Kairos
            </span>

            <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-bold text-[#171717] md:text-4xl">
              Sua indústria utiliza biomassa e precisa avaliar seus
              equipamentos?
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-7 text-gray-600">
              Entre em contato e conte um pouco sobre sua operação. Nossa equipe
              poderá conversar com você sobre a necessidade da sua indústria.
            </p>

            <Link
              href="/contato"
              className="mt-8 inline-flex items-center gap-3 rounded bg-[var(--kairos-orange)] px-7 py-4 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Solicitar atendimento
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
