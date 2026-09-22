import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaFacebook,
  FaInstagram,
  FaPhone,
  FaEnvelope,
  FaLinkedin,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="relative bg-[#e04f11] text-white">
      <div className="mx-auto max-w-[1800px] px-6 py-12 sm:px-10 lg:px-16">
        {/* COLUNAS PRINCIPAIS */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* EMPRESA */}
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">
              Kairos Termo Engenharia
            </h2>

            <p className="mt-5 max-w-sm text-base leading-7 text-white/80">
              Soluções em energia sustentável para o agronegócio brasileiro.
            </p>

            {/* REDES SOCIAIS */}
            <div className="mt-6 flex gap-4">
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e04f11] transition hover:bg-white hover:text-[#7f1724]"
              >
                <FaFacebook size={21} />
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e04f11] transition hover:bg-white hover:text-[#7f1724]"
              >
                <FaInstagram size={21} />
              </a>

              <a
                href="#"
                aria-label="LinkedIn"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e04f11] transition hover:bg-white hover:text-[#7f1724]"
              >
                <FaLinkedin size={21} />
              </a>
            </div>
          </div>

          {/* LINKS RÁPIDOS */}
          <div>
            <h3 className="text-xl font-bold">Links Rápidos</h3>

            <nav className="mt-5 flex flex-col gap-4">
              <Link
                href="/"
                className="text-white/80 transition hover:text-white"
              >
                Home
              </Link>

              <Link
                href="/produtos"
                className="text-white/80 transition hover:text-white"
              >
                Produtos
              </Link>

              <Link
                href="/sobre"
                className="text-white/80 transition hover:text-white"
              >
                Sobre Nós
              </Link>

              <Link
                href="/contato"
                className="text-white/80 transition hover:text-white"
              >
                Contato
              </Link>
            </nav>
          </div>

          {/* PRODUTOS */}
          <div>
            <h3 className="text-xl font-bold">Produtos</h3>

            <nav className="mt-5 flex flex-col gap-4">
              <Link
                href="/produtos/caldeiras"
                className="text-white/80 transition hover:text-white"
              >
                Caldeiras de Biomassa
              </Link>

              <Link
                href="/produtos/rti"
                className="text-white/80 transition hover:text-white"
              >
                RTI - Grelhas Móveis
              </Link>

              <Link
                href="/produtos/rtmv"
                className="text-white/80 transition hover:text-white"
              >
                RTMV - Grelhas Móveis
              </Link>

              <Link
                href="/produtos/rtm"
                className="text-white/80 transition hover:text-white"
              >
                RTM - Grelhas Fixas Modulares
              </Link>

              <Link
                href="/produtos/rta"
                className="text-white/80 transition hover:text-white"
              >
                RTA - Grelhas Fixas
              </Link>
            </nav>
          </div>

          {/* CONTATO */}
          <div>
            <h3 className="text-xl font-bold">Contato</h3>

            <div className="mt-5 space-y-5">
              {/* ENDEREÇO */}
              <div className="flex gap-4">
                <FaMapMarkerAlt className="mt-1 shrink-0" size={24} />

                <p className="text-sm leading-6 text-white/80 sm:text-base">
                  {/*Rua , Numero - Bairro,*/}
                  <br />
                  Balneário Camboriú - SC
                </p>
              </div>

              {/* TELEFONES */}
              <div className="flex gap-4">
                <FaPhone className="mt-1 shrink-0" size={24} />

                <div className="flex flex-col gap-2 text-sm text-white/80 sm:text-base">
                  <span>(47) 99218-7965</span>
                </div>
              </div>

              {/* EMAIL */}
              <div className="flex gap-4">
                <FaEnvelope className="mt-1 shrink-0" size={24} />

                <div className="flex flex-col gap-2 text-sm text-white/80 sm:text-base">
                  <span>contato@queimadores.ind.br</span>

                  <strong className="text-sm text-white">
                    Assistência: montagem@queimadores.ind.br
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LINHA */}
        <div className="my-10 h-px w-full bg-white/20" />

        {/* PARTE INFERIOR */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          {/* COPYRIGHT */}
          <p className="text-sm text-white/80 sm:text-base">
            © 2026 Kairos. Desenvolvido por Maria Tecnologia. Todos os direitos
            reservados.
          </p>

          {/* LINKS */}
          <div className="flex flex-wrap gap-6 text-sm text-white/80 sm:text-base">
            <Link
              href="/politica-de-privacidade"
              className="transition hover:text-white"
            >
              Política de Privacidade
            </Link>

            <Link href="/termos-de-uso" className="transition hover:text-white">
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
