"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Conversation = {
  _id: string;
  visitorId: string;
  name: string;
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

type ConversationFilter = "all" | "open" | "closed" | "unread";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  (process.env.NODE_ENV === "development" ? "http://localhost:3001" : "");

const REFRESH_INTERVAL = 5000;

export default function ChatAdminPage() {
  const router = useRouter();

  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [message, setMessage] = useState("");

  const [conversationFilter, setConversationFilter] =
    useState<ConversationFilter>("all");

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
        // Remove somente o token antigo. O JWT atual não fica no localStorage.
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

  // Sem sessão válida, encaminha para a página de login.
  useEffect(() => {
    if (authChecked && !isAuthenticated) {
      router.replace("/adm/login");
    }
  }, [authChecked, isAuthenticated, router]);

  // Limpa os dados privados do painel.
  const clearAdminData = useCallback(() => {
    requestIdRef.current += 1;
    selectedConversationRef.current = null;

    setConversations([]);
    setSelectedConversation(null);
    setMessages([]);
    setUnreadCounts({});
    setMessage("");

    setConversationFilter("all");
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
        throw new Error("Você não tem permissão para acessar este recurso.");
      }

      return response;
    },
    [clearAdminData],
  );

  // Logout no servidor e limpeza do estado local.
  async function handleLogout() {
    try {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        console.error("O servidor não confirmou o encerramento da sessão.");
      }
    } catch (err) {
      console.error("Erro ao encerrar sessão no servidor:", err);
    } finally {
      setIsAuthenticated(false);
      setError("");
      setAuthChecked(true);
      setLoadingConversations(false);
      clearAdminData();

      router.replace("/adm/login");
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
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );

      setConversations(data);

      // Remove seleções de conversas que não existem mais na resposta.

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
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
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
        void refreshSelectedMessages(selected._id, requestIdRef.current).catch(
          (err) => {
            if (
              err instanceof Error &&
              err.message !== "Sessão inválida ou expirada."
            ) {
              console.error("Erro ao atualizar mensagens:", err);
            }
          },
        );
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
    [authenticatedFetch, refreshSelectedMessages, refreshUnreadCounts],
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

      await refreshSelectedMessages(conversation._id, requestIdRef.current);

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

  // Contadores calculados a partir dos dados existentes.
  const totalUnread = Object.values(unreadCounts).reduce(
    (total, count) => total + count,
    0,
  );

  const openCount = conversations.filter(
    (conversation) => conversation.status === "open",
  ).length;

  const closedCount = conversations.filter(
    (conversation) => conversation.status === "closed",
  ).length;

  const unreadConversationCount = Object.values(unreadCounts).filter(
    (count) => count > 0,
  ).length;

  const filteredConversations = conversations.filter((conversation) => {
    if (conversationFilter === "open") {
      return conversation.status === "open";
    }

    if (conversationFilter === "closed") {
      return conversation.status === "closed";
    }

    if (conversationFilter === "unread") {
      return (unreadCounts[conversation._id] ?? 0) > 0;
    }

    return true;
  });

  // O painel só é renderizado depois da verificação da sessão.
  if (!authChecked || !isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <p className="text-sm text-zinc-400">
          {!authChecked
            ? "Verificando sessão..."
            : "Redirecionando para o login..."}
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black p-3 text-white sm:p-6">
      <div className="mx-auto flex h-[calc(100vh-24px)] max-w-7xl overflow-hidden rounded-xl border border-white/10 bg-zinc-950 sm:h-[calc(100vh-48px)]">
        <aside className="flex w-72 shrink-0 flex-col overflow-hidden border-r border-white/10 sm:w-80">
          <div className="border-b border-white/10 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-xl font-semibold">Kairos Atendimento</h1>
                <p className="mt-1 text-sm text-zinc-400">
                  Central de conversas
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

            {totalUnread > 0 && (
              <p className="mt-3 text-sm font-medium text-[#e04f11]">
                {totalUnread} mensagem(ns) não lida(s)
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 border-b border-white/10 p-3">
            {[
              {
                id: "all",
                label: "Todas",
                count: conversations.length,
              },
              {
                id: "open",
                label: "Abertas",
                count: openCount,
              },
              {
                id: "closed",
                label: "Fechadas",
                count: closedCount,
              },
              {
                id: "unread",
                label: "Não lidas",
                count: unreadConversationCount,
              },
            ].map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() =>
                  setConversationFilter(filter.id as ConversationFilter)
                }
                aria-pressed={conversationFilter === filter.id}
                className={`flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition ${
                  conversationFilter === filter.id
                    ? "bg-[#e04f11]/20 text-white ring-1 ring-[#e04f11]/50"
                    : "bg-white/5 text-zinc-300 hover:bg-white/10"
                }`}
              >
                <span>{filter.label}</span>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">
                  {filter.count}
                </span>
              </button>
            ))}
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto p-3">
            {loadingConversations && (
              <p className="p-3 text-sm text-zinc-400">
                Carregando conversas...
              </p>
            )}

            {!loadingConversations && filteredConversations.length === 0 && (
              <p className="p-3 text-sm text-zinc-400">
                {conversations.length === 0
                  ? "Nenhuma conversa encontrada."
                  : "Nenhuma conversa corresponde a este filtro."}
              </p>
            )}

            {filteredConversations.map((conversation) => {
              const unread = unreadCounts[conversation._id] ?? 0;
              const isSelected = selectedConversation?._id === conversation._id;

              return (
                <div
                  key={conversation._id}
                  className={`rounded-lg border transition ${
                    isSelected
                      ? "border-[#e04f11]/60 bg-[#e04f11]/10"
                      : "border-transparent bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-start gap-2 p-3">
                    <button
                      type="button"
                      onClick={() => void selectConversation(conversation)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="min-w-0 truncate font-medium">
                          {conversation.name || "Cliente"}
                        </p>

                        {unread > 0 && (
                          <span className="flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full bg-[#e04f11] px-2 text-xs font-bold">
                            {unread > 99 ? "99+" : unread}
                          </span>
                        )}
                      </div>

                      <div className="mt-2 flex items-center gap-2">
                        <span
                          className={`inline-block h-2 w-2 rounded-full ${
                            conversation.status === "open"
                              ? "bg-emerald-400"
                              : "bg-zinc-500"
                          }`}
                        />

                        <span className="text-xs text-zinc-400">
                          {conversation.status === "open"
                            ? "Aberta"
                            : "Fechada"}
                        </span>
                      </div>

                      <p className="mt-2 text-xs text-zinc-500">
                        Atualizada às{" "}
                        {new Date(conversation.updatedAt).toLocaleTimeString(
                          "pt-BR",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </p>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between gap-4 border-b border-white/10 p-4 sm:p-5">
            <div className="min-w-0">
              <h2 className="truncate font-semibold">
                {selectedConversation
                  ? selectedConversation.name
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
                className="shrink-0 rounded-lg border border-red-500/40 px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 disabled:opacity-50 sm:px-4"
              >
                {closingConversation ? "Encerrando..." : "Encerrar"}
              </button>
            )}
          </header>

          <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
            {!selectedConversation && (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white/5">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="h-7 w-7 text-zinc-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 10h8M8 14h5m-7 6-3 1 1-4a8 8 0 1 1 3 3Z"
                      />
                    </svg>
                  </div>

                  <p className="text-center text-zinc-500">
                    Selecione uma conversa na coluna esquerda.
                  </p>
                </div>
              </div>
            )}

            {loadingMessages && (
              <p className="text-sm text-zinc-400">Carregando mensagens...</p>
            )}

            {selectedConversation &&
              !loadingMessages &&
              messages.filter(
                (item) => item.conversationId === selectedConversation._id,
              ).length === 0 && (
                <p className="text-sm text-zinc-400">
                  Nenhuma mensagem nesta conversa.
                </p>
              )}

            {!loadingMessages &&
              messages
                .filter(
                  (item) => item.conversationId === selectedConversation?._id,
                )
                .map((item) => (
                  <div
                    key={item._id}
                    className={`flex ${
                      item.sender === "admin" ? "justify-end" : "justify-start"
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
                        {item.sender === "admin"
                          ? "Atendente"
                          : (selectedConversation?.name ?? "Cliente")}
                      </p>

                      <p className="whitespace-pre-wrap break-words text-sm">
                        {item.content}
                      </p>

                      <p className="mt-2 text-right text-xs opacity-60">
                        {new Date(item.createdAt).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
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

          <div className="border-t border-white/10 p-3 sm:p-4">
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
                className="rounded-lg bg-[#e04f11] px-4 py-3 font-medium hover:opacity-90 disabled:opacity-50 sm:px-6"
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
