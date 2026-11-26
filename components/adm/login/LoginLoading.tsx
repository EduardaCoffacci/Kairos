
export default function LoginLoading() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#08090b] px-4 text-white">
      {/* Efeitos de fundo */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#e04f11]/15 blur-[100px]" />

      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#e04f11]/10 blur-[100px]" />

      {/* Conteúdo do carregamento */}
      <div className="relative flex flex-col items-center gap-5">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f15a24] to-[#c83d08] shadow-lg shadow-[#e04f11]/20">
          <span className="text-3xl font-black text-white">K</span>
        </div>

        <div className="text-center">
          <h1 className="text-xl font-semibold tracking-wide">
            Kairos Atendimento
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Verificando sua sessão...
          </p>
        </div>

        <div className="h-1 w-40 overflow-hidden rounded-full bg-zinc-800">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-[#e04f11]" />
        </div>
      </div>
    </main>
  );
}
