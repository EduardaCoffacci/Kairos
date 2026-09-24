//import Header from "@/componentes/Header/Header";
"use client";

import React from "react";
import { useState } from "react";
import {
  Send,
  MapPin,
  Phone,
  Mail,
  Clock,
  Wrench,
  ChevronDown,
} from "lucide-react";
import Header from "@/componentes/Header/Header";
import Footer from "@/componentes/Footer/Footer";

const equipamentos = [
  "Moega",
  "Transportador de correia",
  "Peneira de disco",
  "Rosca transportadora",
  "Silo pulmão",
  "Fornalha",
  "Ciclone",
  "Separador de particulas",
  "Ventilador centrifogo",
  "Outros",
];

function Contato() {
  const [assunto, setAssunto] = useState("");

  return (
    <>
      <Header darkText />
      <section className="w-full bg-slate-50 pt-[80px] pb-10 sm:pt-[90px] sm:pb-14 lg:pt-[110px] lg:pb-16 xl:pt-[180px]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_1fr]">
            {/* FORMULÁRIO */}
            <div className="rounded-xl bg-white p-5 shadow-sm sm:p-7 lg:p-8">
              <div className="mb-7 flex items-center gap-3">
                <Send className="h-6 w-6 text-[#e04f11]" />

                <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">
                  Solicite um Orçamento
                </h2>
              </div>

              <form className="space-y-5">
                {/* Nome + Email */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Nome completo <span className="text-orange-600">*</span>
                    </label>

                    <input
                      type="text"
                      placeholder="Seu nome"
                      className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-3 text-sm outline-none transition focus:border-[#e04f11] focus:ring-1 focus:ring-[#e04f11]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      E-mail <span className="text-orange-600">*</span>
                    </label>

                    <input
                      type="email"
                      placeholder="seu@email.com"
                      className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-3 text-sm outline-none transition focus:border-[#e04f11] focus:ring-1 focus:ring-[#e04f11]"
                    />
                  </div>
                </div>

                {/* Telefone + Empresa */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Telefone <span className="text-orange-600">*</span>
                    </label>

                    <input
                      type="tel"
                      placeholder="(00) 00000-0000"
                      className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-3 text-sm outline-none transition focus:border-[#e04f11] focus:ring-1 focus:ring-[#e04f11]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Empresa
                    </label>

                    <input
                      type="text"
                      placeholder="Nome da empresa"
                      className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-3 text-sm outline-none transition focus:border-[#e04f11] focus:ring-1 focus:ring-[#e04f11]"
                    />
                  </div>
                </div>

                {/* ASSUNTO */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Assunto <span className="text-orange-600">*</span>
                  </label>

                  <div className="relative">
                    <select
                      value={assunto}
                      onChange={(e) => setAssunto(e.target.value)}
                      className="w-full appearance-none rounded-md border border-slate-300 bg-slate-50 px-3 py-3 pr-10 text-sm text-slate-600 outline-none transition focus:border-[#e04f11] focus:ring-1 focus:ring-[#8f1724]"
                    >
                      <option value="">Selecione o equipamento</option>

                      {equipamentos.map((equipamento) => (
                        <option key={equipamento} value={equipamento}>
                          {equipamento}
                        </option>
                      ))}
                    </select>

                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  </div>
                </div>

                {/* MENSAGEM */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Mensagem <span className="text-orange-600">*</span>
                  </label>

                  <textarea
                    rows={6}
                    placeholder="Descreva sua necessidade e como podemos ajudar..."
                    className="w-full resize-none rounded-md border border-slate-300 bg-slate-50 px-3 py-3 text-sm outline-none transition focus:border-[#e04f11] focus:ring-1 focus:ring-[#e04f11]"
                  />
                </div>

                {/* BOTÃO */}
                <button
                  type="submit"
                  className="w-full rounded-md bg-[#e04f11] px-5 py-3 font-semibold text-white transition hover:bg-[#e33a10] active:scale-[0.99]"
                >
                  Enviar Mensagem
                </button>
              </form>
            </div>

            {/* LADO DIREITO */}
            <div className="flex flex-col gap-5">
              {/* CARDS */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <InfoCard
                  icon={<MapPin className="h-5 w-5" />}
                  title="Endereço"
                >
                  {/*Rua , N° - Bairro*/}
                  <br />
                  Navegantes - SC
                  <br />
                  CEP:
                </InfoCard>

                <InfoCard icon={<Phone className="h-5 w-5" />} title="Telefone">
                  (47) 0000-0000
                  <br />
                  (47) 0000-0000
                </InfoCard>

                <InfoCard icon={<Mail className="h-5 w-5" />} title="E-mail">
                  comercial@kairosindustrial.com.br
                </InfoCard>

                <InfoCard icon={<Clock className="h-5 w-5" />} title="Horário">
                  Segunda à Sexta
                  <br />
                  08:00 às 18:00
                  <br />
                  Sábados: 08:00 às 12:00
                </InfoCard>
              </div>

              {/* ASSISTÊNCIA */}
              <div className="rounded-xl bg-[#e04f11] p-6 text-white sm:p-7">
                <div className="mb-4 flex items-center gap-3">
                  <Wrench className="h-6 w-6" />

                  <h3 className="text-lg font-bold sm:text-xl">
                    Precisa de Assistência Técnica?
                  </h3>
                </div>

                <p className="mb-5 text-sm leading-6 text-white/90">
                  Nossa equipe técnica especializada está pronta para oferecer
                  suporte completo, manutenção preventiva e corretiva para seus
                  equipamentos.
                </p>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button className="rounded-md bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100">
                    Suporte Técnico
                  </button>

                  <button className="rounded-md bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100">
                    Ligar Agora
                  </button>
                </div>
              </div>

              {/* DISTRIBUIDORES */}
              <div className="rounded-xl bg-slate-100 p-6 sm:p-7">
                <h3 className="mb-3 text-lg font-bold text-slate-800 sm:text-xl">
                  Distribuidores e Revendedores
                </h3>

                <p className="mb-5 text-sm leading-6 text-slate-600">
                  Interessado em se tornar um parceiro comercial? Entre em
                  contato para conhecer nossas condições especiais para
                  distribuidores.
                </p>

                <button className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50">
                  Seja um Parceiro
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

/* COMPONENTE DOS CARDS */

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

function InfoCard({ icon, title, children }: InfoCardProps) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f3e5e7] text-[#e04f11]">
          {icon}
        </div>

        <h3 className="font-semibold text-slate-800">{title}</h3>
      </div>

      <div className="text-sm leading-5 text-slate-500">{children}</div>
    </div>
  );
}

export default Contato;
