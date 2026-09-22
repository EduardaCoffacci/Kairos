import React from "react";

export default function ImportanciaSecagem() {
  return (
    <section id="importancia" className="relative overflow-hidden bg-[#f8f9fa] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      
      {/* Conteúdo */}
      <div className="relative z-10 mx-auto max-w-[1200px]">

        {/* Ícone */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#e5ebe8] shadow-md sm:h-[82px] sm:w-[82px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-10 w-10 text-[#398263]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4"
            />
            <circle cx="12" cy="12" r="9" />
          </svg>
        </div>

        {/* Título */}
        <h2 className="text-center text-[34px] font-bold leading-tight text-[#252731] sm:text-[44px] md:text-[52px] lg:text-[58px]">
          A importância da secagem de grãos
        </h2>

        {/* Linha decorativa */}
        <div className="mt-7 flex items-center justify-center gap-2">
          <span className="h-[4px] w-12 rounded-full bg-[#e04f11]"></span>
          <span className="h-[4px] w-16 rounded-full bg-[#398263]"></span>
          <span className="h-[4px] w-12 rounded-full bg-[#e04f11]"></span>
        </div>

        {/* Subtítulo */}
        <h3 className="mt-8 text-center text-[22px] font-bold leading-snug text-[#e04f11] sm:text-[27px] md:text-[30px]">
          Uma etapa decisiva para a qualidade e valorização da produção
        </h3>

        {/* Card */}
        <div className="mt-14 rounded-xl bg-white px-7 py-9 shadow-[0_15px_40px_rgba(0,0,0,0.12)] sm:px-10 sm:py-12 md:px-16 md:py-14 lg:mt-16">

          {/* Texto principal */}
          <p className="text-[18px] leading-relaxed text-[#292c35] sm:text-[20px] md:text-[23px]">
            A secagem é uma das fases mais importantes do processo de
            pós-colheita. É ela que garante que todo o esforço do campo se
            traduza em{" "}
            
            <span className="rounded bg-[#f1e8e9] px-1 font-bold text-[#e04f11]">
              qualidade, rentabilidade e segurança alimentar
            </span>
            .
          </p>

          {/* Linha interna */}
          <div className="mt-7 h-[4px] w-16 rounded-full bg-gradient-to-r from-[##e04f11] to-[#398263]"></div>

          {/* Segundo texto */}
          <p className="mt-7 text-[17px] leading-relaxed text-[#687d9a] sm:text-[19px] md:text-[21px]">
            Quando realizada de forma inadequada, a secagem pode comprometer
            toda a produção — afetando diretamente o valor comercial, a
            durabilidade e até a segurança do alimento. Por isso, investir em
            eficiência e controle nesse processo é essencial para quem busca
            resultados consistentes e sustentáveis.
          </p>

        </div>
      </div>
    </section>
  );
}