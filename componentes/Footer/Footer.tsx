import Link from "next/link";
import {
  FaLinkedin,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="relative bg-[#000000] text-white">
      <div className="container-kairos py-12">
        {/* COLUNAS PRINCIPAIS */}
        <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* EMPRESA */}
          <div>
            <h2 className="text-[20px] font-bold sm:text-[24px]">
              Kairos Termo Engenharia
            </h2>

            <p className="mt-5 max-w-sm text-[14px] leading-6 text-white/80">
              Soluções em energia sustentável para o agronegócio brasileiro.
            </p>

            {/* REDES SOCIAIS */}
            <div className="mt-6 flex gap-4">
              <a
                href="https://www.linkedin.com/company/kairosindustrial/posts/?viewAsMember=true"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn da Kairos Industrial"
                className="flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors duration-300 hover:bg-white/10 hover:text-[var(--kairos-orange)]"
              >
                <FaLinkedin size={21} />
              </a>
            </div>
          </div>

          {/* LINKS RÁPIDOS */}
          <div>
            <h3 className="text-[17px] font-bold sm:text-[18px]">
              Links Rápidos
            </h3>

            <nav className="mt-5 flex flex-col gap-4">
              <Link
                href="/"
                className="text-[13px] text-white/80 transition hover:text-[var(--kairos-orange)] sm:text-[14px]"
              >
                Home
              </Link>

              <Link
                href="/fornalhas"
                className="text-[13px] text-white/80 transition hover:text-[var(--kairos-orange)] sm:text-[14px]"
              >
                Fornalhas
              </Link>

              <Link
                href="/produtos"
                className="text-[13px] text-white/80 transition hover:text-[var(--kairos-orange)] sm:text-[14px]"
              >
                Produtos
              </Link>

              <Link
                href="/nossahistoria"
                className="text-[13px] text-white/80 transition hover:text-[var(--kairos-orange)] sm:text-[14px]"
              >
                Nossa História
              </Link>

              <Link
                href="/contato"
                className="text-[13px] text-white/80 transition hover:text-[var(--kairos-orange)] sm:text-[14px]"
              >
                Contato
              </Link>
            </nav>
          </div>

          {/* PRODUTOS */}
          <div>
            <h3 className="text-[17px] font-bold sm:text-[18px]">Produtos</h3>

            <nav className="mt-5 flex flex-col gap-4">
              <Link
                href="/produtos#moega"
                className="text-[13px] text-white/80 transition hover:text-[var(--kairos-orange)] sm:text-[14px]"
              >
                KTMR - Moega de Recepção
              </Link>

              <Link
                href="/produtos"
                className="text-[13px] text-white/80 transition hover:text-[var(--kairos-orange)] sm:text-[14px]"
              >
                KTTC - Transportadora de Correia
              </Link>

              <Link
                href="/produtos"
                className="text-[13px] text-white/80 transition hover:text-[var(--kairos-orange)] sm:text-[14px]"
              >
                KTPD - Peneira de Disco
              </Link>

              <Link
                href="/produtos"
                className="text-[13px] text-white/80 transition hover:text-[var(--kairos-orange)] sm:text-[14px]"
              >
                KTRD - Rosca Dosadora
              </Link>

              <Link
                href="/produtos"
                className="text-[13px] text-white/80 transition hover:text-[var(--kairos-orange)] sm:text-[14px]"
              >
                KTSP - Silo Pulmão
              </Link>

              <Link
                href="/produtos"
                className="text-[13px] text-white/80 transition hover:text-[var(--kairos-orange)] sm:text-[14px]"
              >
                KTQB - Queimador de Biomassa
              </Link>
            </nav>
          </div>

          {/* CONTATO */}
          <div>
            <h3 className="text-[17px] font-bold sm:text-[18px]">Contato</h3>

            <div className="mt-5 space-y-4">
              {/* LOCALIZAÇÃO */}
              <div className="flex gap-3">
                <FaMapMarkerAlt
                  className="mt-1 shrink-0 text-white"
                  size={18}
                />

                <p className="text-[12px] leading-5 text-white/80 sm:text-[13px]">
                  Navegantes - SC
                </p>
              </div>

              {/* TELEFONE */}
              <div className="flex gap-3">
                <FaPhone className="mt-1 shrink-0 text-white" size={18} />

                <span className="text-[12px] text-white/80 sm:text-[13px]">
                  (47) 99218-7965
                </span>
              </div>

              {/* E-MAIL */}
              <div className="flex gap-3">
                <FaEnvelope className="mt-1 shrink-0 text-white" size={18} />

                <span className="break-all text-[12px] text-white/80 sm:text-[13px]">
                  adm@kairosindustrial.com.br
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* LINHA */}
        <div className="my-10 h-px w-full bg-white/20" />

        {/* PARTE INFERIOR */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-[12px] text-white/80 sm:text-[13px]">
            © 2026 Kairos. Desenvolvido por Maria Tech. Todos os direitos
            reservados.
          </p>

          {/* LINKS LEGAIS */}
          <div className="flex flex-wrap gap-6 text-[12px] text-white/80 sm:text-[13px]">
            {/* Removidos até que as páginas sejam implementadas */}
          </div>
        </div>
      </div>
    </footer>
  );
}
