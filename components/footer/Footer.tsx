import Link from "next/link";
import {
  FaLinkedin,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function Footer() {
  const linkClass =
    "text-[13px] text-white/80 transition hover:text-[var(--kairos-orange)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500 sm:text-[14px]";

  return (
    <footer className="relative bg-[#000000] text-white">
      <div className="container-kairos py-12">
        {/* MAIN COLUMNS */}
        <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* COMPANY */}
          <div>
            <h2 className="text-[20px] font-bold sm:text-[24px]">
              Kairos Termo Engenharia
            </h2>

            <p className="mt-5 max-w-sm text-[14px] leading-6 text-white/80">
              Soluções em energia sustentável para o agronegócio brasileiro.
            </p>

            {/* SOCIAL MEDIA */}
            <div className="mt-6 flex gap-4">
              <a
                href="https://www.linkedin.com/company/kairosindustrial/posts/?viewAsMember=true"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn da Kairos Industrial (abre em nova aba)"
                className="flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors duration-300 hover:bg-white/10 hover:text-[var(--kairos-orange)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500"
              >
                <FaLinkedin size={21} aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-[17px] font-bold sm:text-[18px]">
              Links Rápidos
            </h3>

            <nav
              aria-label="Links rápidos"
              className="mt-5 flex flex-col gap-4"
            >
              <Link href="/" className={linkClass}>
                Home
              </Link>

              <Link href="/burners" className={linkClass}>
                Queimadores
              </Link>

              <Link href="/products" className={linkClass}>
                Produtos
              </Link>

              <Link href="/our-story" className={linkClass}>
                Nossa História
              </Link>

              <Link href="/contact" className={linkClass}>
                Contato
              </Link>
            </nav>
          </div>

          {/* PRODUCTS */}
          <div>
            <h3 className="text-[17px] font-bold sm:text-[18px]">Produtos</h3>

            <nav aria-label="Produtos" className="mt-5 flex flex-col gap-4">
              <Link href="/products" className={linkClass}>
                KTMR - Moega de Recepção
              </Link>

              <Link href="/products" className={linkClass}>
                KTTC - Transportadora de Correia
              </Link>

              <Link href="/products" className={linkClass}>
                KTPD - Peneira de Disco
              </Link>

              <Link href="/products" className={linkClass}>
                KTRD - Rosca Dosadora
              </Link>

              <Link href="/products" className={linkClass}>
                KTSP - Silo Pulmão
              </Link>

              <Link href="/products" className={linkClass}>
                KTQB - Queimador de Biomassa
              </Link>
            </nav>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-[17px] font-bold sm:text-[18px]">Contato</h3>

            <address className="mt-5 space-y-4 not-italic">
              {/* LOCATION */}
              <div className="flex gap-3">
                <FaMapMarkerAlt
                  aria-hidden="true"
                  className="mt-1 shrink-0 text-white"
                  size={18}
                />

                <p className="text-[12px] leading-5 text-white/80 sm:text-[13px]">
                  Navegantes - SC
                </p>
              </div>

              {/* PHONE */}
              <div className="flex gap-3">
                <FaPhone
                  aria-hidden="true"
                  className="mt-1 shrink-0 text-white"
                  size={18}
                />

                <a
                  href="tel:+5547992187965"
                  className="text-[12px] text-white/80 transition hover:text-[var(--kairos-orange)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500 sm:text-[13px]"
                >
                  (47) 99218-7965
                </a>
              </div>

              {/* EMAIL */}
              <div className="flex gap-3">
                <FaEnvelope
                  aria-hidden="true"
                  className="mt-1 shrink-0 text-white"
                  size={18}
                />

                <a
                  href="mailto:adm@kairosindustrial.com.br"
                  className="break-all text-[12px] text-white/80 transition hover:text-[var(--kairos-orange)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500 sm:text-[13px]"
                >
                  adm@kairosindustrial.com.br
                </a>
              </div>
            </address>
          </div>
        </div>

        {/* DIVIDER */}
        <div aria-hidden="true" className="my-10 h-px w-full bg-white/20" />

        {/* BOTTOM */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-[12px] text-white/80 sm:text-[13px]">
            © 2026 Kairos. Desenvolvido por Maria Tech. Todos os direitos
            reservados.
          </p>

          {/* LEGAL LINKS */}
          <div className="flex flex-wrap gap-6 text-[12px] text-white/80 sm:text-[13px]"></div>
        </div>
      </div>
    </footer>
  );
}
