import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import Button from "@/components/button/Button";
import { ArrowRight } from "lucide-react";

const products = [
  {
    number: "01",
    name: "Moega de Recepção",
    description:
      "Equipamento destinado ao recebimento e armazenamento temporário de biomassa, direcionando o material para os sistemas de transporte e alimentação da indústria.",
    features: [
      "Recebimento de cavacos, serragem e outros materiais a granel.",
      "Armazenamento temporário de biomassa.",
      "Descarga por sistema de extração.",
      "Integração com roscas e transportadores.",
      "Configuração adaptável ao espaço de instalação.",
    ],
  },
  {
    number: "02",
    name: "Transportador de Correia",
    description:
      "Sistema utilizado para transportar materiais a granel de forma contínua entre diferentes etapas do processo industrial, facilitando a movimentação de biomassa.",
    features: [
      "Transporte contínuo de biomassa e materiais sólidos.",
      "Movimentação horizontal ou inclinada, conforme projeto.",
      "Estrutura de sustentação metálica.",
      "Integração com moegas, silos e outros equipamentos.",
      "Dimensionamento conforme o material e o percurso.",
    ],
  },
  {
    number: "03",
    name: "Peneira de Disco",
    description:
      "Equipamento destinado à classificação granulométrica de biomassa, separando materiais conforme suas dimensões e características físicas.",
    features: [
      "Classificação de cavacos e resíduos de madeira.",
      "Separação de partículas por tamanho.",
      "Sistema de discos rotativos.",
      "Auxilia na padronização do material.",
      "Integração com linhas de transporte e processamento.",
    ],
  },
  {
    number: "04",
    name: "Rosca Transportadora",
    description:
      "Equipamento utilizado para movimentar e dosar materiais a granel por meio de um eixo com hélice helicoidal em rotação.",
    features: [
      "Transporte de biomassa e materiais particulados.",
      "Movimentação controlada do material.",
      "Alimentação de fornalhas e outros equipamentos.",
      "Possibilidade de instalação horizontal ou inclinada.",
      "Integração com moegas e silos.",
    ],
  },
  {
    number: "05",
    name: "Silo Pulmão",
    description:
      "Equipamento destinado ao armazenamento intermediário de biomassa, mantendo uma reserva de material para alimentar continuamente os processos industriais.",
    features: [
      "Armazenamento temporário de biomassa.",
      "Abastecimento controlado dos equipamentos.",
      "Integração com sistemas de extração.",
      "Possibilidade de alimentação por roscas transportadoras.",
      "Capacidade definida conforme a necessidade do processo.",
    ],
  },
  {
    number: "06",
    name: "Fornalha",
    description:
      "Equipamento desenvolvido para realizar a combustão de biomassa e gerar energia térmica para processos industriais, como sistemas de secagem e aquecimento.",
    features: [
      "Utilização de biomassa como combustível.",
      "Geração de energia térmica.",
      "Sistema de alimentação de combustível.",
      "Distribuição de ar para o processo de combustão.",
      "Integração com sistemas de secagem e equipamentos térmicos.",
    ],
  },
  {
    number: "07",
    name: "Ciclone Separador de Partículas",
    description:
      "Equipamento utilizado para separar partículas sólidas transportadas por uma corrente de ar ou gases, utilizando o movimento circular do fluxo para favorecer a separação.",
    features: [
      "Separação de partículas sólidas.",
      "Funcionamento baseado na força centrífuga.",
      "Aplicação em sistemas de exaustão.",
      "Coleta de partículas na parte inferior do equipamento.",
      "Integração com ventiladores e dutos industriais.",
    ],
  },
  {
    number: "08",
    name: "Ventilador Centrífugo",
    description:
      "Equipamento utilizado para movimentar ar ou gases em instalações industriais, contribuindo para a ventilação, exaustão e circulação de ar nos processos produtivos.",
    features: [
      "Movimentação de ar e gases.",
      "Aplicação em sistemas de ventilação e exaustão.",
      "Utilização em processos de secagem e combustão.",
      "Integração com dutos e equipamentos industriais.",
      "Dimensionamento conforme vazão e pressão necessárias.",
    ],
  },
];

