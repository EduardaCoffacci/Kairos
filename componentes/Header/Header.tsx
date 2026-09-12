"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full border-b backdrop-blur-xl transition-all duration-500 ${
        isScrolled
          ? "border-black/10 bg-white/90"
          : "border-white/20 bg-transparent"
      }`}
    >
      {/* Conteúdo principal do Header */}
      <div className="mx-auto flex h-[80px] max-w-[1700px] items-center justify-between px-4 sm:h-[90px] sm:px-6 lg:h-[110px] lg:px-8 xl:h-[130px]">
        {/* Logo */}
        <div className="w-[140px] sm:w-[160px] lg:w-[200px] xl:w-[250px]">
          <Image
            src="/logo.png"
            alt="Logo"
            width={180}
            height={90}
            className="h-auto w-full object-contain"
          />
        </div>

        {/* Menu Desktop */}
        <nav className="hidden flex-1 items-center justify-center gap-5 text-[14px] font-semibold lg:flex xl:gap-9 xl:text-[18px]">
          <a
            href="#"
            className={`relative transition-colors duration-500 ${
              isScrolled ? "text-black" : "text-white"
            } after:absolute after:-bottom-2 after:left-0 after:h-[3px] after:w-0 after:transition-all after:duration-700 hover:after:w-full ${
              isScrolled ? "after:bg-black" : "after:bg-[#f7f3f4]"
            }`}
          >
            Home
          </a>

          <a
            href="/fornalhas"
            className={`relative transition-colors duration-500 ${
              isScrolled ? "text-black" : "text-white"
            } after:absolute after:-bottom-2 after:left-0 after:h-[3px] after:w-0 after:transition-all after:duration-700 hover:after:w-full ${
              isScrolled ? "after:bg-black" : "after:bg-[#f7f3f4]"
            }`}
          >
            Fornalhas
          </a>

          <a
            href="#"
            className={`relative transition-colors duration-500 ${
              isScrolled ? "text-black" : "text-white"
            } after:absolute after:-bottom-2 after:left-0 after:h-[3px] after:w-0 after:transition-all after:duration-700 hover:after:w-full ${
              isScrolled ? "after:bg-black" : "after:bg-[#f7f3f4]"
            }`}
          >
            Clientes
          </a>

          <a
            href="#"
            className={`relative transition-colors duration-500 ${
              isScrolled ? "text-black" : "text-white"
            } after:absolute after:-bottom-2 after:left-0 after:h-[3px] after:w-0 after:transition-all after:duration-700 hover:after:w-full ${
              isScrolled ? "after:bg-black" : "after:bg-[#f7f3f4]"
            }`}
          >
            Nossa História
          </a>

          <a
            href="#"
            className={`relative transition-colors duration-500 ${
              isScrolled ? "text-black" : "text-white"
            } after:absolute after:-bottom-2 after:left-0 after:h-[3px] after:w-0 after:transition-all after:duration-700 hover:after:w-full ${
              isScrolled ? "after:bg-black" : "after:bg-[#f7f3f4]"
            }`}
          >
            Contato
          </a>
        </nav>

        {/* Botão Desktop */}
        <div className="hidden w-[250px] justify-end lg:flex xl:w-[370px]">
          <a
            href="#"
            className="rounded-lg bg-[#e04f11] px-4 py-2 text-[14px] font-bold lg:px-4 lg:py-3 xl:px-5 xl:text-[16px]"
          >
            Assistência Técnica
          </a>
        </div>

        {/* Botão mobile */}
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex flex-col gap-1.5 lg:hidden"
        >
          <span
            className={`h-[3px] w-7 rounded transition-colors duration-500 ${
              isScrolled ? "bg-black" : "bg-white"
            }`}
          ></span>

          <span
            className={`h-[3px] w-7 rounded transition-colors duration-500 ${
              isScrolled ? "bg-black" : "bg-white"
            }`}
          ></span>

          <span
            className={`h-[3px] w-7 rounded transition-colors duration-500 ${
              isScrolled ? "bg-black" : "bg-white"
            }`}
          ></span>
        </button>
      </div>

      {/* Menu mobile */}
      <nav
        className={`overflow-hidden border-t px-6 transition-all duration-1000 ease-out lg:hidden ${
          isScrolled
            ? "border-black/10 bg-white/95"
            : "border-white/20 bg-black/90"
        } ${
          isMenuOpen
            ? "max-h-[500px] translate-y-0 py-8 opacity-100"
            : "max-h-0 -translate-y-4 py-0 opacity-0"
        }`}
      >
        <div
          className={`flex flex-col items-center gap-6 transition-colors duration-500 ${
            isScrolled ? "text-black" : "text-white"
          }`}
        >
          <a href="#">Home</a>

          <a href="#">Queimadores</a>

          <a href="#">Caldeira</a>

          <a href="#">Clientes</a>

          <a href="#">Nossa História</a>

          <a href="#">Contato</a>

          <a
            href="#"
            className="rounded-lg bg-[#e04f11] px-6 py-3 font-bold text-white"
          >
            Assistência Técnica
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Header;
