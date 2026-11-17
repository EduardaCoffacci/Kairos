import Image from "next/image";
import Link from "next/link";
import Footer from "@/componentes/Footer/Footer";
import Header from "@/componentes/Header/Header";

const produtos = [
  {
    numero: "01",
    nome: "Moega de Recepção",
    descricao:
      "Equipamento destinado ao recebimento e armazenamento temporário de biomassa, direcionando o material para os sistemas de transporte e alimentação da indústria.",
    caracteristicas: [
      "Recebimento de cavacos, serragem e outros materiais a granel.",
      "Armazenamento temporário de biomassa.",
      "Descarga por sistema de extração.",
      "Integração com roscas e transportadores.",
      "Configuração adaptável ao espaço de instalação.",
    ],
  },
  {
    numero: "02",
    nome: "Transportador de Correia",
    descricao:
      "Sistema utilizado para transportar materiais a granel de forma contínua entre diferentes etapas do processo industrial, facilitando a movimentação de biomassa.",
    caracteristicas: [
      "Transporte contínuo de biomassa e materiais sólidos.",
      "Movimentação horizontal ou inclinada, conforme projeto.",
      "Estrutura de sustentação metálica.",
      "Integração com moegas, silos e outros equipamentos.",
      "Dimensionamento conforme o material e o percurso.",
    ],
  },
  {
    numero: "03",
    nome: "Peneira de Disco",
    descricao:
      "Equipamento destinado à classificação granulométrica de biomassa, separando materiais conforme suas dimensões e características físicas.",
    caracteristicas: [
      "Classificação de cavacos e resíduos de madeira.",
      "Separação de partículas por tamanho.",
      "Sistema de discos rotativos.",
      "Auxilia na padronização do material.",
      "Integração com linhas de transporte e processamento.",
    ],
  },
  {
    numero: "04",
    nome: "Rosca Transportadora",
    descricao:
      "Equipamento utilizado para movimentar e dosar materiais a granel por meio de um eixo com hélice helicoidal em rotação.",
    caracteristicas: [
      "Transporte de biomassa e materiais particulados.",
      "Movimentação controlada do material.",
      "Alimentação de fornalhas e outros equipamentos.",
      "Possibilidade de instalação horizontal ou inclinada.",
      "Integração com moegas e silos.",
    ],
  },
  {
    numero: "05",
    nome: "Silo Pulmão",
    descricao:
      "Equipamento destinado ao armazenamento intermediário de biomassa, mantendo uma reserva de material para alimentar continuamente os processos industriais.",
    caracteristicas: [
      "Armazenamento temporário de biomassa.",
      "Abastecimento controlado dos equipamentos.",
      "Integração com sistemas de extração.",
      "Possibilidade de alimentação por roscas transportadoras.",
      "Capacidade definida conforme a necessidade do processo.",
    ],
  },
  {
    numero: "06",
    nome: "Fornalha",
    descricao:
      "Equipamento desenvolvido para realizar a combustão de biomassa e gerar energia térmica para processos industriais, como sistemas de secagem e aquecimento.",
    caracteristicas: [
      "Utilização de biomassa como combustível.",
      "Geração de energia térmica.",
      "Sistema de alimentação de combustível.",
      "Distribuição de ar para o processo de combustão.",
      "Integração com sistemas de secagem e equipamentos térmicos.",
    ],
  },
  {
    numero: "07",
    nome: "Ciclone Separador de Partículas",
    descricao:
      "Equipamento utilizado para separar partículas sólidas transportadas por uma corrente de ar ou gases, utilizando o movimento circular do fluxo para favorecer a separação.",
    caracteristicas: [
      "Separação de partículas sólidas.",
      "Funcionamento baseado na força centrífuga.",
      "Aplicação em sistemas de exaustão.",
      "Coleta de partículas na parte inferior do equipamento.",
      "Integração com ventiladores e dutos industriais.",
    ],
  },
  {
    numero: "08",
    nome: "Ventilador Centrífugo",
    descricao:
      "Equipamento utilizado para movimentar ar ou gases em instalações industriais, contribuindo para a ventilação, exaustão e circulação de ar nos processos produtivos.",
    caracteristicas: [
      "Movimentação de ar e gases.",
      "Aplicação em sistemas de ventilação e exaustão.",
      "Utilização em processos de secagem e combustão.",
      "Integração com dutos e equipamentos industriais.",
      "Dimensionamento conforme vazão e pressão necessárias.",
    ],
  },
];

