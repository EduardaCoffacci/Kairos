
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Conversation = {
  _id: string;
  visitorId: string;
  status: "open" | "closed";
  createdAt: string;
  updatedAt: string;
};

type Message = {
  _id: string;
  conversationId: string;
  sender: "visitor" | "admin";
  content: string;
  createdAt: string;
};

type UnreadCount = {
  conversationId: string;
  count: number;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  (process.env.NODE_ENV === "development" ? "http://localhost:3001" : "");

const REFRESH_INTERVAL = 5000;

export default function ChatAdminPage() {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [message, setMessage] = useState("");

  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [closingConversation, setClosingConversation] = useState(false);
  const [error, setError] = useState("");

  const selectedConversationRef = useRef<Conversation | null>(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    selectedConversationRef.current = selectedConversation;
  }, [selectedConversation]);

  // Verifica a sessão usando o cookie HttpOnly.
  useEffect(() => {
    let cancelled = false;

    async function checkSession() {
      try {
        // Remove somente o token antigo. O novo JWT não fica no navegador.
        window.localStorage.removeItem("kairos_admin_token");

        const response = await fetch(`${API_URL}/auth/me`, {
          method: "GET",
          credentials: "include",
        });

        if (!cancelled) {
          setIsAuthenticated(response.ok);
        }
      } catch {
        if (!cancelled) {
          setIsAuthenticated(false);
        }
      } finally {
        if (!cancelled) {
          setAuthChecked(true);
          setLoadingConversations(false);
        }
      }
    }

    void checkSession();

    return () => {
      cancelled = true;
    };
  }, []);

  // Limpa os dados privados do painel.
  const clearAdminData = useCallback(() => {
    requestIdRef.current += 1;
    selectedConversationRef.current = null;

    setConversations([]);
    setSelectedConversation(null);
    setMessages([]);
    setUnreadCounts({});
    setMessage("");
    setLoadingMessages(false);
    setSending(false);
    setClosingConversation(false);
  }, []);

  // Todas as requisições administrativas usam o cookie automaticamente.
  const authenticatedFetch = useCallback(
    async (path: string, options: RequestInit = {}) => {
      const headers = new Headers(options.headers);

      if (options.body && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }

      const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers,
        credentials: "include",
      });

      if (response.status === 401) {
        setIsAuthenticated(false);
        setError("Sua sessão expirou. Entre novamente.");
        clearAdminData();

        throw new Error("Sessão inválida ou expirada.");
      }

      if (response.status === 403) {
        throw new Error(
          "Você não tem permissão para acessar este recurso.",
        );
      }

      return response;
    },
    [clearAdminData],
  );

  // Login: o servidor define o cookie HttpOnly.
  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoginLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error(
          response.status === 401
            ? "Usuário ou senha inválidos."
            : "Não foi possível entrar. Tente novamente.",
        );
      }

      // Confirma que o cookie foi recebido e que a sessão é válida.
      const sessionResponse = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        credentials: "include",
      });

      if (!sessionResponse.ok) {
        throw new Error(
          "Login recebido, mas não foi possível validar a sessão. Verifique a configuração dos cookies.",
        );
      }

      setIsAuthenticated(true);
      setPassword("");
      setError("");
      setLoadingConversations(true);
    } catch (err) {
      setIsAuthenticated(false);
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao realizar login.",
      );
    } finally {
      setLoginLoading(false);
    }
  }

  // Logout no servidor e limpeza do estado local.
  async function handleLogout() {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Erro ao encerrar sessão no servidor:", err);
    } finally {
      setIsAuthenticated(false);
      setPassword("");
      setError("");
      setAuthChecked(true);
      setLoadingConversations(false);
      clearAdminData();
    }
  }

  const refreshUnreadCounts = useCallback(async () => {
    try {
      const response = await authenticatedFetch("/chat/unread-counts");

      if (!response.ok) {
        throw new Error("Não foi possível consultar as mensagens não lidas.");
      }

      const data: UnreadCount[] = await response.json();
      const counts: Record<string, number> = {};

      for (const item of data) {
        if (item.count > 0) {
          counts[item.conversationId] = item.count;
        }
      }

      setUnreadCounts(counts);
    } catch (err) {
      if (
        err instanceof Error &&
        err.message !== "Sessão inválida ou expirada."
      ) {
        console.error("Erro ao atualizar contadores:", err);
      }
    }
  }, [authenticatedFetch]);

  const refreshConversations = useCallback(async () => {
    try {
      const response = await authenticatedFetch("/chat/conversations");

      if (!response.ok) {
        throw new Error("Não foi possível carregar as conversas.");
      }

      const data: Conversation[] = await response.json();

      data.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() -
          new Date(a.updatedAt).getTime(),
      );

      setConversations(data);

      const selected = selectedConversationRef.current;

      if (selected) {
        const updated = data.find((item) => item._id === selected._id);

        if (updated) {
          selectedConversationRef.current = updated;
          setSelectedConversation(updated);
        } else {
          selectedConversationRef.current = null;
          setSelectedConversation(null);
          setMessages([]);
        }
      }

      setError("");
    } catch (err) {
      if (
        err instanceof Error &&
        err.message !== "Sessão inválida ou expirada."
      ) {
        console.error("Erro ao atualizar conversas:", err);
        setError((current) => current || err.message);
      }
    } finally {
      setLoadingConversations(false);
    }
  }, [authenticatedFetch]);

  // Carrega o histórico da conversa selecionada.
  const refreshSelectedMessages = useCallback(
    async (conversationId: string, requestId: number) => {
      const response = await authenticatedFetch(
        `/chat/admin/conversations/${conversationId}/messages`,
      );

      if (!response.ok) {
        throw new Error("Não foi possível carregar as mensagens.");
      }

      const data: Message[] = await response.json();

      if (
        requestId !== requestIdRef.current ||
        selectedConversationRef.current?._id !== conversationId
      ) {
        return;
      }

      setMessages((current) => {
        const byId = new Map<string, Message>();

        for (const item of current) {
          if (item.conversationId === conversationId) {
            byId.set(item._id, item);
          }
        }

        for (const item of data) {
          byId.set(item._id, item);
        }

        return [...byId.values()].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() -
            new Date(b.createdAt).getTime(),
        );
      });
    },
    [authenticatedFetch],
  );

  // Atualiza os dados periodicamente somente com sessão autenticada.
  useEffect(() => {
    if (!authChecked || !isAuthenticated) return;

    void refreshConversations();
    void refreshUnreadCounts();

    const interval = window.setInterval(() => {
      void refreshConversations();
      void refreshUnreadCounts();

      const selected = selectedConversationRef.current;

      if (selected) {
        void refreshSelectedMessages(
          selected._id,
          requestIdRef.current,
        ).catch((err) => {
          if (
            err instanceof Error &&
            err.message !== "Sessão inválida ou expirada."
          ) {
            console.error("Erro ao atualizar mensagens:", err);
          }
        });
      }
    }, REFRESH_INTERVAL);

    return () => window.clearInterval(interval);
  }, [
    authChecked,
    isAuthenticated,
    refreshConversations,
    refreshUnreadCounts,
    refreshSelectedMessages,
  ]);

  const selectConversation = useCallback(
    async (conversation: Conversation) => {
      const requestId = ++requestIdRef.current;

      selectedConversationRef.current = conversation;
      setSelectedConversation(conversation);
      setMessages([]);
      setMessage("");
      setLoadingMessages(true);
      setError("");

      try {
        await refreshSelectedMessages(conversation._id, requestId);

        const response = await authenticatedFetch(
          `/chat/conversations/${conversation._id}/read`,
          { method: "PATCH" },
        );

        if (!response.ok) {
          throw new Error("Não foi possível registrar a leitura.");
        }

        await refreshUnreadCounts();
      } catch (err) {
        if (requestId !== requestIdRef.current) return;

        if (
          err instanceof Error &&
          err.message !== "Sessão inválida ou expirada."
        ) {
          console.error("Erro ao abrir conversa:", err);
          setError(err.message);
        }
      } finally {
        if (requestId === requestIdRef.current) {
          setLoadingMessages(false);
        }
      }
    },
    [
      authenticatedFetch,
      refreshSelectedMessages,
      refreshUnreadCounts,
    ],
  );

  // Envia mensagens do administrador pela rota HTTP autenticada.
  async function sendMessage() {
    const content = message.trim();
    const conversation = selectedConversation;

    if (
      !content ||
      !conversation ||
      conversation.status !== "open" ||
      sending ||
      closingConversation
    ) {
      return;
    }

    setSending(true);
    setError("");

    try {
      const response = await authenticatedFetch("/chat/admin/messages", {
        method: "POST",
        body: JSON.stringify({
          conversationId: conversation._id,
          content,
        }),
      });

      if (!response.ok) {
        throw new Error("Não foi possível enviar a mensagem.");
      }

      setMessage("");

      await refreshSelectedMessages(
        conversation._id,
        requestIdRef.current,
      );

      await refreshConversations();
    } catch (err) {
      if (
        err instanceof Error &&
        err.message !== "Sessão inválida ou expirada."
      ) {
        console.error("Erro ao enviar mensagem:", err);
        setError(err.message);
      }
    } finally {
      setSending(false);
    }
  }

  async function closeConversation() {
    const conversation = selectedConversation;

    if (
      !conversation ||
      conversation.status !== "open" ||
      closingConversation ||
      sending
    ) {
      return;
    }

    if (!window.confirm("Tem certeza de que deseja encerrar esta conversa?")) {
      return;
    }

    setClosingConversation(true);
    setError("");

    try {
      const response = await authenticatedFetch(
        `/chat/conversations/${conversation._id}/close`,
        { method: "PATCH" },
      );

      if (!response.ok) {
        throw new Error("Não foi possível encerrar a conversa.");
      }

      await refreshConversations();
      setMessage("");
    } catch (err) {
      if (
        err instanceof Error &&
        err.message !== "Sessão inválida ou expirada."
      ) {
        console.error("Erro ao encerrar conversa:", err);
        setError(err.message);
      }
    } finally {
      setClosingConversation(false);
    }
  }

  const totalUnread = Object.values(unreadCounts).reduce(
    (total, count) => total + count,
    0,
  );

  if (!authChecked) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        Verificando sessão...
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black p-6 text-white">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md space-y-5 rounded-xl border border-white/10 bg-zinc-950 p-8"
        >
          <div>
            <h1 className="text-2xl font-semibold">Kairos Atendimento</h1>
            <p className="mt-2 text-sm text-zinc-400">
              Entre com sua conta administrativa.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="username" className="text-sm text-zinc-300">
              Usuário
            </label>
            <input
              id="username"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
              className="w-full rounded-lg border border-white/10 bg-zinc-900 px-4 py-3 outline-none focus:border-[#e04f11]"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm text-zinc-300">
              Senha
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="w-full rounded-lg border border-white/10 bg-zinc-900 px-4 py-3 outline-none focus:border-[#e04f11]"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loginLoading}
            className="w-full rounded-lg bg-[#e04f11] px-4 py-3 font-medium hover:opacity-90 disabled:opacity-50"
          >
            {loginLoading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto flex h-[calc(100vh-48px)] max-w-7xl overflow-hidden rounded-xl border border-white/10 bg-zinc-950">
        <aside className="w-80 shrink-0 overflow-y-auto border-r border-white/10">
          <div className="border-b border-white/10 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-xl font-semibold">Kairos Atendimento</h1>
                <p className="mt-1 text-sm text-zinc-400">
                  Conversas ({conversations.length})
                </p>
              </div>

              <button
                type="button"
                onClick={() => void handleLogout()}
                className="rounded-md border border-white/10 px-3 py-1.5 text-xs text-zinc-300 hover:bg-white/10"
              >
                Sair
              </button>
            </div>

            <p className="mt-2 text-xs text-zinc-500">
              Atualização a cada 5 segundos
            </p>

            {totalUnread > 0 && (
              <p className="mt-2 text-sm font-medium text-[#e04f11]">
                {totalUnread} mensagem(ns) não lida(s)
              </p>
            )}
          </div>

          <div className="space-y-2 p-3">
            {loadingConversations && (
              <p className="p-3 text-sm text-zinc-400">
                Carregando conversas...
              </p>
            )}

            {!loadingConversations && conversations.length === 0 && (
              <p className="p-3 text-sm text-zinc-400">
                Nenhuma conversa encontrada.
              </p>
            )}

            {conversations.map((conversation) => {
              const unread = unreadCounts[conversation._id] ?? 0;
              const isSelected =
                selectedConversation?._id === conversation._id;

              return (
                <button
                  key={conversation._id}
                  type="button"
                  onClick={() => void selectConversation(conversation)}
                  className={`w-full rounded-lg p-4 text-left transition ${
                    isSelected
                      ? "bg-[#e04f11]/20 ring-1 ring-[#e04f11]/50"
                      : "bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="min-w-0 truncate font-medium">
                      {conversation.visitorId}
                    </p>

                    {unread > 0 && (
                      <span className="flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full bg-[#e04f11] px-2 text-xs font-bold">
                        {unread > 99 ? "99+" : unread}
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-zinc-400">
                    {conversation.status === "open"
                      ? "Conversa aberta"
                      : "Conversa encerrada"}
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    Atualizada às{" "}
                    {new Date(conversation.updatedAt).toLocaleTimeString(
                      "pt-BR",
                      { hour: "2-digit", minute: "2-digit" },
                    )}
                  </p>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between gap-4 border-b border-white/10 p-5">
            <div className="min-w-0">
              <h2 className="truncate font-semibold">
                {selectedConversation
                  ? selectedConversation.visitorId
                  : "Painel de atendimento"}
              </h2>

              <p className="text-sm text-zinc-400">
                {selectedConversation
                  ? selectedConversation.status === "open"
                    ? "Conversa aberta"
                    : "Conversa encerrada"
                  : "Selecione uma conversa para visualizar o histórico."}
              </p>
            </div>

            {selectedConversation?.status === "open" && (
              <button
                type="button"
                onClick={() => void closeConversation()}
                disabled={closingConversation || sending}
                className="shrink-0 rounded-lg border border-red-500/40 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 disabled:opacity-50"
              >
                {closingConversation ? "Encerrando..." : "Encerrar conversa"}
              </button>
            )}
          </header>

          <div className="flex-1 space-y-4 overflow-y-auto p-6">
            {!selectedConversation && (
              <div className="flex h-full items-center justify-center">
                <p className="text-center text-zinc-500">
                  Selecione uma conversa na coluna esquerda.
                </p>
              </div>
            )}

            {loadingMessages && (
              <p className="text-sm text-zinc-400">
                Carregando mensagens...
              </p>
            )}

            {selectedConversation &&
              !loadingMessages &&
              messages.filter(
                (item) =>
                  item.conversationId === selectedConversation._id,
              ).length === 0 && (
                <p className="text-sm text-zinc-400">
                  Nenhuma mensagem nesta conversa.
                </p>
              )}

            {!loadingMessages &&
              messages
                .filter(
                  (item) =>
                    item.conversationId === selectedConversation?._id,
                )
                .map((item) => (
                  <div
                    key={item._id}
                    className={`flex ${
                      item.sender === "admin"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-md rounded-xl px-4 py-3 ${
                        item.sender === "admin"
                          ? "bg-[#e04f11] text-white"
                          : "bg-zinc-800 text-white"
                      }`}
                    >
                      <p className="mb-1 text-xs opacity-70">
                        {item.sender === "admin" ? "Atendente" : "Visitante"}
                      </p>

                      <p className="whitespace-pre-wrap break-words text-sm">
                        {item.content}
                      </p>

                      <p className="mt-2 text-right text-xs opacity-60">
                        {new Date(item.createdAt).toLocaleTimeString(
                          "pt-BR",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </p>
                    </div>
                  </div>
                ))}
          </div>

          {error && (
            <p
              role="alert"
              className="border-t border-red-500/20 px-4 py-2 text-sm text-red-400"
            >
              {error}
            </p>
          )}

          {selectedConversation?.status === "closed" && (
            <div className="border-t border-white/10 bg-zinc-900/60 px-4 py-3 text-center">
              <p className="text-sm text-zinc-400">
                Esta conversa foi encerrada. O envio de mensagens está
                desabilitado.
              </p>
            </div>
          )}

          <div className="border-t border-white/10 p-4">
            <form
              className="flex gap-3"
              onSubmit={(event) => {
                event.preventDefault();
                void sendMessage();
              }}
            >
              <input
                type="text"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder={
                  !selectedConversation
                    ? "Selecione uma conversa primeiro"
                    : selectedConversation.status === "closed"
                      ? "Esta conversa foi encerrada"
                      : "Digite sua mensagem..."
                }
                disabled={
                  !selectedConversation ||
                  selectedConversation.status !== "open" ||
                  sending ||
                  closingConversation
                }
                className="min-w-0 flex-1 rounded-lg border border-white/10 bg-zinc-900 px-4 py-3 outline-none placeholder:text-zinc-500 focus:border-[#e04f11] disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={
                  !message.trim() ||
                  !selectedConversation ||
                  selectedConversation.status !== "open" ||
                  sending ||
                  closingConversation
                }
                className="rounded-lg bg-[#e04f11] px-6 py-3 font-medium hover:opacity-90 disabled:opacity-50"
              >
                {sending ? "Enviando..." : "Enviar"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