export default function ProductsPage() {
  return (
    <>
      <Header darkText />

      <main className="min-h-screen bg-[#f4f5f8] pb-20 pt-28 lg:pt-40">
        {/* HERO SECTION */}
        <section aria-labelledby="products-title" className="container-kairos">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <span className="mb-5 inline-flex items-center gap-3 text-sm font-bold uppercase tracking-[0.2em] text-[var(--kairos-orange)]">
                <span
                  aria-hidden="true"
                  className="h-[2px] w-8 bg-[var(--kairos-orange)]"
                />
                Soluções industriais
              </span>

              <h1
                id="products-title"
                className="text-4xl font-extrabold leading-tight text-[var(--kairos-black)] sm:text-5xl lg:text-6xl"
              >
                Equipamentos para
                <span className="text-[var(--kairos-orange)]">
                  {" "}
                  processos industriais
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-gray-700">
                A Kairos oferece soluções em equipamentos industriais voltados
                ao recebimento, transporte, armazenamento e processamento de
                biomassa, contribuindo para a eficiência e integração dos
                processos produtivos.
              </p>

              <Button href="/contact" className="mt-4" variant="primary">
                Solicitar orçamento
                <ArrowRight size={18} />
              </Button>
            </div>

            {/* HERO IMAGE */}
            <div className="min-w-0">
              <Image
                src="/linha-completa.png"
                alt="Linha completa de equipamentos industriais da Kairos"
                width={612}
                height={408}
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="h-auto w-full object-contain"
              />
            </div>
          </div>
        </section>

        {/* CATALOG SECTION */}
        <section
          aria-labelledby="catalog-title"
          className="container-kairos mt-24 lg:mt-32"
        >
          <div className="mb-12 max-w-3xl">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--kairos-orange)]">
              Nosso catálogo
            </span>

            <h2
              id="catalog-title"
              className="mt-3 text-3xl font-extrabold text-[var(--kairos-black)] sm:text-4xl"
            >
              Conheça nossos equipamentos
            </h2>

            <p className="mt-5 leading-8 text-gray-700">
              Desenvolvidos para atender diferentes necessidades da indústria,
              nossos equipamentos participam de etapas fundamentais da
              movimentação, preparação e utilização de biomassa.
            </p>
          </div>

          {/* PRODUCT LIST */}
          <div className="space-y-6">
            {products.map((product) => (
              <article
                key={product.number}
                aria-labelledby={`product-${product.number}-title`}
                className="grid gap-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm motion-safe:transition-colors motion-safe:duration-300 hover:border-[var(--kairos-orange)]/60 motion-reduce:transition-none sm:p-8 lg:grid-cols-[100px_1fr] lg:gap-10"
              >
                <div className="flex items-start">
                  <span
                    aria-hidden="true"
                    className="text-4xl font-extrabold text-[var(--kairos-orange)]"
                  >
                    {product.number}
                  </span>
                </div>

                <div className="min-w-0">
                  <h3
                    id={`product-${product.number}-title`}
                    className="text-2xl font-bold text-[var(--kairos-black)]"
                  >
                    {product.name}
                  </h3>

                  <p className="mt-4 max-w-4xl leading-8 text-gray-700">
                    {product.description}
                  </p>

                  <div className="mt-7 border-t border-gray-200 pt-6">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--kairos-black)]">
                      Características
                    </h4>

                    <ul className="mt-5 grid gap-x-10 gap-y-4 sm:grid-cols-2">
                      {product.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-3 text-sm leading-6 text-gray-700"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--kairos-orange)]"
                          />

                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section
          aria-labelledby="products-cta-title"
          className="container-kairos mt-20 lg:mt-28"
        >
          <div className="rounded-xl bg-[var(--kairos-black)] px-7 py-12 text-center text-white sm:px-12 sm:py-16">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--kairos-orange)]">
              Fale com nossa equipe
            </span>

            <h2
              id="products-cta-title"
              className="mx-auto mt-4 max-w-3xl text-3xl font-extrabold sm:text-4xl"
            >
              Encontre a solução ideal para o seu processo industrial
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-8 text-gray-300">
              Entre em contato com a Kairos e conheça as possibilidades para o
              seu projeto.
            </p>

            <Button href="/contact" variant="primary" className="mt-12">
              Entre em contato
              <ArrowRight size={18} />
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