export default function ProdutosPage() {
  return (
    <>
      <Header darkText />

      <main className="min-h-screen bg-[#f4f5f8] pb-20 pt-28 lg:pt-40">
        {/* APRESENTAÇÃO */}
        <section className="container-kairos">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <span className="mb-5 inline-flex items-center gap-3 text-sm font-bold uppercase tracking-[0.2em] text-[var(--kairos-orange)]">
                <span className="h-[2px] w-8 bg-[var(--kairos-orange)]" />
                Soluções industriais
              </span>

              <h1 className="text-4xl font-extrabold leading-tight text-[var(--kairos-black)] sm:text-5xl lg:text-6xl">
                Equipamentos para
                <span className="text-[var(--kairos-orange)]">
                  {" "}
                  processos industriais
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-gray-600">
                A Kairos oferece soluções em equipamentos industriais voltados
                ao recebimento, transporte, armazenamento e processamento de
                biomassa, contribuindo para a eficiência e integração dos
                processos produtivos.
              </p>

              <Link
                href="/contato"
                className="mt-8 inline-flex items-center gap-3 rounded-md bg-[var(--kairos-orange)] px-7 py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:brightness-90"
              >
                Solicitar orçamento
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            {/* ÚNICA IMAGEM DA PÁGINA */}
            <div className="min-w-0">
              <Image
                src="/linha-completa.png"
                alt="Linha completa de equipamentos industriais da Kairos"
                width={612}
                height={408}
                priority
                className="h-auto w-full object-contain"
              />
            </div>
          </div>
        </section>

        {/* INTRODUÇÃO AO CATÁLOGO */}
        <section className="container-kairos mt-24 lg:mt-32">
          <div className="mb-12 max-w-3xl">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--kairos-orange)]">
              Nosso catálogo
            </span>

            <h2 className="mt-3 text-3xl font-extrabold text-[var(--kairos-black)] sm:text-4xl">
              Conheça nossos equipamentos
            </h2>

            <p className="mt-5 leading-8 text-gray-600">
              Desenvolvidos para atender diferentes necessidades da indústria,
              nossos equipamentos participam de etapas fundamentais da
              movimentação, preparação e utilização de biomassa.
            </p>
          </div>

          {/* LISTA DE PRODUTOS */}
          <div className="space-y-6">
            {produtos.map((produto) => (
              <article
                key={produto.numero}
                className="grid gap-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-[var(--kairos-orange)]/40 sm:p-8 lg:grid-cols-[100px_1fr] lg:gap-10"
              >
                <div className="flex items-start">
                  <span className="text-4xl font-extrabold text-[var(--kairos-orange)]/70">
                    {produto.numero}
                  </span>
                </div>

                <div className="min-w-0">
                  <h3 className="text-2xl font-bold text-[var(--kairos-black)]">
                    {produto.nome}
                  </h3>

                  <p className="mt-4 max-w-4xl leading-8 text-gray-600">
                    {produto.descricao}
                  </p>

                  <div className="mt-7 border-t border-gray-100 pt-6">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--kairos-black)]">
                      Características
                    </h4>

                    <ul className="mt-5 grid gap-x-10 gap-y-4 sm:grid-cols-2">
                      {produto.caracteristicas.map((caracteristica) => (
                        <li
                          key={caracteristica}
                          className="flex items-start gap-3 text-sm leading-6 text-gray-600"
                        >
                          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--kairos-orange)]" />
                          {caracteristica}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* CHAMADA FINAL */}
        <section className="container-kairos mt-20 lg:mt-28">
          <div className="rounded-xl bg-[var(--kairos-black)] px-7 py-12 text-center text-white sm:px-12 sm:py-16">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--kairos-orange)]">
              Fale com nossa equipe
            </span>

            <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-extrabold sm:text-4xl">
              Encontre a solução ideal para o seu processo industrial
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-8 text-gray-300">
              Entre em contato com a Kairos e conheça as possibilidades para o
              seu projeto.
            </p>

            <Link
              href="/contato"
              className="mt-8 inline-flex items-center gap-3 rounded-md bg-[var(--kairos-orange)] px-8 py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:brightness-90"
            >
              Entre em contato
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
