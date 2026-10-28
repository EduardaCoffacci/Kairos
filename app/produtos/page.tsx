import Image from "next/image";
import Link from "next/link";
import Footer from "@/componentes/Footer/Footer";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";

import Header from "@/componentes/Header/Header";

const caracteristicas = [
  ["Material", "Aço carbono"],
  ["Aplicação", "Recepção e armazenamento de biomassa"],
  ["Alimentação", "Fluxo contínuo de combustível"],
  ["Projeto", "Adaptável à aplicação"],
  ["Integração", "Sistemas de transporte e alimentação"],
  ["Dimensionamento", "Conforme a necessidade do projeto"],
  ["Descarga", "Realizada com rosca dosadora"],
  ["Descarga alternativa", "Realizada através de esteira"],
  ["Controle de volume", "Sensor capacitivo de nível baixo e nível alto"],
  ["Controle de vazão", "Sensor capacitivo de embuchamento"],
  [
    "Temperatura dos rolamentos",
    "Controle realizado por sensor de temperatura",
  ],
  ["Motorização", "Conforme dimensionamento"],
];

export default function ProdutosPage() {
  return (
    <>
      <Header darkText />

      <main className="min-h-screen bg-[#f4f5f8] px-4 pb-16 pt-28 sm:px-6 lg:px-12 lg:pt-40">
        <div className="mx-auto max-w-7xl">
          {/* Navegação */}

          {/* Conteúdo do produto */}
          <div className="grid items-start gap-6 lg:grid-cols-[1.05fr_1fr] lg:gap-8">
            {/* Imagem */}
            <div className="lg:sticky lg:top-28">
              <Paper
                elevation={0}
                sx={{
                  overflow: "hidden",
                  border: "1px solid #e5e7eb",
                  borderRadius: "16px",
                  backgroundColor: "#ffffff",
                }}
              >
                <div className="relative flex min-h-[340px] items-center justify-center p-5 sm:min-h-[480px] sm:p-8">
                  <Image
                    src="/moega.png"
                    alt="Moega industrial para recepção e alimentação de biomassa"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-contain p-5 sm:p-8"
                  />
                </div>

                <div className="border-t border-zinc-200 px-5 py-4">
                  <p className="text-sm font-semibold text-zinc-800">
                    Moega de Recepção
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Equipamento para sistemas industriais de biomassa
                  </p>
                </div>
              </Paper>

              <p className="mt-3 text-xs leading-5 text-zinc-400">
                Imagem ilustrativa. Consulte a equipe para conhecer as
                configurações disponíveis para seu projeto.
              </p>
            </div>

            {/* Informações */}
            <div className="space-y-5">
              <Paper
                elevation={0}
                sx={{
                  overflow: "hidden",
                  border: "1px solid #e5e7eb",
                  borderRadius: "16px",
                }}
              >
                <div className="border-b border-zinc-200 bg-[#e8e9ed] px-5 py-4 sm:px-6">
                  <h2 className="text-sm font-bold text-[#30304b]">
                    Informações do produto
                  </h2>
                </div>

                <div className="p-5 sm:p-6">
                  <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
                    Moega de Recepção
                  </h1>

                  <p className="mt-4 text-sm leading-7 text-zinc-600 sm:text-base">
                    Equipamento destinado à recepção e ao armazenamento de
                    biomassa, auxiliando na alimentação de combustível para
                    sistemas industriais de geração de energia.
                  </p>
                </div>
              </Paper>

              {/* Especificações */}
              <Paper
                elevation={0}
                sx={{
                  overflow: "hidden",
                  border: "1px solid #e5e7eb",
                  borderRadius: "16px",
                }}
              >
                <div className="border-b border-zinc-200 bg-[#e8e9ed] px-5 py-4 sm:px-6">
                  <h2 className="text-sm font-bold text-[#30304b]">
                    Especificações técnicas
                  </h2>
                </div>

                <TableContainer>
                  <Table
                    size="small"
                    aria-label="Especificações técnicas da Moega de Recepção"
                  >
                    <TableBody>
                      {caracteristicas.map(([nome, descricao], index) => (
                        <TableRow
                          key={nome}
                          sx={{
                            backgroundColor:
                              index % 2 === 0 ? "#ffffff" : "#fafafa",
                            "&:last-child td, &:last-child th": {
                              borderBottom: 0,
                            },
                          }}
                        >
                          <TableCell
                            component="th"
                            scope="row"
                            sx={{
                              width: "42%",
                              px: 2.5,
                              py: 1.75,
                              color: "#71717a",
                              fontSize: "0.8rem",
                              fontWeight: 500,
                              borderBottom: "1px solid #eeeeef",
                              verticalAlign: "top",
                            }}
                          >
                            {nome}
                          </TableCell>

                          <TableCell
                            sx={{
                              px: 2.5,
                              py: 1.75,
                              color: "#27272a",
                              fontSize: "0.8rem",
                              fontWeight: 600,
                              lineHeight: 1.6,
                              borderBottom: "1px solid #eeeeef",
                              verticalAlign: "top",
                            }}
                          >
                            {descricao}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <div className="border-t border-zinc-200 bg-zinc-50 px-5 py-4">
                  <p className="text-xs leading-5 text-zinc-500">
                    As características e especificações podem variar conforme os
                    requisitos de cada projeto.
                  </p>
                </div>
              </Paper>

              {/* Solicitação de orçamento */}
              <Paper
                elevation={0}
                sx={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "16px",
                  p: { xs: 2.5, sm: 3 },
                }}
              >
                <h2 className="text-lg font-bold text-zinc-900">
                  Precisa de um projeto sob medida?
                </h2>

                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  Entre em contato com nossa equipe para conversar sobre as
                  necessidades da sua aplicação industrial.
                </p>

                <Link
                  href="/contato"
                  className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-[#e04f11] px-5 py-3 text-center text-sm font-bold text-white no-underline transition-colors hover:bg-[#bd400d] sm:w-auto"
                >
                  Solicitar orçamento
                </Link>
              </Paper>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
