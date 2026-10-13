"use client";
import type { ReactNode } from "react";
import Image from "next/image";


import { useState } from "react";
import {
  ChevronDown,
  Clock,
  Mail,
  MapPin,
  Phone,
  Send,
  Wrench,
} from "lucide-react";

import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
]as const;

// Regras de validação do formulário
const contactSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(3, "O nome deve ter no mínimo 3 caracteres.")
    .max(100, "O nome deve ter no máximo 100 caracteres."),

  email: z
    .string()
    .trim()
    .min(1, "O e-mail é obrigatório.")
    .email("Informe um e-mail válido.")
    .max(254, "O e-mail é muito longo."),

  telefone: z
    .string()
    .trim()
    .min(8, "Informe um telefone válido.")
    .max(20, "O telefone deve ter no máximo 20 caracteres."),

  empresa: z
    .string()
    .trim()
    .max(100, "A empresa deve ter no máximo 100 caracteres."),

  assunto: z
    .string()
    .min(1, "Selecione um equipamento."),

  mensagem: z
    .string()
    .trim()
    .min(10, "A mensagem deve ter no mínimo 10 caracteres.")
    .max(1000, "A mensagem deve ter no máximo 1000 caracteres."),
});

type FormData = z.infer<typeof contactSchema>;


const initialFormData: FormData = {
  nome: "",
  email: "",
  telefone: "",
  empresa: "",
  assunto: "",
  mensagem: "",
};

function ContactPage() {
  const [mensagemSucesso, setMensagemSucesso] = useState("");
  const [mensagemErro, setMensagemErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  
const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: initialFormData,
    mode: "onBlur",
    reValidateMode: "onChange",
  });

const enviarFormulario = async (data: FormData) => {
    setMensagemSucesso("");
    setMensagemErro("");
    setEnviando(true);

    try {
      const resposta = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/contact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      if (!resposta.ok) {
        throw new Error("Não foi possível enviar a mensagem.");
      }

      reset(initialFormData);
      setMensagemSucesso("Mensagem enviada com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      setMensagemErro(
        "Não foi possível enviar sua mensagem. Tente novamente.",
      );
    } finally {
      setEnviando(false);
    }
  };

   return (
    <>
      <Header darkText />

      {/* BANNER */}
      <section className="relative mt-[80px] h-[200px] w-full overflow-hidden sm:h-[230px] lg:h-[250px]">
        <Image
          src="/campo.jpg"
          alt="Campo agrícola"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_35%]"
        />

        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center">
          <h1 className="mb-2 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            Entre em Contato
          </h1>

          <p className="max-w-xl text-sm leading-6 text-white/90 sm:text-base">
            Estamos prontos para entender suas necessidades e oferecer
            soluções industriais para o seu projeto.
          </p>
        </div>
      </section>

      {/* FORMULÁRIO E INFORMAÇÕES */}
      <section className="w-full bg-slate-50 pb-10 pt-10 sm:pb-14 sm:pt-12 lg:pb-16 lg:pt-14">
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

              <form
                onSubmit={handleSubmit(enviarFormulario)}
                noValidate
                className="space-y-5"
              >
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <FormField
                    label="Nome completo"
                    required
                    registration={register("nome")}
                    error={errors.nome?.message}
                    placeholder="Digite seu nome"
                  />

                  <FormField
                    label="E-mail"
                    required
                    type="email"
                    registration={register("email")}
                    error={errors.email?.message}
                    placeholder="seu@email.com"
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <FormField
                    label="Telefone"
                    required
                    type="tel"
                    registration={register("telefone")}
                    error={errors.telefone?.message}
                    placeholder="(00) 00000-0000"
                  />

                  <FormField
                    label="Empresa"
                    registration={register("empresa")}
                    error={errors.empresa?.message}
                    placeholder="Nome da empresa"
                  />
                </div>

                {/* ASSUNTO */}
                <div>
                  <label
                    htmlFor="assunto"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Assunto <span className="text-orange-600">*</span>
                  </label>

                  <div className="relative">
                    <select
                      id="assunto"
                      {...register("assunto")}
                      aria-invalid={!!errors.assunto}
                      className={`w-full appearance-none rounded-md border bg-slate-50 px-3 py-3 pr-10 text-sm outline-none transition focus:border-[var(--kairos-orange)] focus:ring-1 focus:ring-[var(--kairos-orange)] ${
                        errors.assunto
                          ? "border-red-500 text-slate-600"
                          : "border-slate-300 text-slate-600"
                      }`}
                    >
                      <option value="">Selecione o equipamento</option>

                      {equipment.map((equipamento) => (
                        <option key={equipamento} value={equipamento}>
                          {equipamento}
                        </option>
                      ))}
                    </select>

                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  </div>

                  {errors.assunto && (
                    <p className="mt-1.5 text-sm text-red-600">
                      {errors.assunto.message}
                    </p>
                  )}
                </div>

                {/* MENSAGEM */}
                <div>
                  <label
                    htmlFor="mensagem"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Mensagem <span className="text-orange-600">*</span>
                  </label>

                  <textarea
                    id="mensagem"
                    rows={6}
                    {...register("mensagem")}
                    aria-invalid={!!errors.mensagem}
                    placeholder="Descreva sua necessidade e como podemos ajudar..."
                    className={`w-full resize-none rounded-md border bg-slate-50 px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--kairos-orange)] focus:ring-1 focus:ring-[var(--kairos-orange)] ${
                      errors.mensagem
                        ? "border-red-500"
                        : "border-slate-300"
                    }`}
                  />

                  {errors.mensagem && (
                    <p className="mt-1.5 text-sm text-red-600">
                      {errors.mensagem.message}
                    </p>
                  )}
                </div>

                {/* MENSAGENS DE RETORNO */}
                {mensagemSucesso && (
                  <div
                    role="status"
                    className="flex items-center gap-3 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
                  >
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100">
                      ✓
                    </div>

                    <span>{mensagemSucesso}</span>
                  </div>
                )}

                {mensagemErro && (
                  <p
                    role="alert"
                    className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    {mensagemErro}
                  </p>
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
                  <button
                    type="button"
                    className="rounded-md bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
                  >
                    Suporte Técnico
                  </button>

                  <button
                    type="button"
                    className="rounded-md bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
                  >
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

                <button
                  type="button"
                  className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                >
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
  registration: UseFormRegisterReturn;
  error?: string;
  placeholder: string;
  type?: string;
  required?: boolean;
}

function FormField({
  label,
  registration,
  error,
  placeholder,
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
        {...registration}
        type={type}
        required={required}
        aria-invalid={!!error}
        placeholder={placeholder}
        className={`w-full rounded-md border bg-slate-50 px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--kairos-orange)] focus:ring-1 focus:ring-[var(--kairos-orange)] ${
          error ? "border-red-500" : "border-slate-300"
        }`}
      />

      {error && (
        <p className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}


/* CARD DE INFORMAÇÃO */


interface InfoCardProps {
  icon: ReactNode;
  title: string;
  type: "address" | "phone" | "email" | "hours";
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

        <h3 className="font-semibold text-slate-800">{title}</h3>
      </div>

      <div className="text-sm leading-5 text-slate-500">
        {content[type]}
      </div>
    </div>
  );
}
export default ContactPage;