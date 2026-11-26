
"use client";

import {
  Eye,
  EyeOff,
  LockKeyhole,
  LogIn,
  UserRound,
} from "lucide-react";

type LoginFormProps = {
  username: string;
  password: string;
  showPassword: boolean;
  loginLoading: boolean;
  error: string;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onTogglePassword: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function LoginForm({
  username,
  password,
  showPassword,
  loginLoading,
  error,
  onUsernameChange,
  onPasswordChange,
  onTogglePassword,
  onSubmit,
}: LoginFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Usuário */}
      <div>
        <label
          htmlFor="username"
          className="mb-2 block text-sm font-medium text-zinc-300"
        >
          Usuário
        </label>

        <div className="group flex items-center rounded-xl border border-white/10 bg-black/20 transition-all duration-200 focus-within:border-[#e04f11]/70 focus-within:ring-4 focus-within:ring-[#e04f11]/10">
          <div className="flex pl-4 text-zinc-500 transition-colors group-focus-within:text-[#e04f11]">
            <UserRound size={19} />
          </div>

          <input
            id="username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
            placeholder="Digite seu usuário"
            required
            className="w-full bg-transparent px-3 py-3.5 text-sm text-white outline-none placeholder:text-zinc-600"
          />
        </div>
      </div>

      {/* Senha */}
      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-zinc-300"
        >
          Senha
        </label>

        <div className="group flex items-center rounded-xl border border-white/10 bg-black/20 transition-all duration-200 focus-within:border-[#e04f11]/70 focus-within:ring-4 focus-within:ring-[#e04f11]/10">
          <div className="flex pl-4 text-zinc-500 transition-colors group-focus-within:text-[#e04f11]">
            <LockKeyhole size={19} />
          </div>

          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder="Digite sua senha"
            required
            className="w-full min-w-0 bg-transparent px-3 py-3.5 text-sm text-white outline-none placeholder:text-zinc-600"
          />

          <button
            type="button"
            onClick={onTogglePassword}
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            className="mr-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-white/5 hover:text-white"
          >
            {showPassword ? (
              <EyeOff size={19} />
            ) : (
              <Eye size={19} />
            )}
          </button>
        </div>
      </div>

      {/* Mensagem de erro */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.08] px-4 py-3.5 text-sm text-red-300"
        >
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-red-400/50 text-xs font-bold">
            !
          </span>

          <p className="leading-5">{error}</p>
        </div>
      )}

      {/* Botão de entrar */}
      <button
        type="submit"
        disabled={loginLoading}
        className="group flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#f15a24] to-[#d94309] px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#e04f11]/15 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#e04f11]/25 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {loginLoading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Entrando...
          </>
        ) : (
          <>
            <LogIn size={18} />
            Entrar no painel
          </>
        )}
      </button>
    </form>
  );
}
