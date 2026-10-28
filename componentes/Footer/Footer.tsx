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
                href="https://www.linkedin.com/company/kairosindustrial/posts/?viewAsMember=true"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn da Kairos Industrial"
                className="flex h-11 w-11 items-center justify-center rounded-full text-white transition-all duration-300 hover:text-[var(--kairos-orange)] hover:shadow-[0_0_15px_rgba(224,79,17,0.7)]"
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
                className="text-white/80 transition hover:text-[var(--kairos-orange)]"
              >
                Home
              </Link>
              <Link
                href="/fornalhas"
                className="text-white/80 transition hover:text-[var(--kairos-orange)]"
              >
                Fornalhas
              </Link>

              <Link
                href="/produtos"
                className="text-white/80 transition hover:text-[var(--kairos-orange)]"
              >
                Produtos
              </Link>

              <Link
                href="/nossahistoria"
                className="text-white/80 transition hover:text-[var(--kairos-orange)]"
              >
                Nossa História
              </Link>

              <Link
                href="/contato"
                className="text-white/80 transition hover:text-[var(--kairos-orange)]"
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
                href="/produtos#moega"
                className="text-white/80 transition hover:text-[var(--kairos-orange)]"
              >
                KTMR - Moega de Recepção
              </Link>

              <Link
                href="/produtos"
                className="text-white/80 transition hover:text-[var(--kairos-orange)]"
              >
                KTTC - Transportadora de Correia
              </Link>

              <Link
                href="/produtos"
                className="text-white/80 transition hover:text-[var(--kairos-orange)]"
              >
                KTPD - Peneira de Disco
              </Link>

              <Link
                href="/produtos"
                className="text-white/80 transition hover:text-[var(--kairos-orange)]"
              >
                KTRD - Rosca Dosadora
              </Link>
              <Link
                href="/produtos"
                className="text-white/80 transition hover:text-[var(--kairos-orange)]"
              >
                KTSP - Silo Pulmão
              </Link>
              <Link
                href="/produtos"
                className="text-white/80 transition hover:text-[var(--kairos-orange)]"
              >
                KTQB - Queimador de Biomassa
              </Link>
            </nav>
          </div>

          {/* CONTATO */}
          <div>
            <h3 className="text-xl font-bold">Contato</h3>

            <div className="mt-5 space-y-5">
              {/* LOCALIZAÇÃO */}
              <div className="flex gap-4">
                <FaMapMarkerAlt
                  className="mt-1 shrink-0 text-white"
                  size={24}
                />

                <p className="text-sm leading-6 text-white/80 sm:text-base">
                  Navegantes - SC
                </p>
              </div>

              {/* TELEFONE */}
              <div className="flex gap-4">
                <FaPhone className="mt-1 shrink-0 text-white" size={24} />

                <div className="flex flex-col gap-2 text-sm text-white/80 sm:text-base">
                  <span>(47) 99218-7965</span>
                </div>
              </div>

              {/* E-MAIL */}
              <div className="flex gap-4">
                <FaEnvelope className="mt-1 shrink-0 text-white" size={24} />

                <div className="flex flex-col gap-2 text-sm text-white/80 sm:text-base">
                  <span>comercial@kairosindustrial.com.br</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LINHA */}
        <div className="my-10 h-px w-full bg-white/20" />

        {/* PARTE INFERIOR */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm text-white/80 sm:text-base">
            © 2026 Kairos. Desenvolvido por Maria Tecnologia. Todos os direitos
            reservados.
          </p>

          {/* LINKS LEGAIS */}
          <div className="flex flex-wrap gap-6 text-sm text-white/80 sm:text-base">
            {/* Removidos até que as páginas sejam implementadas */}
          </div>
        </div>
      </div>
    </footer>
  );
}
