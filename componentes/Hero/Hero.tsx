import React from "react";


export default function Hero() {
  return (
    <section className="relative min-h-screen pt-[80px] text-white">
      {/* Conteúdo da Hero */}
      <div className="relative z-10 flex min-h-[calc(100vh-80px)] flex-col items-center px-4 pt-20 sm:px-6 lg:pt-24 xl:pt-28">
        {/* Título */}

        <h1 className="text-center text-[26px] font-bold leading-[1.05] sm:text-[30px] md:text-[36px] lg:text-[44px] xl:text-[66px]">
          CONVERTENDO BIOMASSA
          <br />
          EM ENERGIA LIMPA
          <br />
          DE FORMA{" "}
          <span className="inline-block rounded-lg bg-white px-2 py-0 text-[#e27713] shadow-lg sm:px-3 sm:py-0">
            SUSTENTÁVEL
          </span>
        </h1>

        {/* Descrição */}
        <p className="mx-auto mt-4 max-w-[700px] px-2 text-center text-[10px] leading-relaxed text-white sm:mt-5 sm:text-[12px] md:text-[14px] lg:mt-6 lg:text-[16px]">
          Há mais de 15 anos, a Kairos Industria é referência na produção de
          queimadores de cavaco para secagem de grãos.
        </p>

        {/* Botões */}
        <div className="mt-5 flex w-full flex-col items-center justify-center gap-3 sm:flex-row sm:gap-5 lg:mt-6">
          <a
            href="#produtos"
            className="w-full max-w-[320px] whitespace-nowrap rounded-lg bg-[var(--kairos-orange)] px-1 py-1 text-center text-[17px] font-bold transition hover:bg-[var(--kairos-orange)] sm:w-auto sm:px-9 sm:py-4 sm:text-[20px]"
          >
            Conheça Nossos Produtos
          </a>

          <a
            href="#contato"
            className="w-full max-w-[320px] rounded-lg border-2 border-white px-6 py-3 text-center text-[17px] font-bold transition hover:bg-white hover:text-black sm:w-auto sm:px-9 sm:py-4 sm:text-[20px]"
          >
            Fale com Especialista
          </a>
        </div>

        {/* Estatísticas */}
        <div className="mt-0 w-full pt-4 sm:mt-2 lg:mt-3 lg:pt-5">
          <div className="mx-auto w-fit border-t border-white/30 pt-4">
            <div className="grid grid-cols-2 gap-x-8 gap-y-5 text-center sm:gap-x-12 md:grid-cols-4 md:gap-6">
              <div>
                <strong className="text-[20px] font-bold sm:text-[32px] lg:text-[35px]">
                  +15
                </strong>

                <p className="mt-1 text-[12px] uppercase sm:text-[14px] lg:text-[17px]">
                  Anos de experiência
                </p>
              </div>

              <div>
                <strong className="text-[20px] font-bold sm:text-[32px] lg:text-[35px]">
                  +123
                </strong>

                <p className="mt-1 text-[12px] uppercase sm:text-[14px] lg:text-[17px]">
                  Clientes satisfeitos
                </p>
              </div>

              <div>
                <strong className="text-[20px] font-bold sm:text-[32px] lg:text-[35px]">
                  +15
                </strong>

                <p className="mt-1 text-[12px] uppercase sm:text-[14px] lg:text-[17px]">
                  Estados atendidos
                </p>
              </div>

              <div>
                <strong className="text-[28px] font-bold sm:text-[32px] lg:text-[35px]">
                  +310
                </strong>

                <p className="mt-1 text-[12px] uppercase sm:text-[14px] lg:text-[17px]">
                  Projetos realizados
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
