"use client";

import { useState } from "react";
import type { ReactNode, SubmitEvent } from "react";
import {
  ChevronDown,
  Clock,
  Mail,
  MapPin,
  Phone,
  Send,
  Wrench,
} from "lucide-react";

import Header from "@/componentes/Header/Header";
import Footer from "@/componentes/Footer/Footer";

const equipment = [
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

const contactCards = [
  {
    type: "address",
    title: "Endereço",
    icon: MapPin,
  },
  {
    type: "phone",
    title: "Telefone",
    icon: Phone,
  },
  {
    type: "email",
    title: "E-mail",
    icon: Mail,
  },
  {
    type: "hours",
    title: "Horário",
    icon: Clock,
  },
];

interface FormData {
  nome: string;
  email: string;
  telefone: string;
  empresa: string;
  assunto: string;
  mensagem: string;
}

const initialFormData: FormData = {
  nome: "",
  email: "",
  telefone: "",
  empresa: "",
  assunto: "",
  mensagem: "",
};

function ContactPage() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [mensagemSucesso, setMensagemSucesso] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleChange = (
    field: keyof FormData,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMensagemSucesso("");
    setEnviando(true);

    try {
      const resposta = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/contact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      if (!resposta.ok) {
        throw new Error("Erro ao enviar formulário");
      }

      setFormData(initialFormData);
      setMensagemSucesso("Mensagem enviada com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      <Header darkText />

      <section className="w-full bg-slate-50 pb-10 pt-[80px] sm:pb-14 sm:pt-[90px] lg:pb-16 lg:pt-[110px] xl:pt-[180px]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_1fr]">

            {/* FORMULÁRIO */}
            <div className="rounded-xl bg-white p-5 shadow-sm sm:p-7 lg:p-8">
              <div className="mb-7 flex items-center gap-3">
                <Send className="h-6 w-6 text-[var(--kairos-orange)]" />

                <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">
                  Solicite um Orçamento
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <FormField
                    label="Nome completo"
                    required
                    value={formData.nome}
                    placeholder="Digite seu nome"
                    onChange={(value) => handleChange("nome", value)}
                  />

                  <FormField
                    label="E-mail"
                    required
                    type="email"
                    value={formData.email}
                    placeholder="seu@email.com"
                    onChange={(value) => handleChange("email", value)}
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <FormField
                    label="Telefone"
                    required
                    type="tel"
                    value={formData.telefone}
                    placeholder="(00) 00000-0000"
                    onChange={(value) => handleChange("telefone", value)}
                  />

                  <FormField
                    label="Empresa"
                    value={formData.empresa}
                    placeholder="Nome da empresa"
                    onChange={(value) => handleChange("empresa", value)}
                  />
                </div>

                {/* ASSUNTO */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Assunto <span className="text-orange-600">*</span>
                  </label>

                  <div className="relative">
                    <select
                      required
                      value={formData.assunto}
                      onChange={(e) =>
                        handleChange("assunto", e.target.value)
                      }
                      className="w-full appearance-none rounded-md border border-slate-300 bg-slate-50 px-3 py-3 pr-10 text-sm text-slate-600 outline-none transition focus:border-[var(--kairos-orange)] focus:ring-1 focus:ring-[var(--kairos-orange)]"
                    >
                      <option value="">
                        Selecione o equipamento
                      </option>

                      {equipment.map((equipamento) => (
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
                    required
                    rows={6}
                    value={formData.mensagem}
                    onChange={(e) =>
                      handleChange("mensagem", e.target.value)
                    }
                    placeholder="Descreva sua necessidade e como podemos ajudar..."
                    className="w-full resize-none rounded-md border border-slate-300 bg-slate-50 px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--kairos-orange)] focus:ring-1 focus:ring-[var(--kairos-orange)]"
                  />
                </div>

                {mensagemSucesso && (
                  <div className="flex items-center gap-3 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100">
                      ✓
                    </div>

                    <span>{mensagemSucesso}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={enviando}
                  className="w-full rounded-md bg-[var(--kairos-orange)] px-5 py-3 font-semibold text-white transition hover:bg-[#e33a10] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {enviando ? "Enviando..." : "Enviar Mensagem"}
                </button>
              </form>
            </div>

            {/* LADO DIREITO */}
            <div className="flex flex-col gap-5">

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {contactCards.map((card) => {
                  const Icon = card.icon;

                  return (
                    <InfoCard
                      key={card.type}
                      icon={<Icon className="h-5 w-5" />}
                      title={card.title}
                      type={card.type}
                    />
                  );
                })}
              </div>

              {/* ASSISTÊNCIA */}
              <div className="rounded-xl bg-[var(--kairos-orange)] p-6 text-white sm:p-7">
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

/* CAMPO DO FORMULÁRIO */

interface FormFieldProps {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}

function FormField({
  label,
  value,
  placeholder,
  onChange,
  type = "text",
  required = false,
}: FormFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}{" "}
        {required && <span className="text-orange-600">*</span>}
      </label>

      <input
        required={required}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--kairos-orange)] focus:ring-1 focus:ring-[var(--kairos-orange)]"
      />
    </div>
  );
}

/* CARD DE INFORMAÇÃO */

interface InfoCardProps {
  icon: ReactNode;
  title: string;
  type: string;
}

function InfoCard({ icon, title, type }: InfoCardProps) {
  const content = {
    address: (
      <>
        Navegantes - SC
        <br />
        CEP:
      </>
    ),

    phone: (
      <>
        (47) 0000-0000
        <br />
        (47) 0000-0000
      </>
    ),

    email: <>comercial@kairosindustrial.com.br</>,

    hours: (
      <>
        Segunda à Sexta
        <br />
        08:00 às 18:00
        <br />
        Sábados: 08:00 às 12:00
      </>
    ),
  };

  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgba(224,79,17,0.10)] text-[var(--kairos-orange)]">
          {icon}
        </div>

        <h3 className="font-semibold text-slate-800">
          {title}
        </h3>
      </div>

      <div className="text-sm leading-5 text-slate-500">
        {content[type as keyof typeof content]}
      </div>
    </div>
  );
}

export default ContactPage;