import React from "react";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-screen pt-[80px] text-white">
      {/* Conteúdo da Hero */}
      <div className="relative z-10 flex min-h-[calc(100vh-80px)] flex-col items-center px-4 pt-20 sm:px-6 lg:pt-24 xl:pt-28">
        {/* Título */}

        <h1 className="text-center text-[20px] font-bold leading-[1.05] sm:text-[24px] md:text-[28px] lg:text-[36px] xl:text-[42px]">
          CONVERTENDO BIOMASSA
          <br />
          EM ENERGIA LIMPA
          <br />
          DE FORMA{" "}
          <span className="inline-block rounded-lg bg-white px-2 py-0 text-[#398263] shadow-lg sm:px-3 sm:py-0">
            SUSTENTÁVEL
          </span>
        </h1>

        {/* Descrição */}
        <p className="mx-auto mt-4 max-w-[700px] px-2 text-center text-[10px] leading-relaxed text-white sm:mt-5 sm:text-[12px] md:text-[14px] lg:mt-6 lg:text-[16px]">
          Há mais de 17 anos, a Kairos Termo Engenharia é referência na produção
          de queimadores de cavaco para secagem de grãos.
        </p>

        {/* Botões */}
        <div className="mt-5 flex w-full flex-col items-center justify-center gap-3 sm:flex-row sm:gap-5 lg:mt-6">
          <a
            href="#produtos"
            className="w-full whitespace-nowrap max-w-[320px] rounded-lg bg-[#e04f11] px-1 py-1 text-center text-[17px] font-bold transition hover:bg-[#e04f11] sm:w-auto sm:px-9 sm:py-4 sm:text-[20px]"
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
                  +17
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
      {/* Atendimento */}

      <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6 lg:bottom-7 lg:right-7">
        <div className="relative ">
          {/* Balão */}
          <div className="absolute -top-12 right-0 whitespace-nowrap rounded-2xl bg-white px-3 py-2 text-[13px] font-semibold text-gray-800 shadow-lg sm:-top-14 sm:px-4 sm:py-3 sm:text-[14px] lg:-top-16 lg:px-5 lg:py-4 lg:text-[16px]">
            Posso ajudar?
            <div className="absolute bottom-[-10px] right-5 h-0 w-0 border-l-[10px] border-r-[10px] border-t-[12px] border-l-transparent border-r-transparent border-t-white" />
          </div>

          {/* Atendente */}
          <a
            href="https://wa.me/5547992187965"
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex h-[58px] w-[58px] animate-float items-center justify-center sm:h-[65px] sm:w-[65px] lg:h-[75px] lg:w-[75px]"
          >
            {/* Atendente */}
            <div className="relative h-full w-full sombra-abrindo  overflow-hidden rounded-full border-4 border-white bg-[#e04f11] ">
              <Image
                src="/atendente.jpg"
                alt="Atendimento pelo WhatsApp"
                fill
                className="object-cover"
              />
            </div>
          </a>

          {/* Status */}
          <span className="absolute bottom-2  right-2 h-3 w-3 rounded-full border-2 border-white bg-green-500 sm:h-4 sm:w-4" />
        </div>
      </div>
    </section>
  );
}
