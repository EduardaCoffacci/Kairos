"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";

import LoginLoading from "@/componentes/adm/login/LoginLoading";
import LoginForm from "@/componentes/adm/login/LoginForm";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3001"
    : "");

export default function AdminLoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState("");

  // Verifica se o administrador já está autenticado.
  useEffect(() => {
    async function checkSession() {
      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          credentials: "include",
        });

        if (response.ok) {
          router.replace("/adm/chat");
        }
      } catch {
        // Permite tentar entrar se não conseguir verificar a sessão.
      } finally {
        setCheckingSession(false);
      }
    }

    checkSession();
  }, [router]);

  // Realiza o login.
  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setLoginLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        setError("Usuário ou senha inválidos.");
        return;
      }

      router.replace("/adm/chat");
    } catch {
      setError(
        "Não foi possível conectar ao servidor. Tente novamente.",
      );
    } finally {
      setLoginLoading(false);
    }
  }

  // Exibe o componente de carregamento.
  if (checkingSession) {
    return <LoginLoading />;
  }

  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-[#08090b] px-4 py-10 text-white sm:px-6">
      {/* Efeitos de fundo */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-[#e04f11]/15 blur-[120px]" />

      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[420px] w-[420px] rounded-full bg-[#e04f11]/10 blur-[120px]" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#08090b_75%)]" />

      {/* Detalhes decorativos */}
      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full border border-[#e04f11]/10" />

      <div className="pointer-events-none absolute -left-12 top-32 h-48 w-48 rounded-full border border-[#e04f11]/10" />

      <div className="pointer-events-none absolute -bottom-24 -right-20 h-80 w-80 rounded-full border border-[#e04f11]/10" />

      {/* Cartão de login */}
      <section className="relative w-full max-w-md">
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.09] bg-zinc-900/80 p-7 shadow-[0_25px_100px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:p-9">
          {/* Linha superior */}
          <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#e04f11] to-transparent" />

          {/* Cabeçalho */}
          <header className="mb-8 text-center">
            <div className="mx-auto mb-6 flex h-[68px] w-[68px] items-center justify-center rounded-2xl bg-gradient-to-br from-[#f15a24] to-[#c83d08] shadow-lg shadow-[#e04f11]/20">
              <span className="text-4xl font-black tracking-tight text-white">
                K
              </span>
            </div>

            <div className="mb-4 flex justify-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#e04f11]/20 bg-[#e04f11]/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-orange-400">
                <ShieldCheck size={12} />
                Área restrita
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight">
              Kairos{" "}
              <span className="text-[#e04f11]">Atendimento</span>
            </h1>

            <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-zinc-400">
              Entre com suas credenciais para acessar o painel administrativo.
            </p>
          </header>

          {/* Componente do formulário */}
          <LoginForm
            username={username}
            password={password}
            showPassword={showPassword}
            loginLoading={loginLoading}
            error={error}
            onUsernameChange={setUsername}
            onPasswordChange={setPassword}
            onTogglePassword={() =>
              setShowPassword((previous) => !previous)
            }
            onSubmit={handleLogin}
          />

          {/* Indicador de segurança */}
          <div className="mt-7 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/[0.08]" />

            <span className="flex items-center gap-2 text-[11px] text-zinc-500">
              <ShieldCheck size={14} className="text-[#e04f11]" />
              Acesso protegido
            </span>

            <div className="h-px flex-1 bg-white/[0.08]" />
          </div>
        </div>

        {/* Rodapé */}
        <footer className="mt-6 text-center">
          <p className="text-xs text-zinc-600">
            Kairos Industrial
            <span className="mx-2 text-zinc-700">•</span>
            Painel administrativo
          </p>

          <p className="mt-2 text-[10px] tracking-wide text-zinc-700">
            © {new Date().getFullYear()} Todos os direitos reservados.
          </p>
        </footer>
      </section>
    </main>
  );
}