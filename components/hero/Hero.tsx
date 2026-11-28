
"use client";

import { useChat } from "@/app/context/ChatContext";
import Button from "../button/Button";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  const { setIsChatOpen } = useChat();

  return (
    <section
      aria-labelledby="hero-title"
      className="relative min-h-[100svh] pt-[80px] text-white"
    >
      {/* Conteúdo da Hero */}
      <div className="container-kairos relative z-10 flex min-h-[calc(100svh-80px)] flex-col items-center justify-center py-10 sm:py-14 lg:py-16">

        {/* Título */}
        <h1
          id="hero-title"
          className="w-full max-w-full break-words text-center text-[clamp(1.35rem,6vw,2.75rem)] font-bold leading-[1.15] sm:text-[30px] md:text-[36px] lg:text-[40px] xl:text-[44px]"
        >
          CONVERTENDO BIOMASSA
          <br />
          EM ENERGIA LIMPA
          <br />
          DE FORMA{" "}
          <span className="inline-block max-w-full rounded-lg bg-white px-2 py-0 text-[#e27713] shadow-lg sm:px-3">
            SUSTENTÁVEL
          </span>
        </h1>

        {/* Descrição */}
        <p className="mx-auto mt-5 w-full max-w-[700px] px-1 text-center text-xs leading-relaxed text-white sm:mt-5 sm:text-sm md:text-base lg:mt-6">
          Há mais de 15 anos, a Kairos Indústria é referência na produção de
          queimadores de cavaco para secagem de grãos.
        </p>

        {/* Botões */}
        <div className="mt-8 flex w-full max-w-[320px] flex-col justify-center gap-3 sm:mt-9 sm:max-w-none sm:flex-row sm:gap-4">
          <Button
            href="/produtos"
            variant="primary"
            className="w-full px-5 py-3 text-xs sm:w-auto sm:px-6 sm:py-4 sm:text-sm"
          >
            Conheça Nossos Produtos
            <ArrowRight size={18} />
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsChatOpen(true)}
            className="w-full px-5 py-3 text-xs sm:w-auto sm:px-6 sm:py-4 sm:text-sm"
          >
            Fale com Especialista
          </Button>
        </div>

        {/* Estatísticas */}
        <div
          aria-label="Indicadores da empresa"
          className="mt-10 w-full min-w-0 sm:mt-12 lg:mt-14"
        >
          <div className="w-full min-w-0 border-t border-white/30 pt-6">
            <div className="grid w-full min-w-0 grid-cols-3 gap-2 text-center sm:gap-4 md:gap-10">

              <div className="min-w-0">
                <strong className="block text-xl font-bold sm:text-[32px] lg:text-[35px]">
                  +15
                </strong>

                <p className="mt-1 text-[9px] uppercase leading-tight sm:text-xs md:text-sm lg:text-base">
                  Anos de experiência
                </p>
              </div>

              <div className="min-w-0">
                <strong className="block text-xl font-bold sm:text-[32px] lg:text-[35px]">
                  +123
                </strong>

                <p className="mt-1 text-[9px] uppercase leading-tight sm:text-xs md:text-sm lg:text-base">
                  Clientes satisfeitos
                </p>
              </div>

              <div className="min-w-0">
                <strong className="block text-xl font-bold sm:text-[32px] lg:text-[35px]">
                  +310
                </strong>

                <p className="mt-1 text-[9px] uppercase leading-tight sm:text-xs md:text-sm lg:text-base">
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
