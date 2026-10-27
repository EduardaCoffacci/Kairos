import Image from "next/image";
import Footer from "@/componentes/Footer/Footer";
import Header from "@/componentes/Header/Header";

export default function ProdutosPage() {
  return (
    <>
      <Header darkText />
      <section
        id="moega"
        className="bg-white px-4 pt-32 pb-16 sm:px-6 lg:px-12 lg:pt-40 lg:pb-24"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Imagem da Moega */}
          <div className="relative min-h-[320px] overflow-hidden rounded-2xl sm:min-h-[420px]">
            <Image
              src="/moega.png"
              alt="Moega industrial para recepção e alimentação de biomassa"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className=" object-contain"
            />
          </div>

          {/* Descrição técnica */}

          <div>
            <span className="mb-4 inline-block text-sm font-bold uppercase tracking-[0.2em] text-[#e04f11]">
              Equipamentos industriais
            </span>

            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl">
              Moega de Recepção
            </h2>

            <p className="mt-6 text-base leading-8 text-zinc-600">
              Equipamento destinado à recepção e ao armazenamento de biomassa,
              auxiliando na alimentação de combustível para sistemas industriais
              de geração de energia.
            </p>

            <h3 className="mt-8 mb-4 text-lg font-semibold text-zinc-900">
              Características técnicas
            </h3>

            <div className="overflow-hidden rounded-xl border border-zinc-200">
              <table className="w-full border-collapse text-left">
                <tbody>
                  {[
                    ["Material", "Aço carbono"],
                    ["Aplicação", "Recepção e armazenamento de biomassa"],
                    ["Alimentação", "Fluxo contínuo de combustível"],
                    ["Projeto", "Adaptável à aplicação"],
                    ["Integração", "Sistemas de transporte e alimentação"],
                    ["Dimensionamento", "Conforme a necessidade do projeto"],
                  ].map(([caracteristica, descricao], index) => (
                    <tr
                      key={caracteristica}
                      className={index % 2 === 0 ? "bg-zinc-50" : "bg-white"}
                    >
                      <th className="w-[38%] border-b border-r border-zinc-200 px-4 py-4 text-sm font-semibold text-zinc-800 sm:px-5">
                        {caracteristica}
                      </th>

                      <td className="border-b border-zinc-200 px-4 py-4 text-sm leading-6 text-zinc-600 sm:px-5">
                        {descricao}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-3 text-xs leading-5 text-zinc-400">
              As características e especificações podem variar conforme os
              requisitos de cada projeto.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
