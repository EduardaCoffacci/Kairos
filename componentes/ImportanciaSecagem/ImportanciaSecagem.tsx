
export default function ImportanciaSecagem() {
  return (
    <section
      id="importancia"
      className="relative overflow-hidden bg-[var(--kairos-black)] px-6 py-24 text-white md:py-32"
    >
      <div className="mx-auto max-w-7xl">
        {/* CABEÇALHO DIFERENCIADO */}
        <div className="grid gap-8 border-b border-white/10 pb-12 md:grid-cols-[1fr_280px] md:items-end md:pb-16">
          <div>
            <span className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--kairos-orange)]">
              Eficiência no processo
            </span>

            <h2 className="mt-6 max-w-4xl text-4xl font-bold leading-tight md:text-6xl lg:text-7xl">
              O valor de uma
              <span className="block text-[var(--kairos-orange)]">
                secagem bem feita.
              </span>
            </h2>
          </div>

          <div className="md:border-l md:border-white/20 md:pb-2 md:pl-6">
            <p className="text-base leading-7 text-gray-400">
              Mais do que retirar a umidade, é uma etapa essencial para
              preservar a qualidade e a conservação dos grãos.
            </p>

            <div className="mt-5 h-1 w-12 bg-[var(--kairos-orange)]" />
          </div>
        </div>

        {/* CONTEÚDO PRINCIPAL */}
        <div className="mt-16 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch lg:gap-14">
          {/* TEXTO */}
          <div className="flex flex-col justify-center border-l-2 border-[var(--kairos-orange)] pl-6 md:pl-10">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
              Qualidade em cada etapa
            </span>

            <h3 className="mt-5 text-2xl font-semibold leading-snug md:text-3xl">
              Preservar a produção começa com uma secagem eficiente.
            </h3>

            <p className="mt-7 text-base leading-8 text-gray-300 md:text-lg">
              A secagem é uma das fases mais importantes do processo de
              pós-colheita. Quando realizada adequadamente, contribui para
              conservar a qualidade dos grãos, controlar a umidade e manter
              as condições necessárias para o armazenamento.
            </p>

            <p className="mt-5 text-base leading-8 text-gray-400 md:text-lg">
              Processos inadequados podem provocar perdas de qualidade,
              reduzir o valor comercial da produção e comprometer sua
              conservação. Por isso, contar com equipamentos e sistemas
              de secagem adequados é fundamental para buscar eficiência,
              segurança e melhores resultados operacionais.
            </p>
          </div>

          {/* DESTAQUES */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <article className="group border border-white/10 bg-[var(--kairos-card)] p-7 transition duration-300 hover:border-[var(--kairos-orange)]/60 md:p-9">
              <div className="mb-5 h-1 w-10 bg-[var(--kairos-orange)] transition-all duration-300 group-hover:w-16" />

              <h4 className="text-xl font-semibold">
                Preservação da qualidade
              </h4>

              <p className="mt-3 text-sm leading-7 text-gray-400 md:text-base">
                Controle adequado da umidade para favorecer a conservação
                e preservar as características dos grãos.
              </p>
            </article>

            <article className="group border border-white/10 bg-[var(--kairos-card)] p-7 transition duration-300 hover:border-[var(--kairos-orange)]/60 md:p-9">
              <div className="mb-5 h-1 w-10 bg-[var(--kairos-orange)] transition-all duration-300 group-hover:w-16" />

              <h4 className="text-xl font-semibold">
                Redução de perdas
              </h4>

              <p className="mt-3 text-sm leading-7 text-gray-400 md:text-base">
                Um processo bem dimensionado ajuda a evitar perdas
                relacionadas à umidade e ao armazenamento inadequado.
              </p>
            </article>

            <article className="group border border-white/10 bg-[var(--kairos-card)] p-7 transition duration-300 hover:border-[var(--kairos-orange)]/60 sm:col-span-2 lg:col-span-1 md:p-9">
              <div className="mb-5 h-1 w-10 bg-[var(--kairos-orange)] transition-all duration-300 group-hover:w-16" />

              <h4 className="text-xl font-semibold">
                Eficiência operacional
              </h4>

              <p className="mt-3 text-sm leading-7 text-gray-400 md:text-base">
                Soluções adequadas às necessidades da operação contribuem
                para um processo mais controlado e eficiente.
              </p>
            </article>
          </div>
        </div>

        {/* FRASE DE DESTAQUE */}
        <div className="mt-20 border-t border-white/10 pt-10 md:mt-24 md:pt-14">
          <p className="max-w-4xl text-2xl font-medium leading-relaxed md:text-4xl">
            Eficiência na secagem significa mais controle sobre a qualidade
            e a conservação da produção.
          </p>

          <div className="mt-7 h-1 w-16 bg-[var(--kairos-orange)]" />
        </div>
      </div>
    </section>
  );
}
