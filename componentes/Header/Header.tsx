"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Button from "../Button/Button";

interface HeaderProps {
  darkText?: boolean;
}

const navigation = [
  { label: "Home", href: "/" },
  { label: "Fornalhas", href: "/fornalhas" },
  { label: "Produtos", href: "/produtos" },
  { label: "Nossa História", href: "/nossahistoria" },
  { label: "Contato", href: "/contato" },
];

const Header = ({ darkText = false }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 500);

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const lightHeader = darkText || isScrolled;
  const textColor = lightHeader ? "text-black" : "text-white";
  const lineColor = lightHeader ? "after:bg-black" : "after:bg-white";

  const linkClass = `
    relative transition-colors duration-500
    after:absolute after:-bottom-2 after:left-0
    after:h-[3px] after:w-0 after:transition-all
    after:duration-700 hover:after:w-full
    ${textColor} ${lineColor}
  `;

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full border-b backdrop-blur-xl transition-all duration-500 ${
        lightHeader
          ? "border-black/10 bg-white"
          : "border-white/20 bg-transparent"
      }`}
    >
      <div className="container-kairos relative flex h-[65px] items-center justify-between sm:h-[70px] lg:h-[80px] xl:h-[90px]">
        <Link
          href="/"
          className="w-[140px] sm:w-[160px] lg:w-[200px] xl:w-[250px]"
          aria-label="Kairos - Página inicial"
        >
          <Image
            src="/logo.png"
            alt="Kairos"
            width={180}
            height={90}
            priority
            className="w-[120px] sm:w-[140px] lg:w-[170px] xl:w-[200px]"
          />
        </Link>

        {/* Menu desktop */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center justify-center gap-5 text-[13px] font-semibold lg:flex xl:gap-7">
          {navigation.map(({ label, href }) => (
            <Link key={href} href={href} className={linkClass}>
              {label}
            </Link>
          ))}
        </nav>

        {/* Botão desktop */}
        <div className="hidden w-[250px] justify-end py-0.5 text-[13px] lg:flex xl:w-[350px] xl:text-[12px]">
          <Button
            type="button"
            onClick={() => window.dispatchEvent(new Event("abrir-chat"))}
            className="py-1 text-[12px]"
          >
            Assistência Técnica
          </Button>
        </div>

        {/* Botão mobile */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={isMenuOpen}
          className="flex flex-col gap-1.5 lg:hidden"
        >
          {[1, 2, 3].map((line) => (
            <span
              key={line}
              className={`h-[3px] w-7 rounded transition-colors duration-500 ${
                lightHeader ? "bg-black" : "bg-white"
              }`}
            />
          ))}
        </button>
      </div>

      {/* Menu mobile */}
      <nav
        className={`overflow-hidden border-t transition-all duration-500 ease-out lg:hidden ${
          isScrolled
            ? "border-black/10 bg-white/95"
            : "border-white/20 bg-black/90"
        } ${
          isMenuOpen
            ? "max-h-[500px] translate-y-0 px-6 py-8 opacity-100"
            : "max-h-0 -translate-y-4 px-6 py-0 opacity-0"
        }`}
      >
        <div
          className={`flex flex-col items-center gap-6 transition-colors duration-500 ${
            lightHeader ? "text-black" : "text-white"
          }`}
        >
          {navigation.map(({ label, href }) => (
            <Link key={href} href={href} onClick={closeMenu}>
              {label}
            </Link>
          ))}

          <Button href="/contato">Assistência Técnica</Button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
